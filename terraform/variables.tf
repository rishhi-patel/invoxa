## === root/variables.tf ===

variable "aws_region" {}
variable "bucket_name" {}
variable "lock_table_name" {}
variable "vpc_cidr" {}
variable "public_subnet_cidrs" { type = list(string) }
variable "private_subnet_cidrs" { type = list(string) }
variable "azs" { type = list(string) }
variable "prefix" {}
variable "tags" { type = map(string) }