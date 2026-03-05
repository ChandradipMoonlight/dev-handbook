# Enterprise Security Learning Roadmap

> **Goal**: Become a Senior/Lead Engineer capable of designing secure enterprise applications

This roadmap takes you from **beginner → senior lead architect level** in enterprise application security.

---

## 🎯 Learning Path Overview

The roadmap is divided into **7 phases**, progressing from fundamentals to advanced enterprise architecture:

1. **Phase 1**: Core Security Foundations
2. **Phase 2**: Application Security
3. **Phase 3**: Microservices Security
4. **Phase 4**: Infrastructure Security
5. **Phase 5**: Enterprise Security Architecture
6. **Phase 6**: Secure Software Development Lifecycle
7. **Phase 7**: Advanced Enterprise Security Topics

---

## 📚 Phase 1 — Core Security Foundations (Weeks 1-3)

**Must master first** before moving to frameworks and tools.

### Week 1: Network Security
- **Topic**: [Network Security Fundamentals](./topics/01-network-security.md)
- **Focus**: Understanding how data flows across the internet
- **Key Concepts**: OSI model, TCP/UDP, HTTP/HTTPS, TLS, DNS, Reverse Proxy, Load Balancer
- **Project**: [Secure HTTPS API Service](./projects/project-01-secure-api.md)

### Week 2: Cryptography
- **Topic**: [Cryptography Fundamentals](./topics/02-cryptography.md)
- **Focus**: Understanding how TLS and JWT work internally
- **Key Concepts**: Symmetric/Asymmetric encryption, Hashing, Digital signatures, PKI, Key exchange
- **Skills**: AES, RSA, SHA256, BCrypt, Diffie-Hellman

### Week 3: Authentication & Authorization
- **Topic**: [Authentication & Authorization](./topics/03-authentication.md) | [Authorization Models](./topics/04-authorization.md)
- **Focus**: Identity and access management
- **Key Concepts**: Password auth, API keys, Tokens, OAuth2, SAML, RBAC, ABAC
- **Project**: [Authentication Service](./projects/project-02-auth-service.md)

---

## 🔒 Phase 2 — Application Security (Weeks 4-6)

Focus on securing backend applications.

### Week 4: API Security
- **Topic**: [API Security](./topics/05-api-security.md)
- **Focus**: Designing secure REST APIs
- **Key Concepts**: API authentication, JWT, OAuth2, Rate limiting, CORS, CSRF protection
- **Project**: [OWASP Secure API](./projects/project-03-secure-gateway.md)

### Week 5: Spring Security
- **Topic**: [Spring Security Deep Dive](./topics/06-spring-security.md)
- **Focus**: Securing Spring Boot enterprise APIs
- **Key Concepts**: Security Filter Chain, AuthenticationManager, JWT authentication, OAuth2 login, Method security

