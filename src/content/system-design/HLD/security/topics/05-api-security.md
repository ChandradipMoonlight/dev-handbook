# API Security

> **Securing REST APIs from common attacks and vulnerabilities**

---

## 1. Introduction

Think of API security like **bank security**:

- **Authentication**: "Who are you?" (ID check)
- **Authorization**: "What can you access?" (Account access)
- **Rate Limiting**: "How many requests?" (Prevent abuse)
- **Input Validation**: "Is this request safe?" (Check for malicious data)

**API Security** protects your APIs from:
- **Unauthorized access**: Hackers trying to access APIs
- **Data breaches**: Stealing sensitive data
- **DoS attacks**: Overwhelming your API
- **Injection attacks**: SQL injection, XSS

---

## 2. Why This Topic Matters in Enterprise Systems

APIs are the **primary attack surface** in modern applications.

### Fintech Platforms
- **Payment APIs**: Process financial transactions
- **Account APIs**: Access customer financial data
- **Transaction APIs**: Execute trades and transfers

**Without API security**: Hackers can steal money, access accounts, manipulate transactions.

### Large SaaS Systems
- **Customer data APIs**: Access to sensitive customer information
- **Multi-tenant APIs**: Must isolate tenant data
- **Public APIs**: Exposed to internet, high attack risk

**Without API security**: Data breaches, unauthorized access, service disruption.

### Microservices Architectures
- **Service-to-service APIs**: Internal communication
- **Public APIs**: External client access
- **API Gateway**: Central security enforcement point

**Without API security**: Services compromised, data leaked, system breached.

---

## 3. Basic Concepts

### What is API Security?

**API Security** = Protecting APIs from attacks and unauthorized access

**Key components**:
1. **Authentication**: Verify who is making the request
2. **Authorization**: Check what they can access
3. **Input Validation**: Validate all input data
4. **Rate Limiting**: Prevent API abuse
5. **Encryption**: Protect data in transit (HTTPS)
6. **Error Handling**: Don't leak sensitive information

### API Authentication Methods

**Common methods**:

1. **API Keys**: Simple, for service-to-service
   ```
   X-API-Key: abc123xyz789
   ```

2. **JWT Tokens**: Stateless, for user authentication
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **OAuth2**: Delegated authentication
   ```
   Authorization: Bearer <oauth2-access-token>
   ```

### Rate Limiting

**Prevent API abuse** by limiting requests per time period:

```
User → 100 requests/minute → API
User → 101st request → 429 Too Many Requests
```

**Common limits**:
- **Per user**: 100 requests/minute
- **Per IP**: 1000 requests/hour
- **Per API key**: Different limits for different tiers

### CORS (Cross-Origin Resource Sharing)

**Control which domains can access your API**:

```
Browser → API Request from different domain
  ↓
API → Check CORS policy
  ↓
If allowed → Response with CORS headers
If not → Block request
```

**Example**:
```
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Authorization, Content-Type
```

---

## 4. Intermediate Concepts

### OWASP Top 10 API Security Risks

**Must understand and prevent**:

1. **Broken Object Level Authorization**
   - User can access other users' resources
   - Fix: Always check resource ownership

2. **Broken Authentication**
   - Weak authentication, exposed credentials
   - Fix: Strong authentication, secure token storage

3. **Excessive Data Exposure**
   - API returns more data than needed
   - Fix: Return only required fields

4. **Lack of Resources & Rate Limiting**
   - No rate limiting, DoS attacks possible
   - Fix: Implement rate limiting

5. **Broken Function Level Authorization**
   - Missing authorization checks
   - Fix: Check permissions for every endpoint

6. **Mass Assignment**
   - Client can set fields they shouldn't
   - Fix: Whitelist allowed fields

7. **Security Misconfiguration**
   - Default credentials, exposed error messages
   - Fix: Secure configuration, proper error handling

8. **Injection**
   - SQL injection, NoSQL injection, command injection
   - Fix: Parameterized queries, input validation

9. **Improper Assets Management**
   - Old API versions with vulnerabilities
   - Fix: API versioning, deprecate old versions

10. **Insufficient Logging & Monitoring**
    - No security event logging
    - Fix: Log all security events, monitor for attacks

### Input Validation

**Validate all input** to prevent injection attacks:

**What to validate**:
- **Type**: String, number, boolean
- **Format**: Email, phone, date
- **Length**: Min/max length
- **Range**: Min/max values
- **Pattern**: Regex validation
- **Business rules**: Custom validation

**Java Example**:
```java
@PostMapping("/users")
public User createUser(@Valid @RequestBody CreateUserRequest request) {
    // @Valid triggers validation
    return userService.createUser(request);
}

public class CreateUserRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;
    
    @Email
    private String email;
    
    @Min(18)
    @Max(100)
    private Integer age;
}
```

