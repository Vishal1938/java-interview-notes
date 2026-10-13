---
title: What is the difference between static and instance methods in Java?
sidebar_label: Static vs Instance Methods
sidebar_position: 10
description: Learn Java methods, method syntax, parameters and return values, and the differences between static and instance methods with examples.
tags: [core-java, methods, static, instance-methods, beginner]
---

# What is the difference between static and instance methods in Java?

> **Short answer:** A method defines behavior that can be called when needed. An instance method belongs to an object and can use that object's instance members directly. A static method belongs to the class and can be called without creating an object, but it cannot directly access instance members without an object reference.

## Detailed explanation

### What is a method?

A **method** is a named block of code declared in a class or interface to perform an operation. A method can accept input through parameters and may return a result.

```java
returnType methodName(parameters) {
    // Method body
}
```

Example:

```java
int add(int a, int b) {
    return a + b;
}
```

Here, `int` is the return type, `add` is the method name, and `a` and `b` are parameters.

### Components of a method

A method declaration may include:

- **Access modifier:** Controls where the method can be accessed, such as `public`, `protected`, or `private`.
- **Other modifiers:** For example, `static`, `final`, `abstract`, or `synchronized`, depending on the method and its context.
- **Return type:** The type of value returned by the method. Use `void` when it does not return a value.
- **Method name:** The identifier used to call the method.
- **Parameter list:** Inputs the method accepts. A method with no parameters uses empty parentheses `()`.
- **Method body:** The statements that run when the method is invoked. An abstract method or an interface method without a body is declared differently.

Example:

```java
public int multiply(int x, int y) {
    return x * y;
}
```

### Parameters vs. arguments

A **parameter** is a variable declared in a method declaration. An **argument** is the actual value or expression supplied when the method is called.

```java
int square(int number) { // number is a parameter
    return number * number;
}

int result = square(5);  // 5 is an argument
```

The result is `25`.

### Return type and `void`

A method with a non-`void` return type must return a compatible value on every path that completes normally.

```java
int getNumber() {
    return 10;
}

void printMessage() {
    System.out.println("Hello Java");
}
```

A `void` method does not return a value, though it can use `return;` to exit early.

## Types of methods: instance and static

### 1. Instance methods

An **instance method** is declared without the `static` keyword. It is invoked on an object and can directly access the object's instance fields and other instance methods.

- It operates in the context of a particular object.
- It can directly access both instance and static members.
- It can use `this` to refer to the current object.
- It normally requires an object reference to be invoked.

#### Example

```java title="InstanceMethodExample.java"
class Employee {
    String name;

    Employee(String name) {
        this.name = name;
    }

    void displayName() {
        System.out.println("Employee: " + name);
    }
}

public class InstanceMethodExample {
    public static void main(String[] args) {
        Employee employee = new Employee("Aman");
        employee.displayName();
    }
}
```

**Output:**

```text
Employee: Aman
```

The `displayName()` method reads the `name` field belonging to the object on which it is invoked.

### 2. Static methods

A **static method** is declared with the `static` keyword. It belongs to the class and can be invoked using the class name without creating an instance.

- It can directly access static fields and static methods.
- It cannot directly access instance fields or instance methods because it has no current object.
- It cannot use `this` or `super` as a current-instance reference.
- It can access instance members if it is given an explicit object reference.

#### Example

```java title="StaticMethodExample.java"
class Calculator {
    static int add(int a, int b) {
        return a + b;
    }
}

public class StaticMethodExample {
    public static void main(String[] args) {
        int result = Calculator.add(10, 20);
        System.out.println(result);
    }
}
```

**Output:**

```text
30
```

`add()` is static, so it is called using `Calculator.add(...)`. No `Calculator` object is required.

### Static methods can access instance members through an object

A static method cannot access an instance field by its name alone, but it can use an object reference.

```java
class Example {
    int value = 10;

    static void printValue(Example example) {
        System.out.println(example.value);
    }
}
```

The method receives an `Example` reference and accesses that object's `value` field.

## Static methods vs. instance methods

