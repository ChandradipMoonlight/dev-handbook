# Java Basics

This tutorial covers the fundamental building blocks of Java programming: variables, data types, and basic syntax.

## Variables and Data Types

Variables are containers that store data values. In Java, you must declare a variable's type before using it.

### Primitive Data Types

Java has 8 primitive data types:

| Type | Size | Description | Example |
|------|------|-------------|---------|
| `byte` | 1 byte | Integer from -128 to 127 | `byte age = 25;` |
| `short` | 2 bytes | Integer from -32,768 to 32,767 | `short count = 1000;` |
| `int` | 4 bytes | Integer from -2^31 to 2^31-1 | `int number = 100000;` |
| `long` | 8 bytes | Large integers | `long bigNumber = 1000000000L;` |
| `float` | 4 bytes | Decimal numbers | `float price = 19.99f;` |
| `double` | 8 bytes | Large decimal numbers | `double pi = 3.14159;` |
| `char` | 2 bytes | Single character | `char grade = 'A';` |
| `boolean` | 1 bit | True or false | `boolean isActive = true;` |

### Real-World Example: Student Information

```java
public class StudentInfo {
    public static void main(String[] args) {
        // Student information
        String name = "John Doe";
        int age = 20;
        double gpa = 3.75;
        char grade = 'A';
        boolean isEnrolled = true;
        
        System.out.println("Student Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
        System.out.println("Grade: " + grade);
        System.out.println("Enrolled: " + isEnrolled);
    }
}
```

## Operators

Java supports various operators for performing operations:

### Arithmetic Operators

```java
int a = 10;
int b = 3;

System.out.println(a + b);  // Addition: 13
System.out.println(a - b);  // Subtraction: 7
System.out.println(a * b);  // Multiplication: 30
System.out.println(a / b);  // Division: 3
System.out.println(a % b);  // Modulus: 1
```

### Comparison Operators

```java
int x = 5;
int y = 10;

System.out.println(x == y);  // Equal to: false
System.out.println(x != y);  // Not equal: true
System.out.println(x < y);    // Less than: true
System.out.println(x > y);    // Greater than: false
```

## Control Structures

### If-Else Statements

```java
public class WeatherCheck {
    public static void main(String[] args) {
        int temperature = 25;
        
        if (temperature > 30) {
            System.out.println("It's hot outside!");
        } else if (temperature > 20) {
            System.out.println("Nice weather!");
        } else {
            System.out.println("It's cold outside!");
        }
    }
}
```

### Loops

#### For Loop

```java
// Print numbers from 1 to 5
for (int i = 1; i <= 5; i++) {
    System.out.println("Number: " + i);
}
```

#### While Loop

```java
int count = 0;
while (count < 5) {
    System.out.println("Count: " + count);
    count++;
}
```

## Real-World Example: Shopping Cart

```java
public class ShoppingCart {
    public static void main(String[] args) {
        String item1 = "Laptop";
        String item2 = "Mouse";
        double price1 = 999.99;
        double price2 = 29.99;
        int quantity1 = 1;
        int quantity2 = 2;
        
        double total = (price1 * quantity1) + (price2 * quantity2);
        double tax = total * 0.08; // 8% tax
        double finalTotal = total + tax;
        
        System.out.println("Item 1: " + item1 + " x" + quantity1 + " = $" + (price1 * quantity1));
        System.out.println("Item 2: " + item2 + " x" + quantity2 + " = $" + (price2 * quantity2));
        System.out.println("Subtotal: $" + total);
        System.out.println("Tax: $" + tax);
        System.out.println("Total: $" + finalTotal);
    }
}
```

## Best Practices

1. **Use meaningful variable names**: `studentAge` is better than `x`
2. **Initialize variables**: Always give variables an initial value
3. **Choose appropriate data types**: Use `int` for whole numbers, `double` for decimals
4. **Follow naming conventions**: Use camelCase for variables (e.g., `studentName`)

## Summary

- Variables store data values
- Java has 8 primitive data types
- Operators perform operations on variables
- Control structures control program flow
- Always use meaningful names and appropriate data types
