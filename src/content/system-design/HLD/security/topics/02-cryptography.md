# Cryptography Fundamentals

> **Understanding how encryption, hashing, and digital signatures work**

---

## 1. Introduction

Think of cryptography like **real-world security**:

- **Encryption**: Like a safe with a lock - only someone with the key can open it
- **Hashing**: Like a fingerprint - unique identifier that can't be reversed
- **Digital Signatures**: Like a notary stamp - proves authenticity and integrity

**Why it matters**: Every secure system uses cryptography:
- **TLS/HTTPS**: Encrypts web traffic
- **JWT tokens**: Signed with cryptography
- **Password storage**: Hashed, never stored in plain text
- **Digital certificates**: Prove server identity

---

## 2. Why This Topic Matters in Enterprise Systems

Most engineers skip cryptography fundamentals — **senior engineers don't**.

### Understanding TLS Internally
- **TLS handshake** uses asymmetric encryption for key exchange
- **TLS communication** uses symmetric encryption for speed
- **Certificate validation** uses digital signatures

**Without understanding**: You can't debug TLS issues or design secure systems.

### Understanding JWT Tokens
- **JWT signing** uses digital signatures (RSA, ECDSA)
- **Token validation** requires understanding cryptographic signatures
- **Token security** depends on proper key management

**Without understanding**: You might use weak algorithms or expose secrets.

### Password Security
- **Password hashing** uses bcrypt, Argon2 (not MD5!)
- **Salt** prevents rainbow table attacks
- **Key derivation** (PBKDF2) for key stretching

**Without understanding**: Passwords get compromised.

---

## 3. Basic Concepts

### Encryption vs Hashing

**Encryption**:
- **Reversible**: Can decrypt to get original data
- **Two-way**: Encrypt → Decrypt
- **Use case**: Protecting data in transit/at rest

```
Plain Text → [Encrypt] → Cipher Text → [Decrypt] → Plain Text
```

**Hashing**:
- **One-way**: Cannot reverse to get original data
- **Deterministic**: Same input always produces same output
- **Use case**: Password storage, data integrity

```
Password → [Hash] → Hash Value (cannot reverse)
```

### Symmetric Encryption

**Same key** for encryption and decryption.

**Real-world analogy**: Like a house key - same key locks and unlocks.

**Example**: AES (Advanced Encryption Standard)

```
Encrypt: Plain Text + Key → Cipher Text
Decrypt: Cipher Text + Key → Plain Text
```

**Use cases**:
- **TLS communication**: Fast encryption of data in transit
- **Database encryption**: Encrypting sensitive fields
- **File encryption**: Encrypting files at rest

### Asymmetric Encryption

**Two keys**: Public key (encrypt) and Private key (decrypt).

**Real-world analogy**: Like a mailbox - anyone can drop mail (public key), only you can open it (private key).

**Example**: RSA, ECC (Elliptic Curve Cryptography)

```
Encrypt: Plain Text + Public Key → Cipher Text
Decrypt: Cipher Text + Private Key → Plain Text
```

**Use cases**:
- **TLS handshake**: Key exchange
- **Digital signatures**: Signing documents
- **JWT signing**: Signing tokens

---

## 4. Intermediate Concepts

### AES (Advanced Encryption Standard)

**Symmetric encryption algorithm** - most widely used.

**Key sizes**: 128-bit, 192-bit, 256-bit (256-bit recommended)

**Modes**:
- **AES-CBC**: Cipher Block Chaining (requires IV)
- **AES-GCM**: Galois/Counter Mode (authenticated encryption)

**Java Example**:
```java
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

// Generate AES key
KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
keyGenerator.init(256);
SecretKey secretKey = keyGenerator.generateKey();

// Encrypt
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, secretKey);
byte[] encrypted = cipher.doFinal("Hello World".getBytes());
```

### RSA (Rivest-Shamir-Adleman)

**Asymmetric encryption algorithm**.

