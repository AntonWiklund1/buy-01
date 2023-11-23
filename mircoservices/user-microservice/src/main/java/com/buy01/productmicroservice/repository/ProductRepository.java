package com.buy01.productmicroservice.repository;

import com.buy01.productmicroservice.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface ProductRepository extends MongoRepository<Product, String>{


}
