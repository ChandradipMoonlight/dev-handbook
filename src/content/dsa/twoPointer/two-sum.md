# Two Sum

## Problem Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

### Example 1:
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

### Example 2:
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

### Example 3:
```
Input: nums = [3,3], target = 6
Output: [0,1]
```

## Try It Yourself First!

**LeetCode Link:** [Two Sum - LeetCode](https://leetcode.com/problems/two-sum/)

Before looking at the solutions, try to solve this problem yourself. Here are some hints:
- Can you think of a brute force approach?
- How can you optimize it using extra space?
- What if the array was sorted? Could you use two pointers?

---

## Solution 1: Brute Force Approach

### Approach

Check every possible pair of numbers in the array to see if they sum to the target.

### Algorithm

1. Use two nested loops
2. Outer loop: iterate through each element
3. Inner loop: check all remaining elements
4. If sum equals target, return the indices

### Code

**Java:**
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}
```

**Python:**
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []
```

### Explanation

- We check every pair `(i, j)` where `i < j`
- For each pair, we check if `nums[i] + nums[j] == target`
- Once found, we return the indices immediately

### Complexity Analysis

- **Time Complexity:** O(n²)
  - We have nested loops, checking n(n-1)/2 pairs in worst case
  
- **Space Complexity:** O(1)
  - Only using a constant amount of extra space

---

## Solution 2: Hash Map (Optimized)

### Approach

Use a hash map to store each number and its index. For each number, check if the complement (target - current number) exists in the map.

### Algorithm

1. Create a hash map to store `{value: index}`
2. Iterate through the array once
3. For each number, calculate `complement = target - current_number`
4. If complement exists in map, return current index and complement's index
5. Otherwise, add current number and its index to the map

### Code

**Java:**
```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            
            map.put(nums[i], i);
        }
        
        return new int[]{};
    }
}
```

**Python:**
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashmap = {}
        
        for i, num in enumerate(nums):
            complement = target - num
            
            if complement in hashmap:
                return [hashmap[complement], i]
            
            hashmap[num] = i
        
        return []
```

### Explanation

- We traverse the array only once
- For each element, we check if we've seen its complement before
- If yes, we found our pair
- If no, we store the current element for future lookups

### Complexity Analysis

- **Time Complexity:** O(n)
  - Single pass through the array
  - Hash map operations are O(1) on average
  
- **Space Complexity:** O(n)
  - Hash map can store up to n elements

---

## Solution 3: Two Pointers (For Sorted Array)

**Note:** This solution works when the array is sorted. If you need to return indices and the array isn't sorted, use Solution 2.

### Approach

If the array is sorted, we can use two pointers starting from opposite ends and move them based on the sum.

### Algorithm

1. Sort the array (if not already sorted)
2. Initialize two pointers: `left = 0` and `right = length - 1`
3. While `left < right`:
   - Calculate `sum = nums[left] + nums[right]`
   - If `sum == target`: return indices
   - If `sum < target`: move left pointer right (increase sum)
   - If `sum > target`: move right pointer left (decrease sum)

### Code

**Java:**
```java
import java.util.Arrays;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Create array with original indices
        int[][] indexedNums = new int[nums.length][2];
        for (int i = 0; i < nums.length; i++) {
            indexedNums[i] = new int[]{nums[i], i};
        }
        
        // Sort by value
        Arrays.sort(indexedNums, (a, b) -> Integer.compare(a[0], b[0]));
        
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int sum = indexedNums[left][0] + indexedNums[right][0];
            
            if (sum == target) {
                return new int[]{
                    indexedNums[left][1], 
                    indexedNums[right][1]
                };
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return new int[]{};
    }
}
```

**Python:**
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Create list with (value, original_index)
        indexed_nums = [(nums[i], i) for i in range(len(nums))]
        indexed_nums.sort(key=lambda x: x[0])
        
        left = 0
        right = len(indexed_nums) - 1
        
        while left < right:
            current_sum = indexed_nums[left][0] + indexed_nums[right][0]
            
            if current_sum == target:
                return [indexed_nums[left][1], indexed_nums[right][1]]
            elif current_sum < target:
                left += 1
            else:
                right -= 1
        
        return []
```

### Explanation

- Since the array is sorted, we can use the two-pointer technique
- If sum is too small, we need a larger number → move left pointer right
- If sum is too large, we need a smaller number → move right pointer left
- This works because the array is sorted

### Complexity Analysis

- **Time Complexity:** O(n log n)
  - Sorting takes O(n log n)
  - Two-pointer traversal is O(n)
  
- **Space Complexity:** O(n)
  - Need to store original indices

---

## Comparison of Solutions

| Solution | Time Complexity | Space Complexity | When to Use |
|----------|----------------|------------------|-------------|
| Brute Force | O(n²) | O(1) | Small arrays, simple problems |
| Hash Map | O(n) | O(n) | **Best for unsorted arrays** |
| Two Pointers | O(n log n) | O(n) | When array can be sorted |

## Key Takeaways

1. **Hash Map is optimal** for the original problem (unsorted array, need indices)
2. **Two Pointers** are great when array is sorted or can be sorted
3. **Brute Force** is simple but inefficient for large inputs
4. Always consider if you need indices or just values when choosing approach

## Practice Problems

- [Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) (Perfect for two pointers!)
- [3Sum](https://leetcode.com/problems/3sum/)
- [4Sum](https://leetcode.com/problems/4sum/)
