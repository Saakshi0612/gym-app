package com.epam.gym_app.hooks.ui;

import io.cucumber.java.AfterAll;
import io.cucumber.java.BeforeAll;
import com.epam.gym_app.ui.factory.DriverFactory;
import com.epam.gym_app.ui.factory.PropertiesFactory;
import org.openqa.selenium.WebDriver;

import java.util.Properties;

public class UiHooks {
    public static WebDriver driver;
    public static Properties properties;

    @BeforeAll
    public static void setUp(){
        properties = PropertiesFactory.loadProperties("ui");
        driver = DriverFactory.getInstance().getDriver(properties.getProperty("driver"));
        driver.manage().window().maximize();
    }
    @AfterAll
    public static  void tearDown(){
        if (driver != null) {
            driver.quit();
        }
    }

    public static WebDriver getDriver() {
        return driver;
    }
}
