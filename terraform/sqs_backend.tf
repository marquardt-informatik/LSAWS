resource "aws_sqs_queue" "backend" {
  name = "${module.integrated-billing_label.id}-backend"

  tags = module.integrated-billing_label.tags
}

resource "aws_sqs_queue_policy" "backend" {
  queue_url = aws_sqs_queue.backend.id

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
      "Resource": "${aws_sqs_queue.backend.arn}",
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
