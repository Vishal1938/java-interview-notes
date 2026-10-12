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
