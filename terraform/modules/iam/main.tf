## === modules/iam/main.tf ===

# Execution Role for ECS Tasks (needed to pull images, send logs, etc.)
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.prefix}ECS_EXECUTION_ROLE"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "cloudwatch_logs" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

# ECS Task Role (for application-level permissions)
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.prefix}ECS_TASK_ROLE"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
  tags = var.tags
}

# Custom policy for Secrets Manager access
resource "aws_iam_policy" "secrets_manager_policy" {
  name        = "${var.prefix}SecretsManagerPolicy"
  description = "Policy for accessing Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:*:*:secret:${var.prefix}*"
      }
    ]
  })

  tags = var.tags
}

# Custom policy for S3 access
resource "aws_iam_policy" "s3_access_policy" {
  name        = "${var.prefix}S3AccessPolicy"
  description = "Policy for accessing S3 buckets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::*${var.prefix}*",
          "arn:aws:s3:::*${var.prefix}*/*"
        ]
      }
    ]
  })

  tags = var.tags
}

# Attach policies to task role
resource "aws_iam_role_policy_attachment" "secrets_manager" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.secrets_manager_policy.arn
}

resource "aws_iam_role_policy_attachment" "s3_access" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}

# Also attach to execution role for backwards compatibility
resource "aws_iam_role_policy_attachment" "execution_secrets_manager" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = aws_iam_policy.secrets_manager_policy.arn
}

resource "aws_iam_role_policy_attachment" "execution_s3_access" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}
