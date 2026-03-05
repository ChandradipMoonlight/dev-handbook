# Project 1: Secure HTTPS API Service

> **Week 1 Project - Building a secure API with HTTPS and TLS**

---

## Product Requirements Document (PRD)

### Product Name
**Secure Profile API**

### Objective
Build a simple user profile API secured with HTTPS/TLS encryption.

---

## Features

Users can:
- **Create profile**: Register with name and email
- **View profile**: Retrieve their profile information
- **Update profile**: Modify profile details

---

## Endpoints

```
POST   /api/profile          - Create profile
GET    /api/profile/{id}     - Get profile by ID
PUT    /api/profile/{id}     - Update profile
DELETE /api/profile/{id}     - Delete profile
```

---

## Security Requirements

### 1. HTTPS Enabled
- All API endpoints must use HTTPS
- TLS 1.2 or higher
- Valid SSL certificate

### 2. TLS Certificate
- Self-signed certificate for development
- Production: Certificate from trusted CA (Let's Encrypt, AWS Certificate Manager)

### 3. Reverse Proxy
- Nginx as reverse proxy
- TLS termination at Nginx
- Spring Boot runs on HTTP internally

---

## Tech Stack

- **Backend**: Java + Spring Boot
- **Reverse Proxy**: Nginx
- **TLS Certificate**: Self-signed (dev) / Let's Encrypt (prod)
- **Database**: H2 (for simplicity) or PostgreSQL

---

## Architecture

```
Client (Browser/Postman)
  ↓ HTTPS (443)
Nginx (Reverse Proxy)
  ├─ TLS Termination
  ├─ SSL Certificate
  └─ Request Routing
  ↓ HTTP (8080)
Spring Boot Application
  ├─ REST API
  └─ Database
```

---

## Implementation Steps

### Step 1: Create Spring Boot Project

**Dependencies**:
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
    </dependency>
</dependencies>
```

### Step 2: Create Profile Entity

```java
@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String bio;
    
    // Getters and setters
}
```

### Step 3: Create REST Controller

```java
@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;
    
    @PostMapping
    public ResponseEntity<Profile> createProfile(@RequestBody Profile profile) {
        Profile created = profileService.createProfile(profile);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable Long id) {
        Profile profile = profileService.getProfile(id);
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(
        @PathVariable Long id,
        @RequestBody Profile profile
    ) {
        Profile updated = profileService.updateProfile(id, profile);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Step 4: Generate Self-Signed Certificate

```bash
# Generate private key
openssl genrsa -out key.pem 2048

# Generate certificate
openssl req -new -x509 -key key.pem -out cert.pem -days 365 \
  -subj "/CN=localhost"
```

### Step 5: Configure Nginx

**nginx.conf**:
```nginx
server {
    listen 443 ssl http2;
    server_name localhost;

    # SSL Certificate
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # TLS Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    # Reverse Proxy
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name localhost;
    return 301 https://$server_name$request_uri;
}
```

### Step 6: Configure Spring Boot

**application.yml**:
```yaml
server:
  port: 8080
  forward-headers-strategy: framework

spring:
  application:
    name: secure-profile-api
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
```

### Step 7: Test the API

```bash
# Start Spring Boot
./mvnw spring-boot:run

# Start Nginx
sudo nginx -s reload

# Test HTTPS endpoint
curl -k https://localhost/api/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

---

## Deliverables

✅ **Working API** running on HTTPS (port 443)  
✅ **TLS encryption** protecting all traffic  
✅ **Reverse proxy** configured with Nginx  
✅ **Security headers** added  

---

## Skills Learned

- ✅ **TLS/SSL**: Understanding certificate-based encryption
- ✅ **HTTPS**: Securing HTTP traffic
- ✅ **Reverse Proxy**: Using Nginx for TLS termination
- ✅ **Certificate Management**: Generating and configuring certificates

---

## Next Steps

After completing this project:
1. Learn [Authentication](./../topics/03-authentication.md) for user login
2. Build [Authentication Service](./project-02-auth-service.md) (Week 2)

**Ready to continue?** → [Authentication Fundamentals](./../topics/03-authentication.md)
