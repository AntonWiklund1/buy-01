package AntonW.crudApi.repositories;

import AntonW.crudApi.models.Media;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MediaRepository extends MongoRepository<Media, String> {
    List<Media> findByProductId(String productId);

    void deleteByProductId(String productId);

}
