Feature: Test Registration Page
  Scenario: Verify labels are clear and visible
    Given User is on the Registration Page
    Then All field labels should be visible


  Scenario Outline: Valid user registration with correct field formats
    Given User is on the Registration Page
    When User enters "<FirstName>", "<LastName>", "<Email>", "<Password>", "<ConfirmPassword>", "<Target>", and "<Activity>"
    And User clicks on the Register button
    Then Registration should be successful
    And User should be redirected to the Login Page

    Examples:
      | FirstName | LastName | Email              | Password   | ConfirmPassword | Target              | Activity           |
      | Tushar    | Anand    | tushar@test.com    | Test@1234  | Test@1234       | Improve Flexibility | Strength Training  |
      | Ananya    | Sen      | ananya@test.com    | Pass@4567  | Pass@4567       | General Fitness     | CrossFit           |
      | Tushar    | Anand    | tushar1@test.com   | Test@1234  | Test@1234       | Improve Flexibility | Strength Training  |


  Scenario Outline: Verify error when required fields are left blank
    Given User is on the Registration Page
    When User enters "<FirstName>", "<LastName>", "<Email>", "<Password>", "<ConfirmPassword>", "<Target>", and "<Activity>"
    Then Error messages should be displayed for each empty required field

    Examples:
      | FirstName | LastName | Email           | Password   | ConfirmPassword | Target              | Activity           |
      |           | Anand    | test@test.com   | Test@123   | Test@123        | Improve Flexibility | Strength Training  |
      | Tushar    |          | test@test.com   | Test@123   | Test@123        | General Fitness     | CrossFit           |
      | Tushar    | Anand    |                 | Test@123   | Test@123        | Improve Flexibility | Strength Training  |
      | Tushar    | Anand    | test@test.com   |            |                 | General Fitness     | CrossFit           |
      | Tushar    | Anand    | test@test.com   | Test@123   |                 | General Fitness     | CrossFit           |
      | Tushar    | Anand    | test@test.com   | Test@123   | Test@123        |                     | Strength Training  |
      | Tushar    | Anand    | test@test.com   | Test@123   | Test@123        | Improve Flexibility |                   |
      |           |          |                 |            |                 |                     |                   |


  Scenario Outline: Verify error when invalid email formats are entered
    Given User is on the Registration Page
    When User enters "<FirstName>", "<LastName>", "<Email>", "<Password>", "<ConfirmPassword>", "<Target>", and "<Activity>"
    And User clicks on the Register button
    Then An error message "Invalid email format" should be displayed for "email" field
    Examples:
      | FirstName | LastName | Email                   | Password  | ConfirmPassword | Target              | Activity           |
      | Tushar    | Anand    | tushar!gmail.com         | Test@123  | Test@123        | Improve Flexibility | Strength Training  |
      | Tushar    | Anand    | tushar..anand@gmail.com  | Test@123  | Test@123        | Improve Flexibility | Strength Training  |
      | Tushar    | Anand    | tushar_anand@domain_com  | Test@123  | Test@123        | Improve Flexibility | Strength Training  |
      | Tushar    | Anand    | tushar$anand@domain.com  | Test@123  | Test@123        | Improve Flexibility | Strength Training  |
      | Tushar    | Anand    | tushar@domain..com       | Test@123  | Test@123        | Improve Flexibility | Strength Training  |


