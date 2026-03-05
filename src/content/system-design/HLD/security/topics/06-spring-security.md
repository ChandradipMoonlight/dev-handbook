# Spring Security Deep Dive

> **Mastering Spring Security for enterprise application security**

---

## 1. Introduction

**Spring Security** is the de-facto standard for securing Spring applications.

**Think of it like**:
- **Security guard**: Protects your application
- **Access control**: Controls who can enter
- **Authentication**: Verifies identity
- **Authorization**: Checks permissions

**Why Spring Security?**:
- **Comprehensive**: Authentication, authorization, CSRF, CORS, etc.
- **Flexible**: Works with various authentication methods
- **Enterprise-ready**: Used by major companies
- **Well-documented**: Extensive documentation and community

---

## 2. Why This Topic Matters in Enterprise Systems

Spring Security is **essential** for Spring Boot applications.

### Enterprise Applications
- **Authentication**: JWT, OAuth2, SAML
- **Authorization**: Method-level, URL-level, resource-level
- **Security features**: CSRF, CORS, session management

**Without Spring Security**: You'd have to implement all security manually.

### Microservices
- **Service-to-service**: API key authentication
- **User authentication**: JWT token validation
- **Centralized security**: Consistent security across services

---

## 3. Basic Concepts

### Spring Security Architecture

**Core Components**:

1. **Security Filter Chain**: Intercepts all requests
2. **AuthenticationManager**: Handles authentication
3. **UserDetailsService**: Loads user information
4. **PasswordEncoder**: Hashes passwords
5. **SecurityContext**: Stores authentication information

### Security Filter Chain

**Request flow through filters**:

```
Request
  ↓
Security Filter Chain
  ├─ CORS Filter
  ├─ CSRF Filter
  ├─ Authentication Filter
  ├─ Authorization Filter
  └─ Exception Handling Filter
  ↓
Controller
```

### Authentication vs Authorization

**Authentication**: "Who are you?"
- Username/password
- JWT token
- OAuth2 token

**Authorization**: "What can you do?"
- Role-based (RBAC)
- Permission-based
- Resource-level

---

## 4. Intermediate Concepts

### Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // For stateless APIs
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
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

### Method-Level Security

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') and @userService.isOwner(#id, authentication.name)")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
```

### Password Encoding

```java
@Configuration
public class PasswordConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Cost factor 12
    }
}

@Service
public class UserService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User createUser(String username, String password) {
        String hashedPassword = passwordEncoder.encode(password);
        // Store hashed password
    }
    
    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
```

---

## 5. Advanced Concepts

### OAuth2 Resource Server

```java
@Configuration
public class ResourceServerConfig {
    
    @Bean
    public SecurityFilterChain resourceServerFilterChain(HttpSecurity http) throws Exception {
        http
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                )
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").authenticated()
            );
        
        return http.build();
    }
    
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri("https://auth-server/.well-known/jwks.json")
            .build();
    }
}
```

### Custom Authentication Provider

```java
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public Authentication authenticate(Authentication authentication) 
            throws AuthenticationException {
        
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        
        UserDetails user = userDetailsService.loadUserByUsername(username);
        
        if (passwordEncoder.matches(password, user.getPassword())) {
            return new UsernamePasswordAuthenticationToken(
                user, password, user.getAuthorities()
            );
        } else {
            throw new BadCredentialsException("Invalid credentials");
        }
    }
    
    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class
            .isAssignableFrom(authentication);
    }
}
```

### Security Context

```java
@Service
public class UserService {
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            return userRepository.findByUsername(username);
        }
        
        throw new AuthenticationException("User not authenticated");
    }
    
    public boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }
}
```

---

## 6. Common Security Mistakes

### ❌ Mistake 1: Disabling CSRF for Stateful Apps

**Problem**:
```java
http.csrf().disable(); // BAD for stateful apps
```

**Fix**: Keep CSRF enabled for stateful apps, disable only for stateless APIs
```java
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
);
```

### ❌ Mistake 2: Weak Password Encoder

**Problem**:
```java
// BAD: NoOpPasswordEncoder (no encoding!)
@Bean
public PasswordEncoder passwordEncoder() {
    return NoOpPasswordEncoder.getInstance();
}
```

**Fix**: Use BCryptPasswordEncoder
```java
// GOOD: BCrypt with cost factor 12
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}
```

### ❌ Mistake 3: Missing Method Security

**Problem**: Only URL-level security, no method-level checks.

**Fix**: Enable method security
```java
@EnableGlobalMethodSecurity(prePostEnabled = true)
```

---

## 7. Real Enterprise Example

### Netflix Spring Security Setup

```
Request
  ↓
Zuul Gateway (API Gateway)
  ├─ JWT Validation
  └─ Rate Limiting
  ↓
Spring Boot Microservice
  ├─ Spring Security Filter Chain
  ├─ JWT Authentication Filter
  ├─ Method-Level Security
  └─ Resource-Level Authorization
  ↓
Business Logic
```

---

## 8. Best Practices

1. **Use BCryptPasswordEncoder** with cost factor 12+
2. **Enable method security** for fine-grained control
3. **Use JWT for stateless** authentication
4. **Validate tokens** on every request
5. **Check authorization** at multiple layers
6. **Use security headers** (CORS, CSP, etc.)
7. **Log security events** for monitoring
8. **Keep Spring Security updated** for security patches

---

## 📚 Next Steps

1. Learn [OAuth2](./07-oauth2.md) for delegated authentication
2. Master [JWT Security](./08-jwt-security.md) for token-based auth
3. Build [Secure Microservices](./09-microservices-security.md)

**Ready to continue?** → [OAuth2 Security](./07-oauth2.md)
