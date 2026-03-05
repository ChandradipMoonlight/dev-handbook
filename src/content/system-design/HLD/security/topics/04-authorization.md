# Authorization Models

> **Controlling what users can do - access control in enterprise systems**

---

## 1. Introduction

Think of authorization like **building access control**:

- **Authentication**: "Who are you?" (ID check at entrance)
- **Authorization**: "What can you access?" (Which floors can you enter?)

**Authorization** answers: **"What are you allowed to do?"**

**Real-world examples**:
- **Bank**: Teller can view accounts, manager can approve loans
- **Hospital**: Nurse can view patient records, doctor can prescribe
- **Company**: Employee can view documents, admin can delete

---

## 2. Why This Topic Matters in Enterprise Systems

Authorization prevents **unauthorized access** - one of the top security risks.

### Fintech Platforms
- **Banking apps**: Users can only access their own accounts
- **Payment systems**: Merchants can only access their transactions
- **Trading platforms**: Traders have different limits based on role

**Without authorization**: Users can access other users' data.

### Large SaaS Systems
- **Multi-tenant**: Users can only access their organization's data
- **Role-based access**: Admins vs regular users
- **Feature flags**: Premium users get more features

**Without authorization**: Data leaks, unauthorized actions.

### Microservices Architectures
- **Service-level authorization**: Services check permissions
- **Resource-level authorization**: Fine-grained access control
- **API authorization**: Different endpoints for different roles

**Without authorization**: Services can't enforce access control.

---

## 3. Basic Concepts

### What is Authorization?

**Authorization** = Determining what authenticated users can do

**Two main questions**:
1. **Can this user access this resource?**
2. **What actions can this user perform?**

### RBAC (Role-Based Access Control)

**Users have roles, roles have permissions**:

```
User → Role → Permissions
```

**Example**:
```
User: John
Role: Admin
Permissions: [CREATE_USER, DELETE_USER, VIEW_ALL_REPORTS]

User: Jane
Role: User
Permissions: [VIEW_OWN_PROFILE, EDIT_OWN_PROFILE]
```

**Common roles**:
- **Admin**: Full access
- **Manager**: Department-level access
- **User**: Limited access
- **Guest**: Read-only access

### ABAC (Attribute-Based Access Control)

**Access based on attributes** (user, resource, environment):

```
Access = f(user.attributes, resource.attributes, environment.attributes)
```

**Example**:
```
User: John
Attributes: { department: "Sales", level: "Senior" }
Resource: Document
Attributes: { department: "Sales", classification: "Internal" }
Environment: { time: "9 AM", location: "Office" }

Rule: User can access if user.department == resource.department
Result: ✅ Access granted
```

**Attributes can be**:
- **User**: Role, department, clearance level
- **Resource**: Type, classification, owner
- **Environment**: Time, location, IP address

### PBAC (Policy-Based Access Control)

**Access controlled by policies** (rules defined in policy language):

```
Policy: "Users in Sales department can access Sales documents during business hours"
```

**Policies are**:
- **Declarative**: What is allowed, not how
- **Centralized**: Managed in one place
- **Flexible**: Can combine multiple conditions

---

## 4. Intermediate Concepts

### Permission Model

**Permissions** = Specific actions users can perform

**Common permission patterns**:

**CRUD Permissions**:
```
CREATE, READ, UPDATE, DELETE
```

**Resource-Specific Permissions**:
```
USER_CREATE, USER_READ, USER_UPDATE, USER_DELETE
ORDER_CREATE, ORDER_READ, ORDER_UPDATE, ORDER_DELETE
```

**Action-Based Permissions**:
```
APPROVE_LOAN, PROCESS_PAYMENT, VIEW_REPORTS
```

### Role Hierarchy

**Roles can inherit from other roles**:

```
Super Admin
  ├─ Admin (inherits from Super Admin)
  │   ├─ Manager (inherits from Admin)
  │   └─ User (inherits from Manager)
  └─ Guest
```

**Example**:
```
Super Admin: All permissions
Admin: All permissions except system config
Manager: User management + reports
User: Own profile management
Guest: Read-only public data
```

### Resource-Level Authorization

**Authorization at the resource level**:

**Example**: User can only access their own orders
```java
@GetMapping("/orders/{orderId}")
public Order getOrder(@PathVariable Long orderId) {
    String username = getCurrentUsername();
    Order order = orderRepository.findById(orderId);
    
    // Resource-level check
    if (!order.getUserId().equals(username)) {
        throw new AccessDeniedException();
    }
    
    return order;
}
```

### Multi-Tenant Authorization

**Users can only access their organization's data**:

```
Organization A
  ├─ User 1
  ├─ User 2
  └─ Data (isolated)

Organization B
  ├─ User 3
  ├─ User 4
  └─ Data (isolated)
```

