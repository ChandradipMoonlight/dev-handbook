# Project 2: Authentication Service

> **Week 2 Project - Building secure authentication with JWT tokens**

---

## Product Requirements Document (PRD)

### Product Name
**Auth Service**

### Objective
Implement a secure authentication system with user registration, login, and JWT token generation.

---

## Features

- **User Registration**: Create new user account
- **User Login**: Authenticate with username/password
- **JWT Token Generation**: Generate secure tokens for authenticated users
- **Token Validation**: Validate tokens on protected endpoints

---

## Endpoints

```
POST   /api/auth/register  - Register new user
POST   /api/auth/login      - Login and get JWT token
GET    /api/auth/me         - Get current user (protected)
POST   /api/auth/refresh    - Refresh access token
```

---

## Security Requirements

### 1. Password Hashing
- Use **BCrypt** for password hashing
- Cost factor: 12 (recommended)
- Never store plain text passwords

### 2. JWT Token Signing
- Sign tokens with **HS256** algorithm
- Use strong secret key (256 bits minimum)
- Include user ID and roles in token

### 3. Token Expiration
- Access token: 15 minutes
- Refresh token: 7 days
- Validate expiration on every request

### 4. JWT Payload Example

```json
{
  "sub": "user123",
  "userId": 123,
  "username": "johndoe",
  "roles": ["USER"],
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Tech Stack

- **Spring Boot**: Backend framework
- **Spring Security**: Security framework
- **JWT**: JSON Web Tokens (jjwt library)
- **BCrypt**: Password hashing
- **PostgreSQL**: Database (or H2 for development)

---

## Architecture

```
Client
  ↓ POST /api/auth/register
Auth Service
  ├─ Hash password (BCrypt)
  └─ Save user to database
  ↓
Client
  ↓ POST /api/auth/login
Auth Service
  ├─ Verify password
  ├─ Generate JWT token
  └─ Return token
  ↓
Client
  ↓ GET /api/auth/me (with JWT)
Auth Service
  ├─ Validate JWT token
  ├─ Extract user info
  └─ Return user data
```

---

## Implementation Steps

### Step 1: Add Dependencies

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
    </dependency>
</dependencies>
```

### Step 2: Create User Entity

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash; // BCrypt hash
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();
    
    // Getters and setters
}

public enum Role {
    USER, ADMIN
}
```

### Step 3: Create JWT Service

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
            .claim("roles", user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toList()))
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

### Step 4: Create Authentication Controller

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserDTO> getCurrentUser() {
        String username = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        UserDTO user = authService.getCurrentUser(username);
        return ResponseEntity.ok(user);
    }
}
```

### Step 5: Create Authentication Service

```java
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    public AuthResponse register(RegisterRequest request) {
        // Check if user exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }
        
        // Hash password
        String passwordHash = passwordEncoder.encode(request.getPassword());
        
        // Create user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordHash);
        user.setRoles(Set.of(Role.USER));
        
        user = userRepository.save(user);
        
        // Generate token
        String token = tokenProvider.generateToken(user);
        
        return new AuthResponse(token, user);
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new AuthenticationException("Invalid credentials"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthenticationException("Invalid credentials");
        }
        
        // Generate token
        String token = tokenProvider.generateToken(user);
        
        return new AuthResponse(token, user);
    }
}
```

### Step 6: Configure Spring Security

```java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
    
    @Bean
    public SecurityFilterChain filterChain(
        HttpSecurity http,
        JwtAuthenticationFilter jwtFilter
    ) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/register", "/api/auth/login")
                    .permitAll()
                .requestMatchers("/api/auth/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Step 7: Create JWT Authentication Filter

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

### Step 8: Configure Application

**application.yml**:
```yaml
jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-change-in-production}
  expiration: 900000 # 15 minutes

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/authdb
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
```

---

## Testing

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123!"
  }'
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Deliverables

✅ **User registration** with password hashing  
✅ **User login** with JWT token generation  
✅ **Token validation** on protected endpoints  
✅ **Password security** using BCrypt  

---

## Skills Learned

- ✅ **JWT Tokens**: Stateless authentication
- ✅ **Password Hashing**: BCrypt implementation
- ✅ **Spring Security**: Authentication configuration
- ✅ **Token-based Auth**: Secure API access

---

## Next Steps

After completing this project:
1. Learn [API Security](./../topics/05-api-security.md) for securing APIs
2. Build [OWASP Secure API](./project-03-secure-gateway.md) (Week 3)

**Ready to continue?** → [API Security](./../topics/05-api-security.md)
