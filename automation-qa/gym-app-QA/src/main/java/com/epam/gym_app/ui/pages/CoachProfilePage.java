package com.epam.gym_app.ui.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.awt.*;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.util.List;

public class CoachProfilePage extends ProfileBasePage {

    public CoachProfilePage(WebDriver driver) {
        super(driver);
    }

    @FindBy(id = "title")
    private WebElement title;

    @FindBy(id = "about")
    private WebElement about;

    @FindBy(xpath = "//div[@class='flex items-center justify-between w-full min-w-[120px] sm:min-w-[150px] flex-1']/input")
    private WebElement specialization;

    @FindBy(xpath = "//*[@id=\"root\"]/div[3]/main/div/div/div[5]/div/div/ul/li")
    private List<WebElement> specilizationValues;

    @FindBy(xpath = "//div[@class='flex flex-wrap gap-2 max-w-full']/span/span")
    private List<WebElement> specializationDropdownSelectedValues;

    @FindBy(css = "#root > div.flex.flex-col.md\\:flex-row.min-h-screen.bg-primary-white > main > div > div > div:nth-child(5) > div > div.border.border-neutral-400.rounded-md.px-3.py-2\\.5.bg-primary-white.min-h-\\[4rem\\].flex.items-start.sm\\:items-center.flex-wrap.gap-2.relative.mt-2.hover\\:border-primary-green.focus-within\\:border-primary-green.focus-within\\:ring-1.focus-within\\:ring-primary-green.overflow-y-auto > div.flex.items-center.justify-between.w-full.min-w-\\[120px\\].sm\\:min-w-\\[150px\\].flex-1 > svg")
    private WebElement dropdownCloseButton;

    @FindBy(xpath = "//div[text()='Select File']")
    private WebElement uploadButton;

    @FindBy(xpath = "//span[@class='sr-only']/parent::button")
    private WebElement dismiss;

    @FindBy(xpath = "//div[@class='divide-y divide-neutral-200']")
    private WebElement uploadSpace;

    public void setAbout(String value){
        type(about,value);
    }

    public void setTitle(String value){
        type(title,value);
    }

    public void clickOnCloseSpecilization(){
        click(dropdownCloseButton);
    }

    public String getAbout(){
        return getText(about);
    }

    public String getTitle(){
        return getText(title);
    }

    public void selectFromAutosuggestDropdown(String value) {
        specialization.sendKeys(value);
        for (WebElement element : specilizationValues) {
            if (element.getText().equalsIgnoreCase(value)) {
                element.click();
                break;
            }
        }
    }

    public boolean isValuePresentInSpecialization(String value) {
        for (WebElement element : specializationDropdownSelectedValues) {
            if (element.getText().equalsIgnoreCase(value)) {
                return true;
            }
        }
        return false;
    }

    public void documentUpload(String filePath) throws AWTException, InterruptedException {
        uploadButton.click();
        StringSelection selection = new StringSelection(filePath);
        Toolkit.getDefaultToolkit().getSystemClipboard().setContents(selection, null);
        Robot robot = new Robot();
        robot.keyPress(KeyEvent.VK_TAB);
        Thread.sleep(1000);
        robot.keyPress(KeyEvent.VK_TAB);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.keyRelease(KeyEvent.VK_ENTER);
        Thread.sleep(1000);
        robot.keyPress(KeyEvent.VK_CONTROL);
        robot.keyPress(KeyEvent.VK_V);
        Thread.sleep(5000);
        robot.keyRelease(KeyEvent.VK_V);
        robot.keyRelease(KeyEvent.VK_CONTROL);
        robot.keyPress(KeyEvent.VK_ENTER);
        robot.keyRelease(KeyEvent.VK_ENTER);
    }

    public boolean isDocumentPresent(String filename){
        List<WebElement> elements = driver.findElements(By.xpath("//div[@class='divide-y divide-neutral-200']//p"));
        for(WebElement element:elements){
            System.out.println(element.getText());
            if(element.getText().contains(filename)){
                return true;
            }
        }
        return false;
    }

    public void removeDocument(String name){
        driver.findElement(By.xpath("//p[text()='"+name+"']/parent::div/parent::div/div[@class='flex items-center gap-3 flex-shrink-0']/button[@title='Remove']")).click();
    }

}