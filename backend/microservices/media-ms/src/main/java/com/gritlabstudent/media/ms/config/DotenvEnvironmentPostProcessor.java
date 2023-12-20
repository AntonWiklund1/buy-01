package com.gritlabstudent.media.ms.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String DOTENV_PATH = "../../.env";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        try {
            File file = ResourceUtils.getFile(DOTENV_PATH);
            Path dotenvFilePath = file.toPath();

            if (Files.exists(dotenvFilePath)) {
                System.out.println("Loading .env file from: " + dotenvFilePath);
                FileSystemResource resource = new FileSystemResource(dotenvFilePath.toString());
                Properties dotenvProperties = PropertiesLoaderUtils.loadProperties(resource);
                environment.getPropertySources().addFirst(new PropertiesPropertySource("dotenvProperties", dotenvProperties));
            } else {
                System.out.println("Could not find .env file at: " + dotenvFilePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not load .env file", e);
        }
    }
}
