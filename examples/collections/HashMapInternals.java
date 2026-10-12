import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class HashMapInternals {

    // A key whose hashCode always collides, to show how HashMap handles collisions.
    static final class BadKey {
        private final String name;

        BadKey(String name) { this.name = name; }

        @Override
        public int hashCode() { return 42; } // every key lands in the same bucket

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof BadKey)) return false;
            return Objects.equals(name, ((BadKey) o).name);
        }

        @Override
        public String toString() { return name; }
    }

    public static void main(String[] args) {
        Map<BadKey, Integer> map = new HashMap<>();
        map.put(new BadKey("A"), 1);
        map.put(new BadKey("B"), 2);
        map.put(new BadKey("A"), 100); // same hash + equals() true -> value replaced

        System.out.println("size       : " + map.size());
        System.out.println("get(A)     : " + map.get(new BadKey("A")));
        System.out.println("get(B)     : " + map.get(new BadKey("B")));

        // Index calculation used by HashMap: (n - 1) & (h ^ (h >>> 16))
        String key = "java";
        int h = key.hashCode();
        int spread = h ^ (h >>> 16);
        int capacity = 16;
        System.out.println("bucket of \"java\" in a 16-bucket table: " + ((capacity - 1) & spread));
    }
}
