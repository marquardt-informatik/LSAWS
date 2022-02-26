resource "aws_api_gateway_rest_api" "salesforce" {
  name = "${module.integrated-billing_label.id}-salesforce"
}

resource "aws_api_gateway_resource" "salesforce_accounts" {
  path_part   = "accounts"
  parent_id   = aws_api_gateway_rest_api.salesforce.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.salesforce.id
}

resource "aws_api_gateway_resource" "salesforce_opportunities" {
  path_part   = "opportunities"
  parent_id   = aws_api_gateway_rest_api.salesforce.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.salesforce.id
}

resource "aws_api_gateway_resource" "salesforce_products" {
  path_part   = "products"
  parent_id   = aws_api_gateway_rest_api.salesforce.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.salesforce.id
}

resource "aws_api_gateway_method" "salesforce_accounts" {
  authorization = "NONE"
  http_method   = "GET"
  resource_id   = aws_api_gateway_resource.salesforce_accounts.id
  rest_api_id   = aws_api_gateway_rest_api.salesforce.id
}

resource "aws_api_gateway_method" "salesforce_opportunities" {
  authorization = "NONE"
  http_method   = "GET"
  resource_id   = aws_api_gateway_resource.salesforce_opportunities.id
  rest_api_id   = aws_api_gateway_rest_api.salesforce.id
}

resource "aws_api_gateway_method" "salesforce_products" {
  authorization = "NONE"
  http_method   = "GET"
  resource_id   = aws_api_gateway_resource.salesforce_products.id
  rest_api_id   = aws_api_gateway_rest_api.salesforce.id
}

resource "aws_api_gateway_integration" "salesforce_accounts" {
  http_method             = aws_api_gateway_method.salesforce_accounts.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.salesforce.invoke_arn
  resource_id             = aws_api_gateway_resource.salesforce_accounts.id
  rest_api_id             = aws_api_gateway_rest_api.salesforce.id
}

resource "aws_api_gateway_integration" "salesforce_opportunities" {
  http_method             = aws_api_gateway_method.salesforce_opportunities.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.salesforce.invoke_arn
  resource_id             = aws_api_gateway_resource.salesforce_opportunities.id
  rest_api_id             = aws_api_gateway_rest_api.salesforce.id
}

resource "aws_api_gateway_integration" "salesforce_products" {
  http_method             = aws_api_gateway_method.salesforce_products.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.salesforce.invoke_arn
  resource_id             = aws_api_gateway_resource.salesforce_products.id
  rest_api_id             = aws_api_gateway_rest_api.salesforce.id
}

resource "aws_api_gateway_deployment" "salesforce" {
  rest_api_id = aws_api_gateway_rest_api.salesforce.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.salesforce_accounts.id,
      aws_api_gateway_method.salesforce_accounts.id,
      aws_api_gateway_integration.salesforce_accounts.id,
      aws_api_gateway_resource.salesforce_opportunities.id,
      aws_api_gateway_method.salesforce_opportunities.id,
      aws_api_gateway_integration.salesforce_opportunities.id,
      aws_api_gateway_resource.salesforce_products.id,
      aws_api_gateway_method.salesforce_products.id,
      aws_api_gateway_integration.salesforce_products.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "salesforce" {
  deployment_id = aws_api_gateway_deployment.salesforce.id
  rest_api_id   = aws_api_gateway_rest_api.salesforce.id
  stage_name    = var.environment
}

resource "aws_lambda_permission" "api_gateway_salesforce_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.salesforce.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.salesforce.id}/*/*"
}
