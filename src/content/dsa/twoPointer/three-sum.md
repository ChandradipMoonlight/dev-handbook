# Three Sum

## Problem Description

Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.

Notice that the solution set must not contain duplicate triplets.

### Example 1:
```
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
The distinct triplets [-1,0,1] and [-1,-1,2] are the answer.
```

### Example 2:
```
Input: nums = [0,1,1]
Output: []
Explanation: The only possible triplet does not sum up to 0.
```

### Example 3:
```
Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The only possible triplet sums up to 0.
```

## Try It Yourself First!

**LeetCode Link:** [3Sum - LeetCode](https://leetcode.com/problems/3sum/)

Before looking at the solutions, try to solve this problem yourself. Here are some hints:
- How would you solve this with brute force?
- Can you reduce it to a two-sum problem?
- How can you avoid duplicate triplets?

---

## Solution 1: Brute Force Approach

### Approach

Check all possible triplets in the array to find those that sum to zero.

### Algorithm

1. Use three nested loops
2. Check all combinations of three indices
3. If sum equals zero, add to result (avoiding duplicates)
4. Return all unique triplets

### Code

**Java:**
```java
import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Set<List<Integer>> result = new HashSet<>();
        
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                for (int k = j + 1; k < nums.length; k++) {
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        List<Integer> triplet = Arrays.asList(nums[i], nums[j], nums[k]);
                        Collections.sort(triplet);
                        result.add(triplet);
                    }
                }
            }
        }
        
        return new ArrayList<>(result);
    }
}
```

**Python:**
```python
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        result = set()
        
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                for k in range(j + 1, len(nums)):
                    if nums[i] + nums[j] + nums[k] == 0:
                        triplet = tuple(sorted([nums[i], nums[j], nums[k]]))
                        result.add(triplet)
        
        return [list(t) for t in result]
```

### Explanation

- We check every possible combination of three numbers
- Use a Set to automatically handle duplicates
- Sort each triplet before adding to ensure uniqueness

### Complexity Analysis

- **Time Complexity:** O(n³)
  - Three nested loops checking all triplets
  
- **Space Complexity:** O(k)
  - Where k is the number of unique triplets
  - In worst case, could be O(n²) if many triplets exist

---

## Solution 2: Two Pointers (Optimized)

### Approach

1. Sort the array first
2. Fix one number and use two pointers for the remaining two
3. Use the two-pointer technique to find pairs that sum to the negative of the fixed number
4. Skip duplicates to avoid duplicate triplets

### Algorithm

1. Sort the array
2. Iterate through the array, fixing `nums[i]` as the first number
3. Use two pointers (`left = i+1`, `right = length-1`) to find pairs
4. If `nums[i] + nums[left] + nums[right] == 0`:
   - Add to result
   - Skip duplicates for both pointers
5. If sum < 0, move left pointer right
6. If sum > 0, move right pointer left
7. Skip duplicates for the fixed number as well

### Code

**Java:**
```java
import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);
        
        for (int i = 0; i < nums.length - 2; i++) {
            // Skip duplicates for the first number
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            
            int left = i + 1;
            int right = nums.length - 1;
            int target = -nums[i]; // We need nums[left] + nums[right] = target
            
            while (left < right) {
                int sum = nums[left] + nums[right];
                
                if (sum == target) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    
                    // Skip duplicates for left pointer
                    while (left < right && nums[left] == nums[left + 1]) {
                        left++;
                    }
                    // Skip duplicates for right pointer
                    while (left < right && nums[right] == nums[right - 1]) {
                        right--;
                    }
                    
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
}
```

**Python:**
```python
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        result = []
        nums.sort()
        
        for i in range(len(nums) - 2):
            # Skip duplicates for the first number
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            
            left = i + 1
            right = len(nums) - 1
            target = -nums[i]  # We need nums[left] + nums[right] = target
            
            while left < right:
                current_sum = nums[left] + nums[right]
                
                if current_sum == target:
                    result.append([nums[i], nums[left], nums[right]])
                    
                    # Skip duplicates for left pointer
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    # Skip duplicates for right pointer
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    
                    left += 1
                    right -= 1
                elif current_sum < target:
                    left += 1
                else:
                    right -= 1
        
        return result
```

### Explanation

**Step-by-step walkthrough with example `nums = [-1,0,1,2,-1,-4]`:**

1. **Sort:** `[-4, -1, -1, 0, 1, 2]`

2. **i = 0, nums[i] = -4:**
   - Need: `nums[left] + nums[right] = 4`
   - `left = 1, right = 5`: `-1 + 2 = 1 < 4` → move left
   - `left = 2, right = 5`: `-1 + 2 = 1 < 4` → move left
   - `left = 3, right = 5`: `0 + 2 = 2 < 4` → move left
   - `left = 4, right = 5`: `1 + 2 = 3 < 4` → move left
   - No solution found

3. **i = 1, nums[i] = -1:**
   - Skip duplicate? `nums[1] == nums[0]`? No, continue
   - Need: `nums[left] + nums[right] = 1`
   - `left = 2, right = 5`: `-1 + 2 = 1 == 1` ✓ Found! `[-1, -1, 2]`
   - Skip duplicates, move pointers
   - `left = 3, right = 4`: `0 + 1 = 1 == 1` ✓ Found! `[-1, 0, 1]`

4. **i = 2, nums[i] = -1:**
   - Skip duplicate? `nums[2] == nums[1]`? Yes, skip

5. Continue for remaining elements...

### Why This Works

- **Sorting** allows us to use two pointers efficiently
- **Fixing one number** reduces the problem to two-sum
- **Skipping duplicates** ensures unique triplets
- **Two pointers** find pairs in O(n) time

### Complexity Analysis

- **Time Complexity:** O(n²)
  - Sorting: O(n log n)
  - Outer loop: O(n)
  - Two-pointer search: O(n) per iteration
  - Overall: O(n log n) + O(n²) = O(n²)
  
- **Space Complexity:** O(1) or O(n)
  - O(1) if we don't count the output array
  - O(n) if we count the output array (can have up to O(n²) triplets)

---

## Key Insights

1. **Sorting is crucial** - enables two-pointer technique
2. **Duplicate handling** - must skip duplicates at all three positions
3. **Reduction to two-sum** - fixing one number makes it a two-sum problem
4. **Early termination** - if `nums[i] > 0`, we can break early (all remaining will be positive)

## Edge Cases to Consider

- Empty array or less than 3 elements
- All zeros: `[0,0,0]`
- All positive or all negative numbers
- Many duplicates: `[0,0,0,0,0]`

## Optimization: Early Termination

```java
// If the smallest number is positive, no solution possible
if (nums[i] > 0) {
    break;
}
```

## Comparison

| Solution | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| Brute Force | O(n³) | O(k) | Small arrays |
| Two Pointers | O(n²) | O(1) | **Large arrays** |

## Practice Problems

- [3Sum Closest](https://leetcode.com/problems/3sum-closest/)
- [4Sum](https://leetcode.com/problems/4sum/)
- [3Sum Smaller](https://leetcode.com/problems/3sum-smaller/)
