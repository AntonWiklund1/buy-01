package com.gritlabstudent.media.ms.controller;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.gritlabstudent.media.ms.producer.ProductValidationProducer;


import com.gritlabstudent.media.ms.service.FileStorageService;
import com.gritlabstudent.media.ms.producer.ProductValidationProducer;


@RestController
@RequestMapping("/media")
public class MediaController {
    @Autowired
    private MediaService mediaService;

    @Autowired
    private ProductValidationProducer productValidationProducer;

    @Autowired
    private FileStorageService fileStorageService;


    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam("productId") String productId) {
        // Validate file size and MIME type as before...

        // Temporarily store the file
        fileStorageService.storeFileTemporarily(productId, file);

        // Send productId to Kafka topic for validation
        String uploadRequestId = UUID.randomUUID().toString();
        fileStorageService.storeFileTemporarily(uploadRequestId, file);
        productValidationProducer.sendProductForValidation(productId, uploadRequestId);

        // Respond with an accepted status, actual storage will be done once validation is successful
        return ResponseEntity.accepted().body("File upload request received and is being processed.");
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
    @PreAuthorize("hasAuthority('ROLE_SELLER')")

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