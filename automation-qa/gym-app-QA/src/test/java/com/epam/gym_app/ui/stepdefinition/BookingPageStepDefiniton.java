//package com.epam.gym_app.ui.stepdefinition;
//
//import com.epam.gym_app.hooks.ui.UiHooks;
//import com.epam.gym_app.ui.pages.BookingPage;
//import io.cucumber.java.en.And;
//import io.cucumber.java.en.Given;
//import io.cucumber.java.en.Then;
//import io.cucumber.java.en.When;
//
//import static com.epam.gym_app.hooks.ui.UiHooks.driver;
//import static org.testng.Assert.assertTrue;
//
//public class BookingPageStepDefiniton {
//    BookingPage bookingPage = new BookingPage(UiHooks.getDriver());
//
//    @Given("Client is logged in")
//    public void client_is_logged_in() {
//        bookingPage.goToUrl("http://localhost:5173/");
//        bookingPage.loggingIn();
//    }
//
//
//    @When("Client clicks on the {string} section")
//    public void client_clicks_on_the_section(String name) throws InterruptedException {
//        Thread.sleep(5000);
//        bookingPage.booking(name);
//    }
//
//    @Then("Booking form should be displayed successfully")
//    public void booking_form_should_be_displayed_successfully() {
//        bookingPage.isConfirmButtonEnabled();
//    }
//
//    @Given("Client is not logged in")
//    public void clientIsNotLoggedIn() {
//        bookingPage.goToUrl("http://localhost:5173/");
//    }
//
//    @When("Client tries to access the workout booking form")
//    public void clientTriesToAccessTheWorkoutBookingForm() {
//        bookingPage.booking("Sayantan123 Doe");
//    }
//
//    @Then("User should be prompted to log in")
//    public void userShouldBePromptedToLogInOrSignUp() {
//        assertTrue(bookingPage.isLoginPromptBoxVisible());
//    }
//
//
//    @And("the client has already booked a workout at {string}")
//    public void theClientHasAlreadyBookedAWorkoutAt(String arg0) {
//
//    }
//
//    @When("the client tries to book another workout at {string}")
//    public void theClientTriesToBookAnotherWorkoutAt(String arg0) {
//
//    }
//
//    @Then("an error message {string} should be displayed")
//    public void anErrorMessageShouldBeDisplayed(String arg0) {
//    }
//
//    @Then("a success message should appear on top of the screen")
//    public void aSuccessMessageShouldAppearOnTopOfTheScreen() {
//        // validate the success message
//    }
//
//    @When("the client successfully books a workout")
//    public void theClientSuccessfullyBooksAWorkout() throws InterruptedException {
//        client_clicks_on_the_section("Sayantan123 Doe");
//        booking_form_should_be_displayed_successfully();
//    }
//
//    @Given("the user sees the login required dialog box")
//    public void theUserSeesTheLoginRequiredDialogBox() {
//        clientIsNotLoggedIn();
//        clientTriesToAccessTheWorkoutBookingForm();
//        userShouldBePromptedToLogInOrSignUp();
//    }
//
//    @When("the user clicks the Login button on the dialog")
//    public void theUserClicksTheLoginButtonOnTheDialog() {
//        bookingPage.clickLoginBtn();
//    }
//
//    @Then("the user should be redirected to the login page")
//    public void theUserShouldBeRedirectedToTheLoginPage() {
//        String currentUrl = driver.getCurrentUrl();
//        assertTrue(currentUrl.contains("login"));
//    }
//
//    @Then("all primary UI elements should be visible, properly aligned, and interactable")
//    public void allPrimaryUIElementsShouldBeVisibleProperlyAlignedAndInteractable() {
//        assertTrue(bookingPage.areAllLabelsClearAndVisible());
//    }
//}
//
