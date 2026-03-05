# Authentication Fundamentals

> **Verifying who you are - identity verification in enterprise systems**

---

## 1. Introduction

Think of authentication like **airport security**:

- **ID Check**: You show your passport (prove identity)
- **Verification**: Security checks your ID against database
- **Access Granted**: You're allowed into the terminal

**Authentication** answers: **"Who are you?"**

In software:
- **Username + Password**: Most common method
- **API Keys**: For service-to-service authentication
- **Tokens**: JWT, OAuth2 tokens
- **Biometrics**: Fingerprint, face recognition

---

## 2. Why This Topic Matters in Enterprise Systems

Authentication is the **first line of defense** in enterprise systems.

### Fintech Platforms
- **Banking apps**: Verify user identity before allowing transactions
- **Payment systems**: Authenticate before processing payments
- **Trading platforms**: Verify identity before executing trades

**Without authentication**: Anyone can access any account.

### Large SaaS Systems
- **Multi-tenant systems**: Verify which organization user belongs to
- **SSO (Single Sign-On)**: Users authenticate once, access multiple apps
- **API authentication**: Services authenticate to access APIs

**Without authentication**: Data breaches, unauthorized access.

### Microservices Architectures
- **Service authentication**: Services authenticate to each other
- **User authentication**: Users authenticate to access services
- **Token propagation**: JWT tokens passed between services

**Without authentication**: Services can't trust each other.

---

## 3. Basic Concepts

### What is Authentication?

**Authentication** = Verifying identity

**Three factors of authentication**:

1. **Something you know**: Password, PIN
2. **Something you have**: Phone, hardware token, smart card
3. **Something you are**: Fingerprint, face, voice (biometrics)

**Multi-Factor Authentication (MFA)**: Using 2+ factors

### Password Authentication

**Most common method**:

```
User → Enter username + password
  ↓
Server → Verify password (compare with hash)
  ↓
If match → Authenticated
If not → Access denied
```

**Security considerations**:
- **Password hashing**: Never store plain text (use BCrypt)
- **Password strength**: Enforce strong passwords
- **Rate limiting**: Prevent brute force attacks

### API Key Authentication

**For service-to-service authentication**:

```
Service A → Request with API Key
  ↓
Service B → Validate API Key
  ↓
If valid → Authenticated
```

**Example**:
```http
GET /api/users
X-API-Key: abc123xyz789
```

### Token Authentication

**Stateless authentication**:

```
User → Login (username + password)
  ↓
Server → Generate token (JWT)
  ↓
User → Request with token
  ↓
Server → Validate token
  ↓
If valid → Authenticated
```

**Benefits**:
- **Stateless**: No server-side session storage
- **Scalable**: Works across multiple servers
- **Portable**: Token can be used by multiple services

---

## 4. Intermediate Concepts

### JWT (JSON Web Token) Authentication

**JWT Structure**:
```
Header.Payload.Signature
```

**Example**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user123",
    "exp": 1234567890,
    "iat": 1234567890
  },
  "signature": "HMACSHA256(...)"
}
```

**Flow**:
```
1. User logs in → Server generates JWT
2. Client stores JWT (localStorage, cookie)
3. Client sends JWT in Authorization header
4. Server validates JWT signature
5. If valid → Extract user info from payload
```

### OAuth2 Authentication

**Delegated authentication** - allows third-party apps to access resources.

**OAuth2 Roles**:
- **Resource Owner**: User who owns the data
- **Client**: Application requesting access
- **Authorization Server**: Issues tokens
- **Resource Server**: API that has protected resources

**Common Flow (Authorization Code)**:
```
1. User → Client App
2. Client → Redirects to Authorization Server
3. User → Logs in at Authorization Server
4. Authorization Server → Redirects back with code
5. Client → Exchanges code for access token
6. Client → Uses access token to access Resource Server
```

### SAML (Security Assertion Markup Language)

**Enterprise SSO standard**:

```
User → Enterprise App
  ↓
App → Redirects to Identity Provider (IdP)
  ↓
User → Logs in at IdP
  ↓
IdP → Sends SAML assertion (XML)
  ↓
App → Validates SAML assertion
  ↓
