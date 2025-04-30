package com.epam.gym_app.ui.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class LoginPage extends BasePage{
    public LoginPage(WebDriver driver) {
        super(driver);
    }

    @FindBy(id = "email")
    private WebElement txtEmail;

    @FindBy(id = "password")
    private WebElement txtPassword;

    @FindBy(xpath = "//button[@type=\"submit\"]")
    private WebElement loginButton;

    @FindBy(xpath = "//img[@alt=\"Background\"]")
    private WebElement loginPageImage;

    @FindBy(xpath = "//a[@href=\"/register\"]")
    private WebElement registrationLink;

    @FindBy(xpath = "//h1[@class=\"text-2xl font-lexend mb-6\"]")
    private WebElement LogInToAccountText;

    @FindBy(xpath = "//*[@id=\"root\"]/div/div[1]/div/p")
    private WebElement dontHaveAccountText;

    @FindBy(xpath = "//form[@class=\"space-y-4\"]//descendant::input[@id=\"email\"]/parent::div//following-sibling::p")
    private WebElement emailError;

    @FindBy(xpath = "//input[@id = \"password\"]//parent::div[@class=\"relative\"]//following-sibling::div[@class=\"mt-1\"]/p")
    private WebElement passwordError;

    @FindBy(xpath = "//*[@id=\"root\"]/header/nav/div/div/button/img")
    private WebElement profileButton;

    @FindBy(xpath = "//*[@id=\"root\"]/header/nav/div/div/div/button/div")
    private WebElement logOutButton;

    public void enterEmail(String emailAddress){
        type(txtEmail,emailAddress);
    }

    public void enterPassword(String password){
        type(txtPassword,password);
    }

    public void clickLoginButton() {
        click(loginButton);
    }

    public boolean imageIsDisplayed(){
        return loginPageImage.isDisplayed();
    }

    public String getErrorMessage(String fieldName,String errorMessage) {
        if (fieldName.equalsIgnoreCase("password")){
            wait.until(ExpectedConditions.textToBePresentInElement(passwordError,errorMessage));
            return getText(passwordError);
        }
        else if (fieldName.equalsIgnoreCase("email")) {
            wait.until(ExpectedConditions.textToBePresentInElement(emailError,errorMessage));
            return getText(emailError);
        }
        else{
            throw new IllegalArgumentException("Invalid FieldName");
        }
    }

    public boolean isEmailEmpty(){
        return txtEmail.getText().trim().isEmpty();
    }

    public boolean isPasswordEmpty(){
        return txtPassword.getText().trim().isEmpty();
    }

    public void verifySignUpLink(){
        click(registrationLink);
    }

    public void verifyLoginPageTexts() {
        String expectedLoginHeader = "Log In to Your Account";
        String expectedDontHaveAccountText = "Don't have an account? CREATE NEW ACCOUNT";

        String actualLoginHeader = getText(LogInToAccountText).trim();
        String actualDontHaveAccountText = getText(dontHaveAccountText).trim();

        if (!actualLoginHeader.equals(expectedLoginHeader)) {
            throw new AssertionError("Login header text mismatch! Expected: "
                    + expectedLoginHeader + ", but Found: " + actualLoginHeader);
        }

        if (!actualDontHaveAccountText.equals(expectedDontHaveAccountText)) {
            throw new AssertionError("Don't Have Account text mismatch! Expected: "
                    + expectedDontHaveAccountText + ", but Found: " + actualDontHaveAccountText);
        }

        System.out.println("✅ All login page texts are displayed correctly!");
    }

    public void loggingOut(){
        click(profileButton);
        click(logOutButton);
    }

}
