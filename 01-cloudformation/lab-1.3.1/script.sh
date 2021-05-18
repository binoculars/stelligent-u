#!/usr/bin/env bash

regions=$(cat regions.json | jq -r '.[]')

for region in ${regions}; do
    aws-vault exec barrett.harber.labs -- \
        aws cloudformation deploy \
            --region ${region} \
            --stack-name bkh-stelligent-u-01-cloudformation-lab-1-3-1 \
            --template ./template.yaml
done