User → Authenticated
```

**Use case**: Enterprise SSO with Active Directory, Okta.

### OpenID Connect (OIDC)

**Built on OAuth2** - adds identity layer:

```
OAuth2: Authorization (what can you access?)
OIDC: Authentication (who are you?)
```

**ID Token**: Contains user identity information (JWT format)

---

## 5. Advanced Concepts

### Stateless vs Stateful Authentication

**Stateful (Session-based)**:
```
User → Login
  ↓
Server → Creates session (stores in memory/Redis)
  ↓
Server → Returns session ID (cookie)
  ↓
Client → Sends session ID with requests
  ↓
Server → Looks up session → Gets user info
```

**Pros**: Easy to revoke (delete session)  
**Cons**: Requires session storage, not scalable

**Stateless (Token-based)**:
```
User → Login
  ↓
Server → Generates JWT (signed token)
  ↓
Client → Stores JWT, sends with requests
  ↓
Server → Validates JWT signature → Extracts user info
```

**Pros**: Scalable, no server-side storage  
**Cons**: Harder to revoke (token valid until expiry)

### Token Refresh Pattern

**Problem**: Access tokens expire, user needs to re-authenticate.

**Solution**: Refresh tokens

```
1. Login → Access token (short-lived) + Refresh token (long-lived)
2. Access token expires → Use refresh token to get new access token
3. Refresh token expires → User must login again
```

**Security**: Refresh tokens stored securely, access tokens in memory.

### MFA (Multi-Factor Authentication)

**Two or more authentication factors**:

**Common MFA methods**:
- **SMS OTP**: Code sent to phone
- **TOTP (Time-based OTP)**: Google Authenticator, Authy
- **Hardware tokens**: YubiKey
- **Biometrics**: Fingerprint, face recognition

**Flow**:
```
1. User → Enter username + password (factor 1)
2. Server → Sends OTP to phone (factor 2)
3. User → Enter OTP
4. Server → Validates both factors
5. If valid → Authenticated
```

---

## 6. Internal Working / Deep Dive

### Password Authentication Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Enter username + password
     ↓
┌─────────────────┐
│  Client App     │
└────┬────────────┘
     │
     │ 2. POST /login
     │    { username, password }
     ↓
┌─────────────────┐
│  Auth Server    │
└────┬────────────┘
     │
     │ 3. Lookup user by username
     │
     │ 4. Get stored password hash
     │
     │ 5. Hash input password
     │
     │ 6. Compare hashes
     │
     │ 7. If match:
     │    - Generate JWT token
     │    - Return token
     │
     │ 8. If not match:
     │    - Return 401 Unauthorized
     ↓
┌──────────┐
│ Response │
│ JWT Token│
└──────────┘
```

### JWT Validation Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Request with JWT
     │    Authorization: Bearer <token>
     ↓
┌─────────────────┐
│  API Server     │
└────┬────────────┘
     │
     │ 2. Extract token from header
     │
     │ 3. Split token: header.payload.signature
     │
     │ 4. Verify signature:
     │    - Recompute signature using secret
     │    - Compare with token signature
     │
     │ 5. Check expiration:
     │    - Extract exp from payload
     │    - Compare with current time
     │
     │ 6. If valid:
     │    - Extract user info from payload
     │    - Process request
     │
     │ 7. If invalid:
     │    - Return 401 Unauthorized
```

### OAuth2 Authorization Code Flow

```
┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
│   User   │  │  Client  │  │ Authorization│  │   Resource   │
│          │  │   App    │  │   Server     │  │    Server    │
└────┬─────┘  └────┬─────┘  └──────┬───────┘  └──────┬───────┘
     │             │                │                  │
     │ 1. Click    │                │                  │
     │    "Login"  │                │                  │
     │<────────────│                │                  │
     │             │                │                  │
     │ 2. Redirect │                │                  │
     │    to Auth  │                │                  │
     │    Server   │                │                  │
     │────────────>│                │                  │
     │             │                │                  │
     │             │ 3. User logs in│                  │
     │             │───────────────>│                  │
     │             │                │                  │
     │             │ 4. Authorization Code             │
     │             │<───────────────│                  │
     │             │                │                  │
     │ 5. Redirect │                │                  │
     │    with code│                │                  │
     │<────────────│                │                  │
     │             │                │                  │
     │             │ 6. Exchange code                  │
     │             │    for token   │                  │
     │             │───────────────>│                  │
     │             │                │                  │
     │             │ 7. Access Token                  │
     │             │<───────────────│                  │
     │             │                │                  │
     │             │ 8. Request with│                  │
     │             │    token       │                  │
     │             │──────────────────────────────────>│
     │             │                │                  │
     │             │ 9. Validate   │                  │
     │             │    token       │                  │
     │             │<──────────────────────────────────│
     │             │                │                  │
     │             │ 10. Protected │                  │
     │             │     Resource   │                  │
     │<────────────│<───────────────│                  │
