package com.gritlabstudent.user.ms.services;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.gritlabstudent.user.ms.models.User;
import com.gritlabstudent.user.ms.repositories.UserRepository;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;

    }
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
        }
    }

    private void seedUsers() {

        User user1 = new User();
        user1.setId("1");
        user1.setName("user");
        user1.setEmail("user@example.com");
        user1.setPassword(passwordEncoder.encode("password"));
        user1.setRole("ROLE_CLIENT");

        User user2 = new User();
        user2.setId("2");
        user2.setName("admin");
        user2.setEmail("admin@example.com");
        user2.setPassword(passwordEncoder.encode("password"));
        user2.setRole("ROLE_SELLER");

        userRepository.save(user1);
        userRepository.save(user2);

        System.out.println("Initial users seeded.");
    }



}
