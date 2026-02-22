# Common Interview Questions

Technical interviews can be challenging, but preparation is key. This guide covers frequently asked questions across different categories to help you succeed.

## Data Structures & Algorithms

### 1. Two Sum Problem

**Problem**: Given an array of integers and a target sum, find two numbers that add up to the target.

**Example**:
```
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)
```

**Solution Approach**:
- Use a hash map to store numbers and their indices
- For each number, check if (target - number) exists in the map
- Time Complexity: O(n), Space Complexity: O(n)

### 2. Reverse a Linked List

**Problem**: Reverse a singly linked list.

**Example**:
```
Input: 1 -> 2 -> 3 -> 4 -> null
Output: 4 -> 3 -> 2 -> 1 -> null
```

**Solution Approach**:
- Use three pointers: prev, current, next
- Iterate through the list, reversing pointers
- Time Complexity: O(n), Space Complexity: O(1)

### 3. Valid Parentheses

**Problem**: Check if a string containing parentheses is valid.

**Example**:
```
Input: "()[]{}"
Output: true

Input: "([)]"
Output: false
```

**Solution Approach**:
- Use a stack to track opening brackets
- Pop when encountering matching closing bracket
- Time Complexity: O(n), Space Complexity: O(n)

## Object-Oriented Programming

### 4. Explain Inheritance, Polymorphism, and Encapsulation

**Inheritance**: A class can inherit properties and methods from another class.
```java
class Animal {
    void makeSound() {
        System.out.println("Some sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Woof!");
    }
}
```

**Polymorphism**: Same interface, different implementations.
- Method overriding (runtime polymorphism)
- Method overloading (compile-time polymorphism)

**Encapsulation**: Bundling data and methods together, hiding internal details.
- Use private fields with public getters/setters
- Protects data integrity

### 5. Difference between Abstract Class and Interface

| Abstract Class | Interface |
|----------------|-----------|
| Can have concrete methods | All methods abstract (Java 8+) |
| Can have instance variables | Only constants |
| Single inheritance | Multiple inheritance |
| Constructor allowed | No constructor |

## System Design

### 6. Design a URL Shortener

**Key Components**:
1. **API**: POST /shorten (long URL) → returns short URL
2. **Database**: Store mapping (short → long URL)
3. **Hash Function**: Generate unique short codes
4. **Cache**: Store frequently accessed URLs
5. **Load Balancer**: Distribute traffic

**Scale Considerations**:
- 100 million URLs/day = ~1,160 URLs/second
- 5-year expiration
- Read-heavy system (10:1 read:write ratio)

### 7. Design a Chat System

**Requirements**:
- One-on-one messaging
- Group chats
- Real-time delivery
- Message history

**Components**:
- WebSocket server for real-time communication
- Message queue for reliable delivery
- Database for message storage
- Cache for active conversations

## Database Questions

### 8. ACID Properties

- **Atomicity**: All or nothing - transactions are indivisible
- **Consistency**: Database remains in valid state
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed changes persist

### 9. SQL vs NoSQL

**SQL (Relational)**:
- Structured data with relationships
- ACID compliance
- Fixed schema
- Examples: MySQL, PostgreSQL

**NoSQL**:
- Flexible schema
- Better horizontal scaling
- Different types: Document, Key-Value, Graph, Column
- Examples: MongoDB, Redis, Cassandra

## Problem-Solving Tips

### 1. Clarify the Problem
- Ask questions about edge cases
- Understand constraints
- Verify examples

### 2. Think Out Loud
- Explain your thought process
- Show how you approach problems
- Discuss trade-offs

### 3. Start Simple
- Begin with brute force solution
- Then optimize
- Consider time/space complexity

### 4. Test Your Solution
- Walk through examples
- Check edge cases
- Verify correctness

## Common Mistakes to Avoid

1. **Jumping to Code**: Think first, code second
2. **Not Asking Questions**: Clarify requirements
3. **Ignoring Edge Cases**: Handle null, empty, single element
4. **Not Optimizing**: Always consider better solutions
5. **Poor Communication**: Explain your approach clearly

## Preparation Strategy

### 1. Practice Coding
- LeetCode, HackerRank, CodeSignal
- Focus on patterns, not memorization
- Time yourself

### 2. Study Data Structures
- Arrays, Linked Lists, Stacks, Queues
- Trees, Graphs, Hash Tables
- Understand time/space complexity

### 3. Learn Algorithms
- Sorting and searching
- Dynamic programming
- Graph algorithms
- Greedy algorithms

### 4. System Design Practice
- Design real systems
- Read engineering blogs
- Understand scalability concepts

### 5. Mock Interviews
- Practice with friends
- Use platforms like Pramp, Interviewing.io
- Get feedback

## Sample Answers Framework

**For Algorithm Questions**:
1. Understand the problem
2. Discuss approach (brute force → optimized)
3. Code the solution
4. Test with examples
5. Analyze time/space complexity

**For System Design**:
1. Clarify requirements
2. Estimate scale
3. High-level design
4. Detailed design
5. Identify bottlenecks and solutions

## Resources

- **Coding Practice**: LeetCode, HackerRank
- **System Design**: "Designing Data-Intensive Applications" book
- **Interview Prep**: Cracking the Coding Interview
- **Algorithms**: Introduction to Algorithms (CLRS)

Remember: Interviews are conversations. Show your problem-solving process, ask questions, and communicate clearly. Good luck!
