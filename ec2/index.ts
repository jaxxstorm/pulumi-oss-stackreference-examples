import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const vpcProject = "vpc"
const stack = pulumi.getStack().split(".")
const env = stack[1]

const stackRef = new pulumi.StackReference(`vpc.${env}`)
const vpcId = stackRef.getOutput("vpcId")
const vpcCidr = stackRef.getOutput("vpcCidr" +
    "")

const ami = pulumi.output(aws.getAmi({
    filters: [
        { name: "name", values: [ "ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-*" ] }
    ],
    owners: ["099720109477"],
    mostRecent: true
}))

const instanceSecurityGroups = new aws.ec2.SecurityGroup(`instance-${env}-securitygroup`, {
    vpcId: vpcId,
    description: "Allow all ports from same subnet",
    ingress: [{
        protocol: '-1',
        fromPort: 0,
        toPort: 0,
        cidrBlocks: [ vpcCidr ]
    }],
    egress: [{
        protocol: '-1',
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ['0.0.0.0/0'],
    }]
})

