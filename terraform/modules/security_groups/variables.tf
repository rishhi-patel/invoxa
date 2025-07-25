variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "prefix" {
  description = "Resource name prefix"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
}
