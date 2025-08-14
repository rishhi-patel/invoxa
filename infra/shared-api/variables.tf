variable "project" {
  description = "Project name (e.g., invoxa)"
  type        = string
}

variable "env" {
  description = "Environment (e.g., dev, prod)"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "architecture" {
  description = "Lambda architecture: x86_64 or arm64"
  type        = string
  default     = "x86_64"
}

variable "lambda_memory_mb" {
  description = "Lambda memory per function"
  type        = number
  default     = 512
}

variable "lambda_timeout_seconds" {
  description = "Lambda timeout per function"
  type        = number
  default     = 15
}

variable "log_retention_days" {
  description = "Retention for Lambda CloudWatch Logs groups"
  type        = number
  default     = 14
}

variable "create_lambdas" {
  description = "Whether to create/update Lambda functions and API integrations in this apply"
  type        = bool
  default     = false
}

variable "manage_roles" {
  description = "Whether this module should create/manage IAM roles. If false, existing roles named <project>-<env>-<service>-role-v1 are used."
  type        = bool
  default     = true
}
