---
title: What is a marker interface in Java?
sidebar_label: Marker Interface
sidebar_position: 16
description: Understand what a marker interface is in Java, how Serializable and Cloneable work as markers, how to create a custom marker interface, and how markers compare with annotations.
tags: [core-java, oops, interface, marker-interface, serialization, beginner]
---

# What is a marker interface in Java?

> **Short answer:** A marker interface is an interface with **no methods and no fields**. A class implements it only to "tag" itself, signalling that it has a certain property or is allowed a certain operation. Code such as the JVM, the standard library, or your own framework checks for the tag, usually with `instanceof`, and changes its behavior. Common examples are `Serializable`, `Cloneable`, and `RandomAccess`.

## Detailed explanation

### What makes an interface a marker

A marker interface (also called a **tagging interface**) is simply an empty interface:

```java
public interface Serializable {
}
```

- It declares no methods, so implementing it requires no extra code.
- Implementing it makes the class a subtype of the marker, so `obj instanceof Serializable` is `true` for its objects.
- The marker itself does nothing. The behavior comes from the code that **checks** for it.
- Because it is inherited, every subclass of a class that implements a marker is also marked.

### Built-in marker interfaces

| Marker interface | Package | What checks it | Effect |
| --- | --- | --- | --- |
| `Serializable` | `java.io` | `ObjectOutputStream` | Objects can be serialized; otherwise `NotSerializableException` is thrown |
| `Cloneable` | `java.lang` | `Object.clone()` | `clone()` makes a field-by-field copy; otherwise `CloneNotSupportedException` is thrown |
| `RandomAccess` | `java.util` | Collections algorithms such as `Collections.binarySearch` | Lists that support fast index access (like `ArrayList`) can use index-based algorithms |
| `Remote` | `java.rmi` | Java RMI | Methods of the interface can be called from another JVM |

### Creating a custom marker interface

You can create your own marker interface and check for it in your code:

1. Declare an empty interface, for example `interface Auditable {}`.
2. Implement it in the classes that should be tagged.
3. Check `instanceof Auditable` where the special behavior is needed.

### Marker interface vs marker annotation

Since Java 5, annotations can also mark classes (for example, `@FunctionalInterface` or a custom `@Auditable`). Each approach has advantages:

| Aspect | Marker interface | Marker annotation |
| --- | --- | --- |
| Defines a type | Yes, can be used as a parameter or variable type | No |
| Compile-time checking | Possible, by accepting the marker as a parameter type | Only with an annotation processor |
| Checked at runtime with | `instanceof` | Reflection, such as `isAnnotationPresent()` |
| Inherited by subclasses | Always | Only if the annotation is `@Inherited`, and only for classes |
| Can mark | Classes and interfaces | Classes, methods, fields, parameters, and more |
| Can carry extra data | No | Yes, through annotation elements |

A common rule of thumb (from *Effective Java*): use a marker **interface** when you want a type that methods can accept, so mistakes are caught at compile time. Use a marker **annotation** when you need to mark elements other than classes, or when the marker is part of a framework that already relies on annotations.

## Code example

```java title="MarkerInterfaceExample.java"
// Custom marker interface: no methods, no fields
interface Auditable {
}

class Order implements Auditable {
    String id;

    Order(String id) {
        this.id = id;
    }
}

class Product {
    String name;

    Product(String name) {
        this.name = name;
    }
}

// Built-in marker: Cloneable allows Object.clone() to copy the object
class Point implements Cloneable {
    int x;
    int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public Point clone() throws CloneNotSupportedException {
        return (Point) super.clone();
    }
}

class Person {
    String name = "Asha";

    @Override
    public Person clone() throws CloneNotSupportedException {
        return (Person) super.clone(); // Fails: Person is not Cloneable
    }
}

public class MarkerInterfaceExample {
    static void save(Object entity) {
        if (entity instanceof Auditable) {   // Behavior depends on the marker
            System.out.println("Audit log written for " + entity.getClass().getSimpleName());
        }
        System.out.println("Saved " + entity.getClass().getSimpleName());
    }

    public static void main(String[] args) {
        save(new Order("A-101"));
        save(new Product("Laptop"));

        try {
            Point copy = new Point(3, 4).clone();
            System.out.println("Cloned point: (" + copy.x + ", " + copy.y + ")");

            new Person().clone();
        } catch (CloneNotSupportedException e) {
            System.out.println("CloneNotSupportedException: " + e.getMessage());
        }
    }
}
```

**Output:**

```text
Audit log written for Order
Saved Order
Saved Product
Cloned point: (3, 4)
CloneNotSupportedException: Person
```

`Point` and `Person` both override `clone()` the same way, but only `Point` implements `Cloneable`, so `Object.clone()` refuses to copy `Person`.

## Common follow-ups & pitfalls

- **"Name some marker interfaces in Java."** `Serializable`, `Cloneable`, `RandomAccess`, and `Remote`.
- **"If a marker interface has no methods, how does it work?"** The marker only adds a type. Other code checks that type with `instanceof` and behaves differently, for example `Object.clone()` checks for `Cloneable`.
- **"Can we create our own marker interface?"** Yes. Declare an empty interface, implement it, and check for it with `instanceof`.
- **"Is `Runnable` or `Comparable` a marker interface?"** No. They declare methods (`run()` and `compareTo()`), so they are regular interfaces. A functional interface has exactly one abstract method, so it is not a marker either.
- **"Are marker interfaces still needed now that we have annotations?"** Both are used. Annotations are more flexible, but a marker interface defines a type that the compiler can check.
- **Pitfall:** Implementing `Cloneable` does not make `clone()` public. `Object.clone()` is `protected`, so a class must still override it to expose cloning.
- **Pitfall:** `Object.clone()` makes a **shallow copy**. Fields that refer to mutable objects are shared between the original and the copy unless you copy them yourself.
- **Pitfall:** Because markers are inherited, a subclass cannot "un-implement" `Serializable` or `Cloneable`. A subclass that must not be serialized or cloned has to throw an exception from the relevant method instead.

## Key takeaways

- A marker interface has no methods or fields; it only tags a class with a type.
- The behavior comes from code that checks the marker, typically with `instanceof`.
- `Serializable`, `Cloneable`, `RandomAccess`, and `Remote` are standard marker interfaces.
- You can create custom marker interfaces for your own checks.
- Marker annotations are an alternative; prefer a marker interface when you want compile-time type checking.
