package com.epam.gym_app.ui.runner;

import com.epam.gym_app.ui.factory.ConfigReader;
import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Parameters;

@CucumberOptions(
        features = "src/test/resources/features/ui",
        glue = {"com.epam.gym_app.ui.stepdefinition", "com.epam.gym_app.hooks.ui"},
        plugin = {
                "pretty",
                "html:target/cucumber-reports.html",
                "json:target/cucumber-reports.json",
                "io.qameta.allure.cucumber7jvm.AllureCucumber7Jvm"
        }
)

public class UIRunner extends AbstractTestNGCucumberTests {

        @BeforeTest
        @Parameters({"Browser"})
        void browserSet(String browserType){
                ConfigReader.getInstance().setBrowser(browserType);
        }
}
