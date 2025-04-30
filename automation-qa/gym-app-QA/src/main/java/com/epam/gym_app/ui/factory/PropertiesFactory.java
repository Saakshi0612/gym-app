package com.epam.gym_app.ui.factory;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class PropertiesFactory {

    private static final String PROPERTIES_PATH = "C:\\gym-app\\automation-qa\\gym-app-QA\\src\\test\\resources\\properties\\";

    public static Properties loadProperties(String webpage) {
        Properties properties = new Properties();
        try {
            String filePath = PROPERTIES_PATH + webpage.toLowerCase() + ".properties";
            FileInputStream fileInputStream = new FileInputStream(filePath);
            properties.load(fileInputStream);
            fileInputStream.close();
        } catch (IOException e) {
            throw new RuntimeException("Failed to load properties file for " + webpage, e);
        }
        return properties;
    }
}