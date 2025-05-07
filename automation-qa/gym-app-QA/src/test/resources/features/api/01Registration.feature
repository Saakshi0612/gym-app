Feature: User Registration API

  Scenario Outline: Successful registration with valid details and status code 201
    Given User registers with email "<email>", firstName "<firstName>", lastName "<lastName>", password "<password>", confirmPassword "<confirmPassword>", target "<target>", and activity "<activity>"
    Then Registration should be successful with status code "<statusCode>" and message "<message>"

    Examples:
      | email              | firstName | lastName | password  | confirmPassword | target       | activity | statusCode | message |
      | test1@example.com   | John      | Doe      | Test@123  | Test@123        | gain-weight  | CrossFit     | 201   | User registered successfully |
      | test2@example.com   | Alice     | Smith    | Pass@456  | Pass@456        | gain-weight  | CrossFit   | 201 |  User registered successfully |
      | test3@example.com   | Bob       | Brown    | Strong@1  | Strong@1        | gain-weight      | CrossFit      | 201 | User registered successfully|
      | jhon_smith@example.com | Siddartha | Roy      | Khushi1@  | Khushi1@        | gain-weight | CrossFit | 201  | User registered successfully        |


  Scenario Outline: Registration should fail with invalid data
    Given User tries to register with email "<email>", firstName "<firstName>", lastName "<lastName>", password "<password>", confirmPassword "<confirmPassword>", target "<target>", and activity "<activity>"
    Then Registration should fail with status code "<statusCode>" and error message "<errorMessage>"

    Examples:
      | email                          | firstName  | lastName     | password                   | confirmPassword            | target               | activity  | errorMessage                                                                                                                 | statusCode |
      | jhon_smith@example.com         | John       | Smith        | Y2kjqKHX                   | Y2kjqKHX                   | gain-weight          | CrossFit  | Password must include at least one special character (!@#$%^&*)                                                              | 400        |
      | albus_dumbledore@example.com  | Albus1     | Dumbledore   | Wizards1@                  | Wizards1@                  | gain-weight          | CrossFit  | First name Name must only contain letters and spaces                           | 400        |
      | albus_dumbledore2@example.com | Albus      | Dumbledore2  | Wizards1@                  | Wizards1@                  | gain-weight          | CrossFit  | Last name Name must only contain letters and spaces                           | 400        |
      | siddartha_roy@example.com      |            | Roy          | Khushi1@                   | Khushi1@                   | gain-weight          | CrossFit  | First name Name is required                                  | 400        |
      | siddartha_roy2@example.com     | Siddartha  |              | Khushi1@                   | Khushi1@                   | gain-weight          | CrossFit  | Last name Name is required                                   | 400        |
      |                                 | Siddartha  | Roy          | Khushi1@                   | Khushi1@                   | gain-weight          | CrossFit  | Email is required                                  | 400        |
      | siddartha_roy@example.com      | Siddartha  | Roy          |                            | Khushi1@                   | gain-weight          | CrossFit  | Password is required                                  | 400        |
      | siddartha_roy@example.com      | Siddartha  | Roy          | Khushi1@                   |                            | gain-weight          | CrossFit  | Passwords do not match                                  | 400        |
      | siddartha_roy@example.com      | Siddartha  | Roy          | Abcdefghijklmnopqrstuvw$1  | Abcdefghijklmnopqrstuvw$1  | gain-weight          | CrossFit  | Password must be between 8 and 16 characters | 400 |
      | siddartha_roy@example.com      | Siddartha$ | Roy          | Khushi1@                   | Khushi1@                   | gain-weight          | CrossFit  | First name Name must only contain letters and spaces                           | 400 |
      | siddartha_roy@example.com      | Siddartha  | R@y          | Khushi1@                   | Khushi1@                   | gain-weight          | CrossFit  | Last name Name must only contain letters and spaces                            | 400 |
      | siddartha_roy@example.com      | Siddartha- | Roy          | Khushi1@                   | Khushi1@                   | gain-weight          | CrossFit  | First name Name must only contain letters and spaces                            | 400 |
      | siddartha_roy@example.com      | Siddartha  | Roy-         | Khushi1@                   | Khushi1@                   | gain-weight          | CrossFit  | Last name Name must only contain letters and spaces                           | 400 |


  Scenario Outline: Registration should fail with invalid email format
    Given User tries to register with email "<email>", firstName "<firstName>", lastName "<lastName>", password "<password>", confirmPassword "<confirmPassword>", target "<target>", and activity "<activity>"
    Then Registration should fail with status code "<statusCode>" and error message "<errorMessage>"

    Examples:
      | email                         | firstName  | lastName      | password   | confirmPassword | target              | activity | errorMessage                                                             | statusCode |
      | tushar!gmail.com              | Tushar     | Anand         | Test@123   | Test@123        | improve-flexibility | CrossFit | Please enter a valid email address (e.g. username@domain.com)           | 400        |
      | tushar..anand@gmail.com       | Tushar     | Anand         | Test@123   | Test@123        | improve-flexibility | CrossFit | Please enter a valid email address (e.g. username@domain.com)           | 400        |
      | tushar_anand@domain_com       | Tushar     | Anand         | Test@123   | Test@123        | improve-flexibility | CrossFit | Please enter a valid email address (e.g. username@domain.com)           | 400        |
      | tushar$anand@domain.com       | Tushar     | Anand         | Test@123   | Test@123        | improve-flexibility | CrossFit | Please enter a valid email address (e.g. username@domain.com)           | 400        |
      | tushar@domain..com            | Tushar     | Anand         | Test@123   | Test@123        | improve-flexibility | CrossFit | Please enter a valid email address (e.g. username@domain.com)           | 400        |
      | siddartha_roy@.com            | Siddartha  | Roy           | Test@123   | Test@123        | improve-flexibility | CrossFit | Please enter a valid email address (e.g. username@domain.com)           | 400        |
      | Tushargmail.com               | Tushar     | Anand         | Test@123   | Test@123        | improve-flexibility | CrossFit | Please enter a valid email address (e.g. username@domain.com)           | 400        |


  Scenario: Registration should fail with missing body
    Given User tries to register with missing body "{}"
    Then Registration should fail with status code "400" and proper Error Message should be shown


  Scenario Outline: Registration should be successful with valid email formats
    Given User tries to register with email "<email>", firstName "<firstName>", lastName "<lastName>", password "<password>", confirmPassword "<confirmPassword>", target "<target>", and activity "<activity>"
    Then Registration should be successful with status code "<StatusCode>" and message "<Message>"

    Examples:
      | email                         | firstName | lastName | password  | confirmPassword | target            | activity         | StatusCode |  Message |
      | siddartha_royalsab@example1.com | Siddartha | Roy      | Khushi1@  | Khushi1@        | gain-weight     | CrossFit | 201   | User registered successfully |
      | siddartha_royalsab@example-1.com | Siddartha | Roy      | Khushi1@  | Khushi1@        | gain-weight    | CrossFit | 201 | User registered successfully |


  Scenario Outline: Registration should fail when email already exists
    Given User tries to register with email "<email>", firstName "<firstName>", lastName "<lastName>", password "<password>", confirmPassword "<confirmPassword>", target "<target>", and activity "<activity>"
    Then Registration should fail with status code "<statusCode>" and error message "<errorMessage>" for already registered email

    Examples:
      | email                   | firstName | lastName | password  | confirmPassword | target      | activity | errorMessage                         | statusCode |
      | jhon_smith@example.com | Siddartha | Roy      | Khushi1@  | Khushi1@        | gain-weight | CrossFit | User with this email already exists  | 400        |
