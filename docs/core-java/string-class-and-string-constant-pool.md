---
title: What is the String class and the String Constant Pool (SCP) in Java?
sidebar_label: String Class & String Constant Pool
sidebar_position: 19
description: Understand Java's String class, immutability, the String Constant Pool (SCP), how objects are created with and without the new operator, intern(), compile-time constants, and how many objects each statement creates.
tags: [core-java, string, string-pool, scp, immutability, memory-management, intermediate]
---

# What is the String class and the String Constant Pool (SCP) in Java?

> **Short answer:** `String` is a `final`, **immutable** class in `java.lang` that represents a sequence of characters. To save memory, the JVM keeps a **String Constant Pool (SCP)**, a special area in the heap that stores one shared copy of each string literal. When you write `String s = "Java";` (without `new`), the JVM reuses the pooled object if it already exists, or creates it in the pool if it does not. When you write `String s = new String("Java");`, a **new object is always created in the heap, outside the pool**, and the literal `"Java"` is also placed in the pool if it is not there yet.

## Detailed explanation

### The `String` class

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence { ... }
```

- `String` is declared `final`, so it cannot be extended.
- It implements `CharSequence` (a readable sequence of characters), `Comparable<String>` (alphabetical ordering with `compareTo()`), and `Serializable`.
- Internally, the characters are stored in a private, final array. Up to Java 8 this was a `char[]`. Since Java 9 (**compact strings**) it is a `byte[]` plus an encoding flag, so strings that contain only Latin-1 characters use one byte per character instead of two.
- A `String` object is **immutable**: once created, its contents never change. Methods such as `concat()`, `toUpperCase()`, `replace()`, and `substring()` return a **new** `String` and leave the original untouched.

### Why `String` is immutable

- **Safe sharing in the pool:** many references can point to the same pooled object. If one of them could change it, every other reference would see the change.
- **Security:** strings are used for file paths, URLs, class names, and database credentials. They cannot be changed after they have been validated.
- **Thread safety:** immutable objects can be shared between threads without synchronization.
- **Hash code caching:** `String` caches its hash code after the first call, which makes it a fast and reliable `HashMap` key.

### What is the String Constant Pool (SCP)?

The String Constant Pool, also called the **String Pool** or **String Intern Pool**, is a table maintained by the JVM that holds one unique `String` object for each distinct literal (and each string passed to `intern()`).

- **Location:** before Java 7, the pool was in the **PermGen** area, which had a small fixed size. Since **Java 7**, it is in the **main heap**, so it can grow and its unused strings can be garbage collected.
- **What goes in automatically:** string literals in source code (`"Java"`) and compile-time constant expressions (`"Ja" + "va"`).
- **What does not go in automatically:** strings created with `new`, or built at runtime by concatenating variables, reading input, `substring()`, `toUpperCase()`, and so on. These can be added explicitly with `intern()`.
- **Purpose:** literals are used everywhere in programs, so sharing one copy of each saves a lot of memory. Sharing is safe only because `String` is immutable.

### Object creation without `new` (string literal)

```java
String s1 = "Java";
String s2 = "Java";
```

1. When `"Java"` is first used, the JVM looks for an equal string in the SCP.
2. It is not there, so one `String` object is created **in the pool**, and `s1` refers to it.
3. For `s2`, the JVM finds the existing `"Java"` in the pool and makes `s2` refer to the **same** object. No new object is created.

So `s1 == s2` is `true`, because both references point to the same object.

```text
 Stack                Heap
                     ┌──────────────────────────────┐
                     │ String Constant Pool         │
 s1 ───────────────► │   ┌────────┐                 │
 s2 ───────────────► │   │ "Java" │                 │
                     │   └────────┘                 │
                     └──────────────────────────────┘
```

**Objects created:** 1 (and 0 for every later literal `"Java"`).

### Object creation with `new`

```java
String s3 = new String("Java");
String s4 = new String("Java");
```

1. The argument `"Java"` is a literal, so the JVM makes sure it is in the SCP. In this example it is already there from `s1`, so nothing new is pooled.
2. `new` **always** creates a new `String` object in the heap, **outside** the pool, copying the contents of the pooled literal. `s3` refers to this new object.
3. The same happens for `s4`: another separate heap object is created.

So `s1 == s3` and `s3 == s4` are both `false`, but `s1.equals(s3)` is `true`, because `equals()` compares contents.

```text
 Stack                Heap
                     ┌──────────────────────────────┐
                     │ String Constant Pool         │
 s1, s2 ───────────► │   ┌────────┐                 │
                     │   │ "Java" │                 │
                     │   └────────┘                 │
                     └──────────────────────────────┘
                       ┌────────┐      ┌────────┐
 s3 ─────────────────► │ "Java" │      │ "Java" │ ◄──── s4
                       └────────┘      └────────┘
                       (outside the pool: one new object per `new`)
