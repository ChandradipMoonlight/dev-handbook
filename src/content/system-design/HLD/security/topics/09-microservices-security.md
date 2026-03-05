# Microservices Security

> **Securing distributed microservices architectures**

---

## 1. Introduction

**Microservices security** is more complex than monolith security:

- **Multiple services**: Each service needs security
- **Service-to-service**: Services must authenticate each other
- **Token propagation**: JWT tokens passed between services
- **Network security**: mTLS for inter-service communication

---

## 2. Security Challenges

1. **Service Authentication**: How do services trust each other?
2. **Token Propagation**: How to pass user context between services?
3. **Network Security**: How to secure inter-service communication?
4. **Secrets Management**: How to manage credentials securely?

---

## 3. Service-to-Service Authentication

### API Key Authentication

```java
@Service
public class ServiceClient {
    
    @Value("${service.api-key}")
    private String apiKey;
    
    public ResponseEntity<String> callService(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", apiKey);
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();
        
        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }
}
```

### JWT Token Propagation

```java
@Component
public class JwtPropagationFilter implements ClientHttpRequestInterceptor {
    
    @Override
    public ClientHttpResponse intercept(
        HttpRequest request,
        byte[] body,
        ClientHttpRequestExecution execution
    ) throws IOException {
        
        // Get JWT from current request
        String jwt = getCurrentJwt();
        
        if (jwt != null) {
            request.getHeaders().set("Authorization", "Bearer " + jwt);
        }
        
        return execution.execute(request, body);
    }
    
    private String getCurrentJwt() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken) {
            return ((JwtAuthenticationToken) auth).getToken().getTokenValue();
        }
        return null;
    }
}
```

---

## 4. mTLS (Mutual TLS)

**Both client and server authenticate each other**:

```
Service A                    Service B
    │                            │
    │─── Client Certificate ────>│
    │<── Server Certificate ────│
    │                            │
    │─── Encrypted Request ────>│
    │<── Encrypted Response ────│
```

### Spring Boot mTLS Configuration

```java
@Configuration
public class MTLSSecurityConfig {
    
    @Bean
    public RestTemplate restTemplate() throws Exception {
        SSLContext sslContext = SSLContextBuilder
            .create()
            .loadKeyMaterial(
                keyStore.getResource().getInputStream(),
                keyStorePassword.toCharArray(),
                keyPassword.toCharArray()
            )
            .loadTrustMaterial(
                trustStore.getResource().getInputStream(),
                trustStorePassword.toCharArray()
            )
            .build();
        
        HttpClient httpClient = HttpClients.custom()
            .setSSLContext(sslContext)
            .build();
        
        HttpComponentsClientHttpRequestFactory factory = 
            new HttpComponentsClientHttpRequestFactory(httpClient);
        
        return new RestTemplate(factory);
    }
}
```

---

## 5. Service Mesh Security

**Istio/Linkerd** provide automatic mTLS:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT
```

**Benefits**:
- **Automatic mTLS**: No code changes needed
- **Policy enforcement**: Centralized security policies
- **Traffic encryption**: All inter-service traffic encrypted

---

## 6. Architecture Example

```
Client
  ↓ (JWT)
API Gateway
  ├─ JWT Validation
  └─ Token Propagation
  ↓
Microservice A
  ├─ Validate JWT
  ├─ Extract User Info
  └─ Call Microservice B (with JWT)
  ↓ (mTLS + JWT)
Microservice B
  ├─ Validate mTLS
  ├─ Validate JWT
  └─ Process Request
```

---

## 7. Best Practices

1. **Use mTLS** for inter-service communication
2. **Propagate JWT** for user context
3. **Validate tokens** in each service
4. **Use service mesh** for automatic security
5. **Manage secrets** securely (Vault, AWS Secrets Manager)
6. **Network policies** to restrict communication
7. **Monitor** security events across services

---

## 📚 Next Steps

1. Learn [Cloud Security](./10-cloud-security.md) for deployment
2. Master [Container Security](./11-container-security.md) for containers
3. Build [Enterprise Platform](./projects/project-05-enterprise-platform.md)

**Ready to continue?** → [Cloud Security](./10-cloud-security.md)
