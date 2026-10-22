---
title: What is the difference between final, finally, and finalize in Java?
sidebar_label: final vs finally vs finalize
sidebar_position: 14
description: Understand the difference between the final keyword, the finally block, and the deprecated finalize() method in Java, with examples and common interview traps.
tags: [core-java, final, exception-handling, garbage-collection, beginner]
---

# What is the difference between final, finally, and finalize in Java?

> **Short answer:** The three names look similar but are unrelated. `final` is a **keyword** that restricts change: a final variable cannot be reassigned, a final method cannot be overridden, and a final class cannot be extended. `finally` is a **block** used with `try` that runs whether or not an exception is thrown, usually for cleanup. `finalize()` is a **method** of `Object` that the garbage collector could call before reclaiming an object; it is deprecated and should not be used in new code.

## Detailed explanation

### `final` (keyword)

`final` is a modifier that can be applied to variables, methods, and classes.

- **Final variable:** can be assigned only once. A final field must be assigned by the end of its initializer, an initializer block, or every constructor. A final local variable must be assigned before it is used.
- **Final reference:** the reference cannot point to another object, but the object itself can still be modified (for example, items can be added to a `final List`).
- **Final method:** cannot be overridden by a subclass.
- **Final class:** cannot be extended. `String`, `Integer`, and the other wrapper classes are examples.
- **Final parameter:** cannot be reassigned inside the method.

### `finally` (block)

`finally` is a block that follows a `try` block (with or without `catch` blocks).

- It runs whether the `try` block completes normally, throws an exception, or exits with `return`, `break`, or `continue`.
- It is used for cleanup such as closing files, releasing locks, or closing database connections.
- A `try` block must be followed by at least one `catch` block, a `finally` block, or both.
- It does **not** run if the JVM stops first, for example after `System.exit()`, a JVM crash, or the process being killed. It also does not finish if the thread running it never leaves the `try` block (for example, an infinite loop).
- For resources that implement `AutoCloseable`, `try`-with-resources (Java 7+) is usually cleaner than closing them manually in `finally`.

### `finalize()` (method)

`finalize()` is a `protected` method declared in `java.lang.Object`.

- A class could override it to run cleanup code before the garbage collector reclaims the object.
- There is **no guarantee** when it runs, or whether it runs at all. An object may never be garbage collected before the program exits.
- It is called at most once per object by the garbage collector.
- It was deprecated in **Java 9** and marked **deprecated for removal** in **Java 18** (JEP 421) because it is unpredictable, slow, and can cause resource leaks or security problems.
- Use `try`-with-resources, `finally`, or `java.lang.ref.Cleaner` instead.

### Side-by-side comparison

| Aspect | `final` | `finally` | `finalize()` |
| --- | --- | --- | --- |
| What it is | Keyword (modifier) | Keyword (block) | Method of `Object` |
| Used with | Variables, methods, classes | `try` / `catch` | Objects being garbage collected |
| Purpose | Prevent reassignment, overriding, or inheritance | Run cleanup code no matter how `try` exits | Cleanup before garbage collection |
| When it takes effect | Checked at compile time | Every time the `try` block exits | Whenever the GC decides, if ever |
| Current status | Widely used | Widely used | Deprecated for removal |

## Code example

```java title="FinalFinallyFinalizeExample.java"
import java.util.ArrayList;
import java.util.List;

final class Config {                 // final class: cannot be extended
    static final int MAX_USERS = 100; // final variable: a constant
}

class Resource {
    // finalize(): deprecated, shown only for comparison. Do not rely on it.
    @Override
    @SuppressWarnings({"deprecation", "removal"})
    protected void finalize() throws Throwable {
        System.out.println("finalize() called");
    }
}

public class FinalFinallyFinalizeExample {
    static int divide(int a, int b) {
        try {
            return a / b;
        } catch (ArithmeticException e) {
            System.out.println("Caught: " + e.getMessage());
            return -1;
        } finally {
            System.out.println("finally runs for " + a + " / " + b);
        }
    }

    public static void main(String[] args) {
        // Config.MAX_USERS = 200;   // Compile-time error: cannot assign a final variable

        final List<String> users = new ArrayList<>();
        users.add("Asha");           // Allowed: the object can change
        // users = new ArrayList<>(); // Compile-time error: the reference cannot change
        System.out.println("Users: " + users + ", max: " + Config.MAX_USERS);

        System.out.println("Result: " + divide(10, 2));
        System.out.println("Result: " + divide(10, 0));

        new Resource();              // Eligible for GC, but finalize() may never run
    }
}
```

**Output:**

```text
Users: [Asha], max: 100
finally runs for 10 / 2
Result: 5
Caught: / by zero
finally runs for 10 / 0
Result: -1
```

Notice that `finally` runs **before** the method actually returns, so its message is printed before `Result: ...`. The `finalize()` message usually does not appear at all, because the program ends before the garbage collector reclaims the `Resource` object.

## Common follow-ups & pitfalls

- **"Does `finally` run if `try` has a `return` statement?"** Yes. The return value is evaluated first, then `finally` runs, then the method returns.
- **"What if `finally` also has a `return`?"** The `return` in `finally` replaces the value from `try` or `catch`, and it also discards any exception that was being thrown. Avoid `return` in `finally`.
- **"When does `finally` not run?"** When the JVM stops first, for example after `System.exit()`, a crash, or a forced kill.
- **"Can we call `finalize()` ourselves?"** Yes, it is an ordinary method, but calling it directly does not free memory or trigger garbage collection.
- **"Does `System.gc()` guarantee that `finalize()` runs?"** No. `System.gc()` is only a request to the JVM.
- **"Can a constructor be `final`?"** No. Constructors are not inherited, so `final` has no meaning for them and causes a compile-time error.
- **Pitfall:** `final` does not make an object immutable. A `final` reference to a mutable object only stops the reference from being reassigned.
- **Pitfall:** Changing a value inside `finally` does not change a primitive value already chosen by `return` in `try`. For example, `int x = 1; try { return x; } finally { x = 2; }` returns `1`.

## Key takeaways

- `final` is a keyword that prevents reassignment of variables, overriding of methods, and extension of classes.
- `finally` is a block that runs after `try`/`catch` whether or not an exception occurs, unless the JVM stops first.
- `finalize()` is a deprecated `Object` method that the garbage collector may call before reclaiming an object, with no timing guarantee.
- For cleanup, prefer `try`-with-resources or `finally` over `finalize()`.
