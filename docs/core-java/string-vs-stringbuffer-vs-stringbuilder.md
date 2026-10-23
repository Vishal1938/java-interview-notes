---
title: What is the difference between String, StringBuffer, and StringBuilder in Java, and when should you use each?
sidebar_label: String vs StringBuffer vs StringBuilder
sidebar_position: 20
description: Understand the differences between String, StringBuffer, and StringBuilder in Java, including mutability, thread safety, performance, capacity, and when to use each one.
tags: [core-java, string, stringbuilder, stringbuffer, immutability, thread-safety, intermediate]
---

# What is the difference between String, StringBuffer, and StringBuilder in Java, and when should you use each?

> **Short answer:** `String` is **immutable**: every change creates a new object. `StringBuffer` and `StringBuilder` are **mutable**: they change one internal buffer in place. `StringBuffer` is **synchronized** (thread-safe but slower), while `StringBuilder` is **not synchronized** (faster, for use by one thread). Use `String` for values that do not change, `StringBuilder` for building or modifying text, and `StringBuffer` only when several threads must modify the same buffer.

## Detailed explanation

### `String`

- **Immutable:** once created, a `String` object never changes. Methods such as `concat()`, `replace()`, and `toUpperCase()` return a **new** `String`.
- **Thread-safe** because it is immutable, without any locking.
- String literals are stored in, and shared through, the **String Constant Pool**.
- Overrides `equals()` and `hashCode()` to compare contents, so it works well as a `HashMap` key.
- Changing a string repeatedly (for example, with `+=` in a loop) creates a new object each time, which wastes memory and time.

See [What is the String class and the String Constant Pool?](./string-class-and-string-constant-pool.md) for details.

### `StringBuffer`

- **Mutable:** methods such as `append()`, `insert()`, `delete()`, and `reverse()` change the same object.
- **Synchronized:** its public methods are `synchronized`, so only one thread can use a given `StringBuffer` at a time.
- Available since **Java 1.0**.
- The locking adds overhead, even when only one thread uses the object.

### `StringBuilder`

- **Mutable**, with the **same methods** as `StringBuffer`.
- **Not synchronized**, so it is faster, but it must not be modified by several threads at the same time.
- Added in **Java 5** as a drop-in, faster replacement for `StringBuffer` in single-threaded code.
- This is the class you should use in almost all code that builds strings.

`StringBuffer` and `StringBuilder` both extend the internal class `AbstractStringBuilder` and implement `CharSequence`, so they share almost all of their code.

### Side-by-side comparison

| Aspect | `String` | `StringBuffer` | `StringBuilder` |
| --- | --- | --- | --- |
| Mutability | Immutable | Mutable | Mutable |
| Thread safety | Yes (immutable) | Yes (synchronized methods) | No |
| Performance for repeated changes | Slowest (new object per change) | Slower (locking) | Fastest |
| Introduced in | Java 1.0 | Java 1.0 | Java 5 |
| Stored in String Constant Pool | Literals, yes | No | No |
| `equals()` compares | Contents | References (not overridden) | References (not overridden) |
| `+` operator | Supported | Not supported | Not supported |
| `reverse()`, `insert()`, `delete()` | Not available | Available | Available |
| Typical use | Fixed values, map keys, constants | Shared buffer across threads (rare) | Building text in loops and methods |

### Capacity and growth

`StringBuffer` and `StringBuilder` store characters in an internal array that has a **capacity**, which is usually larger than the current **length**.

- `new StringBuilder()` starts with a capacity of **16** characters.
- `new StringBuilder("text")` starts with a capacity of `16 + text.length()`.
- `new StringBuilder(100)` starts with a capacity of **100**.
- When an `append()` needs more room, the capacity grows to `(oldCapacity * 2) + 2`, or to the required size if that is larger, and the characters are copied into a new array.
- If you know roughly how long the result will be, pass that as the initial capacity to avoid repeated resizing.

### Common methods of `StringBuffer` and `StringBuilder`

| Method | What it does |
| --- | --- |
| `append(x)` | Adds `x` to the end; overloaded for all primitive types, `String`, `char[]`, and `Object` |
| `insert(int offset, x)` | Inserts `x` at the given position |
| `delete(int start, int end)` | Removes characters from `start` to `end - 1` |
| `deleteCharAt(int index)` | Removes one character |
| `replace(int start, int end, String str)` | Replaces a range with `str` |
| `reverse()` | Reverses the characters in place |
| `setCharAt(int index, char ch)` | Changes one character |
| `setLength(int newLength)` | Truncates or pads with `'\u0000'`; `setLength(0)` clears the buffer |
| `length()` / `capacity()` | Number of characters / size of the internal array |
| `toString()` | Returns a new `String` with the current contents |

Most of these methods return the same object (`this`), so calls can be **chained**: `sb.append("a").append(1).reverse()`.

### What the compiler does with `+`

- `String s = a + b + c;` is a single expression. The compiler turns it into one efficient concatenation (with a `StringBuilder` before Java 9, and with `invokedynamic` and `StringConcatFactory` since Java 9). Using `+` here is fine.
- In a **loop**, `result += value;` builds a new `String` on every iteration and copies all the previous characters each time. For `n` iterations this is roughly O(n²) work. Use one `StringBuilder` for the whole loop instead.

### When to use which

