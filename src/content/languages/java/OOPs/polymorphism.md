# Polymorphism in Java

## What is Polymorphism?

**Polymorphism** means "many forms". It allows objects of different types to be treated as objects of a common type. The same action can be performed in different ways.

### Real-World Example

Think of a "draw" action. A circle draws differently than a rectangle, but both can be "drawn". Similarly, different animals make different sounds, but all can "make sound".

## Types of Polymorphism

### 1. Compile-Time Polymorphism (Method Overloading)

Same method name with different parameters. The compiler decides which method to call.

```java
class Calculator {
    // Method overloading - same name, different parameters
    int add(int a, int b) {
        return a + b;
    }
    
    int add(int a, int b, int c) {
        return a + b + c;
    }
    
    double add(double a, double b) {
        return a + b;
    }
    
    String add(String a, String b) {
        return a + b;
    }
}

public class MethodOverloading {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        System.out.println("Sum (2 ints): " + calc.add(5, 3));
        System.out.println("Sum (3 ints): " + calc.add(5, 3, 2));
        System.out.println("Sum (doubles): " + calc.add(5.5, 3.2));
        System.out.println("Concatenation: " + calc.add("Hello", " World"));
    }
}
```

**Output:**
```
Sum (2 ints): 8
Sum (3 ints): 10
Sum (doubles): 8.7
Concatenation: Hello World
```

### 2. Runtime Polymorphism (Method Overriding)

Same method signature in parent and child class. The JVM decides which method to call at runtime.

```java
// Parent class
class Animal {
    void makeSound() {
        System.out.println("Animal makes a sound");
    }
    
    void move() {
        System.out.println("Animal moves");
    }
}

// Child classes
class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Dog barks: Woof! Woof!");
    }
    
    @Override
    void move() {
        System.out.println("Dog runs on four legs");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Cat meows: Meow! Meow!");
    }
    
    @Override
    void move() {
        System.out.println("Cat walks gracefully");
    }
}

class Bird extends Animal {
    @Override
    void makeSound() {
        System.out.println("Bird chirps: Tweet! Tweet!");
    }
    
    @Override
    void move() {
        System.out.println("Bird flies in the sky");
    }
}

public class MethodOverriding {
    public static void main(String[] args) {
        // Parent reference, child objects
        Animal animal1 = new Dog();
        Animal animal2 = new Cat();
        Animal animal3 = new Bird();
        
        // Same method call, different behaviors (polymorphism)
        animal1.makeSound();
        animal1.move();
        
        System.out.println();
        
        animal2.makeSound();
        animal2.move();
        
        System.out.println();
        
        animal3.makeSound();
        animal3.move();
    }
}
```

**Output:**
```
Dog barks: Woof! Woof!
Dog runs on four legs

Cat meows: Meow! Meow!
Cat walks gracefully

Bird chirps: Tweet! Tweet!
Bird flies in the sky
```

## Real-World Example: Shape Drawing

```java
// Abstract parent class
abstract class Shape {
    String name;
    
    Shape(String name) {
        this.name = name;
    }
    
    // Abstract method - must be overridden
    abstract double calculateArea();
    abstract void draw();
    
    // Concrete method
    void displayInfo() {
        System.out.println("Shape: " + name);
        System.out.println("Area: " + calculateArea());
    }
}

// Child classes
class Circle extends Shape {
    double radius;
    
    Circle(double radius) {
        super("Circle");
        this.radius = radius;
    }
    
    @Override
    double calculateArea() {
        return 3.14159 * radius * radius;
    }
    
    @Override
    void draw() {
        System.out.println("Drawing a circle with radius " + radius);
    }
}

class Rectangle extends Shape {
    double length;
    double width;
    
    Rectangle(double length, double width) {
        super("Rectangle");
        this.length = length;
        this.width = width;
    }
    
    @Override
    double calculateArea() {
        return length * width;
    }
    
    @Override
    void draw() {
        System.out.println("Drawing a rectangle " + length + " x " + width);
    }
}

class Triangle extends Shape {
    double base;
    double height;
    
    Triangle(double base, double height) {
        super("Triangle");
        this.base = base;
        this.height = height;
    }
    
    @Override
    double calculateArea() {
        return 0.5 * base * height;
    }
    
    @Override
    void draw() {
        System.out.println("Drawing a triangle with base " + base + " and height " + height);
    }
}

public class ShapePolymorphism {
    public static void main(String[] args) {
        // Array of Shape references pointing to different objects
        Shape[] shapes = {
            new Circle(5.0),
            new Rectangle(4.0, 6.0),
            new Triangle(3.0, 4.0)
        };
        
        // Polymorphism in action - same code, different behaviors
        for (Shape shape : shapes) {
            shape.draw();
            shape.displayInfo();
            System.out.println();
        }
    }
}
```

