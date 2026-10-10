package com.studyloop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class StudyLoopApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudyLoopApplication.class, args);
    }
}