**Key sizes**: 2048-bit (minimum), 4096-bit (recommended)

**Use cases**:
- **TLS certificates**: Server authentication
- **JWT signing**: Signing tokens
- **Key exchange**: Encrypting symmetric keys

**Java Example**:
```java
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import javax.crypto.Cipher;

// Generate RSA key pair
KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
keyGen.initialize(2048);
KeyPair keyPair = keyGen.generateKeyPair();

// Encrypt with public key
Cipher cipher = Cipher.getInstance("RSA");
cipher.init(Cipher.ENCRYPT_MODE, keyPair.getPublic());
byte[] encrypted = cipher.doFinal("Hello World".getBytes());

// Decrypt with private key
cipher.init(Cipher.DECRYPT_MODE, keyPair.getPrivate());
byte[] decrypted = cipher.doFinal(encrypted);
```

### Hashing Algorithms

**SHA-256** (Secure Hash Algorithm):
- **Output**: 256 bits (32 bytes)
- **Use case**: Data integrity, blockchain
- **Properties**: One-way, deterministic, avalanche effect

**SHA-512**:
- **Output**: 512 bits (64 bytes)
- **Use case**: When stronger security needed

**Java Example**:
```java
import java.security.MessageDigest;

MessageDigest digest = MessageDigest.getInstance("SHA-256");
byte[] hash = digest.digest("Hello World".getBytes());
// Result: 64-character hex string
```

### Password Hashing

**Never use MD5 or SHA-256 for passwords!** Use specialized password hashing:

**BCrypt**:
- **Adaptive**: Can increase cost factor over time
- **Salt**: Automatically generates and stores salt
- **Slow**: Designed to be slow (prevents brute force)

**Argon2**:
- **Modern**: Winner of Password Hashing Competition
- **Memory-hard**: Resistant to GPU/ASIC attacks
- **Configurable**: Time, memory, parallelism parameters

**Java Example (BCrypt)**:
```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
String hashedPassword = encoder.encode("myPassword");

// Verify
boolean matches = encoder.matches("myPassword", hashedPassword);
```

---

## 5. Advanced Concepts

### Digital Signatures

**Purpose**: Prove authenticity and integrity of data.

**How it works**:
1. **Sign**: Hash data + encrypt hash with private key = signature
2. **Verify**: Decrypt signature with public key = hash, compare with data hash

```
Sign:   Data → Hash → Encrypt with Private Key → Signature
Verify: Data → Hash → Compare with Decrypted Signature
```

**Use cases**:
- **JWT tokens**: Sign tokens to prevent tampering
- **TLS certificates**: Prove certificate authenticity
- **Code signing**: Verify software authenticity

**Java Example**:
```java
import java.security.Signature;
import java.security.KeyPair;
import java.security.KeyPairGenerator;

// Generate key pair
KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
keyGen.initialize(2048);
KeyPair keyPair = keyGen.generateKeyPair();

// Sign
Signature signature = Signature.getInstance("SHA256withRSA");
signature.initSign(keyPair.getPrivate());
signature.update("Hello World".getBytes());
byte[] signatureBytes = signature.sign();

// Verify
signature.initVerify(keyPair.getPublic());
signature.update("Hello World".getBytes());
boolean isValid = signature.verify(signatureBytes);
```

### PKI (Public Key Infrastructure)

**System for managing digital certificates**.

**Components**:
- **CA (Certificate Authority)**: Issues and signs certificates
- **Certificate**: Contains public key + identity + CA signature
- **Certificate Chain**: Root CA → Intermediate CA → Server Certificate

**Example**:
```
Root CA Certificate
  ↓ (signed by)
Intermediate CA Certificate
  ↓ (signed by)
Server Certificate (example.com)
```

### Key Exchange (Diffie-Hellman)

**Problem**: How do two parties agree on a shared secret over insecure channel?

**Solution**: Diffie-Hellman key exchange

