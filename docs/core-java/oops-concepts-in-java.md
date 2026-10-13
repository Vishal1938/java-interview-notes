---
title: What are OOP concepts in Java?
sidebar_label: OOP Concepts
sidebar_position: 6
description: "Learn the four pillars of object-oriented programming in Java: encapsulation, inheritance, polymorphism, and abstraction, with examples and interview questions."
tags: [core-java, oops, encapsulation, inheritance, polymorphism, abstraction, beginner]
---

# What are OOP concepts in Java?

> **Short answer:** Object-oriented programming (OOP) is a programming approach that organizes software around objects containing state and behavior. Java uses classes and objects and commonly teaches four main OOP principles: encapsulation, inheritance, polymorphism, and abstraction.

## Detailed explanation

### What is a class?

A **class** is a blueprint that defines the data (fields) and behavior (methods) that its objects can have.

```java
class Car {
    String color;
    void drive() {
        System.out.println("The car is moving.");
    }
}
```

Here, `Car` defines a `color` field and a `drive()` method.

### What is an object?

An **object** is an instance of a class. It has state (the values of its fields) and can perform behavior through its methods.

```java
Car car = new Car();
car.color = "Red";
car.drive();
```

Output:

```text
The car is moving.
```

`new Car()` creates a `Car` object, and `car` is a reference to that object.

## The four pillars of OOP

### 1. Encapsulation

**Encapsulation** means bundling data and the methods that operate on it within a class, while controlling how that data is accessed. A common Java approach is to make fields `private` and provide public methods to validate or update them.

#### Example

```java title="EncapsulationExample.java"
class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    public double getBalance() {
        return balance;
    }
}

public class EncapsulationExample {
    public static void main(String[] args) {
        BankAccount account = new BankAccount();
        account.deposit(500);
        System.out.println(account.getBalance());
    }
}
```

**Output:**

```text
500.0
```

The `balance` field cannot be accessed directly from outside `BankAccount`. The `deposit()` method controls how the balance changes.

**Benefits:**

- Protects an object's internal state.
- Allows validation before values are changed.
- Reduces dependencies on internal implementation details.

### 2. Inheritance

**Inheritance** allows a class to acquire accessible fields and methods from another class. It helps represent an *is-a* relationship and can support code reuse.

- The class being inherited from is called the **superclass** or **parent class**.
- The class that inherits is called the **subclass** or **child class**.
- Java uses `extends` for class inheritance.
- A Java class can extend only one class, but it can implement multiple interfaces.

#### Example

```java title="InheritanceExample.java"
class Animal {
    void eat() {
        System.out.println("Animal is eating.");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Dog is barking.");
    }
}

public class InheritanceExample {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.eat();
        dog.bark();
    }
}
```

**Output:**

```text
Animal is eating.
Dog is barking.
```

`Dog` inherits the accessible `eat()` method from `Animal` and defines its own `bark()` method.

**Important points:**

- Constructors are not inherited, although a subclass constructor can call a superclass constructor using `super(...)`.
- `private` members are not directly accessible by name in a subclass.
- Inheritance should model a meaningful relationship; composition is often preferable when one object simply uses another object.

### 3. Polymorphism

**Polymorphism** means “many forms.” In Java, the same method name or parent-type reference can represent different behavior depending on the context.

Java commonly demonstrates two forms of polymorphism:

#### Compile-time polymorphism (method overloading)

Method overloading means defining multiple methods with the same name but different parameter lists. The compiler selects the matching overload based on the arguments and the available method signatures.

```java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

The two `add()` methods have different parameter lists. Changing only the return type is not enough to overload a method.

#### Runtime polymorphism (method overriding)

Method overriding occurs when a subclass provides an implementation of an inherited instance method with a compatible signature. At runtime, the implementation is selected based on the actual object.

```java title="PolymorphismExample.java"
class Animal {
    void sound() {
        System.out.println("Animal makes a sound.");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Dog barks.");
    }
}

