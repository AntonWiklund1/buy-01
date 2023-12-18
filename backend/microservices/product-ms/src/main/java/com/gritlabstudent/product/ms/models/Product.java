package com.gritlabstudent.product.ms.models;

import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "products")
public class Product {
    @Id
    private String id;

    @NotBlank(message = "Product name cannot be empty")
    @Field
    private String name;

    @NotBlank(message = "Product description cannot be empty")
    @Field
    private String description;

    @NotNull(message = "Product price cannot be null")
    @DecimalMin(value = "0.0", message = "Product price must be greater than or equal to 0")
    @Field
    private Double price;

    @NotNull(message = "Product quantity cannot be null")
    @Min(value = 0, message = "Product quantity must be greater than or equal to 0")
    @Field
    private int quantity;

    @NotBlank(message = "Product userId cannot be empty")
    @Field
    private String userId;

    public void setUserId(String userId) {
        // Trim the userId before setting it
        this.userId = userId != null ? userId.trim() : null;
    }

    public String uuidGenerator() {
        // Implement logic to generate a unique product ID, e.g., using UUID
        return UUID.randomUUID().toString();
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getProductid() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public int getQuantity(){
        return quantity;
    }

    public String getUserid() {
        return userId;
    }

    public void setProductid(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUserid(String userid) {
        this.userId = userid;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getUserId() {
        return userId;
    }
}