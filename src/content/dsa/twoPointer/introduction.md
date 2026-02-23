# Two Pointer Technique

The Two Pointer Technique is a powerful algorithmic approach used to solve problems efficiently by using two pointers that traverse through a data structure (usually an array or string) in a coordinated manner.

## What is the Two Pointer Technique?

The Two Pointer Technique involves using two pointers (indices) that move through a data structure, typically from different positions or in different directions, to solve problems more efficiently than brute force approaches.

### Key Characteristics

- **Two Pointers**: Uses two indices/variables to track positions
- **Efficient**: Often reduces time complexity from O(n²) to O(n)
- **Space Efficient**: Usually requires O(1) extra space
- **Common Patterns**: Opposite ends, same direction, or fast-slow pointers

## Real-World Analogy

Imagine you're organizing books on a shelf. Instead of checking every book individually (brute force), you can use two bookmarks:
- One at the start
- One at the end
- Move them towards each other while comparing

This is much faster than checking each book one by one!

## Types of Two Pointer Patterns

### 1. Opposite Ends (Converging Pointers)

Two pointers start at opposite ends and move towards each other.

**Example Use Cases:**
- Finding pairs that sum to a target
- Palindrome checking
- Reversing arrays/strings

```java
int left = 0;
int right = array.length - 1;

while (left < right) {
    // Process elements at left and right
    // Move pointers based on condition
    left++;
    right--;
}
```

### 2. Same Direction (Sliding Window)

Two pointers move in the same direction, often at different speeds.

**Example Use Cases:**
- Removing duplicates
- Finding subarrays with specific properties
- Linked list cycle detection

```java
int slow = 0;
int fast = 0;

while (fast < array.length) {
    // Process elements
    // Move slow pointer conditionally
    // Always move fast pointer
    fast++;
}
```

### 3. Fast and Slow Pointers

One pointer moves faster than the other (often 2x speed).

**Example Use Cases:**
- Finding middle of linked list
- Cycle detection
- Finding nth node from end

```java
ListNode slow = head;
ListNode fast = head;

while (fast != null && fast.next != null) {
    slow = slow.next;      // Move 1 step
    fast = fast.next.next; // Move 2 steps
}
```

## How to Identify When to Use Two Pointers

### ✅ Use Two Pointers When:

1. **Sorted Array/String Problems**
   - Finding pairs with specific sum
   - Removing duplicates from sorted array
   - Merging sorted arrays

2. **Palindrome Problems**
   - Checking if string/array is palindrome
   - Finding longest palindromic substring

3. **Partitioning Problems**
   - Moving zeros to end
   - Separating even/odd numbers
   - Dutch National Flag problem

4. **Subarray/Substring Problems**
   - Finding subarray with given sum
   - Longest substring without repeating characters
   - Minimum window substring

5. **Linked List Problems**
   - Finding middle node
   - Detecting cycles
   - Reversing linked list

### ❌ Don't Use Two Pointers When:

1. **Unordered Data** (unless you can sort it first)
2. **Need All Combinations** (two pointers find pairs, not all combinations)
3. **Non-linear Data Structures** (trees, graphs - though some tree problems use it)

## Advantages

- **Time Efficiency**: Reduces O(n²) to O(n) in many cases
- **Space Efficiency**: Usually O(1) extra space
- **Simple Logic**: Easy to understand and implement
- **In-place Operations**: Can modify arrays without extra space

## Common Patterns to Recognize

### Pattern 1: Sum Problems
```
Given sorted array, find two numbers that sum to target
→ Use opposite ends pointers
```

### Pattern 2: Duplicate Removal
```
Remove duplicates from sorted array
→ Use same direction pointers (slow and fast)
```

### Pattern 3: Palindrome
```
Check if string is palindrome
→ Use opposite ends pointers
```

### Pattern 4: Partition
```
Move all zeros to end
→ Use same direction pointers
```

## Step-by-Step Approach

1. **Identify the Pattern**
   - Is the array sorted?
   - What are we looking for?
   - Do we need to traverse from both ends?

2. **Initialize Pointers**
   - Set starting positions
   - Determine movement direction

3. **Define Loop Condition**
   - When should the loop stop?
   - `left < right` for opposite ends
   - `fast < length` for same direction

4. **Process Elements**
   - Compare/process elements at pointer positions
   - Make decisions based on problem requirements

5. **Move Pointers**
   - Move based on conditions
   - Ensure pointers always move (avoid infinite loops)

## Practice Tips

1. **Start with Sorted Arrays**: Most two pointer problems work with sorted data
2. **Draw It Out**: Visualize pointer movement on paper
3. **Handle Edge Cases**: Empty arrays, single element, all same elements
4. **Test Boundary Conditions**: What happens when pointers meet?

## Next Steps

Now that you understand the Two Pointer Technique, let's solve some classic problems:

- [Two Sum](./two-sum.md) - Find two numbers that add up to target
- [Three Sum](./three-sum.md) - Find three numbers that add up to zero
- [Container With Most Water](./container-with-most-water.md) - Maximize area between two lines
- [Remove Duplicates](./remove-duplicates.md) - Remove duplicates from sorted array

Each problem includes:
- Problem description with LeetCode link
- Brute force solution
- Optimized two-pointer solution
- Time and space complexity analysis
- Step-by-step explanations
