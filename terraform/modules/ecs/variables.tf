## === modules/ecs/variables.tf ===

variable "prefix" {
  description = "Resource name prefix"
  type        = string
}

variable "tags" {
  description = "Common tags for resources"
  type        = map(string)
}

variable "vpc_id" {
  description = "VPC ID where ECS tasks will run"
  type        = string
  default     = ""
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ECS tasks"
  type        = list(string)
  default     = []
}

variable "ecs_sg_id" {
  description = "Security group ID for ECS tasks"
  type        = string
  default     = ""
}

variable "aws_region" {
  description = "AWS region for CloudWatch logs"
  type        = string
  default     = "us-east-1"
}

variable "target_group_arn" {
  description = "Target group ARN for load balancer"
  type        = string
  default     = ""
}

variable "ecs_task_execution_role_arn" {
  description = "ECS task execution role ARN"
  type        = string
  default     = ""
}

variable "ecr_repository_url" {
  description = "ECR repository URL for container images"
  type        = string
  default     = ""
}