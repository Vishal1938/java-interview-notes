---
title: What is the hashCode() method, and what is the contract between equals() and hashCode()?
sidebar_label: hashCode() and the equals() Contract
sidebar_position: 17
description: Understand Java's hashCode() method, the equals() and hashCode() contracts, what breaks in HashMap and HashSet when you override only one, and how to implement both correctly.
tags: [core-java, hashcode, equals, object-class, collections, intermediate]
---

# What is the hashCode() method, and what is the contract between equals() and hashCode()?

> **Short answer:** `hashCode()` is a method of `Object` that returns an `int` used by hash-based collections such as `HashMap` and `HashSet` to decide which bucket an object goes into. The key rule of the contract is: **if two objects are equal according to `equals()`, they must return the same `hashCode()`**. The reverse is not required: two unequal objects may share a hash code (a collision). That is why you must always override `hashCode()` whenever you override `equals()`.

## Detailed explanation

### The `hashCode()` method

`hashCode()` is declared in `java.lang.Object`:

```java
public native int hashCode();
```

- It returns an `int` that summarizes the object, so hash-based collections can find it quickly.
- The default implementation in `Object` is based on the object's **identity**, so two different objects usually get different hash codes even if their fields are the same. (It is often described as the memory address, but the JVM does not guarantee that.)
- Classes such as `String`, `Integer`, `List`, and records override it to compute the hash from their **contents**.

### How `HashMap` and `HashSet` use both methods

1. `hashCode()` is called on the key to choose a **bucket**.
2. Inside that bucket, the stored hash is compared, then `equals()` is called to find the **exact** key.

So `hashCode()` narrows the search, and `equals()` makes the final decision. Both must agree on which objects are equal. (`HashSet` uses a `HashMap` internally, so the same rules apply.) See [How does HashMap work internally?](../collections/how-hashmap-works.md) for the full flow.

### The `hashCode()` contract

The `Object.hashCode()` documentation defines three rules:

1. **Consistent:** calling `hashCode()` multiple times on the same object must return the same value, as long as no field used in `equals()` changes. (It may differ between separate runs of the program.)
2. **Equal objects, equal hash codes:** if `a.equals(b)` is `true`, then `a.hashCode() == b.hashCode()` must be `true`.
3. **Unequal objects may collide:** if `a.equals(b)` is `false`, their hash codes are **not** required to differ. Distinct hash codes for unequal objects do improve performance, though.

| If… | Then… |
| --- | --- |
| `a.equals(b)` is `true` | `a.hashCode() == b.hashCode()` **must** be `true` |
| `a.hashCode() == b.hashCode()` | `a.equals(b)` **may** be `true` or `false` |
| `a.hashCode() != b.hashCode()` | `a.equals(b)` **must** be `false` |

### The `equals()` contract

For non-null references `x`, `y`, and `z`, `equals()` must be:

- **Reflexive:** `x.equals(x)` is `true`.
- **Symmetric:** `x.equals(y)` is `true` if and only if `y.equals(x)` is `true`.
- **Transitive:** if `x.equals(y)` and `y.equals(z)` are `true`, then `x.equals(z)` is `true`.
- **Consistent:** repeated calls return the same result, as long as the objects do not change.
- **Non-null:** `x.equals(null)` is `false`.

### What goes wrong if you override only one

| Overridden | Result |
| --- | --- |
| Only `equals()` | Equal objects get different identity-based hash codes and land in different buckets. `HashSet` stores duplicates, and `map.get()` returns `null` for a key that is "equal" to one you stored. **This breaks the contract.** |
| Only `hashCode()` | Equal-looking objects land in the same bucket, but `equals()` still compares references, so they are treated as different keys. The contract is not broken, but the class still behaves as if it had no logical equality. |
| Both, using the same fields | Hash-based collections work correctly. |

### How to implement them correctly

- Use the **same fields** in `equals()` and `hashCode()`. A field used in `hashCode()` must also be used in `equals()`.
- Use `Objects.equals(a, b)` for null-safe field comparison and `Objects.hash(...)` to combine fields.
- Prefer fields that do not change, so the hash code stays stable while the object is in a collection.
- For simple data carriers, a **record** (Java 16+) generates `equals()`, `hashCode()`, and `toString()` from its components automatically.
- IDEs and libraries such as Lombok can also generate both methods.

## Code example

