package com.gritlabstudent.product.ms.controller;

import com.gritlabstudent.product.ms.models.ProductCreationRequest;
import com.gritlabstudent.product.ms.models.ProductCreationStatus;
import com.gritlabstudent.product.ms.producer.UserValidationProducer;
import com.gritlabstudent.product.ms.service.ProductCreationRequestService;
import com.gritlabstudent.product.ms.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.gritlabstudent.product.ms.exceptions.ProductCollectionException;
import com.gritlabstudent.product.ms.models.Product;

import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final UserValidationProducer userValidationProducer;
    private final ProductCreationRequestService productCreationRequestService;

    @Autowired
    public ProductController(ProductService productService,
                             UserValidationProducer userValidationProducer,
                             ProductCreationRequestService productCreationRequestService) {
        this.productService = productService;
        this.userValidationProducer = userValidationProducer;
        this.productCreationRequestService = productCreationRequestService;
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        ProductCreationRequest request = new ProductCreationRequest(product, ProductCreationStatus.PENDING_VALIDATION);
        request = productCreationRequestService.saveRequest(request);
        String requestId = request.getId();
        String userId = product.getUserId();

        userValidationProducer.sendUserIdForValidation(requestId, userId);

        // Acknowledge the request to the client
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Product creation request received, pending user validation.");
        response.put("requestId", request.getId());  // Some identifier for the client to refer to
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            Iterable<Product> products = productService.getAllProducts();
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProductsByUser(@PathVariable String userId) {
        try {
            if (!isValidInput(userId)) {
                return new ResponseEntity<>("Invalid user ID", HttpStatus.BAD_REQUEST);
            }
            Iterable<Product> products = productService.getProductsByUserId(userId);
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable("id") String id, @RequestBody Product product) {
        try {
            productService.updateProduct(id, product);
            return new ResponseEntity<>("Updated product with ID " + id, HttpStatus.OK);
        } catch (ConstraintViolationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") String id) {
        try {
            productService.deleteProduct(id);
            return new ResponseEntity<>("Successfully deleted product with ID " + id, HttpStatus.OK);
        } catch (ProductCollectionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id") String id) {
        Product product = productService.getProductById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }
    //@KafkaListener(topics = "user_deletion")
    //public void listenUserDeletion(String userId) {
        //try {
            //productService.deleteProductsByUserId(userId);
        //} catch (Exception e) {
            //for errors implement here
        //}
    //}

    private boolean isValidInput(String input) {
        return input != null && !input.isEmpty() && !input.contains("$") && !input.contains("{") && !input.contains("}");
    }
}