## === modules/secrets/outputs.tf ===

output "mongodb_credentials_secret_arn" {
  description = "ARN of the MongoDB credentials secret"
  value       = aws_secretsmanager_secret.mongodb_credentials.arn
}

output "jwt_secret_arn" {
  description = "ARN of the JWT secret"
  value       = aws_secretsmanager_secret.jwt_secret.arn
}

output "api_keys_secret_arn" {
  description = "ARN of the API keys secret"
  value       = aws_secretsmanager_secret.api_keys.arn
}