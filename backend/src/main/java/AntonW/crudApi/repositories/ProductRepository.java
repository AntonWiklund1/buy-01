package AntonW.crudApi.repositories;

import AntonW.crudApi.models.Product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ProductRepository extends MongoRepository<Product, String> {
    @Query("{'id': ?0}")
    Optional<Product> findByProduct(Product product);

    @Query("{'userId': ?0}")
    List<Product> findByUserId(String userId);

}