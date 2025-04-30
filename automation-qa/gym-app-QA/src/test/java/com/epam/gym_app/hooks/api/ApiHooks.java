package com.epam.gym_app.hooks.api;

import com.epam.gym_app.ui.factory.PropertiesFactory;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import com.epam.gym_app.api.utils.HttpMethods;

import java.util.Properties;

public class ApiHooks {
    private static HttpMethods httpMethods;
    public static Properties properties;

    @Before(order = 0)
    public static void setUp() {
        properties = PropertiesFactory.loadProperties("api");
        httpMethods = new HttpMethods();
        System.out.println("API setup is complete");
    }

    @After
    public static void tearDown() {
        httpMethods = null;
        System.out.println("API teardown is complete");
    }

    public static HttpMethods getHttpMethods() {
        return httpMethods;
    }
}