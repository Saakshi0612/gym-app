package com.epam.gym_app.ui.pages;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class BookingPage extends BasePage{
    private static final Log log = LogFactory.getLog(BookingPage.class);

    public BookingPage(WebDriver driver) {
        super(driver);
    }

    @FindBy(xpath = "//*[@id=\"root\"]/div[3]/main/div[2]/div[1]/div[5]/button/div")
    private WebElement findWorkOutBtn;

    @FindBy(xpath = "//div[@class=\"w-full max-w-3xl p-4 shadow-xl rounded-2xl text-gray-700 bg-white relative z-10\"]//descendant::button[2]")
    private List<WebElement> bookWorkoutBtn;

    @FindBy(xpath = "//div[@class=\"w-full max-w-3xl p-4 shadow-xl rounded-2xl text-gray-700 bg-white relative z-10\"]//descendant::p[@class=\"font-bold text-base md:text-lg\"]")
    private List<WebElement> coachNames;

    @FindBy(xpath = "//div[@class=\"bg-white w-full max-w-xl rounded-2xl shadow-lg relative px-6 py-6\"]//descendant::p[@class=\"font-semibold text-lg text-gray-900\"]")
    private WebElement coachNameDailogbox;

    @FindBy(xpath = "//div[@class=\"bg-white w-full max-w-xl rounded-2xl shadow-lg relative px-6 py-6\"]//descendant::div[@class=\"flex items-center justify-center\"]")
    private WebElement confirmBtn;

    @FindBy(xpath = "//div[@class=\"bg-white rounded-2xl p-7 w-full max-w-md shadow-lg relative\"]//h2")
    private WebElement  loginDialogBox;

    @FindBy(xpath = "//div[@class=\"flex flex-col items-center gap-3\"]//p[1]")
    private WebElement NoWorkoutTextMsg;

    @FindBy(xpath = "//header[@class=\"shadow-md px-4 py-3 flex items-center justify-between gap-10 relative z-20\"]//descendant::div[text() = \"Log In\"]//parent::button")
    private WebElement loginBtnHomePage;

    @FindBy(xpath = "//div[@class=\"z-30\"]//button")
    private WebElement timeBtn;

    @FindBy(xpath = "//div[@class=\"z-30\"]//ul//li")
    private List<WebElement> timeslots;

    @FindBy(xpath = "//*[@id=\"root\"]/div[3]/main/div[2]/div[2]/div/div[2]/div/div/button[2]/div")
    private WebElement loginBtnPrompt;

    @FindBy(xpath = "//header[@class=\"shadow-md px-4 py-3 flex items-center justify-between gap-10 relative z-20\"]//descendant::li[@class=\"border-b-2 border-transparent\"]")
    private WebElement coachesLink;

    @FindBy(xpath = "//div[@class=\"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end w-full\"]//descendant::fieldset[@class=\"border rounded-md border-[#DADADA] py-1 font-[lexend] text-[#323A3A] text-[14px] font-[300] leading-[20px] bg-white \"]")
    private List<WebElement> dropDowns;



    public void loggingIn(){
        click(loginBtnHomePage);
        LoginPage loginPage = new LoginPage(driver);
        loginPage.enterEmail("tushar@gmail.com");
        loginPage.enterPassword("Tush@1703");
        loginPage.clickLoginButton();
    }

    public void booking(String name){
        int cnt = 1;
        for (WebElement element : coachNames){
            if (getText(element).equalsIgnoreCase(name)){
                System.out.println(element.getText());
                click(bookWorkoutBtn.get(cnt));
                break;
            }
            cnt++;
        }
    }

    public void isConfirmButtonEnabled(){
        click(confirmBtn);
    }

    public boolean isLoginPromptBoxVisible(){
        return loginDialogBox.isDisplayed();
    }

    public void bookingForFirstTime(String timeslot){
        click(timeBtn);
        for (WebElement element:timeslots){
            if (getText(element).equals(timeslot)){
                click(element);
            }
        }
    }

    public void clickLoginBtn(){
        click(loginBtnPrompt);
    }

    public boolean areAllLabelsClearAndVisible(){
        return findWorkOutBtn.isDisplayed() && loginBtnHomePage.isDisplayed() && coachesLink.isDisplayed();
    }
}
