aws_region           = "us-east-1"
vpc_cidr             = "10.1.0.0/16"
public_subnet_cidrs  = ["10.1.101.0/24", "10.1.102.0/24", "10.1.103.0/24"]
private_subnet_cidrs = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
azs                  = ["us-east-1a", "us-east-1b", "us-east-1c"]
tags = {
  PROJECT   = "INVOXA"
  PROGRAM   = "PROG8860"
  ENV       = "DEV"
  TERRAFORM = "TRUE"
}
prefix          = "INX-DEV-USNV-"
bucket_name     = "inx-dev-terraform-state-config"
lock_table_name = "inx-dev-tf-locks"
