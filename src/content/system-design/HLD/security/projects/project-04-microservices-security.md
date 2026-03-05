# Project 4: Microservices Secure Platform

> **Week 6 Project - Building secure microservices with JWT and mTLS**

---

## Product Requirements Document (PRD)

### Product Name
**Secure Microservices Platform**

### Objective
Split a monolith into microservices with secure inter-service communication using JWT token propagation and mTLS.

---

## Services

```
1. User Service      - User management
2. Order Service     - Order processing
3. Payment Service   - Payment processing
4. Notification Service - Send notifications
```

---

## Architecture

```
Client
  ↓ (JWT)
API Gateway
  ├─ JWT Validation
  └─ Token Propagation
  ↓
User Service
  ├─ Validate JWT
  └─ Call Order Service (with JWT)
  ↓ (mTLS + JWT)
Order Service
  ├─ Validate mTLS
  ├─ Validate JWT
  └─ Call Payment Service
  ↓ (mTLS + JWT)
Payment Service
  ├─ Validate mTLS
  ├─ Validate JWT
  └─ Process Payment
```

---

## Security Requirements

### 1. JWT Validation in Each Service
- Every service validates JWT token
- Extract user information from token
- Enforce authorization based on roles

### 2. Inter-Service Authentication
- Services authenticate each other using mTLS
- Service-to-service communication encrypted
- Service identity verification

### 3. JWT Propagation
- JWT token passed between services
- User context maintained across service calls
- Token validation at each hop

---

## Implementation Steps

### Step 1: Create Service Discovery (Eureka)

**Eureka Server**:
```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

### Step 2: Create User Service

**JWT Validation**:
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

**Call Order Service**:
```java
@Service
public class UserService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public Order createOrderForUser(Long userId, OrderRequest request) {
        // Get JWT from current context
        String jwt = getCurrentJwt();
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwt);
        
        HttpEntity<OrderRequest> entity = new HttpEntity<>(request, headers);
        
        return restTemplate.postForObject(
            "http://order-service/api/orders",
            entity,
            Order.class
        );
    }
}
```

### Step 3: Configure mTLS

**Keystore Configuration**:
```java
@Configuration
public class MTLSConfig {
    
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

### Step 4: JWT Propagation Filter

```java
@Component
public class JwtPropagationInterceptor implements ClientHttpRequestInterceptor {
    
    @Override
    public ClientHttpResponse intercept(
        HttpRequest request,
        byte[] body,
        ClientHttpRequestExecution execution
    ) throws IOException {
        
        // Get JWT from current security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken) {
            String token = ((JwtAuthenticationToken) auth).getToken().getTokenValue();
            request.getHeaders().set("Authorization", "Bearer " + token);
        }
        
        return execution.execute(request, body);
    }
}
```

### Step 5: Service-to-Service Security

**Order Service receives request**:
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public Order createOrder(@RequestBody OrderRequest request) {
        // JWT already validated by filter
        String userId = getCurrentUserId();
        return orderService.createOrder(userId, request);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public Order getOrder(@PathVariable Long id) {
        // Resource-level authorization
        Order order = orderService.getOrder(id);
        if (!order.getUserId().equals(getCurrentUserId())) {
            throw new AccessDeniedException();
        }
        return order;
    }
}
```

---

## Testing

### Test JWT Propagation
```bash
# 1. Login and get JWT
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login ...)

# 2. Call User Service
curl http://localhost:8081/api/users/123 \
  -H "Authorization: Bearer $TOKEN"

# 3. User Service calls Order Service with same JWT
# Order Service validates JWT and processes request
```

### Test mTLS
```bash
# Services communicate over HTTPS with mutual authentication
# Both client and server certificates validated
```

---

## Deliverables

✅ **Microservices** with JWT validation  
✅ **Inter-service authentication** using mTLS  
✅ **JWT propagation** between services  
✅ **Secure communication** between all services  

---

## Skills Learned

- ✅ **Microservices Security**: Securing distributed systems
- ✅ **JWT Propagation**: Passing tokens between services
- ✅ **mTLS**: Mutual TLS authentication
- ✅ **Service-to-Service Auth**: Secure inter-service communication

---

## Next Steps

After completing this project:
1. Learn [Enterprise Architecture](./../topics/12-enterprise-security-architecture.md)
2. Build [Enterprise Platform](./project-05-enterprise-platform.md) (Week 8)

**Ready to continue?** → [Enterprise Security Architecture](./../topics/12-enterprise-security-architecture.md)
