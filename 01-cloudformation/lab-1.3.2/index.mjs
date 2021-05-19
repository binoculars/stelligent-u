import { CloudFormationClient, CreateStackCommand, UpdateStackCommand, DeleteStackCommand, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import regions from './regions.json';
import fs from 'fs';

const stackName = 'bkh-stelligent-u-01-cloudformation-lab-1-3-2';

/**
 * 
 * @param client the AWS CloudFormation client
 * @param StackName The name of the stack 
 * @returns whether the stack exists or not
 */
async function checkIfStackExists(client, StackName) {
    try {
        const command = new DescribeStacksCommand({StackName});
        await client.send(command);
        return true;
    } catch {
        return false;
    }
}

const TemplateBody = fs.readFileSync('template.yaml').toString();

const del = process.argv.includes('--delete');

await Promise.all(
    // Iterate over all regions asynchronously
    regions.map(async region => {
        const client = new CloudFormationClient({region});
        const stackExists = await checkIfStackExists(client, stackName);
        console.log(region, 'Stack exists:', stackExists);

        let command;

        if (del) {
            command = new DeleteStackCommand({StackName: stackName});
        } else if (stackExists) {
            command = new UpdateStackCommand({StackName: stackName, TemplateBody});
        } else {
            command = new CreateStackCommand({StackName: stackName, TemplateBody});
        }       
        
        try {
            await client.send(command);
        } catch (e) {
            console.error(e);
        }
    })
);
