---
title: What is the difference between == and equals() in Java?
sidebar_label: == vs equals()
sidebar_position: 1
description: Reference equality vs logical equality in Java, with String pool and Integer cache examples.
tags: [core-java, string, beginner]
---

# What is the difference between `==` and `equals()` in Java?

> **Short answer:** `==` checks whether two references point to the **same object** in memory (for primitives it compares values). `equals()` checks whether two objects are **logically equal**, meaning their content is the same, as defined by the class. Always use `equals()` to compare objects like `String` and `Integer`.

## Detailed explanation

### `==` — reference equality

- For **primitives** (`int`, `char`, `double`…), `==` compares the actual values.
- For **objects**, `==` compares the *references*. It's `true` only when both variables point to the exact same object.

### `equals()` — logical equality

- Defined in `Object`, where the default implementation is just `this == obj`.
- Classes like `String`, `Integer` and `LocalDate` **override** it to compare content.
- Your own classes compare by reference until you override `equals()` (and `hashCode()` along with it).

### Why `==` sometimes "works" for Strings

String literals are stored in the **String pool**. Two identical literals reuse the same pooled object, so `==` returns `true`. This is an optimization, not something to rely on. `new String("java")` always creates a fresh object.

The same trap exists with **Integer caching**: `Integer.valueOf()` caches values from **-128 to 127**, so `==` happens to work for small numbers and silently fails for larger ones.

## Code example

```java title="EqualsVsDoubleEquals.java"
public class EqualsVsDoubleEquals {
    public static void main(String[] args) {
        String a = "java";              // goes to the String pool
        String b = "java";              // reuses the same pooled object
        String c = new String("java");  // forces a new object on the heap

        System.out.println("a == b      : " + (a == b));       // same reference
        System.out.println("a == c      : " + (a == c));       // different objects
        System.out.println("a.equals(c) : " + a.equals(c));    // same content
        System.out.println("a == c.intern() : " + (a == c.intern()));

        Integer x = 127, y = 127;   // cached by Integer.valueOf (-128..127)
        Integer p = 128, q = 128;   // outside the cache -> new objects
        System.out.println("127 == 127  : " + (x == y));
        System.out.println("128 == 128  : " + (p == q));
        System.out.println("128 equals  : " + p.equals(q));
    }
}
```

**Output:**

```text
a == b      : true
a == c      : false
a.equals(c) : true
a == c.intern() : true
127 == 127  : true
128 == 128  : false
128 equals  : true
```

## Common follow-ups & pitfalls

- **"If I override `equals()`, what else must I override?"** `hashCode()`. Equal objects must have equal hash codes, or `HashMap` and `HashSet` will break.
- **"What does `intern()` do?"** It returns the pooled copy of the string, adding it to the pool if needed.
- **"How do you avoid a `NullPointerException` with `equals()`?"** Call it on the known non-null value (`"java".equals(input)`) or use `Objects.equals(a, b)`.
- **Pitfall:** comparing wrapper types (`Integer`, `Long`) with `==`. It passes tests with small numbers and fails in production.

## Key takeaways

- `==` → same object (or same value for primitives).
- `equals()` → same content, as defined by the class.
- String pool and Integer cache make `==` look correct when it isn't. Always use `equals()` for objects.
