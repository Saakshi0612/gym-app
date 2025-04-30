package com.epam.gym_app.api.stepdefinations;

import com.epam.gym_app.api.models.RegistrationRequest;
import com.epam.gym_app.api.utils.HttpMethods;
import com.epam.gym_app.hooks.api.ApiHooks;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

public class RegistrationStep {
    private Response response;

    @Given("User registers with email {string}, firstName {string}, lastName {string}, password {string}, confirmPassword {string}, target {string}, and activity {string}")
    public void user_registers_with_email_first_name_last_name_password_confirm_password_target_and_activity(String email, String firstName, String lastName, String password, String confirmPassword, String target, String activity) {
        // Use the builder pattern to construct the registration request
        RegistrationRequest registrationRequest = new RegistrationRequest.RegisterBuilder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .password(password)
                .confirmPassword(confirmPassword)
                .target(target)
                .activity(activity)
                .build();

        String baseUri = ApiHooks.properties.getProperty("base.uri");
        String endpoint = ApiHooks.properties.getProperty("registration.endpoint");

        // Create the request and set the body (Jackson will handle serialization)
        RequestSpecification request = given()
                .baseUri(baseUri)
                .header("Content-Type", "application/json")
                .body(registrationRequest); // Jackson will serialize this to JSON

        // Perform the HTTP POST request using the custom HttpMethods class
        HttpMethods httpMethods = ApiHooks.getHttpMethods();
        response = httpMethods.httpRequest("POST", endpoint, request);

        System.out.println("Registration Response: " + response.asPrettyString());
    }

//    @Then("Registration should be successful with status code {int}")
//    public void registration_should_be_successful_with_status_code(Integer expectedStatusCode) {
//        int actualStatusCode = response.getStatusCode();
//        assertEquals(actualStatusCode, expectedStatusCode, "Registration failed! Expected status code " + expectedStatusCode + " but got: " + actualStatusCode);
//    }

    public Response getResponse() {
        return response;
    }

    @Given("User tries to register with email {string}, firstName {string}, lastName {string}, password {string}, confirmPassword {string}, target {string}, and activity {string}")
    public void userTriesToRegisterWithEmailFirstNameLastNamePasswordConfirmPasswordTargetAndActivity(String email, String firstName, String lastName, String password, String confirmPassword, String target, String activity) {
        RegistrationRequest registrationRequest = new RegistrationRequest.RegisterBuilder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .password(password)
                .confirmPassword(confirmPassword)
                .target(target)
                .activity(activity)
                .build();

        String baseUri = ApiHooks.properties.getProperty("base.uri");
        String endpoint = ApiHooks.properties.getProperty("registration.endpoint");

        RequestSpecification request = given()
                .baseUri(baseUri)
                .header("Content-Type", "application/json")
                .body(registrationRequest);

        HttpMethods httpMethods = ApiHooks.getHttpMethods();
        response = httpMethods.httpRequest("POST", endpoint, request);

        System.out.println("Registration Response: " + response.asPrettyString());
    }

    @Then("Registration should fail with status code {string} and error message {string}")
    public void registrationShouldFailWithStatusCodeAndErrorMessage(String statusCode, String expectedErrorMessage) {
        int actualStatusCode = response.getStatusCode();
        assertEquals(actualStatusCode, Integer.parseInt(statusCode), "Expected status code" + Integer.parseInt(statusCode) + " but got: " + actualStatusCode);

        String actualMessage = response.jsonPath().getString("errors[0]");
        assertTrue(actualMessage.contains(expectedErrorMessage), "Expected error message not found. Actual: " + actualMessage);
    }

    @Given("User tries to register with missing body {string}")
    public void userTriesToRegisterWithMissingBody(String requestBody) {
        String baseUri = ApiHooks.properties.getProperty("base.uri");
        String endpoint = ApiHooks.properties.getProperty("registration.endpoint");
        RequestSpecification request = given()
                .baseUri(baseUri)
                .header("Content-Type", "application/json")
                .body(requestBody);

        HttpMethods httpMethods = ApiHooks.getHttpMethods();
        response = httpMethods.httpRequest("POST", endpoint, request);

        System.out.println("Registration Response: " + response.asPrettyString());
    }

    @Then("Registration should be successful with status code {string} and message {string}")
    public void registrationShouldBeSuccessfulWithStatusCodeAndMessage(String expectedStatusCode, String expectedMessage) {
        int actualStatusCode = response.getStatusCode();
        String actualMessage = response.jsonPath().getString("message");
        assertEquals(actualStatusCode, Integer.parseInt(expectedStatusCode), "Registration failed! Expected status code " + expectedStatusCode + " but got: " + actualStatusCode);
        assertEquals(actualMessage,expectedMessage,"Message Mismatch");
    }

    @Then("Registration should fail with status code {string} and proper Error Message should be shown")
    public void registrationShouldFailWithStatusCodeAndProperErrorMessageShouldBeShown(String statusCode) {
        int actualStatusCode = response.getStatusCode();
        List<String> errorMessages = response.jsonPath().getList("errors");
        List<String> expectedMessages = Arrays.asList("Email is required","First name Name is required","Last name Name is required","Password is required");
        assertEquals(actualStatusCode,Integer.parseInt(statusCode),"Status code mismatch: Expected: " + Integer.parseInt(statusCode) + " got: " + actualStatusCode);
        assertEquals(errorMessages,expectedMessages,"Message Mismatch");
    }

    @Then("Registration should fail with status code {string} and error message {string} for already registered email")
    public void registrationShouldFailWithStatusCodeAndErrorMessageForAlreadyRegisteredEmail(String expectedStatusCode, String expectedMessage) {
        int actualStatusCode = response.getStatusCode();
        String actualMessage = response.jsonPath().getString("message");
        assertEquals(actualStatusCode, Integer.parseInt(expectedStatusCode), "Registration failed! Expected status code " + expectedStatusCode + " but got: " + actualStatusCode);
        assertEquals(actualMessage,expectedMessage,"Message Mismatch");
    }
}