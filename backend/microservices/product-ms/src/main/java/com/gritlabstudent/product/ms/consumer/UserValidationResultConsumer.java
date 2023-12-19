package com.gritlabstudent.product.ms.consumer;

import com.gritlabstudent.product.ms.exceptions.ProductCollectionException;
import com.gritlabstudent.product.ms.models.Product;
import com.gritlabstudent.product.ms.models.ProductCreationRequest;
import com.gritlabstudent.product.ms.service.ProductCreationRequestService;
import com.gritlabstudent.product.ms.service.ProductService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;


//reads from the user-validation-result-topic topic
@Service
public class UserValidationResultConsumer {

    private final ProductService productService;
    private final ProductCreationRequestService productCreationRequestService;

    @Autowired
    public UserValidationResultConsumer(ProductService productService,
                                        ProductCreationRequestService productCreationRequestService) {
        this.productService = productService;
        this.productCreationRequestService = productCreationRequestService;
    }

    @KafkaListener(topics = "user-validation-result-topic", groupId = "product_creation_group")
    public void receiveUserValidationResult(ConsumerRecord<String, String> record) throws ProductCollectionException {
        String requestId = record.key(); // This is the ProductCreationRequest ID
        System.out.println("Received validation result for request ID: " + requestId);

        String userId = record.value(); // This is the User ID
        System.out.println("Received validation result for user ID: " + userId);

        //System.out.println("Received validation result for request ID: " + requestId + ", User ID: " + userId);

        Optional<ProductCreationRequest> creationRequestOptional = productCreationRequestService.getRequestById(requestId);
        if (creationRequestOptional.isPresent()) {
            ProductCreationRequest creationRequest = creationRequestOptional.get();
            if(Objects.equals(userId, "true")) {
                // User ID matches, proceed with product creation
                Product product = creationRequest.getProduct();
                productService.createProduct(product);
            } else {
                // User ID does not match, handle error
                System.out.println("User ID does not match, User ID: " + userId);
            }
        } else {
            System.out.println("Request ID not found: " + requestId);
        }
    }

}
