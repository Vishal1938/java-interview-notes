---
title: What is a constructor in Java?
sidebar_label: Constructors in Java
sidebar_position: 11
description: Learn Java constructors, default and no-argument constructors, parameterized constructors, constructor overloading, chaining, and common interview questions.
tags: [core-java, constructors, object-initialization, beginner]
---

# What is a constructor in Java?

> **Short answer:** A constructor is a special class member used to initialize a new object. It has the same name as the class and has no return type—not even `void`. It runs as part of object creation when `new` is used.

## Detailed explanation

### What is a constructor?

A **constructor** initializes an object when it is created. It commonly assigns initial values to instance fields or performs setup needed by the object.

```java
class Student {
    String name;

    Student() {
        name = "Unknown";
    }
}
```

When `new Student()` is executed, the constructor runs as part of creating the object.

### Rules for constructors

- A constructor has the same name as its class.
- A constructor has no return type. Writing `void` makes it a method, not a constructor.
- A constructor can have access modifiers such as `public`, `protected`, or `private`, subject to the context.
- Constructors can accept parameters and can be overloaded.
- Constructors are not inherited by subclasses.
- Constructors cannot be overridden.
- A constructor is invoked as part of object creation or through constructor chaining using `this(...)` or `super(...)`.
- Constructors cannot be `static`, `final`, or `abstract`.

### 1. Default constructor

If a class declares **no constructor at all**, the Java compiler provides a default constructor. It has no parameters and implicitly invokes the superclass's no-argument constructor, when accessible.

```java
class Student {
    int id;
    String name;
}

public class DefaultConstructorExample {
    public static void main(String[] args) {
        Student student = new Student();

        System.out.println(student.id);
        System.out.println(student.name);
    }
}
```

**Output:**

```text
0
null
```

In this example, the compiler supplies the default constructor because `Student` declares no constructor. The field values shown are their Java default values.

**Important:** If you declare any constructor yourself, the compiler does not automatically generate the default constructor.

### 2. No-argument constructor

A **no-argument constructor** is any constructor that has no parameters. It can be written explicitly by the developer.

```java
class Student {
    String name;

    Student() {
        name = "Asha";
    }
}

public class NoArgumentConstructorExample {
    public static void main(String[] args) {
        Student student = new Student();
        System.out.println(student.name);
    }
}
```

**Output:**

```text
Asha
```

A no-argument constructor written by the developer is not the same thing as the compiler-provided default constructor. The default constructor is generated only when the class declares no constructors.

### 3. Parameterized constructor

A **parameterized constructor** accepts arguments so that each object can be initialized with specific values.

```java
class Student {
    int id;
    String name;

    Student(int id, String name) {
        this.id = id;
        this.name = name;
    }
}

public class ParameterizedConstructorExample {
    public static void main(String[] args) {
        Student first = new Student(101, "Asha");
        Student second = new Student(102, "Rahul");

        System.out.println(first.id + " " + first.name);
        System.out.println(second.id + " " + second.name);
    }
}
```

**Output:**

```text
101 Asha
102 Rahul
```

Here, `this.id` and `this.name` refer to the object's fields, while `id` and `name` on the right-hand side refer to constructor parameters.

### 4. Constructor overloading

A class can have multiple constructors as long as they have different parameter lists. This is called **constructor overloading**.

```java title="ConstructorOverloadingExample.java"
class Employee {
    int id;
    String name;

    Employee() {
        this(0, "Unknown");
    }

    Employee(int id) {
        this(id, "Unknown");
    }

    Employee(int id, String name) {
        this.id = id;
        this.name = name;
    }
}

public class ConstructorOverloadingExample {
    public static void main(String[] args) {
        Employee first = new Employee();
        Employee second = new Employee(10);
        Employee third = new Employee(20, "Meera");

        System.out.println(first.id + " " + first.name);
        System.out.println(second.id + " " + second.name);
        System.out.println(third.id + " " + third.name);
    }
}
```

**Output:**

```text
0 Unknown
10 Unknown
20 Meera
```

Each constructor offers a different way to create an `Employee`. The `this(...)` calls reuse the initialization logic of another constructor in the same class.

