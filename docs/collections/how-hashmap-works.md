---
title: How does HashMap work internally in Java?
sidebar_label: HashMap internals
sidebar_position: 1
description: Buckets, hashing, collisions, resizing and treeification in Java's HashMap, explained with code.
tags: [collections, hashmap, intermediate]
---

# How does `HashMap` work internally in Java?

> **Short answer:** `HashMap` stores entries in an **array of buckets**. It calls the key's `hashCode()`, mixes the bits, and uses the result to pick a bucket. Keys that land in the same bucket form a **linked list** (turned into a **red-black tree** when a bucket gets large in Java 8+). On `get()`, it finds the bucket by hash, then uses `equals()` to find the exact key.

## Detailed explanation

### 1. The structure

Internally, `HashMap` holds an array `Node<K,V>[] table`. Each node stores the `hash`, `key`, `value` and a `next` pointer.

### 2. `put(key, value)` step by step

1. **Compute the hash:** `h = key.hashCode()`, then spread it: `h ^ (h >>> 16)`. This mixes the high bits into the low bits so more of the hash affects bucket choice.
2. **Find the bucket index:** `index = (n - 1) & hash`, where `n` is the table size (always a power of two, so this is a fast replacement for `%`).
3. **Empty bucket?** Store the new node there.
4. **Bucket occupied (collision)?** Walk the chain:
   - If a node has the same hash **and** `equals()` returns `true`, **replace the value**.
   - Otherwise, append a new node at the tail.
5. **Resize if needed:** when `size > capacity × loadFactor`, the table doubles and entries are redistributed.

### 3. Important numbers

| Property | Default |
| --- | --- |
| Initial capacity | 16 |
| Load factor | 0.75 (resize at 12 entries for 16 buckets) |
| Resize | Capacity doubles |
| Treeify threshold | A bucket becomes a red-black tree at 8 nodes (only when capacity ≥ 64, otherwise the table resizes instead) |
| Untreeify threshold | Converts back to a list at 6 nodes |

### 4. `get(key)`

Compute the same hash → go to the same bucket → compare hashes, then `equals()`, until the key is found. With a good `hashCode()` this is **O(1)** on average. With heavy collisions it degrades to **O(n)** for a list, or **O(log n)** once the bucket is treeified.

## Code example

This example uses a deliberately bad `hashCode()` so every key collides, showing that `equals()` decides which entry is which.

```java title="HashMapInternals.java"
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class HashMapInternals {

    // A key whose hashCode always collides, to show how HashMap handles collisions.
    static final class BadKey {
        private final String name;

        BadKey(String name) { this.name = name; }

        @Override
        public int hashCode() { return 42; } // every key lands in the same bucket

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof BadKey)) return false;
            return Objects.equals(name, ((BadKey) o).name);
        }

        @Override
        public String toString() { return name; }
    }

    public static void main(String[] args) {
        Map<BadKey, Integer> map = new HashMap<>();
        map.put(new BadKey("A"), 1);
        map.put(new BadKey("B"), 2);
        map.put(new BadKey("A"), 100); // same hash + equals() true -> value replaced

        System.out.println("size       : " + map.size());
        System.out.println("get(A)     : " + map.get(new BadKey("A")));
        System.out.println("get(B)     : " + map.get(new BadKey("B")));

        // Index calculation used by HashMap: (n - 1) & (h ^ (h >>> 16))
        String key = "java";
        int h = key.hashCode();
        int spread = h ^ (h >>> 16);
        int capacity = 16;
        System.out.println("bucket of \"java\" in a 16-bucket table: " + ((capacity - 1) & spread));
    }
}
```

**Output:**

```text
size       : 2
get(A)     : 100
get(B)     : 2
bucket of "java" in a 16-bucket table: 3
```

## Common follow-ups & pitfalls

- **"What happens if you override `equals()` but not `hashCode()`?"** Two equal keys can land in different buckets, so `get()` may return `null` for a key you just put in.
- **"Why should keys be immutable?"** If a key's fields change after insertion, its hash changes and the entry becomes unreachable.
- **"Is `HashMap` thread-safe?"** No. Use `ConcurrentHashMap` for concurrent access.
- **"Does `HashMap` allow null?"** Yes: one `null` key (always stored in bucket 0) and any number of `null` values.
- **"What changed in Java 8?"** Long collision chains become red-black trees, and new nodes are added at the tail instead of the head.

## Key takeaways

- Bucket array + `hashCode()` to find the bucket + `equals()` to find the key.
- Default capacity 16, load factor 0.75, doubles on resize.
- Collisions form a list, then a tree at 8 nodes (Java 8+).
- Always override `equals()` and `hashCode()` together, and prefer immutable keys.
