---
title: What is the difference between `this` and `super` in Java?
sidebar_label: `this` vs `super`
sidebar_position: 12
description: Understand Java's this and super keywords, field and method access, constructor chaining, inheritance, and cyclic constructor invocation.
tags: [core-java, this, super, constructors, inheritance, beginner]
---

# What is the difference between `this` and `super` in Java?

> **Short answer:** `this` refers to the current object, while `super` is used to access superclass members or invoke a superclass constructor. Both are commonly used with inheritance and constructors, but they serve different purposes.

## Detailed explanation

### What is `this` in Java?

The `this` keyword refers to the current object whose instance method or constructor is executing.

Common uses of `this` include:

- Distinguishing an instance field from a parameter or local variable with the same name.
- Calling another instance method on the current object.
- Passing the current object as an argument.
- Returning the current object from a method.
- Calling another constructor in the same class using `this(...)`.

#### 1. Accessing instance fields using `this`

When a constructor parameter or local variable has the same name as an instance field, the local name takes precedence within its scope. Use `this.fieldName` to refer to the instance field.

```java title="ThisFieldExample.java"
class Student {
    int id;
    String name;

    Student(int id, String name) {
        this.id = id;
        this.name = name;
    }

    void display() {
        System.out.println(this.id + " " + this.name);
    }
}

public class ThisFieldExample {
    public static void main(String[] args) {
        Student student = new Student(101, "Asha");
        student.display();
    }
}
```

**Output:**

```text
101 Asha
```

Here, `this.id` and `this.name` refer to the object's fields, while `id` and `name` on the right side refer to constructor parameters.

#### 2. Calling an instance method using `this`

You can use `this.methodName()` to make it explicit that an instance method on the current object is being called.

```java
class Example {
    void first() {
        System.out.println("First method");
    }

    void second() {
        this.first();
        System.out.println("Second method");
    }
}
```

Calling `new Example().second()` prints:

```text
First method
Second method
```

Writing `first()` without `this` would also work here.

#### 3. Passing `this` as an argument

The current object can be passed to another method or constructor.

```java
class Printer {
    void print(Printer printer) {
        System.out.println(printer != null);
    }

    void sendSelf() {
        print(this);
    }
}
```

Calling `new Printer().sendSelf()` prints `true`.

#### 4. Returning `this`

Returning `this` can support method chaining.

```java
class Builder {
    private String name;

    Builder setName(String name) {
        this.name = name;
        return this;
    }

    void show() {
        System.out.println(name);
    }
}
```

Usage:

```java
new Builder().setName("Java").show();
```

Output:

```text
Java
```

#### 5. Calling another constructor using `this()`

`this(...)` invokes another constructor in the same class. In traditional Java constructor syntax, it must be the first statement in the constructor body.

```java title="ThisConstructorExample.java"
class Employee {
    int id;
    String name;

    Employee() {
        this(0, "Unknown");
    }

    Employee(int id, String name) {
        this.id = id;
        this.name = name;
    }
}
```

`new Employee()` delegates to the two-parameter constructor.

**Important:** A constructor cannot use `this(...)` to invoke itself directly or indirectly. Such a cycle causes a compile-time error.

### What is `super` in Java?

The `super` keyword is used in a subclass to refer to superclass members and to invoke a superclass constructor.

Common uses include:

- Accessing a superclass field hidden by a field in the subclass.
- Calling a superclass method overridden by the subclass.
- Invoking a superclass constructor using `super(...)`.

#### 1. Accessing a superclass field using `super`

If a subclass declares a field with the same name as an accessible superclass field, the subclass field hides the superclass field. Use `super.fieldName` to refer to the superclass field.

```java title="SuperFieldExample.java"
class Parent {
    int value = 10;
}

class Child extends Parent {
    int value = 20;

    void display() {
        System.out.println(value);
        System.out.println(this.value);
        System.out.println(super.value);
    }
}

public class SuperFieldExample {
    public static void main(String[] args) {
        new Child().display();
    }
}
```

**Output:**

```text
20
20
10
```

- `value` and `this.value` refer to the field declared in `Child`.
- `super.value` refers to the accessible field declared in `Parent`.

#### 2. Calling an overridden superclass method using `super`

If a subclass overrides an instance method, it can call the superclass implementation with `super.methodName()`.

```java title="SuperMethodExample.java"
class Parent {
    void show() {
        System.out.println("Parent show()");
    }
}

class Child extends Parent {
    @Override
    void show() {
        System.out.println("Child show()");
        super.show();
    }
}

public class SuperMethodExample {
    public static void main(String[] args) {
        new Child().show();
    }
}
```

**Output:**

```text
Child show()
Parent show()
```

`super.show()` invokes the superclass implementation. It does not perform ordinary virtual dispatch back to the overriding method in `Child`.

#### 3. Calling a superclass constructor using `super()`

A subclass constructor can invoke a superclass constructor using `super(...)`. In traditional constructor syntax, this invocation must be the first statement unless a `this(...)` constructor invocation is used instead.

```java title="SuperConstructorExample.java"
class Parent {
    Parent(String message) {
        System.out.println("Parent: " + message);
    }
}

class Child extends Parent {
    Child() {
        super("Initialized first");
        System.out.println("Child constructor");
    }
}

public class SuperConstructorExample {
    public static void main(String[] args) {
        new Child();
    }
}
```

**Output:**

```text
Parent: Initialized first
Child constructor
```

If no explicit `this(...)` or `super(...)` constructor invocation is written, Java normally inserts an implicit no-argument `super()` call. This fails to compile if the superclass has no accessible no-argument constructor. Modern Java also permits certain restricted constructor prologues before an explicit constructor invocation, but the traditional rule is the most common interview expectation.