**How it works**:
1. Alice and Bob agree on public parameters (g, p)
2. Alice generates private key (a), sends g^a mod p
3. Bob generates private key (b), sends g^b mod p
4. Both compute shared secret: (g^b)^a = (g^a)^b

**Use case**: TLS handshake uses Diffie-Hellman for key exchange.

---

## 6. Internal Working / Deep Dive

### How TLS Uses Cryptography

**TLS Handshake**:
```
1. ClientHello
   - Supported cipher suites
   - Random number

2. ServerHello
   - Selected cipher suite
   - Server certificate (RSA public key)
   - Random number

3. Key Exchange
   - Client generates pre-master secret
   - Encrypts with server's public key (RSA)
   - Sends to server

4. Both compute session keys
   - Pre-master secret + random numbers
   - Derive symmetric keys (AES)

5. Secure Communication
   - All data encrypted with AES
   - Authenticated with HMAC
```

**Why this design?**
- **Asymmetric (RSA)**: Secure key exchange (slow, but only once)
- **Symmetric (AES)**: Fast data encryption (used for all communication)

### How JWT Uses Cryptography

**JWT Structure**:
```
Header.Payload.Signature
```

**Signing Process**:
```
1. Create header + payload
2. Base64 encode both
3. Create signature:
   Signature = HMAC-SHA256(
     base64UrlEncode(header) + "." + base64UrlEncode(payload),
     secret
   )
4. JWT = header.payload.signature
```

**Verification Process**:
```
1. Split JWT into header.payload.signature
2. Recompute signature using secret
3. Compare with provided signature
4. If match → token is valid and untampered
```

### How Password Hashing Works (BCrypt)

**BCrypt Process**:
```
1. Generate random salt (128 bits)
2. Combine password + salt
3. Hash with Blowfish cipher (cost factor rounds)
4. Store: $2a$cost$salt+hash
```

**Cost Factor**: Number of iterations (2^cost)
- **Cost 10**: 2^10 = 1024 iterations
- **Cost 12**: 2^12 = 4096 iterations (recommended)
- **Cost 15**: 2^15 = 32768 iterations (very secure, slower)

**Why slow is good**: Prevents brute force attacks.

---

## 7. Java Implementation Examples

### Complete Encryption Example

```java
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;

public class EncryptionService {
    
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;
    
    public byte[] encrypt(String plaintext, SecretKey key) throws Exception {
        byte[] iv = new byte[GCM_IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv);
        
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec parameterSpec = new GCMParameterSpec(
            GCM_TAG_LENGTH * 8, iv
        );
        cipher.init(Cipher.ENCRYPT_MODE, key, parameterSpec);
        
        byte[] cipherText = cipher.doFinal(plaintext.getBytes("UTF-8"));
        
        // Prepend IV to ciphertext
        ByteBuffer byteBuffer = ByteBuffer.allocate(
            iv.length + cipherText.length
        );
        byteBuffer.put(iv);
        byteBuffer.put(cipherText);
        return byteBuffer.array();
    }
    
    public String decrypt(byte[] cipherText, SecretKey key) throws Exception {
        ByteBuffer byteBuffer = ByteBuffer.wrap(cipherText);
        
        byte[] iv = new byte[GCM_IV_LENGTH];
        byteBuffer.get(iv);
        
        byte[] cipherTextOnly = new byte[byteBuffer.remaining()];
        byteBuffer.get(cipherTextOnly);
        
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec parameterSpec = new GCMParameterSpec(
            GCM_TAG_LENGTH * 8, iv
        );
        cipher.init(Cipher.DECRYPT_MODE, key, parameterSpec);
        
        byte[] plaintext = cipher.doFinal(cipherTextOnly);
        return new String(plaintext, "UTF-8");
    }
}
```

### Password Hashing Service

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    
    private final BCryptPasswordEncoder encoder = 
        new BCryptPasswordEncoder(12); // Cost factor 12
    
    public String hashPassword(String plainPassword) {
        return encoder.encode(plainPassword);
    }
    
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return encoder.matches(plainPassword, hashedPassword);
    }
}
```

### JWT Signing Example

```java
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;

