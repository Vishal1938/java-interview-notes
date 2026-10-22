---
title: What is the difference between compile-time and runtime polymorphism in Java?
sidebar_label: Compile-time vs Runtime Polymorphism
sidebar_position: 13
description: Understand compile-time polymorphism (method overloading) and runtime polymorphism (method overriding), static vs dynamic binding, and the rules and pitfalls interviewers ask about.
tags: [core-java, oops, polymorphism, overloading, overriding, beginner]
---

# What is the difference between compile-time and runtime polymorphism in Java?

> **Short answer:** Compile-time polymorphism is achieved through **method overloading**: the compiler picks which method to call based on the method name and the argument types it can see at compile time. Runtime polymorphism is achieved through **method overriding**: when an overridden instance method is called through a parent-type reference, the JVM decides which version to run based on the actual object's type at runtime.

## Detailed explanation

### Compile-time polymorphism (method overloading)

Compile-time polymorphism, also called **static polymorphism** or **static binding**, happens when a class has multiple methods with the same name but different parameter lists.

- Overloaded methods must differ in the **number**, **types**, or **order** of their parameters.
- Changing only the return type is **not** enough to overload a method; it causes a compile-time error.
- The compiler selects the method using the **declared (static) type** of the arguments, not the runtime type of the objects passed in.
- Overloading can happen within the same class or between a parent class and a subclass.
- Constructors can also be overloaded.

### Runtime polymorphism (method overriding)

Runtime polymorphism, also called **dynamic polymorphism**, **dynamic binding**, or **dynamic method dispatch**, happens when a subclass provides its own implementation of an instance method that it inherits from a parent class or interface.

- The overriding method must have the **same name and parameter list** as the method it overrides.
- The return type must be the same or a subtype (**covariant return type**).
- The overriding method cannot have **weaker access** (for example, a `public` method cannot be overridden as `protected`).
- The overriding method cannot throw **new or broader checked exceptions** than the overridden method.
- When the method is called through a parent-type reference, the compiler only checks that the method exists in the reference type; the JVM runs the version defined by the **actual object's class**.
- Adding `@Override` is optional, but recommended: the compiler then reports an error if the method does not actually override anything.

### What cannot be overridden

Some methods are always bound at compile time and do not take part in runtime polymorphism:

- **`static` methods** belong to the class. A subclass static method with the same signature **hides** the parent method instead of overriding it.
- **`private` methods** are not inherited, so they cannot be overridden.
- **`final` methods** cannot be overridden.
- **Fields** are never polymorphic. A field with the same name in a subclass **hides** the parent field, and the reference type decides which field is accessed.

### Side-by-side comparison

| Aspect | Compile-time polymorphism | Runtime polymorphism |
| --- | --- | --- |
| Achieved by | Method overloading | Method overriding |
| Also called | Static binding, early binding | Dynamic binding, late binding, dynamic method dispatch |
| Decided by | Compiler | JVM at runtime |
| Based on | Declared types of the arguments | Actual type of the object |
| Method signature | Same name, different parameter list | Same name, same parameter list |
| Inheritance required | No | Yes (class inheritance or interface implementation) |
| Applies to `static`, `private`, `final` methods | Yes (they can be overloaded) | No (they cannot be overridden) |

## Code example

```java title="PolymorphismExample.java"
class Calculator {
    // Compile-time polymorphism: same name, different parameter lists
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}

class Animal {
    String name = "Animal";

    void sound() {
        System.out.println("Animal makes a sound");
    }

    static void info() {
        System.out.println("Static method in Animal");
    }
}

class Dog extends Animal {
    String name = "Dog";      // Hides Animal.name; fields are not polymorphic

    @Override
    void sound() {            // Runtime polymorphism: overrides Animal.sound()
        System.out.println("Dog barks");
    }

    static void info() {      // Hides Animal.info(); static methods are not overridden
        System.out.println("Static method in Dog");
    }
}

public class PolymorphismExample {
    static void describe(Animal animal) {
        System.out.println("describe(Animal) called");
    }

    static void describe(Dog dog) {
        System.out.println("describe(Dog) called");
    }

    public static void main(String[] args) {
        Calculator calculator = new Calculator();
        System.out.println(calculator.add(2, 3));
        System.out.println(calculator.add(2.5, 3.5));
        System.out.println(calculator.add(1, 2, 3));

        Animal animal = new Dog();  // Parent reference, child object

        animal.sound();             // Decided at runtime by the object type: Dog
        Animal.info();              // Static method: decided by the class name
        System.out.println(animal.name); // Field: decided by the reference type

        describe(animal);           // Overload chosen at compile time by the declared type: Animal
    }
}
```

**Output:**

```text
5
6.0
6
Dog barks
Static method in Animal
Animal
describe(Animal) called
```

The last line is a common trick question: even though `animal` points to a `Dog` object, overload resolution uses the declared type `Animal`, so `describe(Animal)` is called.

## Common follow-ups & pitfalls

- **"Can we overload a method by changing only its return type?"** No. The parameter list must differ; otherwise the compiler reports that the method is already defined.
- **"Can we override a static method?"** No. Declaring a static method with the same signature in a subclass is **method hiding**. Which version runs depends on the reference type or class name used in the call, not on the object.
- **"Can we override a private or final method?"** No. A `private` method is not inherited, so a subclass method with the same signature is simply a new, unrelated method. A `final` method cannot be overridden at all.
- **"Can we overload the `main` method?"** Yes. You can declare other `main` methods with different parameter lists, but the JVM only uses `public static void main(String[] args)` as the entry point.
- **"Is method overloading true polymorphism?"** Opinions differ. Many interviewers treat overloading as compile-time polymorphism, while some argue only overriding is true polymorphism. Mention both views if asked.
- **Pitfall:** Through a parent-type reference, you can call only methods declared in the parent type. Calling a method defined only in the subclass needs a cast, for example `((Dog) animal).someDogMethod()`.
- **Pitfall:** Overloading with `null` can be ambiguous. A call such as `print(null)` fails to compile if two overloads accept unrelated reference types, such as `String` and `Integer`.
- **Pitfall:** Calling an overridable method from a parent constructor runs the subclass version before the subclass fields are initialized, which can expose default values such as `null` or `0`.

## Key takeaways

- Compile-time polymorphism is method overloading; the compiler chooses the method using the declared argument types.
- Runtime polymorphism is method overriding; the JVM chooses the method using the actual object's type.
- Overloading needs a different parameter list; overriding needs the same signature and an inheritance relationship.
- `static`, `private`, and `final` methods and all fields are resolved at compile time and are not overridden.
- Use `@Override` to let the compiler confirm that a method really overrides a parent method.
