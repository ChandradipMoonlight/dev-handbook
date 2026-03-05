# Cloud Security

> **Securing applications deployed on cloud platforms**

---

## 1. Introduction

**Cloud security** involves securing:
- **Infrastructure**: VPCs, subnets, security groups
- **Applications**: Running on cloud
- **Data**: Stored in cloud databases
- **Access**: IAM, roles, policies

**Major Cloud Providers**: AWS, GCP, Azure

---

## 2. AWS Security

### IAM (Identity and Access Management)

**Principle of least privilege**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

### VPC (Virtual Private Cloud)

**Network isolation**:

```
Internet
  ↓
Public Subnet (Load Balancer)
  ↓
Private Subnet (Application Servers)
  ↓
Database Subnet (RDS)
```

### Security Groups

**Firewall rules**:

```yaml
SecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    SecurityGroupIngress:
      - IpProtocol: tcp
        FromPort: 443
        ToPort: 443
        CidrIp: 0.0.0.0/0
      - IpProtocol: tcp
        FromPort: 8080
        ToPort: 8080
        SourceSecurityGroupId: !Ref LoadBalancerSecurityGroup
```

### Secrets Management

**AWS Secrets Manager**:

```java
@Autowired
private AWSSecretsManager secretsManager;

public String getDatabasePassword() {
    GetSecretValueRequest request = new GetSecretValueRequest()
        .withSecretId("prod/database/password");
    
    GetSecretValueResult result = secretsManager.getSecretValue(request);
    return result.getSecretString();
}
```

---

## 3. GCP Security

### IAM Roles

**Service account with minimal permissions**:

```yaml
serviceAccount:
  email: my-service@project.iam.gserviceaccount.com
  scopes:
    - https://www.googleapis.com/auth/cloud-platform
```

### VPC Network

**Private GKE clusters**:

```yaml
apiVersion: container.googleapis.com/v1
kind: Cluster
spec:
  privateClusterConfig:
    enablePrivateNodes: true
    enablePrivateEndpoint: true
```

---

## 4. Azure Security

### Azure AD

**Managed identity for services**:

```java
@Autowired
private DefaultAzureCredential credential;

public void accessStorage() {
    BlobServiceClient client = new BlobServiceClientBuilder()
        .endpoint("https://storage.blob.core.windows.net")
        .credential(credential)
        .buildClient();
}
```

---

## 5. Best Practices

1. **Use IAM roles** instead of access keys
2. **Private subnets** for application servers
3. **Security groups** with least privilege
4. **Secrets manager** for credentials
5. **Encryption at rest** for databases
6. **VPC peering** for secure communication
7. **CloudTrail/Logging** for audit trails

---

## 📚 Next Steps

1. Learn [Container Security](./11-container-security.md) for containers
2. Master [Enterprise Architecture](./12-enterprise-security-architecture.md)
3. Build [Enterprise Platform](./projects/project-05-enterprise-platform.md)

**Ready to continue?** → [Container Security](./11-container-security.md)
