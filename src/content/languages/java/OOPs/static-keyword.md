# Static Keyword in Java

## What is 'static'?

The **`static`** keyword means something belongs to the class itself, not to any specific object. It's shared by all objects of that class.

### Real-World Example

Think of a company's name. "Apple Inc." is the same for all employees - it doesn't change per person. Similarly, `static` members belong to the class, not individual objects.

## Static Variables (Class Variables)

Static variables are shared by all objects of a class. Changing it in one object affects all objects.

```java
class Student {
    String name;
    int rollNumber;
    
    // Static variable - shared by all students
    static String schoolName = "ABC High School";
    static int totalStudents = 0;  // Counts all students
    
    Student(String name, int rollNumber) {
        this.name = name;
        this.rollNumber = rollNumber;
        totalStudents++;  // Increment for each new student
    }
    
    void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Roll Number: " + rollNumber);
        System.out.println("School: " + schoolName);
    }
    
    // Static method to get total students
    static void displayTotalStudents() {
        System.out.println("Total Students: " + totalStudents);
    }
}

public class StaticExample {
    public static void main(String[] args) {
        Student s1 = new Student("Alice", 101);
        Student s2 = new Student("Bob", 102);
        Student s3 = new Student("Charlie", 103);
        
        // All students share the same school name
        s1.displayInfo();
        System.out.println();
        
        // Change school name - affects all students
        Student.schoolName = "XYZ High School";
        
        s2.displayInfo();
        System.out.println();
        
        // Static method called using class name
        Student.displayTotalStudents();
    }
}
```

**Output:**
```
Name: Alice
Roll Number: 101
School: ABC High School

Name: Bob
Roll Number: 102
School: XYZ High School

Total Students: 3
```

## Static Methods

Static methods belong to the class and can be called without creating an object.

```java
class MathHelper {
    // Static method - can be called without object
    static int add(int a, int b) {
        return a + b;
    }
    
    static int multiply(int a, int b) {
        return a * b;
    }
    
    static double calculateCircleArea(double radius) {
        return 3.14159 * radius * radius;
    }
    
    // Non-static method - needs object
    void displayMessage() {
        System.out.println("This is a non-static method");
    }
}

public class StaticMethodExample {
    public static void main(String[] args) {
        // Call static methods using class name (no object needed)
        int sum = MathHelper.add(5, 3);
        int product = MathHelper.multiply(4, 7);
        double area = MathHelper.calculateCircleArea(5.0);
        
        System.out.println("Sum: " + sum);
        System.out.println("Product: " + product);
        System.out.println("Circle Area: " + area);
        
        // For non-static method, need to create object
        MathHelper helper = new MathHelper();
        helper.displayMessage();
    }
}
```

## Static Block

A static block runs once when the class is first loaded.

```java
class DatabaseConnection {
    static String databaseURL;
    static String username;
    
    // Static block - runs once when class loads
    static {
        System.out.println("Loading database configuration...");
        databaseURL = "jdbc:mysql://localhost:3306/mydb";
        username = "admin";
        System.out.println("Database configuration loaded!");
    }
    
    static void connect() {
        System.out.println("Connecting to: " + databaseURL);
        System.out.println("Username: " + username);
    }
}

public class StaticBlockExample {
    public static void main(String[] args) {
        System.out.println("Main method started");
        DatabaseConnection.connect();
    }
}
```

**Output:**
```
Loading database configuration...
Database configuration loaded!
Main method started
Connecting to: jdbc:mysql://localhost:3306/mydb
Username: admin
```

## Real-World Example: Employee Management

```java
class Employee {
    String name;
    int employeeId;
    double salary;
    
    // Static variables - shared by all employees
    static String companyName = "Tech Corp";
    static int totalEmployees = 0;
    static double totalSalary = 0.0;
    
    Employee(String name, int employeeId, double salary) {
        this.name = name;
        this.employeeId = employeeId;
        this.salary = salary;
        totalEmployees++;
        totalSalary = totalSalary + salary;
    }
    
    void displayInfo() {
        System.out.println("Employee ID: " + employeeId);
        System.out.println("Name: " + name);
        System.out.println("Salary: $" + salary);
        System.out.println("Company: " + companyName);
    }
    
    // Static methods
    static void displayCompanyInfo() {
        System.out.println("Company: " + companyName);
        System.out.println("Total Employees: " + totalEmployees);
        System.out.println("Total Salary: $" + totalSalary);
        System.out.println("Average Salary: $" + (totalSalary / totalEmployees));
    }
    
    static void changeCompanyName(String newName) {
        companyName = newName;
        System.out.println("Company name changed to: " + companyName);
    }
}

public class EmployeeExample {
    public static void main(String[] args) {
        Employee e1 = new Employee("John", 101, 50000);
        Employee e2 = new Employee("Jane", 102, 60000);
        Employee e3 = new Employee("Bob", 103, 55000);
        
        System.out.println("=== Employee Information ===");
        e1.displayInfo();
        System.out.println();
        
        System.out.println("=== Company Statistics ===");
        Employee.displayCompanyInfo();
        System.out.println();
        
        // Change company name - affects all employees
        Employee.changeCompanyName("New Tech Corp");
        System.out.println();
        
        e2.displayInfo();
    }
}
```

## Key Points About Static

1. **Belongs to class**: Not to individual objects
2. **Shared by all objects**: One copy for entire class
3. **Memory efficient**: Only one copy exists
4. **Accessed via class name**: No object needed
5. **Cannot access non-static**: Static methods can't use instance variables directly

## Static vs Non-Static

| Static | Non-Static |
|--------|------------|
| Belongs to class | Belongs to object |
| One copy for all objects | One copy per object |
| Accessed via class name | Accessed via object |
| Can't access instance variables | Can access both static and instance |
| Loaded when class loads | Created when object created |

## Common Use Cases

1. **Constants**: `static final` for values that don't change
2. **Utility methods**: Helper functions like `Math.max()`
3. **Counters**: Track total number of objects
4. **Configuration**: Shared settings for all objects

## Summary

- `static` means "belongs to the class"
- Shared by all objects of that class
- Can be accessed without creating objects
- Memory efficient - only one copy exists
- Useful for constants, counters, and utility methods