```java title="HashCodeEqualsExample.java"
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

// Overrides only equals(): breaks the contract
class BrokenEmployee {
    private final int id;
    private final String name;

    BrokenEmployee(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BrokenEmployee)) return false;
        BrokenEmployee other = (BrokenEmployee) o;
        return id == other.id && Objects.equals(name, other.name);
    }
    // hashCode() not overridden: Object's identity-based version is used
}

// Overrides both, using the same fields: follows the contract
class Employee {
    private final int id;
    private final String name;

    Employee(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Employee)) return false;
        Employee other = (Employee) o;
        return id == other.id && Objects.equals(name, other.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}

public class HashCodeEqualsExample {
    public static void main(String[] args) {
        // 1. Only equals() overridden
        BrokenEmployee b1 = new BrokenEmployee(1, "Asha");
        BrokenEmployee b2 = new BrokenEmployee(1, "Asha");
        Set<BrokenEmployee> brokenSet = new HashSet<>();
        brokenSet.add(b1);
        brokenSet.add(b2);
        Map<BrokenEmployee, String> brokenMap = new HashMap<>();
        brokenMap.put(b1, "Engineering");
        System.out.println("Broken: equals = " + b1.equals(b2)
                + ", set size = " + brokenSet.size()
                + ", map.get = " + brokenMap.get(b2));

        // 2. Both overridden
        Employee e1 = new Employee(1, "Asha");
        Employee e2 = new Employee(1, "Asha");
        Set<Employee> set = new HashSet<>();
        set.add(e1);
        set.add(e2);
        Map<Employee, String> map = new HashMap<>();
        map.put(e1, "Engineering");
        System.out.println("Correct: equals = " + e1.equals(e2)
                + ", same hashCode = " + (e1.hashCode() == e2.hashCode())
                + ", set size = " + set.size()
                + ", map.get = " + map.get(e2));

        // 3. Same hash code does not mean equal (collision)
        System.out.println("\"Aa\" hash = " + "Aa".hashCode()
                + ", \"BB\" hash = " + "BB".hashCode()
                + ", equals = " + "Aa".equals("BB"));

        // 4. Mutating a key after inserting it
        List<String> key = new ArrayList<>(List.of("x"));
        Map<List<String>, Integer> scores = new HashMap<>();
        scores.put(key, 10);
        key.add("y");                    // Changes the key's hashCode()
        System.out.println("After mutation: get = " + scores.get(key)
                + ", map size = " + scores.size());
    }
}
```

**Output:**

```text
Broken: equals = true, set size = 2, map.get = null
Correct: equals = true, same hashCode = true, set size = 1, map.get = Engineering
"Aa" hash = 2112, "BB" hash = 2112, equals = false
After mutation: get = null, map size = 1
```

## Common follow-ups & pitfalls

- **"If two objects have the same hash code, are they equal?"** Not necessarily. Different objects can collide, as `"Aa"` and `"BB"` do. Only the reverse is guaranteed: equal objects have equal hash codes.
- **"If two objects are equal, must their hash codes be the same?"** Yes. That is the core rule of the contract.
- **"What if `hashCode()` always returns the same constant, such as `42`?"** It is legal, because equal objects still have equal hash codes, but every key lands in the same bucket and `HashMap` lookups degrade from O(1) to O(n) (or O(log n) once a bucket is treeified).
- **"Is the default `hashCode()` the memory address?"** Not guaranteed. It is an identity-based value chosen by the JVM, and it stays the same for the object's lifetime even if the garbage collector moves the object.
- **"Why is 31 used in many `hashCode()` implementations?"** It is an odd prime that spreads values well, and `31 * i` can be optimized to `(i << 5) - i`. `String.hashCode()` uses it: `s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]`.
- **"Should `equals()` use `instanceof` or `getClass()`?"** `instanceof` lets subclasses be equal to the parent class, which can break symmetry if a subclass adds fields to `equals()`. `getClass()` only treats objects of the exact same class as equal. Either works if used consistently; many classes are made `final` to avoid the problem.
- **Pitfall:** `equals(Employee other)` **overloads** `equals()` instead of overriding it, because the parameter must be `Object`. Use `@Override` so the compiler catches this.
- **Pitfall:** Changing a field used in `hashCode()` while the object is a `HashMap` key or in a `HashSet` makes the entry unreachable, as shown in the example. Use immutable keys.
- **Tip:** Compiling with `javac -Xlint:overrides` (or `-Xlint:all`) warns when a class overrides `equals()` but not `hashCode()`, for example `BrokenEmployee` above.
- **Pitfall:** `Objects.hash(...)` creates an array and boxes primitives on every call. For performance-critical classes, compute the hash manually (`31 * result + field`) or cache it in an immutable object.

Related: [What is the difference between `equals()` and `==`?](./equals-vs-double-equals.md)

## Key takeaways

- `hashCode()` returns an `int` used by hash-based collections to choose a bucket; `equals()` then finds the exact match.
- Equal objects **must** have equal hash codes; unequal objects **may** share one.
- Always override `equals()` and `hashCode()` together, using the same fields.
- Overriding only `equals()` causes duplicates in `HashSet` and failed lookups in `HashMap`.
- Use `Objects.equals()` and `Objects.hash()`, records, or generated code, and keep hash keys immutable.
