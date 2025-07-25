## === modules/alb/variables.tf ===

variable "prefix" {
  description = "Name prefix"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
}

variable "alb_sg_id" {
  description = "Security group ID for ALB"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for ALB"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}