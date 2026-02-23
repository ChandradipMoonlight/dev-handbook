# Inheritance in Java

## What is Inheritance?

**Inheritance** allows a class to inherit properties and methods from another class. It's like a child inheriting traits from parents.

### Real-World Example

Think of a family tree. A child inherits characteristics from parents. Similarly, in Java, a child class inherits features from a parent class.

## Basic Inheritance

```java
// Parent class (Superclass)
class Animal {
    String name;
    int age;
    
    Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    void eat() {
        System.out.println(name + " is eating");
    }
    
    void sleep() {
        System.out.println(name + " is sleeping");
    }
    
    void displayInfo() {
        System.out.println("Name: " + name + ", Age: " + age);
    }
}

// Child class (Subclass) - inherits from Animal
class Dog extends Animal {
    String breed;
    
    Dog(String name, int age, String breed) {
        super(name, age);  // Call parent constructor
        this.breed = breed;
    }
    
    // Additional method specific to Dog
    void bark() {
        System.out.println(name + " barks: Woof! Woof!");
    }
    
    // Override parent method
    void displayInfo() {
        super.displayInfo();  // Call parent method
        System.out.println("Breed: " + breed);
    }
}

// Another child class
class Cat extends Animal {
    String color;
    
    Cat(String name, int age, String color) {
        super(name, age);
        this.color = color;
    }
    
    void meow() {
        System.out.println(name + " meows: Meow! Meow!");
    }
    
    void displayInfo() {
        super.displayInfo();
        System.out.println("Color: " + color);
    }
}

public class InheritanceExample {
    public static void main(String[] args) {
        Dog dog = new Dog("Buddy", 3, "Golden Retriever");
        Cat cat = new Cat("Whiskers", 2, "Orange");
        
        // Dog can use inherited methods
        dog.eat();
        dog.sleep();
        dog.bark();  // Dog-specific method
        dog.displayInfo();
        
        System.out.println();
        
        // Cat can use inherited methods
        cat.eat();
        cat.sleep();
        cat.meow();  // Cat-specific method
        cat.displayInfo();
    }
}
```

**Output:**
```
Buddy is eating
Buddy is sleeping
Buddy barks: Woof! Woof!
Name: Buddy, Age: 3
Breed: Golden Retriever

Whiskers is eating
Whiskers is sleeping
Whiskers meows: Meow! Meow!
Name: Whiskers, Age: 2
Color: Orange
```

## Types of Inheritance

### 1. Single Inheritance

One child class inherits from one parent class (Java supports only this).

```java
class Vehicle {
    String brand;
    int year;
    
    Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    void start() {
        System.out.println(brand + " vehicle started");
    }
}

class Car extends Vehicle {
    int doors;
    
    Car(String brand, int year, int doors) {
        super(brand, year);
        this.doors = doors;
    }
    
    void displayInfo() {
        System.out.println("Brand: " + brand + ", Year: " + year + ", Doors: " + doors);
    }
}
```

### 2. Multilevel Inheritance

A class inherits from another class, which inherits from yet another class.

```java
class Animal {
    void eat() {
        System.out.println("Animal is eating");
    }
}

class Mammal extends Animal {
    void breathe() {
        System.out.println("Mammal is breathing");
    }
}

class Dog extends Mammal {
    void bark() {
        System.out.println("Dog is barking");
    }
}

public class MultilevelInheritance {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.eat();      // From Animal
        dog.breathe();  // From Mammal
        dog.bark();     // From Dog
    }
}
```

### 3. Hierarchical Inheritance

Multiple child classes inherit from one parent class.

```java
class Shape {
    void draw() {
        System.out.println("Drawing a shape");
    }
}

class Circle extends Shape {
    void draw() {
        System.out.println("Drawing a circle");
    }
}

class Rectangle extends Shape {
    void draw() {
        System.out.println("Drawing a rectangle");
    }
}

class Triangle extends Shape {
    void draw() {
        System.out.println("Drawing a triangle");
    }
}
```

