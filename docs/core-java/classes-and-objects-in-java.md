---
title: What are classes and objects in Java?
sidebar_label: Classes and Objects
sidebar_position: 7
description: Understand Java classes and objects, class members, reference variables, object creation, and how references work in memory.
tags: [core-java, classes, objects, memory-management, beginner]
---

# What are classes and objects in Java?

> **Short answer:** A class is a user-defined reference type that describes the members and behavior its objects can have. An object is an instance of a class. A reference variable can refer to an object, or it can contain `null`.

## Detailed explanation

### What is a class?

A **class** is a user-defined type that describes the data and behavior associated with instances of that type. A class body can contain several kinds of members and declarations, including:

- **Fields (variables):** Store per-object or class-level state.
- **Methods:** Define behavior.
- **Constructors:** Initialize new objects.
- **Initializer blocks:** Instance initializer blocks and static initializer blocks.
- **Nested types:** Classes, interfaces, enums, and (in modern Java) records can be declared inside a class.
- **Constants:** Commonly represented by fields declared `static final`.

A class can also contain nested class declarations. In Java, `class` is a keyword used to declare a class, while `java.lang.Class` is a separate Java API class that represents classes and interfaces at runtime.

### What is an object?

An **object** is an instance of a class. It has identity and can hold instance-field values; its methods define the behavior available through its type.

For example:

```java
class Hello {
    int a = 10;
    int b = 20;
}

Hello h1 = new Hello();
```

Here:

- `Hello` is the class.
- `h1` is a reference variable of type `Hello`.
- `new Hello()` creates a `Hello` object and runs its instance initialization and constructor.
- The object's instance fields `a` and `b` are initialized to `10` and `20`.

An object is **not** a blueprint of a class; the class is the blueprint, and the object is an instance created from it.

### Reference variables and object creation

Consider the statement:

```java
Hello h1 = new Hello();
```

Conceptually, this does two things: it declares a reference variable and creates an object.

1. **Reference variable declaration:** `h1` is a local variable if declared inside a method. A local reference variable is not automatically initialized to `null`; it must be assigned before use. If `h1` is a field, its default value is `null` until initialized.
2. **Object creation:** `new Hello()` allocates an object and initializes its instance fields, then executes the constructor.
3. **Reference assignment:** The reference to the newly created object is assigned to `h1`.

The exact memory layout, object size, and reference size depend on the JVM implementation and runtime configuration. Java does not guarantee that a reference variable occupies 8 bytes or 9 bytes. For this reason, avoid memorizing a fixed size for all reference variables.

### Instance variables vs. static variables

These terms are important when discussing object memory:

- **Instance fields:** Each object has its own logical set of instance fields. Each object can hold different values for these fields.
- **Static fields:** A static field belongs to the class rather than to each object. It is shared by instances of that class.
- **Local variables:** Variables declared inside a method or block are local to that scope. A local variable may hold a reference, but it is not an instance field.

For example:

```java title="ClassAndObjectExample.java"
class Hello {
    int a = 10;              // Instance field
    int b = 20;              // Instance field
    static int count = 0;    // Static field shared by the class
}

public class ClassAndObjectExample {
    public static void main(String[] args) {
        Hello h1 = new Hello();
        Hello h2 = new Hello();

        h1.a = 99;

        System.out.println(h1.a);
        System.out.println(h2.a);
        System.out.println(Hello.count);
    }
}
```

**Output:**

```text
99
10
0
```

The change to `h1.a` does not change `h2.a`, because each object has its own instance field. The static field `count` belongs to the class and is accessed here using `Hello.count`.

### Default values of reference fields

When a reference field is not explicitly initialized, Java initializes it to `null`. Primitive fields also receive default values, such as `0` for integer types and `false` for `boolean`.

However, local variables are different: Java does not automatically assign default values to local variables. A local reference variable must be assigned before it is read.

```java
class Example {
    String name; // Field defaults to null

    void printName() {
        System.out.println(name);
    }
}
```

The `name` field prints `null` if it has not been assigned another value.

## Common follow-ups & pitfalls

- **"Is a class the same as an object?"** No. A class defines a type; an object is an instance of that type.
- **"Is an object a blueprint of a class?"** No. The class is the blueprint, and an object is created from it.
- **"What is the difference between `class` and `java.lang.Class`?"** `class` is a Java keyword used to declare a class. `java.lang.Class` is an API type that represents runtime class metadata.
- **"What is the default value of a reference variable?"** Reference fields default to `null`. Local reference variables do not get a default value and must be assigned before use.
- **"Does every reference variable occupy 8 or 9 bytes?"** No fixed size is guaranteed by the Java language. Reference size depends on the JVM implementation and configuration.
- **"Do static variables get copied into every object?"** No. Static fields belong to the class and are shared rather than being a separate instance field in each object.
- **Pitfall:** A reference variable is not the object itself. It holds a reference to an object or `null`.
- **Pitfall:** Creating a reference variable alone does not create an object. The `new` expression creates the object in the example shown.
- **Pitfall:** Avoid assuming a specific physical memory layout from Java source code; JVM implementation details can vary.

## Key takeaways

- A class is a user-defined type that describes fields, methods, constructors, initializer blocks, and nested types.
- An object is an instance of a class, not the class's blueprint.
- A reference variable refers to an object or contains `null`.
- Instance fields belong to individual objects; static fields belong to the class.
- Reference fields default to `null`, but local variables must be assigned before use.
- Java does not specify a universal byte size for reference variables.
