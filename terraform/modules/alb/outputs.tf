output "alb_arn" {
  description = "The ARN of the ALB"
  value       = aws_lb.main.arn
}

output "dns_name" {
  description = "The DNS name of the ALB"
  value       = aws_lb.main.dns_name
}

output "listener_arn" {
  description = "ARN of the HTTP listener"
  value       = aws_lb_listener.http.arn
}

output "default_target_group_arn" {
  description = "ARN of the default target group"
  value       = aws_lb_target_group.default.arn
}
