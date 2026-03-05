# Project 5: Enterprise Secure Platform

> **Week 8 Final Project - Production-grade secure architecture**

---

## Product Requirements Document (PRD)

### Product Name
**Enterprise Secure Platform**

### Objective
Build a production-grade secure architecture combining all security concepts: OAuth2, JWT, RBAC, API Gateway, Rate Limiting, Monitoring, and Observability.

---

## System Architecture

```
Internet
  ↓
CloudFlare (DDoS Protection)
  ↓
AWS WAF (Web Application Firewall)
  ↓
API Gateway (Spring Cloud Gateway)
  ├─ TLS Termination
  ├─ JWT Validation
  ├─ Rate Limiting
  └─ Request Logging
  ↓
OAuth2 Authorization Server (Keycloak)
  ├─ User Authentication
  ├─ MFA Support
  └─ Token Issuance
  ↓
Microservices (Spring Boot)
  ├─ User Service
  ├─ Order Service
  ├─ Payment Service
  └─ Notification Service
  ↓
Service Mesh (Istio)
  ├─ mTLS
  └─ Service Authentication
  ↓
Database (PostgreSQL - Encrypted)
  ↓
Monitoring Stack
  ├─ Prometheus (Metrics)
  ├─ Grafana (Dashboards)
  └─ ELK Stack (Logging)
```

---

## Features

### Authentication & Authorization
- **OAuth2 authentication** with Keycloak
- **JWT tokens** for stateless authentication
- **RBAC** (Role-Based Access Control)
- **MFA** (Multi-Factor Authentication) support

### API Gateway
- **Centralized security** enforcement
- **Rate limiting** per user and per IP
- **Request routing** to microservices
- **CORS policy** configuration

### Microservices
- **JWT validation** in each service
- **Resource-level authorization**
- **Inter-service authentication** with mTLS
- **Service mesh** for automatic security

### Observability
- **Request logging** for all API calls
- **Security audit logs** for authentication events
- **Metrics dashboard** for security metrics
- **Alerting** for security incidents

---

## Security Layers

1. **TLS Encryption**: All traffic encrypted
2. **JWT Authentication**: Stateless user authentication
3. **OAuth2**: Delegated authentication
4. **RBAC**: Role-based access control
5. **Rate Limiting**: Prevent API abuse
6. **mTLS**: Secure inter-service communication
7. **Secrets Management**: Secure credential storage
8. **Observability**: Security monitoring and logging

---

## Implementation Guide

### Step 1: Set Up Keycloak (OAuth2 Server)

**Docker Compose**:
```yaml
version: '3.8'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8080:8080"
    command: start-dev
```

**Configure Realm**:
- Create realm
- Configure OAuth2 clients
- Set up user roles
- Enable MFA

### Step 2: Configure API Gateway

**Spring Cloud Gateway Configuration**:
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://user-service:8081
          predicates:
            - Path=/api/users/**
          filters:
            - name: JwtValidationFilter
            - name: RateLimitingFilter
            - StripPrefix=1
```

### Step 3: Implement Microservices

**User Service**:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
}
```

**Order Service**:
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public Order createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }
}
```

### Step 4: Set Up Service Mesh (Istio)

**Install Istio**:
```bash
istioctl install --set profile=default
```

**Enable mTLS**:
```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT
```

### Step 5: Configure Monitoring

**Prometheus Configuration**:
```yaml
scrape_configs:
  - job_name: 'spring-actuator'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['user-service:8081', 'order-service:8082']
```

**Grafana Dashboard**:
- Security metrics dashboard
- Authentication success/failure rates
- Rate limiting metrics
- Token validation metrics

**ELK Stack**:
- Centralized logging
- Security event logging
- Audit trail

---

## Security Metrics to Monitor

1. **Authentication Metrics**:
   - Login success rate
   - Login failure rate
   - MFA usage rate

2. **Authorization Metrics**:
   - Authorization success rate
   - Access denied events
   - Role distribution

3. **Rate Limiting Metrics**:
   - Rate limit hits
   - Requests per user
   - Top users by request count

4. **Token Metrics**:
   - Token validation success rate
   - Token expiration events
   - Token refresh rate

5. **Security Events**:
   - Failed authentication attempts
   - Unauthorized access attempts
   - Suspicious activity

---

## Testing

### Test OAuth2 Flow
```bash
# 1. Get authorization code
curl "http://keycloak:8080/realms/my-realm/protocol/openid-connect/auth?client_id=my-client&redirect_uri=http://localhost:3000/callback&response_type=code"

# 2. Exchange code for token
curl -X POST "http://keycloak:8080/realms/my-realm/protocol/openid-connect/token" \
  -d "grant_type=authorization_code&code=<code>&client_id=my-client&client_secret=<secret>"

# 3. Use access token
curl http://api-gateway:8080/api/users/123 \
  -H "Authorization: Bearer <access_token>"
```

### Test Rate Limiting
```bash
# Make requests until rate limit
for i in {1..101}; do
  curl http://api-gateway:8080/api/users/123 \
    -H "Authorization: Bearer <token>"
done
```

### Test mTLS
```bash
# Services communicate over mTLS automatically
# Verify with Istio dashboard
```

---

## Deliverables

✅ **Complete enterprise platform** with all security layers  
✅ **OAuth2 authentication** with Keycloak  
✅ **JWT token-based** authorization  
✅ **API Gateway** with rate limiting  
✅ **Microservices** with secure communication  
✅ **Service mesh** with mTLS  
✅ **Monitoring** and observability  

---

## Skills Learned

- ✅ **Enterprise Architecture**: Production-grade security
- ✅ **OAuth2**: Delegated authentication
- ✅ **Microservices Security**: Distributed system security
- ✅ **Service Mesh**: Automatic security with Istio
- ✅ **Observability**: Security monitoring and logging
- ✅ **Complete Security Stack**: All layers working together

---

## Final Outcome

After completing this project, you will have built a **complete secure enterprise platform** with:

- ✅ **HTTPS/TLS** encryption
- ✅ **JWT authentication** 
- ✅ **OAuth2** integration
- ✅ **RBAC** authorization
- ✅ **API Gateway** security
- ✅ **Microservices** architecture
- ✅ **Container security**
- ✅ **Observability** and monitoring

**This is the same architecture used by companies like Netflix, Uber, and Amazon.**

---

## Next Steps

1. Review [Security Roadmap](./../security-roadmap.md) for complete learning path
2. Study [Enterprise Architecture](./../topics/12-enterprise-security-architecture.md) for advanced concepts
3. Practice with real-world scenarios

**Congratulations! You've completed the Enterprise Security Learning Portal!** 🎉
