# Constructor in Java

## What is a Constructor?

A **constructor** is a special method that runs automatically when you create an object. It's used to initialize the object's attributes with values.

### Real-World Example

When you buy a new phone, it comes pre-configured with certain settings. Similarly, a constructor sets up your object when it's created.

## Types of Constructors

### 1. Default Constructor

If you don't create any constructor, Java provides a default one (with no parameters).

```java
class Student {
    String name;
    int age;
    
    // No constructor defined - Java provides default constructor
}

public class ConstructorExample {
    public static void main(String[] args) {
        Student s = new Student();  // Default constructor is called
        s.name = "John";
        s.age = 20;
    }
}
```

### 2. Parameterized Constructor

A constructor that accepts parameters to initialize attributes.

```java
class Student {
    String name;
    int age;
    String course;
    
    // Parameterized constructor
    Student(String n, int a, String c) {
        name = n;
        age = a;
        course = c;
        System.out.println("Student object created!");
    }
    
    void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Course: " + course);
    }
}

public class ConstructorExample {
    public static void main(String[] args) {
        // Creating object with constructor
        Student student1 = new Student("Alice", 21, "Computer Science");
        Student student2 = new Student("Bob", 22, "Mathematics");
        
        student1.displayInfo();
        student2.displayInfo();
    }
}
```

**Output:**
```
Student object created!
Student object created!
Name: Alice
Age: 21
Course: Computer Science
Name: Bob
Age: 22
Course: Mathematics
```

### 3. Constructor Overloading

You can have multiple constructors with different parameters.

```java
class Product {
    String name;
    double price;
    int quantity;
    
    // Constructor 1: Only name
    Product(String n) {
        name = n;
        price = 0.0;
        quantity = 0;
    }
    
    // Constructor 2: Name and price
    Product(String n, double p) {
        name = n;
        price = p;
        quantity = 0;
    }
    
    // Constructor 3: All attributes
    Product(String n, double p, int q) {
        name = n;
        price = p;
        quantity = q;
    }
    
    void displayInfo() {
        System.out.println("Product: " + name);
        System.out.println("Price: $" + price);
        System.out.println("Quantity: " + quantity);
    }
}

public class ConstructorOverloading {
    public static void main(String[] args) {
        Product p1 = new Product("Laptop");
        Product p2 = new Product("Mouse", 25.99);
        Product p3 = new Product("Keyboard", 49.99, 10);
        
        p1.displayInfo();
        System.out.println();
        p2.displayInfo();
        System.out.println();
        p3.displayInfo();
    }
}
```

## Real-World Example: Library Book

```java
class Book {
    String title;
    String author;
    int pages;
    boolean isAvailable;
    
    // Constructor to initialize book details
    Book(String t, String a, int p) {
        title = t;
        author = a;
        pages = p;
        isAvailable = true;  // New books are available by default
        System.out.println("Book '" + title + "' added to library");
    }
    
    void borrowBook() {
        if (isAvailable) {
            isAvailable = false;
            System.out.println("Book '" + title + "' has been borrowed");
        } else {
            System.out.println("Sorry, book '" + title + "' is not available");
        }
    }
    
    void returnBook() {
        isAvailable = true;
        System.out.println("Book '" + title + "' has been returned");
    }
    
    void displayInfo() {
        System.out.println("Title: " + title);
        System.out.println("Author: " + author);
        System.out.println("Pages: " + pages);
        System.out.println("Available: " + (isAvailable ? "Yes" : "No"));
    }
}

public class LibraryExample {
    public static void main(String[] args) {
        // Creating books using constructor
        Book book1 = new Book("Java Programming", "John Smith", 350);
        Book book2 = new Book("Data Structures", "Jane Doe", 450);
        
        book1.displayInfo();
        System.out.println();
        
        book1.borrowBook();
        book1.displayInfo();
        System.out.println();
        
        book1.returnBook();
        book1.displayInfo();
    }
}
```

## Key Points About Constructors

1. **Name**: Must be same as class name
2. **No return type**: Not even `void`
3. **Automatic execution**: Runs when object is created
4. **Purpose**: Initialize object attributes
5. **Can be overloaded**: Multiple constructors with different parameters

## Constructor vs Method

| Constructor | Method |
|------------|--------|
| Same name as class | Any valid name |
| No return type | Has return type (or void) |
| Called automatically | Called explicitly |
| Used for initialization | Used for operations |

## Summary

- Constructor initializes objects when they're created
- Can have multiple constructors (overloading)
- Makes object creation easier and safer
- Ensures objects start with proper values
