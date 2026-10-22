---
title: What is the Adapter design pattern in Java?
sidebar_label: Adapter Pattern
sidebar_position: 1
description: Understand the Adapter design pattern in Java, its participants, object vs class adapters, real JDK examples, and how it differs from Decorator, Facade, and Proxy.
tags: [design-patterns, structural-patterns, adapter, oops, intermediate]
---

# What is the Adapter design pattern in Java?

> **Short answer:** The Adapter pattern is a **structural** design pattern that lets two classes with incompatible interfaces work together. An adapter class implements the interface the client expects (the **target**) and translates each call into a call on an existing class (the **adaptee**). It works like a travel plug adapter: neither the socket nor the plug changes, and the adapter sits between them.

## Detailed explanation

### The problem it solves

Sometimes you need to use an existing class, such as a legacy class or a third-party library, but its methods do not match the interface your code is written against.

- You cannot change the existing class (you do not own it, or other code depends on it).
- You do not want to change your client code to depend on that class directly.
- An adapter converts one interface into the other, so both sides stay unchanged.

### Participants

| Participant | Role |
| --- | --- |
| **Target** | The interface the client code expects and calls |
| **Adaptee** | The existing class with a useful but incompatible interface |
| **Adapter** | Implements the target and translates calls to the adaptee |
| **Client** | Works only with the target interface and does not know about the adaptee |

The adapter can also convert data along the way, such as units, formats, parameter order, or exception types.

### Object adapter vs class adapter

There are two ways to build an adapter:

- **Object adapter (composition):** the adapter implements the target and **holds a reference** to an adaptee object. This is the usual choice in Java.
- **Class adapter (inheritance):** the adapter **extends** the adaptee and implements the target. Because Java supports only single class inheritance, this works only when the target is an interface, and it ties the adapter to one concrete adaptee class.

| Aspect | Object adapter | Class adapter |
| --- | --- | --- |
| Built with | Composition (has-a) | Inheritance (is-a) |
| Works with adaptee subclasses | Yes, any adaptee object can be passed in | No, tied to one concrete class |
| Can override adaptee behavior | No, only call it | Yes |
| Exposes adaptee methods to the client | No | Yes, all public adaptee methods are inherited |
| Preferred in Java | Yes | Rarely |

### Adapter pattern in the JDK

- **`InputStreamReader`** adapts a byte-based `InputStream` to the character-based `Reader` interface. `OutputStreamWriter` does the same for output.
- **`Arrays.asList(...)`** adapts an array to the `List` interface. The list is backed by the array, so changes to one are visible in the other.
- **`Collections.enumeration(...)`** adapts a `Collection` to the legacy `Enumeration` interface, and `Collections.list(...)` goes the other way.

### When to use it

- Integrating a third-party or legacy class whose interface does not match your code.
- Reusing several existing classes that do similar work but have different method names or signatures, behind one common interface.
- Keeping vendor-specific code in one place, so switching vendors means writing a new adapter instead of changing client code.

### Adapter vs similar patterns

| Pattern | Interface seen by the client | Main purpose |
| --- | --- | --- |
| **Adapter** | A **different** interface from the wrapped object | Make incompatible interfaces work together |
| **Decorator** | The **same** interface as the wrapped object | Add behavior without changing the interface |
| **Proxy** | The **same** interface as the wrapped object | Control access (lazy loading, security, remote calls, caching) |
| **Facade** | A **new, simpler** interface over many classes | Simplify a complex subsystem |

## Code example

```java title="AdapterPatternExample.java"
// Target: the interface our application code expects
interface PaymentProcessor {
    void pay(double amountInRupees);
}

// Adaptee: an existing third-party class we cannot change
class LegacyPaymentGateway {
    void makePayment(long amountInPaise, String currency) {
        System.out.println("Legacy gateway charged " + amountInPaise + " paise in " + currency);
    }
}

// Object adapter: implements the target and wraps the adaptee
class PaymentGatewayAdapter implements PaymentProcessor {
    private final LegacyPaymentGateway gateway;

    PaymentGatewayAdapter(LegacyPaymentGateway gateway) {
        this.gateway = gateway;
    }

    @Override
    public void pay(double amountInRupees) {
        long paise = Math.round(amountInRupees * 100); // Convert the data format
        gateway.makePayment(paise, "INR");             // Translate the call
    }
}

// Class adapter: extends the adaptee and implements the target
class PaymentGatewayClassAdapter extends LegacyPaymentGateway implements PaymentProcessor {
    @Override
    public void pay(double amountInRupees) {
        makePayment(Math.round(amountInRupees * 100), "INR");
    }
}

// Client: depends only on the target interface
class CheckoutService {
    private final PaymentProcessor processor;

    CheckoutService(PaymentProcessor processor) {
        this.processor = processor;
    }

    void checkout(double total) {
        System.out.println("Checking out order of Rs. " + total);
        processor.pay(total);
    }
}

public class AdapterPatternExample {
    public static void main(String[] args) {
        PaymentProcessor objectAdapter = new PaymentGatewayAdapter(new LegacyPaymentGateway());
        new CheckoutService(objectAdapter).checkout(249.99);

        PaymentProcessor classAdapter = new PaymentGatewayClassAdapter();
        new CheckoutService(classAdapter).checkout(100);
    }
}
```

**Output:**

```text
Checking out order of Rs. 249.99
Legacy gateway charged 24999 paise in INR
Checking out order of Rs. 100.0
Legacy gateway charged 10000 paise in INR
```

`CheckoutService` never refers to `LegacyPaymentGateway`. If the business switches to another payment provider, only a new adapter is needed.

## Common follow-ups & pitfalls

- **"Is Adapter a creational, structural, or behavioral pattern?"** Structural. It is about how classes and objects are composed.
- **"Which is better, an object adapter or a class adapter?"** Usually the object adapter. It follows "favor composition over inheritance", works with any subclass of the adaptee, and does not expose the adaptee's methods to the client.
- **"What is the difference between Adapter and Decorator?"** An adapter changes the interface; a decorator keeps the same interface and adds behavior.
- **"Give a real example from the JDK."** `InputStreamReader` (bytes to characters) and `Arrays.asList` (array to `List`).
- **"What is a two-way adapter?"** An adapter that implements both interfaces, so it can be used wherever either one is expected.
- **Pitfall:** An adapter should only translate. Putting business logic in it makes the code harder to understand and test.
- **Pitfall:** `Arrays.asList` returns a fixed-size list. Calling `add()` or `remove()` throws `UnsupportedOperationException`, because the underlying array cannot grow or shrink.
- **Pitfall:** If you control both classes, changing one of them to match the other may be simpler than adding an adapter. Adapters are most useful when one side cannot change.

## Key takeaways

- The Adapter pattern converts one interface into another that the client expects, so incompatible classes can work together.
- Its participants are the target, adaptee, adapter, and client.
- An object adapter uses composition and is preferred; a class adapter uses inheritance.
- `InputStreamReader` and `Arrays.asList` are well-known JDK adapters.
- Adapter changes an interface, Decorator and Proxy keep it, and Facade simplifies many interfaces into one.
