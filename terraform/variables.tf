variable "aws_region" {
  description = "AWS region to deploy the infrastructure"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project to prefix resources"
  default     = "microservices-app"
}

variable "account_id" {
  description = "The AWS account ID"
  type        = string
}

variable "services" {
  description = "Map of microservices and their configuration"
  type = map(object({
    port     = number
    cpu      = number
    memory   = number
    path     = string
    priority = number
  }))

  default = {
    "auth-service"         = { port = 3000, cpu = 256, memory = 512, path = "/auth/*", priority = 1 }
    "client-service"       = { port = 3001, cpu = 256, memory = 512, path = "/client/*", priority = 2 }
    "invoice-service"      = { port = 3002, cpu = 256, memory = 512, path = "/invoice/*", priority = 3 }
    "notification-service" = { port = 5000, cpu = 256, memory = 512, path = "/notify/*", priority = 4 }
    "payment-service"      = { port = 5001, cpu = 256, memory = 512, path = "/payment/*", priority = 5 }
  }
}