```

---

## 7. Java Implementation Examples

### Password Authentication Service

```java
@Service
public class AuthenticationService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    public AuthenticationResponse authenticate(
        String username, 
        String password
    ) {
        // 1. Find user
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new AuthenticationException("User not found"));
        
        // 2. Verify password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new AuthenticationException("Invalid password");
        }
        
        // 3. Generate JWT token
        String token = jwtTokenProvider.generateToken(user);
        
        return new AuthenticationResponse(token, user);
    }
}
```

### JWT Token Provider

```java
@Service
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private long expiration;
    
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
            .setSubject(user.getUsername())
            .claim("userId", user.getId())
            .claim("roles", user.getRoles())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(secret)
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }
}
```

### JWT Authentication Filter

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        
        String token = getTokenFromRequest(request);
        
        if (token != null && tokenProvider.validateToken(token)) {
            String username = tokenProvider.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
                );
            authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### API Key Authentication

```java
@Component
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private ApiKeyService apiKeyService;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        
        String apiKey = request.getHeader("X-API-Key");
        
        if (apiKey != null) {
            ApiKey key = apiKeyService.validateApiKey(apiKey);
            if (key != null) {
                Authentication authentication = new ApiKeyAuthentication(key);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

---

## 8. Common Security Mistakes

### ❌ Mistake 1: Storing Passwords in Plain Text

**Problem**:
```java
// BAD: Plain text password
user.setPassword(password);
```

**Fix**: Always hash passwords
```java
// GOOD: Hashed password
String hashedPassword = passwordEncoder.encode(password);
user.setPasswordHash(hashedPassword);
```

### ❌ Mistake 2: Weak JWT Secret

**Problem**:
```java
// BAD: Weak secret
String secret = "secret";
```

**Fix**: Use strong, random secret
```java
// GOOD: Strong secret (256 bits)
String secret = System.getenv("JWT_SECRET"); // From environment
```

### ❌ Mistake 3: No Token Expiration

**Problem**:
```java
// BAD: Token never expires
Jwts.builder()
    .setSubject(username)
    // No expiration!
    .signWith(SignatureAlgorithm.HS256, secret)
    .compact();
```

**Fix**: Always set expiration
```java
// GOOD: Token expires
Jwts.builder()
    .setSubject(username)
    .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
    .signWith(SignatureAlgorithm.HS256, secret)
    .compact();
```

### ❌ Mistake 4: Sending Tokens in URL

**Problem**:
```java
// BAD: Token in URL (logged in server logs)
GET /api/users?token=abc123
```

**Fix**: Send token in header
```java
// GOOD: Token in Authorization header
Authorization: Bearer abc123
```

### ❌ Mistake 5: No Rate Limiting on Login

**Problem**: Brute force attacks possible.

**Fix**: Implement rate limiting
```java
@RateLimiter(name = "login")
public AuthenticationResponse login(String username, String password) {
    // Login logic
}
```

---

## 9. Real Enterprise Architecture Example

### Netflix Authentication Architecture

```
User
  ↓
Netflix Web App
  ↓
OAuth2 Authorization Server (Keycloak)
  ├─ User Authentication
  ├─ MFA Support
  └─ JWT Token Generation
  ↓
API Gateway (Zuul)
  ├─ JWT Validation
  └─ Token Propagation
  ↓
Microservices
  ├─ User Service
  ├─ Content Service
  └─ Recommendation Service
```

**Authentication Flow**:
1. User logs in → Keycloak authenticates
2. Keycloak → Issues JWT token
3. Client → Sends JWT to API Gateway
4. Gateway → Validates JWT, forwards to microservices
5. Microservices → Extract user info from JWT

---

## 10. Diagrams and Visual Illustrations

### Authentication Flow Diagram

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Login Request
     │    POST /login
     │    { username, password }
     ↓
┌─────────────────┐
│  Auth Service   │
└────┬────────────┘
     │
     │ 2. Verify Credentials
     │    - Lookup user
     │    - Verify password hash
     │
     │ 3. Generate JWT
     │    - User info
     │    - Roles
     │    - Expiration
     │
     │ 4. Return Token
     ↓
┌──────────┐
│  Client  │
│  (Store) │
└────┬─────┘
     │
     │ 5. API Request
     │    Authorization: Bearer <token>
     ↓
┌─────────────────┐
│  API Gateway    │
└────┬────────────┘
     │
     │ 6. Validate Token
     │    - Verify signature
     │    - Check expiration
     │
     │ 7. Extract User Info
     │
     │ 8. Forward Request
     ↓
┌─────────────────┐
│  Microservice   │
└─────────────────┘
```

---

## 11. Mini Practical Project

### Project: JWT Authentication System

**Problem Statement**: Build a secure authentication system using JWT tokens.

**Requirements**:
- User registration
- User login (password authentication)
- JWT token generation
- Token validation middleware
- Protected API endpoints

**Implementation Steps**:

#### Step 1: User Registration

```java
@PostMapping("/register")
public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    
    User savedUser = userRepository.save(user);
    return ResponseEntity.ok(savedUser);
}
```

#### Step 2: Login Endpoint

```java
@PostMapping("/login")
public ResponseEntity<AuthenticationResponse> login(
    @RequestBody LoginRequest request
) {
    AuthenticationResponse response = authenticationService.authenticate(
        request.getUsername(),
        request.getPassword()
    );
    return ResponseEntity.ok(response);
}
```

#### Step 3: Protected Endpoint

```java
@GetMapping("/profile")
@PreAuthorize("hasRole('USER')")
public ResponseEntity<UserProfile> getProfile() {
    String username = SecurityContextHolder.getContext()
        .getAuthentication().getName();
    User user = userRepository.findByUsername(username).orElseThrow();
    return ResponseEntity.ok(new UserProfile(user));
}
```

**Deliverables**:
- ✅ User registration working
- ✅ Login returns JWT token
- ✅ Protected endpoints validate token
- ✅ User info extracted from token

---

## 12. Step-by-Step Implementation Guide

### Implementing JWT Authentication

**Step 1**: Add dependencies
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.11.5</version>
</dependency>
```

**Step 2**: Create JWT service
```java
@Service
public class JwtTokenProvider {
    // Generate and validate tokens
}
```

**Step 3**: Create authentication filter
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // Extract and validate tokens from requests
}
```

**Step 4**: Configure Spring Security
```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

