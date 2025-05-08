package com.epam.gym_app.ui.stepdefinition;

import com.epam.gym_app.hooks.ui.UiHooks;
import com.epam.gym_app.ui.factory.ConfigReader;
import com.epam.gym_app.ui.pages.UserProfilePage;
import com.epam.gym_app.ui.pages.LoginPage;
import com.epam.gym_app.ui.pages.RegistrationPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.testng.Assert;

import java.util.Map;

public class UserProfileStepDefinition {

    private final UserProfilePage userProfilePage = new UserProfilePage(UiHooks.getDriver());
    private final RegistrationPage registrationPage = new RegistrationPage(UiHooks.getDriver());
    private final LoginPage loginPage = new LoginPage(UiHooks.getDriver());

    @Given("User is on home page with url")
    public void userIsOnHomePageWithUrl(){
        userProfilePage.goToUrl(ConfigReader.getInstance().getProperty("homepage"));
    }

    @And("the User registers with firstname {string}, lastname {string}, email {string}, password {string}, and confirm new password {string}")
    public void theUserRegistersWithDetails(String firstName, String lastName, String email, String password, String confirmPassword) throws InterruptedException {
        registrationPage.register(firstName, lastName, email, password, confirmPassword);
        Thread.sleep(10000);
    }

    @When("the User logs in with username {string} and password {string}")
    public void theUserLogsIn(String username, String password) throws InterruptedException {
        loginPage.login(username, password);
        Thread.sleep(5000);
    }

    @And("the User clicks on {string}")
    public void theUserClicksOn(String buttonName) {
        switch (buttonName.toLowerCase()) {
            case "login" -> userProfilePage.clicksOnLogin();
            case "save changes" -> userProfilePage.clicksOnSaveChanges();
            case "logout" -> userProfilePage.clicksOnLogOut();
            case "change password" -> userProfilePage.clicksOnChangePassword();
            case "profile icon" -> userProfilePage.clicksOnProfileIcon();
            case "my account" -> userProfilePage.clicksOnMyAccount();
            case "signup" -> userProfilePage.clicksOnSignUp();
            default -> throw new IllegalArgumentException("Button with name " + buttonName + " is not defined in the step definition");
        }
    }

    @Then("the User validates the following profile details:")
    public void theUserValidatesTheFollowingProfileDetails(Map<String, String> profileDetails) {
        for (Map.Entry<String, String> entry : profileDetails.entrySet()) {
            String field = entry.getKey().toLowerCase();
            String expectedValue = entry.getValue();
            String actualValue = switch (field) {
                case "first name" -> userProfilePage.getFirstName();
                case "last name" -> userProfilePage.getLastName();
                case "email" -> userProfilePage.getEmail();
                default -> throw new IllegalArgumentException("Unsupported field: " + field);
            };
            Assert.assertEquals(actualValue, expectedValue, "Validation failed for field: " + field);
        }
    }

    @When("the User updates the profile details:")
    public void theUserUpdatesTheProfileDetails(Map<String, String> profileDetails) {
        for (Map.Entry<String, String> entry : profileDetails.entrySet()) {
            String field = entry.getKey().toLowerCase();
            String value = entry.getValue();
            switch (field) {
                case "first name" -> userProfilePage.setFirstName(value);
                case "last name" -> userProfilePage.setLastName(value);
                default -> throw new IllegalArgumentException("Unsupported field: " + field);
            }
        }
    }

    @When("the User attempts to change the password with:")
    public void theUserAttemptsToChangeThePasswordWith(Map<String, String> passwordDetails) {
        for (Map.Entry<String, String> entry : passwordDetails.entrySet()) {
            String field = entry.getKey().toLowerCase();
            String value = entry.getValue();
            switch (field) {
                case "old password" -> userProfilePage.setOldPassword(value);
                case "new password" -> userProfilePage.setNewPassword(value);
                case "confirm password" -> userProfilePage.setConfirmNewPassword(value);
                default -> throw new IllegalArgumentException("Unsupported field: " + field);
            }
        }
    }


    @Then("the User must not be able to click on save changes button in passwordChange")
    public void theUserMustNotBeAbleToClickOn(String buttonName) {
        Assert.assertTrue(userProfilePage.isClickable(),"Button must not be active");
    }

    @Then("the User validates that they are redirected to the home page")
    public void theUserValidatesThatTheyAreRedirectedToTheHomePage() {
//        Assert.assertEquals("","");
    }

    @Then("the User validates the following error details:")
    public void theUserValidatesTheFollowingErrorDetails(Map<String, String> errorDetails) {
        for (Map.Entry<String, String> entry : errorDetails.entrySet()) {
            String field = entry.getKey().toLowerCase();
            String expectedValue = entry.getValue();
            String actualValue = switch (field) {
                case "status" -> userProfilePage.getStatus();
                case "statusmessage" -> userProfilePage.getStatusMessage();
                default -> throw new IllegalArgumentException("Unsupported field: " + field);
            };
            Assert.assertEquals(actualValue , expectedValue, "Validation failed for field: " + field);
        }
    }
}
