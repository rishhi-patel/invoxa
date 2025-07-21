# modules/vpc/variables.tf
variable "environment" {
  description = "Environment (dev/prod)"
  type        = string
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be either 'dev' or 'prod'"
  }
}

variable "region_code" {
  description = "AWS region code (e.g., usnv for us-east-1)"
  type        = string
}

variable "cidr_block" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "List of private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["a", "b"]
}

locals {
  name_prefix = "vpc-${var.environment}-${var.region_code}-ivx"
  tags = {
    ENV      = upper(var.environment)
    PROJECT  = "INVOXA"
    OWNER    = "DEVOPS"
    TIER     = "NETWORK"
  }
}