| Instance method | Static method |
|---|---|
| Declared without `static`. | Declared with `static`. |
| Invoked on a particular object. | Belongs to the class and can be called with the class name. |
| Can directly access instance and static members. | Can directly access static members, but needs an object reference for instance members. |
| Can use `this` and, where applicable, `super`. | Cannot use `this` or `super` to refer to a current instance. |
| Overridable by subclasses when the method otherwise meets overriding rules. | Static methods are hidden, not overridden. |
| Useful for behavior tied to an object's state. | Useful for class-level behavior that does not require a particular object's state. |

## Can a static method be called using an object reference?

Java allows a static method to be called through an object reference, but this style is discouraged because the method is associated with the class, not the object. Prefer the class name.

```java
class Utility {
    static void greet() {
        System.out.println("Hello");
    }
}

public class StaticCallExample {
    public static void main(String[] args) {
        Utility utility = null;

        Utility.greet();  // Recommended
        utility.greet();  // Compiles, but avoid this style
    }
}
```

**Output:**

```text
Hello
Hello
```

The second call does not throw a `NullPointerException` because the static method is resolved using the type, and the `utility` reference is not dereferenced for an instance invocation. Do not rely on this confusing style.

## Method overloading and overriding

### Method overloading

Overloading means using the same method name with different parameter lists. It can be used with static methods, instance methods, or a combination, as long as the method signatures differ appropriately.

```java
class Printer {
    void print(int value) {
        System.out.println(value);
    }

    void print(String value) {
        System.out.println(value);
    }
}
```

### Method overriding

Overriding occurs when a subclass provides a compatible implementation of an inherited instance method. The actual object determines which overridden implementation runs.

```java
class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Bark");
    }
}
```

**Important:** Static methods are not overridden. If a subclass declares a static method with the same signature as an accessible static method in its superclass, the method is **hidden**. Which static method is selected depends on the compile-time type used to qualify the call.

## Combined example

```java title="MethodsExample.java"
class Student {
    String name;
    static int studentCount = 0;

    Student(String name) {
        this.name = name;
        studentCount++;
    }

    void introduce() {
        System.out.println("My name is " + name);
    }

    static void showStudentCount() {
        System.out.println("Student count: " + studentCount);
    }
}

public class MethodsExample {
    public static void main(String[] args) {
        Student first = new Student("Riya");
        Student second = new Student("Kabir");

        first.introduce();
        second.introduce();
        Student.showStudentCount();
    }
}
```

**Output:**

```text
My name is Riya
My name is Kabir
Student count: 2
```

The instance method `introduce()` uses each object's own `name`. The static method `showStudentCount()` reads the shared class-level `studentCount` field.

## Common follow-ups & pitfalls

- **"What is a method?"** A named block of code that performs an operation and can accept parameters and return a value.
- **"What is the difference between static and instance methods?"** Instance methods operate on a particular object; static methods belong to the class.
- **"Can a static method access an instance variable?"** Not directly. It needs an explicit object reference.
- **"Can an instance method access a static variable?"** Yes. Static members are accessible from instance methods.
- **"Can a static method use `this`?"** No. A static method has no current object.
- **"Can we overload static methods?"** Yes, provided their parameter lists differ.
- **"Can we override static methods?"** No. Static methods are hidden rather than overridden.
- **"Can a method return multiple values?"** A method has one declared return type, but it can return an object or collection containing multiple values.
- **Pitfall:** Changing only the return type does not create a valid overload.
- **Pitfall:** Calling a static method through an object reference compiles in Java but can mislead readers; prefer `ClassName.methodName()`.
- **Pitfall:** A `void` method cannot return a value, while a non-`void` method must return a compatible value on every normally completing path.

## Key takeaways

- Methods define behavior and may accept parameters and return results.
- Instance methods are associated with objects and can directly use instance state.
- Static methods belong to the class and do not have a current object.
- Use `this` only in an instance context.
- Overloading uses different parameter lists; overriding replaces an inherited instance-method implementation.
- Static methods are hidden, not overridden.
