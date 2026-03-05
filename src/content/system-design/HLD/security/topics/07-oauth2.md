# OAuth2 Security (OAuth 2.0)

> **Complete guide to OAuth 2.0 authorization framework from basic to advanced**

---

## 1. Introduction

**OAuth 2.0 (Open Authorization)** is an authorization framework that allows an application to access resources on behalf of a user **without sharing the user's password**.

**Published by**: Internet Engineering Task Force (IETF) as **RFC 6749** (OAuth 2.0 Authorization Framework)

**Think of it like**:
- **Hotel key card**: You get temporary access without sharing your master key
- **Valet parking**: Someone else can park your car with limited permissions
- **Social login**: "Login with Google" - Google authenticates, you grant access

**OAuth2 is widely used in**:
- **Google Login**: "Sign in with Google"
- **GitHub Login**: "Sign in with GitHub"
- **Enterprise APIs**: Third-party integrations
- **Microservices authentication**: Service-to-service auth
- **Mobile apps**: Secure API access
- **SaaS platforms**: Multi-tenant access control

---

## 2. Why OAuth2 Exists

### The Problem Before OAuth2

**Before OAuth2**, applications often asked users to **share their credentials directly**.

**Example problem**:
> A travel app wants to access your Google contacts to find friends who are traveling.

**Bad approach (without OAuth2)**:
```
Travel App: "Please give us your Google username and password"
User: "Here's my password: mypassword123"
Travel App: Stores password, accesses Google contacts
```

**Problems with this approach**:
1. **Password theft risk**: App has full access to your account
2. **No limited permissions**: App can access everything, not just contacts
3. **Cannot revoke easily**: Must change password to revoke access
4. **Password reuse**: Users might reuse passwords across sites
5. **No audit trail**: Can't see what the app accessed

### How OAuth2 Solves This

**OAuth2 approach**:
```
Travel App: "Please authorize us to access your contacts"
User: Clicks "Allow" on Google's authorization page
Google: Issues a token with limited permissions (only contacts)
Travel App: Uses token to access contacts (no password needed)
```

**Benefits**:
- ✅ **No password sharing**: User never gives password to app
- ✅ **Limited permissions**: Token only grants requested access
- ✅ **Easy revocation**: User can revoke access anytime
- ✅ **Secure**: Tokens can expire and be scoped
- ✅ **Audit trail**: Can track what apps accessed

---

## 3. OAuth2 Key Concept: Delegated Authorization

**OAuth2 introduces delegated authorization**.

**What is delegated authorization?**
> The user (resource owner) **delegates** permission to an application (client) to access their resources on their behalf.

**Example**:
```
User (Resource Owner)
  ↓ (delegates permission)
Travel App (Client)
  ↓ (uses token)
Google Contacts API (Resource Server)
```

**The app receives a token that allows limited access**:

**Example token**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "contacts.readonly",
  "refresh_token": "def50200..."
}
```

**Key point**: The token is **not the password**. It's a temporary, scoped permission that can be revoked.

---

## 4. OAuth2 Roles

OAuth2 defines **four main roles** that interact in the authorization flow.

### Role 1: Resource Owner

**Definition**: The **user** who owns the data or resources.

**Responsibilities**:
- Authenticates with authorization server
- Grants or denies permission to client
- Can revoke access anytime

**Example**:
- You (the user) own your Google contacts
- You decide which apps can access them

### Role 2: Client

**Definition**: The **application** requesting access to resources.

**Types of clients**:
- **Confidential client**: Can securely store client secret (web server app)
- **Public client**: Cannot store secret securely (mobile app, SPA)

**Responsibilities**:
- Requests authorization from resource owner
- Receives authorization code or token
- Uses token to access resource server

**Example**:
- Travel app requesting access to Google contacts

### Role 3: Authorization Server

**Definition**: The **server** that authenticates the user and issues tokens.

**Responsibilities**:
- Authenticates resource owner
- Issues authorization codes
- Exchanges codes for access tokens
- Manages client registrations
- Validates redirect URIs

**Examples**:
- Google OAuth2 server
- GitHub OAuth2 server
- Keycloak
- Auth0
- Okta

### Role 4: Resource Server

**Definition**: The **API server** hosting protected resources.

**Responsibilities**:
- Validates access tokens
- Serves protected resources
- Enforces scope permissions
- Returns resource data

**Example**:
- Google Contacts API
- GitHub API
- Your microservice APIs

### Example Architecture

```
┌──────────────┐
│ Resource     │
│ Owner (User) │
└──────┬───────┘
       │
       │ 1. Wants to use Travel App
       ↓
┌──────────────┐
│   Client     │
│ (Travel App) │
└──────┬───────┘
       │
       │ 2. Redirects to Authorization Server
       ↓
┌──────────────────────┐
│ Authorization Server  │
│    (Google OAuth)     │
└──────┬───────────────┘
       │
       │ 3. User authenticates
       │ 4. Issues token
       ↓
┌──────────────┐
│   Client     │
│ (Travel App) │
└──────┬───────┘
       │
       │ 5. Uses token to access
       ↓
