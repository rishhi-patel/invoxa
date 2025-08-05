variable "services" {
  description = "Map of services with port, cpu, memory, path, and priority"
  type = map(object({
    port     = number
    cpu      = number
    memory   = number
    path     = string
    priority = number
  }))
}

variable "vpc_id" {
  description = "VPC ID for ECS services"
  type        = string
}

variable "subnets" {
  description = "Subnets for ECS tasks"
  type        = list(string)
}

variable "cluster_id" {
  description = "ECS cluster ID"
  type        = string
}

variable "alb_listener_arn" {
  description = "ALB HTTP listener ARN"
  type        = string
}

variable "alb_sg_id" {
  description = "ALB security group ID"
  type        = string
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "microservices-app"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "account_id" {
  description = "AWS Account ID for ECR image references"
  type        = string
}
