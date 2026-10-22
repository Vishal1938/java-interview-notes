---
title: What is the difference between an abstract class and an interface in Java?
sidebar_label: Abstract Class vs Interface
sidebar_position: 15
description: Understand the differences between abstract classes and interfaces in Java, including state, constructors, default methods, multiple inheritance, and when to use each.
tags: [core-java, oops, abstraction, abstract-class, interface, beginner]
---

# What is the difference between an abstract class and an interface in Java?

> **Short answer:** Both are used for abstraction and cannot be instantiated directly. An **abstract class** is a partially implemented class: it can have instance fields, constructors, and both abstract and concrete methods, but a class can extend only **one** class. An **interface** is a contract describing what a class can do: its fields are always constants, it has no constructors, and a class can implement **many** interfaces. Since Java 8, interfaces can also contain `default` and `static` methods, and since Java 9, `private` methods.

## Detailed explanation

### Abstract class

An abstract class is declared with the `abstract` keyword. It is meant to be extended, and it shares common state and behavior among closely related subclasses.

- It cannot be instantiated with `new`, but it can be used as a reference type.
- It can contain **abstract methods** (no body) and **concrete methods** (with a body). It can also have no abstract methods at all.
- It can have **instance fields** with any access modifier, and those fields can be non-final.
- It can have **constructors**. They run when a subclass object is created, through `super(...)`.
- It can have `static` methods, `final` methods, and initializer blocks.
- A concrete subclass must implement all inherited abstract methods; otherwise the subclass must also be declared `abstract`.
- A class can extend **only one** class, abstract or not.

### Interface

An interface is declared with the `interface` keyword. It defines a capability or contract that unrelated classes can share.

- It cannot be instantiated, but it can be used as a reference type.
- Methods without a body are implicitly `public abstract`.
- Fields are implicitly `public static final`, so they are constants and must be initialized.
- It cannot have constructors or instance fields, so it cannot hold per-object state.
- **Java 8+:** `default` methods provide a body that implementing classes inherit, and `static` methods belong to the interface itself.
- **Java 9+:** `private` methods (static or non-static) can share code between default methods.
- A class can **implement many interfaces**, and an interface can **extend many interfaces**.
- An interface with exactly one abstract method is a **functional interface** and can be implemented with a lambda expression.

### When to use which

- Use an **abstract class** when related classes share common fields, constructor logic, or protected helper methods, and there is a clear "is-a" relationship (for example, `Shape` → `Circle`, `Rectangle`).
- Use an **interface** when unrelated classes need to share a capability (for example, `Comparable`, `Runnable`, `AutoCloseable`), or when a class needs to support several types at once.
- They are often combined: an interface defines the contract, and an abstract class provides a partial, reusable implementation of it (for example, `List` and `AbstractList` in the Collections Framework).

### Side-by-side comparison

| Aspect | Abstract class | Interface |
| --- | --- | --- |
| Keyword | `abstract class`, used with `extends` | `interface`, used with `implements` |
| Multiple inheritance | A class can extend only one class | A class can implement many interfaces |
| Methods | Abstract and concrete methods | Abstract, `default`, `static` (Java 8+), and `private` (Java 9+) methods |
| Fields | Any kind: instance or static, final or not | Only `public static final` constants |
| Constructors | Yes | No |
| Access modifiers for members | `public`, `protected`, package-private, `private` | Members are `public` unless declared `private` (methods only) |
| State | Can hold per-object state | Cannot hold per-object state |
| Typical relationship | "is-a" among closely related classes | "can-do" capability shared by unrelated classes |

## Code example

```java title="AbstractVsInterfaceExample.java"
interface Drawable {
    int MAX_SIZE = 500;              // Implicitly public static final

    void draw();                     // Implicitly public abstract

    default void describe() {        // Java 8+: default method with a body
        System.out.println("Drawable with max size " + MAX_SIZE);
    }

    static void info() {             // Java 8+: static method, called on the interface
        System.out.println("Drawable interface");
    }
}

interface Resizable {
    void resize(double factor);
}

abstract class Shape {
    protected String name;           // Instance field: per-object state

    Shape(String name) {             // Abstract classes can have constructors
        this.name = name;
    }

    abstract double area();          // Subclasses must implement this

    void printArea() {               // Concrete method shared by all subclasses
        System.out.printf("%s area: %.2f%n", name, area());
    }
}

// Extends one class and implements many interfaces
class Circle extends Shape implements Drawable, Resizable {
    private double radius;

    Circle(double radius) {
        super("Circle");             // Calls the abstract class constructor
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public void draw() {             // Must be public: interface methods are public
        System.out.println("Drawing a circle of radius " + radius);
    }

    @Override
    public void resize(double factor) {
        radius *= factor;
    }
}

public class AbstractVsInterfaceExample {
    public static void main(String[] args) {
        // Shape shape = new Shape("x"); // Compile-time error: Shape is abstract
        // Drawable d = new Drawable();  // Compile-time error: Drawable is an interface

        Circle circle = new Circle(2);
        circle.printArea();
        circle.draw();
        circle.describe();
        Drawable.info();

        Resizable resizable = circle;    // Interface reference to the same object
        resizable.resize(2);
        circle.printArea();
    }
}
```

**Output:**

```text
Circle area: 12.57
Drawing a circle of radius 2.0
Drawable with max size 500
Drawable interface
Circle area: 50.27
```

## Common follow-ups & pitfalls

- **"Can an abstract class have a constructor if it cannot be instantiated?"** Yes. The constructor runs when a subclass object is created, and it is used to initialize the abstract class's fields.
- **"Can an abstract class have no abstract methods?"** Yes. Declaring it `abstract` simply prevents it from being instantiated directly.
- **"Can an interface have a constructor?"** No. An interface has no instance state to initialize.
- **"Can an abstract method be `final`, `static`, or `private`?"** No. An abstract method must be overridden, and `final`, `static`, and `private` methods cannot be overridden.
- **"Why did Java 8 add default methods?"** To let interfaces gain new methods (such as `forEach` on `Iterable` and `stream` on `Collection`) without breaking every existing class that implements them.
- **"What if a class implements two interfaces with the same default method?"** The code does not compile until the class overrides that method. Inside the override, it can call a specific version with `InterfaceName.super.methodName()`.
- **"Is an interface 100% abstract?"** It was before Java 8. Since Java 8, interfaces can contain `default` and `static` methods with bodies, so this phrase is outdated.
- **Pitfall:** When implementing an interface method, the method must be `public`. Leaving out `public` reduces visibility and causes a compile-time error.
- **Pitfall:** Interface constants are shared `static` values, not per-object fields. Do not use interfaces only to hold constants (the "constant interface" anti-pattern); use a final class or an `enum` instead.

## Key takeaways

- Both abstract classes and interfaces support abstraction and cannot be instantiated directly.
- An abstract class can hold state, constructors, and members with any access modifier, but a class can extend only one class.
- An interface defines a contract with constants and methods; a class can implement many interfaces.
- Since Java 8, interfaces can have `default` and `static` methods, and since Java 9, `private` methods.
- Prefer an abstract class for shared state and code among related classes, and an interface for capabilities shared across unrelated classes.