┌──────────────────┐
│ Resource Server   │
│ (Google Contacts)│
└──────────────────┘
```

---

## 5. OAuth2 Tokens

OAuth2 mainly uses **two types of tokens**.

### Access Token

**Purpose**: Used to **access APIs** on behalf of the user.

**Characteristics**:
- **Short-lived**: Typically 15 minutes to 1 hour
- **Limited scope**: Only grants requested permissions
- **Bearer token**: Anyone with token can use it (must use HTTPS)
- **Stateless**: Contains all needed info (JWT format)

**Example request**:
```http
GET /api/contacts HTTP/1.1
Host: api.google.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token payload (JWT)**:
```json
{
  "sub": "user123",
  "aud": "contacts-api",
  "scope": "contacts.readonly",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Security considerations**:
- ✅ **Short expiration**: Limits damage if stolen
- ✅ **Scope-limited**: Can't access more than granted
- ✅ **HTTPS only**: Must be transmitted over TLS
- ✅ **Store securely**: Never in localStorage (use httpOnly cookies)

### Refresh Token

**Purpose**: Used to **get a new access token** when current one expires.

**Characteristics**:
- **Long-lived**: Days, weeks, or months
- **Single use**: Should be rotated on each use
- **Stored securely**: Server-side or secure storage
- **Revocable**: Can be revoked by user or server

**Example flow**:
```
1. Access token expires (after 15 minutes)
2. Client sends refresh token to authorization server
3. Authorization server validates refresh token
4. Server issues new access token (and optionally new refresh token)
5. Client uses new access token
```

**Refresh token request**:
```http
POST /oauth2/token HTTP/1.1
Host: auth-server.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token=def50200...
&client_id=my-client
&client_secret=my-secret
```

**Response**:
```json
{
  "access_token": "new_access_token_here",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "new_refresh_token_here"
}
```

**Why refresh tokens?**
- **Security**: Access tokens are short-lived (less damage if stolen)
- **User experience**: Users don't need to re-authenticate frequently
- **Revocation**: Can revoke refresh token to force re-authentication

---

## 6. OAuth2 Scopes

**Scopes define what the application is allowed to access**.

**Think of scopes as permissions**:
- `read` - Can read data
- `write` - Can write data
- `admin` - Full administrative access

**Example scopes**:
```
scope=contacts.readonly profile.email
```

**This means**:
- ✅ Can read contacts (readonly)
- ✅ Can read email from profile
- ❌ Cannot write contacts
- ❌ Cannot access other profile data

**Example token payload with scopes**:
```json
{
  "sub": "user123",
  "scope": "contacts.readonly profile.email",
  "aud": "api-server",
  "exp": 1234567890
}
```

**Common scope patterns**:
- **Resource.Action**: `contacts.read`, `contacts.write`
- **Resource**: `profile`, `email`, `contacts`
- **Action**: `read`, `write`, `admin`

**Scope best practices**:
1. **Principle of least privilege**: Request minimum required scopes
2. **Be specific**: Use granular scopes (`contacts.read` not `read`)
3. **Document scopes**: Clearly explain what each scope allows
4. **Validate scopes**: Resource server must check scope before allowing access

---

## 7. OAuth2 Authorization Flows

OAuth2 provides **multiple authorization flows** for different use cases.

### Flow Comparison Table

| Flow | Used For | Security Level | When to Use |
|------|----------|----------------|-------------|
| **Authorization Code** | Web applications | ⭐⭐⭐⭐⭐ Highest | Server-side web apps |
| **Authorization Code + PKCE** | Mobile apps, SPAs | ⭐⭐⭐⭐⭐ Highest | Public clients |
| **Client Credentials** | Service-to-service | ⭐⭐⭐⭐ High | Machine-to-machine |
| **Device Flow** | Smart devices, IoT | ⭐⭐⭐⭐ High | Limited input devices |
| **Refresh Token** | Token renewal | ⭐⭐⭐⭐ High | All flows |
| **Implicit** | ❌ Deprecated | ⭐⭐ Low | **Don't use** |
| **Password** | ❌ Not recommended | ⭐ Low | **Don't use** |

---

## 8. Authorization Code Flow (Most Important)

**This is the most secure and widely used flow**.

### Why It's Most Secure

1. **Code exchange**: Authorization code is exchanged server-to-server (not exposed to browser)
2. **Client secret**: Confidential clients can use secret for additional security
3. **Short-lived code**: Authorization code expires quickly (typically 10 minutes)
4. **One-time use**: Code can only be used once

### Step-by-Step Flow

#### Step 1: User Clicks Login

```
User → Travel App
User clicks "Sign in with Google"
```

#### Step 2: Client Redirects User

**Client redirects user to authorization server**:

```
GET https://accounts.google.com/o/oauth2/v2/auth?
  client_id=123456789.apps.googleusercontent.com
  &redirect_uri=https://travel-app.com/callback
  &response_type=code
  &scope=contacts.readonly profile.email
  &state=random_state_string
```

**Parameters explained**:
- `client_id`: Identifies the client application
- `redirect_uri`: Where to send user after authorization
- `response_type=code`: Request authorization code (not token directly)
- `scope`: What permissions are requested
- `state`: CSRF protection (random string, returned in callback)

#### Step 3: User Authenticates

**User enters credentials at authorization server**:

```
┌─────────────────────────────┐
│   Google Authorization      │
│         Server              │
│                             │
│  Email: [user@example.com] │
│  Password: [********]       │
│                             │
│  [ ] Allow access to:      │
│      - Read contacts        │
│      - Read email           │
│                             │
│  [Sign In]  [Cancel]        │
└─────────────────────────────┘
```

#### Step 4: Authorization Code Returned

**Authorization server redirects back with code**:

```
GET https://travel-app.com/callback?
  code=4/0AX4XfWj...
  &state=random_state_string
