# Container Security

> **Securing containerized applications and Kubernetes**

---

## 1. Introduction

**Container security** involves:
- **Image security**: Scanning for vulnerabilities
- **Runtime security**: Protecting running containers
- **Orchestration security**: Securing Kubernetes
- **Secrets management**: Secure credential storage

---

## 2. Docker Security

### Image Scanning

**Scan images for vulnerabilities**:

```bash
# Using Trivy
trivy image my-app:latest

# Using Docker Scout
docker scout cves my-app:latest
```

### Multi-stage Builds

**Reduce attack surface**:

```dockerfile
# Build stage
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package

# Runtime stage (minimal image)
FROM openjdk:17-jre-slim
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Non-root User

**Run containers as non-root**:

```dockerfile
RUN useradd -m appuser
USER appuser
```

---

## 3. Kubernetes Security

### RBAC (Role-Based Access Control)

**Limit pod permissions**:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
subjects:
- kind: ServiceAccount
  name: my-service
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### Pod Security Policies

**Restrict pod capabilities**:

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
  hostNetwork: false
  hostIPC: false
  hostPID: false
```

### Network Policies

**Control pod-to-pod communication**:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: gateway
    ports:
    - protocol: TCP
      port: 8080
```

### Secrets Management

**Use Kubernetes secrets**:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4=
  password: cGFzc3dvcmQ=
```

**Or use external secrets** (AWS Secrets Manager, Vault):

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-secret
spec:
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: db-credentials
  data:
  - secretKey: password
    remoteRef:
      key: prod/database/password
```

---

## 4. Security Tools

### Trivy

**Container vulnerability scanner**:

```bash
trivy image my-app:latest
trivy k8s cluster
```

### Falco

**Runtime security monitoring**:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: falco-config
data:
  falco.yaml: |
    rules_file:
      - /etc/falco/falco_rules.yaml
    json_output: true
```

### Aqua Security

**Container security platform**:
- Image scanning
- Runtime protection
- Compliance checking

---

## 5. Best Practices

1. **Scan images** before deployment
2. **Use minimal base images** (alpine, distroless)
3. **Run as non-root** user
4. **Limit capabilities** in containers
5. **Use secrets** for credentials
6. **Network policies** to restrict communication
7. **RBAC** for Kubernetes access
8. **Regular updates** for base images

---

## 📚 Next Steps

1. Learn [Enterprise Architecture](./12-enterprise-security-architecture.md)
2. Build [Enterprise Platform](./projects/project-05-enterprise-platform.md)

**Ready to continue?** → [Enterprise Security Architecture](./12-enterprise-security-architecture.md)
