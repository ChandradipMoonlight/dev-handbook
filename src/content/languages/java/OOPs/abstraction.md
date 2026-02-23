# Abstraction in Java

## What is Abstraction?

**Abstraction** means hiding complex implementation details and showing only essential features. It's like using a car - you know how to drive (essential), but you don't need to know how the engine works (implementation details).

### Real-World Example

When you use a smartphone, you tap icons to use apps. You don't need to know how the touchscreen sensors work or how the operating system processes your taps. The complexity is hidden from you.

## Types of Abstraction in Java

### 1. Abstract Classes

An abstract class cannot be instantiated directly. It may contain abstract methods (without body) that must be implemented by child classes.

```java
// Abstract class - cannot create objects directly
abstract class Animal {
    String name;
    
    Animal(String name) {
        this.name = name;
    }
    
    // Concrete method - has implementation
    void eat() {
        System.out.println(name + " is eating");
    }
    
    // Abstract method - no implementation, must be overridden
    abstract void makeSound();
    abstract void move();
}

// Concrete class - must implement abstract methods
class Dog extends Animal {
    Dog(String name) {
        super(name);
    }
    
    // Must implement abstract methods
    void makeSound() {
        System.out.println(name + " barks: Woof! Woof!");
    }
    
    void move() {
        System.out.println(name + " runs on four legs");
    }
}

class Bird extends Animal {
    Bird(String name) {
        super(name);
    }
    
    void makeSound() {
        System.out.println(name + " chirps: Tweet! Tweet!");
    }
    
    void move() {
        System.out.println(name + " flies in the sky");
    }
}

public class AbstractClassExample {
    public static void main(String[] args) {
        // Cannot create object of abstract class
        // Animal animal = new Animal("Generic");  // Error!
        
        Dog dog = new Dog("Buddy");
        Bird bird = new Bird("Tweety");
        
        dog.eat();
        dog.makeSound();
        dog.move();
        
        System.out.println();
        
        bird.eat();
        bird.makeSound();
        bird.move();
    }
}
```

**Output:**
```
Buddy is eating
Buddy barks: Woof! Woof!
Buddy runs on four legs

Tweety is eating
Tweety chirps: Tweet! Tweet!
Tweety flies in the sky
```

### 2. Interfaces

An interface defines a contract that classes must follow. It contains only abstract methods (in Java 7) or default/static methods (in Java 8+).

```java
// Interface - defines what a class must do
interface Vehicle {
    void start();      // Abstract method
    void stop();       // Abstract method
    void accelerate(); // Abstract method
}

// Class implements interface
class Car implements Vehicle {
    String model;
    
    Car(String model) {
        this.model = model;
    }
    
    // Must implement all interface methods
    public void start() {
        System.out.println(model + " car engine started");
    }
    
    public void stop() {
        System.out.println(model + " car stopped");
    }
    
    public void accelerate() {
        System.out.println(model + " car is accelerating");
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
    
    public void stop() {
        System.out.println(brand + " bike stopped");
    }
    
    public void accelerate() {
        System.out.println(brand + " bike is accelerating");
    }
}

public class InterfaceExample {
    public static void main(String[] args) {
        Vehicle car = new Car("Toyota");
        Vehicle bike = new Bike("Honda");
        
        car.start();
        car.accelerate();
        car.stop();
        
        System.out.println();
        
        bike.start();
        bike.accelerate();
        bike.stop();
    }
}
```

## Real-World Example: Payment System

```java
// Abstract class for payment
abstract class Payment {
    protected double amount;
    protected String transactionId;
    
    Payment(double amount) {
        this.amount = amount;
        this.transactionId = generateTransactionId();
    }
    
    // Concrete method
    String generateTransactionId() {
        return "TXN" + System.currentTimeMillis();
    }
    
    // Abstract methods - must be implemented
    abstract void processPayment();
    abstract boolean verifyPayment();
    abstract void sendConfirmation();
    
    // Concrete method
    void displayTransactionInfo() {
        System.out.println("Transaction ID: " + transactionId);
        System.out.println("Amount: $" + amount);
    }
}

// Credit Card payment
class CreditCardPayment extends Payment {
    String cardNumber;
    String cardHolder;
    
    CreditCardPayment(double amount, String cardNumber, String cardHolder) {
        super(amount);
        this.cardNumber = cardNumber;
        this.cardHolder = cardHolder;
    }
    
    void processPayment() {
        System.out.println("Processing credit card payment...");
        System.out.println("Card: ****" + cardNumber.substring(cardNumber.length() - 4));
        System.out.println("Cardholder: " + cardHolder);
    }
    
    boolean verifyPayment() {
        System.out.println("Verifying credit card...");
        // Simulate verification
        return true;
    }
    
    void sendConfirmation() {
        System.out.println("Payment confirmation sent to " + cardHolder);
    }
}

// PayPal payment
class PayPalPayment extends Payment {
    String email;
    
    PayPalPayment(double amount, String email) {
        super(amount);
        this.email = email;
    }
    
    void processPayment() {
        System.out.println("Processing PayPal payment...");
        System.out.println("Email: " + email);
    }
    
    boolean verifyPayment() {
        System.out.println("Verifying PayPal account...");
        return true;
    }
    
    void sendConfirmation() {
        System.out.println("Payment confirmation sent to " + email);
    }
}

public class PaymentSystem {
    public static void main(String[] args) {
        Payment payment1 = new CreditCardPayment(100.0, "1234567890123456", "John Doe");
        Payment payment2 = new PayPalPayment(50.0, "jane@example.com");
        
        System.out.println("=== Credit Card Payment ===");
        payment1.displayTransactionInfo();
        payment1.processPayment();
        if (payment1.verifyPayment()) {
            payment1.sendConfirmation();
        }
        
        System.out.println("\n=== PayPal Payment ===");
        payment2.displayTransactionInfo();
        payment2.processPayment();
        if (payment2.verifyPayment()) {
            payment2.sendConfirmation();
        }
    }
}
```

## Abstract Class vs Interface

| Abstract Class | Interface |
|---------------|-----------|
| Can have concrete methods | Only abstract methods (Java 7) |
| Can have instance variables | Only constants (static final) |
| Single inheritance | Multiple inheritance possible |
| Use `extends` keyword | Use `implements` keyword |
| Can have constructors | Cannot have constructors |

## When to Use What?

### Use Abstract Class when:
- You want to share code among related classes
- You need instance variables
- You want to provide default implementations

### Use Interface when:
- You want to define a contract
- Multiple unrelated classes need to follow same contract
- You want multiple inheritance

## Benefits of Abstraction

1. **Simplifies Complexity**: Hides implementation details
2. **Security**: Prevents direct access to internal details
3. **Flexibility**: Can change implementation without affecting users
4. **Code Reusability**: Common code in abstract class
5. **Maintainability**: Easier to maintain and update

## Summary

- Abstraction hides complexity and shows only essentials
- Abstract classes provide partial implementation
- Interfaces define contracts that classes must follow
- Makes code more flexible and maintainable
- Essential for building scalable applications