| Situation | Use |
| --- | --- |
| The value does not change after it is created (names, messages, constants, keys) | `String` |
| A few strings joined in one expression | `String` with `+` |
| Building a string in a loop or step by step | `StringBuilder` |
| Many changes such as `insert`, `delete`, `replace`, or `reverse` | `StringBuilder` |
| Several threads append to the **same** buffer at the same time | `StringBuffer` (or a better design, such as building per-thread and combining) |
| Joining items with a separator | `String.join()`, `StringJoiner`, or `Collectors.joining()` |
| Legacy APIs that require `StringBuffer` (for example, some `Matcher` methods before Java 9) | `StringBuffer` |

## Code example

```java title="StringBuilderBufferExample.java"
public class StringBuilderBufferExample {
    public static void main(String[] args) throws InterruptedException {
        // String: immutable, methods return new objects
        String s = "Java";
        String upper = s.toUpperCase();
        System.out.println("String: " + s + ", new object: " + upper + ", same object? " + (s == upper));

        // StringBuilder: mutable, methods change the same object
        StringBuilder sb = new StringBuilder("Java");
        StringBuilder returned = sb.append(" 21");
        System.out.println("StringBuilder: " + sb + ", same object? " + (sb == returned));

        sb.insert(0, "Hello ")       // Hello Java 21
          .replace(6, 10, "World")   // Hello World 21
          .append("!");              // Hello World 21!
        System.out.println("After chaining: " + sb);
        System.out.println("Reversed: " + new StringBuilder("level up").reverse());

        // Capacity: starts at 16, then grows to (old * 2) + 2
        StringBuilder capacityDemo = new StringBuilder();
        System.out.println("Initial capacity: " + capacityDemo.capacity());
        capacityDemo.append("12345678901234567");   // 17 characters
        System.out.println("Capacity after 17 chars: " + capacityDemo.capacity());

        // Building text in a loop: one StringBuilder instead of many Strings
        StringBuilder csv = new StringBuilder();
        for (int i = 1; i <= 5; i++) {
            if (csv.length() > 0) {
                csv.append(',');
            }
            csv.append(i);
        }
        System.out.println("Loop result: " + csv);

        // equals() is not overridden: compares references
        StringBuilder a = new StringBuilder("abc");
        StringBuilder b = new StringBuilder("abc");
        System.out.println("a.equals(b): " + a.equals(b));
        System.out.println("a.toString().equals(b.toString()): " + a.toString().equals(b.toString()));
        System.out.println("a.compareTo(b) == 0: " + (a.compareTo(b) == 0));          // Java 11+
        System.out.println("\"abc\".contentEquals(a): " + "abc".contentEquals(a));

        // StringBuffer: synchronized, safe to share between threads
        StringBuffer shared = new StringBuffer();
        Runnable task = () -> {
            for (int i = 0; i < 1000; i++) {
                shared.append('x');
            }
        };
        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println("StringBuffer length after 2 threads: " + shared.length());
    }
}
```

**Output:**

```text
String: Java, new object: JAVA, same object? false
StringBuilder: Java 21, same object? true
After chaining: Hello World 21!
Reversed: pu level
Initial capacity: 16
Capacity after 17 chars: 34
Loop result: 1,2,3,4,5
a.equals(b): false
a.toString().equals(b.toString()): true
a.compareTo(b) == 0: true
"abc".contentEquals(a): true
StringBuffer length after 2 threads: 2000
```

If `shared` were a `StringBuilder`, the two threads could overwrite each other's updates, so the final length could be less than 2000, or the program could throw an `ArrayIndexOutOfBoundsException`.

## Common follow-ups & pitfalls

- **"Why is `StringBuilder` faster than `StringBuffer`?"** `StringBuffer` acquires a lock on every method call. `StringBuilder` does not.
- **"Why is `String` immutable but `StringBuilder` mutable?"** `String` objects are shared through the pool, cached as hash keys, and passed between threads, so they must never change. `StringBuilder` is meant to be a temporary, private workspace for building text.
- **"How do you convert between them?"** `new StringBuilder(str)` or `new StringBuffer(str)` from a `String`, and `sb.toString()` back to a `String`.
- **"Can we compare two `StringBuilder` objects with `equals()`?"** It compiles, but it compares references. Compare `toString()` results, use `compareTo()` (Java 11+), or use `String.contentEquals()`.
- **"Is `StringBuffer` completely thread-safe?"** Each method call is atomic, but a sequence of calls is not. For example, `if (buf.length() == 0) buf.append("x");` can still have a race between the check and the append unless you synchronize the whole block.
- **"Is using `+` always bad?"** No. Within a single expression, the compiler optimizes it. The problem is repeated `+=` in a loop.
- **Pitfall:** `StringBuilder` and `StringBuffer` do not override `hashCode()`, and their contents can change, so they are poor choices for `HashMap` keys or `HashSet` elements. Convert them to `String` first.
- **Pitfall:** `setLength(0)` clears the contents but keeps the large internal array. Reusing a huge builder keeps that memory alive.
- **Pitfall:** Sharing one `StringBuilder` between threads gives unpredictable results. Give each thread its own builder.

## Key takeaways

- `String` is immutable; `StringBuffer` and `StringBuilder` are mutable.
- `StringBuffer` is synchronized and thread-safe; `StringBuilder` is not, and is faster.
- Use `String` for fixed values, `StringBuilder` for building or changing text, and `StringBuffer` only when several threads share one buffer.
- Avoid `+=` on a `String` inside loops; use a single `StringBuilder` instead.
- `StringBuilder` and `StringBuffer` do not override `equals()` or `hashCode()`, so compare their `toString()` results.
