# Network Security Fundamentals

> **Understanding how data flows securely across the internet**

---

## 1. Introduction

Think of network security like **postal mail security**:

- **Regular mail (HTTP)**: Anyone can read your letter if they intercept it
- **Registered mail (HTTPS)**: Your letter is in a locked box, and only the recipient has the key

Network security ensures that when your application sends data over the internet, it's protected from:
- **Eavesdropping**: Someone listening to your communication
- **Tampering**: Someone modifying your data
- **Impersonation**: Someone pretending to be your server

---

## 2. Why This Topic Matters in Enterprise Systems

In enterprise systems, network security is **critical** because:

### Fintech Platforms
- **Banking apps** transfer sensitive financial data
- **Payment systems** process credit card information
- **Trading platforms** execute high-value transactions

**Without network security**: Hackers can steal credit card numbers, modify transactions, or impersonate your bank.

### Large SaaS Systems
- **Customer data** flows between services
- **API calls** between microservices
- **User authentication** tokens transmitted

**Without network security**: User credentials, personal data, and business secrets are exposed.

### Microservices Architectures
- **Service-to-service** communication
- **API gateway** to microservices
- **Database connections** from services

**Without network security**: Internal service communication is vulnerable to attacks.

---

## 3. Basic Concepts

### What is HTTP?

**HTTP (Hypertext Transfer Protocol)** is like sending a postcard:
- Anyone can read it
- No encryption
- Plain text communication

```
Client → HTTP Request → Server
       ← HTTP Response ←
```

**Example**:
```
GET /api/users HTTP/1.1
Host: example.com
```

### What is HTTPS?

**HTTPS (HTTP Secure)** is like sending a letter in a locked box:
- Encrypted communication
- Only sender and receiver can read
- Uses TLS/SSL encryption

```
Client → HTTPS Request (Encrypted) → Server
       ← HTTPS Response (Encrypted) ←
```

### What is TLS?

**TLS (Transport Layer Security)** is the encryption protocol that makes HTTPS secure.

**Think of it like**:
1. Client and server exchange "keys" (certificates)
2. They agree on an encryption method
3. All communication is encrypted using these keys

### What is a Reverse Proxy?

A **reverse proxy** sits in front of your server and handles:
- **SSL/TLS termination**: Decrypts HTTPS traffic
- **Load balancing**: Distributes requests
- **Caching**: Stores frequently accessed content

```
Internet → Reverse Proxy (Nginx) → Application Server
```

**Real-world example**: Nginx, Apache, AWS ALB

### What is a Load Balancer?

A **load balancer** distributes incoming requests across multiple servers:

```
Client
  ↓
Load Balancer
  ├─→ Server 1
  ├─→ Server 2
  └─→ Server 3
```

**Benefits**:
- **High availability**: If one server fails, others handle traffic
- **Scalability**: Add more servers as needed
- **Performance**: Distribute load evenly

---

## 4. Intermediate Concepts

### OSI Model (7 Layers)

Understanding network layers helps you secure each layer:

```
7. Application Layer    → HTTP, HTTPS, APIs
6. Presentation Layer   → SSL/TLS encryption
5. Session Layer        → Session management
4. Transport Layer      → TCP, UDP
3. Network Layer        → IP, Routing
2. Data Link Layer      → Ethernet, MAC addresses
1. Physical Layer       → Cables, WiFi
```

**Security at each layer**:
- **Layer 7**: API authentication, rate limiting
- **Layer 6**: TLS encryption
- **Layer 4**: TCP connection security

### TCP vs UDP

**TCP (Transmission Control Protocol)**:
- **Reliable**: Guarantees delivery
- **Ordered**: Data arrives in order
- **Connection-oriented**: Establishes connection first
- **Use case**: HTTP, HTTPS, database connections

**UDP (User Datagram Protocol)**:
- **Fast**: No connection overhead
- **Unreliable**: No delivery guarantee
- **Use case**: Video streaming, DNS queries

**Security implication**: TCP is easier to secure because it's connection-oriented.

### DNS (Domain Name System)

**DNS** translates domain names to IP addresses:

```
example.com → 192.168.1.1
```

**Security concerns**:
- **DNS spoofing**: Attacker redirects traffic to malicious server
- **DNS hijacking**: Attacker controls DNS responses

**Solution**: **DNSSEC** (DNS Security Extensions) provides authentication.

### NAT (Network Address Translation)

**NAT** allows multiple devices to share one public IP:

```
Private Network (192.168.1.x)
  ├─ Device 1
  ├─ Device 2
  └─ Device 3
         ↓
    NAT Router
         ↓
   Public IP (203.0.113.1)
```

**Security benefit**: Hides internal network structure from internet.

---

## 5. Advanced Concepts

### TLS Handshake Flow

Understanding how TLS establishes secure connection:

```
1. ClientHello
   Client → Server: "I support TLS 1.3, here are my cipher suites"

2. ServerHello
   Server → Client: "Let's use TLS 1.3, here's my certificate"

3. Certificate Verification
   Client verifies server certificate (signed by trusted CA)

4. Key Exchange
   Client and server exchange encryption keys (Diffie-Hellman)

5. Secure Communication
   All data encrypted using agreed keys
```

