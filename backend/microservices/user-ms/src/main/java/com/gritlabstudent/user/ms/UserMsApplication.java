package com.gritlabstudent.user.ms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserMsApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserMsApplication.class, args);
	}
	@Autowired
	public void sendToTopic(String topic, String payload) {
        kafkaTemplate.send(topic, payload);
    }

}
