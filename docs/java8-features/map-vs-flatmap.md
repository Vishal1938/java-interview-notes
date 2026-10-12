---
title: What is the difference between map() and flatMap() in Java Streams?
sidebar_label: map() vs flatMap()
sidebar_position: 1
description: One-to-one vs one-to-many transformations in Java Streams, with a nested list example.
tags: [java8, streams, beginner]
---

# What is the difference between `map()` and `flatMap()` in Java Streams?

> **Short answer:** `map()` transforms **each element into exactly one element** (one-to-one). `flatMap()` transforms each element into a **stream of elements** and then **flattens** all those streams into one (one-to-many). Use `flatMap()` when each element contains a collection you want to unpack.

## Detailed explanation

### `map()`

- Signature: `<R> Stream<R> map(Function<? super T, ? extends R> mapper)`
- Input count = output count.
- Example: `List<String>` → `List<Integer>` of their lengths.

### `flatMap()`

- Signature: `<R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper)`
- The function must return a **`Stream`**, and `flatMap` merges them.
- Example: `List<List<String>>` → one flat `List<String>`.

### The classic mistake

If you use `map()` with a function that returns a stream, you get a `Stream<Stream<String>>`, a stream of streams, which is almost never what you want. That's exactly the problem `flatMap()` solves.

## Code example

```java title="MapVsFlatMap.java"
import java.util.List;
import java.util.stream.Collectors;

public class MapVsFlatMap {
    public static void main(String[] args) {
        List<List<String>> teams = List.of(
                List.of("Asha", "Ravi"),
                List.of("Meera"),
                List.of("Karan", "Neha", "Vik")
        );

        // map: one input -> one output, so we get each team's size
        List<Integer> sizes = teams.stream()
                .map(List::size)
                .collect(Collectors.toList());

        // map with a stream-returning function -> Stream<Stream<String>> (rarely what you want)
        long nestedCount = teams.stream()
                .map(List::stream)
                .count();

        // flatMap: one input -> many outputs, flattened into a single stream
        List<String> everyone = teams.stream()
                .flatMap(List::stream)
                .collect(Collectors.toList());

        System.out.println("map(size)        : " + sizes);
        System.out.println("map(stream) count: " + nestedCount);
        System.out.println("flatMap          : " + everyone);
    }
}
```

**Output:**

```text
map(size)        : [2, 1, 3]
map(stream) count: 3
flatMap          : [Asha, Ravi, Meera, Karan, Neha, Vik]
```

Notice that `map(List::stream)` still has **3** elements (three inner streams), while `flatMap` gives all **6** names in one list.

## Common follow-ups & pitfalls

- **"Does `Optional` have `flatMap()` too?"** Yes. Use it when your mapping function already returns an `Optional`, to avoid `Optional<Optional<T>>`.
- **"How do you split sentences into words?"** `sentences.stream().flatMap(s -> Arrays.stream(s.split(" ")))`.
- **"What's `mapMulti()`?"** Added in Java 16, it's an imperative alternative to `flatMap()` that can be faster when each element produces only a few results.
- **Pitfall:** returning a `List` (not a `Stream`) from the `flatMap` function. It won't compile; call `.stream()` on it.

## Key takeaways

- `map()` → one-to-one.
- `flatMap()` → one-to-many, then flatten.
- If you see `Stream<Stream<T>>` or `Optional<Optional<T>>`, you wanted `flatMap()`.