```

**Important**: 
- Code is **short-lived** (typically 10 minutes)
- Code is **one-time use**
- Code must be **exchanged server-to-server**

#### Step 5: Client Exchanges Code for Token

**Client makes server-to-server request**:

```http
POST https://oauth2.googleapis.com/token HTTP/1.1
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

grant_type=authorization_code
&code=4/0AX4XfWj...
&redirect_uri=https://travel-app.com/callback
&client_id=123456789.apps.googleusercontent.com
&client_secret=GOCSPX-...
```

**Response**:
```json
{
  "access_token": "ya29.a0AfH6SMC...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "1//04...",
  "scope": "contacts.readonly profile.email"
}
```

#### Step 6: Client Calls API

**Client uses access token to call resource server**:

```http
GET https://www.googleapis.com/contacts/v1/people/me/connections HTTP/1.1
Host: www.googleapis.com
Authorization: Bearer ya29.a0AfH6SMC...
```

**Resource server**:
1. Validates token signature
2. Checks token expiration
3. Verifies scope (`contacts.readonly`)
4. Returns contacts data

### Complete Flow Diagram

```
┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
│   User   │  │  Client  │  │ Authorization│  │   Resource   │
│          │  │   App    │  │   Server     │  │    Server    │
└────┬─────┘  └────┬─────┘  └──────┬───────┘  └──────┬───────┘
     │             │                │                  │
     │ 1. Click    │                │                  │
     │    Login    │                │                  │
     │────────────>│                │                  │
     │             │                │                  │
     │             │ 2. Redirect    │                  │
     │             │    to Auth     │                  │
     │             │    Server      │                  │
     │             │───────────────>│                  │
     │             │                │                  │
     │             │ 3. User logs in│                  │
     │             │<───────────────│                  │
     │             │                │                  │
     │ 4. Enter    │                │                  │
     │ credentials │                │                  │
     │────────────>│                │                  │
     │             │                │                  │
     │             │ 5. Authorization Code             │
     │             │<───────────────│                  │
     │             │                │                  │
     │ 6. Redirect │                │                  │
     │    with code│                │                  │
     │<────────────│                │                  │
     │             │                │                  │
     │             │ 7. Exchange code                  │
     │             │    for token   │                  │
     │             │───────────────>│                  │
     │             │                │                  │
     │             │ 8. Access Token                  │
     │             │<───────────────│                  │
     │             │                │                  │
     │             │ 9. Request with│                  │
     │             │    token       │                  │
     │             │──────────────────────────────────>│
     │             │                │                  │
     │             │ 10. Validate   │                  │
     │             │     token      │                  │
     │             │<──────────────────────────────────│
     │             │                │                  │
     │             │ 11. Protected │                  │
     │             │     Resource   │                  │
     │<────────────│<───────────────│                  │
```

---

## 9. Authorization Code Flow with PKCE

**PKCE (Proof Key for Code Exchange)** adds security for **public clients** (mobile apps, SPAs).

### Why PKCE?

**Problem with public clients**:
- Cannot securely store `client_secret`
- Authorization code could be intercepted
- Attacker could exchange code for token

**PKCE solution**:
- Client generates random `code_verifier`
- Client creates `code_challenge` from verifier
- Sends challenge in authorization request
- Sends verifier when exchanging code
- Server verifies challenge matches verifier

### PKCE Flow

#### Step 1: Generate Code Verifier and Challenge

```java
// Generate random code verifier (43-128 characters)
String codeVerifier = generateRandomString(64);

// Create code challenge (SHA256 hash, base64url encoded)
MessageDigest digest = MessageDigest.getInstance("SHA-256");
byte[] hash = digest.digest(codeVerifier.getBytes());
String codeChallenge = Base64.getUrlEncoder().withoutPadding()
    .encodeToString(hash);
```

#### Step 2: Authorization Request with Challenge

```
GET https://accounts.google.com/o/oauth2/v2/auth?
  client_id=123456789.apps.googleusercontent.com
  &redirect_uri=https://travel-app.com/callback
  &response_type=code
  &scope=contacts.readonly
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256
  &state=random_state_string
```

#### Step 3: Exchange Code with Verifier

```http
POST https://oauth2.googleapis.com/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=4/0AX4XfWj...
&redirect_uri=https://travel-app.com/callback
&client_id=123456789.apps.googleusercontent.com
&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

**Server verifies**:
1. Computes SHA256 of `code_verifier`
2. Base64url encodes it
3. Compares with `code_challenge` from step 2
4. If match, issues token

---

## 10. Client Credentials Flow

**For service-to-service authentication** (machine-to-machine).

### When to Use

- **Microservices**: Service A calling Service B
- **Scheduled jobs**: Background tasks accessing APIs
- **Server-to-server**: No user involved

### Flow

```
┌──────────┐                    ┌──────────────┐
│ Service A│                    │ Authorization│
│          │                    │   Server     │
└────┬─────┘                    └──────┬───────┘
     │                                   │
     │ 1. Request Token                  │
     │    (client_id + client_secret)    │
     │──────────────────────────────────>│
     │                                   │
     │                                   │ 2. Validate
     │                                   │    credentials
     │                                   │
     │ 3. Access Token                   │
     │<──────────────────────────────────│
     │                                   │
     │ 4. Use Token to Access API       │
     │──────────────────────────────────>│
```

