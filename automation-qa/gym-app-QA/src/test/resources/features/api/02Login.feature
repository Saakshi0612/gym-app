Feature: User Login API

  Scenario Outline: Successful login with valid credentials and status code 200
    Given User attempts to login with email "<email>" and password "<password>"
    Then Login should be successful with status code "<statusCode>" and Message "<message>"

    Examples:
      | email               | password  | statusCode | message |
      | test1@example.com   | Test@123  | 200        | Login successful (Cognito authentication) |
      | test2@example.com   | Pass@456  | 200        | Login successful (Cognito authentication) |
      | test3@example.com   | Strong@1  | 200        | Login successful (Cognito authentication) |


  Scenario Outline: Unsuccessful login with invalid credentials and status code 401
    Given User attempts to login with email "<email>" and password "<password>"
    Then Login should fail with status code "<statusCode>" and Message "<message>"

    Examples:
      | email               | password    | statusCode | message             |
      | test1@example.com   | Wrong123    | 401        | Invalid credentials |
      | test2@example.com   | Invalid@456 | 401        | Invalid credentials |
      | test3@example.com   | 12345       | 401        | Invalid credentials |

  Scenario Outline: Login failure due to invalid email format and status code 400
    Given User attempts to login with email "<email>" and password "<password>"
    Then Login should fail with status code "<statusCode>" and Message for invalid email "<message>"

    Examples:
      | email                | password    | statusCode | message             |
      | jhon_smith@example   | Y2kjqKHX@    | 400        | Please enter a valid email address (e.g. username@domain.com) |
      | tushar!gmail.com     | Tush@1703 | 400 | Please enter a valid email address (e.g. username@domain.com)           |

  Scenario: Login failure with empty request body
    Given User attempts to login with an empty request body
    Then Login should fail with status code "400" and Message

  Scenario: Login failure with missing password field
    Given User attempts to login with missing password for email "jhon_smith@example.com"
    Then Login should fail with status code "400" and proper Message for password field "Password is required"

  Scenario: Login failure with missing email field
    Given User attempts to login with missing email for password "Y2kjqKHX@"
    Then Login should fail with status code "400" and proper Message for email field "Email is required"