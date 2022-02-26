resource "aws_api_gateway_rest_api" "microsoft_business_central" {
  name = "${module.integrated-billing_label.id}-microsoft-business-central"
}

resource "aws_api_gateway_resource" "microsoft_business_central_products" {
  path_part   = "products"
  parent_id   = aws_api_gateway_rest_api.microsoft_business_central.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.microsoft_business_central.id
}

resource "aws_api_gateway_method" "microsoft_business_central_products" {
  authorization = "NONE"
  http_method   = "POST"
  resource_id   = aws_api_gateway_resource.microsoft_business_central_products.id
  rest_api_id   = aws_api_gateway_rest_api.microsoft_business_central.id
}

resource "aws_api_gateway_integration" "microsoft_business_central_products" {
  http_method             = aws_api_gateway_method.microsoft_business_central_products.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.microsoft_business_central.invoke_arn
  resource_id             = aws_api_gateway_resource.microsoft_business_central_products.id
  rest_api_id             = aws_api_gateway_rest_api.microsoft_business_central.id
}

resource "aws_api_gateway_deployment" "microsoft_business_central" {
  rest_api_id = aws_api_gateway_rest_api.microsoft_business_central.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.microsoft_business_central_products.id,
      aws_api_gateway_method.microsoft_business_central_products.id,
      aws_api_gateway_integration.microsoft_business_central_products.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "microsoft_business_central" {
  deployment_id = aws_api_gateway_deployment.microsoft_business_central.id
  rest_api_id   = aws_api_gateway_rest_api.microsoft_business_central.id
  stage_name    = var.environment
}

resource "aws_lambda_permission" "api_gateway_microsoft_business_central_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.microsoft_business_central.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.microsoft_business_central.id}/*/*"
}
