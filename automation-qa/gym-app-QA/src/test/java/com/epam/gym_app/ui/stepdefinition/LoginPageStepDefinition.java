package com.epam.gym_app.ui.stepdefinition;

import com.epam.gym_app.hooks.ui.UiHooks;
import com.epam.gym_app.ui.pages.LoginPage;
import com.epam.gym_app.ui.pages.RegistrationPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.testng.Assert;

import static com.epam.gym_app.hooks.ui.UiHooks.driver;


public class LoginPageStepDefinition{
    private static final Log log = LogFactory.getLog(LoginPageStepDefinition.class);
    LoginPage loginPage = new LoginPage(UiHooks.getDriver());
    RegistrationPage registrationPage = new RegistrationPage(UiHooks.getDriver());

    @Given("User is on the Login Page")
    public void user_is_on_the_login_page() {
        loginPage.goToUrl("http://team-6-frontend-deployment.s3-website-ap-southeast-1.amazonaws.com/login");
    }

    @Given("User is on the Login Page after registering with Email {string} and Password {string}")
    public void userIsOnTheLoginPageAfterRegisteringWithEmailAndPassword(String emailArgs, String passwordArgs) {
        registrationPage.goToUrl("http://team-6-frontend-deployment.s3-website-ap-southeast-1.amazonaws.com/register");
        registrationPage.enterFirstName("Tushar");
        registrationPage.enterLastName("Anand");
        registrationPage.enterEmail(emailArgs);
        registrationPage.enterPassword(passwordArgs);
        registrationPage.enterConfirmPassword(passwordArgs);
        registrationPage.clickRegistrationButton();
    }

    @When("User enters registered Email {string} and correct Password {string}")
    public void userEntersRegisteredEmailAndCorrectPassword(String emailArgs, String passwordArgs) throws InterruptedException {
        Thread.sleep(10000);
        loginPage.enterEmail(emailArgs);
        loginPage.enterPassword(passwordArgs);
    }

    @And("User clicks on the Login button")
    public void user_clicks_on_the_login_button() throws InterruptedException {
        loginPage.clickLoginButton();
    }

    @Then("User should be redirected to the homepage")
    public void userShouldBeRedirectedToTheHomepageDashboard() throws InterruptedException {
        Thread.sleep(5000);
        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.equals("http://team-6-frontend-deployment.s3-website-ap-southeast-1.amazonaws.com/"));
    }

    @When("User enters registered Email {string} and incorrect Password {string}")
    public void userEntersRegisteredEmailAndIncorrectPassword(String emailArgs, String passwordArgs) throws InterruptedException {
        Thread.sleep(10000);
        loginPage.enterEmail(emailArgs);
        loginPage.enterPassword(passwordArgs);
    }

    @Then("Error message {string} should be displayed for {string} field")
    public void errorMessageShouldBeDisplayed(String expectedMessage, String fieldName) {
        System.out.println(loginPage.getErrorMessage(fieldName,expectedMessage));
    }

    @When("User enters Email {string} and Password {string}")
    public void userEntersEmailAndPassword(String emailArgs, String passwordArgs) {
        loginPage.enterEmail(emailArgs);
        loginPage.enterPassword(passwordArgs);
    }

    @Then("Error message {string} and {string} should be displayed for both email and password field respectively")
    public void errorMessageAndShouldBeDisplayedForBothEmailAndPasswordFieldRespectively(String emailErrorMessage, String passwordErrorMessage) {
        if (loginPage.isEmailEmpty()){
            loginPage.getErrorMessage("email",emailErrorMessage);
        }
        if (loginPage.isPasswordEmpty()){
            loginPage.getErrorMessage("password",passwordErrorMessage);
        }
    }

    @When("User clicks on the Sign Up link")
    public void userClicksOnTheSignUpLink() {
        loginPage.verifySignUpLink();
    }

    @Then("User should be redirected to the Sign Up page")
    public void userShouldBeRedirectedToTheSignUpPage() {
        System.out.println(driver.getCurrentUrl());
    }

    @When("User enters unregistered Email {string} and password {string}")
    public void userEntersUnregisteredEmailAndPassword(String emailArgs, String passwordArgs) {
        loginPage.enterEmail(emailArgs);
        loginPage.enterPassword(passwordArgs);
    }

    @Then("Login page images should be displayed")
    public void loginPageImagesShouldBeDisplayed() {
        System.out.println(loginPage.imageIsDisplayed());
    }


    @Then("All the expected texts should be visible on the Login Page")
    public void allTheExpectedTextsShouldBeVisibleOnTheLoginPage() {
        loginPage.verifyLoginPageTexts();
    }

    @Given("User is logged in")
    public void userIsLoggedIn() {
//        openPage("base.url");
    }


    @When("User clicks on the Logout button")
    public void userClicksOnTheLogoutButton() throws InterruptedException {
        loginPage.loggingOut();
    }

    @Then("User should be redirected to the Home page")
    public void userShouldBeRedirectedToTheHomePage() {
        System.out.println(driver.getCurrentUrl());
    }

}