**Output:**
```
Drawing a circle with radius 5.0
Shape: Circle
Area: 78.53975

Drawing a rectangle 4.0 x 6.0
Shape: Rectangle
Area: 24.0

Drawing a triangle with base 3.0 and height 4.0
Shape: Triangle
Area: 6.0
```

## Real-World Example: Payment Processing

```java
// Interface for payment
interface Payment {
    void processPayment(double amount);
    void sendConfirmation();
}

// Different payment implementations
class CreditCardPayment implements Payment {
    String cardNumber;
    
    CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
        System.out.println("Card: ****" + cardNumber.substring(cardNumber.length() - 4));
    }
    
    @Override
    public void sendConfirmation() {
        System.out.println("Credit card payment confirmation sent");
    }
}

class PayPalPayment implements Payment {
    String email;
    
    PayPalPayment(String email) {
        this.email = email;
    }
    
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing PayPal payment of $" + amount);
        System.out.println("Email: " + email);
    }
    
    @Override
    public void sendConfirmation() {
        System.out.println("PayPal payment confirmation sent to " + email);
    }
}

class BankTransferPayment implements Payment {
    String accountNumber;
    
    BankTransferPayment(String accountNumber) {
        this.accountNumber = accountNumber;
    }
    
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing bank transfer of $" + amount);
        System.out.println("Account: " + accountNumber);
    }
    
    @Override
    public void sendConfirmation() {
        System.out.println("Bank transfer confirmation sent");
    }
}

public class PaymentPolymorphism {
    public static void main(String[] args) {
        // Array of Payment references
        Payment[] payments = {
            new CreditCardPayment("1234567890123456"),
            new PayPalPayment("user@example.com"),
            new BankTransferPayment("ACC123456")
        };
        
        double amount = 100.0;
        
        // Same interface, different implementations
        for (Payment payment : payments) {
            payment.processPayment(amount);
            payment.sendConfirmation();
            System.out.println();
        }
    }
}
```

## Key Concepts

### 1. Method Overloading (Compile-Time)

- Same method name
- Different parameters (number, type, or order)
- Resolved at compile time
- Within same class

### 2. Method Overriding (Runtime)

- Same method signature
- In parent and child class
- Resolved at runtime
- Uses `@Override` annotation

### 3. Upcasting

Parent reference can point to child object.

```java
Animal animal = new Dog();  // Upcasting
animal.makeSound();  // Calls Dog's makeSound()
```

## Benefits of Polymorphism

1. **Flexibility**: Same code works with different types
2. **Extensibility**: Easy to add new types
3. **Code Reusability**: Write once, use many times
4. **Maintainability**: Easier to maintain
5. **Simplicity**: Cleaner, more readable code

## Important Points

- Method overloading = Compile-time polymorphism
- Method overriding = Runtime polymorphism
- Parent reference can hold child objects
- Runtime polymorphism requires inheritance
- `@Override` annotation is recommended

## Summary

- Polymorphism = "Many Forms"
- Method overloading: Same name, different parameters
- Method overriding: Same signature, different implementations
- Enables flexible and extensible code
- Foundation of object-oriented programming
