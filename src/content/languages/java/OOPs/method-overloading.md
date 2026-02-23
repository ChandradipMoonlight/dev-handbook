# Method Overloading in Java

## What is Method Overloading?

**Method Overloading** allows a class to have multiple methods with the same name but different parameters. The compiler decides which method to call based on the arguments provided.

### Real-World Example

Think of a calculator. You can add two numbers, three numbers, or even decimal numbers. All are "add" operations, but they work differently based on what you provide.

## Basic Method Overloading

```java
class Calculator {
    // Method 1: Add two integers
    int add(int a, int b) {
        System.out.println("Adding two integers");
        return a + b;
    }
    
    // Method 2: Add three integers (different number of parameters)
    int add(int a, int b, int c) {
        System.out.println("Adding three integers");
        return a + b + c;
    }
    
    // Method 3: Add two doubles (different parameter types)
    double add(double a, double b) {
        System.out.println("Adding two doubles");
        return a + b;
    }
    
    // Method 4: Add two strings (different parameter types)
    String add(String a, String b) {
        System.out.println("Concatenating two strings");
        return a + b;
    }
}

public class MethodOverloadingExample {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        System.out.println("Result 1: " + calc.add(5, 3));
        System.out.println("Result 2: " + calc.add(5, 3, 2));
        System.out.println("Result 3: " + calc.add(5.5, 3.2));
        System.out.println("Result 4: " + calc.add("Hello", " World"));
    }
}
```

**Output:**
```
Adding two integers
Result 1: 8
Adding three integers
Result 2: 10
Adding two doubles
Result 3: 8.7
Concatenating two strings
Result 4: Hello World
```

## Ways to Overload Methods

### 1. Different Number of Parameters

```java
class MathOperations {
    int multiply(int a, int b) {
        return a * b;
    }
    
    int multiply(int a, int b, int c) {
        return a * b * c;
    }
    
    int multiply(int a, int b, int c, int d) {
        return a * b * c * d;
    }
}

public class NumberOfParameters {
    public static void main(String[] args) {
        MathOperations math = new MathOperations();
        
        System.out.println("2 numbers: " + math.multiply(2, 3));
        System.out.println("3 numbers: " + math.multiply(2, 3, 4));
        System.out.println("4 numbers: " + math.multiply(2, 3, 4, 5));
    }
}
```

### 2. Different Types of Parameters

```java
class Display {
    void show(int number) {
        System.out.println("Integer: " + number);
    }
    
    void show(double number) {
        System.out.println("Double: " + number);
    }
    
    void show(String text) {
        System.out.println("String: " + text);
    }
    
    void show(char character) {
        System.out.println("Character: " + character);
    }
}

public class DifferentTypes {
    public static void main(String[] args) {
        Display display = new Display();
        
        display.show(10);
        display.show(10.5);
        display.show("Hello");
        display.show('A');
    }
}
```

### 3. Different Order of Parameters

```java
class Student {
    void displayInfo(String name, int age) {
        System.out.println("Name: " + name + ", Age: " + age);
    }
    
    void displayInfo(int age, String name) {
        System.out.println("Age: " + age + ", Name: " + name);
    }
}

public class DifferentOrder {
    public static void main(String[] args) {
        Student student = new Student();
        
        student.displayInfo("Alice", 20);
        student.displayInfo(25, "Bob");
    }
}
```

## Real-World Example: Shape Area Calculation

```java
class AreaCalculator {
    // Calculate area of rectangle
    double calculateArea(double length, double width) {
        System.out.println("Calculating rectangle area");
        return length * width;
    }
    
    // Calculate area of circle
    double calculateArea(double radius) {
        System.out.println("Calculating circle area");
        return 3.14159 * radius * radius;
    }
    
    // Calculate area of triangle
    double calculateArea(double base, double height, String shape) {
        if (shape.equals("triangle")) {
            System.out.println("Calculating triangle area");
            return 0.5 * base * height;
        }
        return 0;
    }
    
    // Calculate area of square
    int calculateArea(int side) {
        System.out.println("Calculating square area");
        return side * side;
    }
}

public class AreaCalculatorExample {
    public static void main(String[] args) {
        AreaCalculator calc = new AreaCalculator();
        
        System.out.println("Rectangle: " + calc.calculateArea(5.0, 4.0));
        System.out.println("Circle: " + calc.calculateArea(3.0));
        System.out.println("Triangle: " + calc.calculateArea(4.0, 3.0, "triangle"));
        System.out.println("Square: " + calc.calculateArea(5));
    }
}
```

