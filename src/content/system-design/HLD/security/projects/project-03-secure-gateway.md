# Project 3: Secure API Gateway

> **Week 4 Project - Centralizing security with API Gateway**

---

## Product Requirements Document (PRD)

### Product Name
**API Gateway Service**

### Objective
Build an API Gateway that centralizes security for multiple microservices, including JWT validation, rate limiting, and request routing.

---

## Features

### Gateway Responsibilities
- **Route requests** to appropriate microservices
- **Validate JWT** tokens before forwarding
- **Rate limiting** to prevent API abuse
- **Request/Response logging** for audit trail
- **CORS policy** enforcement

---

## Endpoints

```
Gateway Endpoints:
  GET    /api/users/*      → Routes to User Service
  GET    /api/orders/*      → Routes to Order Service
  GET    /api/products/*   → Routes to Product Service
```

---

## Security Requirements

### 1. JWT Validation
- Validate JWT token on every request
- Extract user information from token
- Forward user context to microservices

### 2. Rate Limiting
- Per-user rate limiting (100 requests/minute)
- Per-IP rate limiting (1000 requests/hour)
- Redis-based rate limiting for distributed systems

### 3. CORS Policy
- Whitelist specific origins
- Allow only required HTTP methods
- Set appropriate headers

---

## Tech Stack

- **Spring Cloud Gateway**: API Gateway framework
- **Redis**: Rate limiting storage
- **JWT**: Token validation
- **Spring Security**: Security configuration

---

## Architecture

```
Client
  ↓
API Gateway (Spring Cloud Gateway)
  ├─ JWT Validation
  ├─ Rate Limiting (Redis)
  ├─ CORS Policy
  └─ Request Routing
  ↓
Microservices
  ├─ User Service
  ├─ Order Service
  └─ Product Service
```

---

## Implementation Steps

### Step 1: Add Dependencies

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.11.5</version>
    </dependency>
</dependencies>
```

### Step 2: Configure Gateway Routes

**application.yml**:
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://localhost:8081
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
        - id: order-service
          uri: http://localhost:8082
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
        - id: product-service
          uri: http://localhost:8083
          predicates:
            - Path=/api/products/**
          filters:
            - StripPrefix=1
```

### Step 3: Create JWT Validation Filter

```java
@Component
public class JwtValidationFilter implements GatewayFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String token = getTokenFromRequest(request);
        
        if (token == null || !tokenProvider.validateToken(token)) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }
        
        // Add user info to headers for downstream services
        String username = tokenProvider.getUsernameFromToken(token);
        ServerHttpRequest modifiedRequest = request.mutate()
            .header("X-User-Id", username)
            .build();
        
        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }
    
    private String getTokenFromRequest(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
```

### Step 4: Implement Rate Limiting

```java
@Component
public class RateLimitingFilter implements GatewayFilter {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String userId = getUserId(request);
        String key = "rate_limit:" + userId;
        
        String count = redisTemplate.opsForValue().get(key);
        
        if (count == null) {
            redisTemplate.opsForValue().set(key, "1", 60, TimeUnit.SECONDS);
        } else {
            int currentCount = Integer.parseInt(count);
            if (currentCount >= 100) {
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                return response.setComplete();
            }
            redisTemplate.opsForValue().increment(key);
        }
        
        return chain.filter(exchange);
    }
    
    private String getUserId(ServerHttpRequest request) {
        // Extract from JWT or use IP address
        return request.getRemoteAddress().getAddress().getHostAddress();
    }
}
```

### Step 5: Configure CORS

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://example.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### Step 6: Configure Gateway with Filters

**application.yml**:
```yaml
spring:
  cloud:
    gateway:
      default-filters:
        - name: JwtValidationFilter
        - name: RateLimitingFilter
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "https://example.com"
            allowedMethods: "GET,POST,PUT,DELETE"
            allowedHeaders: "Authorization,Content-Type"
```

---

## Testing

### Test Gateway Routing
```bash
# Request through gateway
curl -X GET http://localhost:8080/api/users/123 \
  -H "Authorization: Bearer <token>"

# Gateway validates token and routes to user service
```

### Test Rate Limiting
```bash
# Make 100 requests
for i in {1..101}; do
  curl http://localhost:8080/api/users/123
done

# 101st request should return 429 Too Many Requests
```

---

## Deliverables

✅ **API Gateway** routing requests to microservices  
✅ **JWT validation** before forwarding requests  
✅ **Rate limiting** preventing API abuse  
✅ **CORS policy** configured  

---

## Skills Learned

- ✅ **API Gateway**: Centralized security
- ✅ **JWT Validation**: Token verification
- ✅ **Rate Limiting**: Redis-based throttling
- ✅ **Request Routing**: Microservices routing

---

## Next Steps

After completing this project:
1. Learn [Microservices Security](./../topics/09-microservices-security.md)
2. Build [Microservices Platform](./project-04-microservices-security.md) (Week 6)

**Ready to continue?** → [Microservices Security](./../topics/09-microservices-security.md)
