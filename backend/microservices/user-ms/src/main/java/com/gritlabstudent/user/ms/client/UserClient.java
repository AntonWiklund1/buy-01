package com.gritlabstudent.user.ms.client;
/**
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


 import com.gritlabstudent.user.ms.models.User;



@Service
public class UserClient {
    private final RestTemplate restTemplate;
    private final String userServiceUrl; // URL of the User Microservice

    public UserClient(RestTemplate restTemplate, @Value("${user.service.url}") String userServiceUrl) {
        this.restTemplate = restTemplate;
        this.userServiceUrl = userServiceUrl;
    }

    public User getUserById(String userId) {
        return restTemplate.getForObject(userServiceUrl + "/users/" + userId, User.class);
    }
}

 */