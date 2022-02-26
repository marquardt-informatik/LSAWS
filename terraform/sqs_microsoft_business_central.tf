resource "aws_sqs_queue" "microsoft_business_central" {
  name = "${module.integrated-billing_label.id}-microsoft-business-central"

  tags = module.integrated-billing_label.tags
}

resource "aws_sqs_queue_policy" "microsoft_business_central" {
  queue_url = aws_sqs_queue.microsoft_business_central.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Id": "sqspolicy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.microsoft_business_central.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.default.arn}"
        }
      }
    }
  ]
}
EOF
}
