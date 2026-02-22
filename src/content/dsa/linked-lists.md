# Linked Lists

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence. Unlike arrays, linked lists don't store elements in contiguous memory locations.

## What is a Linked List?

A linked list consists of nodes, where each node contains:
- **Data**: The value stored in the node
- **Next**: A reference/pointer to the next node

### Types of Linked Lists

1. **Singly Linked List**: Each node points only to the next node
2. **Doubly Linked List**: Each node points to both next and previous nodes
3. **Circular Linked List**: The last node points back to the first node

## Real-World Analogy

Think of a linked list like a treasure hunt where each clue points to the location of the next clue. You can't jump directly to clue #5 - you must follow the chain from clue #1.

## Node Structure

```java
class Node {
    int data;
    Node next;
    
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}
```

## Basic Operations

### 1. Creating a Linked List

```java
class LinkedList {
    Node head;
    
    // Insert at the beginning
    public void insertAtBeginning(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }
    
    // Insert at the end
    public void insertAtEnd(int data) {
        Node newNode = new Node(data);
        
        if (head == null) {
            head = newNode;
            return;
        }
        
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }
}
```

### 2. Traversing a Linked List

```java
public void display() {
    Node current = head;
    while (current != null) {
        System.out.print(current.data + " -> ");
        current = current.next;
    }
    System.out.println("null");
}
```

### 3. Searching for an Element

```java
public boolean search(int target) {
    Node current = head;
    while (current != null) {
        if (current.data == target) {
            return true;
        }
        current = current.next;
    }
    return false;
}
```

## Real-World Example: Music Playlist

```java
class Song {
    String title;
    String artist;
    Song next;
    
    Song(String title, String artist) {
        this.title = title;
        this.artist = artist;
        this.next = null;
    }
}

class Playlist {
    Song head;
    
    public void addSong(String title, String artist) {
        Song newSong = new Song(title, artist);
        if (head == null) {
            head = newSong;
        } else {
            Song current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newSong;
        }
    }
    
    public void playAll() {
        Song current = head;
        int trackNumber = 1;
        while (current != null) {
            System.out.println(trackNumber + ". " + current.title + " by " + current.artist);
            current = current.next;
            trackNumber++;
        }
    }
}
```

## Comparison: Arrays vs Linked Lists

| Feature | Array | Linked List |
|---------|-------|-------------|
| Memory | Contiguous | Non-contiguous |
| Access | O(1) | O(n) |
| Insertion at beginning | O(n) | O(1) |
| Insertion at end | O(1) | O(n) |
| Deletion | O(n) | O(1) if node is known |
| Size | Fixed | Dynamic |

## Advantages of Linked Lists

- **Dynamic Size**: Can grow or shrink as needed
- **Efficient Insertion/Deletion**: O(1) at the beginning
- **No Memory Waste**: Allocate only what you need
- **Easy to Insert/Delete**: No need to shift elements

## Disadvantages of Linked Lists

- **No Random Access**: Must traverse from head to access elements
- **Extra Memory**: Need to store pointers
- **Cache Unfriendly**: Nodes may not be in contiguous memory
- **Reverse Traversal**: Difficult in singly linked lists

## Common Operations

### Delete a Node

```java
public void delete(int key) {
    if (head == null) return;
    
    if (head.data == key) {
        head = head.next;
        return;
    }
    
    Node current = head;
    while (current.next != null) {
        if (current.next.data == key) {
            current.next = current.next.next;
            return;
        }
        current = current.next;
    }
}
```

### Reverse a Linked List

```java
public void reverse() {
    Node prev = null;
    Node current = head;
    Node next = null;
    
    while (current != null) {
        next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    head = prev;
}
```

## When to Use Linked Lists

- When you need frequent insertions/deletions
- When the size is unknown or changes frequently
- When you don't need random access
- For implementing stacks, queues, and other data structures

## Practice Problems

1. Find the middle element of a linked list
2. Detect if a linked list has a cycle
3. Merge two sorted linked lists
4. Remove duplicates from a linked list
5. Find the nth node from the end

Linked lists are essential for understanding more advanced data structures and are commonly used in interview questions!
