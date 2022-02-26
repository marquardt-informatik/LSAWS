resource "aws_api_gateway_rest_api" "json_to_excel" {
  name = "${module.integrated-billing_label.id}-json-to-excel"
}

resource "aws_api_gateway_resource" "json_to_excel_convert" {
  path_part   = "convert"
  parent_id   = aws_api_gateway_rest_api.json_to_excel.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.json_to_excel.id
}

resource "aws_api_gateway_method" "json_to_excel_convert" {
  authorization = "NONE"
  http_method   = "POST"
  resource_id   = aws_api_gateway_resource.json_to_excel_convert.id
  rest_api_id   = aws_api_gateway_rest_api.json_to_excel.id
}

resource "aws_api_gateway_integration" "json_to_excel_convert" {
  http_method             = aws_api_gateway_method.json_to_excel_convert.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.json_to_excel.invoke_arn
  resource_id             = aws_api_gateway_resource.json_to_excel_convert.id
  rest_api_id             = aws_api_gateway_rest_api.json_to_excel.id
}

resource "aws_api_gateway_deployment" "json_to_excel_convert" {
  rest_api_id = aws_api_gateway_rest_api.json_to_excel.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.json_to_excel_convert.id,
      aws_api_gateway_method.json_to_excel_convert.id,
      aws_api_gateway_integration.json_to_excel_convert.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "json_to_excel_convert" {
  deployment_id = aws_api_gateway_deployment.json_to_excel_convert.id
  rest_api_id   = aws_api_gateway_rest_api.json_to_excel.id
  stage_name    = var.environment
}

resource "aws_lambda_permission" "api_gateway_json_to_excel_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.json_to_excel.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.json_to_excel.id}/*/*"
}
