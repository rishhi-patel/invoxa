# ---------------------- VPC ----------------------
module "vpc" {
  source   = "./modules/vpc"
  vpc_cidr = "10.0.0.0/16"
}

# ---------------------- ECR ----------------------
module "ecr" {
  source   = "./modules/ecr"
  services = keys(var.services)
}

# ---------------------- ECS Cluster ----------------------
module "ecs" {
  source       = "./modules/ecs-cluster"
  cluster_name = "${var.project_name}-cluster"
}

# ---------------------- ALB ----------------------
module "alb" {
  source         = "./modules/alb"
  vpc_id         = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnets
}

# ---------------------- ECS Services ----------------------
module "services" {
  source           = "./modules/service"
  services         = var.services
  cluster_id       = module.ecs.cluster_id
  vpc_id           = module.vpc.vpc_id
  subnets          = module.vpc.public_subnets
  alb_listener_arn = module.alb.listener_arn
  account_id       = var.account_id
  alb_sg_id        = module.alb.security_group_id
  aws_region       = var.aws_region
}
