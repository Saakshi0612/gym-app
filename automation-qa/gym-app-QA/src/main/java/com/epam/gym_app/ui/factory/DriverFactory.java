package com.epam.gym_app.ui.factory;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class DriverFactory {

    private static DriverFactory driverFactoryInstance = null;
    private static ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();

    private DriverFactory() {}

    public static DriverFactory getInstance() {
        if (driverFactoryInstance == null) {
            synchronized (DriverFactory.class) {
                if (driverFactoryInstance == null) {
                    driverFactoryInstance = new DriverFactory();
                }
            }
        }
        return driverFactoryInstance;
    }

    public WebDriver getDriver(String browserType) {
        if (driverThreadLocal.get() == null) {
            WebDriver driverInstance;
            switch (browserType.toLowerCase()) {
                case "chrome" -> driverInstance = new ChromeDriver();
                case "firefox" -> driverInstance = new FirefoxDriver();
                case "edge" -> driverInstance = new EdgeDriver();
                default -> throw new IllegalArgumentException("Unsupported browser type: " + browserType);
            }
            driverInstance.manage().window().maximize();
            driverThreadLocal.set(driverInstance);
        }
        return driverThreadLocal.get();
    }

    public void quitDriver() {
        if (driverThreadLocal.get() != null) {
            driverThreadLocal.get().quit();
            driverThreadLocal.remove();
        }
    }
}