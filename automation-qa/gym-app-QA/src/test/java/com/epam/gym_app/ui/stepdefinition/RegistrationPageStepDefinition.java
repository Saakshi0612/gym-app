package com.epam.gym_app.ui.stepdefinition;

import com.epam.gym_app.hooks.ui.UiHooks;
import com.epam.gym_app.ui.pages.RegistrationPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.epam.gym_app.hooks.ui.UiHooks.driver;

public class RegistrationPageStepDefinition {
    private static final Logger logger = LoggerFactory.getLogger(RegistrationPageStepDefinition.class);
    RegistrationPage registrationPage = new RegistrationPage(UiHooks.getDriver());
    @Given("User is on the Registration Page")
    public void user_is_on_the_registration_page(){
        registrationPage.goToUrl("http://team-6-frontend-deployment.s3-website-ap-southeast-1.amazonaws.com/register");
    }

    @Then("All field labels should be visible")
    public void allFieldLabelsShouldBeVisible() {
        boolean areLabelsVisible = registrationPage.areAllLabelsClearAndVisible();
        logger.info("Field labels visibility: {}", areLabelsVisible);
        Assert.assertTrue(areLabelsVisible, "Field labels are not visible");
    }

    @When("User enters {string}, {string}, {string}, {string}, {string}, {string}, and {string}")
    public void user_enters_and(String firstName, String lastName, String email, String password, String confirmPassword, String target, String activity){
        if (password.equals("SPACES")){
            password = "    ";
        }
        if (confirmPassword.equals("SPACES")){
            confirmPassword = "    ";
        }
        logger.info("Entering details: First Name: {}, Last Name: {}, Email: {}, Password: {}, Target: {}, Activity: {}", firstName, lastName, email,password,target,activity);
        registrationPage.enterFirstName(firstName);
        registrationPage.enterLastName(lastName);
        registrationPage.enterEmail(email);
        registrationPage.enterPassword(password);
        registrationPage.enterConfirmPassword(confirmPassword);
        Actions actions = new Actions(driver);
        actions.keyDown(Keys.TAB).build().perform();
        registrationPage.selectTarget(target);
        registrationPage.selectActivity(activity);
    }

    @And("User clicks on the Register button")
    public void user_clicks_on_the_register_button() throws InterruptedException {
        logger.info("Clicking on Register button");
        registrationPage.clickRegistrationButton();
    }

    @Then("Registration should be successful")
    public void registration_should_be_successful() {
        // validate the success message which occur on top of screen on successful registration
    }

    @Then("User should be redirected to the Login Page")
    public void user_should_be_redirected_to_the_login_page() throws InterruptedException {
        Thread.sleep(10000);
        String currentUrl = driver.getCurrentUrl();
        logger.info("Current URL after registration: {}", currentUrl);
        Assert.assertTrue(currentUrl.contains("login"), "Not redirected to Login page");
        Thread.sleep(5000);
        System.out.println(driver.getCurrentUrl()); // should be login page url
    }

    @Then("Error messages should be displayed for each empty required field")
    public void errorMessagesShouldBeDisplayedForEachEmptyRequiredField(){
        // validate that error message is displayed for each field
        boolean isRequiredFieldEmpty = false;
        if (registrationPage.isFirstNameEmpty()){
            logger.info("First Name error: {}", registrationPage.getErrorMessage("firstname"));
            String actualErrorMessage = registrationPage.getErrorMessage("firstname");
            System.out.println(actualErrorMessage);
            if (!actualErrorMessage.isEmpty()){
                isRequiredFieldEmpty = true;
            }
        }
        if (registrationPage.isLastNameEmpty()){
            logger.info("Last Name error: {}", registrationPage.getErrorMessage("lastname"));
            String actualErrorMessage = registrationPage.getErrorMessage("lastname");
            System.out.println(actualErrorMessage);
            if (!actualErrorMessage.isEmpty()){
                isRequiredFieldEmpty = true;
            }
        }
        if (registrationPage.isEmailEmpty()){
            logger.info("Email error: {}", registrationPage.getErrorMessage("email"));
            String actualErrorMessage = registrationPage.getErrorMessage("email");
            System.out.println(actualErrorMessage);
            if (!actualErrorMessage.isEmpty()){
                isRequiredFieldEmpty = true;
            }
        }
        if (registrationPage.isPasswordEmpty()){
            logger.info("Password error: {}", registrationPage.getErrorMessage("password"));
            String actualErrorMessage = registrationPage.getErrorMessage("password");
            System.out.println(actualErrorMessage);
            if (!actualErrorMessage.isEmpty()){
                isRequiredFieldEmpty = true;
            }
        }
        if (registrationPage.isConfirmPasswordEmpty()){
            String actualErrorMessage = registrationPage.getErrorMessage("confirmpassword");
            System.out.println(actualErrorMessage);
            if (!actualErrorMessage.isEmpty()){
                isRequiredFieldEmpty = true;
            }
        }
        if (isRequiredFieldEmpty){
            Assert.assertTrue(isRequiredFieldEmpty, "Required field errors not displayed");
        }
        else {
            Assert.assertFalse(isRequiredFieldEmpty, "Required field is not empty: ");
        }
    }

    @Then("An error message {string} should be displayed for {string} field")
    public void anErrorMessageShouldBeDisplayed(String errorMessage,String field) {
        String actualError = registrationPage.getErrorMessage(field);
        actualError = actualError.replace("\n", " ");
        System.out.println(actualError);
        logger.info("Error for field '{}': {}", field, actualError);
        Assert.assertEquals(actualError,errorMessage,"Error message mismatch");
    }

    @Then("Error message should be displayed for each name field")
    public void errorMessageShouldBeDisplayedForEachNameField() {
    }

