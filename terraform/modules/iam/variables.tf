## === modules/iam/variables.tf ===

variable "prefix" {
  description = "Resource name prefix"
  type        = string
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
}
