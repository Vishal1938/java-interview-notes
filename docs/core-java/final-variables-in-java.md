---
title: "What is the `final` keyword in Java?"
sidebar_label: "`final` Variables"
sidebar_position: 3
description: Learn how final variables work in Java, when they must be initialized, and how instance and static final fields differ.
tags: [core-java, variables, final, beginner]
---

# What is the `final` keyword in Java?

> **Short answer:** The `final` keyword prevents a variable from being assigned a new value after it has been initialized. An instance `final` field can have a different value in each object if each constructor initializes it differently. A `static final` field belongs to the class and is initialized once for that class.

## Detailed explanation

### Declaring final variables

Use `final` when a variable should be assigned only once.

```java
final int ab = 20;
static final int ab1 = 20;
static final int AB = 30;
```

- `final int ab` is an instance field if declared directly in a class without `static`. Each object has its own field.
- `static final int ab1` and `static final int AB` are static fields. There is one class-level field, shared by instances of the class.
- By convention, constants declared `static final` are named using uppercase letters, with underscores between words when needed (for example, `MAX_RETRY_COUNT`). This is a Java naming convention, rather than a strict JLS requirement.
- A `final` variable must be definitely assigned before it is used. Fields do receive JVM default values when they are not initialized, but a blank `final` field must still be explicitly assigned by the program before construction or class initialization completes.

### Can we change the value of a final variable?

No. Once a `final` variable has been assigned, it cannot be assigned again. How and where it is initialized determines which values are possible.

- **Instance `final` field initialized at declaration:** The same specified initial value is used for every instance.
- **Instance `final` field initialized in a constructor:** Different objects can receive different values, but each object's field is assigned only once.
- **Static `final` field:** It is initialized once for the class, usually at its declaration or in a static initializer block. It cannot be assigned a new value afterward.
- **Final reference:** If a `final` variable refers to an object, the reference cannot be changed to point to a different object. The object's internal state may still be mutable.

### Is it necessary to initialize a final variable at declaration?

No. A blank `final` field can be initialized in a valid initialization location:

1. **At declaration:** Assign the value directly where the field is declared.
2. **Instance initializer block:** Initialize a blank instance `final` field in an instance initializer block.
3. **Constructor:** Initialize a blank instance `final` field in every constructor path that creates an object.
4. **Static initializer block:** Initialize a blank `static final` field in a static block.

A blank `final` local variable can also be assigned later in its local scope, provided it is assigned exactly once before it is read.

## Code example

```java title="FinalVariablesExample.java"
public class FinalVariablesExample {
    final int id;                    // Blank instance final field
    static final int MAX_LIMIT;      // Blank static final field

    static {
        MAX_LIMIT = 100;             // Initialized once when the class initializes
    }

    public FinalVariablesExample(int id) {
        this.id = id;                // Each object can receive a different id
    }

    public static void main(String[] args) {
        FinalVariablesExample first = new FinalVariablesExample(10);
        FinalVariablesExample second = new FinalVariablesExample(20);

        System.out.println("First ID: " + first.id);
        System.out.println("Second ID: " + second.id);
        System.out.println("Maximum limit: " + FinalVariablesExample.MAX_LIMIT);
    }
}
```

**Output:**

```text
First ID: 10
Second ID: 20
Maximum limit: 100
```

## Common follow-ups & pitfalls

- **"Can a final variable be changed?"** No. It cannot be reassigned after its one permitted assignment.
- **"Can two objects have different values for the same instance final field?"** Yes, if the field is initialized in the constructor or another valid per-instance initialization location.
- **"Does `static final` have to be written in uppercase?"** Uppercase names are the convention for constants, but the compiler does not require this naming style.
- **"Can a final object be modified?"** The reference cannot be reassigned, but the referenced object can still be mutable. For example, a `final List<String>` can still have items added to it.
- **Pitfall:** A blank `final` field must be initialized exactly once on every valid initialization path. Assigning it twice, or leaving it unassigned, causes a compile-time error.
- **Pitfall:** A `static final` primitive or `String` initialized with a compile-time constant expression may be treated as a compile-time constant by the compiler.

## Key takeaways

- `final` allows a variable to be assigned only once.
- Instance `final` fields can have different values in different objects when initialized per object.
- `static final` fields belong to the class and are initialized once.
- Blank `final` fields can be initialized in constructors or the appropriate initializer block.
- Uppercase naming for `static final` constants is a convention, not a JLS requirement.
