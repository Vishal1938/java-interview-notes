---
title: What is immutability, and how do you create an immutable class in Java?
sidebar_label: Immutability & Immutable Class
sidebar_position: 21
description: Understand mutable vs immutable objects in Java, the benefits of immutability, the step-by-step rules for creating an immutable class with defensive copies, records, and common pitfalls.
tags: [core-java, immutability, immutable-class, final, defensive-copy, thread-safety, intermediate]
---

# What is immutability, and how do you create an immutable class in Java?

> **Short answer:** An **immutable** object is one whose state cannot change after it is created. A **mutable** object can be changed after creation, usually through setters. To create an immutable class: make the class `final`, make all fields `private final`, provide no setters, initialize everything in the constructor, and make **defensive copies** of any mutable objects (such as lists or dates) both when they come in through the constructor and when they go out through getters. `String`, the wrapper classes such as `Integer`, and `LocalDate` are immutable classes from the JDK.

## Detailed explanation

### Mutable vs immutable objects

| Aspect | Mutable object | Immutable object |
| --- | --- | --- |
| State after creation | Can change | Never changes |
| Setters | Usually present | None |
| "Changing" a value | Modifies the same object | Returns a new object |
| Thread safety | Needs synchronization when shared | Safe to share without locking |
| Safe as `HashMap` key or `HashSet` element | Only if the fields used in `hashCode()` never change | Yes |
| Number of objects | Fewer; one object is reused | More; a new object per change |
| JDK examples | `StringBuilder`, `ArrayList`, `HashMap`, `java.util.Date` | `String`, `Integer`, `BigDecimal`, `LocalDate`, `List.of(...)` |

### Benefits of immutability

- **Thread safety:** immutable objects can be shared between threads without synchronization, because no thread can change them.
- **Safe hash keys:** the hash code never changes, so the object can never get "lost" inside a `HashMap` or `HashSet`.
- **Safe sharing and caching:** the same instance can be reused freely, as the String Constant Pool and `Integer.valueOf()` cache do.
- **Easier reasoning and debugging:** once an object is created and validated, it stays valid. No other code can change it unexpectedly.
- **No defensive copies needed** when passing the object around.

The main cost is that every change creates a new object. For many changes in a row, use a mutable helper (such as `StringBuilder` for `String`) or a builder, then create the immutable object at the end.

### Rules for creating an immutable class

1. **Declare the class `final`** so that no subclass can add mutable state or override methods. (Alternatively, make the constructor `private` and provide a static factory method.)
2. **Make all fields `private` and `final`.** `private` hides them; `final` ensures each one is assigned exactly once.
3. **Do not provide setters** or any other methods that change fields.
4. **Initialize all fields in the constructor**, and validate the values there.
5. **Make defensive copies of mutable inputs** in the constructor. If the caller keeps a reference to a list or `Date` it passed in, changing it later must not affect your object.
6. **Return defensive copies, or unmodifiable versions, of mutable fields** from getters, so callers cannot change the internal state through the returned reference.
7. **Return a new object for "modifications"**, such as a `withName(...)` method that returns a copy with one field changed.

Fields that are primitives, `String`, or other immutable types need no copying. Only mutable types (collections, arrays, `Date`, your own mutable classes) need defensive copies.

### `final` is not the same as immutable

- A `final` **variable** cannot be reassigned to point to another object.
- The **object** it points to can still be changed if its class is mutable.

```java
final List<String> list = new ArrayList<>();
list.add("Java");          // Allowed: the list object changes
// list = new ArrayList<>(); // Compile-time error: the reference cannot change
```

That is why `private final List<String> skills;` alone does not make a class immutable: the list itself must also be protected with copies.

### Records (Java 16+)

A record is a concise way to declare a class with `private final` fields, a constructor, accessors, `equals()`, `hashCode()`, and `toString()`:

```java
public record Point(int x, int y) { }
```

- A record has no setters, and its fields are `final`, so a record with only immutable components (primitives, `String`, other records) is immutable.
- Records are only **shallowly** immutable. A `List` component can still be changed unless you copy it in a compact constructor, for example `skills = List.copyOf(skills);`.

### Unmodifiable views vs copies

- `Collections.unmodifiableList(list)` returns a **read-only view**. Callers cannot change it, but changes to the original `list` still show through the view.
- `List.copyOf(list)` (Java 10+) returns an **unmodifiable copy** that is independent of the original. It also rejects `null` elements.
- For an immutable class, copy first, then expose the copy: storing `List.copyOf(input)` covers both the incoming and outgoing directions.

## Code example

