package com.gritlabstudent.media.ms.controller;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gritlabstudent.media.ms.models.Media;
import com.gritlabstudent.media.ms.service.MediaService;

@RestController
@RequestMapping("/media")
public class MediaController {
    @Autowired
    private MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
            @RequestParam("productId") String productId) {
        // Validate file size
        final long MAX_SIZE = 2 * 1024 * 1024; // 2 MB
        if (file.getSize() > MAX_SIZE) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body("File size should not exceed 2 MB");
        }

        // Validate MIME type to only allow image uploads
        String mimeType = file.getContentType();
        if (mimeType == null || !mimeType.startsWith("image")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body("Only image files are allowed");
        }

        // Proceed with storing the file if the checks pass
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
            String message = "Media deleted for the product with ID: " + productId;
            return ResponseEntity.ok().body(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred: " + e.getMessage());
        }
    }

    private final String mediaPath = Paths.get("media").toAbsolutePath().toString();


    @GetMapping("/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource file = new FileSystemResource(Paths.get(mediaPath, filename));
        if (!file.exists() || !file.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(file);
    }

    //serve files form /media/avatars
    @GetMapping("/avatars/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveAvatar(@PathVariable String filename) {
        Resource file = new FileSystemResource(Paths.get(mediaPath, "avatars", filename));
        if (!file.exists() || !file.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(file);
    }
    @KafkaListener(topics = "user_deletion")
    public void listenUserDeletion(String userId) {
        try {
            mediaService.deleteMediaByUserId(userId);
        } catch (Exception e) {
            //for errors
        }
    }
    
}