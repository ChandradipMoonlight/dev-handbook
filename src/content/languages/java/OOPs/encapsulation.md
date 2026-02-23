# Encapsulation in Java

## What is Encapsulation?

**Encapsulation** means wrapping data (variables) and methods together in a class, and hiding the internal details from outside access. It's like a capsule that protects medicine inside.

### Real-World Example

Think of a TV remote. You press buttons (public methods) to control the TV, but you don't need to know how the circuits inside (private data) work. The internal mechanism is hidden from you.

## Key Concepts

1. **Data Hiding**: Making variables private
2. **Public Methods**: Providing controlled access through methods
3. **Security**: Preventing direct access to sensitive data

## Basic Example

```java
class BankAccount {
    // Private data - hidden from outside
    private double balance;
    private String accountNumber;
    
    // Public constructor
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        if (initialBalance > 0) {
            this.balance = initialBalance;
        } else {
            this.balance = 0;
        }
    }
    
    // Public method to get balance (read-only access)
    public double getBalance() {
        return balance;
    }
    
    // Public method to deposit (controlled access)
    public void deposit(double amount) {
        if (amount > 0) {
            balance = balance + amount;
            System.out.println("Deposited: $" + amount);
        } else {
            System.out.println("Invalid deposit amount!");
        }
    }
    
    // Public method to withdraw (controlled access)
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance = balance - amount;
            System.out.println("Withdrawn: $" + amount);
        } else {
            System.out.println("Invalid withdrawal amount or insufficient balance!");
        }
    }
    
    // Public method to get account number
    public String getAccountNumber() {
        return accountNumber;
    }
}

public class EncapsulationExample {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("ACC001", 1000);
        
        // Can access through public methods
        System.out.println("Account: " + account.getAccountNumber());
        System.out.println("Balance: $" + account.getBalance());
        
        account.deposit(500);
        account.withdraw(200);
        
        System.out.println("Final Balance: $" + account.getBalance());
        
        // Cannot access private data directly
        // account.balance = 10000;  // Error! balance is private
    }
}
```

**Output:**
```
Account: ACC001
Balance: $1000.0
Deposited: $500.0
Withdrawn: $200.0
Final Balance: $1300.0
```

## Access Modifiers

Java provides four access levels:

| Modifier | Access Level |
|----------|-------------|
| `private` | Only within the same class |
| `default` | Within the same package |
| `protected` | Within package + subclasses |
| `public` | Everywhere |

```java
class Student {
    // Private - only accessible within this class
    private String password;
    private int marks;
    
    // Default - accessible within same package
    String address;
    
    // Protected - accessible in package and subclasses
    protected String email;
    
    // Public - accessible everywhere
    public String name;
    public int rollNumber;
    
    Student(String name, int rollNumber) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.password = "default123";
        this.marks = 0;
    }
    
    // Public method to set password (with validation)
    public void setPassword(String oldPassword, String newPassword) {
        if (oldPassword.equals(this.password) && newPassword.length() >= 6) {
            this.password = newPassword;
            System.out.println("Password changed successfully!");
        } else {
            System.out.println("Invalid old password or new password too short!");
        }
    }
    
    // Public method to update marks (with validation)
    public void updateMarks(int newMarks) {
        if (newMarks >= 0 && newMarks <= 100) {
            this.marks = newMarks;
            System.out.println("Marks updated: " + marks);
        } else {
            System.out.println("Invalid marks! Must be between 0 and 100");
        }
    }
    
    // Public method to get marks
    public int getMarks() {
        return marks;
    }
    
    // Public method to get grade
    public String getGrade() {
        if (marks >= 90) return "A";
        else if (marks >= 80) return "B";
        else if (marks >= 70) return "C";
        else if (marks >= 60) return "D";
        else return "F";
    }
}

public class AccessModifiersExample {
    public static void main(String[] args) {
        Student student = new Student("Alice", 101);
        
        // Can access public members
        System.out.println("Name: " + student.name);
        System.out.println("Roll Number: " + student.rollNumber);
        
        // Can use public methods
        student.updateMarks(85);
        System.out.println("Grade: " + student.getGrade());
        
        student.setPassword("default123", "newpass123");
        
        // Cannot access private members directly
        // System.out.println(student.password);  // Error!
        // student.marks = 100;  // Error!
    }
}
```

## Real-World Example: Employee Management

```java
class Employee {
    // Private data - encapsulated
    private String name;
    private int employeeId;
    private double salary;
    private String department;
    
    // Constructor
    public Employee(String name, int employeeId, double salary, String department) {
        this.name = name;
        this.employeeId = employeeId;
        setSalary(salary);  // Use setter for validation
        this.department = department;
    }
    
    // Getter methods (read access)
    public String getName() {
        return name;
    }
    
    public int getEmployeeId() {
        return employeeId;
    }
    
    public double getSalary() {
        return salary;
    }
    
    public String getDepartment() {
        return department;
    }
    
    // Setter methods (write access with validation)
    public void setSalary(double salary) {
        if (salary > 0) {
            this.salary = salary;
        } else {
            System.out.println("Invalid salary! Must be positive.");
        }
    }
    
    public void setDepartment(String department) {
        if (department != null && !department.isEmpty()) {
            this.department = department;
        } else {
            System.out.println("Invalid department name!");
        }
    }
    
    // Business logic methods
    public void applyRaise(double percentage) {
        if (percentage > 0 && percentage <= 50) {
            double raise = salary * (percentage / 100);
            salary = salary + raise;
            System.out.println("Raise applied: " + percentage + "%");
            System.out.println("New salary: $" + salary);
        } else {
            System.out.println("Invalid raise percentage!");
        }
    }
    
    public void displayInfo() {
        System.out.println("Employee ID: " + employeeId);
        System.out.println("Name: " + name);
        System.out.println("Department: " + department);
        System.out.println("Salary: $" + salary);
    }
}

public class EmployeeManagement {
    public static void main(String[] args) {
        Employee emp = new Employee("John Doe", 101, 50000, "IT");
        
        emp.displayInfo();
        System.out.println();
        
        // Access through getters
        System.out.println("Current salary: $" + emp.getSalary());
        
        // Modify through setters (with validation)
        emp.applyRaise(10);
        System.out.println();
        
        emp.setDepartment("Engineering");
        emp.displayInfo();
        
        // Cannot access private data directly
        // emp.salary = 100000;  // Error!
    }
}
```

## Benefits of Encapsulation

1. **Data Security**: Prevents unauthorized access
2. **Data Validation**: Can validate data before setting
3. **Flexibility**: Can change internal implementation without affecting users
4. **Maintainability**: Easier to maintain and debug
5. **Control**: Full control over how data is accessed and modified

## Best Practices

1. ✅ Make variables `private`
2. ✅ Provide `public` getter methods for read access
3. ✅ Provide `public` setter methods for write access (with validation)
4. ✅ Use meaningful method names
5. ✅ Add validation in setters

## Summary

- Encapsulation = Data Hiding + Controlled Access
- Private variables protect data
- Public methods provide controlled access
- Ensures data security and validation
- Makes code more maintainable and flexible
