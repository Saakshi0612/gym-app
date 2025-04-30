package com.epam.gym_app.ui.pages;

import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

public class RegistrationPage extends BasePage{
    public RegistrationPage(WebDriver driver) {
        super(driver);
    }

    // create an account text display
    @FindBy(css = ".text-2xl.font-lexend.mb-6")
    private WebElement createAnAccountText;

    // image visibility
    @FindBy(css = ".h-full.w-full.object-cover.rounded-2xl")
    private WebElement registerPageImage;

    // firstname field
    @FindBy(id = "firstName")
    private WebElement firstName;

    // lastname field
    @FindBy(id = "lastName")
    private WebElement lastName;

    // email field
    @FindBy(id = "email")
    private WebElement email;

    // password field
    @FindBy(id = "password")
    private WebElement password;

    //confirmPassword field
    @FindBy(id = "confirmPassword")
    private WebElement confirmPassword;

    //target dropdown button
    @FindBy(xpath = "//div[@class = \"z-20\"]//descendant::button[@type=\"button\"]")
    private WebElement targetDropDownBtn;

    // target dropdown
    @FindBy(xpath = "//div[@class=\"relative\"]//descendant::span[@class=\"text-sm font-light text-[#323A3A]\"]")
    private List<WebElement> target;

    // activity dropdown button
    @FindBy(xpath = "//div[@class = \"z-10\"]//descendant::button[@type=\"button\"]")
    private WebElement activityDropDownBtn;

    // activity dropdown
    @FindBy(xpath = "//span[@class=\"text-sm font-light text-[#323A3A]\"]")
    private List<WebElement> activity;

    //create account button
    @FindBy(xpath = "//button[@type=\"submit\"]")
    private WebElement createAccountButton;

    //Login link
    @FindBy(css = ".font-lexend.font-bold.underline")
    private WebElement loginLink;

    // firstName error
    @FindBy(xpath = "//input[@id = \"firstName\"]//ancestor::div[@class=\"w-full mb-3 relative\"]//descendant::span[@class=\"whitespace-pre-line\"]")
    private WebElement firstNameError;

    @FindBy(xpath = "//input[@id = \"lastName\"]//ancestor::div[@class=\"w-full mb-3 relative\"]//descendant::span[@class=\"whitespace-pre-line\"]")
    private WebElement lastNameError;

    @FindBy(xpath = "//input[@id = \"email\"]//ancestor::div[@class=\"w-full mb-3 relative\"]//descendant::span[@class=\"whitespace-pre-line\"]")
    private WebElement emailError;

    @FindBy(xpath = "//input[@id = \"password\"]//ancestor::div[@class=\"w-full mb-3 relative\"]//descendant::span[@class=\"whitespace-pre-line\"]")
    private WebElement passwordError;

    @FindBy(xpath = "//input[@id = \"confirmPassword\"]//ancestor::div[@class=\"w-full mb-3 relative\"]//descendant::span[@class=\"whitespace-pre-line\"]")
    private WebElement confirmPasswordError;

    @FindBy(xpath = "//*[@id=\"root\"]/div/div[1]/div/div/form/div[6]/div/fieldset/div/ul")
    private WebElement activityDropdownContainer;

    @FindBy(xpath = "//*[@id=\"root\"]/div/div[1]/div/div/form/div[5]/div/fieldset/div/ul")
    private WebElement targetDropdownContainer;

    @FindBy(xpath = "//div[@class=\"bg-red-50 border-red-200 rounded-md p-4 relative shadow-lg\"]//div[@class=\"mt-1 text-sm text-red-700\"]")
    private WebElement emailAlreadyExistsError;

    public void enterText(String fieldName,String textValue){
        switch (fieldName.toLowerCase()){
            case "firstname":
                type(firstName,textValue);
                break;
            case "lastname":
                type(lastName,textValue);
                break;
            case "email":
                type(email,textValue);
                break;
            case "password":
                type(password,textValue);
                break;
            case "confirmpassword":
                type(confirmPassword,textValue);
                break;
            default:
                throw new IllegalArgumentException("Invalid FieldName");
        }
    }

    public void enterFirstName(String firstname){
        type(firstName,firstname);
    }

    public void enterLastName(String lastname){
        type(lastName,lastname);
    }

