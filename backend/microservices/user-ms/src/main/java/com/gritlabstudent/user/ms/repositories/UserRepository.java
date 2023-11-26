package com.gritlabstudent.user.ms.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.gritlabstudent.user.ms.models.User;

public interface UserRepository extends MongoRepository<User, String>, PagingAndSortingRepository<User, String>, CrudRepository<User, String> {
    Optional<User> findByName(String username);
}