## `this` vs. `super`

| `this` | `super` |
|---|---|
| Refers to the current object. | Refers to the superclass portion/member lookup of the current object. |
| `this.field` accesses the current class's instance field when applicable. | `super.field` accesses an accessible superclass field hidden by a subclass field. |
| `this.method()` calls an instance method on the current object. | `super.method()` calls the superclass implementation of an instance method. |
| `this(...)` calls another constructor in the same class. | `super(...)` calls a constructor of the direct superclass. |
| Can be used to pass or return the current object. | Is not a standalone object reference that can be returned or passed like `this`. |
| Cannot be used in a static context to refer to a current object. | Cannot be used in a static context to refer to superclass instance members. |

## Constructor chaining scenarios

### Scenario 1: Using `this()` to reuse constructor logic

```java
class Demo {
    Demo() {
        this(10);
        System.out.println("No-argument constructor");
    }

    Demo(int number) {
        System.out.println("Parameterized constructor: " + number);
    }
}
```

For `new Demo()`, the output is:

```text
Parameterized constructor: 10
No-argument constructor
```

The target constructor runs first, then execution continues in the constructor that called it.

### Scenario 2: Using `super()` with inheritance

```java
class A {
    A() {
        System.out.println("A constructor");
    }
}

class B extends A {
    B() {
        super();
        System.out.println("B constructor");
    }
}
```

For `new B()`, the output is:

```text
A constructor
B constructor
```

The superclass constructor runs before the subclass constructor body.

### Scenario 3: Combining `this()` and `super()` indirectly

A constructor cannot directly invoke both `this(...)` and `super(...)` as separate constructor invocations. Instead, it can delegate with `this(...)`, and the constructor it delegates to can invoke `super(...)`.

```java
class Parent {
    Parent(int value) {
        System.out.println("Parent: " + value);
    }
}

class Child extends Parent {
    Child() {
        this(5);
        System.out.println("Child no-argument constructor");
    }

    Child(int value) {
        super(value);
        System.out.println("Child parameterized constructor");
    }
}
```

For `new Child()`, the output is:

```text
Parent: 5
Child parameterized constructor
Child no-argument constructor
```

The call chain is `Child()` → `Child(int)` → `Parent(int)`. Initialization moves through the superclass constructor first, then returns through the constructor bodies.

## Cyclic constructor invocation

**Cyclic constructor invocation** happens when constructors in the same class call one another through `this(...)` in a cycle. Java rejects this at compile time.

### Scenario 1: Direct cyclic invocation

```java
class Demo {
    Demo() {
        this();
    }
}
```

This does **not compile** because the no-argument constructor calls itself.

### Scenario 2: Indirect cyclic invocation

```java
class Demo {
    Demo() {
        this(10);
    }

    Demo(int value) {
        this();
    }
}
```

This does **not compile** because `Demo()` calls `Demo(int)`, and `Demo(int)` calls `Demo()` again.

The cycle is:

`Demo()` → `Demo(int)` → `Demo()` → ...

The compiler reports a recursive constructor invocation error.

### Scenario 3: A valid constructor chain

```java
class Demo {
    Demo() {
        this(10);
    }

    Demo(int value) {
        System.out.println("Value: " + value);
    }
}
```

Output from `new Demo()`:

```text
Value: 10
```

This is valid because the constructor chain eventually reaches a constructor that does not delegate back to an earlier constructor.

### Can `super()` cause cyclic constructor invocation?

The compiler's specific **recursive constructor invocation** rule concerns cycles in same-class constructor delegation through `this(...)`. A superclass constructor may invoke a subclass method through dynamic dispatch, but that is a different issue and can expose partially initialized subclass state. Constructor design should avoid calling overridable methods when subclass initialization is incomplete.

## Common follow-ups & pitfalls

- **"Can we use `this` in a static method?"** No. A static method has no current object.
- **"Can we use `super` in a static method?"** No, not to access superclass instance members or invoke a superclass constructor.
- **"Can `this()` and `super()` both be written in one constructor?"** Not as two direct constructor invocations. Use `this(...)` to delegate to another constructor, which can then call `super(...)`.
- **"What happens if we do not write `super()`?"** Java normally inserts an implicit no-argument superclass constructor call, if that constructor is accessible.
- **"Can `super` access a private superclass field?"** No. `super` does not bypass access control.
- **"Can `super()` call a grandparent constructor directly?"** No. A constructor directly invokes a constructor of its direct superclass. The superclass chain handles its own parent.
- **"Can `this()` be placed after a print statement?"** Under traditional Java constructor syntax, no; it must be the first statement. Newer Java versions permit restricted statements before an explicit constructor invocation, but ordinary statements such as `System.out.println(...)` are not permitted there.
- **"What is cyclic constructor invocation?"** A compile-time error caused by constructors delegating through `this(...)` in a cycle.
- **Pitfall:** `this.field` and `super.field` are useful when names are hidden, but fields are not dynamically dispatched like overridden instance methods.
- **Pitfall:** `super.method()` invokes the superclass implementation, while a normal call such as `this.method()` can dispatch to an overridden implementation at runtime.
- **Pitfall:** Avoid calling overridable methods from constructors because subclass state may not yet be initialized.

## Key takeaways

- `this` refers to the current object; `super` is used to access accessible superclass members or invoke a superclass constructor.
- Use `this.field` to disambiguate an instance field from a parameter with the same name.
- Use `super.field` and `super.method()` to access superclass members hidden or overridden by the subclass.
- `this(...)` delegates to another constructor in the same class; `super(...)` invokes a direct superclass constructor.
- Constructor invocation must follow Java's constructor chaining rules.
- Direct or indirect cyclic invocation through `this(...)` is a compile-time error.
