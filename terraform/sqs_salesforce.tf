resource "aws_sqs_queue" "salesforce" {
  name = "${module.integrated-billing_label.id}-salesforce"

  tags = module.integrated-billing_label.tags
}

resource "aws_sqs_queue_policy" "salesforce" {
  queue_url = aws_sqs_queue.salesforce.id

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
      "Resource": "${aws_sqs_queue.salesforce.arn}",
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
