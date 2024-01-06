package com.gritlabstudent.media.ms.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document
@Data
public class Media {
    @Id
    private String id;
    private String imagePath;
    private String productId;
}