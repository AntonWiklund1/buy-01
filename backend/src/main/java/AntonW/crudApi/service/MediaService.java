package AntonW.crudApi.service;

import AntonW.crudApi.models.Media;
import AntonW.crudApi.repositories.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@Service
public class MediaService {
    private static final Logger log = LoggerFactory.getLogger(MediaService.class);


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

    // get media by product id
    public List<Media> getMediaByProductId(String productId) {
        return mediaRepository.findByProductId(productId);
    }

    // delete media by product id
    public void deleteMediaByProductId(String productId) {
        List<Media> mediaFiles = mediaRepository.findByProductId(productId);

        for (Media media : mediaFiles) {
            Path fileToDeletePath = null;
            try {
                fileToDeletePath = rootLocation.resolve(media.getImagePath());
                Files.deleteIfExists(fileToDeletePath);
            } catch (IOException e) {
                log.error("Failed to delete file: " + fileToDeletePath, e);
            }
        }

        mediaRepository.deleteByProductId(productId);
    }


    // Additional methods
}