public class PolymorphismExample {
    public static void main(String[] args) {
        Animal animal = new Dog();
        animal.sound();
    }
}
```

**Output:**

```text
Dog barks.
```

Although the reference type is `Animal`, the actual object is `Dog`, so the overridden `Dog.sound()` method runs.

**Important points:**

- Overloading is resolved at compile time.
- Overridden instance-method calls use runtime dispatch.
- Static methods are hidden rather than overridden.
- Fields are not polymorphic in the same way as overridden instance methods.

### 4. Abstraction

**Abstraction** means exposing essential behavior while hiding unnecessary implementation details. Java supports abstraction using abstract classes and interfaces.

#### Abstract class

An abstract class is declared with `abstract` and cannot be instantiated directly. It can contain abstract methods (without method bodies) and concrete methods (with method bodies).

```java
abstract class Shape {
    abstract double area();

    void describe() {
        System.out.println("This is a shape.");
    }
}

class Circle extends Shape {
    private final double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius;
    }
}
```

#### Interface

An interface defines a contract that implementing classes agree to fulfill. Interfaces can declare abstract methods and can also contain default, static, and private methods where supported by the Java version.

```java
interface Payment {
    void pay(double amount);
}

class CardPayment implements Payment {
    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " by card.");
    }
}
```

**When to use each:**

- Use an **abstract class** when related classes need shared state or common implementation as well as abstract behavior.
- Use an **interface** to define a contract that potentially unrelated classes can implement. A class can implement multiple interfaces.

## Combined example

This example combines inheritance, abstraction, and runtime polymorphism.

```java title="OopConceptsExample.java"
abstract class Vehicle {
    abstract void start();
}

class Bike extends Vehicle {
    @Override
    void start() {
        System.out.println("Bike starts with a key.");
    }
}

class Car extends Vehicle {
    @Override
    void start() {
        System.out.println("Car starts with a button.");
    }
}

public class OopConceptsExample {
    public static void main(String[] args) {
        Vehicle first = new Bike();
        Vehicle second = new Car();

        first.start();
        second.start();
    }
}
```

**Output:**

```text
Bike starts with a key.
Car starts with a button.
```

`Vehicle` provides abstraction, `Bike` and `Car` inherit from it, and runtime polymorphism chooses the appropriate `start()` implementation for each object.

## Common follow-ups & pitfalls

- **"What are the four pillars of OOP?"** Encapsulation, inheritance, polymorphism, and abstraction.
- **"What is the difference between a class and an object?"** A class defines a type and its structure; an object is an instance of that class.
- **"What is the difference between abstraction and encapsulation?"** Abstraction focuses on exposing essential behavior while hiding implementation details. Encapsulation bundles state and behavior and controls access to internal state.
- **"What is the difference between overloading and overriding?"** Overloading uses the same method name with different parameter lists; overriding provides a subclass implementation of an inherited instance method.
- **"Does Java support multiple inheritance?"** A class cannot extend multiple classes. It can implement multiple interfaces.
- **"Can an abstract class be instantiated?"** No, but it can have constructors that run as part of subclass object creation.
- **"Can an interface have method implementations?"** Yes. Interfaces can have `default` and `static` methods, and modern Java also supports private helper methods in interfaces.
- **Pitfall:** Making a field `private` is not, by itself, a complete encapsulation design. Public methods should also preserve the object's invariants.
- **Pitfall:** Inheritance is not always the best way to reuse code. Use it when there is a genuine *is-a* relationship.
- **Pitfall:** A subclass can override eligible instance methods, but it does not override constructors or static methods.

## Key takeaways

- Classes define structure and behavior; objects are instances of classes.
- Encapsulation controls access to an object's state.
- Inheritance allows a class to extend another class and reuse accessible behavior.
- Polymorphism allows overloaded methods and overridden implementations to provide different behavior.
- Abstraction exposes essential behavior through abstract classes and interfaces.
- Understanding these concepts helps build Java applications that are easier to maintain, extend, and test.
