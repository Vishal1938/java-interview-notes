---
title: What are control statements in Java?
sidebar_label: Control Statements
sidebar_position: 4
description: Learn Java control statements, including if-else, nested conditions, switch statements, fall-through, and common switch interview questions.
tags: [core-java, control-statements, if-else, switch, beginner]
---

# What are control statements in Java?

> **Short answer:** Control statements determine the order in which program statements execute. They allow a program to make decisions, repeat operations, or transfer control based on conditions and other rules.

## Detailed explanation

### Types of control statements

Java control flow is commonly grouped into three categories:

- **Decision-making statements:** `if`, `if-else`, `else-if` ladders, nested `if`, and `switch`.
- **Looping statements:** `for`, enhanced `for`, `while`, and `do-while`.
- **Branching statements:** `break`, `continue`, and `return`.

This document focuses on decision-making statements, especially `if` and `switch`.

### 1. `if` statements

An `if` statement executes its body only when its condition evaluates to `true`. In Java, the condition must be a `boolean` expression.

#### Simple `if`

Use a simple `if` when an action is needed only if a condition is true.

```java
if (condition) {
    // Statements run only when condition is true
}
```

Example:

```java
int age = 20;

if (age >= 18) {
    System.out.println("You are eligible to vote.");
}
```

#### `if-else`

Use `if-else` when one block should execute if the condition is true and another block should execute if it is false.

```java
if (condition) {
    // Runs when condition is true
} else {
    // Runs when condition is false
}
```

Example:

```java
int number = 7;

if (number % 2 == 0) {
    System.out.println("Even number");
} else {
    System.out.println("Odd number");
}
```

#### `else-if` ladder

Use an `else-if` ladder when multiple conditions need to be checked in order. The first true branch runs, and the remaining branches are skipped.

```java
int marks = 76;

if (marks >= 90) {
    System.out.println("Grade A");
} else if (marks >= 75) {
    System.out.println("Grade B");
} else if (marks >= 60) {
    System.out.println("Grade C");
} else {
    System.out.println("Needs improvement");
}
```

Output:

```text
Grade B
```

#### Nested `if`

A nested `if` is an `if` statement inside another `if` or `else` block. It is useful when a second condition should be checked only after a first condition succeeds.

```java
int age = 22;
boolean hasId = true;

if (age >= 18) {
    if (hasId) {
        System.out.println("Entry allowed");
    } else {
        System.out.println("ID is required");
    }
} else {
    System.out.println("Entry denied: underage");
}
```

Output:

```text
Entry allowed
```

#### Combining conditions

Use logical operators to combine boolean conditions:

- `&&` (AND): true only when both conditions are true.
- `||` (OR): true when at least one condition is true.
- `!` (NOT): reverses a boolean value.

```java
int age = 25;
boolean hasTicket = true;

if (age >= 18 && hasTicket) {
    System.out.println("You can enter.");
}
```

#### Common `if` pitfalls

- Java conditions must evaluate to `boolean`; values such as `1` or `0` cannot be used as conditions.
- Use braces `{}` for multi-statement blocks and generally prefer them even for one statement to reduce mistakes.
- In an `else-if` ladder, the first matching branch wins.
- Be careful with a semicolon immediately after `if (condition)`. For example, `if (condition);` creates an empty statement and usually does not do what was intended.

### 2. `switch` statements

A `switch` selects a branch based on the value of an expression. It can be easier to read than a long `else-if` ladder when comparing one value against several alternatives.

Traditional `switch` statements support selector types such as `byte`, `short`, `char`, `int`, their corresponding wrapper types, `String`, and `enum` types. They do not directly support `long`, `float`, `double`, or `boolean` as traditional switch selector types.

#### Basic syntax

```java
switch (expression) {
    case constant1:
        // Statements
        break;
    case constant2:
        // Statements
        break;
    default:
        // Runs when no case matches
}
```

- The expression is evaluated, and Java looks for a matching `case` label.
- Each `case` label must be a compile-time constant compatible with the selector type (or an appropriate enum constant). A variable whose value can change is not a valid case label.
- Duplicate case labels are not allowed.
- `default` is optional and runs when no case matches.
- A traditional `switch` can have at most one `default` label.
- The `default` label can appear before, between, or after `case` labels. In a traditional switch, execution can fall through from one label to the next unless control is transferred out of the switch.

#### Why is `break` used?

In a traditional colon-style switch, `break` exits the switch statement. If a matching case executes and reaches no `break`, `return`, `throw`, or other control transfer, execution can continue into the statements of the next case. This behavior is called **fall-through**.