---

## 13. Interview & System Design Insights

### Common Interview Questions

**Q: What's the difference between authentication and authorization?**

**A**:
- **Authentication**: "Who are you?" (verifying identity)
- **Authorization**: "What can you do?" (checking permissions)
- **Example**: Login = authentication, accessing admin panel = authorization

**Q: Why use JWT instead of sessions?**

**A**:
- **Scalability**: JWT is stateless, works across multiple servers
- **Performance**: No database lookup for each request
- **Portability**: Token can be used by multiple services
- **Trade-off**: Harder to revoke (must wait for expiration)

**Q: How do you handle token revocation with JWT?**

**A**:
- **Token blacklist**: Store revoked tokens in Redis (defeats stateless benefit)
- **Short expiration**: Use short-lived access tokens (15 min) + refresh tokens
- **Token versioning**: Include version in token, invalidate by incrementing version
- **Hybrid approach**: Stateless for most cases, blacklist for critical revocations

### Best Practices

1. **Always hash passwords** (BCrypt, Argon2)
2. **Use HTTPS** for all authentication endpoints
3. **Set token expiration** (short for access tokens, longer for refresh)
4. **Store tokens securely** (httpOnly cookies for web, secure storage for mobile)
5. **Implement rate limiting** on login endpoints
6. **Use strong secrets** for JWT signing
7. **Validate tokens** on every request

---

## 📚 Next Steps

Now that you understand authentication:

1. Learn [Authorization](./04-authorization.md) to control what users can do
2. Master [OAuth2](./07-oauth2.md) for delegated authentication
3. Build [Secure APIs](./05-api-security.md) with authentication

**Ready to continue?** → [Authorization Models](./04-authorization.md)
