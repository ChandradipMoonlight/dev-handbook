# Container With Most Water

## Problem Description

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

**Notice** that you may not slant the container.

### Example 1:
```
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. 
In this case, the max area of water (blue section) the container can contain is 49.
```

### Example 2:
```
Input: height = [1,1]
Output: 1
```

## Try It Yourself First!

**LeetCode Link:** [Container With Most Water - LeetCode](https://leetcode.com/problems/container-with-most-water/)

Before looking at the solutions, try to solve this problem yourself. Here are some hints:
- How do you calculate the area of water between two lines?
- What's the brute force approach?
- Can you use two pointers to optimize?

---

## Solution 1: Brute Force Approach

### Approach

Check all possible pairs of lines and calculate the area for each pair. Keep track of the maximum area.

### Algorithm

1. Use two nested loops to check all pairs
2. For each pair `(i, j)`, calculate area = `min(height[i], height[j]) * (j - i)`
3. Track the maximum area found
4. Return maximum area

### Code

**Java:**
```java
class Solution {
    public int maxArea(int[] height) {
        int maxArea = 0;
        
        for (int i = 0; i < height.length; i++) {
            for (int j = i + 1; j < height.length; j++) {
                int width = j - i;
                int minHeight = Math.min(height[i], height[j]);
                int area = width * minHeight;
                maxArea = Math.max(maxArea, area);
            }
        }
        
        return maxArea;
    }
}
```

**Python:**
```python
class Solution:
    def maxArea(self, height: List[int]) -> int:
        max_area = 0
        
        for i in range(len(height)):
            for j in range(i + 1, len(height)):
                width = j - i
                min_height = min(height[i], height[j])
                area = width * min_height
                max_area = max(max_area, area)
        
        return max_area
```

### Explanation

- We check every possible pair of lines
- Area = width × min(height[i], height[j])
- Width = distance between indices
- Height = minimum of the two line heights (water can't overflow)

### Complexity Analysis

- **Time Complexity:** O(n²)
  - Two nested loops checking all pairs
  
- **Space Complexity:** O(1)
  - Only using constant extra space

---

## Solution 2: Two Pointers (Optimized)

### Approach

Start with two pointers at opposite ends. Move the pointer with the smaller height towards the center, as moving the larger one can only decrease the area.

### Algorithm

1. Initialize `left = 0` and `right = length - 1`
2. Calculate area for current pointers
3. Update maximum area
4. Move the pointer with smaller height
5. Repeat until pointers meet

### Code

**Java:**
```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int maxArea = 0;
        
        while (left < right) {
            int width = right - left;
            int minHeight = Math.min(height[left], height[right]);
            int area = width * minHeight;
            maxArea = Math.max(maxArea, area);
            
            // Move the pointer with smaller height
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxArea;
    }
}
```

**Python:**
```python
class Solution:
    def maxArea(self, height: List[int]) -> int:
        left = 0
        right = len(height) - 1
        max_area = 0
        
        while left < right:
            width = right - left
            min_height = min(height[left], height[right])
            area = width * min_height
            max_area = max(max_area, area)
            
            # Move the pointer with smaller height
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        
        return max_area
```

### Explanation

**Why this works:**

1. **Initial State:** We start with maximum width (farthest apart)

2. **Key Insight:** 
   - Area = width × min(height[left], height[right])
   - If we move the pointer with larger height:
     - Width decreases
     - Min height stays same or decreases
     - Area can only decrease
   - If we move the pointer with smaller height:
     - Width decreases
     - But min height might increase
     - Area might increase

3. **Example Walkthrough:**
   ```
   height = [1,8,6,2,5,4,8,3,7]
   
   left=0, right=8: area = 8 × min(1,7) = 8 × 1 = 8
   Move left (height[0]=1 < height[8]=7)
   
   left=1, right=8: area = 7 × min(8,7) = 7 × 7 = 49
   Move right (height[1]=8 > height[8]=7)
   
   left=1, right=7: area = 6 × min(8,3) = 6 × 3 = 18
   Move right (height[1]=8 > height[7]=3)
   
   ... continue until left >= right
   ```

### Why Always Move the Smaller Pointer?

**Mathematical Proof:**

Let's say `height[left] < height[right]`:
- Current area = `(right - left) × height[left]`
- If we move `right` → `right'`:
  - New area = `(right' - left) × min(height[left], height[right'])`
  - Since `right' < right`, width decreases
  - Since `height[left]` is the smaller, `min(height[left], height[right']) ≤ height[left]`
  - New area ≤ `(right' - left) × height[left] < (right - left) × height[left]`
  - **Area can only decrease!**

- If we move `left` → `left'`:
  - New area = `(right - left') × min(height[left'], height[right])`
  - Width decreases, but `height[left']` might be larger
  - **Area might increase!**

Therefore, we should always move the smaller pointer.

### Complexity Analysis

- **Time Complexity:** O(n)
  - Single pass through the array with two pointers
  
- **Space Complexity:** O(1)
  - Only using constant extra space

---

## Key Insights

1. **Start with maximum width** - pointers at opposite ends
2. **Always move smaller pointer** - preserves possibility of finding larger area
3. **Greedy approach** - at each step, make the choice that might lead to better solution
4. **No need to check all pairs** - two pointers eliminate many possibilities

## Visual Understanding

```
Height: [1, 8, 6, 2, 5, 4, 8, 3, 7]
Index:   0  1  2  3  4  5  6  7  8

Initial: left=0, right=8
Area = 8 × min(1,7) = 8

After moving left: left=1, right=8
Area = 7 × min(8,7) = 49 ← Maximum!
```

## Comparison

| Solution | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| Brute Force | O(n²) | O(1) | Small arrays |
| Two Pointers | O(n) | O(1) | **Large arrays** |

## Practice Problems

- [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
