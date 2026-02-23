# Super Keyword in Java

## What is 'super'?

The **`super`** keyword refers to the parent class. It's used to access parent class members (variables, methods, constructors) from a child class.

### Real-World Example

Think of a family. When you say "my father's car," you're referring to something belonging to your parent. Similarly, `super` refers to the parent class.

## Uses of 'super' Keyword

### 1. Accessing Parent Class Variables

When child and parent have variables with the same name, `super` helps access the parent's variable.

```java
class Parent {
    String name = "Parent";
    int value = 10;
}

class Child extends Parent {
    String name = "Child";  // Hides parent's name
    int value = 20;
    
    void display() {
        System.out.println("Child name: " + name);
        System.out.println("Parent name: " + super.name);  // Access parent's name
        
        System.out.println("Child value: " + value);
        System.out.println("Parent value: " + super.value);  // Access parent's value
    }
}

public class SuperVariable {
    public static void main(String[] args) {
        Child child = new Child();
        child.display();
    }
}
```

**Output:**
```
Child name: Child
Parent name: Parent
Child value: 20
Parent value: 10
```

### 2. Calling Parent Class Methods

You can call parent class methods using `super`.

```java
class Animal {
    void eat() {
        System.out.println("Animal is eating");
    }
    
    void sleep() {
        System.out.println("Animal is sleeping");
    }
    
    void displayInfo() {
        System.out.println("This is an animal");
    }
}

class Dog extends Animal {
    @Override
    void eat() {
        System.out.println("Dog is eating dog food");
    }
    
    @Override
    void displayInfo() {
        super.displayInfo();  // Call parent's method
        System.out.println("This is a dog");
        super.eat();  // Call parent's eat method
        eat();  // Call current class's eat method
    }
}

public class SuperMethod {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.displayInfo();
    }
}
```

**Output:**
```
This is an animal
This is a dog
Animal is eating
Dog is eating dog food
```

### 3. Calling Parent Class Constructor

`super()` is used to call the parent class constructor. It must be the first statement in the child constructor.

```java
class Vehicle {
    String brand;
    int year;
    
    Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
        System.out.println("Vehicle constructor called");
    }
    
    void displayInfo() {
        System.out.println("Brand: " + brand + ", Year: " + year);
    }
}

class Car extends Vehicle {
    int doors;
    
    Car(String brand, int year, int doors) {
        super(brand, year);  // Call parent constructor - MUST be first
        this.doors = doors;
        System.out.println("Car constructor called");
    }
    
    @Override
    void displayInfo() {
        super.displayInfo();  // Call parent method
        System.out.println("Doors: " + doors);
    }
}

public class SuperConstructor {
    public static void main(String[] args) {
        Car car = new Car("Toyota", 2023, 4);
        System.out.println();
        car.displayInfo();
    }
}
```

**Output:**
```
Vehicle constructor called
Car constructor called

Brand: Toyota, Year: 2023
Doors: 4
```

## Real-World Example: Employee Hierarchy

```java
class Employee {
    protected String name;
    protected int employeeId;
    protected double salary;
    
    Employee(String name, int employeeId, double salary) {
        this.name = name;
        this.employeeId = employeeId;
        this.salary = salary;
        System.out.println("Employee created: " + name);
    }
    
    void work() {
        System.out.println(name + " is working");
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

class Manager extends Employee {
    private double bonus;
    private int teamSize;
    
    Manager(String name, int employeeId, double salary, double bonus, int teamSize) {
        super(name, employeeId, salary);  // Call parent constructor
        this.bonus = bonus;
        this.teamSize = teamSize;
        System.out.println("Manager created with team of " + teamSize);
    }
    
    @Override
    void work() {
        super.work();  // Call parent's work method
        System.out.println(name + " is managing a team of " + teamSize);
    }
    
    @Override
    void displayInfo() {
        super.displayInfo();  // Call parent's displayInfo
        System.out.println("Bonus: $" + bonus);
        System.out.println("Team Size: " + teamSize);
    }
    
    @Override
    double calculateSalary() {
        return super.calculateSalary() + bonus;  // Parent salary + bonus
    }
}

public class EmployeeSuper {
    public static void main(String[] args) {
        Manager manager = new Manager("John Doe", 101, 80000, 10000, 5);
        System.out.println();
        
        manager.work();
        System.out.println();
        
        manager.displayInfo();
        System.out.println();
        
        System.out.println("Total Salary: $" + manager.calculateSalary());
    }
}
```

## Important Points About 'super'

1. **Must be first**: `super()` must be the first statement in constructor
2. **Implicit call**: If you don't call `super()`, Java calls default parent constructor
3. **Access parent members**: Use `super.variable` or `super.method()`
4. **Constructor chaining**: `super()` calls parent constructor
5. **Cannot use in static context**: `super` cannot be used in static methods

## Super vs This

| super | this |
|-------|------|
| Refers to parent class | Refers to current class |
| Used in inheritance | Used in any class |
| Calls parent constructor | Calls current class constructor |
| Accesses parent members | Accesses current class members |

## Common Use Cases

1. **Constructor chaining**: Initialize parent before child
2. **Method overriding**: Call parent method from overridden method
3. **Variable access**: Access parent's hidden variables
4. **Code reuse**: Reuse parent class functionality

## Summary

- `super` refers to the parent class
- `super()` calls parent constructor (must be first)
- `super.method()` calls parent method
- `super.variable` accesses parent variable
- Essential for proper inheritance and code reuse
