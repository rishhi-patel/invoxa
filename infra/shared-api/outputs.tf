output "api_url" {
  value       = aws_apigatewayv2_api.http.api_endpoint
  description = "Shared HTTP API base URL"
}

output "function_names" {
  value       = { for k, f in aws_lambda_function.svc : k => f.function_name }
  description = "Lambda function names per service"
}
