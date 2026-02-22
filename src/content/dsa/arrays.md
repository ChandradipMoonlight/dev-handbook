# Arrays - Data Structure Fundamentals

An array is a collection of elements stored in contiguous memory locations. It's one of the most fundamental data structures in computer science.

## What is an Array?

An array is a data structure that stores multiple values of the same type in a sequential manner. Each element can be accessed using its index.

### Key Characteristics

- **Fixed Size**: Most arrays have a fixed size (though dynamic arrays exist)
- **Indexed Access**: Elements are accessed by their position (index)
- **Contiguous Memory**: Elements are stored next to each other in memory
- **Same Data Type**: All elements must be of the same type

## Real-World Analogy

Think of an array like a row of lockers in a school hallway. Each locker has a number (index), and you can directly access any locker by its number.

## Array Operations

### 1. Declaration and Initialization

**Java Example:**
```java
// Declare and initialize
int[] numbers = {10, 20, 30, 40, 50};

// Declare with size
int[] scores = new int[5];
scores[0] = 85;
scores[1] = 90;
scores[2] = 78;
```

**Python Example:**
```python
# Python uses lists (similar to arrays)
numbers = [10, 20, 30, 40, 50]
scores = [85, 90, 78, 92, 88]
```

### 2. Accessing Elements

```java
int[] arr = {10, 20, 30, 40, 50};
System.out.println(arr[0]);  // First element: 10
System.out.println(arr[2]);  // Third element: 30
System.out.println(arr[arr.length - 1]);  // Last element: 50
```

### 3. Traversing an Array

```java
int[] numbers = {10, 20, 30, 40, 50};

// Using for loop
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// Using enhanced for loop
for (int num : numbers) {
    System.out.println(num);
}
```

## Real-World Example: Student Grades

```java
public class StudentGrades {
    public static void main(String[] args) {
        String[] subjects = {"Math", "Science", "English", "History"};
        int[] grades = {85, 90, 78, 92};
        
        System.out.println("Student Report Card:");
        for (int i = 0; i < subjects.length; i++) {
            System.out.println(subjects[i] + ": " + grades[i]);
        }
        
        // Calculate average
        int sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        double average = (double) sum / grades.length;
        System.out.println("\nAverage Grade: " + average);
    }
}
```

## Common Array Operations

### Finding Maximum Element

```java
int[] numbers = {5, 2, 8, 1, 9, 3};
int max = numbers[0];

for (int i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
        max = numbers[i];
    }
}
System.out.println("Maximum: " + max);  // Output: 9
```

### Searching for an Element

```java
int[] numbers = {10, 20, 30, 40, 50};
int target = 30;
boolean found = false;

for (int num : numbers) {
    if (num == target) {
        found = true;
        break;
    }
}

if (found) {
    System.out.println("Element found!");
} else {
    System.out.println("Element not found!");
}
```

## Time Complexity

| Operation | Time Complexity | Explanation |
|-----------|----------------|-------------|
| Access | O(1) | Direct access by index |
| Search | O(n) | May need to check all elements |
| Insertion | O(n) | Need to shift elements |
| Deletion | O(n) | Need to shift elements |

## Advantages

- Fast access by index
- Memory efficient
- Simple to understand and implement
- Cache-friendly (contiguous memory)

## Disadvantages

- Fixed size (in most languages)
- Insertion/deletion can be expensive
- Wasted space if array is not fully utilized

## When to Use Arrays

- When you know the size in advance
- When you need fast random access
- When working with homogeneous data
- For implementing other data structures (stacks, queues, etc.)

## Practice Problems

1. Find the sum of all elements in an array
2. Reverse an array
3. Find the second largest element
4. Check if array contains duplicates
5. Rotate array by k positions

Arrays are the foundation for understanding more complex data structures. Master arrays before moving to linked lists, stacks, and queues!
