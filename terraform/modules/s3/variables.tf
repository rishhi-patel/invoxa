## === modules/s3/variables.tf ===

variable "prefix" {
  description = "Resource name prefix"
  type        = string
}

variable "tags" {
  description = "Common tags for resources"
  type        = map(string)
}