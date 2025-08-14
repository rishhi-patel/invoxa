variable "project" {
  description = "Project name (e.g., invoxa)"
  type        = string
}

variable "env" {
  description = "Environment (e.g., dev, prod)"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "architecture" {
  description = "Lambda architecture: x86_64 or arm64"
  type        = string
  default     = "x86_64"
}

variable "lambda_memory_mb" {
  description = "Lambda memory per function"
  type        = number
  default     = 512
}

variable "lambda_timeout_seconds" {
  description = "Lambda timeout per function"
  type        = number
  default     = 15
}

variable "image_uris" {
  description = <<EOF
Map of service => image URI (ECR), one per microservice.
Keys should match path base under /api/<service>
e.g. {
  auth     = "8577....amazonaws.com/invoxa-dev-auth@sha256:..."
  client   = "8577....amazonaws.com/invoxa-dev-client@sha256:..."
  invoice  = "..."
  payment  = "..."
  insights = "..."
}
EOF
  type        = map(string)
}

variable "lambda_envs" {
  description = "Per-service environment variables. Map<service, map<string,string>>"
  type        = map(map(string))
  default     = {}
}

# Jenkins will write repo@sha256 digests here right before apply
variable "service_images" {
  description = "Map: service key -> ECR image URI with digest (e.g., ...@sha256:...)"
  type        = map(string)
  default     = {}
}

