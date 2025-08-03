aws_region           = "us-east-1"
vpc_cidr             = "10.0.0.0/16"
public_subnet_cidrs  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
azs                  = ["us-east-1a", "us-east-1b", "us-east-1c"]
tags = {
  PROJECT   = "INVOXA"
  PROGRAM   = "PROG8860"
  ENV       = "PROD"
  TERRAFORM = "TRUE"
}
prefix = "INX-PRD-USNV-"
bucket_name      = "inx-prd-terraform-state-9015480"
lock_table_name  = "inx-prd-tf-locks"
