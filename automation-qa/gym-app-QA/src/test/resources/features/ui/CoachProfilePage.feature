Feature: Verify Coach Profile Page

#  Background: Setup initial coach state
#    Given User is on login page with url
#    And the User logs in with username "coach1@example.com" and password "Password@123"
#    And the User clicks on "profile icon"
#    And the User clicks on "my account"

  Scenario: Goto My Accounts Page
    Given Coach is on home page
    And the coach clicks on "Signup"
    And the coach registers with firstname "John", lastname "Doe", email "coach1@example.com", password "Password@123", and confirm new password "Password@123"
    And the coach logs in with username "coach1@example.com" and password "Password@123"
    And the coach clicks on "profile icon"
    And the coach clicks on "my account"

  Scenario: Validate user profile details after registration
    Then the coach validates the following profile details:
      | first name | John               |
      | last name  | Doe                |
      | email      | coach1@example.com |

  Scenario Outline: Validate incorrect or empty inputs for name fields
    When the coach updates the profile details:
      | <field> | <value> |
    And the coach clicks on "save changes"
    Then the coach validates the following error details:
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
    When the coach updates the profile details:
      | first name | Jack               |
      | last name  | Seth               |
      | title      | Mr.                |
      | about      | Fitness Enthusiast |
    And the coach sets "specialization" dropdown as "Yoga"
    And the coach clicks on "close specialization"
    And the coach uploads "certificate-1"
    And the coach clicks on "save changes"
    And the coach clicks on "logout"
    And the coach logs in with username "coach1@example.com" and password "Password@123"
    And the coach clicks on "profile icon"
    And the coach clicks on "my account"
    Then the coach validates the following profile details:
      | first name | Jack               |
      | last name  | Seth               |
      | title      | Mr.                |
      | about      | Fitness Enthusiast |
    And the coach validates that "specialization values" value contains "Yoga"
    And the "certificate-1filename" must be visible

  Scenario: Update profile with multiple specializations and validate
    When the coach sets "specialization" dropdown as "Cardio"
    And the coach sets "specialization" dropdown as "Pilates"
    And the coach clicks on "save changes"
    And the coach clicks on "logout"
    And the coach logs in with username "coach1@example.com" and password "Password@123"
    And the coach clicks on "profile icon"
    And the coach clicks on "my account"
    Then the coach validates that "specialization values" value contains "Cardio"
    And the coach validates that "specialization values" value contains "Pilates"

  Scenario: Update profile with multiple uploads and validate
    And the coach uploads "certificate-2"
    And the coach uploads "certificate-3"
    And the coach clicks on "save changes"
    And the coach clicks on "logout"
    And the coach logs in with username "coach1@example.com" and password "Password@123"
    And the coach clicks on "profile icon"
    And the coach clicks on "my account"
    And the "certificate-2filename" must be visible
    And the "certificate-3filename" must be visible

  Scenario: Update profile with deleting a document
    And the coach deletes "certificate-2"
    And the coach clicks on "save changes"
    And the coach clicks on "logout"
    And the coach logs in with username "coach1@example.com" and password "Password@123"
    And the coach clicks on "profile icon"
    And the coach clicks on "my account"
    And the "certificate-2filename" must not be visible

  Scenario Outline: Attempt to change password with invalid conditions
    When the coach clicks on "change password"
    When the coach attempts to change the password with:
      | old Password     | <oldPassword>     |
      | new Password     | <newPassword>     |
      | confirm Password | <confirmPassword> |
    And the coach clicks on "save changes"
    Then the coach validates the following error details:
      | status        | Error          |
      | statusMessage | <errorMessage> |

    Examples:
      | oldPassword       | newPassword   | confirmPassword | errorMessage                                         |
      | IncorrectPassword | Password@1234 | Password@1234   | Current Password is not valid                        |
      | Password@123      | Password@123  | Password@123    | New password must be different from current password |
      | Password@1234     | Password@1234 | Password@1234   | Current Password is not valid                        |

  Scenario Outline: Attempt to change password with invalid conditions
    When the coach clicks on "change password"
    When the coach attempts to change the password with:
      | old Password     | <oldPassword>     |
      | new Password     | <newPassword>     |
      | confirm Password | <confirmPassword> |
    Then the coach must not be able to click on save changes button in passwordChange

    Examples:
      | oldPassword  | newPassword   | confirmPassword |
      | Password@123 | Password@123  | Password@456    |
      | Password@123 | password123   | password123     |
      | Password@123 | PASSWORD123   | PASSWORD123     |
      | Password@123 | Password      | Password        |
      | Password@123 | Pass123       | Pass123         |
      | Password@123 | Password@1234 | Password@5678   |
      | Password@123 | Pass word123  | Pass word123    |
      | Password@123 | Password#123  | Password#123    |

  Scenario: Successfully change password and validate login with new password
    When the coach clicks on "change password"
    When the coach attempts to change the password with:
      | old password     | Password@123  |
      | new password     | Password@1234 |
      | confirm password | Password@1234 |
    And the coach clicks on "save changes"
    And the coach clicks on "logout"
    And the coach logs in with username "coach1@example.com" and password "Password@1234"
    Then the coach validates that they are redirected to the home page