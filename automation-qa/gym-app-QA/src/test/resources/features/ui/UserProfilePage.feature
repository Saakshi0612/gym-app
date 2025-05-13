Feature: Verify User Profile Page

#  Background: Setup initial user state
#    Given User is on home page with url
#    And the User clicks on "login"
#    And the User logs in with username "tester@example.com" and password "Password@123"
#    And the User clicks on "profile icon"
#    And the User clicks on "my account"

  Scenario: Goto My Accounts Page
    Given User is on home page with url
    And the User clicks on "signup"
    And the User registers with firstname "John", lastname "Doe", email "tester@example.com", password "Password@123", and confirm new password "Password@123"
    And the User logs in with username "tester@example.com" and password "Password@123"
    And the User clicks on "profile icon"
    And the User clicks on "my account"

  Scenario: Validate user profile details after registration
    Then the User validates the following profile details:
      | first name | John               |
      | last name  | Doe                |
      | email      | tester@example.com |

  Scenario Outline: Validate incorrect or empty inputs for name fields
    When the User updates the profile details:
      | <field>    | <value> |
    And the User clicks on "save changes"
    Then the User validates the following error details:
      | status | Error |

    Examples:
      | field      | value    |
      | first name | 12345    |
      | last name  | 12345    |
      | first name |          |
      | last name  |          |
      | first name | #$%!@^&* |
      | last name  | #$%!@^&* |
      | first name | John123  |
      | last name  | Doe123   |
      | first name | John@Doe |
      | last name  | Doe$     |

  Scenario: Update profile details, save changes, and validate
    When the User updates the profile details:
      | first name | Jack    |
      | last name  | Seth    |
    And the User clicks on "save changes"
    And the User clicks on "logout"
    And the User logs in with username "tester@example.com" and password "Password@123"
    And the User clicks on "profile icon"
    And the User clicks on "my account"
    Then the User validates the following profile details:
      | first name | Jack   |
      | last name  | Seth   |

  Scenario Outline: Attempt to change password with invalid conditions
    Given the User clicks on "change password"
    When the User attempts to change the password with:
      | old Password     | <oldPassword>     |
      | new Password     | <newPassword>     |
      | confirm Password | <confirmPassword> |
    And the User clicks on "save changes"
    Then the User validates the following error details:
      | status       | Error          |
      | statusMessage | <errorMessage> |

    Examples:
      | oldPassword      | newPassword      | confirmPassword  | errorMessage                                              |
      | IncorrectPassword| Password@1234    | Password@1234    | Current Password is not valid                        |
      | Password@123     | Password@123     | Password@123     | New password must be different from current password |
      | Password@1234    | Password@1234    | Password@1234    | Current Password is not valid                        |

  Scenario Outline: Attempt to change password with input validation failure
    Given the User clicks on "change password"
    When the User attempts to change the password with:
      | old Password     | <oldPassword>     |
      | new Password     | <newPassword>     |
      | confirm Password | <confirmPassword> |
    Then the User must not be able to click on save changes button in passwordChange

    Examples:
      | oldPassword      | newPassword          | confirmPassword      |
      | Password@123     | Password@456         | Password@456         |
      | Password@123     | password123          | password123          |
      | Password@123     | PASSWORD123          | PASSWORD123          |
      | Password@123     | Password             | Password             |
      | Password@123     | Pass123              | Pass123              |
      | Password@123     | Password@1234        | Password@5678        |
      | Password@123     | Pass word123         | Pass word123         |
      | Password@123     | Password#123         | Password#123         |

  Scenario: Successfully change password and validate login with new password
    Given the User clicks on "change password"
    When the User attempts to change the password with:
      | old password    | Password@123   |
      | new password    | Password@1234  |
      | confirm password| Password@1234  |
    And the User clicks on "save changes"
    And the User clicks on "logout"
    And the User logs in with username "tester@example.com" and password "Password@1234"
    Then the User validates that they are redirected to the home page