
###########################################
# modules/vpc/variables.tf
###########################################

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "List of public subnet CIDRs"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "List of private subnet CIDRs"
  type        = list(string)
}

variable "azs" {
  description = "List of availability zones"
  type        = list(string)
}

variable "tags" {
  description = "Common tags to apply"
  type        = map(string)
}

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}