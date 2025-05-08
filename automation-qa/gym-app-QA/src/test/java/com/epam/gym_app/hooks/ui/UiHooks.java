package com.epam.gym_app.hooks.ui;

import com.epam.gym_app.ui.factory.ConfigReader;
import io.cucumber.java.AfterAll;
import io.cucumber.java.BeforeAll;
import com.epam.gym_app.ui.factory.WebDriverFactory;
import org.openqa.selenium.WebDriver;

public class UiHooks {
    public static WebDriver driver;

    @BeforeAll
    public static void before_all(){
        WebDriverFactory.setThreadLocalDriver(ConfigReader.getInstance().getProperty("browser"));
        driver = WebDriverFactory.getThreadLocalDriver();
        driver.manage().window().maximize();
    }
    @AfterAll
    public static  void after_all(){
        if (driver != null) {
            driver.quit();
        }
    }

    public static WebDriver getDriver() {
        return driver;
    }
}