### 5. Constructor chaining with `this()` and `super()`

Constructor chaining means one constructor invokes another constructor as part of initialization.

- `this(...)` calls another constructor in the same class.
- `super(...)` calls a constructor in the direct superclass.
- In traditional Java constructor syntax, an explicit `this(...)` or `super(...)` invocation must be the first statement in the constructor body.
- If neither is written, Java normally inserts an implicit no-argument `super()` call, provided the superclass has an accessible no-argument constructor.
- A constructor cannot call both `this(...)` and `super(...)` directly; chaining through `this(...)` may eventually reach a superclass constructor.

```java
class Person {
    Person(String name) {
        System.out.println("Person: " + name);
    }
}

class Student extends Person {
    Student() {
        super("Asha");
        System.out.println("Student constructor");
    }
}

public class ConstructorChainingExample {
    public static void main(String[] args) {
        new Student();
    }
}
```

**Output:**

```text
Person: Asha
Student constructor
```

The superclass constructor executes as part of constructing the subclass object.

### 6. Constructor execution order and initializer blocks

When an object is created, Java initializes its superclass portion before completing initialization of the subclass. For each class in the construction chain, instance field initializers and instance initializer blocks run in textual order before that class's constructor body.

```java
class Parent {
    Parent() {
        System.out.println("Parent constructor");
    }
}

class Child extends Parent {
    {
        System.out.println("Child instance block");
    }

    Child() {
        System.out.println("Child constructor");
    }
}

public class ConstructorOrderExample {
    public static void main(String[] args) {
        new Child();
    }
}
```

**Output:**

```text
Parent constructor
Child instance block
Child constructor
```

Static initializer blocks run during class initialization, before the class is actively used in a way that requires initialization; they do not run for every object.

### 7. Private constructor

A constructor can be declared `private` to prevent code outside the class from calling it directly. This is used in patterns such as utility classes and some factory or singleton designs.

```java
class Utility {
    private Utility() {
        // Prevent direct instantiation from outside this class
    }

    static int square(int number) {
        return number * number;
    }
}

public class PrivateConstructorExample {
    public static void main(String[] args) {
        System.out.println(Utility.square(5));
    }
}
```

**Output:**

```text
25
```

Because the constructor is private, `new Utility()` from an unrelated class would not compile. A private constructor does not, by itself, guarantee a singleton.

## Common follow-ups & pitfalls

- **"What is the difference between a default constructor and a no-argument constructor?"** The default constructor is supplied by the compiler only when no constructor is declared. A no-argument constructor can be written by the developer.
- **"Does a constructor have a return type?"** No. Even `void` would make it a method instead.
- **"Can constructors be overloaded?"** Yes. Their parameter lists must differ.
- **"Can constructors be overridden or inherited?"** No. Constructors are not inherited and cannot be overridden.
- **"Can a constructor be static, final, or abstract?"** No.
- **"What happens if I declare a parameterized constructor but call `new Student()`?"** It will not compile unless a no-argument constructor is also available.
- **"Can a constructor call another constructor?"** Yes. Use `this(...)` for a constructor in the same class or `super(...)` for a superclass constructor.
- **"Does every class get a default constructor?"** No. The compiler supplies one only when the class declares no constructor.
- **Pitfall:** If a constructor parameter has the same name as a field, use `this.fieldName` to refer to the field.
- **Pitfall:** A constructor cannot return a value. To provide a value from an operation, use a method or a factory method.
- **Pitfall:** If a superclass has no accessible no-argument constructor, a subclass constructor must explicitly invoke an appropriate superclass constructor.
- **Pitfall:** A private constructor restricts direct construction from outside the class, but other mechanisms may still create instances in some designs.

## Key takeaways

- Constructors initialize objects and have the same name as their class.
- Constructors have no return type and are not inherited or overridden.
- The compiler generates a default constructor only if no constructor is declared.
- No-argument and parameterized constructors support different initialization needs.
- Constructor overloading allows multiple initialization options.
- Use `this(...)` and `super(...)` for constructor chaining.
- Constructor execution works together with superclass initialization, field initializers, and instance initializer blocks.