### Implementation

```java
@Service
public class OAuth2ClientService {
    
    @Value("${oauth2.client-id}")
    private String clientId;
    
    @Value("${oauth2.client-secret}")
    private String clientSecret;
    
    @Value("${oauth2.token-endpoint}")
    private String tokenEndpoint;
    
    public String getAccessToken() {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret);
        
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");
        body.add("scope", "api.read api.write");
        
        HttpEntity<MultiValueMap<String, String>> request = 
            new HttpEntity<>(body, headers);
        
        ResponseEntity<TokenResponse> response = restTemplate.postForEntity(
            tokenEndpoint,
            request,
            TokenResponse.class
        );
        
        return response.getBody().getAccessToken();
    }
}
```

**Token Response**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "api.read api.write"
}
```

**Note**: No refresh token in client credentials flow (tokens are typically longer-lived).

---

## 11. Refresh Token Flow

**Used to get a new access token when current one expires**.

### Flow

```
┌──────────┐                    ┌──────────────┐
│  Client  │                    │ Authorization│
│          │                    │   Server     │
└────┬─────┘                    └──────┬───────┘
     │                                   │
     │ 1. Access Token Expired           │
     │                                   │
     │ 2. Request New Token              │
     │    (refresh_token)               │
     │──────────────────────────────────>│
     │                                   │
     │                                   │ 3. Validate
     │                                   │    refresh token
     │                                   │
     │ 4. New Access Token               │
     │    (and new refresh token)       │
     │<──────────────────────────────────│
```

### Implementation

```java
@Service
public class TokenRefreshService {
    
    public TokenResponse refreshToken(String refreshToken) {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret);
        
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("refresh_token", refreshToken);
        
        HttpEntity<MultiValueMap<String, String>> request = 
            new HttpEntity<>(body, headers);
        
        ResponseEntity<TokenResponse> response = restTemplate.postForEntity(
            tokenEndpoint,
            request,
            TokenResponse.class
        );
        
        return response.getBody();
    }
}
```

**Best Practice**: Rotate refresh tokens (issue new refresh token on each use).

---

## 12. OAuth2 Architecture in Enterprise Systems

**Typical enterprise architecture**:

```
Internet
  ↓
API Gateway (Kong / AWS API Gateway)
  ├─ Validate tokens
  ├─ Extract user info
  └─ Route to services
  ↓
OAuth2 Authorization Server (Keycloak)
  ├─ User authentication
  ├─ Token issuance
  └─ Token validation
  ↓
Microservices (Spring Boot)
  ├─ Validate token scopes
  ├─ Enforce permissions
  └─ Process requests
```

### Component Responsibilities

| Component | Role |
|-----------|------|
| **API Gateway** | Validate tokens, rate limiting, request routing |
| **Authorization Server** | Issue tokens, authenticate users, manage clients |
| **Microservices** | Validate token scopes, enforce business rules |
| **Resource Server** | Serve protected resources based on token |

### Enterprise Flow

```
1. User → API Gateway (with JWT token)
2. Gateway → Validates token with Authorization Server
3. Gateway → Extracts user info, forwards to microservice
4. Microservice → Validates scope, processes request
5. Microservice → Returns response
```

---

## 13. OAuth2 vs Authentication

**Important distinction**: OAuth2 is **authorization**, not **authentication**.

### OAuth2 Answers

**"What can this app access?"** (Authorization)
- Can app read my contacts? ✅
- Can app write to my calendar? ❌
- Can app delete my files? ❌

### Authentication Answers

**"Who is this user?"** (Authentication)
- Is this really John Doe? ✅
- What is John's email? john@example.com
- What are John's roles? USER, PREMIUM

### The Confusion

**OAuth2 is often used for authentication** (like "Login with Google"), but it's actually doing **authorization**:
1. User authenticates with Google (Google knows who they are)
2. Google authorizes the app to access user info
3. App uses that info to authenticate user in its system

### OpenID Connect (OIDC)

**For authentication, we use OpenID Connect (OIDC) on top of OAuth2**.

**OIDC adds**:
- **ID Token**: Contains user identity information (JWT)
- **UserInfo endpoint**: Get user profile information
- **Standard claims**: `sub`, `email`, `name`, etc.

**OAuth2 + OIDC**:
- **OAuth2**: Authorization (what can app access?)
- **OIDC**: Authentication (who is the user?)

**Example ID Token**:
```json
{
  "sub": "user123",
  "email": "john@example.com",
  "name": "John Doe",
  "email_verified": true,
  "iss": "https://accounts.google.com",
  "aud": "my-client-id",
  "exp": 1234567890
}
```

---

## 14. OAuth2 in Microservices

**In microservices architecture**, OAuth2 enables secure service-to-service communication.

### Architecture

```
Client
  ↓ (JWT token)
API Gateway
  ├─ Validates token
  └─ Extracts user info
  ↓
User Service
  ├─ Validates token
  ├─ Extracts user ID
  └─ Calls Order Service (with token)
  ↓ (JWT propagation)
Order Service
  ├─ Validates token
  ├─ Validates scope
  └─ Processes order
