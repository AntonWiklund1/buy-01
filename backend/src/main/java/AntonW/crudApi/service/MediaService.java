package AntonW.crudApi.service;

import AntonW.crudApi.models.Media;
import AntonW.crudApi.repositories.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class MediaService {
    @Autowired
    private MediaRepository mediaRepository;

    private final Path rootLocation = Paths.get("media");

    public Media storeFile(MultipartFile file, String productId) throws IOException {
        // Store the file on the server
        Files.copy(file.getInputStream(), this.rootLocation.resolve(file.getOriginalFilename()));

        // Create a new media object and save it to the database
        Media media = new Media();
        media.setImagePath(this.rootLocation.resolve(file.getOriginalFilename()).toString());
        media.setProductId(productId);
        
        return mediaRepository.save(media);
    }
    
    // Additional methods
}
