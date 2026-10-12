---
title: What are looping control statements in Java?
sidebar_label: Looping Statements
sidebar_position: 5
description: Learn Java looping statements, including for, while, do-while, enhanced for, nested loops, and break and continue.
tags: [core-java, loops, control-statements, beginner]
---

# What are looping control statements in Java?

> **Short answer:** Looping control statements execute a block of code repeatedly while a condition is satisfied or for each item in a sequence. Java provides `for`, `while`, `do-while`, and enhanced `for` loops.

## Detailed explanation

### Types of looping statements

Java provides these main looping statements:

- **`for` loop:** Commonly used when the number of iterations is known or controlled by an initialization, condition, and update.
- **`while` loop:** Checks the condition before each iteration, so the body may execute zero times.
- **`do-while` loop:** Checks the condition after executing the body, so the body executes at least once.
- **Enhanced `for` loop:** Iterates over the elements of an array or an `Iterable`, such as a collection.

### 1. `for` loop

A `for` loop combines initialization, a condition, and an update in one statement.

#### Syntax

```java
for (initialization; condition; update) {
    // Statements to repeat
}
```

Execution order:

1. Initialization runs once at the beginning.
2. The condition is checked before each iteration.
3. If the condition is `true`, the loop body executes.
4. The update expression runs after the body.
5. The condition is checked again. The loop ends when it becomes `false`.

#### Example

```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

**Output:**

```text
1
2
3
4
5
```

#### Omitting parts of a `for` loop

The initialization, condition, and update sections are optional, but the semicolons are required.

```java
int i = 1;

for (; i <= 3;) {
    System.out.println(i);
    i++;
}
```

Output:

```text
1
2
3
```

If the condition is omitted, it is treated as always true. Unless the loop exits through `break`, `return`, an exception, or another control-flow change, it can run indefinitely.

### 2. `while` loop

A `while` loop checks its condition before executing the body. It is useful when the number of iterations is not known in advance and depends on a condition.

#### Syntax

```java
while (condition) {
    // Statements to repeat
}
```

#### Example

```java
int count = 1;

while (count <= 3) {
    System.out.println("Count: " + count);
    count++;
}
```

**Output:**

```text
Count: 1
Count: 2
Count: 3
```

If the condition is false before the first iteration, the body does not execute at all.

**Common pitfall:** Make sure the loop condition can eventually become false, or use a deliberate exit such as `break`. Otherwise, the loop may never terminate.

### 3. `do-while` loop

A `do-while` loop executes the body first and checks the condition afterward. Therefore, its body always executes at least once.

#### Syntax

```java
do {
    // Statements to repeat
} while (condition);
```

Notice the semicolon after the `while` condition.

#### Example

```java
int count = 1;

do {
    System.out.println("Count: " + count);
    count++;
} while (count <= 3);
```

**Output:**

```text
Count: 1
Count: 2
Count: 3
```

#### Example showing that the body executes at least once

```java
int number = 10;

do {
    System.out.println("This runs once.");
} while (number < 5);
```

Output:

```text
This runs once.
```

Even though the condition is initially false, the body executes once before the condition is checked.

### 4. Enhanced `for` loop (for-each)

The enhanced `for` loop visits each element of an array or an object that implements `Iterable`, such as a `List`.

#### Syntax

```java
for (dataType variable : arrayOrIterable) {
    // Use variable
}
```

#### Example

```java
int[] numbers = {10, 20, 30};

for (int number : numbers) {
    System.out.println(number);
}
```

**Output:**

```text
10
20
30
```

The loop variable receives each element in turn. This syntax is concise when you need to process every element without manually managing an index.

**Common pitfalls:**

- The enhanced `for` loop does not directly provide the current index.
- Assigning a new value to the loop variable does not replace the corresponding element in a primitive array.
- Modifying a collection structurally while iterating over it may cause a `ConcurrentModificationException` for many standard collection implementations.

### 5. Nested loops

A nested loop is a loop placed inside another loop. For every iteration of the outer loop, the inner loop runs through its own iterations, unless control flow exits or skips it.

#### Example

```java
for (int row = 1; row <= 3; row++) {
    for (int column = 1; column <= 2; column++) {
        System.out.println("Row " + row + ", Column " + column);
    }
}
```

**Output:**

```text
Row 1, Column 1
Row 1, Column 2
Row 2, Column 1
Row 2, Column 2
Row 3, Column 1
Row 3, Column 2
```

Nested loops are useful for tables, grids, matrices, and combinations of values. Be aware that the total number of iterations can grow quickly as the number of nested loops increases.

### 6. `break` and `continue` in loops

#### `break`

`break` immediately exits the nearest enclosing loop.

```java
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        break;
    }
    System.out.println(i);
}
```

Output:

```text
1
2
```

When `i` becomes `3`, the loop terminates and no later iterations run.

#### `continue`

`continue` skips the remainder of the current iteration and proceeds to the next iteration.

```java
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue;
    }
    System.out.println(i);
}
```

Output:

```text
1
2
4
5
```

The value `3` is skipped, but the loop continues.

In a traditional `for` loop, `continue` proceeds to the update expression before the next condition check. In a `while` loop, control returns to the condition check. Be careful not to skip the code that updates a counter in a `while` loop, as this can accidentally create an infinite loop.

#### Labeled `break` and `continue`

Java supports labels to exit or continue an outer loop from inside a nested loop.

```java
outer:
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (i == 2 && j == 2) {
            break outer;
        }
        System.out.println(i + ", " + j);
    }
}
```

Output:

```text
1, 1
1, 2
1, 3
2, 1
```

`break outer;` exits the loop labeled `outer`, not just the inner loop.

## Common follow-ups & pitfalls

- **"Which loop executes at least once?"** `do-while`, because it checks its condition after executing the body.
- **"What is the difference between `while` and `do-while`?"** `while` checks the condition first and may execute zero times; `do-while` checks it afterward and executes at least once.
- **"When should I use a `for` loop?"** Use it when initialization, a condition, and an update naturally describe the iteration, especially when counting.
- **"When should I use an enhanced `for` loop?"** Use it when you need to visit each array or `Iterable` element and do not need direct index control.
- **"Can a loop run forever?"** Yes. An always-true condition or a condition that never changes to false can create an infinite loop unless another control-flow path exits it.
- **"What is the difference between `break` and `continue`?"** `break` exits the nearest loop; `continue` skips the rest of the current iteration and moves toward the next one.
- **Pitfall:** A stray semicolon after a loop header, such as `while (condition);`, creates an empty loop body and may lead to unexpected behavior.
- **Pitfall:** If a `while` loop's counter is not updated correctly, the condition may never become false.
- **Pitfall:** The enhanced `for` loop is not the best choice when you need to insert or remove elements from a collection during iteration.

## Key takeaways

- Java provides `for`, `while`, `do-while`, and enhanced `for` loops.
- `for` and `while` check the condition before each iteration; `do-while` checks it after the body.
- An enhanced `for` loop simplifies iteration over arrays and `Iterable` collections.
- Nested loops are useful for multidimensional or repeated combinations of work.
- `break` exits a loop, while `continue` skips the current iteration.
- Always ensure loop conditions and updates behave as intended to avoid accidental infinite loops.