public class JwtService {
    
    private final SecretKey secretKey = Keys.secretKeyFor(
        SignatureAlgorithm.HS256
    );
    
    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(secretKey)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

---

## 8. Common Security Mistakes

### ❌ Mistake 1: Using MD5 for Passwords

**Problem**:
```java
// BAD: MD5 is broken and fast
MessageDigest md = MessageDigest.getInstance("MD5");
byte[] hash = md.digest(password.getBytes());
```

**Fix**: Use BCrypt or Argon2
```java
// GOOD: BCrypt is designed for passwords
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
String hash = encoder.encode(password);
```

### ❌ Mistake 2: Weak Encryption Keys

**Problem**:
```java
// BAD: 128-bit key (weak)
KeyGenerator keyGen = KeyGenerator.getInstance("AES");
keyGen.init(128);
```

**Fix**: Use 256-bit keys
```java
// GOOD: 256-bit key
keyGen.init(256);
```

### ❌ Mistake 3: Storing Keys in Code

**Problem**:
```java
// BAD: Hardcoded key
String secretKey = "my-secret-key-12345";
```

**Fix**: Use environment variables or secrets manager
```java
// GOOD: From environment
String secretKey = System.getenv("JWT_SECRET_KEY");
```

### ❌ Mistake 4: No Salt in Hashing

**Problem**:
```java
// BAD: No salt (vulnerable to rainbow tables)
MessageDigest digest = MessageDigest.getInstance("SHA-256");
byte[] hash = digest.digest(password.getBytes());
```

**Fix**: Use BCrypt (automatic salt) or add salt manually
```java
// GOOD: BCrypt handles salt automatically
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
```

### ❌ Mistake 5: Weak JWT Secret

**Problem**:
```java
// BAD: Short, predictable secret
String secret = "secret";
```

**Fix**: Use strong, random secret
```java
// GOOD: 256-bit random key
SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
```

---

## 9. Real Enterprise Architecture Example

### How Netflix Uses Cryptography

**TLS Communication**:
```
Client → TLS 1.3 (AES-256-GCM) → Netflix API
```

**JWT Tokens**:
```
User Login → OAuth2 Server → JWT (signed with RSA-2048)
```

**Password Storage**:
```
User Password → BCrypt (cost 12) → Database
```

**Service-to-Service**:
```
Microservice A → mTLS (mutual authentication) → Microservice B
```

**Key Management**:
```
AWS KMS (Key Management Service)
  ├─ TLS Certificates
  ├─ JWT Signing Keys
  └─ Database Encryption Keys
```

---

## 10. Diagrams and Visual Illustrations

### Encryption Flow

```
┌─────────────┐
│ Plain Text  │
│ "Hello"     │
└──────┬──────┘
       │
       │ + Encryption Key
       ↓
┌─────────────┐
│  Encrypt    │
│  (AES-256)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Cipher Text │
│ "a3f9b2..." │
└─────────────┘
```

### Asymmetric Encryption

```
┌──────────┐                    ┌──────────┐
│  Alice   │                    │   Bob    │
└────┬─────┘                    └────┬─────┘
     │                                │
     │ 1. Bob's Public Key            │
     │<───────────────────────────────│
     │                                │
     │ 2. Encrypt with Public Key     │
     │    "Hello" → Cipher Text       │
     │                                │
     │ 3. Send Cipher Text             │
     ├───────────────────────────────>│
     │                                │
     │                                │ 4. Decrypt with Private Key
     │                                │    Cipher Text → "Hello"
```

### Digital Signature

```
┌──────────┐
│  Sender  │
└────┬─────┘
     │
     │ 1. Hash Data
     │    "Hello" → Hash
     │
     │ 2. Sign with Private Key
     │    Hash + Private Key → Signature
     │
     │ 3. Send Data + Signature
     │    "Hello" + Signature
     ↓
┌──────────┐
│ Receiver │
└────┬─────┘
     │
     │ 4. Hash Received Data
     │    "Hello" → Hash
     │
     │ 5. Verify Signature
     │    Decrypt Signature with Public Key
     │    Compare with Hash
     │
     │ 6. If match → Valid
```

---

## 11. Mini Practical Project

### Project: Secure Password Storage System

**Problem Statement**: Build a user registration system with secure password hashing.

**Requirements**:
- User registration with password
- Password hashed with BCrypt
- Password verification on login
- Salt automatically managed

**Implementation Steps**:

#### Step 1: User Entity

```java
@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    private String username;
    private String email;
    private String passwordHash; // BCrypt hash
    
    // Getters and setters
}
```

#### Step 2: Password Service

```java
@Service
public class PasswordService {
    private final BCryptPasswordEncoder encoder = 
        new BCryptPasswordEncoder(12);
    
    public String hashPassword(String plainPassword) {
        return encoder.encode(plainPassword);
    }
    
    public boolean verifyPassword(String plainPassword, String hash) {
        return encoder.matches(plainPassword, hash);
    }
}
```

#### Step 3: User Service

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordService passwordService;
    
