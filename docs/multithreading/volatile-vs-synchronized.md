---
title: What is the difference between volatile and synchronized?
sidebar_label: volatile vs synchronized
sidebar_position: 1
description: Visibility vs atomicity in Java concurrency, shown with a counter race between volatile, synchronized and AtomicInteger.
tags: [multithreading, concurrency, intermediate]
---

# What is the difference between `volatile` and `synchronized`?

> **Short answer:** `volatile` guarantees **visibility**: every thread sees the latest value of a variable. It does **not** make compound operations like `count++` atomic. `synchronized` guarantees **both visibility and atomicity** by letting only one thread at a time run a block of code, at the cost of locking.

## Detailed explanation

### The two problems in concurrent code

1. **Visibility:** one thread updates a variable, but another thread keeps reading a stale cached copy.
2. **Atomicity:** an operation that looks like one step is really several. `count++` is *read → add 1 → write*, and two threads can interleave those steps and lose updates.

### `volatile`

- Applies to **variables** only.
- Reads and writes go to main memory and establish a *happens-before* relationship, so updates are visible to all threads.
- No locking, so it's cheap.
- ✅ Good for: flags like `volatile boolean running`, or a value written by one thread and read by others.
- ❌ Not enough for: `count++`, check-then-act, or anything that reads and then writes based on the read.

### `synchronized`

- Applies to **methods or blocks**.
- A thread must acquire the object's **monitor lock**. Others wait.
- Entering and exiting the block also flushes memory, so it provides visibility too.
- ✅ Solves both visibility and atomicity.
- ❌ Threads block each other, so it can reduce throughput and, if used carelessly, cause deadlocks.

### A third option: `AtomicInteger`

Classes in `java.util.concurrent.atomic` use lock-free **CAS (compare-and-swap)** instructions, giving atomic updates to a single variable without blocking.

## Code example

Two threads each increment three counters 100,000 times.

```java title="VolatileVsSynchronized.java"
import java.util.concurrent.atomic.AtomicInteger;

public class VolatileVsSynchronized {

    private volatile int volatileCount = 0;      // visible, but ++ is NOT atomic
    private int syncCount = 0;                   // guarded by synchronized
    private final AtomicInteger atomicCount = new AtomicInteger();

    private synchronized void incrementSync() { syncCount++; }

    public static void main(String[] args) throws InterruptedException {
        VolatileVsSynchronized demo = new VolatileVsSynchronized();

        Runnable task = () -> {
            for (int i = 0; i < 100_000; i++) {
                demo.volatileCount++;            // read-modify-write race
                demo.incrementSync();
                demo.atomicCount.incrementAndGet();
            }
        };

        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start(); t2.start();
        t1.join();  t2.join();

        System.out.println("expected      : 200000");
        System.out.println("volatile      : " + demo.volatileCount + "  (usually less!)");
        System.out.println("synchronized  : " + demo.syncCount);
        System.out.println("AtomicInteger : " + demo.atomicCount.get());
    }
}
```

**Output** (the `volatile` number changes from run to run):

```text
expected      : 200000
volatile      : 199823  (usually less!)
synchronized  : 200000
AtomicInteger : 200000
```

## Comparison

| | `volatile` | `synchronized` | `AtomicInteger` |
| --- | --- | --- | --- |
| Applies to | Variables | Methods / blocks | Single variable |
| Visibility | ✅ | ✅ | ✅ |
| Atomicity | ❌ | ✅ | ✅ (single ops) |
| Blocking | No | Yes | No (CAS) |
| Typical use | Status flags | Multi-step critical sections | Counters, sequences |

## Common follow-ups & pitfalls

- **"Is `volatile` enough for double-checked locking in a Singleton?"** Yes, the instance field must be `volatile` so other threads never see a partially constructed object.
- **"Can a `synchronized` method be static?"** Yes, then it locks on the `Class` object instead of the instance.
- **"What's `ReentrantLock` and when is it better?"** It offers `tryLock()`, timeouts, fairness and multiple conditions that `synchronized` doesn't.
- **Pitfall:** marking a counter `volatile` and assuming it's thread-safe.

## Key takeaways

- `volatile` = visibility only.
- `synchronized` = visibility + atomicity, using a lock.
- For a single counter, `AtomicInteger` is usually the best of both.
