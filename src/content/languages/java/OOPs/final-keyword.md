# Final Keyword in Java

## What is 'final'?

The **`final`** keyword means something cannot be changed once it's set. It creates constants and prevents modification.

### Real-World Example

Think of your birth date - it never changes. Similarly, `final` makes values permanent.

## Uses of 'final'

### 1. Final Variables (Constants)

A final variable cannot be changed after initialization.

```java
class Circle {
    // Final variable - cannot be changed
    final double PI = 3.14159;
    double radius;
    
    Circle(double radius) {
        this.radius = radius;
    }
    
    double calculateArea() {
        return PI * radius * radius;  // Using final constant
    }
    
    double calculateCircumference() {
        return 2 * PI * radius;
    }
}

public class FinalVariableExample {
    public static void main(String[] args) {
        Circle c = new Circle(5.0);
        
        System.out.println("Area: " + c.calculateArea());
        System.out.println("Circumference: " + c.calculateCircumference());
        
        // This would cause error - cannot change final variable
        // c.PI = 3.14;  // Compilation error!
    }
}
```

### 2. Final with Static (Class Constants)

Common pattern: `static final` for class-wide constants.

```java
class MathConstants {
    // Static final - shared constant for all objects
    static final double PI = 3.14159;
    static final double E = 2.71828;
    static final int MAX_VALUE = 1000;
    
    static void displayConstants() {
        System.out.println("PI = " + PI);
        System.out.println("E = " + E);
        System.out.println("MAX_VALUE = " + MAX_VALUE);
    }
}

public class StaticFinalExample {
    public static void main(String[] args) {
        // Access static final using class name
        System.out.println("Value of PI: " + MathConstants.PI);
        System.out.println("Value of E: " + MathConstants.E);
        
        MathConstants.displayConstants();
        
        // Cannot change - compilation error
        // MathConstants.PI = 3.14;  // Error!
    }
}
```

### 3. Final Methods

Final methods cannot be overridden in child classes.

```java
class Vehicle {
    final void startEngine() {
        System.out.println("Engine started - this cannot be overridden");
    }
    
    void accelerate() {
        System.out.println("Vehicle is accelerating");
    }
}

class Car extends Vehicle {
    // This would cause error - cannot override final method
    // void startEngine() {  // Compilation error!
    //     System.out.println("Custom start");
    // }
    
    // Can override non-final method
    void accelerate() {
        System.out.println("Car is accelerating fast");
    }
}

public class FinalMethodExample {
    public static void main(String[] args) {
        Car car = new Car();
        car.startEngine();  // Uses parent's final method
        car.accelerate();   // Uses overridden method
    }
}
```

### 4. Final Classes

Final classes cannot be extended (no inheritance).

```java
// Final class - cannot be extended
final class ImmutableString {
    private String value;
    
    ImmutableString(String value) {
        this.value = value;
    }
    
    String getValue() {
        return value;
    }
}

// This would cause error - cannot extend final class
// class ExtendedString extends ImmutableString {  // Error!
// }

public class FinalClassExample {
    public static void main(String[] args) {
        ImmutableString str = new ImmutableString("Hello");
        System.out.println(str.getValue());
    }
}
```

## Real-World Example: Bank Account with Constants

```java
class BankAccount {
    // Final constants
    static final double MIN_BALANCE = 100.0;
    static final double MAX_WITHDRAWAL = 10000.0;
    static final String BANK_NAME = "Secure Bank";
    
    private String accountNumber;
    private double balance;
    
    BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        if (initialBalance >= MIN_BALANCE) {
            this.balance = initialBalance;
        } else {
            System.out.println("Minimum balance required: $" + MIN_BALANCE);
            this.balance = MIN_BALANCE;
        }
    }
    
    void deposit(double amount) {
        balance = balance + amount;
        System.out.println("Deposited: $" + amount);
    }
    
    void withdraw(double amount) {
        if (amount > MAX_WITHDRAWAL) {
            System.out.println("Maximum withdrawal limit: $" + MAX_WITHDRAWAL);
            return;
        }
        
        if (balance - amount >= MIN_BALANCE) {
            balance = balance - amount;
            System.out.println("Withdrawn: $" + amount);
        } else {
            System.out.println("Cannot withdraw! Minimum balance must be: $" + MIN_BALANCE);
        }
    }
    
    void displayInfo() {
        System.out.println("Bank: " + BANK_NAME);
        System.out.println("Account: " + accountNumber);
        System.out.println("Balance: $" + balance);
    }
}

public class BankAccountExample {
    public static void main(String[] args) {
        System.out.println("Bank Name: " + BankAccount.BANK_NAME);
        System.out.println("Min Balance: $" + BankAccount.MIN_BALANCE);
        System.out.println("Max Withdrawal: $" + BankAccount.MAX_WITHDRAWAL);
        System.out.println();
        
        BankAccount account = new BankAccount("ACC001", 500);
        account.displayInfo();
        System.out.println();
        
        account.withdraw(450);  // Would violate min balance
        account.withdraw(400);  // Valid withdrawal
        account.displayInfo();
    }
}
```

## Final Parameters

Parameters can also be final - they cannot be changed inside the method.

```java
class Calculator {
    // Final parameter - cannot be modified
    int calculate(final int a, final int b) {
        // This would cause error
        // a = 10;  // Error! Cannot modify final parameter
        
        return a + b;
    }
    
    void process(final String message) {
        System.out.println("Processing: " + message);
        // message = "Changed";  // Error! Cannot modify final parameter
    }
}

public class FinalParameterExample {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        int result = calc.calculate(5, 3);
        System.out.println("Result: " + result);
        
        calc.process("Important data");
    }
}
```

## Key Points About Final

1. **Final variable**: Cannot be changed after initialization
2. **Final method**: Cannot be overridden
3. **Final class**: Cannot be extended
4. **Final parameter**: Cannot be modified in method
5. **Common pattern**: `static final` for constants

## When to Use Final

- ✅ Constants that never change (PI, MAX_VALUE)
- ✅ Methods that should not be overridden
- ✅ Classes that should not be extended
- ✅ Parameters that should not be modified
- ✅ Security and immutability

## Summary

- `final` makes things unchangeable
- Variables become constants
- Methods cannot be overridden
- Classes cannot be extended
- Ensures security and prevents accidental changes
