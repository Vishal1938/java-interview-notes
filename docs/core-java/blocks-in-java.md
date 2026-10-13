---
title: What are blocks in Java?
sidebar_label: Blocks in Java
sidebar_position: 9
description: Understand Java blocks, including instance initializer blocks, static initializer blocks, local blocks, execution order, and common interview questions.
tags: [core-java, blocks, initialization, static, beginner]
---

# What are blocks in Java?

> **Short answer:** A block in Java is a group of statements enclosed in curly braces `{}`. Depending on where it is declared, a block can define a local scope, initialize instance fields, or initialize static fields when a class is initialized.

## Detailed explanation

### What is a block?

A **block** is a sequence of zero or more statements enclosed in curly braces.

```java
{
    int number = 10;
    System.out.println(number);
}
```

A block can be used inside methods, constructors, conditional statements, loops, and other places where Java permits a block. Variables declared inside a block are local to that block and cannot be accessed by name outside it.

Java classes can also contain initializer blocks directly in the class body. These are commonly divided into instance initializer blocks and static initializer blocks.

### Types of blocks in Java

Common block categories discussed in Java are:

- **Local block:** A block declared inside a method or another block.
- **Instance initializer block:** A block in a class body without `static`, used to initialize instance state.
- **Static initializer block:** A block in a class body with the `static` keyword, used to initialize class-level state.

Method and constructor bodies are also blocks syntactically, but this document focuses on the three categories above.

### 1. Local block

A local block is declared inside a method or another block. It creates a scope for local variables declared within it.

```java title="LocalBlockExample.java"
public class LocalBlockExample {
    public static void main(String[] args) {
        System.out.println("Before block");

        {
            int number = 10;
            System.out.println("Inside block: " + number);
        }

        System.out.println("After block");
        // System.out.println(number); // Compile-time error: number is out of scope
    }
}
```

**Output:**

```text
Before block
Inside block: 10
After block
```

The variable `number` can be used only inside the block where it is declared. Once execution leaves the block, it is out of scope and cannot be referenced by name.

### 2. Instance initializer block

An **instance initializer block** is a block declared directly inside a class body without the `static` keyword. It runs each time an object is created, as part of instance initialization.

- It runs for every object created through the class's constructors.
- Instance field initializers and instance initializer blocks execute in their textual order, subject to constructor chaining.
- For a constructor that invokes another constructor using `this(...)`, instance initialization is performed as part of the ultimately invoked constructor's initialization sequence, not repeatedly for every constructor in the chain.
- After instance field initializers and instance initializer blocks have run, the constructor body executes.

#### Example

```java title="InstanceBlockExample.java"
public class InstanceBlockExample {
    int value;

    {
        value = 10;
        System.out.println("Instance initializer block");
    }

    InstanceBlockExample() {
        System.out.println("Constructor");
    }

    public static void main(String[] args) {
        new InstanceBlockExample();
        new InstanceBlockExample();
    }
}
```

**Output:**

```text
Instance initializer block
Constructor
Instance initializer block
Constructor
```

The block runs once for each object created, before the constructor body for that object.

### 3. Static initializer block

A **static initializer block** is declared directly inside a class body using the `static` keyword. It is used to initialize static state or run setup logic when the class is initialized.

- It runs when the class is initialized, not once for every object.
- Static field initializers and static initializer blocks run in textual order.
- It can directly access static members, but it cannot use `this` or directly access instance fields because no particular object is available.
- A class is initialized once for a given runtime class definition, even if many objects of that class are created.

#### Example

```java title="StaticBlockExample.java"
public class StaticBlockExample {
    static int value;

    static {
        value = 100;
        System.out.println("Static initializer block");
    }

    StaticBlockExample() {
        System.out.println("Constructor");
    }

    public static void main(String[] args) {
        new StaticBlockExample();
        new StaticBlockExample();
    }
}
```

**Output:**

```text
Static initializer block
Constructor
Constructor
```

The static initializer block runs once when `StaticBlockExample` is initialized. The constructor runs for each object created.

### Execution order: static block, instance block, and constructor

For a straightforward class, the relevant order is:

1. Static field initializers and static initializer blocks execute in textual order when the class is initialized.
2. When an object is created, the superclass construction and initialization process occurs first.
3. The subclass's instance field initializers and instance initializer blocks execute in textual order.
4. The constructor body executes.

The complete constructor order can involve superclass constructors and constructor chaining, so the example below keeps the class simple.

```java title="BlockExecutionOrderExample.java"
public class BlockExecutionOrderExample {
    static {
        System.out.println("Static block");
    }

    {
        System.out.println("Instance block");
    }

    BlockExecutionOrderExample() {
        System.out.println("Constructor");
    }

    public static void main(String[] args) {
        new BlockExecutionOrderExample();
        new BlockExecutionOrderExample();
    }
}
```

**Output:**

```text
Static block
Instance block
Constructor
Instance block
Constructor
```

The static block runs once for class initialization. The instance block and constructor body run for each new object.

### Initializing blank `final` fields with blocks

Initializer blocks can be used to assign blank `final` fields, as long as Java's definite-assignment rules are satisfied.

- A blank instance `final` field may be initialized in an instance initializer block or a constructor.
- A blank `static final` field may be initialized in a static initializer block.
- A `final` field must not be assigned more than once along a valid initialization path.

```java title="FinalFieldBlockExample.java"
public class FinalFieldBlockExample {
    final int id;
    static final int MAX_VALUE;

    {
        id = 10;
    }

    static {
        MAX_VALUE = 100;
    }

    public static void main(String[] args) {
        FinalFieldBlockExample example = new FinalFieldBlockExample();

        System.out.println(example.id);
        System.out.println(FinalFieldBlockExample.MAX_VALUE);
    }
}
```

**Output:**

```text
10
100
```

The instance initializer assigns `id` for each object, while the static initializer assigns `MAX_VALUE` during class initialization.

## Common follow-ups & pitfalls

- **"What is a block in Java?"** A block is a group of statements enclosed in `{}`.
- **"How many times does an instance initializer block run?"** It runs for each object created, as part of instance initialization.
- **"How many times does a static initializer block run?"** It runs once per runtime class initialization for a given class definition.
- **"Which runs first: an instance block or a constructor?"** Instance field initializers and instance initializer blocks run before the constructor body.
- **"Can a static block access instance variables directly?"** No. It has no current object, so instance fields require an object reference.
- **"Can blocks be used to initialize `final` fields?"** Yes. Instance initializer blocks can initialize blank instance `final` fields, and static initializer blocks can initialize blank `static final` fields, subject to definite-assignment rules.
- **Pitfall:** A local variable declared inside a block cannot be accessed outside that block.
- **Pitfall:** Static field initializers and static initializer blocks execute in textual order; changing their order can change the result.
- **Pitfall:** A static block does not run for each object. It runs as part of class initialization.

## Key takeaways

- A block is a group of statements enclosed in curly braces.
- Local blocks define variable scope.
- Instance initializer blocks run as part of each object's initialization.
- Static initializer blocks run once when the class is initialized.
- Instance initializers run before the constructor body, while static initialization occurs at class initialization time.
- Blocks can initialize blank `final` fields when Java's definite-assignment rules are satisfied.
