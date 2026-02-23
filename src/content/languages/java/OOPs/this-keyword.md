# 'this' Keyword in Java

## What is 'this'?

The **`this`** keyword refers to the current object. It's like saying "this object" or "myself" in real life.

### Real-World Example

When you say "This is my car," you're referring to the car you own. Similarly, `this` refers to the current object you're working with.

## Uses of 'this' Keyword

### 1. Referencing Instance Variables

When parameter names match instance variable names, `this` helps distinguish between them.

```java
class Student {
    String name;  // Instance variable
    int age;      // Instance variable
    
    // Without 'this' - causes confusion
    void setData(String name, int age) {
        name = name;  // Which name? Parameter or instance variable?
        age = age;    // Which age? Parameter or instance variable?
    }
    
    // With 'this' - clear and correct
    void setDataCorrect(String name, int age) {
        this.name = name;  // 'this.name' refers to instance variable
        this.age = age;    // 'this.age' refers to instance variable
    }
    
    void display() {
        System.out.println("Name: " + name + ", Age: " + age);
    }
}

public class ThisExample {
    public static void main(String[] args) {
        Student s = new Student();
        s.setDataCorrect("Alice", 20);
        s.display();
    }
}
```

**Output:**
```
Name: Alice, Age: 20
```

### 2. Calling Constructor from Another Constructor

You can call one constructor from another using `this()`.

```java
class Rectangle {
    int length;
    int width;
    
    // Constructor 1: No parameters (default square)
    Rectangle() {
        this(5, 5);  // Calls Constructor 2 with default values
        System.out.println("Default square created (5x5)");
    }
    
    // Constructor 2: Both parameters
    Rectangle(int length, int width) {
        this.length = length;
        this.width = width;
    }
    
    // Constructor 3: Single parameter (square)
    Rectangle(int side) {
        this(side, side);  // Calls Constructor 2
        System.out.println("Square created with side: " + side);
    }
    
    int calculateArea() {
        return length * width;
    }
    
    void display() {
        System.out.println("Length: " + length + ", Width: " + width);
        System.out.println("Area: " + calculateArea());
    }
}

public class ThisConstructor {
    public static void main(String[] args) {
        Rectangle r1 = new Rectangle();        // Uses Constructor 1
        r1.display();
        System.out.println();
        
        Rectangle r2 = new Rectangle(4);     // Uses Constructor 3
        r2.display();
        System.out.println();
        
        Rectangle r3 = new Rectangle(6, 8);   // Uses Constructor 2
        r3.display();
    }
}
```

### 3. Passing Current Object as Parameter

You can pass the current object to methods.

```java
class Person {
    String name;
    int age;
    
    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Method that accepts a Person object
    void compareAge(Person other) {
        if (this.age > other.age) {
            System.out.println(this.name + " is older than " + other.name);
        } else if (this.age < other.age) {
            System.out.println(this.name + " is younger than " + other.name);
        } else {
            System.out.println(this.name + " and " + other.name + " are same age");
        }
    }
    
    // Method that uses 'this' to pass current object
    void compareWith(Person other) {
        other.compareAge(this);  // Passing current object
    }
}

public class ThisParameter {
    public static void main(String[] args) {
        Person person1 = new Person("Alice", 25);
        Person person2 = new Person("Bob", 30);
        
        person1.compareAge(person2);
        person2.compareWith(person1);
    }
}
```

### 4. Returning Current Object

You can return the current object, useful for method chaining.

```java
class Calculator {
    private int value;
    
    Calculator() {
        this.value = 0;
    }
    
    // Returns 'this' to allow method chaining
    Calculator add(int num) {
        this.value = this.value + num;
        return this;  // Return current object
    }
    
    Calculator subtract(int num) {
        this.value = this.value - num;
        return this;
    }
    
    Calculator multiply(int num) {
        this.value = this.value * num;
        return this;
    }
    
    int getValue() {
        return this.value;
    }
}

public class ThisReturn {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        
        // Method chaining using 'this'
        calc.add(10).subtract(3).multiply(2);
        
        System.out.println("Result: " + calc.getValue());
    }
}
```

**Output:**
```
Result: 14
```

## Real-World Example: Bank Account

```java
class BankAccount {
    private String accountNumber;
    private double balance;
    private String ownerName;
    
    BankAccount(String accountNumber, String ownerName) {
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = 0.0;
    }
    
    // Using 'this' to distinguish parameters from instance variables
    void setOwnerName(String ownerName) {
        this.ownerName = ownerName;  // 'this.ownerName' = instance variable
                                     // 'ownerName' = parameter
    }
    
    void deposit(double amount) {
        this.balance = this.balance + amount;
        System.out.println("Deposited: $" + amount);
    }
    
    void withdraw(double amount) {
        if (amount <= this.balance) {
            this.balance = this.balance - amount;
            System.out.println("Withdrawn: $" + amount);
        } else {
            System.out.println("Insufficient balance!");
        }
    }
    
    // Method that returns 'this' for chaining
    BankAccount transfer(BankAccount other, double amount) {
        if (amount <= this.balance) {
            this.balance = this.balance - amount;
            other.balance = other.balance + amount;
            System.out.println("Transferred $" + amount + " to " + other.ownerName);
        } else {
            System.out.println("Insufficient balance for transfer!");
        }
        return this;  // Return current object
    }
    
    void displayBalance() {
        System.out.println("Account: " + this.accountNumber);
        System.out.println("Owner: " + this.ownerName);
        System.out.println("Balance: $" + this.balance);
    }
}

public class BankAccountExample {
    public static void main(String[] args) {
        BankAccount account1 = new BankAccount("ACC001", "John Doe");
        BankAccount account2 = new BankAccount("ACC002", "Jane Smith");
        
        account1.deposit(1000);
        account1.transfer(account2, 300);
        
        account1.displayBalance();
        System.out.println();
        account2.displayBalance();
    }
}
```

## Key Points About 'this'

1. **Refers to current object**: The object that called the method
2. **Resolves naming conflicts**: When parameter names match instance variables
3. **Constructor chaining**: Call one constructor from another
4. **Method chaining**: Return `this` to chain method calls
5. **Optional but recommended**: Makes code clearer and more readable

## When to Use 'this'

- ✅ When parameter names match instance variable names
- ✅ When calling another constructor from a constructor
- ✅ When you need to pass current object to a method
- ✅ When returning current object for method chaining
- ✅ To make code more readable and clear

## Summary

- `this` refers to the current object
- Helps distinguish between parameters and instance variables
- Enables constructor and method chaining
- Makes code clearer and more maintainable
