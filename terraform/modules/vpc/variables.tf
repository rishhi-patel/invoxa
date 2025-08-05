variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "project_name" {
  description = "Project name for tagging resources"
  type        = string
  default     = "microservices-app"
}
