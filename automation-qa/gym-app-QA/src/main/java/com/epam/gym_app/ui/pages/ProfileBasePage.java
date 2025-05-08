package com.epam.gym_app.ui.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class ProfileBasePage extends BasePage{

    public ProfileBasePage(WebDriver driver) {
        super(driver);
    }

    @FindBy(xpath = "//div[text()='Sign Up']/parent::button")
    private WebElement signUp;

    @FindBy(xpath = "//div[text()='Log In']/parent::button")
    private WebElement login;

    @FindBy(xpath = "//*[@id=\"root\"]/header/nav/div/div/button/img")
    private WebElement profileIcon;

    @FindBy(xpath = "//*[@id=\"root\"]/header/nav/div/div/div/div[2]")
    private WebElement myAccountButton;

    @FindBy(xpath = "//p[@class='text-sm text-neutral-600']")
    private WebElement email;

    @FindBy(id = "firstName")
    private WebElement firstName;

    @FindBy(id = "lastName")
    private WebElement lastName;

    @FindBy(xpath = "//button[text()='Save Changes']")
    private WebElement saveChangesButton;

    @FindBy(xpath = "//button[text()='Log Out']")
    private WebElement logoutButton;

    @FindBy(xpath = "//div[@class='relative flex items-center']/button[text()='Change Password']")
    private WebElement changePasswordButton;

    @FindBy(id = "oldPassword")
    private WebElement oldPasswordField;

    @FindBy(id = "newPassword")
    private WebElement newPasswordField;

    @FindBy(id = "confirmPassword")
    private WebElement confirmPasswordField;

    @FindBy(xpath = "//div[@class='ml-3']/h3")
    private WebElement status;

    @FindBy(xpath = "//div[@class='ml-3']/div")
    private WebElement statusMessage;

    @FindBy(xpath = "//span[@class='sr-only']/parent::button")
    private WebElement dismiss;

    public String getFirstName(){
        waitForElementToBeVisible(firstName);
        return firstName.getDomAttribute("value");
    }

    public String getLastName(){
        waitForElementToBeVisible(lastName);
        return lastName.getDomAttribute("value");
    }

    public String getEmail(){
        return getText(email);
    }

    public void setFirstName(String value){
        type(firstName,value);
    }

    public void setLastName(String value){
        type(lastName,value);
    }

    public void setOldPassword(String value){
        type(oldPasswordField,value);
    }

    public void setNewPassword(String value){
        type(newPasswordField,value);
    }

    public void setConfirmNewPassword(String value){
        type(confirmPasswordField,value);
    }

    public String getStatus(){
        return getText(status);
    }

    public String getStatusMessage(){
        return getText(statusMessage);
    }

    public void clicksOnLogin(){
        click(login);
    }

    public void clicksOnSignUp(){
        click(signUp);
    }

    public void clicksOnSaveChanges(){
        click(saveChangesButton);
    }

    public void clicksOnLogOut(){
        click(logoutButton);
    }

    public void clicksOnChangePassword(){
        click(changePasswordButton);
    }

    public void clicksOnProfileIcon(){
        click(profileIcon);
    }

    public void clicksOnMyAccount(){
        click(myAccountButton);
    }

    public boolean isClickable(){
        return saveChangesButton.isEnabled();
    }
}