#--------------
  Scenario Outline: Verify password policy error messages for invalid formats
    Given User is on the Registration Page
    When User enters "<FirstName>", "<LastName>", "<Email>", "<Password>", "<ConfirmPassword>", "<Target>", and "<Activity>"
    And User clicks on the Register button
    Then An error message "<ErrorMessage>" should be displayed for "Password" field
    Examples:
      | FirstName | LastName | Email               | Password   | ConfirmPassword | Target           | Activity          | ErrorMessage |
      | Tushar    | Anand    | tushar@test.com     | abc@1234   | abc@1234        | Improve Flexibility | Strength Training |  |
      | Ananya    | Sen      | ananya@test.com     | ABC@1234   | ABC@1234        | General Fitness     | CrossFit          | • Include a lowercase letter |
      | Ravi      | Mehta    | ravi@test.com       | Abcdefgh   | Abcdefgh        | Improve Flexibility | CrossFit          | • Include a number • Include a special character |
      | Sneha     | Rao      | sneha@test.com      | A@ghkbks  | A@ghkbks        | General Fitness     | CrossFit          | • Include a number |


  Scenario Outline: Verify error messages when special characters, emojis, numbers, or invalid inputs are entered in First Name and Last Name fields
    Given User is on the Registration Page
    When User enters invalid First Name "<FirstName>" and Last Name "<LastName>"
    And User clicks on the Register button
    Then Proper error message for First Name "<FirstNameError>" and Last Name "<LastNameError>" should be displayed
    Examples:
      | FirstName | LastName |FirstNameError                     | LastNameError                     |
      | Tushar123 | Anand    | must only contain letters/spaces. |                                   |
      | Tushar    | Anand@   |                                   | must only contain letters/spaces. |
      | Tu$har    | Anand    | must only contain letters/spaces. |                                   |
      | Tushar    | An@nd    |                                   | must only contain letters/spaces. |
      | Tu sh@r   | An@nd    | must only contain letters/spaces. | must only contain letters/spaces. |
      | André     | Anand    | must only contain letters/spaces. |                                   |
      | Tushar    | Émilie   |                                   | must only contain letters/spaces. |
      | SPACE     | SPACE    | First name must be at least 2 characters. | Last name must be at least 2 characters. |


  Scenario Outline: Verify error when Confirm Password does not match Password
    Given User is on the Registration Page
    When User enters "<FirstName>", "<LastName>", "<Email>", "<Password>", "<ConfirmPassword>", "<Target>", and "<Activity>"
    And User clicks on the Register button
    Then An error message "Passwords do not match" should be displayed for "confirmpassword" field

    Examples:
      | FirstName | LastName | Email               | Password   | ConfirmPassword | Target           | Activity          |
      | Tushar    | Anand    | tushar@test.com     | Test@1234  | Test@123        | Improve Flexibility | Strength Training |
      | Ananya    | Sen      | ananya@test.com     | Pass@4567  | Pass@456        | General Fitness     | CrossFit          |


  Scenario Outline: Verify error when registering with duplicate email addresses
    Given User is on the Registration Page
    When User enters "<FirstName>", "<LastName>", "<Email>", "<Password>", "<ConfirmPassword>", "<Target>", and "<Activity>"
    And User clicks on the Register button
    Then An error message dialog box should be displayed "<Result>"

    Examples:
      | FirstName | LastName | Email              | Password | ConfirmPassword | Target               | Activity            | Result |
      | Tushar    | Anand    | duplicate@test.com | Test@123 | Test@123        | Improve Flexibility  | Strength Training   | false  |
      | Rahul     | Sharma   | duplicate@test.com | Test@123 | Test@123        |Improve Flexibility   | Strength Training   | true   |


  Scenario Outline: Verify error messages for invalid password formats
    Given User is on the Registration Page
    When User enters "<FirstName>", "<LastName>", "<Email>", "<Password>", "<ConfirmPassword>", "<Target>", and "<Activity>"
    And User clicks on the Register button
    Then An error message "<ErrorMessage>" should be displayed for "password" field
    Examples:
      | FirstName | LastName | Email                 | Password     | ConfirmPassword | Target              | Activity           | ErrorMessage |
      | John      | Doe      | johndoe@example.com   | abc@1234     | abc@1234        | Improve Flexibility | Strength Training  |  |
      | Priya     | Sharma   | priyasharma@test.com  | ABC@1234     | ABC@1234        | General Fitness     | CrossFit           | • Include a lowercase letter |
      | Rohan     | Verma    | rohanverma@test.com   | Abcdefgh     | Abcdefgh        | Improve Flexibility | Strength Training  | • Include a number • Include a special character |
      | Sneha     | Rao      | sneharao@test.com     | Abc@ 1234    | Abc@ 1234       | General Fitness     | CrossFit           | • Must not contain spaces                        |
      | Tina      | Dey      | tinadey@test.com      | Abc~1234     | Abc~1234        | General Fitness     | CrossFit           | • Include a special character                    |
      | Ravi      | Mehta    | ravimehta@test.com    | Abc12345     | Abc12345        | Improve Flexibility | Strength Training  | • Include a special character                    |
      | Anu       | Roy      | anuroy@test.com       | 1234@5678    | 1234@5678       | General Fitness     | CrossFit           | • Must start with a capital letter • Include a lowercase letter|
      | Vikram    | Das      | vikramdas@test.com    | ABCdefGHIJKL@| ABCdefGHIJKL@   | Improve Flexibility | Strength Training  | • Include a number                                             |


  Scenario Outline: Verify successful form submission with valid password formats
    Given User is on the Registration Page
    When User enters "<FirstName>", "<LastName>", "<Email>", "<Password>", "<ConfirmPassword>", "<Target>", and "<Activity>"
    And User clicks on the Register button
    Then Registration should be successful
    And User should be redirected to the Login Page
    Examples:
      | FirstName | LastName | Email                 | Password         | ConfirmPassword  | Target              | Activity           |
      | John      | Doe      | johndoe@example.com   | Abc@1234         | Abc@1234         | Improve Flexibility | Strength Training  |
      | Priya     | Sharma   | priyasharma@test.com  | GoodPass@9       | GoodPass@9       | General Fitness     | CrossFit           |
      | Rohan     | Verma    | rohanverma@test.com   | Strong1#Pass     | Strong1#Pass     | Improve Flexibility | Strength Training  |
      | Sneha     | Rao      | sneharao@test.com     | Fit$Me123        | Fit$Me123        | General Fitness     | CrossFit           |
      | Amit      | Singh    | amitsingh@test.com    | ShapeUp!8        | ShapeUp!8        | Improve Flexibility | Strength Training  |
      | Rahul     | Kumar    | rahulkumar@test.com   | RunFast#99       | RunFast#99       | General Fitness     | CrossFit           |
      | Tina      | Dey      | tinadey@test.com      | GetFit$321       | GetFit$321       | Improve Flexibility | Strength Training  |
      | Ravi      | Mehta    | ravimehta@test.com    | Power@Work1      | Power@Work1      | General Fitness     | CrossFit           |
      | Anu       | Roy      | anuroy@test.com       | Muscle^Man12     | Muscle^Man12     | Improve Flexibility | Strength Training  |
      | Vikram    | Das      | vikramdas@test.com    | HappyFit#2024    | HappyFit#2024    | General Fitness     | CrossFit           |


  Scenario: Verify Activity Dropdown has valid options
    Given User is on the Registration Page
    When User clicks on the Activity dropdown
    Then Activity Dropdown displays correct options


  Scenario: Verify Target Dropdown has valid options
    Given User is on the Registration Page
    When User clicks on the Target dropdown
    Then Target Dropdown displays correct options


  Scenario: All images should load properly on the Registration Page
    Given User is on the Registration Page
    Then all images on the Registration Page should be displayed properly


  Scenario: "Login Here" link should navigate to the Login Page
    Given User is on the Registration Page
    When the user clicks on the Login Here link
    Then the Login Page should be opened


  Scenario Outline: Form fields reset on submission interruption
    Given User is on the Registration Page
    When User enters "<FirstName>", "<LastName>", "<Email>", "<Password>", "<ConfirmPassword>", "<Target>", and "<Activity>"
    And the form submission is interrupted
    Then all form fields should reset to their default state
    Examples:
      | FirstName | LastName | Email                  | Password  | ConfirmPassword | Target           | Activity  |
      | John      | Doe      | john.doe@example.com   | P@ss1234  | P@ss1234        | General Fitness  | CrossFit  |
      | Jane      | Smith    | jane.smith@example.com | @Bcd1234  | @Bcd1234        | General Fitness  | CrossFit  |


  Scenario Outline: Verify error for names shorter than 2 characters or longer than 50 characters
    Given User is on the Registration Page
    When User enters invalid First Name "<FirstName>" and Last Name "<LastName>"
    And User clicks on the Register button
    Then Proper error message for First Name "<FirstNameError>" and Last Name "<LastNameError>" should be displayed

    Examples:
      | FirstName                                             | LastName                                              | FirstNameError                  | LastNameError                  |
      | A                                                     | Kumar                                                 | must be at least 2 characters.  |                                |
      | Rahul                                                 | B                                                     |                            | must be at least 2 characters. |
      | AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA | Sharma                                                | must not exceed 50 characters.       |                                |
      | Priya                                                 | BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB   |                               | must not exceed 50 characters.      |
      | B                                                     | C                                                     | must be at least 2 characters.  | must be at least 2 characters. |
      | DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD | EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE  | must not exceed 50 characters.       | must not exceed 50 characters.      |


  Scenario Outline: Verify error for passwords longer than 16 characters
    Given User is on the Registration Page
    When User enters Password "<Password>"
    And User clicks on the Register button
    Then An error message "• Must be 8–16 characters" should be displayed for "password" field
    Examples:
      | Password |
      | Abcdefghijk@lmnopq1!12 |
      | P1234567890abcdeAfg#T   |
      | VeryLongPassword123456789$ |