```

### Flow

1. **Client logs in** → Gets JWT token from Authorization Server
2. **Auth server issues token** → Contains user info and scopes
3. **Gateway validates token** → Checks signature and expiration
4. **Microservices authorize requests** → Validate scope, enforce permissions

### Token Propagation

**JWT token is passed between services**:

```java
@Service
public class UserService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public Order createOrder(OrderRequest request) {
        // Get JWT from current security context
        Authentication auth = SecurityContextHolder.getContext()
            .getAuthentication();
        
        if (auth instanceof JwtAuthenticationToken) {
            String token = ((JwtAuthenticationToken) auth)
                .getToken().getTokenValue();
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            
            HttpEntity<OrderRequest> entity = 
                new HttpEntity<>(request, headers);
            
            return restTemplate.postForObject(
                "http://order-service/api/orders",
                entity,
                Order.class
            );
        }
        throw new AuthenticationException("No valid token found");
    }
}
```

---

## 15. Java Example (Spring Security OAuth2)

### Resource Server Configuration

**This enables OAuth2 resource server functionality**:

```java
@Configuration
@EnableWebSecurity
public class ResourceServerConfig {
    
    @Bean
    public SecurityFilterChain resourceServerFilterChain(HttpSecurity http) throws Exception {
        http
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasAuthority("SCOPE_admin")
                .requestMatchers("/api/**").hasAuthority("SCOPE_read")
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
    
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(
            "https://auth-server/.well-known/jwks.json"
        ).build();
    }
    
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = 
            new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthorityPrefix("SCOPE_");
        authoritiesConverter.setAuthoritiesClaimName("scope");
        
        JwtAuthenticationConverter authenticationConverter = 
            new JwtAuthenticationConverter();
        authenticationConverter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        
        return authenticationConverter;
    }
}
```

### Protected Controller

```java
@RestController
@RequestMapping("/api/contacts")
public class ContactsController {
    
    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_contacts.read')")
    public List<Contact> getContacts() {
        // Extract user from JWT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        return contactService.getContacts(username);
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_contacts.write')")
    public Contact createContact(@RequestBody Contact contact) {
        return contactService.createContact(contact);
    }
}
```

### OAuth2 Client Configuration

```java
@Configuration
public class OAuth2ClientConfig {
    
    @Bean
    public OAuth2AuthorizedClientService authorizedClientService() {
        return new InMemoryOAuth2AuthorizedClientService(clientRegistrationRepository());
    }
    
    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        ClientRegistration registration = ClientRegistration
            .withRegistrationId("google")
            .clientId("your-client-id")
            .clientSecret("your-client-secret")
            .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
            .scope("openid", "profile", "email", "contacts.readonly")
            .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
            .tokenUri("https://oauth2.googleapis.com/token")
            .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
            .userNameAttributeName(IdTokenClaimNames.SUB)
            .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
            .clientName("Google")
            .build();
        
        return new InMemoryClientRegistrationRepository(registration);
    }
}
```

---

## 16. OAuth2 Authorization Server

**Authorization servers issue tokens** and manage client registrations.

### Popular Implementations

1. **Keycloak** (Open-source)
   - Full-featured IAM
   - OAuth2 + OIDC support
   - User federation
   - Social login

2. **Auth0** (SaaS)
   - Managed service
   - Easy integration
   - Social login
   - MFA support

3. **Spring Authorization Server** (Open-source)
   - Spring-based
   - Full OAuth2 support
   - Customizable

4. **Okta** (Enterprise)
   - Enterprise SSO
   - Identity management
   - API access management

### Keycloak Setup Example

**Docker Compose**:
```yaml
version: '3.8'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: keycloak
    ports:
      - "8080:8080"
    command: start-dev
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: keycloak
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Spring Authorization Server Example

```java
@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Bean
    public RegisteredClientRepository registeredClientRepository() {
        RegisteredClient client = RegisteredClient.withId(UUID.randomUUID().toString())
            .clientId("my-client")
            .clientSecret(passwordEncoder.encode("my-secret"))
            .clientAuthenticationMethod(
                ClientAuthenticationMethod.CLIENT_SECRET_BASIC
            )
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
            .redirectUri("http://localhost:3000/callback")
            .scope("read")
            .scope("write")
            .clientSettings(ClientSettings.builder()
                .requireAuthorizationConsent(true)
                .build())
            .build();
        
        return new InMemoryRegisteredClientRepository(client);
    }
    
    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder()
            .issuer("http://localhost:9000")
            .authorizationEndpoint("/oauth2/authorize")
            .tokenEndpoint("/oauth2/token")
            .tokenIntrospectionEndpoint("/oauth2/introspect")
            .tokenRevocationEndpoint("/oauth2/revoke")
            .jwkSetEndpoint("/oauth2/jwks")
            .build();
    }
}
```

### Example Flow

```
1. Client Registration
   Client → Registers with Authorization Server
   Receives: client_id, client_secret

2. Authorization Request
   User → Client App
   Client → Redirects to Authorization Server
   URL: /oauth2/authorize?client_id=...&redirect_uri=...&scope=...

3. User Authentication
   User → Logs in at Authorization Server
   Authorization Server → Validates credentials

4. User Consent
   Authorization Server → Shows consent screen
   User → Approves requested scopes

5. Authorization Code
   Authorization Server → Redirects with code
   URL: /callback?code=4/0AX4XfWj...

6. Token Exchange
   Client → Exchanges code for token
   POST /oauth2/token
   Body: grant_type=authorization_code&code=...

7. Token Response
   Authorization Server → Returns tokens
   {
     "access_token": "...",
     "refresh_token": "...",
     "expires_in": 3600
   }
```

