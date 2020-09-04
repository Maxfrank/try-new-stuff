function getTopK(nums, k, largestK = false) {
  // the k numbers needed is the largest or smallest in the given array
  helper(nums, 0, nums.length - 1, largestK ? nums.length - k : k);
  return largestK ? nums.slice(nums.length - k) : nums.slice(0, k);
}

function helper(arr, lo, hi, k) {
  const m = partition(arr, lo, hi);
  if(m === k) {
    return;
  } else if(m > k) {
    helper(arr, lo, m - 1, k);
  } else if(m < k) {
    helper(arr, m + 1, hi, k);
  }
}

function partition(arr, lo, hi) {
  let i = lo, j = hi + 1;
  const val = arr[lo];
  while(true) {
    while(arr[++i] < val) {
      if(i === hi) {
        break;
      }
    }
    while(arr[--j] > val) {
      if(j === lo) {
        break;
      }
    }
    if(i >= j) {
      break;
    }
    swap(arr, i, j);
  }
  swap(arr, lo, j);
  return j;
}

function swap(arr, left, right) {
  const temp = arr[left];
  arr[left] = arr[right];
  arr[right] = temp;
}


/******************* quick sort to reuse function partition*******************/
function quickSort(arr, lo, hi) {
  if(lo >= hi) {
    return;
  }
  const m = partition(arr, 0, arr.length - 1);
  quickSort(arr, lo, m - 1);
  quickSort(arr, m + 1, hi);
}
