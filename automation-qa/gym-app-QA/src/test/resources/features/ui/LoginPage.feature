Feature: Test Login functionality

  Scenario Outline: Successful login with valid credentials
    Given User is on the Login Page after registering with Email "<Email>" and Password "<Password>"
    When User enters registered Email "<Email>" and correct Password "<Password>"
    And User clicks on the Login button
    Then User should be redirected to the homepage

    Examples:
      | Email                  | Password       |
      | tushar@gmail.com       | Tush@1703      |
      | testuser1@example.com   | ValidPass@123   |
      | testuser2@example.com   | Password123!    |
      | testuser3@example.com   | Qwerty@456      |
      | testuser4@example.com   | HelloWorld#789  |


  Scenario Outline: Login attempt with incorrect password
    Given User is on the Login Page after registering with Email "<Email>" and Password "<Password>"
    When User enters registered Email "<Email>" and incorrect Password "<IncorrectPassword>"
    And User clicks on the Login button
    Then Error message "We couldn't log you in. Double-check your credentials and try again." should be displayed for "password" field

    Examples:
      | Email                  | Password        |  IncorrectPassword |
      | testuser5@example.com   | WrongPass@123   | WrongPass@1234    |
      | testuser6@example.com   | Invalid@123      | Invalid12         |
      | testuser7@example.com   | PasswordWrong!1  | Passwordwrong@    |
      | testuser8@example.com   | Wrong@456       | Wrong-456         |


  Scenario Outline: Login attempt with empty email or password
    Given User is on the Login Page
    When User enters Email "<Email>" and Password "<Password>"
    And User clicks on the Login button
    Then Error message "<EmailErrorMessage>" and "<PasswordErrorMessage>" should be displayed for both email and password field respectively

    Examples:
      | Email            | Password    | EmailErrorMessage | PasswordErrorMessage |
      |                  | Password123 |                   |                      |
      | user@example.com |             |                   |                      |
      |                  |             |                   |                      |


  Scenario Outline: Login attempt with invalid email format
    Given User is on the Login Page
    When User enters Email "<Email>" and Password "<Password>"
    And User clicks on the Login button
    Then Error message "Invalid email address. Please ensure it follows the format: username@domain.com" should be displayed for "email" field

    Examples:
      | Email               | Password    |
      | invalidEmail@domain | password123 |
      | user@domain         | password123 |
      | @domain.com         | password123 |
      | userdomain.com      | password123 |


  Scenario: Verify navigation to Sign Up page from Login page
    Given User is on the Login Page
    When User clicks on the Sign Up link
    Then User should be redirected to the Sign Up page

  Scenario Outline: Try to login with unregistered user
    Given User is on the Login Page
    When User enters unregistered Email "<Email>" and password "<Password>"
    And User clicks on the Login button
    Then Error message "We couldn't log you in. Double-check your credentials and try again." should be displayed for "password" field

    Examples:
      | Email                    | Password        |
      | notregistered1@test.com   | Test@1234        |
      | unknownuser@test.com      | Welcome@123      |

  Scenario: Verify images are displayed on Login page
    Given User is on the Login Page
    Then Login page images should be displayed

  Scenario: Verify texts are displayed as expected on Login page
    Given User is on the Login Page
    Then All the expected texts should be visible on the Login Page

  Scenario Outline: User should be able to log out from the session
    Given User is on the Login Page after registering with Email "<Email>" and Password "<Password>"
    When User enters registered Email "<Email>" and correct Password "<Password>"
    And User clicks on the Login button
    When User clicks on the Logout button
    Then User should be redirected to the Home page
    Examples:
      | Email                  | Password       |
      | tushar1@gmail.com       | Tush@1703      |
      | testuser9@example.com  | ValidPass@123  |