    public User registerUser(String username, String email, String password) {
        String passwordHash = passwordService.hashPassword(password);
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        
        return userRepository.save(user);
    }
    
    public boolean authenticateUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null) return false;
        
        return passwordService.verifyPassword(password, user.getPasswordHash());
    }
}
```

**Deliverables**:
- ✅ Passwords hashed with BCrypt
- ✅ Salt automatically generated
- ✅ Password verification working

---

## 12. Step-by-Step Implementation Guide

### Implementing AES Encryption

**Step 1**: Generate key
```java
KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
keyGenerator.init(256);
SecretKey key = keyGenerator.generateKey();
```

**Step 2**: Encrypt data
```java
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, key);
byte[] encrypted = cipher.doFinal(data.getBytes());
```

**Step 3**: Decrypt data
```java
cipher.init(Cipher.DECRYPT_MODE, key);
byte[] decrypted = cipher.doFinal(encrypted);
```

---

## 13. Interview & System Design Insights

### Common Interview Questions

**Q: Why use BCrypt instead of SHA-256 for passwords?**

**A**:
- **BCrypt is slow**: Designed to be slow (prevents brute force)
- **SHA-256 is fast**: Can hash millions of passwords per second
- **BCrypt has salt**: Automatically generates and stores salt
- **BCrypt is adaptive**: Can increase cost factor over time

**Q: What's the difference between encryption and hashing?**

**A**:
- **Encryption**: Reversible, two-way (encrypt → decrypt)
- **Hashing**: One-way, cannot reverse
- **Use encryption** for data you need to retrieve (database fields)
- **Use hashing** for passwords (never need original)

**Q: How does TLS use both symmetric and asymmetric encryption?**

**A**:
- **Asymmetric (RSA)**: Used during handshake for key exchange (slow, but only once)
- **Symmetric (AES)**: Used for actual data encryption (fast, used throughout session)
- **Best of both**: Security of asymmetric, speed of symmetric

### Best Practices

1. **Never store passwords in plain text**
2. **Use BCrypt or Argon2 for passwords** (not MD5/SHA)
3. **Use strong keys** (256-bit for AES, 2048-bit+ for RSA)
4. **Store keys securely** (secrets manager, not in code)
5. **Use authenticated encryption** (AES-GCM, not AES-CBC alone)

---

## 📚 Next Steps

Now that you understand cryptography:

1. Learn [Authentication](./03-authentication.md) to see how cryptography is used
2. Master [JWT Security](./08-jwt-security.md) to understand token signing
3. Build [Secure APIs](./05-api-security.md) with proper encryption

**Ready to continue?** → [Authentication Fundamentals](./03-authentication.md)
