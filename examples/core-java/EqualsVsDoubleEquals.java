public class EqualsVsDoubleEquals {
    public static void main(String[] args) {
        String a = "java";              // goes to the String pool
        String b = "java";              // reuses the same pooled object
        String c = new String("java");  // forces a new object on the heap

        System.out.println("a == b      : " + (a == b));       // same reference
        System.out.println("a == c      : " + (a == c));       // different objects
        System.out.println("a.equals(c) : " + a.equals(c));    // same content
        System.out.println("a == c.intern() : " + (a == c.intern()));

        Integer x = 127, y = 127;   // cached by Integer.valueOf (-128..127)
        Integer p = 128, q = 128;   // outside the cache -> new objects
        System.out.println("127 == 127  : " + (x == y));
        System.out.println("128 == 128  : " + (p == q));
        System.out.println("128 equals  : " + p.equals(q));
    }
}
