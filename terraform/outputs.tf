output "json_to_excel_url" {
  value       = "${aws_api_gateway_stage.json_to_excel_convert.invoke_url}/${aws_api_gateway_resource.json_to_excel_convert.path_part}"
  description = "API url to convert json to xlsx"
}

output "pdf_to_tiff_url" {
  value       = "${aws_api_gateway_stage.pdf_to_tiff_convert.invoke_url}/${aws_api_gateway_resource.pdf_to_tiff_convert.path_part}"
  description = "API url to convert pdf to tiff"
}

output "backend_url" {
  value       = aws_api_gateway_stage.backend_webhook.invoke_url
  description = "Backend API url"
}

output "salesforce_url" {
  value       = aws_api_gateway_stage.salesforce.invoke_url
  description = "Salesforce API url"
}

output "microsoft_business_central_url" {
  value       = aws_api_gateway_stage.microsoft_business_central.invoke_url
  description = "Microsoft business central API url"
}
