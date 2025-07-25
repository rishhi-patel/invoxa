## === root/outputs.tf ===

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "cluster_name" {
  value = module.ecs.cluster_name
}

output "alb_dns_name" {
  value = module.alb.dns_name
}

output "ecr_repo_url" {
  value = module.ecr.repository_url
}
