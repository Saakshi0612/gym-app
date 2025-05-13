package com.epam.gym_app.ui.factory;

import groovy.util.logging.Log4j2;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Properties;

@Log4j2
public class ConfigReader {
    private static final Logger log= LogManager.getLogger();
    private static ConfigReader configReader;
    private static Properties properties;
    private static final String filePath = "src/test/resources/properties/config.properties";
    private ConfigReader()  {
        properties = new Properties();
        try(InputStream input = Files.newInputStream(Paths.get(filePath))){
            properties.load(input);
        } catch (IOException exception) {
            log.error("File Cannot be found or InputStream is wrong\n{}", Arrays.toString(exception.getStackTrace()));
        }
    }

    public static ConfigReader getInstance(){
        if(configReader==null){
            configReader = new ConfigReader();
        }
        return configReader;
    }

    public void setBrowser(String browser) {
        ConfigReader.properties.setProperty("browser",browser);
    }

    public String getProperty(String key){
        return properties.getProperty(key);
    }
}