### Week 6: OWASP Top 10
- **Topic**: [OWASP Top 10 Vulnerabilities](./topics/05-api-security.md#owasp-top-10)
- **Focus**: Identifying and preventing common attacks
- **Key Vulnerabilities**: Broken Access Control, Injection, Cryptographic Failures, SSRF

---

## 🏗️ Phase 3 — Microservices Security (Weeks 7-9)

Distributed systems security.

### Week 7: OAuth2 Architecture
- **Topic**: [OAuth2 Security](./topics/07-oauth2.md)
- **Focus**: Understanding OAuth2 flows and architecture
- **Key Concepts**: Authorization server, Resource server, Authorization code flow, Client credentials, PKCE

### Week 8: JWT Security
- **Topic**: [JWT Token Security](./topics/08-jwt-security.md)
- **Focus**: Stateless authentication
- **Key Concepts**: Token structure, Claims, Expiration, Signing algorithms

### Week 9: Microservices Security
- **Topic**: [Microservices Security](./topics/09-microservices-security.md)
- **Focus**: Securing internal service communication
- **Key Concepts**: mTLS, Service tokens, SPIFFE identity, Istio, Linkerd
- **Project**: [Microservices Secure Platform](./projects/project-04-microservices-security.md)

---

## ☁️ Phase 4 — Infrastructure Security (Weeks 10-12)

Platform security for senior engineers.

### Week 10: Cloud Security
- **Topic**: [Cloud Security](./topics/10-cloud-security.md)
- **Focus**: Securing cloud infrastructure
- **Key Concepts**: IAM, VPC, Security groups, Private subnets, NAT gateways
- **Platforms**: AWS, GCP, Azure

### Week 11: Container Security
- **Topic**: [Container Security](./topics/11-container-security.md)
- **Focus**: Securing containerized applications
- **Key Concepts**: Docker security, Image scanning, Container isolation, Runtime protection
- **Tools**: Trivy, Aqua Security, Falco

### Week 12: Kubernetes Security
- **Topic**: [Kubernetes Security](./topics/11-container-security.md#kubernetes-security)
- **Focus**: Securing container orchestration
- **Key Concepts**: RBAC, Pod security, Network policies, Secrets management

---

## 🏢 Phase 5 — Enterprise Security Architecture (Weeks 13-15)

Where lead engineers operate.

### Week 13: Zero Trust Architecture
- **Topic**: [Enterprise Security Architecture](./topics/12-enterprise-security-architecture.md)
- **Focus**: Zero Trust principles
- **Key Concepts**: Identity verification, Device trust, Continuous authentication

### Week 14: Identity and Access Management (IAM)
- **Topic**: [IAM Systems](./topics/12-enterprise-security-architecture.md#identity-and-access-management)
- **Focus**: Enterprise IAM solutions
- **Tools**: Keycloak, Okta, Auth0
- **Capabilities**: SSO, MFA, Identity federation

### Week 15: Security Observability
- **Topic**: [Security Monitoring](./topics/12-enterprise-security-architecture.md#security-observability)
- **Focus**: Security monitoring and threat detection
- **Key Concepts**: SIEM, Threat detection, Security logging
- **Tools**: ELK stack, Splunk, Datadog

---

## 🔄 Phase 6 — Secure Software Development Lifecycle (Week 16)

Enterprise security starts during development.

- **Practices**: Threat modeling, Code scanning, Dependency scanning, Penetration testing
- **Tools**: Snyk, SonarQube, OWASP ZAP

---

## 🚀 Phase 7 — Advanced Enterprise Security Topics (Weeks 17-18)

Staff/Principal engineer topics.

- **Advanced Architectures**: Zero trust networks, Service mesh security, Hardware security modules, Confidential computing
- **Advanced Cryptography**: Forward secrecy, Post-quantum cryptography, Key rotation
- **Advanced Threat Protection**: DDoS mitigation, WAF design, Bot protection

---

## 🎓 Capstone Project

### Week 19-20: Enterprise Secure Platform
- **Project**: [Enterprise Secure Platform](./projects/project-05-enterprise-platform.md)
- **Objective**: Build production-grade secure architecture
- **Architecture**: OAuth2, JWT, RBAC, API Gateway, Microservices, Service Mesh, Monitoring
- **Security Layers**: TLS, JWT, OAuth2, RBAC, Rate limiting, mTLS, Secrets management, Observability

---

## 📖 Topic Files

| Topic | File | Phase |
|-------|------|-------|
| Network Security | [01-network-security.md](./topics/01-network-security.md) | 1 |
| Cryptography | [02-cryptography.md](./topics/02-cryptography.md) | 1 |
| Authentication | [03-authentication.md](./topics/03-authentication.md) | 1 |
| Authorization | [04-authorization.md](./topics/04-authorization.md) | 1 |
| API Security | [05-api-security.md](./topics/05-api-security.md) | 2 |
| Spring Security | [06-spring-security.md](./topics/06-spring-security.md) | 2 |
| OAuth2 | [07-oauth2.md](./topics/07-oauth2.md) | 3 |
| JWT Security | [08-jwt-security.md](./topics/08-jwt-security.md) | 3 |
| Microservices Security | [09-microservices-security.md](./topics/09-microservices-security.md) | 3 |
| Cloud Security | [10-cloud-security.md](./topics/10-cloud-security.md) | 4 |
| Container Security | [11-container-security.md](./topics/11-container-security.md) | 4 |
| Enterprise Security Architecture | [12-enterprise-security-architecture.md](./topics/12-enterprise-security-architecture.md) | 5 |

---

## 🛠️ Project Files

| Project | File | Week |
|---------|------|------|
| Secure HTTPS API | [project-01-secure-api.md](./projects/project-01-secure-api.md) | 1 |
| Authentication Service | [project-02-auth-service.md](./projects/project-02-auth-service.md) | 2 |
| Secure API Gateway | [project-03-secure-gateway.md](./projects/project-03-secure-gateway.md) | 4 |
| Microservices Security | [project-04-microservices-security.md](./projects/project-04-microservices-security.md) | 6 |
| Enterprise Platform | [project-05-enterprise-platform.md](./projects/project-05-enterprise-platform.md) | 8 |

---

## 🎯 Skills You'll Master

After completing this roadmap, you'll be able to:

✅ Design secure microservices architectures  
✅ Architect authentication and authorization systems  
✅ Secure cloud infrastructure (AWS, GCP, Azure)  
✅ Implement IAM solutions (Keycloak, Okta, Auth0)  
✅ Perform threat modeling and security reviews  
✅ Guide development teams on security best practices  
✅ Build production-grade secure platforms  

---

## 📚 Recommended Books

1. **Web Application Security** – Andrew Hoffman
2. **OAuth2 in Action** – Justin Richer
3. **Spring Security in Action**
4. **Designing Secure Software Systems**

---

## 🏆 Final Goal

After mastering this roadmap, you'll be able to design systems like:

```
Client
 ↓
API Gateway (TLS, Rate Limiting)
 ↓
OAuth2 Authorization Server
 ↓
Microservices (JWT, RBAC, mTLS)
 ↓
Service Mesh (Istio/Linkerd)
 ↓
Database (Encrypted)
 ↓
Monitoring (SIEM, Logging)
```

This is the **same architecture used by companies like Netflix, Uber, and Amazon**.

---

## 🚀 Getting Started

1. Start with [Phase 1: Network Security](./topics/01-network-security.md)
2. Complete each topic in order
3. Build the practical projects as you progress
4. Finish with the [Enterprise Secure Platform](./projects/project-05-enterprise-platform.md) capstone

**Ready to begin?** → [Start with Network Security](./topics/01-network-security.md)
