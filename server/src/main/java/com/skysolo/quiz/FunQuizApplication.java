package com.skysolo.quiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FunQuizApplication {

	public static void main(String[] args) {
		SpringApplication.run(FunQuizApplication.class, args);
	}

}
