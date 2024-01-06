package com.gritlabstudent.product.ms.service;

import com.gritlabstudent.product.ms.models.Product;
import com.gritlabstudent.product.ms.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;

        this.passwordEncoder = passwordEncoder;

    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            seedProducts();
        }
    }

    private void seedProducts() {

        // My goal is to seed 5 products, all of which are valid

        // product 1
        var p1 = new Product();
        p1.setId("p1");
        p1.setName("product1");
        p1.setDescription("description1 and the product is valid");
        p1.setPrice(1.0);
        p1.setUserId("1");

        // product 2
        var p2 = new Product();
        p2.setId("p2");
        p2.setName("product2");
        p2.setDescription("description2 and the product is valid");
        p2.setPrice(2.0);
        p2.setUserId("1");

        // product 3
        var p3 = new Product();
        p3.setId("p3");
        p3.setName("product3");
        p3.setDescription("description3 and the product is valid");
        p3.setPrice(3.0);
        p3.setUserId("1");

        // product 4
        var p4 = new Product();
        p4.setId("p4");
        p4.setName("product4");
        p4.setDescription("description4 and the product is valid");
        p4.setPrice(4.0);
        p4.setUserId("1");

        // product 5
        var p5 = new Product();
        p5.setId("p5");
        p5.setName("product5");
        p5.setDescription("description5 and the product is valid");
        p5.setPrice(5.0);
        p5.setUserId("1");

        System.out.println("Initial users seeded.");
    }

}