```

### How many objects does `new String("Java")` create?

This is a very common interview question. The answer depends on whether the literal is already in the pool:

| Situation | Objects created | Where |
| --- | --- | --- |
| `"Java"` is **not** in the SCP yet | **2** | 1 in the SCP (the literal) + 1 in the heap (from `new`) |
| `"Java"` is **already** in the SCP | **1** | 1 in the heap (from `new`) |

When asked about `new String("Java")` on its own, the expected answer is usually "**two objects**: one in the String Constant Pool and one in the heap; the reference variable points to the heap object."

> In HotSpot, the new object shares the pooled object's internal character array instead of copying it, but it is still a separate `String` object with a different identity.

### Comparison: with and without `new`

| Aspect | Literal: `String s = "Java";` | `new`: `String s = new String("Java");` |
| --- | --- | --- |
| Where the referenced object lives | String Constant Pool | Heap, outside the pool |
| Reuses an existing object | Yes, if the same literal is already pooled | Never; always creates a new object |
| Objects created | 0 or 1 | 1 or 2 |
| `==` with another identical literal | `true` | `false` |
| Memory use | Efficient | Wasteful, creates duplicates |
| Recommended | Yes | Rarely; only when a distinct object is truly required |

### The `intern()` method

`intern()` returns the **pooled** copy of a string:

- If the pool already contains an equal string, `intern()` returns that pooled object.
- Otherwise, it adds the string to the pool and returns it.

```java
String s3 = new String("Java");  // Heap object
String s5 = s3.intern();         // Pooled "Java"
System.out.println(s1 == s5);    // true
```

### Compile-time constants vs runtime concatenation

Where a concatenated string ends up depends on **when** its value is known:

- `"Ja" + "va"` contains only literals, so the compiler joins them into `"Java"` at compile time. The result is the pooled literal.
- A `final` variable initialized with a literal is a **compile-time constant**, so `finalPart + "va"` is also joined at compile time and pooled.
- A non-final variable is only known at runtime, so `part + "va"` creates a **new** `String` object in the heap, outside the pool.

| Expression | When it is evaluated | `== "Java"`? |
| --- | --- | --- |
| `"Ja" + "va"` | Compile time | `true` |
| `finalPart + "va"` (with `final String finalPart = "Ja"`) | Compile time | `true` |
| `part + "va"` (with `String part = "Ja"`) | Runtime | `false` |
| `(part + "va").intern()` | Runtime, then pooled | `true` |

### Common `String` methods

| Method | Returns |
| --- | --- |
| `length()` | Number of characters (UTF-16 code units) |
| `charAt(int index)` | Character at the given index |
| `substring(int begin, int end)` | Part of the string from `begin` to `end - 1` |
| `indexOf(String str)` | First index of `str`, or `-1` |
| `contains(CharSequence s)` | Whether the string contains `s` |
| `equals(Object o)` / `equalsIgnoreCase(String s)` | Content comparison, with or without case |
| `compareTo(String s)` | Negative, zero, or positive for alphabetical ordering |
| `toUpperCase()` / `toLowerCase()` | A new string with changed case |
| `trim()` / `strip()` | A new string without leading and trailing whitespace (`strip()` is Unicode-aware, Java 11+) |
| `replace(old, new)` | A new string with replacements |
| `split(String regex)` | An array of parts |
| `isEmpty()` / `isBlank()` | Whether the length is 0 / whether it contains only whitespace (Java 11+) |
| `String.valueOf(x)` | The string form of any value |
| `String.join(delimiter, parts...)` | Parts joined with a delimiter |

## Code example

```java title="StringPoolExample.java"
public class StringPoolExample {
    public static void main(String[] args) {
        // Without new: literals come from the String Constant Pool
        String s1 = "Java";
        String s2 = "Java";

        // With new: a new heap object every time, outside the pool
        String s3 = new String("Java");
        String s4 = new String("Java");

        System.out.println("s1 == s2: " + (s1 == s2));           // Same pooled object
        System.out.println("s1 == s3: " + (s1 == s3));           // Pool vs heap
        System.out.println("s3 == s4: " + (s3 == s4));           // Two heap objects
        System.out.println("s1.equals(s3): " + s1.equals(s3));   // Same contents

        // intern(): get the pooled copy
        String s5 = s3.intern();
        System.out.println("s1 == s3.intern(): " + (s1 == s5));

        // Compile-time constant: joined by the compiler and pooled
        String s6 = "Ja" + "va";
        System.out.println("s1 == \"Ja\" + \"va\": " + (s1 == s6));

        final String finalPart = "Ja";
        String s7 = finalPart + "va";
        System.out.println("s1 == finalPart + \"va\": " + (s1 == s7));

        // Runtime concatenation: a new heap object, not pooled
        String part = "Ja";
        String s8 = part + "va";
        System.out.println("s1 == part + \"va\": " + (s1 == s8));
        System.out.println("s1 == (part + \"va\").intern(): " + (s1 == s8.intern()));

        // Immutability: methods return new strings
        String name = "Java";
        name.concat(" 21");                    // Result is ignored
        System.out.println("After concat without assignment: " + name);
        name = name.concat(" 21");             // Reference now points to a new object
        System.out.println("After concat with assignment: " + name);
        System.out.println("s1 is still: " + s1);
    }
}
```

**Output:**

```text
s1 == s2: true
s1 == s3: false
s3 == s4: false
s1.equals(s3): true
s1 == s3.intern(): true
s1 == "Ja" + "va": true
s1 == finalPart + "va": true
s1 == part + "va": false
s1 == (part + "va").intern(): true
After concat without assignment: Java
After concat with assignment: Java 21
s1 is still: Java
```

## Common follow-ups & pitfalls

- **"How many objects are created by `String s = new String("Java");`?"** Two if `"Java"` is not yet in the pool (one in the SCP and one in the heap), otherwise one.
- **"How many objects are created by `String a = "Java"; String b = "Java";`?"** One. Both references point to the same pooled object.
- **"How many `String` objects are created by `new String("A") + new String("B")`?"** Five, assuming neither literal is pooled yet: `"A"` and `"B"` in the pool, two heap objects from `new`, and the result `"AB"` in the heap. `"AB"` is **not** added to the pool because it is created at runtime.
- **"Where is the String Constant Pool?"** In the heap since Java 7. Before that, it was in PermGen.
- **"Are strings in the pool ever garbage collected?"** Yes, since the pool moved to the heap. A pooled string that is no longer referenced (including by any loaded class) can be collected.
- **"Why should we compare strings with `equals()` and not `==`?"** `==` compares references, so it is `true` only for the same object. Two strings with the same contents can be different objects (from `new`, runtime concatenation, input, and so on). `equals()` compares contents.
- **"Why is `String` immutable and `final`?"** Immutability makes pooling, caching the hash code, thread safety, and security possible. `final` prevents subclasses from adding mutable behavior.
- **"When should I use `StringBuilder`?"** When building a string in a loop or through many changes. Each `+` on a `String` creates a new object, while `StringBuilder` modifies one internal buffer. `StringBuffer` is the older, synchronized version.
- **Pitfall:** `new String("Java")` is almost never needed and wastes memory. Use the literal.
- **Pitfall:** Calling `intern()` on many unique runtime strings fills the pool and adds lookup overhead. Use it only when many duplicates are expected.
- **Pitfall:** Forgetting to assign the result of a `String` method, as in `name.toUpperCase();`, has no effect, because the original string never changes.
- **Pitfall:** Code that seems to work with `==` usually works only because both strings happen to be pooled literals. It breaks as soon as one string comes from input, a database, or runtime concatenation.

Related: [What is the difference between `equals()` and `==`?](./equals-vs-double-equals.md)

## Key takeaways

- `String` is a `final`, immutable class; every "modifying" method returns a new `String`.
- The String Constant Pool is a heap area (since Java 7) that stores one shared copy of each string literal.
- Without `new`, a literal reuses the pooled object if it exists, so identical literals share one object.
- With `new`, a new heap object is always created outside the pool, plus the literal in the pool if it is not there yet: 2 objects or 1.
- Compile-time constants are pooled; strings built at runtime are not, unless you call `intern()`.
- Always compare string contents with `equals()`, not `==`.
