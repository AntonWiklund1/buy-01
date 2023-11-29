package com.gritlabstudent.user.ms.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.gritlabstudent.user.ms.models.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByName(String username);
}