### Reverse Proxy Architecture

Production architecture with reverse proxy:

```
Internet
  ↓
CloudFlare / AWS CloudFront (CDN)
  ↓
Load Balancer (AWS ALB)
  ↓
Reverse Proxy (Nginx)
  ├─ TLS Termination
  ├─ SSL Certificate
  └─ Request Routing
  ↓
Application Servers
  ├─ Server 1
  ├─ Server 2
  └─ Server 3
```

### API Gateway Pattern

Modern microservices use API Gateway:

```
Clients
  ↓
API Gateway
  ├─ TLS Termination
  ├─ JWT Validation
  ├─ Rate Limiting
  └─ Request Routing
  ↓
Microservices
  ├─ User Service
  ├─ Order Service
  └─ Payment Service
```

---

## 6. Internal Working / Deep Dive

### TLS Handshake Detailed Flow

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │ Server  │
└────┬────┘                                    └────┬────┘
     │                                              │
     │ 1. ClientHello                               │
     │    - TLS version                             │
     │    - Cipher suites                           │
     │    - Random number                           │
     ├─────────────────────────────────────────────>│
     │                                              │
     │                   2. ServerHello             │
     │                      - Selected cipher        │
     │                      - Server certificate     │
     │                      - Random number          │
     │<─────────────────────────────────────────────┤
     │                                              │
     │                   3. Certificate             │
     │                      - Server's public key    │
     │<─────────────────────────────────────────────┤
     │                                              │
     │ 4. Client verifies certificate               │
     │    (checks CA signature)                     │
     │                                              │
     │ 5. ClientKeyExchange                         │
     │    - Pre-master secret (encrypted)           │
     ├─────────────────────────────────────────────>│
     │                                              │
     │ 6. Both compute session keys                 │
     │    from pre-master secret                    │
     │                                              │
     │ 7. ChangeCipherSpec                          │
     │    "Switch to encrypted communication"       │
     ├─────────────────────────────────────────────>│
     │                    ChangeCipherSpec          │
     │<─────────────────────────────────────────────┤
     │                                              │
     │ 8. Encrypted Handshake Finished              │
     ├─────────────────────────────────────────────>│
     │                    Encrypted Handshake       │
     │                    Finished                  │
     │<─────────────────────────────────────────────┤
     │                                              │
     │ 9. Secure encrypted communication           │
     │<════════════════════════════════════════════>│
```

### TCP Connection Establishment

**Three-way handshake**:

```
Client                          Server
  │                               │
  │─── SYN (seq=x) ──────────────>│
  │                               │
  │<── SYN-ACK (seq=y, ack=x+1) ──│
  │                               │
  │─── ACK (ack=y+1) ────────────>│
  │                               │
  │  Connection Established       │
```

---

## 7. Java Implementation Examples

### Spring Boot HTTPS Configuration

**application.yml**:
```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: changeit
    key-store-type: PKCS12
    key-alias: tomcat
```

### Nginx Reverse Proxy Configuration

**nginx.conf**:
```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    # SSL Certificate
    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;

    # TLS Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Reverse Proxy
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Spring Boot with Nginx

**Architecture**:
```
Client → Nginx (443) → Spring Boot (8080)
```

**Spring Boot** (runs on HTTP internally):
```java
@SpringBootApplication
public class SecureApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecureApiApplication.class, args);
    }
}
```

**Nginx** handles HTTPS, Spring Boot handles business logic.

---

## 8. Common Security Mistakes

### ❌ Mistake 1: HTTP Instead of HTTPS

**Problem**:
```java
// BAD: HTTP endpoint
@GetMapping("/api/users")
public List<User> getUsers() {
    // Data transmitted in plain text
}
```

**Fix**: Always use HTTPS in production.

### ❌ Mistake 2: Weak TLS Configuration

**Problem**:
```nginx
# BAD: Weak TLS version
ssl_protocols TLSv1.0 TLSv1.1;
```

**Fix**:
```nginx
# GOOD: Strong TLS configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
```

### ❌ Mistake 3: Self-Signed Certificates in Production

**Problem**: Using self-signed certificates that browsers don't trust.