## Real-World Example: Employee Hierarchy

```java
// Base class
class Employee {
    protected String name;
    protected int employeeId;
    protected double salary;
    
    Employee(String name, int employeeId, double salary) {
        this.name = name;
        this.employeeId = employeeId;
        this.salary = salary;
    }
    
    void displayInfo() {
        System.out.println("Employee ID: " + employeeId);
        System.out.println("Name: " + name);
        System.out.println("Salary: $" + salary);
    }
    
    double calculateSalary() {
        return salary;
    }
}

// Derived class 1
class Manager extends Employee {
    private double bonus;
    
    Manager(String name, int employeeId, double salary, double bonus) {
        super(name, employeeId, salary);
        this.bonus = bonus;
    }
    
    // Override method
    double calculateSalary() {
        return salary + bonus;
    }
    
    void displayInfo() {
        super.displayInfo();
        System.out.println("Bonus: $" + bonus);
        System.out.println("Total Salary: $" + calculateSalary());
    }
    
    void conductMeeting() {
        System.out.println(name + " is conducting a meeting");
    }
}

// Derived class 2
class Developer extends Employee {
    private String programmingLanguage;
    
    Developer(String name, int employeeId, double salary, String language) {
        super(name, employeeId, salary);
        this.programmingLanguage = language;
    }
    
    void displayInfo() {
        super.displayInfo();
        System.out.println("Programming Language: " + programmingLanguage);
    }
    
    void writeCode() {
        System.out.println(name + " is writing code in " + programmingLanguage);
    }
}

// Derived class 3
class Intern extends Employee {
    private int duration;  // in months
    
    Intern(String name, int employeeId, double salary, int duration) {
        super(name, employeeId, salary);
        this.duration = duration;
    }
    
    void displayInfo() {
        super.displayInfo();
        System.out.println("Internship Duration: " + duration + " months");
    }
    
    void learn() {
        System.out.println(name + " is learning new skills");
    }
}

public class EmployeeHierarchy {
    public static void main(String[] args) {
        Manager manager = new Manager("John Doe", 101, 80000, 10000);
        Developer developer = new Developer("Jane Smith", 102, 60000, "Java");
        Intern intern = new Intern("Bob Wilson", 103, 20000, 6);
        
        System.out.println("=== Manager ===");
        manager.displayInfo();
        manager.conductMeeting();
        
        System.out.println("\n=== Developer ===");
        developer.displayInfo();
        developer.writeCode();
        
        System.out.println("\n=== Intern ===");
        intern.displayInfo();
        intern.learn();
    }
}
```

## Key Concepts

### 1. `super` Keyword

Used to refer to parent class members.

```java
class Parent {
    String name = "Parent";
    
    void display() {
        System.out.println("Parent method");
    }
}

class Child extends Parent {
    String name = "Child";
    
    void display() {
        System.out.println("Child method");
        super.display();  // Call parent method
        System.out.println("Parent name: " + super.name);  // Access parent variable
    }
}
```

### 2. Method Overriding

Child class provides its own implementation of parent method.

```java
class Animal {
    void makeSound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    @Override  // Annotation (optional but recommended)
    void makeSound() {
        System.out.println("Dog barks");
    }
}
```

## Benefits of Inheritance

1. **Code Reusability**: Reuse parent class code
2. **Code Organization**: Logical hierarchy
3. **Polymorphism**: Enables runtime polymorphism
4. **Maintainability**: Easier to maintain
5. **Extensibility**: Easy to extend functionality

## Important Points

- Java supports **single inheritance** only (one parent)
- Use `extends` keyword for inheritance
- `super()` calls parent constructor
- `super.method()` calls parent method
- Child class can override parent methods
- Private members are not inherited

## Summary

- Inheritance allows code reuse and logical organization
- Child class inherits from parent class
- Use `extends` keyword
- `super` refers to parent class
- Supports method overriding
- Foundation for polymorphism
