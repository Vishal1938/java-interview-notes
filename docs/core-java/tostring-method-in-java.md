---
title: What is the toString() method in Java, and why should you override it?
sidebar_label: toString() Method
sidebar_position: 18
description: Understand Java's toString() method, its default output from Object, when it is called implicitly, how to override it correctly, and common pitfalls with arrays, null, and recursion.
tags: [core-java, tostring, object-class, beginner]
---

# What is the toString() method in Java, and why should you override it?

> **Short answer:** `toString()` is a method of `java.lang.Object` that returns a `String` representation of an object. The default version returns the class name, an `@`, and the hash code in hexadecimal (for example, `Point@1b6d3586`), which is rarely useful. You override it to return a readable summary of the object's important fields. Java calls it automatically when an object is printed, concatenated with a string, or appended to a `StringBuilder`.

## Detailed explanation

### The default implementation

Every class inherits `toString()` from `Object`, which is implemented as:

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

- `getClass().getName()` is the fully qualified class name, such as `com.example.Point`.
- The part after `@` is the object's hash code in hexadecimal. It is **not** a memory address.
- If the class overrides `hashCode()`, the default `toString()` uses that overridden value.

### When `toString()` is called automatically

You rarely need to call `toString()` yourself. Java calls it for you when:

- An object is passed to `System.out.println(obj)` or `print(obj)`. These use `String.valueOf(obj)`, which calls `obj.toString()`.
- An object is concatenated with a string, as in `"Point: " + obj`.
- An object is passed to `StringBuilder.append(obj)` or `String.valueOf(obj)`.
- An object is shown by a logger, a debugger, or an IDE variable view.
- A collection is printed. `ArrayList`, `HashMap`, and other collections call `toString()` on each of their elements, as in `[Employee{id=1}, Employee{id=2}]`.

### Overriding `toString()`

A good `toString()`:

- Includes the fields that identify the object or are useful while debugging.
- Uses a clear, consistent format, such as `Employee{id=1, name='Asha'}`.
- Is annotated with `@Override`, so the compiler confirms the method signature is correct.
- Does **not** include sensitive data such as passwords, tokens, or card numbers, because `toString()` output often ends up in logs.

Other ways to get a `toString()`:

- **Records** (Java 16+) generate one automatically, in the form `Book[title=Clean Code, price=450.0]`.
- **Enums** return the constant's name by default, such as `MONDAY`.
- **IDEs** and **Lombok** (`@ToString`) can generate one from the fields.

### Arrays do not override `toString()`

Arrays inherit the default `Object.toString()`, so printing an `int[]` gives something like `[I@6d06d69c`. (`[I` is the JVM's internal name for an `int` array.) Use:

- `Arrays.toString(array)` for a one-dimensional array, which prints `[1, 2, 3]`.
- `Arrays.deepToString(array)` for nested arrays, which prints `[[1, 2], [3, 4]]`.

### Printing `null` safely

- `String.valueOf(null reference)`, `println(null reference)`, and `"text" + null reference` all produce the text `null` without an exception.
- Calling `obj.toString()` directly on a `null` reference throws a `NullPointerException`.
- `Objects.toString(obj, "default")` returns the default text when `obj` is `null`.

## Code example

```java title="ToStringExample.java"
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

// Does not override toString(): uses Object's version
class Point {
    int x;
    int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
}

// Overrides toString() with the useful fields, but not the password
class Employee {
    private final int id;
    private final String name;
    private final String password;

    Employee(int id, String name, String password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }

    @Override
    public String toString() {
        return "Employee{id=" + id + ", name='" + name + "'}";
    }
}

// Records generate toString() automatically
record Book(String title, double price) {
}

public class ToStringExample {
    public static void main(String[] args) {
        Point point = new Point(3, 4);
        String expected = point.getClass().getName() + "@" + Integer.toHexString(point.hashCode());
        System.out.println("Default format matches: " + point.toString().equals(expected));

        Employee employee = new Employee(1, "Asha", "secret123");
        System.out.println(employee);                       // println calls toString()
        System.out.println("Logged in: " + employee);       // Concatenation calls toString()

        List<Employee> team = List.of(employee, new Employee(2, "Ravi", "pass456"));
        System.out.println(team);                           // List calls toString() on each element

        System.out.println(new Book("Clean Code", 450.0));

        int[] numbers = {1, 2, 3};
        System.out.println("Array default starts with [I@: " + numbers.toString().startsWith("[I@"));
        System.out.println(Arrays.toString(numbers));
        System.out.println(Arrays.deepToString(new int[][] {{1, 2}, {3, 4}}));

        Employee missing = null;
        System.out.println("Missing: " + missing);          // No exception: prints null
        System.out.println(Objects.toString(missing, "No employee"));
        // missing.toString();                              // NullPointerException
    }
}
```

**Output:**

```text
Default format matches: true
Employee{id=1, name='Asha'}
Logged in: Employee{id=1, name='Asha'}
[Employee{id=1, name='Asha'}, Employee{id=2, name='Ravi'}]
Book[title=Clean Code, price=450.0]
Array default starts with [I@: true
[1, 2, 3]
[[1, 2], [3, 4]]
Missing: null
No employee
```

The default output of `Point` and of the `int[]` array includes a hash code that changes between runs, so the example checks its format instead of printing it.

## Common follow-ups & pitfalls

- **"What does the default `toString()` return?"** The class name, `@`, and the hash code in hexadecimal: `getClass().getName() + "@" + Integer.toHexString(hashCode())`.
- **"Is the number after `@` the memory address?"** No. It is the object's hash code in hexadecimal. The default hash code is identity-based, but the JVM does not guarantee that it is an address.
- **"Why does `System.out.println(obj)` not need `.toString()`?"** `println(Object)` calls `String.valueOf(obj)`, which returns `"null"` for `null` and otherwise calls `obj.toString()`.
- **"Does `String` override `toString()`?"** Yes. It returns the same `String` object. Wrapper classes such as `Integer` and collections such as `ArrayList` and `HashMap` override it too.
- **"Why should you always override `toString()`?"** It makes logs, error messages, test failures, and debugging much easier to read. *Effective Java* recommends it for most classes.
- **Pitfall:** If two objects refer to each other (for example, `Department` lists its `Employee`s and each `Employee` refers to its `Department`) and both `toString()` methods print the other object, the calls repeat forever and throw a `StackOverflowError`. Print only an ID or name for the back-reference.
- **Pitfall:** Do not include passwords, tokens, or personal data in `toString()`; the output often ends up in log files.
- **Pitfall:** Do not write code that parses another class's `toString()` output. The format is meant for people and can change. Provide getters for values that code needs.
- **Pitfall:** Building expensive strings for log messages that are never written wastes time. Use parameterized logging, such as `log.debug("Saved {}", employee)`, which calls `toString()` only if the message is actually logged.

## Key takeaways

- `toString()` returns a `String` representation of an object and is inherited from `Object`.
- The default output is `ClassName@hexHashCode`, which is rarely useful, so override it in your classes.
- Java calls `toString()` automatically in `println`, string concatenation, `StringBuilder.append`, and collection printing.
- Use `Arrays.toString()` or `Arrays.deepToString()` for arrays, and `Objects.toString(obj, default)` for possibly `null` values.
- Keep `toString()` readable, free of sensitive data, and safe from infinite recursion.
