package com.gritlabstudent.user.ms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"spring.kafka.bootstrap-servers=localhost:9093"})

class ApplicationTests {

	@Test
	void contextLoads() {
	}

}
