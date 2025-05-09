package com.epam.gym_app.ui.stepdefinition;

import com.epam.gym_app.hooks.ui.UiHooks;
import com.epam.gym_app.ui.factory.ConfigReader;
import com.epam.gym_app.ui.pages.CoachProfilePage;
import com.epam.gym_app.ui.pages.LoginPage;
import com.epam.gym_app.ui.pages.RegistrationPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.testng.Assert;

import java.awt.*;
import java.util.Map;

public class CoachProfileStepDefinitions {

    private final CoachProfilePage coachProfilePage = new CoachProfilePage(UiHooks.getDriver());
    private final RegistrationPage registrationPage = new RegistrationPage(UiHooks.getDriver());
    private final LoginPage loginPage = new LoginPage(UiHooks.getDriver());

    @Given("Coach is on home page")
    public void coachIsOnRegistrationPageWithUrl(){
        coachProfilePage.goToUrl(ConfigReader.getInstance().getProperty("homepage"));
    }

    @And("the coach registers with firstname {string}, lastname {string}, email {string}, password {string}, and confirm new password {string}")
    public void theCoachRegistersWithDetails(String firstName, String lastName, String email, String password, String confirmpassword) throws InterruptedException {
        registrationPage.register(firstName, lastName, email, password, confirmpassword);
        Thread.sleep(10000);
    }

    @When("the coach logs in with username {string} and password {string}")
    public void theCoachLogsIn(String username, String password) throws InterruptedException {
        loginPage.login(username, password);
        Thread.sleep(5000);
    }

    @When("the coach updates the profile details:")
    public void theCoachUpdatesTheProfileDetails(Map<String, String> profileDetails) {
        for (Map.Entry<String, String> entry : profileDetails.entrySet()) {
            String field = entry.getKey().toLowerCase();
            String value = entry.getValue();
            switch (field) {
                case "first name" -> coachProfilePage.setFirstName(value);
                case "last name" -> coachProfilePage.setLastName(value);
                case "about" -> coachProfilePage.setAbout(value);
                case "title" -> coachProfilePage.setTitle(value);
                default -> throw new IllegalArgumentException("Unsupported field: " + field);
            }
        }
    }

    @And("the coach clicks on {string}")
    public void theCoachClicksOn(String buttonName) {
        switch (buttonName.toLowerCase()) {
            case "login" -> coachProfilePage.clicksOnLogin();
            case "save changes" -> coachProfilePage.clicksOnSaveChanges();
            case "logout" -> coachProfilePage.clicksOnLogOut();
            case "change password" -> coachProfilePage.clicksOnChangePassword();
            case "profile icon" -> coachProfilePage.clicksOnProfileIcon();
            case "my account" -> coachProfilePage.clicksOnMyAccount();
            case "signup" -> coachProfilePage.clicksOnSignUp();
            case "close specialization" -> coachProfilePage.clickOnCloseSpecilization();
            default -> throw new IllegalArgumentException("Button with name " + buttonName + " is not defined in the step definition");
        }
    }

    @Then("the coach validates the following profile details:")
    public void theCoachValidatesTheFollowingProfileDetails(Map<String, String> profileDetails) {
        for (Map.Entry<String, String> entry : profileDetails.entrySet()) {
            String field = entry.getKey().toLowerCase();
            String expectedValue = entry.getValue();
            String actualValue = switch (field) {
                case "first name" -> coachProfilePage.getFirstName();
                case "last name" -> coachProfilePage.getLastName();
                case "email" -> coachProfilePage.getEmail();
                case "about" -> coachProfilePage.getAbout();
                case "title" -> coachProfilePage.getTitle();
                default -> throw new IllegalArgumentException("Unsupported field: " + field);
            };
            Assert.assertEquals(actualValue, expectedValue, "Validation failed for field: " + field);
        }
    }

    @And("the coach sets {string} dropdown as {string}")
    public void theCoachSetsDropdownAsValue(String keyword, String value) {
        coachProfilePage.selectFromAutosuggestDropdown(value);
    }

    @And("the coach uploads {string}")
    public void theCoachUploadsFile(String filePath) throws AWTException, InterruptedException {
        coachProfilePage.documentUpload(ConfigReader.getInstance().getProperty(filePath));
        Thread.sleep(10000);
    }


    @And("the coach validates that specialization contains {string}")
    public void theCoachValidatesSpecializationContains(String value) {
        Assert.assertTrue(coachProfilePage.isValuePresentInSpecialization(value), "Dropdown value mismatch!");
    }

    @When("the coach attempts to change the password with:")
    public void theCoachAttemptsToChangeThePasswordWith(Map<String, String> passwordDetails) {
        for (Map.Entry<String, String> entry : passwordDetails.entrySet()) {
            String field = entry.getKey().toLowerCase();
            String value = entry.getValue();
            switch (field) {
                case "old password" -> coachProfilePage.setOldPassword(value);
                case "new password" -> coachProfilePage.setNewPassword(value);
                case "confirm password" -> coachProfilePage.setConfirmNewPassword(value);
                default -> throw new IllegalArgumentException("Unsupported field: " + field);
            }
        }
    }

    @Then("the coach validates the following error details:")
    public void theCoachValidatesTheFollowingErrorDetails(Map<String, String> errorDetails) {
        for (Map.Entry<String, String> entry : errorDetails.entrySet()) {
            String field = entry.getKey().toLowerCase();
            String expectedValue = entry.getValue();
            String actualValue = switch (field) {
                case "status" -> coachProfilePage.getStatus();
                case "statusmessage" -> coachProfilePage.getStatusMessage();
                default -> throw new IllegalArgumentException("Unsupported field: " + field);
            };
            Assert.assertEquals(actualValue , expectedValue, "Validation failed for field: " + field);
        }
    }

    @Then("the coach must not be able to click on save changes button in passwordChange")
    public void theCoachMustNotBeAbleToClickOn(String buttonName) {
        Assert.assertFalse(coachProfilePage.isClickable(),"Button must not be active");
    }

    @Then("the coach validates that they are redirected to the home page")
    public void theCoachValidatesThatTheyAreRedirectedToTheHomePage() {
        Assert.assertEquals("","");
    }

    @And("the coach validates that {string} value contains {string}")
    public void theCoachValidatesThatValueContains(String arg0, String arg1) {
        coachProfilePage.isValuePresentInSpecialization(arg1);
    }

    @And("the {string} must be visible")
    public void theMustBeVisible(String filename) {
        Assert.assertTrue(coachProfilePage.isDocumentPresent(ConfigReader.getInstance().getProperty(filename)),"The filename must be reflected upon successful upload");
    }

    @And("the coach deletes {string}")
    public void theCoachDeletes(String filename) {
        coachProfilePage.removeDocument(ConfigReader.getInstance().getProperty(filename));
    }

    @And("the {string} must not be visible")
    public void theMustNotBeVisible(String filename) {
        Assert.assertFalse(coachProfilePage.isDocumentPresent(ConfigReader.getInstance().getProperty(filename)),"Document must not be present in the upload space");
    }
}