---

## 17. Security Best Practices

**Enterprise systems must follow these practices**:

### 1. Use Short-Lived Tokens

**Access tokens should expire quickly** (15 minutes to 1 hour):

```java
// GOOD: Short-lived access token
{
  "access_token": "...",
  "expires_in": 900,  // 15 minutes
  "refresh_token": "..."
}
```

**Why?**
- Limits damage if token is stolen
- Forces regular token refresh
- Better security posture

### 2. Use Refresh Tokens

**For long-lived sessions, use refresh tokens**:

```java
// Access token expires, use refresh token to get new one
POST /oauth2/token
grant_type=refresh_token
&refresh_token=...
```

**Best practices**:
- Rotate refresh tokens (issue new one on each use)
- Store refresh tokens securely (server-side)
- Revoke refresh tokens on logout

### 3. Use HTTPS Only

**OAuth2 must run over TLS**:

```java
// BAD: HTTP (insecure)
http://auth-server/oauth2/authorize

// GOOD: HTTPS (secure)
https://auth-server/oauth2/authorize
```

**Why?**
- Tokens transmitted in headers/URLs
- HTTPS encrypts all traffic
- Prevents man-in-the-middle attacks

### 4. Use PKCE for Public Clients

**PKCE protects mobile apps and SPAs**:

```java
// Generate code verifier and challenge
String codeVerifier = generateRandomString(64);
String codeChallenge = sha256(codeVerifier);

// Include in authorization request
GET /oauth2/authorize?
  code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256
```

**Why?**
- Prevents authorization code interception
- Required for public clients (mobile, SPA)
- Adds security layer

### 5. Validate Redirect URIs

**Always validate redirect URIs**:

```java
// Authorization server must validate
if (!isValidRedirectUri(clientId, redirectUri)) {
    throw new InvalidRedirectUriException();
}
```

**Why?**
- Prevents open redirect attacks
- Ensures tokens go to correct client
- Security requirement

### 6. Scope Permissions Properly

**Request minimum required scopes**:

```java
// BAD: Requesting too many scopes
scope=read write admin delete

// GOOD: Requesting only needed scopes
scope=contacts.readonly
```

**Why?**
- Principle of least privilege
- Users more likely to approve
- Better security

### 7. Store Tokens Securely

**Never store tokens in localStorage** (for web apps):

```java
// BAD: localStorage (XSS vulnerable)
localStorage.setItem('token', accessToken);

// GOOD: httpOnly cookie (XSS safe)
Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict
```

**For mobile apps**:
- Use secure storage (Keychain, Keystore)
- Never log tokens
- Clear tokens on app uninstall

### 8. Validate Tokens on Resource Server

**Always validate tokens**:

```java
@Bean
public JwtDecoder jwtDecoder() {
    return NimbusJwtDecoder.withJwkSetUri(
        authorizationServerJwkSetUri
    ).build();
}
```

**Validation checks**:
- ✅ Signature verification
- ✅ Expiration check
- ✅ Issuer validation
- ✅ Audience validation
- ✅ Scope validation

### 9. Implement Token Revocation

**Allow users to revoke tokens**:

```java
POST /oauth2/revoke
Content-Type: application/x-www-form-urlencoded

token=...&token_type_hint=access_token
```

**Why?**
- Users can revoke access
- Security incident response
- Compliance requirement

### 10. Monitor and Log

**Log all OAuth2 events**:

```java
// Log authorization requests
logger.info("Authorization request: client_id={}, scope={}", 
    clientId, scope);

// Log token issuance
logger.info("Token issued: client_id={}, user={}", 
    clientId, username);

// Log token validation failures
logger.warn("Token validation failed: reason={}", reason);
```

**Monitor**:
- Failed authentication attempts
- Token validation failures
- Unusual scope requests
- Token revocation events

---

## 18. Common Security Mistakes

**Developers often make these mistakes**:

### ❌ Mistake 1: Store Tokens in LocalStorage

**Problem**:
```javascript
// BAD: Vulnerable to XSS attacks
localStorage.setItem('access_token', token);
```

**Fix**: Use httpOnly cookies
```java
// GOOD: Secure cookie
Cookie cookie = new Cookie("token", token);
cookie.setHttpOnly(true);
cookie.setSecure(true);
cookie.setSameSite("Strict");
response.addCookie(cookie);
```

### ❌ Mistake 2: Use Long-Lived Tokens

**Problem**:
```json
// BAD: Token never expires
{
  "access_token": "...",
  "expires_in": 31536000  // 1 year!
}
```

**Fix**: Use short-lived tokens with refresh
```json
// GOOD: Short-lived with refresh
{
  "access_token": "...",
  "expires_in": 900,  // 15 minutes
  "refresh_token": "..."
}
```

### ❌ Mistake 3: Skip Token Validation

**Problem**:
```java
// BAD: Trusting token without validation
String token = request.getHeader("Authorization");
// Use token directly without validation!
```

**Fix**: Always validate tokens
```java
// GOOD: Validate token
@Bean
public JwtDecoder jwtDecoder() {
    return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
}

// Spring Security automatically validates
```

### ❌ Mistake 4: Use Weak Secrets

**Problem**:
```java
// BAD: Weak client secret
clientSecret = "secret123";
```

**Fix**: Use strong, random secrets
```java
// GOOD: Strong secret (256 bits)
clientSecret = generateRandomSecret(256);
// Store in secure vault
```