**Fix**: Use certificates from trusted CA (Let's Encrypt, AWS Certificate Manager).

### ❌ Mistake 4: No Certificate Validation

**Problem**: Disabling certificate validation in code.

```java
// BAD: Disables SSL verification
TrustManager[] trustAllCerts = new TrustManager[] {
    new X509TrustManager() {
        public void checkClientTrusted(...) {}
        public void checkServerTrusted(...) {}
    }
};
```

**Fix**: Always validate certificates.

---

## 9. Real Enterprise Architecture Example

### Netflix-Style Network Architecture

```
Internet Users
  ↓
AWS CloudFront (CDN + DDoS Protection)
  ↓
AWS WAF (Web Application Firewall)
  ↓
AWS Application Load Balancer (TLS Termination)
  ↓
Nginx Reverse Proxy (Internal)
  ↓
Zuul API Gateway
  ↓
Microservices (Spring Boot)
  ├─ Eureka (Service Discovery)
  ├─ Hystrix (Circuit Breaker)
  └─ Ribbon (Load Balancer)
  ↓
AWS RDS (Encrypted Connection)
```

**Security layers**:
1. **CloudFront**: DDoS protection, edge caching
2. **WAF**: SQL injection, XSS protection
3. **ALB**: TLS termination, health checks
4. **Nginx**: Additional security headers
5. **Zuul**: API gateway security
6. **Microservices**: Application-level security

---

## 10. Diagrams and Visual Illustrations

### Complete Request Flow

```
┌──────────┐
│  Client  │
│ (Browser)│
└────┬─────┘
     │
     │ 1. DNS Lookup
     │    example.com → 192.168.1.1
     ↓
┌─────────────────┐
│   DNS Server    │
└─────────────────┘
     │
     │ 2. HTTPS Request
     │    GET https://example.com/api/users
     ↓
┌─────────────────┐
│  Load Balancer  │
│  (TLS Term.)    │
└────┬────────────┘
     │
     │ 3. HTTP (Internal)
     │    GET http://internal/api/users
     ↓
┌─────────────────┐
│ Reverse Proxy   │
│    (Nginx)      │
└────┬────────────┘
     │
     │ 4. Route to Service
     ↓
┌─────────────────┐
│  Spring Boot    │
│   Application   │
└─────────────────┘
```

---

## 11. Mini Practical Project

### Project: Secure HTTPS API with Nginx

**Problem Statement**: Build a Spring Boot API secured with HTTPS using Nginx as reverse proxy.

**Requirements**:
- Spring Boot API running on HTTP (port 8080)
- Nginx reverse proxy with HTTPS (port 443)
- Self-signed certificate for development
- Secure TLS configuration

**Architecture**:
```
Client → Nginx (HTTPS:443) → Spring Boot (HTTP:8080)
```

**Implementation Steps**:

#### Step 1: Create Spring Boot API

```java
@RestController
@RequestMapping("/api")
public class ProfileController {
    
    @GetMapping("/profile")
    public Profile getProfile() {
        return new Profile("John Doe", "john@example.com");
    }
    
    @PostMapping("/profile")
    public Profile updateProfile(@RequestBody Profile profile) {
        // Update profile
        return profile;
    }
}
```

#### Step 2: Generate Self-Signed Certificate

```bash
# Generate private key
openssl genrsa -out key.pem 2048

# Generate certificate
openssl req -new -x509 -key key.pem -out cert.pem -days 365
```

#### Step 3: Configure Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name localhost;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Step 4: Test

```bash
# Start Spring Boot
./mvnw spring-boot:run

# Start Nginx
sudo nginx -s reload

# Test HTTPS
curl -k https://localhost/api/profile
```

**Deliverables**:
- ✅ API accessible via HTTPS
- ✅ TLS encryption working
- ✅ Reverse proxy configured

---

## 12. Step-by-Step Implementation Guide

### Setting Up HTTPS for Spring Boot API

**Step 1**: Generate keystore
```bash
keytool -genkeypair -alias tomcat -keyalg RSA -keysize 2048 \
  -storetype PKCS12 -keystore keystore.p12 -validity 365
```

**Step 2**: Configure Spring Boot
```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: changeit
    key-store-type: PKCS12
```

**Step 3**: Test HTTPS endpoint
```bash
curl -k https://localhost:8443/api/profile
```

---

## 13. Interview & System Design Insights

### Common Interview Questions

**Q: Why use a reverse proxy instead of HTTPS directly in Spring Boot?**

**A**: 
- **Separation of concerns**: Nginx handles TLS, Spring Boot handles business logic
- **Performance**: Nginx is optimized for SSL/TLS termination
- **Flexibility**: Easy to add multiple backend servers
- **Centralized**: One place to manage certificates

**Q: What's the difference between TLS and SSL?**

**A**: 
- **SSL (Secure Sockets Layer)**: Older, deprecated protocol
- **TLS (Transport Layer Security)**: Modern, secure protocol (SSL 3.0 → TLS 1.0 → TLS 1.3)
- **Current standard**: TLS 1.2 and TLS 1.3

**Q: How does a load balancer improve security?**

**A**:
- **DDoS protection**: Distributes attack traffic
- **SSL termination**: Centralized certificate management
- **Health checks**: Removes unhealthy servers
- **IP filtering**: Can block malicious IPs

### Architectural Trade-offs

**TLS Termination at Load Balancer vs Application**:

| Approach | Pros | Cons |
|----------|------|------|
| **Load Balancer** | Better performance, centralized certs | Traffic unencrypted internally |
| **Application** | End-to-end encryption | More CPU usage, complex cert management |

**Best practice**: TLS termination at load balancer for external traffic, mTLS for internal service communication.

---

## 📚 Next Steps

Now that you understand network security:

1. Learn [Cryptography](./02-cryptography.md) to understand how TLS encryption works
2. Master [Authentication](./03-authentication.md) for user identity
3. Build [Secure APIs](./05-api-security.md) with proper security headers

**Ready to continue?** → [Cryptography Fundamentals](./02-cryptography.md)