```java title="ImmutabilityExample.java"
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

// Mutable: setters, and internal objects shared with callers
class MutableEmployee {
    private String name;
    private final List<String> skills;
    private final Date joiningDate;

    MutableEmployee(String name, List<String> skills, Date joiningDate) {
        this.name = name;
        this.skills = skills;              // Stores the caller's list
        this.joiningDate = joiningDate;    // Stores the caller's Date
    }

    void setName(String name) {
        this.name = name;
    }

    List<String> getSkills() {
        return skills;                     // Exposes the internal list
    }

    @Override
    public String toString() {
        return "MutableEmployee{name=" + name + ", skills=" + skills
                + ", joined=" + joiningDate.getTime() + "}";
    }
}

// Immutable: final class, private final fields, no setters, defensive copies
final class ImmutableEmployee {
    private final String name;             // String is already immutable
    private final List<String> skills;
    private final Date joiningDate;

    ImmutableEmployee(String name, List<String> skills, Date joiningDate) {
        this.name = name;
        this.skills = List.copyOf(skills);                       // Copy in (unmodifiable)
        this.joiningDate = new Date(joiningDate.getTime());      // Copy in
    }

    String getName() {
        return name;
    }

    List<String> getSkills() {
        return skills;                     // Already an unmodifiable copy
    }

    Date getJoiningDate() {
        return new Date(joiningDate.getTime());                  // Copy out
    }

    ImmutableEmployee withName(String newName) {
        return new ImmutableEmployee(newName, skills, joiningDate); // New object
    }

    @Override
    public String toString() {
        return "ImmutableEmployee{name=" + name + ", skills=" + skills
                + ", joined=" + joiningDate.getTime() + "}";
    }
}

public class ImmutabilityExample {
    public static void main(String[] args) {
        // 1. Mutable class: state can be changed from outside
        List<String> skills = new ArrayList<>(List.of("Java"));
        Date joined = new Date(0);
        MutableEmployee mutable = new MutableEmployee("Asha", skills, joined);
        skills.add("Spring");                 // Changes the employee's list
        joined.setTime(1000);                 // Changes the employee's date
        mutable.getSkills().add("SQL");       // Changes it through the getter
        mutable.setName("Ravi");              // Changes it through the setter
        System.out.println(mutable);

        // 2. Immutable class: outside changes have no effect
        List<String> skills2 = new ArrayList<>(List.of("Java"));
        Date joined2 = new Date(0);
        ImmutableEmployee immutable = new ImmutableEmployee("Asha", skills2, joined2);
        skills2.add("Spring");                // Does not affect the copy
        joined2.setTime(1000);                // Does not affect the copy
        immutable.getJoiningDate().setTime(5000); // Changes only a returned copy
        try {
            immutable.getSkills().add("SQL");
        } catch (UnsupportedOperationException e) {
            System.out.println("Cannot modify skills: UnsupportedOperationException");
        }
        System.out.println(immutable);

        // 3. "Modifying" an immutable object creates a new one
        ImmutableEmployee renamed = immutable.withName("Ravi");
        System.out.println("Original: " + immutable.getName() + ", new: " + renamed.getName()
                + ", same object? " + (immutable == renamed));

        // 4. Unmodifiable view vs unmodifiable copy
        List<String> source = new ArrayList<>(List.of("a"));
        List<String> view = Collections.unmodifiableList(source);
        List<String> copy = List.copyOf(source);
        source.add("b");
        System.out.println("View: " + view + ", copy: " + copy);
    }
}
```

**Output:**

```text
MutableEmployee{name=Ravi, skills=[Java, Spring, SQL], joined=1000}
Cannot modify skills: UnsupportedOperationException
ImmutableEmployee{name=Asha, skills=[Java], joined=0}
Original: Asha, new: Ravi, same object? false
View: [a, b], copy: [a]
```

## Common follow-ups & pitfalls

- **"Why should an immutable class be `final`?"** A subclass could add mutable fields or override methods to return changing values, and code that expects the parent type would then receive a mutable object.
- **"Is a class immutable if all its fields are `final`?"** Not necessarily. A `final` field can refer to a mutable object such as a `List` or `Date`, which can still be changed unless you make defensive copies.
- **"Why is `String` immutable?"** So that it can be shared through the String Constant Pool, used safely as a `HashMap` key with a cached hash code, shared between threads, and trusted for security-sensitive values such as file paths and class names.
- **"Name some immutable classes in the JDK."** `String`, `Integer` and the other wrapper classes, `BigInteger`, `BigDecimal`, `LocalDate`, `LocalDateTime`, `Instant`, `Duration`, and the collections returned by `List.of`, `Set.of`, and `Map.of`.
- **"How do you change a value in an immutable object?"** You do not; you create a new object with the new value, as `withName()` does above, or as `String.toUpperCase()` and `LocalDate.plusDays()` do.
- **"Are records immutable?"** Shallowly. Their fields are `final` and there are no setters, but mutable components such as lists must be copied in a compact constructor.
- **Pitfall:** `BigInteger` and `BigDecimal` are immutable but **not** `final`. A subclass instance could be mutable, so security-sensitive code should make a defensive copy when they come from untrusted code, for example `new BigInteger(value.toByteArray())`.
- **Pitfall:** Copying a list with `List.copyOf()` copies only the list, not its elements. If the elements are mutable objects, they must be copied too (a **deep copy**), or the class is still not fully immutable.
- **Pitfall:** Do not let `this` escape from the constructor (for example, by registering a listener or starting a thread there). Another thread could see the object before its `final` fields are set.
- **Pitfall:** Reflection and serialization can bypass normal rules and change `private final` fields. Immutability protects against normal code, not against deliberate tampering.
- **Pitfall:** Prefer `java.time` classes such as `LocalDate` and `Instant` over the mutable `java.util.Date` and `Calendar`, so no date copies are needed at all.

## Key takeaways

- An immutable object cannot change after creation; a mutable object can, usually through setters.
- Immutable objects are thread-safe, safe as hash keys, and easy to share and cache.
- To create an immutable class: `final` class, `private final` fields, no setters, full initialization in the constructor, defensive copies in and out, and new objects for changes.
- `final` prevents reassigning a reference; it does not make the referenced object immutable.
- Use `List.copyOf()` rather than `Collections.unmodifiableList()` when you need an independent copy, and consider records for simple immutable data.
