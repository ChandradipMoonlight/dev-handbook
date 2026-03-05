# JWT Token Security

> **Understanding JSON Web Tokens for stateless authentication**

---

## 1. Introduction

**JWT (JSON Web Token)** is a **stateless authentication token**.

**Think of it like**:
- **Movie ticket**: Contains your seat info, no need to check database
- **ID card**: Has your info embedded, just verify it's valid
- **Signed document**: Has signature proving authenticity

**JWT Structure**: `Header.Payload.Signature`

---

## 2. Why This Matters

JWTs enable **stateless authentication**:
- **Scalable**: No server-side session storage
- **Portable**: Token works across multiple services
- **Efficient**: No database lookup per request

---

## 3. JWT Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Decoded**:
- **Header**: `{"alg":"HS256","typ":"JWT"}`
- **Payload**: `{"sub":"1234567890","name":"John Doe","iat":1516239022}`
- **Signature**: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)

---

## 4. Java Implementation

### Generate JWT

```java
@Service
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private long expiration;
    
    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .claim("roles", userDetails.getAuthorities())
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

### Validate JWT in Filter

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        
        String token = getTokenFromRequest(request);
        
        if (token != null && tokenProvider.validateToken(token)) {
            String username = tokenProvider.getUsernameFromToken(token);
            // Load user and set authentication
        }
        
        filterChain.doFilter(request, response);
    }
}
```

---

## 5. Security Best Practices

1. **Use strong secret** (256 bits minimum)
2. **Set expiration** (15 minutes for access tokens)
3. **Use HTTPS** (prevent token theft)
4. **Store securely** (httpOnly cookies for web)
5. **Validate signature** (always verify)
6. **Check expiration** (reject expired tokens)
7. **Include minimal data** (don't store sensitive info)

---

## 6. Common Mistakes

### ❌ Weak Secret
```java
// BAD
String secret = "secret";
```

### ❌ No Expiration
```java
// BAD: Token never expires
Jwts.builder().setSubject(username).signWith(...).compact();
```

### ❌ Storing Sensitive Data
```java
// BAD: Password in token
.claim("password", user.getPassword())
```

---

## 📚 Next Steps

1. Learn [Microservices Security](./09-microservices-security.md) for JWT propagation
2. Master [OAuth2](./07-oauth2.md) for token issuance
3. Build [Secure APIs](./05-api-security.md) with JWT

**Ready to continue?** → [Microservices Security](./09-microservices-security.md)
