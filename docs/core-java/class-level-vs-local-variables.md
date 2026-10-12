---
title: What is the difference between class-level and local variables in Java?
sidebar_label: Class-level vs Local Variables
sidebar_position: 2
description: Understand where class-level and local variables are declared, how they are initialized, their scope, and how name shadowing works in Java.
tags: [core-java, variables, beginner]
---

# What is the difference between class-level and local variables in Java?

> **Short answer:** Class-level variables are declared directly inside a class, but outside methods, constructors, and blocks. They are initialized with default values by the JVM if no initial value is provided. Local variables are declared inside a method, constructor, or block, and they must be assigned a value before they are used.

## Detailed explanation

### Class-level variables

A class-level variable is declared directly inside a class, but outside any method, constructor, or block. It can be accessed from different parts of the class, subject to its access modifier and whether it is declared as `static` or an instance field.

- A class-level variable is also commonly called a **field** or **member variable**.
- If no initial value is assigned, Java gives the field a default value based on its data type.
- Two fields declared in the same class cannot have the same name in the same declaration scope.
- A `static` field belongs to the class, while a non-static field belongs to each object created from the class.

### Local variables

A local variable is declared inside a method, constructor, or block, such as an `if` statement or loop.

- A local variable is accessible only within the scope in which it is declared.
- A local variable must be definitely assigned before it is read. Java does **not** automatically assign default values to local variables.
- Its scope is limited to the relevant block or method. Once execution leaves that scope, the variable can no longer be accessed by name from outside it.
- Local variables are useful for values needed temporarily while a particular method or block executes.

### Class-level variables and local variables with the same name

Java allows a local variable to have the same name as a class-level field. In that case, the local variable **shadows** the field within its scope.

- When the name is used directly in that local scope, it refers to the local variable.
- Use the `this` keyword to refer to the current object's instance field when a local variable has the same name.
- `this` cannot be used in a static context. To access a static field, use the class name (for example, `VariableScopeExample.count`) or another valid static reference.

## Code example

```java title="VariableScopeExample.java"
public class VariableScopeExample {
    int number = 10;          // Instance field: default would be 0 if not initialized
    static String message;    // Static field: defaults to null

    public void showVariables() {
        int number = 20;      // Local variable shadows the instance field

        System.out.println("Local number: " + number);
        System.out.println("Instance field number: " + this.number);
        System.out.println("Static field message: " + VariableScopeExample.message);
    }

    public static void main(String[] args) {
        VariableScopeExample example = new VariableScopeExample();
        example.showVariables();
    }
}
```

**Output:**

```text
Local number: 20
Instance field number: 10
Static field message: null
```

## Common follow-ups & pitfalls

- **"Are local variables assigned default values?"** No. Local variables must be assigned before they are used, or the code will fail to compile.
- **"Do class-level variables always need an initial value?"** No. Fields receive default values automatically: numeric primitive types default to `0` (or `0.0` for floating-point types), `boolean` defaults to `false`, `char` defaults to the null character (`'\\u0000'`), and reference types default to `null`.
- **"Can a local variable and a field have the same name?"** Yes. The local variable shadows the field in its scope. Use `this.fieldName` to access the instance field.
- **Pitfall:** `this` refers to the current object, so it cannot be used from a static method.
- **Pitfall:** A field's accessibility also depends on its access modifier (`private`, `protected`, `public`, or package-private); being declared at class level does not automatically make it accessible everywhere in the application.

## Key takeaways

- Class-level variables are declared directly inside a class, outside methods, constructors, and blocks.
- Fields receive default values when no initializer is supplied; local variables do not.
- Local variables can be used only within their declared scope and must be assigned before use.
- A local variable can shadow a field with the same name; use `this.fieldName` to refer to the instance field.
