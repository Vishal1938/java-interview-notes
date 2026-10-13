---
title: What is the difference between instance and static variables in Java?
sidebar_label: Instance vs Static Variables
sidebar_position: 8
description: Learn Java instance and static variables, their lifecycle, access rules, final fields, and class loading and initialization.
tags: [core-java, variables, static, instance-variables, beginner]
---

# What is the difference between instance and static variables in Java?

> **Short answer:** Instance variables are declared in a class without `static` and each object has its own copy. Static variables are declared with `static` and belong to the class, so they are shared by its instances.

## Detailed explanation

### What is a variable?

A variable is a named storage location associated with a type. Its value may change during program execution unless it is declared `final` or other language rules prevent reassignment.

Java variables are commonly grouped into:

- **Instance variables:** Non-static fields declared in a class. Each object has its own instance state.
- **Static variables:** Fields declared with `static`. They belong to the class rather than to individual objects.
- **Local variables:** Variables declared inside a method, constructor, or block.
- **Parameters:** Variables declared in a method or constructor parameter list.

This document focuses on instance and static variables.

### 1. Instance variables

An **instance variable** is a field declared inside a class without the `static` keyword.

- Each object has its own logical copy of the instance field.
- Instance fields are initialized as part of object creation.
- If no initializer is provided, an instance field receives its type's default value.
- An instance field cannot be accessed directly from a static context because a static context does not automatically have a current object. An object reference is needed to access a particular instance field.

Example:

```java
class Hello {
    int a = 10; // Instance variable
}

Hello h1 = new Hello();
Hello h2 = new Hello();

h1.a = 100;

System.out.println(h1.a);
System.out.println(h2.a);
```

**Output:**

```text
100
10
```

Changing `h1.a` does not change `h2.a`, because the two objects have separate instance state.

### 2. Static variables

A **static variable** is a field declared inside a class with the `static` keyword.

- A static field belongs to the class and is shared by instances of that class.
- Static fields are initialized as part of class initialization.
- If no initializer is provided, a static field receives its type's default value.
- A static field can be accessed from static and instance methods.
- Prefer accessing static fields through the class name, such as `Hello.count`, because it makes their class-level ownership clear.

Example:

```java
class Hello {
    static int count = 0;
}

Hello.count++;
System.out.println(Hello.count);
```

**Output:**

```text
1
```

Static fields are associated with the class, not with a particular object.

### Instance variables vs. static variables

| Instance variable | Static variable |
|---|---|
| Declared in a class without `static`. | Declared in a class with `static`. |
| Each object has its own instance state. | One class-level field is shared by instances of that class. |
| Initialized during object construction/initialization. | Initialized during class initialization. |
| Needs an object reference to access a particular instance's field. | Can be accessed from static or instance contexts; class-name access is preferred. |
| Cannot be accessed directly from a static context without an object. | Can be accessed from static methods and instance methods. |
| Can be declared `final`. | Can be declared `final`, often as `static final` for constants. |

### Can a static variable be accessed through a reference that is `null`?

A static field can be accessed using an expression whose type is the class, even if the expression evaluates to `null`, but this is confusing and should be avoided. Java resolves a static field access by the field's declaring type; it does not dereference the object reference.

```java
class Hello {
    static int count = 5;
}

public class StaticAccessExample {
    public static void main(String[] args) {
        Hello h = null;

        System.out.println(h.count);       // Compiles, but avoid this style
        System.out.println(Hello.count);   // Preferred style
    }
}
```

**Output:**

```text
5
5
```

Use `Hello.count` to make it clear that `count` is static. By contrast, accessing an instance field through a `null` reference causes a `NullPointerException`.

### Can instance and static variables be declared `final`?

Yes. Both instance fields and static fields can be declared `final`.

```java
class Example {
    final int id = 10;                 // Final instance field
    static final int MAX_COUNT = 100;  // Final static field
}
```

A `final` field can be assigned only once, following Java's definite-assignment rules. A blank instance `final` field can be assigned in an instance initializer or constructor; a blank `static final` field can be assigned in a static initializer block.

### Can instance and static variables be declared inside a local context?

No. Instance and static variables are fields declared in a class body, not local variables declared inside a method or block. A method can declare local variables, but it cannot declare an instance or static field inside its body.

## When can a class be loaded or initialized?

The JVM uses class loading and class initialization as distinct stages. A class is loaded when the JVM needs its definition, and it is initialized when its static initialization process runs.

Common situations that can cause a class to be loaded include:

- The JVM needs to create an instance of the class, for example through `new Hello()`.
- A static field declared by the class is accessed in a way that requires initialization, or a static method declared by the class is invoked.
- A subclass is initialized, which requires its superclass to be initialized first.
- The class is explicitly requested through APIs such as `Class.forName(...)` (the common one-argument overload also initializes the class).
- A class loader is explicitly asked to load a class, for example through `ClassLoader.loadClass(...)`; loading alone does not necessarily initialize it.

These are common triggers rather than an exhaustive list of every JVM loading mechanism. The Java Virtual Machine Specification defines the precise rules for loading, linking, and initialization.

### How many times can a class be loaded?

A class is identified at runtime by its **binary name and defining class loader**. Within a given defining class loader, a class with a given binary name is normally loaded once. Different class loaders can load separate classes with the same binary name, producing distinct runtime types.

Therefore, “a class can only be loaded once” is generally true for a particular class definition under one defining class loader, but the same binary name can be loaded by different class loaders.

## Code example

```java title="InstanceAndStaticVariablesExample.java"
class Counter {
    int instanceCount = 0;
    static int totalCount = 0;

    Counter() {
        instanceCount++;
        totalCount++;
    }
}

public class InstanceAndStaticVariablesExample {
    public static void main(String[] args) {
        Counter first = new Counter();
        Counter second = new Counter();

        System.out.println("First instance count: " + first.instanceCount);
        System.out.println("Second instance count: " + second.instanceCount);
        System.out.println("Total count: " + Counter.totalCount);
    }
}
```

**Output:**

```text
First instance count: 1
Second instance count: 1
Total count: 2
```

Each `Counter` object starts with its own `instanceCount` value of `0`, which is incremented in its constructor. The shared `totalCount` field increments for every created object.

## Common follow-ups & pitfalls

- **"When is an instance variable initialized?"** Its storage is part of the new object's instance state, and field initializers and instance initializer blocks run during object construction before the constructor body.
- **"When is a static variable initialized?"** Static fields are set to default values during class preparation and their initializers run as part of class initialization.
- **"Can a static method access an instance variable directly?"** No. It needs an object reference to identify which instance's field should be used.
- **"Can I access a static variable using an object reference?"** Yes, Java permits it, including a reference whose value is `null`, but using the class name is clearer and recommended.
- **"Can both types be `final`?"** Yes. Instance `final` fields can vary between objects if initialized per object; `static final` fields are shared and commonly used for constants.
- **"Can a class be loaded more than once?"** Separate defining class loaders can load separate class definitions with the same binary name. Class identity includes the defining class loader.
- **Pitfall:** Do not assume static fields are copied into every object.
- **Pitfall:** Do not confuse class loading with class initialization; they are separate JVM stages.
- **Pitfall:** A local reference variable is not automatically initialized to `null`. The default value `null` applies to reference fields and array elements, not local variables.

## Key takeaways

- Instance variables are non-static fields with per-object state.
- Static variables are class-level fields shared by instances.
- Instance fields are initialized as part of object creation; static field initializers run during class initialization.
- Both instance and static fields can be declared `final`.
- Prefer `ClassName.staticField` when accessing static fields.
- Class loading and initialization are different stages, and class identity depends on the defining class loader.
