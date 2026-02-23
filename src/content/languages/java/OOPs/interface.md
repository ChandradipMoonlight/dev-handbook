# Interface in Java

## What is an Interface?

An **interface** is a contract that defines what a class must do, but not how to do it. It's like a job description - it tells you what tasks to perform, but not how to perform them.

### Real-World Example

Think of a remote control. All remotes have buttons like "Power", "Volume Up", "Volume Down" (interface). But different brands implement these buttons differently (implementation).

## Basic Interface

```java
// Interface definition
interface Animal {
    // Abstract methods (no body)
    void makeSound();
    void move();
    void eat();
}

// Class implementing interface
class Dog implements Animal {
    String name;
    
    Dog(String name) {
        this.name = name;
    }
    
    // Must implement all interface methods
    public void makeSound() {
        System.out.println(name + " barks: Woof! Woof!");
    }
    
    public void move() {
        System.out.println(name + " runs on four legs");
    }
    
    public void eat() {
        System.out.println(name + " eats dog food");
    }
}

class Cat implements Animal {
    String name;
    
    Cat(String name) {
        this.name = name;
    }
    
    public void makeSound() {
        System.out.println(name + " meows: Meow! Meow!");
    }
    
    public void move() {
        System.out.println(name + " walks gracefully");
    }
    
    public void eat() {
        System.out.println(name + " eats cat food");
    }
}

public class InterfaceExample {
    public static void main(String[] args) {
        Animal dog = new Dog("Buddy");
        Animal cat = new Cat("Whiskers");
        
        dog.makeSound();
        dog.move();
        dog.eat();
        
        System.out.println();
        
        cat.makeSound();
        cat.move();
        cat.eat();
    }
}
```

**Output:**
```
Buddy barks: Woof! Woof!
Buddy runs on four legs
Buddy eats dog food

Whiskers meows: Meow! Meow!
Whiskers walks gracefully
Whiskers eats cat food
```

## Multiple Interfaces

