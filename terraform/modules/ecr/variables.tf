## === modules/ecr/variables.tf ===

variable "tags" {
  description = "Tags to apply to ECR resources"
  type        = map(string)
}

variable "prefix" {
  description = "Prefix for resource names"
  type        = string
}