    public void enterEmail(String emailAddress){
        type(email,emailAddress);
    }

    public void enterPassword(String userPassword){
        type(password,userPassword);
    }

    public void enterConfirmPassword(String confirmPasswordArgs){
        type(confirmPassword,confirmPasswordArgs);
    }

    public void selectTarget(String desiredTarget){
        if (desiredTarget.trim().equalsIgnoreCase("")){
            return;
        }
        click(targetDropDownBtn);
        selectByVisibleText(target,desiredTarget);
    }

    public void selectActivity(String desiredActivity){
        if (desiredActivity.trim().equalsIgnoreCase("")){
            return;
        }
        click(activityDropDownBtn);
        selectByVisibleText(activity,desiredActivity);
    }

    public void clickRegistrationButton() {
        click(createAccountButton);
    }

    public boolean isFirstNameEmpty(){
        return firstName.getAttribute("value").isEmpty();
    }

    public boolean isLastNameEmpty(){
        return lastName.getAttribute("value").isEmpty();
    }

    public boolean isEmailEmpty(){
        return email.getAttribute("value").isEmpty();
    }

    public boolean isPasswordEmpty(){
        return password.getAttribute("value").isEmpty();
    }

    public boolean isConfirmPasswordEmpty(){
        return confirmPassword.getAttribute("value").isEmpty();
    }

    public String getErrorMessage(String fieldName){
        WebElement errorElement = null;
        switch (fieldName.toLowerCase()) {
            case "firstname":
                errorElement = firstNameError;
                break;
            case "lastname":
                errorElement = lastNameError;
                break;
            case "email":
                errorElement = emailError;
                break;
            case "password":
                errorElement = passwordError;
                break;
            case "confirmpassword":
                errorElement = confirmPasswordError;
                break;
            default:
                System.out.println("Invalid fieldName provided: " + fieldName);
                return "";
        }
        try {
            wait.until(ExpectedConditions.visibilityOf(errorElement));
            return getText(errorElement).trim();
        } catch (Exception e) {
            System.out.println("Error element not visible for field: " + fieldName);
            return "";
        }
    }

    public List<WebElement> getDropDownOptions(String dropDownName) {
        if (dropDownName.equalsIgnoreCase("activity")){
            click(activityDropDownBtn);
            try {
                wait.until(ExpectedConditions.visibilityOf(activityDropdownContainer));
            } catch (TimeoutException e) {
                activityDropDownBtn.click();
                wait.until(ExpectedConditions.visibilityOf(activityDropdownContainer));
            }
            return activity;
        } else if (dropDownName.equalsIgnoreCase("target")){
            targetDropDownBtn.click();
            try {
                wait.until(ExpectedConditions.visibilityOf(targetDropdownContainer));
            } catch (TimeoutException e) {
                targetDropDownBtn.click();
                wait.until(ExpectedConditions.visibilityOf(targetDropdownContainer));
            }
            return target;
        }
        else {
            throw new IllegalArgumentException("Invalid dropDownName");
        }
    }

    public boolean verifyVisibilityOfImage(){
        return registerPageImage.isDisplayed();
    }

    public void clickOnLoginHereLink(){
        click(loginLink);
    }

    public String getDefaultValue(String fieldName){
        if (fieldName.equalsIgnoreCase("target")){
            return getText(targetDropDownBtn);
        }
        else if (fieldName.equalsIgnoreCase("activity")){
            return getText(activityDropDownBtn);
        }
        else{
            throw new IllegalArgumentException("Invalid field Name");
        }
    }

    public boolean areAllLabelsClearAndVisible(){
        return createAnAccountText.isDisplayed() && firstName.isDisplayed() && lastName.isDisplayed() && email.isDisplayed() &&
                password.isDisplayed() && confirmPassword.isDisplayed() && targetDropDownBtn.isDisplayed() && activityDropDownBtn.isDisplayed() &&
                createAccountButton.isDisplayed() && loginLink.isDisplayed();
    }

    public boolean isEmailAlreadyExistsErrorDisplayed(){
        try{
            waitForElementToBeVisible(emailAlreadyExistsError);
            System.out.println(getText(emailAlreadyExistsError));
            return emailAlreadyExistsError.isDisplayed();
        }catch (Exception e){
            return false;
        }
    }
}