## Real-World Example: Employee Management

```java
class EmployeeService {
    // Create employee with name only
    void createEmployee(String name) {
        System.out.println("Creating employee: " + name);
        System.out.println("Default salary: $50000");
    }
    
    // Create employee with name and salary
    void createEmployee(String name, double salary) {
        System.out.println("Creating employee: " + name);
        System.out.println("Salary: $" + salary);
    }
    
    // Create employee with all details
    void createEmployee(String name, double salary, String department) {
        System.out.println("Creating employee: " + name);
        System.out.println("Salary: $" + salary);
        System.out.println("Department: " + department);
    }
    
    // Update employee salary
    void updateEmployee(int employeeId, double newSalary) {
        System.out.println("Updating employee " + employeeId);
        System.out.println("New salary: $" + newSalary);
    }
    
    // Update employee department
    void updateEmployee(int employeeId, String newDepartment) {
        System.out.println("Updating employee " + employeeId);
        System.out.println("New department: " + newDepartment);
    }
}

public class EmployeeServiceExample {
    public static void main(String[] args) {
        EmployeeService service = new EmployeeService();
        
        service.createEmployee("John");
        System.out.println();
        
        service.createEmployee("Jane", 60000);
        System.out.println();
        
        service.createEmployee("Bob", 70000, "IT");
        System.out.println();
        
        service.updateEmployee(101, 65000);
        System.out.println();
        
        service.updateEmployee(102, "Engineering");
    }
}
```

## Constructor Overloading

Constructors can also be overloaded.

```java
class Student {
    String name;
    int age;
    String course;
    
    // Constructor 1: Name only
    Student(String name) {
        this.name = name;
        this.age = 0;
        this.course = "Not assigned";
    }
    
    // Constructor 2: Name and age
    Student(String name, int age) {
        this.name = name;
        this.age = age;
        this.course = "Not assigned";
    }
    
    // Constructor 3: All parameters
    Student(String name, int age, String course) {
        this.name = name;
        this.age = age;
        this.course = course;
    }
    
    void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Course: " + course);
    }
}

public class ConstructorOverloading {
    public static void main(String[] args) {
        Student s1 = new Student("Alice");
        Student s2 = new Student("Bob", 20);
        Student s3 = new Student("Charlie", 21, "Computer Science");
        
        s1.displayInfo();
        System.out.println();
        s2.displayInfo();
        System.out.println();
        s3.displayInfo();
    }
}
```

## Important Points

1. **Method signature**: Name must be same, parameters must be different
2. **Return type**: Can be same or different (not considered for overloading)
3. **Access modifier**: Can be different
4. **Compile-time**: Resolved at compile time
5. **Not considered**: Return type alone doesn't differentiate methods

## Invalid Overloading

```java
class InvalidExample {
    // These are NOT valid overloading - only return type differs
    // int method(int x) { return x; }
    // double method(int x) { return x; }  // Error!
    
    // These ARE valid - parameters differ
    int method(int x) { return x; }
    int method(double x) { return (int)x; }  // Valid
}
```

## Benefits of Method Overloading

1. **Flexibility**: Same operation with different inputs
2. **Readability**: Intuitive method names
3. **Code Reusability**: Reuse method name for similar operations
4. **Polymorphism**: Compile-time polymorphism
5. **Convenience**: Easy to use with different data types

## Summary

- Method overloading = Same name, different parameters
- Can differ in: number, type, or order of parameters
- Resolved at compile time
- Provides flexibility and convenience
- Makes code more readable and intuitive