### ❌ Mistake 5: Not Validating Redirect URIs

**Problem**:
```java
// BAD: Accepting any redirect URI
String redirectUri = request.getParameter("redirect_uri");
// No validation!
response.sendRedirect(redirectUri);
```

**Fix**: Validate against registered URIs
```java
// GOOD: Validate redirect URI
if (!client.getRegisteredRedirectUris().contains(redirectUri)) {
    throw new InvalidRedirectUriException();
}
```

### ❌ Mistake 6: Exposing Client Secret in Frontend

**Problem**:
```javascript
// BAD: Client secret in JavaScript
const clientSecret = "my-secret";
```

**Fix**: Never expose secrets in frontend
```java
// GOOD: Secret only on server
// Frontend only has client_id
// Secret used server-to-server
```

### ❌ Mistake 7: Not Using PKCE for Public Clients

**Problem**:
```java
// BAD: No PKCE for mobile app
GET /oauth2/authorize?client_id=mobile-app&...
```

**Fix**: Always use PKCE for public clients
```java
// GOOD: PKCE for mobile/SPA
GET /oauth2/authorize?
  client_id=mobile-app
  &code_challenge=...
  &code_challenge_method=S256
```

### ❌ Mistake 8: Not Checking Scopes

**Problem**:
```java
// BAD: Not checking scope
@GetMapping("/api/admin")
public AdminData getAdminData() {
    // Anyone with valid token can access!
}
```

**Fix**: Always check scopes
```java
// GOOD: Check scope
@GetMapping("/api/admin")
@PreAuthorize("hasAuthority('SCOPE_admin')")
public AdminData getAdminData() {
    // Only tokens with admin scope can access
}
```

---

## 19. Mini Project (Practical)

### Build Secure OAuth2 Login System

**Requirements**:

Users should:
- **Login** using OAuth2 (Google/GitHub)
- **Receive JWT token** after authentication
- **Access protected APIs** with token

### Architecture

```
User
  ↓
Web App (Frontend)
  ↓
Spring Boot App (Backend)
  ├─ OAuth2 Client
  └─ Resource Server
  ↓
Google OAuth2 Server
  ↓
Protected APIs
```

### Implementation Steps

#### Step 1: Create Spring Boot Project

**Dependencies**:
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-oauth2-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

#### Step 2: Configure OAuth2 Client

**application.yml**:
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope:
              - openid
              - profile
              - email
        provider:
          google:
            authorization-uri: https://accounts.google.com/o/oauth2/v2/auth
            token-uri: https://oauth2.googleapis.com/token
            user-info-uri: https://www.googleapis.com/oauth2/v3/userinfo
            jwk-set-uri: https://www.googleapis.com/oauth2/v3/certs
```

#### Step 3: Configure Security

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService())
                )
                .successHandler(oauth2SuccessHandler())
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login**").permitAll()
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
    
    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> customOAuth2UserService() {
        return new CustomOAuth2UserService();
    }
    
    @Bean
    public AuthenticationSuccessHandler oauth2SuccessHandler() {
        return new OAuth2SuccessHandler();
    }
}
```

#### Step 4: Generate JWT After OAuth2 Login

```java
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        
        // Generate JWT token
        String token = tokenProvider.generateToken(email);
        
        // Redirect to frontend with token
        response.sendRedirect("http://localhost:3000/callback?token=" + token);
    }
}
```

#### Step 5: Protect APIs

```java
@RestController
@RequestMapping("/api")
public class ApiController {
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public Map<String, Object> getProfile(Principal principal) {
        return Map.of(
            "username", principal.getName(),
            "message", "Protected resource accessed"
        );
    }
}
```

### Deliverables

✅ **OAuth2 login** working with Google  
✅ **JWT token** generated after login  
✅ **Protected APIs** accessible with token  
✅ **Secure token storage** (httpOnly cookies)  

---

## 20. Real Enterprise Example

### Example: Google Login (OAuth2 Flow)

**How "Sign in with Google" works**:

#### Step 1: User Clicks "Sign in with Google"

```
User → Your App
User clicks "Sign in with Google" button
```

#### Step 2: Redirect to Google

```
Your App → Redirects to Google
GET https://accounts.google.com/o/oauth2/v2/auth?
  client_id=123456789.apps.googleusercontent.com
  &redirect_uri=https://yourapp.com/callback
  &response_type=code
  &scope=openid profile email
  &state=random_string
```

#### Step 3: User Authenticates

```
User → Google Authorization Server
User enters Google credentials
User approves access
```

#### Step 4: Google Redirects Back

```
Google → Your App
GET https://yourapp.com/callback?
  code=4/0AX4XfWj...
  &state=random_string
```

#### Step 5: Exchange Code for Token

```
Your App → Google Token Endpoint
POST https://oauth2.googleapis.com/token
  grant_type=authorization_code
  &code=4/0AX4XfWj...
  &client_id=...
  &client_secret=...

Response:
{
  "access_token": "ya29.a0AfH6SMC...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

#### Step 6: Use ID Token to Authenticate User

```
Your App → Validates ID Token
Extracts user info:
{
  "sub": "user123",
  "email": "user@gmail.com",
  "name": "John Doe"
}

