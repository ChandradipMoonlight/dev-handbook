# Method Overriding in Java

## What is Method Overriding?

**Method Overriding** occurs when a child class provides its own implementation of a method that already exists in the parent class. The method signature (name and parameters) must be the same.

### Real-World Example

Think of a parent teaching a child to cook. The parent has a basic recipe (parent method), but the child might add their own twist (override) while keeping the same dish name (method name).

## Basic Method Overriding

```java
// Parent class
class Animal {
    void makeSound() {
        System.out.println("Animal makes a sound");
    }
    
    void eat() {
        System.out.println("Animal is eating");
    }
    
    void sleep() {
        System.out.println("Animal is sleeping");
    }
}

// Child class - overrides parent methods
class Dog extends Animal {
    // Overriding makeSound()
    @Override
    void makeSound() {
        System.out.println("Dog barks: Woof! Woof!");
    }
    
    // Overriding eat()
    @Override
    void eat() {
        System.out.println("Dog eats dog food");
    }
    
    // sleep() is not overridden - uses parent's implementation
}

// Another child class
class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Cat meows: Meow! Meow!");
    }
    
    @Override
    void eat() {
        System.out.println("Cat eats cat food");
    }
}

public class MethodOverridingExample {
    public static void main(String[] args) {
        Dog dog = new Dog();
        Cat cat = new Cat();
        
        System.out.println("=== Dog ===");
        dog.makeSound();  // Calls overridden method
        dog.eat();        // Calls overridden method
        dog.sleep();      // Calls parent's method
        
        System.out.println("\n=== Cat ===");
        cat.makeSound();  // Calls overridden method
        cat.eat();        // Calls overridden method
        cat.sleep();      // Calls parent's method
    }
}
```

**Output:**
```
=== Dog ===
Dog barks: Woof! Woof!
Dog eats dog food
Animal is sleeping

=== Cat ===
Cat meows: Meow! Meow!
Cat eats cat food
Animal is sleeping
```

## Rules for Method Overriding

1. Method name must be same
2. Parameters must be same
3. Return type must be same (or covariant)
4. Access modifier cannot be more restrictive
5. Cannot override `static`, `final`, or `private` methods

```java
class Parent {
    // Can be overridden
    public void method1() {
        System.out.println("Parent method1");
    }
    
    // Cannot be overridden (final)
    public final void method2() {
        System.out.println("Parent method2 - final");
    }
    
    // Cannot be overridden (private)
    private void method3() {
        System.out.println("Parent method3 - private");
    }
    
    // Cannot be overridden (static)
    public static void method4() {
        System.out.println("Parent method4 - static");
    }
}

class Child extends Parent {
    // ✅ Valid override
    @Override
    public void method1() {
        System.out.println("Child method1 - overridden");
    }
    
    // ❌ Error - cannot override final method
    // public void method2() { }
    
    // ❌ Error - cannot override private method
    // public void method3() { }
    
    // This is method hiding, not overriding
    public static void method4() {
        System.out.println("Child method4 - static (hiding)");
    }
}
```

## Using `super` in Overriding

You can call the parent's method from the overridden method using `super`.

```java
class Vehicle {
    void start() {
        System.out.println("Vehicle engine started");
    }
    
    void displayInfo() {
        System.out.println("This is a vehicle");
    }
}

class Car extends Vehicle {
    String model;
    
    Car(String model) {
        this.model = model;
    }
    
    @Override
    void start() {
        super.start();  // Call parent's start method
        System.out.println(model + " car is ready to drive");
    }
    
    @Override
    void displayInfo() {
        super.displayInfo();  // Call parent's method
        System.out.println("Model: " + model);
    }
}

public class SuperInOverriding {
    public static void main(String[] args) {
        Car car = new Car("Toyota");
        car.start();
        System.out.println();
        car.displayInfo();
    }
}
```

**Output:**
```
Vehicle engine started
Toyota car is ready to drive

This is a vehicle
Model: Toyota
```

## Real-World Example: Employee Hierarchy

```java
class Employee {
    protected String name;
    protected double salary;
    
    Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }
    
    double calculateSalary() {
        return salary;
    }
    
    void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Base Salary: $" + salary);
    }
    
    void work() {
        System.out.println(name + " is working");
    }
}

class Manager extends Employee {
    private double bonus;
    
    Manager(String name, double salary, double bonus) {
        super(name, salary);
        this.bonus = bonus;
    }
    
    // Override calculateSalary
    @Override
    double calculateSalary() {
        return salary + bonus;  // Manager gets bonus
    }
    
    // Override displayInfo
    @Override
    void displayInfo() {
        super.displayInfo();  // Call parent method
        System.out.println("Bonus: $" + bonus);
        System.out.println("Total Salary: $" + calculateSalary());
    }
    
    // Override work
    @Override
    void work() {
        System.out.println(name + " is managing the team");
    }
}

class Developer extends Employee {
    private String programmingLanguage;
    
    Developer(String name, double salary, String language) {
        super(name, salary);
        this.programmingLanguage = language;
    }
    
    @Override
    void displayInfo() {
        super.displayInfo();
        System.out.println("Programming Language: " + programmingLanguage);
    }
    
    @Override
    void work() {
        System.out.println(name + " is coding in " + programmingLanguage);
    }
}

public class EmployeeOverriding {
    public static void main(String[] args) {
        Employee emp1 = new Manager("John", 80000, 10000);
        Employee emp2 = new Developer("Jane", 60000, "Java");
        
        System.out.println("=== Manager ===");
        emp1.displayInfo();
        emp1.work();
        System.out.println("Calculated Salary: $" + emp1.calculateSalary());
        
        System.out.println("\n=== Developer ===");
        emp2.displayInfo();
        emp2.work();
        System.out.println("Calculated Salary: $" + emp2.calculateSalary());
    }
}
```

## Covariant Return Types

Since Java 5, you can return a subtype of the parent's return type.

```java
class Parent {
    Number getValue() {
        return 10;
    }
}

class Child extends Parent {
    @Override
    Integer getValue() {  // Integer is subtype of Number
        return 20;
    }
}
```

## @Override Annotation

The `@Override` annotation is recommended because it:
- Makes code more readable
- Helps catch errors at compile time
- Clearly indicates overridden methods

```java
class Parent {
    void method() {
        System.out.println("Parent method");
    }
}

class Child extends Parent {
    @Override
    void method() {  // Compiler checks if this actually overrides
        System.out.println("Child method");
    }
    
    // This would cause compile error - not actually overriding
    // @Override
    // void method(int x) { }  // Error: method doesn't override
}
```

## Method Overriding vs Method Overloading

| Method Overriding | Method Overloading |
|------------------|-------------------|
| Same method signature | Different parameters |
| In parent and child class | In same class |
| Runtime polymorphism | Compile-time polymorphism |
| `@Override` annotation | No annotation needed |

## Benefits of Method Overriding

1. **Polymorphism**: Enables runtime polymorphism
2. **Flexibility**: Different implementations for different classes
3. **Code Reusability**: Reuse parent class structure
4. **Extensibility**: Easy to extend functionality

## Summary

- Method overriding provides specific implementation in child class
- Method signature must match parent class
- Use `@Override` annotation for clarity
- Can call parent method using `super`
- Enables runtime polymorphism
- Foundation of object-oriented programming
