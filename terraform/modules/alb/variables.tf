variable "vpc_id" {
  description = "VPC ID for ALB"
  type        = string
}

variable "public_subnets" {
  description = "List of public subnets for ALB"
  type        = list(string)
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "microservices-app"
}
