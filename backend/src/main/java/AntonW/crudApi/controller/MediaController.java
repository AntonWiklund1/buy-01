package AntonW.crudApi.controller;

import AntonW.crudApi.models.Media;
import AntonW.crudApi.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/media")
public class MediaController {
    @Autowired
    private MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
            @RequestParam("productId") String productId) {
        try {
            Media savedMedia = mediaService.storeFile(file, productId);
            return new ResponseEntity<>(savedMedia, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload the file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error occurred: " + e.getMessage());
        }
    }

    // Other REST endpoints as needed

    // Inside MediaController.java
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Media>> getMediaForProduct(@PathVariable String productId) {
        List<Media> mediaFiles = mediaService.getMediaByProductId(productId);
        if (mediaFiles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(mediaFiles, HttpStatus.OK);
    }


    @DeleteMapping("/product/{productId}")
    public ResponseEntity<?> deleteMediaForProduct(@PathVariable String productId) {
        try {
            mediaService.deleteMediaByProductId(productId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred: " + e.getMessage());
        }
    }
}
