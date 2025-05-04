package com.epam.gym_app.api.stepdefinations;

import com.epam.gym_app.api.models.LoginRequest;
import com.epam.gym_app.api.utils.HttpMethods;
import com.epam.gym_app.hooks.api.ApiHooks;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.util.Arrays;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.testng.Assert.assertEquals;

public class LoginStep {
    private Response response;

    @Given("User attempts to login with email {string} and password {string}")
    public void user_attempts_to_login_with_email_and_password(String email, String password) {
        LoginRequest loginRequest = new LoginRequest.LoginBuilder()
                .email(email)
                .password(password)
                .build();

        String baseUri = ApiHooks.properties.getProperty("base.uri");
        String endpoint = ApiHooks.properties.getProperty("login.endpoint");

        RequestSpecification request = given()
                .baseUri(baseUri)
                .header("content-type","application/json")
                .body(loginRequest);

        HttpMethods httpMethods = ApiHooks.getHttpMethods();
        response = httpMethods.httpRequest("POST",endpoint,request);

        System.out.println("Registration Response: " + response.asPrettyString());
    }

    @Then("Login should be successful with status code {string} and Message {string}")
    public void loginShouldBeSuccessfulWithStatusCodeAndMessage(String statusCode, String expectedMessage) {
        int actualStatusCode = response.getStatusCode();
        String actualMessage = response.jsonPath().getString("message");
        assertEquals(actualStatusCode,Integer.parseInt(statusCode),"StatusCode is not matching");
        assertEquals(actualMessage,expectedMessage,"Message mismatch");
    }

    @Then("Login should fail with status code {string} and Message {string}")
    public void loginShouldFailWithStatusCodeAndMessage(String statusCode, String expectedMessage) {
        int actualStatusCode = response.getStatusCode();
        String actualMessage = response.jsonPath().getString("message");
        assertEquals(actualStatusCode,Integer.parseInt(statusCode),"StatusCode is not matching");
        assertEquals(actualMessage,expectedMessage,"Message mismatch");
    }

    @Given("User attempts to login with an empty request body")
    public void userAttemptsToLoginWithAnEmptyRequestBody() {
        String baseUri = ApiHooks.properties.getProperty("base.uri");
        String endpoint = ApiHooks.properties.getProperty("login.endpoint");

        RequestSpecification request = given()
                .baseUri(baseUri)
                .header("Content-Type", "application/json")
                .body("{}"); // Empty JSON body

        HttpMethods httpMethods = ApiHooks.getHttpMethods();
        response = httpMethods.httpRequest("POST", endpoint, request);

        System.out.println("Login Response (Empty Body): " + response.asPrettyString());
    }

    @Given("User attempts to login with missing password for email {string}")
    public void userAttemptsToLoginWithMissingPasswordForEmail(String email) {
        LoginRequest loginRequest = new LoginRequest.LoginBuilder()
                .email(email)
                .password("") // Empty password
                .build();

        String baseUri = ApiHooks.properties.getProperty("base.uri");
        String endpoint = ApiHooks.properties.getProperty("login.endpoint");

        RequestSpecification request = given()
                .baseUri(baseUri)
                .header("Content-Type", "application/json")
                .body(loginRequest);

        HttpMethods httpMethods = ApiHooks.getHttpMethods();
        response = httpMethods.httpRequest("POST", endpoint, request);

        System.out.println("Login Response (Missing Password): " + response.asPrettyString());
    }

    @Given("User attempts to login with missing email for password {string}")
    public void userAttemptsToLoginWithMissingEmailForPassword(String password) {
        LoginRequest loginRequest = new LoginRequest.LoginBuilder()
                .email("") // Empty email
                .password(password)
                .build();

        String baseUri = ApiHooks.properties.getProperty("base.uri");
        String endpoint = ApiHooks.properties.getProperty("login.endpoint");

        RequestSpecification request = given()
                .baseUri(baseUri)
                .header("Content-Type", "application/json")
                .body(loginRequest);

        HttpMethods httpMethods = ApiHooks.getHttpMethods();
        response = httpMethods.httpRequest("POST", endpoint, request);

        System.out.println("Login Response (Missing Email): " + response.asPrettyString());
    }

    @Then("Login should fail with status code {string} and Message")
    public void loginShouldFailWithStatusCodeAndMessage(String expectedStatusCode) {
        int actualStatusCode = response.getStatusCode();
        List<String> actualMessages = response.jsonPath().getList("errors");
        List<String> expectedMessages = Arrays.asList("Email is required","Password is required");
        assertEquals(actualStatusCode,Integer.parseInt(expectedStatusCode),"StatusCode is not matching");
        assertEquals(actualMessages,expectedMessages,"Message mismatch");
    }

    @Then("Login should fail with status code {string} and proper Message for password field {string}")
    public void loginShouldFailWithStatusCodeAndProperMessageForPasswordField(String expectedStatusCode, String expectedMessage) {
        int actualStatusCode = response.getStatusCode();
        String actualMessage = response.jsonPath().getString("errors[0]");
        assertEquals(actualStatusCode,Integer.parseInt(expectedStatusCode),"StatusCode is not matching");
        assertEquals(actualMessage,expectedMessage,"Message mismatch");
    }

    @Then("Login should fail with status code {string} and proper Message for email field {string}")
    public void loginShouldFailWithStatusCodeAndProperMessageForEmailField(String expectedStatusCode, String expectedMessage) {
        int actualStatusCode = response.getStatusCode();
        String actualMessage = response.jsonPath().getString("errors[0]");
        assertEquals(actualStatusCode,Integer.parseInt(expectedStatusCode),"StatusCode is not matching");
        assertEquals(actualMessage,expectedMessage,"Message mismatch");
    }

    @Then("Login should fail with status code {string} and Message for invalid email {string}")
    public void loginShouldFailWithStatusCodeAndMessageForInvalidEmail(String expectedStatusCode, String expectedMessage) {
        int actualStatusCode = response.getStatusCode();
        String actualMessage = response.jsonPath().getString("errors[0]");
        assertEquals(actualStatusCode,Integer.parseInt(expectedStatusCode),"StatusCode is not matching");
        assertEquals(actualMessage,expectedMessage,"Message mismatch");
    }
}