**Implementation**:
- **Tenant ID**: Every resource has organization ID
- **Filter queries**: Always filter by tenant ID
- **Isolation**: Users can't access other tenants' data

---

## 5. Advanced Concepts

### Fine-Grained Authorization

**Authorization at field level**:

**Example**: User can see order amount, but not customer SSN
```java
public class Order {
    @VisibleTo("ADMIN, MANAGER")
    private BigDecimal amount;
    
    @VisibleTo("ADMIN")
    private String customerSSN;
    
    @VisibleTo("ALL")
    private String orderId;
}
```

### Dynamic Authorization

**Authorization rules evaluated at runtime**:

```
Rule: "User can approve if amount < user.approvalLimit"
```

**Use case**: Different approval limits for different users.

### Attribute-Based Access Control (ABAC) Deep Dive

**ABAC Components**:

1. **Subject (User)**: Who is requesting access
   - Attributes: role, department, clearance, location

2. **Resource**: What is being accessed
   - Attributes: type, classification, owner, sensitivity

3. **Action**: What action is being performed
   - Attributes: read, write, delete, approve

4. **Environment**: Context of the request
   - Attributes: time, location, IP, device

**Policy Engine**: Evaluates rules against attributes

**Example Policy**:
```
IF user.role == "MANAGER" 
   AND resource.department == user.department
   AND action == "APPROVE"
   AND environment.time BETWEEN "9:00" AND "17:00"
THEN ALLOW
ELSE DENY
```

### Zero Trust Authorization

**Never trust, always verify**:

**Principles**:
- **Verify explicitly**: Check every request
- **Least privilege**: Minimum required access
- **Assume breach**: Assume network is compromised

**Implementation**:
- **Continuous verification**: Re-check permissions periodically
- **Context-aware**: Consider time, location, device
- **Just-in-time access**: Grant temporary access when needed

---

## 6. Internal Working / Deep Dive

### RBAC Implementation Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Request: GET /api/users/123
     ↓
┌─────────────────┐
│  API Gateway    │
└────┬────────────┘
     │
     │ 2. Extract user from JWT
     │    user: { id: 1, roles: ["USER"] }
     ↓
┌─────────────────┐
│  Authorization  │
│     Service     │
└────┬────────────┘
     │
     │ 3. Check user roles
     │    roles: ["USER"]
     │
     │ 4. Get role permissions
     │    USER role → [VIEW_OWN_PROFILE]
     │
     │ 5. Check if permission matches
     │    Required: VIEW_USER
     │    Has: VIEW_OWN_PROFILE
     │
     │ 6. Resource-level check
     │    Is user.id == 123?
     │    If yes → ALLOW
     │    If no → DENY
     ↓
┌─────────────────┐
│   Response      │
│  ALLOW / DENY   │
└─────────────────┘
```

### ABAC Policy Evaluation

```
┌──────────┐
│  Request │
│  { user, │
│  resource│
│  action }│
└────┬─────┘
     │
     ↓
┌─────────────────┐
│  Policy Engine   │
└────┬────────────┘
     │
     │ 1. Load policies
     │
     │ 2. Extract attributes
     │    user.role = "MANAGER"
     │    user.department = "Sales"
     │    resource.type = "Document"
     │    resource.department = "Sales"
     │    action = "READ"
     │
     │ 3. Evaluate rules
     │    IF user.role == "MANAGER"
     │       AND resource.department == user.department
     │    THEN ALLOW
     │
     │ 4. Return decision
     ↓
