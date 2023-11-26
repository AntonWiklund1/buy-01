package com.gritlabstudent.media.ms.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gritlabstudent.media.ms.models.Media;

@Repository
public interface MediaRepository extends MongoRepository<Media, String> {
    List<Media> findByProductId(String productId);

    void deleteByProductId(String productId);

}