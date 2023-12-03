package com.gritlabstudent.user.ms.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gritlabstudent.user.ms.models.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByName(String username);
}
