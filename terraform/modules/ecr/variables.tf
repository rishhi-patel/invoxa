variable "services" {
  description = "List of microservice names to create ECR repos for"
  type        = list(string)
}
