variable "project" { type = string }
variable "env" { type = string }
variable "region" { type = string }

variable "image_uri" {
  description = "ECR image URI (with tag or digest) for Lambda"
  type        = string
}

variable "lambda_env" {
  type    = map(string)
  default = {}
}
