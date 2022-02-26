resource "aws_api_gateway_rest_api" "backend" {
  name = "${module.integrated-billing_label.id}-backend"
}

resource "aws_api_gateway_resource" "backend_webhook" {
  path_part   = "webhook"
  parent_id   = aws_api_gateway_rest_api.backend.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.backend.id
}

resource "aws_api_gateway_method" "backend_webhook" {
  authorization = "NONE"
  http_method   = "POST"
  resource_id   = aws_api_gateway_resource.backend_webhook.id
  rest_api_id   = aws_api_gateway_rest_api.backend.id
}

resource "aws_api_gateway_integration" "backend_webhook" {
  http_method             = aws_api_gateway_method.backend_webhook.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.backend.invoke_arn
  resource_id             = aws_api_gateway_resource.backend_webhook.id
  rest_api_id             = aws_api_gateway_rest_api.backend.id
}

resource "aws_api_gateway_deployment" "backend_webhook" {
  rest_api_id = aws_api_gateway_rest_api.backend.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.backend_webhook.id,
      aws_api_gateway_method.backend_webhook.id,
      aws_api_gateway_integration.backend_webhook.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "backend_webhook" {
  deployment_id = aws_api_gateway_deployment.backend_webhook.id
  rest_api_id   = aws_api_gateway_rest_api.backend.id
  stage_name    = var.environment
}

resource "aws_lambda_permission" "api_gateway_backend_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.backend.id}/*/*"
}
