package com.studyloop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {

    /**
     * Java 21 Virtual Thread Executor for high-concurrency background task processing
     * and WebSocket broadcasting.
     */
    @Bean(name = "taskExecutor")
    public TaskExecutor taskExecutor() {
        SimpleAsyncTaskExecutor executor = new SimpleAsyncTaskExecutor("studyloop-vthread-");
        executor.setVirtualThreads(true);
        return executor;
    }
}