┌──────────┐
│ Decision │
│  ALLOW   │
└──────────┘
```

---

## 7. Java Implementation Examples

### RBAC with Spring Security

```java
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/manager/**").hasAnyRole("ADMIN", "MANAGER")
            .requestMatchers("/api/users/**").hasRole("USER")
            .anyRequest().authenticated()
        );
        return http.build();
    }
}
```

### Method-Level Authorization

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<Order> getOrders() {
        return orderService.getUserOrders();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') and @orderService.isOwner(#id, authentication.name)")
    public Order getOrder(@PathVariable Long id) {
        return orderService.getOrder(id);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
}
```

### Custom Authorization Logic

```java
@Service
public class OrderService {
    
    public boolean isOwner(Long orderId, String username) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow();
        return order.getUserId().equals(username);
    }
}
```

### ABAC Implementation

```java
@Service
public class AbacService {
    
    public boolean evaluatePolicy(
        User user,
        Resource resource,
        Action action,
        Environment environment
    ) {
        // Load policies
        List<Policy> policies = policyRepository.findApplicablePolicies(
            user, resource, action
        );
        
        // Evaluate each policy
        for (Policy policy : policies) {
            if (evaluatePolicy(policy, user, resource, action, environment)) {
                return policy.getEffect() == PolicyEffect.ALLOW;
            }
        }
        
        // Default deny
        return false;
    }
    
    private boolean evaluatePolicy(
        Policy policy,
        User user,
        Resource resource,
        Action action,
        Environment environment
    ) {
        // Evaluate conditions
        for (Condition condition : policy.getConditions()) {
            if (!evaluateCondition(condition, user, resource, action, environment)) {
                return false;
            }
        }
        return true;
    }
    
    private boolean evaluateCondition(
        Condition condition,
        User user,
        Resource resource,
        Action action,
        Environment environment
    ) {
        // Example: user.role == "MANAGER"
        String userRole = user.getAttribute(condition.getAttribute());
        return userRole.equals(condition.getValue());
    }
}
```

### Multi-Tenant Authorization

```java
@Component
public class TenantFilter implements Filter {
    
    @Override
    public void doFilter(
        ServletRequest request,
        ServletResponse response,
        FilterChain chain
    ) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String tenantId = extractTenantId(httpRequest);
        
        // Set tenant context
        TenantContext.setCurrentTenant(tenantId);
        
        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
    
    private String extractTenantId(HttpServletRequest request) {
        // Extract from JWT token or header
        String token = request.getHeader("Authorization");
        // Parse JWT and extract tenant_id claim
        return jwtParser.parseClaimsJws(token).getBody().get("tenant_id", String.class);
    }
}

// Repository with tenant filtering
@Repository
public class OrderRepository {
    
    public List<Order> findByUserId(String userId) {
        String tenantId = TenantContext.getCurrentTenant();
        return entityManager.createQuery(
            "SELECT o FROM Order o WHERE o.userId = :userId AND o.tenantId = :tenantId",
            Order.class
        )
        .setParameter("userId", userId)
        .setParameter("tenantId", tenantId)
        .getResultList();
    }
}
```

---

## 8. Common Security Mistakes

### ❌ Mistake 1: Authorization Only at UI Level

**Problem**:
```java
// BAD: Only UI checks permissions
if (user.isAdmin()) {
    showDeleteButton();
}
// But API doesn't check!
```

**Fix**: Always check authorization in backend
```java
// GOOD: Backend enforces authorization
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public void delete(@PathVariable Long id) {
    // Delete logic
}
```

### ❌ Mistake 2: Missing Resource-Level Checks

**Problem**:
```java
// BAD: User can access any order
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable Long id) {
    return orderRepository.findById(id); // No ownership check!
}
```

**Fix**: Always check resource ownership
```java
// GOOD: Check ownership
@GetMapping("/orders/{id}")
@PreAuthorize("@orderService.isOwner(#id, authentication.name)")
public Order getOrder(@PathVariable Long id) {
    return orderService.getOrder(id);
}
```

### ❌ Mistake 3: Trusting Client-Side Data

**Problem**:
```java
// BAD: Trusting client-sent role
String role = request.getHeader("X-User-Role");
if (role.equals("ADMIN")) {
    // Allow admin action
}
```

**Fix**: Always get user info from authenticated session
```java
// GOOD: Get from security context
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String role = auth.getAuthorities().iterator().next().getAuthority();
```

### ❌ Mistake 4: Missing Tenant Isolation

**Problem**:
```java
// BAD: No tenant filtering
public List<Order> getAllOrders() {
    return orderRepository.findAll(); // Returns all tenants' orders!
}
```

**Fix**: Always filter by tenant
```java
// GOOD: Filter by tenant
public List<Order> getAllOrders() {
    String tenantId = TenantContext.getCurrentTenant();
    return orderRepository.findByTenantId(tenantId);
}
```

---

## 9. Real Enterprise Architecture Example

### Netflix Authorization Architecture

```
User Request
  ↓
API Gateway (Zuul)
  ├─ Extract user from JWT
  ├─ Extract roles/permissions
  └─ Forward to service
  ↓
Microservice
  ├─ Method-level authorization
  │   @PreAuthorize("hasRole('PREMIUM')")
  ├─ Resource-level authorization
  │   if (order.userId != currentUser.id) DENY
  └─ Tenant isolation
      if (order.tenantId != currentTenant.id) DENY
  ↓
Response (filtered by permissions)
```

**Authorization Layers**:
1. **API Gateway**: Route-level authorization
2. **Service**: Method-level authorization
3. **Resource**: Object-level authorization
4. **Field**: Field-level authorization (sensitive data)

---

## 10. Diagrams and Visual Illustrations

### RBAC Model

```
┌──────────┐
│   User   │
│  John    │
└────┬─────┘
     │
     │ has
     ↓
┌──────────┐
│   Role   │
│  Admin   │
└────┬─────┘
     │
     │ has
     ↓
┌──────────────┐
│ Permissions  │
├──────────────┤
│ CREATE_USER  │
│ DELETE_USER  │
│ VIEW_REPORTS │
└──────────────┘
```

### Authorization Decision Flow

```
┌──────────┐
│ Request  │
│ GET /api │
│ /users/1 │
└────┬─────┘
     │
     ↓
┌─────────────────┐
│ Extract User    │
│ from JWT        │
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Get User Roles  │
│ ["USER"]        │
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Get Permissions │
│ for Role        │
│ [VIEW_OWN_PROFILE]│
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Check Permission│
│ Required: VIEW_USER│
│ Has: VIEW_OWN_PROFILE│
└────┬────────────┘
     │
     ↓
┌─────────────────┐
│ Resource Check  │
│ Is user.id == 1?│
└────┬────────────┘
     │
     │ Yes
     ↓
┌──────────┐
│  ALLOW   │
└──────────┘
```

---

## 11. Mini Practical Project

### Project: Role-Based Access Control System

**Problem Statement**: Implement RBAC for a task management system.

**Requirements**:
- Three roles: ADMIN, MANAGER, USER
- Different permissions per role
- Resource-level authorization (users can only access their tasks)
- Method-level authorization

**Roles and Permissions**:

```
ADMIN:
  - CREATE_TASK
  - VIEW_ALL_TASKS
  - UPDATE_ANY_TASK
  - DELETE_ANY_TASK

MANAGER:
  - CREATE_TASK
  - VIEW_TEAM_TASKS
  - UPDATE_TEAM_TASKS

USER:
  - CREATE_TASK
  - VIEW_OWN_TASKS
  - UPDATE_OWN_TASKS
```

**Implementation**:

```java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public List<Task> getTasks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String role = auth.getAuthorities().iterator().next().getAuthority();
        
        if (role.equals("ADMIN")) {
            return taskService.getAllTasks();
        } else if (role.equals("MANAGER")) {
            return taskService.getTeamTasks(auth.getName());
        } else {
            return taskService.getUserTasks(auth.getName());
        }
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @taskService.isOwner(#id, authentication.name)")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
```

**Deliverables**:
- ✅ Role-based access control working
- ✅ Resource-level authorization implemented
- ✅ Method-level security configured

---

## 12. Step-by-Step Implementation Guide

### Implementing RBAC

**Step 1**: Define roles and permissions
```java
public enum Role {
    ADMIN, MANAGER, USER
}

public enum Permission {
    CREATE_TASK, VIEW_ALL_TASKS, UPDATE_ANY_TASK, DELETE_ANY_TASK
}
```

**Step 2**: Configure Spring Security
```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/tasks/**").hasAnyRole("ADMIN", "MANAGER", "USER")
        );
        return http.build();
    }
}
```

**Step 3**: Add method-level security
```java
@PreAuthorize("hasRole('ADMIN')")
public void deleteTask(Long id) {
    // Delete logic
}
```

---

## 13. Interview & System Design Insights

### Common Interview Questions

**Q: What's the difference between RBAC and ABAC?**

**A**:
- **RBAC**: Role-based, simpler, good for most cases
- **ABAC**: Attribute-based, more flexible, complex
- **Use RBAC** when roles are sufficient
- **Use ABAC** when you need context-aware authorization (time, location, etc.)

**Q: How do you implement resource-level authorization?**

**A**:
1. **Extract user** from authentication context
2. **Load resource** from database
3. **Check ownership** (resource.userId == currentUser.id)
4. **Check tenant** (resource.tenantId == currentTenant.id)
5. **Allow or deny** based on checks

**Q: How do you handle authorization in microservices?**

**A**:
- **JWT tokens**: Include roles/permissions in token
- **Service-level checks**: Each service validates permissions
- **API Gateway**: Can do initial authorization check
- **Centralized policy**: Use policy engine (OPA, Keycloak)

### Best Practices

1. **Defense in depth**: Check authorization at multiple layers
2. **Fail secure**: Default to deny if unsure
3. **Least privilege**: Give minimum required permissions
4. **Resource-level checks**: Always verify ownership
5. **Tenant isolation**: Always filter by tenant in multi-tenant systems
6. **Audit logging**: Log all authorization decisions
7. **Regular reviews**: Review permissions periodically

---

## 📚 Next Steps

Now that you understand authorization:

1. Learn [API Security](./05-api-security.md) to secure APIs with authorization
2. Master [Spring Security](./06-spring-security.md) for implementation
3. Build [Secure Microservices](./09-microservices-security.md) with proper authorization

**Ready to continue?** → [API Security](./05-api-security.md)
