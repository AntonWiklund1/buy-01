package AntonW.crudApi.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import AntonW.crudApi.models.User;
import AntonW.crudApi.models.Product;
import AntonW.crudApi.repositories.UserRepository;
import AntonW.crudApi.repositories.ProductRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;

    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
        }

        if (productRepository.count() == 0) {
            seedProducts();
        }

    }

    private void seedUsers() {

        User user1 = new User();
        user1.setId("1");
        user1.setName("user");
        user1.setEmail("user@example.com");
        user1.setPassword(passwordEncoder.encode("password"));
        user1.setRole("ROLE_USER");

        User user2 = new User();
        user2.setId("2");
        user2.setName("admin");
        user2.setEmail("admin@example.com");
        user2.setPassword(passwordEncoder.encode("password"));
        user2.setRole("ROLE_ADMIN");

        userRepository.save(user1);
        userRepository.save(user2);

        System.out.println("Initial users seeded.");
    }

    private void seedProducts() {

        Product product1 = new Product();
        product1.setProductid("1");
        product1.setName("Product 1");
        product1.setPrice(100.0);
        product1.setDescription("This is product 1");
        product1.setUserid("1");

        Product product2 = new Product();
        product2.setProductid("2");
        product2.setName("Product 2");
        product2.setPrice(200.0);
        product2.setDescription("This is product 2");
        product2.setUserid("2");

        productRepository.save(product1);
        productRepository.save(product2);

        System.out.println("Initial products seeded.");

    }

}
