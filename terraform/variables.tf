## === root/variables.tf ===

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "S3 bucket name for Terraform state"
  type        = string
}

variable "lock_table_name" {
  description = "DynamoDB table name for Terraform state locking"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

variable "azs" {
  description = "Availability zones"
  type        = list(string)
}

variable "prefix" {
  description = "Resource naming prefix"
  type        = string
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}

# Database variables
variable "db_password" {
  description = "Database master password (legacy - keeping for compatibility)"
  type        = string
  sensitive   = true
  default     = ""
}

# MongoDB variables (replacing RDS)
variable "mongodb_uri" {
  description = "MongoDB connection URI for external database"
  type        = string
  sensitive   = true
  default     = ""
}

variable "database_name" {
  description = "MongoDB database name"
  type        = string
  default     = "invoxa"
}

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_secret_key" {
  description = "Stripe secret key for payments"
  type        = string
  sensitive   = true
  default     = ""
}

variable "sendgrid_api_key" {
  description = "SendGrid API key for notifications"
  type        = string
  sensitive   = true
  default     = ""
}