A class can implement multiple interfaces (Java doesn't support multiple inheritance, but supports multiple interfaces).

```java
interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

interface Walkable {
    void walk();
}

// Duck implements multiple interfaces
class Duck implements Flyable, Swimmable, Walkable {
    String name;
    
    Duck(String name) {
        this.name = name;
    }
    
    public void fly() {
        System.out.println(name + " is flying");
    }
    
    public void swim() {
        System.out.println(name + " is swimming");
    }
    
    public void walk() {
        System.out.println(name + " is walking");
    }
}

public class MultipleInterfaces {
    public static void main(String[] args) {
        Duck duck = new Duck("Donald");
        
        duck.fly();
        duck.swim();
        duck.walk();
    }
}
```

## Interface with Default Methods (Java 8+)

Interfaces can have default methods with implementation.

```java
interface Vehicle {
    // Abstract method
    void start();
    
    // Default method - has implementation
    default void stop() {
        System.out.println("Vehicle stopped");
    }
    
    // Default method
    default void honk() {
        System.out.println("Beep! Beep!");
    }
}

class Car implements Vehicle {
    String model;
    
    Car(String model) {
        this.model = model;
    }
    
    // Must implement abstract method
    public void start() {
        System.out.println(model + " car started");
    }
    
    // Can override default method (optional)
    public void honk() {
        System.out.println(model + " car honks: Honk! Honk!");
    }
}

class Bike implements Vehicle {
    String brand;
    
    Bike(String brand) {
        this.brand = brand;
    }
    
    public void start() {
        System.out.println(brand + " bike started");
    }
    // Uses default stop() and honk() methods
}

public class DefaultMethodExample {
    public static void main(String[] args) {
        Car car = new Car("Toyota");
        Bike bike = new Bike("Honda");
        
        car.start();
        car.stop();
        car.honk();
        
        System.out.println();
        
        bike.start();
        bike.stop();
        bike.honk();
    }
}
```

## Interface with Static Methods (Java 8+)

Interfaces can have static methods.

```java
interface MathOperations {
    // Abstract method
    int calculate(int a, int b);
    
    // Static method
    static int add(int a, int b) {
        return a + b;
    }
    
    static int multiply(int a, int b) {
        return a * b;
    }
}

class Calculator implements MathOperations {
    public int calculate(int a, int b) {
        return a - b;  // Subtraction
    }
}

public class StaticMethodExample {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        // Call static methods using interface name
        System.out.println("Add: " + MathOperations.add(5, 3));
        System.out.println("Multiply: " + MathOperations.multiply(4, 7));
        System.out.println("Calculate: " + calc.calculate(10, 3));
    }
}
```

## Real-World Example: Payment System

```java
// Payment interface
interface Payment {
    void processPayment(double amount);
    boolean verifyPayment();
    void sendConfirmation();
}

// Credit Card implementation
class CreditCardPayment implements Payment {
    private String cardNumber;
    private String cardHolder;
    
    CreditCardPayment(String cardNumber, String cardHolder) {
        this.cardNumber = cardNumber;
        this.cardHolder = cardHolder;
    }
    
    public void processPayment(double amount) {
        System.out.println("Processing credit card payment...");
        System.out.println("Amount: $" + amount);
        System.out.println("Card: ****" + cardNumber.substring(cardNumber.length() - 4));
    }
    
    public boolean verifyPayment() {
        System.out.println("Verifying credit card...");
        return true;
    }
    
    public void sendConfirmation() {
        System.out.println("Payment confirmation sent to " + cardHolder);
    }
}

// PayPal implementation
class PayPalPayment implements Payment {
    private String email;
    
    PayPalPayment(String email) {
        this.email = email;
    }
    
    public void processPayment(double amount) {
        System.out.println("Processing PayPal payment...");
        System.out.println("Amount: $" + amount);
        System.out.println("Email: " + email);
    }
    
    public boolean verifyPayment() {
        System.out.println("Verifying PayPal account...");
        return true;
    }
    
    public void sendConfirmation() {
        System.out.println("Payment confirmation sent to " + email);
    }
}

// Bank Transfer implementation
class BankTransferPayment implements Payment {
    private String accountNumber;
    
    BankTransferPayment(String accountNumber) {
        this.accountNumber = accountNumber;
    }
    
    public void processPayment(double amount) {
        System.out.println("Processing bank transfer...");
        System.out.println("Amount: $" + amount);
        System.out.println("Account: " + accountNumber);
    }
    
    public boolean verifyPayment() {
        System.out.println("Verifying bank account...");
        return true;
    }
    
    public void sendConfirmation() {
        System.out.println("Bank transfer confirmation sent");
    }
}

public class PaymentSystem {
    public static void main(String[] args) {
        Payment[] payments = {
            new CreditCardPayment("1234567890123456", "John Doe"),
            new PayPalPayment("jane@example.com"),
            new BankTransferPayment("ACC123456")
        };
        
        double amount = 100.0;
        
        for (Payment payment : payments) {
            payment.processPayment(amount);
            if (payment.verifyPayment()) {
                payment.sendConfirmation();
            }
            System.out.println();
        }
    }
}
```

## Interface vs Abstract Class

| Interface | Abstract Class |
|-----------|---------------|
| Only abstract methods (Java 7) | Can have concrete methods |
| Multiple inheritance | Single inheritance |
| No instance variables | Can have instance variables |
| No constructors | Can have constructors |
| All methods public by default | Can have any access modifier |
| Use `implements` keyword | Use `extends` keyword |

## Key Points About Interfaces

1. **Contract**: Defines what, not how
2. **Multiple Implementation**: Class can implement multiple interfaces
3. **All methods public**: By default (can be explicitly stated)
4. **Constants**: Can have `public static final` variables
5. **Default methods**: Can have implementation (Java 8+)
6. **Static methods**: Can have static methods (Java 8+)

## When to Use Interface

- ✅ When you want to define a contract
- ✅ When multiple unrelated classes need same behavior
- ✅ When you need multiple inheritance
- ✅ When you want to achieve loose coupling
- ✅ For API design and contracts

## Summary

- Interface defines a contract that classes must follow
- Class implements interface using `implements` keyword
- Can implement multiple interfaces
- Supports default and static methods (Java 8+)
- Enables polymorphism and loose coupling
- Essential for building flexible and maintainable code