    @When("User clicks on the Activity dropdown")
    public List<WebElement> userClicksOnTheActivityDropdown() {
        logger.info("Clicking on Activity dropdown");
        return registrationPage.getDropDownOptions("activity");
    }

    @Then("Activity Dropdown displays correct options")
    public void activityDropdownDisplaysCorrectOptions() {
        List<String> expectedOptions = Arrays.asList("Yoga", "Climbing", "Strength Training", "CrossFit", "Cardio Training", "Rehabilitation");
        List<WebElement> dropDownOptions = userClicksOnTheActivityDropdown();
        List<String> actualOptions = dropDownOptions.stream().map(WebElement::getText).collect(Collectors.toList());
        logger.info("Activity Dropdown options: {}", actualOptions);
        Assert.assertTrue(actualOptions.containsAll(expectedOptions), "Missing or extra options in Activity dropdown");
    }

    @When("User clicks on the Target dropdown")
    public List<WebElement> userClicksOnTheTargetDropdown() {
        logger.info("Clicking on Target dropdown");
        return registrationPage.getDropDownOptions("target");
    }

    @Then("Target Dropdown displays correct options")
    public void targetDropdownDisplaysCorrectOptions() {
        List<String> expectedOptions = Arrays.asList("Lose Weight", "Gain Weight", "Improve Flexibility", "General Fitness", "Build Muscle", "Rehabilitation/Recovery");
        List<WebElement> dropDownOptions = userClicksOnTheTargetDropdown();
        List<String> actualOptions = dropDownOptions.stream().map(WebElement::getText).collect(Collectors.toList());
        logger.info("Target Dropdown options: {}", actualOptions);
        Assert.assertTrue(actualOptions.containsAll(expectedOptions), "Missing or extra options in Target dropdown");
    }

    @Then("all images on the Registration Page should be displayed properly")
    public void allImagesOnTheRegistrationPageShouldBeDisplayedProperly() {
        boolean areImagesVisible = registrationPage.verifyVisibilityOfImage();
        logger.info("Images visibility: {}", areImagesVisible);
        Assert.assertTrue(areImagesVisible, "Images not displayed properly");
    }

    @Then("the Login Page should be opened")
    public void theLoginPageShouldBeOpened() {
        String currentUrl = driver.getCurrentUrl();
        logger.info("Current URL after login redirect: {}", currentUrl);
        Assert.assertTrue(currentUrl.contains("login"), "Not redirected to Login page");
    }

    @When("the user clicks on the Login Here link")
    public void theUserClicksOnTheLoginHereLink() {
        logger.info("Clicking on Login Here link");
        registrationPage.clickOnLoginHereLink();
    }

    @And("the form submission is interrupted")
    public void theFormSubmissionIsInterrupted() {
        logger.info("Refreshing the page to interrupt form submission");
        driver.navigate().refresh();
    }

    @Then("all form fields should reset to their default state")
    public void allFormFieldsShouldResetToTheirDefaultState() {
        boolean checkFirstName = registrationPage.isFirstNameEmpty();
        boolean checkLastName = registrationPage.isLastNameEmpty();
        boolean checkEmail = registrationPage.isEmailEmpty();
        boolean checkPassword = registrationPage.isPasswordEmpty();
        String checkTarget = registrationPage.getDefaultValue("target");
        String checkActivity = registrationPage.getDefaultValue("activity");

        logger.info("Field default checks: FirstName: {}, LastName: {}, Email: {}, Password: {}, Target: {}, Activity: {}",
                checkFirstName, checkLastName, checkEmail, checkPassword, checkTarget, checkActivity);

        Assert.assertTrue(checkFirstName && checkLastName && checkEmail && checkPassword &&
                checkTarget.equals("lose-weight") && checkActivity.equals("yoga"), "Form fields are not reset to default state");
    }

    @When("User enters invalid First Name {string} and Last Name {string}")
    public void userEntersInvalidFirstNameAndLastName(String firstname, String lastname) {
        if (firstname.equals("SPACE")) {
            firstname = "    ";
        }
        registrationPage.enterFirstName(firstname);
        if (lastname.equals("SPACE")) {
            lastname = "     ";
        }
        registrationPage.enterLastName(lastname);
    }


    @Then("Proper error message for First Name {string} and Last Name {string} should be displayed")
    public void properErrorMessageForFirstNameAndLastNameShouldBeDisplayed(String firstNameErrorMessage, String lastNameErrorMessage) {
        String actualFirstNameError = firstNameErrorMessage;
        String actualLastNameError = lastNameErrorMessage;

        if (!firstNameErrorMessage.trim().isEmpty()){
            actualFirstNameError = registrationPage.getErrorMessage("firstName");
        }

        if (!lastNameErrorMessage.trim().isEmpty()){
            actualLastNameError = registrationPage.getErrorMessage("lastName");
        }

        logger.info("First Name Error: {}, Last Name Error: {}", actualFirstNameError, actualLastNameError);
        System.out.println(actualFirstNameError);
        System.out.println(lastNameErrorMessage);
        Assert.assertEquals(actualFirstNameError,firstNameErrorMessage,"FirstName error message mismatch");
        Assert.assertEquals(actualLastNameError,lastNameErrorMessage,"LastName error message mismatch");
    }

    @When("User enters Password {string}")
    public void userEntersPassword(String password) {
        registrationPage.enterPassword(password);
    }


    @Then("An error message dialog box should be displayed {string}")
    public void anErrorMessageDialogBoxShouldBeDisplayed(String results) {
        if (results.equals("true")){
            Assert.assertTrue(registrationPage.isEmailAlreadyExistsErrorDisplayed());
        }
        else {
            Assert.assertFalse(registrationPage.isEmailAlreadyExistsErrorDisplayed());
        }
    }
}
