# Remove Duplicates from Sorted Array

## Problem Description

Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.

Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the first part of the array `nums`. More formally, if there are `k` elements after removing the duplicates, then the first `k` elements of `nums` should hold the final result. It does not matter what you leave beyond the first `k` elements.

Return `k` after placing the final result in the first `k` slots of `nums`.

Do not allocate extra space for another array. You must do this by modifying the input array in-place with O(1) extra memory.

### Example 1:
```
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

### Example 2:
```
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

## Try It Yourself First!

**LeetCode Link:** [Remove Duplicates from Sorted Array - LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

Before looking at the solutions, try to solve this problem yourself. Here are some hints:
- The array is sorted - how can you use this?
- You need to modify in-place - can you use two pointers?
- How do you track where to place the next unique element?

---

## Solution 1: Using Extra Space (Not In-Place)

### Approach

Create a new array to store unique elements, then copy back.

**Note:** This doesn't meet the in-place requirement but helps understand the problem.

### Code

**Java:**
```java
import java.util.*;

class Solution {
    public int removeDuplicates(int[] nums) {
        Set<Integer> seen = new LinkedHashSet<>();
        
        for (int num : nums) {
            seen.add(num);
        }
        
        int i = 0;
        for (int num : seen) {
            nums[i++] = num;
        }
        
        return seen.size();
    }
}
```

**Python:**
```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        seen = []
        for num in nums:
            if not seen or num != seen[-1]:
                seen.append(num)
        
        for i in range(len(seen)):
            nums[i] = seen[i]
        
        return len(seen)
```

### Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n) - Uses extra space (violates requirement)

---

## Solution 2: Two Pointers (Optimized - In-Place)

### Approach

Use two pointers:
- `slow`: Points to the position where the next unique element should be placed
- `fast`: Iterates through the array to find unique elements

Since the array is sorted, duplicates are adjacent. We only need to check if the current element is different from the previous unique element.

### Algorithm

1. Initialize `slow = 1` (first element is always unique)
2. Iterate with `fast` from `1` to `length - 1`
3. If `nums[fast] != nums[slow - 1]`:
   - Place `nums[fast]` at `nums[slow]`
   - Increment `slow`
4. Return `slow` (number of unique elements)

### Code

**Java:**
```java
class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        
        int slow = 1; // Position for next unique element
        
        for (int fast = 1; fast < nums.length; fast++) {
            // If current element is different from previous unique element
            if (nums[fast] != nums[slow - 1]) {
                nums[slow] = nums[fast];
                slow++;
            }
        }
        
        return slow;
    }
}
```

**Python:**
```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        if not nums:
            return 0
        
        slow = 1  # Position for next unique element
        
        for fast in range(1, len(nums)):
            # If current element is different from previous unique element
            if nums[fast] != nums[slow - 1]:
                nums[slow] = nums[fast]
                slow += 1
        
        return slow
```

### Explanation

**Step-by-step walkthrough with `nums = [0,0,1,1,1,2,2,3,3,4]`:**

```
Initial: slow = 1, fast = 1
nums = [0,0,1,1,1,2,2,3,3,4]
         ↑ ↑
       slow fast

fast=1: nums[1]=0, nums[slow-1]=nums[0]=0 → Same, skip
fast=2: nums[2]=1, nums[slow-1]=nums[0]=0 → Different!
        nums[slow]=nums[1]=1, slow=2
        nums = [0,1,1,1,1,2,2,3,3,4]
               ↑   ↑
             slow fast

fast=3: nums[3]=1, nums[slow-1]=nums[1]=1 → Same, skip
fast=4: nums[4]=1, nums[slow-1]=nums[1]=1 → Same, skip
fast=5: nums[5]=2, nums[slow-1]=nums[1]=1 → Different!
        nums[slow]=nums[2]=2, slow=3
        nums = [0,1,2,1,1,2,2,3,3,4]
                 ↑     ↑
               slow   fast

fast=6: nums[6]=2, nums[slow-1]=nums[2]=2 → Same, skip
fast=7: nums[7]=3, nums[slow-1]=nums[2]=2 → Different!
        nums[slow]=nums[3]=3, slow=4
        nums = [0,1,2,3,1,2,2,3,3,4]
                   ↑       ↑
                 slow     fast

fast=8: nums[8]=3, nums[slow-1]=nums[3]=3 → Same, skip
fast=9: nums[9]=4, nums[slow-1]=nums[3]=3 → Different!
        nums[slow]=nums[4]=4, slow=5
        nums = [0,1,2,3,4,2,2,3,3,4]
                     ↑         ↑
                   slow       fast

Result: slow = 5
First 5 elements: [0,1,2,3,4]
```

### Why This Works

1. **Array is sorted** - duplicates are adjacent
2. **slow pointer** tracks where to place next unique element
3. **fast pointer** finds the next unique element
4. We compare with `nums[slow - 1]` (last placed unique element)
5. Only place element if it's different from the last unique one

### Complexity Analysis

- **Time Complexity:** O(n)
  - Single pass through the array
  
- **Space Complexity:** O(1)
  - Only using constant extra space (two pointers)

---

## Alternative: Comparing with Previous Element

Some prefer comparing `nums[fast]` with `nums[fast - 1]`:

**Java:**
```java
class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        
        int slow = 1;
        
        for (int fast = 1; fast < nums.length; fast++) {
            if (nums[fast] != nums[fast - 1]) {
                nums[slow] = nums[fast];
                slow++;
            }
        }
        
        return slow;
    }
}
```

Both approaches work, but the first one (`nums[slow - 1]`) is more intuitive as it directly compares with the last placed unique element.

## Key Insights

1. **Sorted array advantage** - duplicates are adjacent
2. **Two pointers** - one for reading, one for writing
3. **In-place modification** - overwrite elements as we go
4. **Return count** - first k elements contain the result

## Edge Cases

- Empty array: `[]` → return 0
- Single element: `[1]` → return 1
- No duplicates: `[1,2,3]` → return 3
- All duplicates: `[1,1,1]` → return 1

## Comparison

| Solution | Time Complexity | Space Complexity | In-Place? |
|----------|----------------|------------------|-----------|
| Extra Space | O(n) | O(n) | ❌ No |
| Two Pointers | O(n) | O(1) | ✅ **Yes** |

## Practice Problems

- [Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/) (Allow 2 duplicates)
- [Remove Element](https://leetcode.com/problems/remove-element/)
- [Move Zeroes](https://leetcode.com/problems/move-zeroes/)