### SQL Injection Prevention

**Never concatenate user input into SQL queries**:

**BAD**:
```java
String query = "SELECT * FROM users WHERE username = '" + username + "'";
// If username = "admin' OR '1'='1"
// Query becomes: SELECT * FROM users WHERE username = 'admin' OR '1'='1'
// Returns all users!
```

**GOOD**: Use parameterized queries
```java
@Query("SELECT u FROM User u WHERE u.username = :username")
User findByUsername(@Param("username") String username);
// JPA automatically parameterizes
```

### CSRF Protection

**Cross-Site Request Forgery** - attacker tricks user into making request.

**Protection**:
- **CSRF tokens**: Include token in forms
- **SameSite cookies**: Prevent cross-site requests
- **Double-submit cookies**: Verify cookie matches token

**Spring Security**:
```java
http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
```

---

## 5. Advanced Concepts

### API Gateway Security

**Centralized security** at API Gateway:

```
Client → API Gateway
  ├─ TLS Termination
  ├─ Authentication (JWT validation)
  ├─ Authorization (Role checking)
  ├─ Rate Limiting
  ├─ Request Validation
  ├─ CORS Policy
  └─ Request Logging
  ↓
Microservices
```

**Benefits**:
- **Centralized**: One place for security
- **Consistent**: Same security for all services
- **Performance**: Offload security from services

### API Versioning

**Manage API changes** without breaking clients:

**URL Versioning**:
```
/api/v1/users
/api/v2/users
```

**Header Versioning**:
```
Accept: application/vnd.api.v1+json
```

**Benefits**:
- **Backward compatibility**: Old clients still work
- **Gradual migration**: Migrate clients over time
- **Security updates**: Fix vulnerabilities in new version

### API Throttling Strategies

**Different throttling for different scenarios**:

1. **Fixed Window**: X requests per minute
2. **Sliding Window**: X requests in last minute
3. **Token Bucket**: Refill tokens over time
4. **Leaky Bucket**: Constant rate, burst allowed

**Implementation**:
```java
@RateLimiter(name = "api")
@GetMapping("/api/data")
public Data getData() {
    return dataService.getData();
}
```

### Security Headers

**HTTP security headers** to protect APIs:

```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

**Spring Security**:
```java
http.headers(headers -> headers
    .contentSecurityPolicy("default-src 'self'")
    .frameOptions().deny()
);
```

---

## 6. Internal Working / Deep Dive

### API Request Flow with Security

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. HTTPS Request
     │    GET /api/users/123
     │    Authorization: Bearer <token>
     ↓
┌─────────────────┐
│  API Gateway    │
└────┬────────────┘
     │
     │ 2. TLS Termination
     │    Decrypt HTTPS
     │
     │ 3. Rate Limiting Check
     │    Is user under limit?
     │    If no → 429 Too Many Requests
     │
     │ 4. JWT Validation
     │    Extract token
     │    Verify signature
     │    Check expiration
     │    If invalid → 401 Unauthorized
     │
     │ 5. Extract User Info
     │    user: { id: 1, roles: ["USER"] }
     │
     │ 6. CORS Check
     │    Is origin allowed?
     │    If no → Block request
     │
     │ 7. Request Validation
     │    Validate path parameters
     │    Validate query parameters
     ↓
┌─────────────────┐
│  Microservice   │
└────┬────────────┘
     │
     │ 8. Authorization Check
     │    Can user access resource?
     │    Is user.id == 123?
     │    If no → 403 Forbidden
     │
     │ 9. Input Validation
     │    Validate request body
     │    If invalid → 400 Bad Request
     │
     │ 10. Business Logic
     │     Process request
     │
     │ 11. Response Filtering
     │     Remove sensitive fields
     ↓
┌──────────┐
│ Response │
│ 200 OK   │
└──────────┘
```

### Rate Limiting Algorithm (Token Bucket)

```
Token Bucket:
  - Capacity: 100 tokens
  - Refill rate: 10 tokens/second
  
Request arrives:
  1. Check if tokens available
  2. If yes: Consume token, allow request
  3. If no: Reject request (429)
  4. Refill tokens over time
```

---

## 7. Java Implementation Examples

### Secure REST Controller

```java
@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> getUser(
        @PathVariable @Min(1) Long id
    ) {
        // Resource-level authorization
        String currentUser = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        
        User user = userService.getUser(id);
        
        // Check ownership
        if (!user.getUsername().equals(currentUser)) {
            throw new AccessDeniedException("Cannot access other user's data");
        }
        
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @RateLimiter(name = "createUser")
    public ResponseEntity<User> createUser(
        @Valid @RequestBody CreateUserRequest request
    ) {
        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UpdateUserRequest request
    ) {
        // Authorization check
        String currentUser = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        
        User user = userService.updateUser(id, request, currentUser);
        return ResponseEntity.ok(user);
    }
}
```