```java
int day = 2;

switch (day) {
    case 1:
        System.out.println("Monday");
    case 2:
        System.out.println("Tuesday");
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Invalid day");
}
```

Output:

```text
Tuesday
Wednesday
```

Because `case 2` has no `break`, execution continues into `case 3`. It is not mandatory to write `break` after every case, but omitting it unintentionally can produce unexpected output. Fall-through can also be used deliberately when multiple labels should share behavior.

#### Multiple case labels for the same action

Multiple labels can share one body. This is useful when different values should produce the same result.

```java
int day = 6;

switch (day) {
    case 6:
    case 7:
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Weekday");
}
```

Output:

```text
Weekend
```

#### `switch` with `String` and `enum`

A switch can use a `String` or an enum value as its selector.

```java
String role = "ADMIN";

switch (role) {
    case "ADMIN":
        System.out.println("Full access");
        break;
    case "USER":
        System.out.println("Limited access");
        break;
    default:
        System.out.println("Unknown role");
}
```

Output:

```text
Full access
```

A `switch` selector must not be `null` in traditional switch usage; switching on a null `String` causes a `NullPointerException`.

#### Modern switch syntax (Java 14 and later)

Java also supports switch rules using `->`. These rules do not fall through, so `break` is not required for each rule. Switch expressions can return a value.

```java
int day = 6;

String type = switch (day) {
    case 6, 7 -> "Weekend";
    case 1, 2, 3, 4, 5 -> "Weekday";
    default -> "Invalid day";
};

System.out.println(type);
```

Output:

```text
Weekend
```

Use `yield` when a block in a switch expression needs to produce a value:

```java
int number = 2;

String result = switch (number) {
    case 1 -> "One";
    case 2 -> {
        String message = "Number ";
        yield message + number;
    }
    default -> "Other";
};

System.out.println(result);
```

Output:

```text
Number 2
```

### Common switch interview questions

#### Q1. Can the `default` label appear anywhere inside a switch?

**Yes.** A `default` label can appear before, between, or after the `case` labels. However, in a traditional colon-style switch, execution may fall through from a preceding case into the statements after `default` if no control-transfer statement stops it.

```java
int value = 2;

switch (value) {
    default:
        System.out.println("Default");
        break;
    case 1:
        System.out.println("One");
        break;
    case 2:
        System.out.println("Two");
        break;
}
```

Output:

```text
Two
```

Here, `case 2` matches, so the `default` block is skipped despite appearing first.

#### Q2. Can we write more than one `default` label in a switch?

**No.** A switch statement or switch expression can contain at most one `default` label. Multiple `default` labels cause a compile-time error.

```java
int value = 1;

switch (value) {
    case 1:
        System.out.println("One");
        break;
    default:
        System.out.println("First default");
        break;
    // This second default is invalid and will not compile:
    // default:
    //     System.out.println("Second default");
}
```

The commented-out second `default` illustrates the invalid code; uncommenting it causes a compile-time error.

#### Q3. Can we duplicate case labels?

**No.** Each case label in the same switch must be unique. Repeating the same constant label causes a compile-time error.

```java
int value = 1;

switch (value) {
    case 1:
        System.out.println("First one");
        break;
    // This duplicate label is invalid and will not compile:
    // case 1:
    //     System.out.println("Duplicate one");
    //     break;
    default:
        System.out.println("Other");
}
```

The commented-out second `case 1` illustrates the invalid code; uncommenting it causes a compile-time error. To make several values share behavior, list distinct labels with a shared body instead.

#### Additional switch pitfalls

- **Using a variable as a case label:** A normal variable such as `int target = 2;` cannot be used as `case target:` unless it qualifies as a compile-time constant (for example, a suitable `final` primitive or `String` constant).
- **Forgetting `break`:** In traditional colon-style switches, execution can fall through into later cases.
- **Confusing `->` and `:`:** Switch rules using `->` do not fall through; traditional colon-style cases can.
- **No matching case and no default:** The switch body is skipped if no case matches and there is no `default`.
- **Null selector:** A null selector in a traditional switch causes a `NullPointerException`.

## Key takeaways

- Control statements determine the flow of execution in a Java program.
- Use `if`, `if-else`, `else-if`, and nested `if` for conditional decision-making.
- Use `switch` when selecting among multiple values of a compatible type.
- Traditional `switch` case labels must be unique compile-time constants; only one `default` label is allowed.
- In traditional colon-style switches, `break` prevents fall-through; arrow-style switch rules do not fall through.
- A `default` label can appear anywhere in the switch, but its position and fall-through behavior should be considered carefully.
