resource "aws_api_gateway_rest_api" "pdf_to_tiff" {
  name = "${module.integrated-billing_label.id}-pdf-to-tiff"
}

resource "aws_api_gateway_resource" "pdf_to_tiff_convert" {
  path_part   = "convert"
  parent_id   = aws_api_gateway_rest_api.pdf_to_tiff.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.pdf_to_tiff.id
}

resource "aws_api_gateway_method" "pdf_to_tiff_convert" {
  authorization = "NONE"
  http_method   = "POST"
  resource_id   = aws_api_gateway_resource.pdf_to_tiff_convert.id
  rest_api_id   = aws_api_gateway_rest_api.pdf_to_tiff.id
}

resource "aws_api_gateway_integration" "pdf_to_tiff_convert" {
  http_method             = aws_api_gateway_method.pdf_to_tiff_convert.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.pdf_to_tiff.invoke_arn
  resource_id             = aws_api_gateway_resource.pdf_to_tiff_convert.id
  rest_api_id             = aws_api_gateway_rest_api.pdf_to_tiff.id
}

resource "aws_api_gateway_deployment" "pdf_to_tiff_convert" {
  rest_api_id = aws_api_gateway_rest_api.pdf_to_tiff.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.pdf_to_tiff_convert.id,
      aws_api_gateway_method.pdf_to_tiff_convert.id,
      aws_api_gateway_integration.pdf_to_tiff_convert.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "pdf_to_tiff_convert" {
  deployment_id = aws_api_gateway_deployment.pdf_to_tiff_convert.id
  rest_api_id   = aws_api_gateway_rest_api.pdf_to_tiff.id
  stage_name    = var.environment
}

resource "aws_lambda_permission" "api_gateway_pdf_to_tiff_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pdf_to_tiff.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.pdf_to_tiff.id}/*/*"
}