### Input Validation

```java
public class CreateUserRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be 3-50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", 
             message = "Password must contain uppercase, lowercase, and number")
    private String password;
    
    // Getters and setters
}
```

### Rate Limiting with Redis

```java
@Component
public class RateLimitingFilter implements Filter {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Override
    public void doFilter(
        ServletRequest request,
        ServletResponse response,
        FilterChain chain
    ) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String apiKey = httpRequest.getHeader("X-API-Key");
        String key = "rate_limit:" + apiKey;
        
        // Get current count
        String count = redisTemplate.opsForValue().get(key);
        
        if (count == null) {
            // First request, set count to 1, expire in 1 minute
            redisTemplate.opsForValue().set(key, "1", 60, TimeUnit.SECONDS);
        } else {
            int currentCount = Integer.parseInt(count);
            if (currentCount >= 100) {
                // Rate limit exceeded
                HttpServletResponse httpResponse = (HttpServletResponse) response;
                httpResponse.setStatus(429);
                httpResponse.getWriter().write("Rate limit exceeded");
                return;
            }
            // Increment count
            redisTemplate.opsForValue().increment(key);
        }
        
        chain.doFilter(request, response);
    }
}
```

### CORS Configuration

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
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

### Error Handling

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
        ValidationException ex
    ) {
        ErrorResponse error = new ErrorResponse(
            "VALIDATION_ERROR",
            ex.getMessage(),
            HttpStatus.BAD_REQUEST.value()
        );
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
        AccessDeniedException ex
    ) {
        ErrorResponse error = new ErrorResponse(
            "ACCESS_DENIED",
            "You don't have permission to access this resource",
            HttpStatus.FORBIDDEN.value()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
    
    // Don't leak internal errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        // Log full error internally
        logger.error("Internal error", ex);
        
        // Return generic message to client
        ErrorResponse error = new ErrorResponse(
            "INTERNAL_ERROR",
            "An error occurred. Please try again later.",
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

---

## 8. Common Security Mistakes

### ❌ Mistake 1: No Input Validation

**Problem**:
```java
// BAD: No validation
@PostMapping("/users")
public User createUser(@RequestBody Map<String, Object> data) {
    String username = (String) data.get("username");
    // Can be null, empty, or malicious!
}
```

**Fix**: Always validate input
```java
// GOOD: Validation
@PostMapping("/users")
public User createUser(@Valid @RequestBody CreateUserRequest request) {
    // Validated automatically
}
```

### ❌ Mistake 2: SQL Injection

**Problem**:
```java
// BAD: String concatenation
String query = "SELECT * FROM users WHERE username = '" + username + "'";
```

**Fix**: Use parameterized queries
```java
// GOOD: Parameterized
@Query("SELECT u FROM User u WHERE u.username = :username")
User findByUsername(@Param("username") String username);
```

### ❌ Mistake 3: No Rate Limiting

**Problem**: API can be overwhelmed by requests.

**Fix**: Implement rate limiting
```java
@RateLimiter(name = "api")
@GetMapping("/api/data")
public Data getData() {
    return dataService.getData();
}
```

### ❌ Mistake 4: Exposing Sensitive Data

**Problem**:
```java
// BAD: Returns password hash
public class User {
    private String passwordHash; // Exposed in JSON!
}
```

**Fix**: Use DTOs to filter sensitive data
```java
// GOOD: DTO without sensitive fields
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    // No passwordHash!
}
```

### ❌ Mistake 5: Weak CORS Policy

**Problem**:
```java
// BAD: Allow all origins
configuration.setAllowedOrigins(Arrays.asList("*"));
```

**Fix**: Whitelist specific origins
```java
// GOOD: Specific origins
configuration.setAllowedOrigins(Arrays.asList("https://example.com"));
```

---

## 9. Real Enterprise Architecture Example

### Netflix API Security Architecture

```
Internet
  ↓
CloudFlare (DDoS Protection)
  ↓
AWS WAF (Web Application Firewall)
  ├─ SQL Injection Protection
  ├─ XSS Protection
  └─ Rate Limiting
  ↓
API Gateway (Zuul)
  ├─ TLS Termination
  ├─ JWT Validation
  ├─ Rate Limiting (per user)
  ├─ Request Validation
  └─ CORS Policy
  ↓
Microservices
  ├─ Input Validation
  ├─ Authorization Checks
  ├─ Resource-Level Security
  └─ Error Handling
  ↓
Response Filtering
  └─ Remove sensitive fields
```

**Security Layers**:
1. **Edge**: DDoS protection, WAF
2. **Gateway**: Authentication, rate limiting, CORS
3. **Service**: Authorization, input validation
4. **Data**: Encryption, access control

---

## 10. Diagrams and Visual Illustrations

### API Security Layers

```
┌─────────────────────────────────────┐
│         Client Request               │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     1. TLS/HTTPS Encryption         │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     2. Rate Limiting Check          │
│     (Prevent DoS)                    │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     3. Authentication                │
│     (JWT Validation)                 │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     4. Authorization                 │
│     (Permission Check)               │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     5. Input Validation              │
│     (Prevent Injection)              │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     6. Business Logic                │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│     7. Response Filtering            │
│     (Remove Sensitive Data)         │
└─────────────────────────────────────┘
```

---

## 11. Mini Practical Project

### Project: Secure Task Management API

**Problem Statement**: Build a secure REST API for task management with all security best practices.

**Requirements**:
- JWT authentication
- Role-based authorization (ADMIN, USER)
- Input validation
- Rate limiting
- CORS configuration
- SQL injection prevention
- Error handling

**Security Features**:
1. **Authentication**: JWT tokens
2. **Authorization**: Role-based + resource-level
3. **Input Validation**: Bean validation
4. **Rate Limiting**: Redis-based
5. **CORS**: Whitelist specific origins
6. **Error Handling**: Don't leak sensitive info

**Implementation**:

```java
@RestController
@RequestMapping("/api/tasks")
@Validated
public class TaskController {
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    @RateLimiter(name = "getTasks")
    public List<TaskDTO> getTasks() {
        String username = getCurrentUsername();
        return taskService.getUserTasks(username);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @RateLimiter(name = "createTask")
    public ResponseEntity<TaskDTO> createTask(
        @Valid @RequestBody CreateTaskRequest request
    ) {
        TaskDTO task = taskService.createTask(request, getCurrentUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public TaskDTO updateTask(
        @PathVariable @Min(1) Long id,
        @Valid @RequestBody UpdateTaskRequest request
    ) {
        // Resource-level authorization
        return taskService.updateTask(id, request, getCurrentUsername());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTask(@PathVariable @Min(1) Long id) {
        taskService.deleteTask(id);
    }
}
```

**Deliverables**:
- ✅ All security best practices implemented
- ✅ OWASP Top 10 vulnerabilities prevented
- ✅ Production-ready secure API

---

## 12. Step-by-Step Implementation Guide

### Securing a REST API

**Step 1**: Add Spring Security
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**Step 2**: Configure security
```java
@Configuration
public class SecurityConfig {
    // JWT filter, CORS, CSRF configuration
}
```

**Step 3**: Add input validation
```java
@Valid @RequestBody CreateUserRequest request
```

**Step 4**: Implement rate limiting
```java
@RateLimiter(name = "api")
```

**Step 5**: Add error handling
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    // Handle all exceptions securely
}
```

---

## 13. Interview & System Design Insights

### Common Interview Questions

**Q: How do you prevent SQL injection in Java?**

**A**:
- **Use JPA/Hibernate**: Automatically parameterizes queries
- **Use @Query with parameters**: `@Query("SELECT u FROM User u WHERE u.username = :username")`
- **Never concatenate**: Don't build queries with string concatenation
- **Input validation**: Validate all input before using in queries

**Q: What's the difference between authentication and authorization in APIs?**

**A**:
- **Authentication**: "Who are you?" (JWT validation)
- **Authorization**: "What can you do?" (Permission checks)
- **Example**: Login = authentication, accessing admin endpoint = authorization

**Q: How do you implement rate limiting?**

**A**:
- **Token bucket**: Refill tokens over time
- **Sliding window**: Count requests in time window
- **Redis**: Store counts in Redis for distributed systems
- **Per user/IP**: Different limits for different users

### Best Practices

1. **Always use HTTPS** in production
2. **Validate all input** (never trust client data)
3. **Use parameterized queries** (prevent SQL injection)
4. **Implement rate limiting** (prevent DoS)
5. **Check authorization** at multiple layers
6. **Don't leak sensitive data** in errors
7. **Use security headers** (CORS, CSP, etc.)
8. **Log security events** for monitoring
9. **Keep dependencies updated** (prevent vulnerabilities)
10. **Regular security audits** (penetration testing)

---

## 📚 Next Steps

Now that you understand API security:

1. Learn [Spring Security](./06-spring-security.md) for implementation details
2. Master [OAuth2](./07-oauth2.md) for delegated authentication
3. Build [Secure Microservices](./09-microservices-security.md) with API security

**Ready to continue?** → [Spring Security Deep Dive](./06-spring-security.md)
