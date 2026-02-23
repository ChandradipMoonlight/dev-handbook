# Class and Object in Java

## What is a Class?

Think of a **class** as a blueprint or template. Just like an architect creates a blueprint before building a house, a class defines what an object will look like and what it can do.

### Real-World Example

Imagine you're designing a car. The blueprint (class) would specify:
- What features it has (color, model, engine)
- What actions it can perform (start, stop, accelerate)

```java
// This is a class - a blueprint for creating cars
class Car {
    // Attributes (what the car has)
    String color;
    String model;
    int year;
    
    // Methods (what the car can do)
    void start() {
        System.out.println("Car is starting...");
    }
    
    void stop() {
        System.out.println("Car has stopped.");
    }
    
    void displayInfo() {
        System.out.println("Model: " + model + ", Color: " + color + ", Year: " + year);
    }
}
```

## What is an Object?

An **object** is a real instance created from a class. Using the car example, if the class is the blueprint, the object is the actual car built from that blueprint.

### Real-World Example

From one blueprint (class), you can build many cars (objects), each with different colors and models.

```java
public class CarExample {
    public static void main(String[] args) {
        // Creating objects (actual cars) from the Car class
        Car car1 = new Car();  // First car
        car1.color = "Red";
        car1.model = "Toyota";
        car1.year = 2023;
        
        Car car2 = new Car();  // Second car
        car2.color = "Blue";
        car2.model = "Honda";
        car2.year = 2022;
        
        // Using the objects
        car1.start();
        car1.displayInfo();
        
        car2.start();
        car2.displayInfo();
    }
}
```

**Output:**
```
Car is starting...
Model: Toyota, Color: Red, Year: 2023
Car is starting...
Model: Honda, Color: Blue, Year: 2022
```

## Key Points

1. **Class** = Blueprint/Template
2. **Object** = Real instance created from the class
3. One class can create many objects
4. Each object has its own copy of attributes
5. Objects can perform actions defined in the class

## Another Example: Bank Account

```java
class BankAccount {
    String accountHolder;
    double balance;
    String accountNumber;
    
    void deposit(double amount) {
        balance = balance + amount;
        System.out.println("Deposited: $" + amount);
        System.out.println("New balance: $" + balance);
    }
    
    void withdraw(double amount) {
        if (amount <= balance) {
            balance = balance - amount;
            System.out.println("Withdrawn: $" + amount);
            System.out.println("Remaining balance: $" + balance);
        } else {
            System.out.println("Insufficient funds!");
        }
    }
    
    void displayBalance() {
        System.out.println("Account Holder: " + accountHolder);
        System.out.println("Account Number: " + accountNumber);
        System.out.println("Balance: $" + balance);
    }
}

public class BankExample {
    public static void main(String[] args) {
        // Creating two different bank accounts
        BankAccount account1 = new BankAccount();
        account1.accountHolder = "John Doe";
        account1.accountNumber = "ACC001";
        account1.balance = 1000.0;
        
        BankAccount account2 = new BankAccount();
        account2.accountHolder = "Jane Smith";
        account2.accountNumber = "ACC002";
        account2.balance = 500.0;
        
        // Each account operates independently
        account1.deposit(500);
        account2.withdraw(200);
        
        account1.displayBalance();
        account2.displayBalance();
    }
}
```

## Summary

- **Class**: A template that defines structure and behavior
- **Object**: An instance of a class with actual values
- **new keyword**: Used to create objects
- Multiple objects can be created from one class
- Each object is independent with its own data
