## === modules/ecr/variables.tf ===

variable "repo_name" {
  description = "Name of the ECR repository"
  type        = string
}

variable "tags" {
  description = "Tags to apply to ECR resources"
  type        = map(string)
}

variable "prefix" {
  description = "Prefix for resource names"
  type        = string  
}