Your App → Creates session or issues own JWT
```

**Key Points**:
- ✅ User never shares Google password with your app
- ✅ Your app only gets requested permissions
- ✅ User can revoke access anytime
- ✅ Secure token-based access

### Netflix-Style OAuth2 Architecture

```
Internet Users
  ↓
Netflix Web App
  ↓
OAuth2 Authorization Server (Keycloak)
  ├─ User Authentication
  ├─ MFA Support
  ├─ Social Login (Google, Facebook)
  └─ Token Issuance
  ↓
API Gateway (Zuul)
  ├─ Token Validation
  ├─ User Context Extraction
  └─ Request Routing
  ↓
Microservices
  ├─ User Service
  ├─ Content Service
  ├─ Recommendation Service
  └─ Analytics Service
  ↓
Each service validates token and enforces scopes
```

**Features**:
- **Centralized authentication**: One OAuth2 server
- **Token propagation**: JWT passed between services
- **Scope-based access**: Different permissions per service
- **SSO**: Single sign-on across all services

---

## 21. Interview Answer (Short)

### What is OAuth2?

**OAuth2 is an authorization framework** that allows applications to access resources on behalf of a user **using tokens instead of credentials**.

**Key Points**:
- **Authorization, not authentication**: OAuth2 answers "what can app access?" not "who is the user?"
- **Token-based**: Uses access tokens and refresh tokens
- **Delegated access**: User grants permission to app
- **Scoped permissions**: Tokens have limited scope

**Roles**:
- **Resource Owner**: User who owns the data
- **Client**: Application requesting access
- **Authorization Server**: Issues tokens
- **Resource Server**: API with protected resources

**Flows**:
- **Authorization Code**: Most secure, for web apps
- **Client Credentials**: Service-to-service
- **PKCE**: For public clients (mobile, SPA)

**Use Cases**:
- Social login ("Sign in with Google")
- Third-party API access
- Microservices authentication
- Enterprise SSO

---

## 22. Advanced Topics for Senior Engineers

### 1. OAuth2 vs OpenID Connect (OIDC)

**Commonly misunderstood**:

**OAuth2**:
- **Purpose**: Authorization (what can app access?)
- **Token**: Access token (for API access)
- **Standard**: RFC 6749

**OpenID Connect (OIDC)**:
- **Purpose**: Authentication (who is the user?)
- **Token**: ID token (JWT with user info)
- **Standard**: Built on OAuth2

**Relationship**:
```
OAuth2 (Authorization)
  +
OIDC (Authentication)
  =
Complete Solution
```

**Example**:
```json
// OAuth2 Access Token (for API access)
{
  "access_token": "ya29...",
  "scope": "contacts.readonly"
}

// OIDC ID Token (for authentication)
{
  "sub": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "iss": "https://accounts.google.com"
}
```

### 2. OAuth2 Architecture for Microservices

**How companies like Netflix implement OAuth2**:

```
┌──────────────┐
│   Client     │
│  (Browser)   │
└──────┬───────┘
       │
       │ 1. Login Request
       ↓
┌──────────────────────┐
│  API Gateway          │
│  (Zuul / Kong)        │
└──────┬────────────────┘
       │
       │ 2. Redirect to Auth Server
       ↓
┌──────────────────────┐
│  OAuth2 Auth Server  │
│  (Keycloak)          │
│  ├─ Authenticates    │
│  ├─ Issues JWT       │
│  └─ Manages Clients  │
└──────┬────────────────┘
       │
       │ 3. JWT Token
       ↓
┌──────────────────────┐
│  API Gateway          │
│  ├─ Validates JWT    │
│  ├─ Extracts User     │
│  └─ Routes Request    │
└──────┬────────────────┘
       │
       │ 4. Request with JWT
       ↓
┌──────────────────────┐
│  Microservice A      │
│  ├─ Validates JWT    │
│  ├─ Checks Scope      │
│  └─ Calls Service B   │
│      (with JWT)       │
└──────┬────────────────┘
       │
       │ 5. JWT Propagation
       ↓
┌──────────────────────┐
│  Microservice B      │
│  ├─ Validates JWT    │
│  └─ Processes Request │
└──────────────────────┘
```

**Key Patterns**:
- **Centralized Auth Server**: One OAuth2 server for all services
- **JWT Propagation**: Token passed between services
- **Gateway Validation**: Initial validation at gateway
- **Service-Level Validation**: Each service validates token
- **Scope Enforcement**: Services check scopes

### 3. How Companies Implement OAuth2 Internally

**Netflix Architecture**:

1. **Keycloak** as Authorization Server
   - User authentication
   - Token issuance
   - Client management

2. **Zuul Gateway** as API Gateway
   - Token validation
   - Request routing
   - Rate limiting

3. **Microservices** as Resource Servers
   - JWT validation
   - Scope checking
   - Business logic

**Token Flow**:
```
User Login → Keycloak → JWT Token → Zuul → Microservices
```

**Security Layers**:
- **Edge**: CloudFlare (DDoS protection)
- **Gateway**: Zuul (token validation)
- **Services**: JWT validation + scope checking
- **Network**: mTLS between services

---

## 📚 Next Steps

Now that you understand OAuth2 deeply:

1. Learn [JWT Security](./08-jwt-security.md) to understand token internals
2. Master [Microservices Security](./09-microservices-security.md) for distributed systems
3. Build [Enterprise Platform](./projects/project-05-enterprise-platform.md) with OAuth2

**Ready to continue?** → [JWT Security](./08-jwt-security.md)
