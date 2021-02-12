import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config()
const cidr = config.require("cidr")

async function main() {
    const vpc = new awsx.ec2.Vpc(`lbriggs-vpc`, {
        numberOfAvailabilityZones: 2,
        numberOfNatGateways: 0,
        cidrBlock: cidr,
        subnets: [
            {type: "private", tags: {Name: "lbriggs-vpc", tier: "production"}},
            {type: "public", tags: {Name: "lbriggs-vpc", tier: "production"}}
        ],
        tags: {
            tier: "production",
            Name: "lbriggs-vpc"
        }
    });

    return {
        vpcId: vpc.id,
        publicSubnetIds: vpc.publicSubnetIds,
        privateSubnetIds: vpc.privateSubnetIds,
        vpcCidr: cidr,
    }
}

module.exports = main()
