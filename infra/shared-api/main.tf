terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

locals {
  name_prefix = "${var.project}-${var.env}"
}

# -------- Fetch service configs from SSM Parameter Store --------
# Expect parameters under:
#   /<env>/image_uris/<service> -> string image URI
#   /<env>/lambda_envs/<service> -> JSON object of env vars
data "aws_ssm_parameters_by_path" "image_uris" {
  path            = "/${var.env}/image_uris/"
  recursive       = false
  with_decryption = false
}

data "aws_ssm_parameters_by_path" "lambda_envs" {
  path            = "/${var.env}/lambda_envs/"
  recursive       = false
  with_decryption = true
}

locals {
  # Extract the last path segment as the service key, lowercased (e.g., '/dev/image_uris/client' -> 'client')
  image_service_names = [
    for full_name in data.aws_ssm_parameters_by_path.image_uris.names :
    lower(element(split("/", full_name), length(split("/", full_name)) - 1))
  ]

  services = local.image_service_names

  # Map<service, image_uri> using last segment as key
  image_uris = {
    for full_name, value in zipmap(data.aws_ssm_parameters_by_path.image_uris.names, data.aws_ssm_parameters_by_path.image_uris.values) :
    lower(element(split("/", full_name), length(split("/", full_name)) - 1)) => value
  }

  # Map<service, raw JSON string of env vars> keyed by last segment
  lambda_envs_raw = {
    for full_name, value in zipmap(data.aws_ssm_parameters_by_path.lambda_envs.names, data.aws_ssm_parameters_by_path.lambda_envs.values) :
    lower(element(split("/", full_name), length(split("/", full_name)) - 1)) => value
  }
  lambda_envs = { for k, v in local.lambda_envs_raw : k => try(jsondecode(nonsensitive(v)), {}) }
}

# -------- Shared HTTP API (one for all services) --------
resource "aws_apigatewayv2_api" "http" {
  name          = "${local.name_prefix}-http"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true
}

# -------- Per-service Lambda + integration + route --------
# IAM assume policy (shared doc)
data "aws_iam_policy_document" "assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# Create one Lambda role per service
resource "aws_iam_role" "lambda" {
  for_each           = var.manage_roles ? { for s in local.services : s => true } : {}
  name               = "${local.name_prefix}-${each.key}-role-v1"
  assume_role_policy = data.aws_iam_policy_document.assume.json
}

resource "aws_iam_role_policy_attachment" "basic" {
  for_each   = aws_iam_role.lambda
  role       = each.value.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Additional explicit CloudWatch Logs permissions (optional but explicit)
data "aws_iam_policy_document" "cwlogs" {
  statement {
    sid     = "CreateLogGroup"
    actions = ["logs:CreateLogGroup"]
    resources = ["*"]
  }

  statement {
    sid     = "WriteLogs"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "cwlogs" {
  name   = "${local.name_prefix}-cwlogs"
  policy = data.aws_iam_policy_document.cwlogs.json
}

resource "aws_iam_role_policy_attachment" "cwlogs_attach" {
  for_each   = aws_iam_role.lambda
  role       = each.value.name
  policy_arn = aws_iam_policy.cwlogs.arn
}

# If not managing roles, look up existing ones by name
data "aws_iam_role" "existing" {
  for_each = var.manage_roles ? {} : { for s in local.services : s => true }
  name     = "${local.name_prefix}-${each.key}-role-v1"
}

locals {
  role_arn = var.manage_roles ? {
    for k, v in aws_iam_role.lambda : k => v.arn
  } : {
    for k, v in data.aws_iam_role.existing : k => v.arn
  }
}

# Lambda (container) per service
resource "aws_lambda_function" "svc" {
  for_each = var.create_lambdas ? nonsensitive(local.image_uris) : tomap({})

  function_name = "${local.name_prefix}-${each.key}"
  role          = local.role_arn[each.key]
  package_type  = "Image"
  image_uri     = each.value

  timeout       = var.lambda_timeout_seconds
  memory_size   = var.lambda_memory_mb
  architectures = [var.architecture] # "x86_64" or "arm64"


  environment {
  variables = lookup(local.lambda_envs, each.key, {})
  }
}

# Ensure log groups exist with retention
resource "aws_cloudwatch_log_group" "svc" {
  for_each         = aws_lambda_function.svc
  name             = "/aws/lambda/${each.value.function_name}"
  retention_in_days = var.log_retention_days
}

# API → Lambda proxy integration per service
resource "aws_apigatewayv2_integration" "svc" {
  for_each               = aws_lambda_function.svc
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = each.value.arn
  payload_format_version = "2.0"
  timeout_milliseconds   = var.lambda_timeout_seconds * 1000
}

# Route per service: ANY /api/<service>/{proxy+}
resource "aws_apigatewayv2_route" "svc" {
  for_each  = aws_apigatewayv2_integration.svc
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "ANY /api/${each.key}/{proxy+}"
  target    = "integrations/${each.value.id}"
}

# Permission so API Gateway can invoke each Lambda
resource "aws_lambda_permission" "svc_apigw" {
  for_each      = aws_lambda_function.svc
  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*/api/${each.key}/*"
}
