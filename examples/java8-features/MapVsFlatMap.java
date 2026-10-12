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
