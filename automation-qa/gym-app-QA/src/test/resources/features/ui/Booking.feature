#Feature: Access Booking Form from Client Dashboard
#
##  Scenario: Client accesses booking form from dashboard
##    Given Client is logged in
##    When Client clicks on the "Sayantan123 Doe" section
##    Then Booking form should be displayed successfully
#
##  Scenario: Try accessing workout booking form without logging in
##    Given Client is not logged in
##    When Client tries to access the workout booking form
##    Then User should be prompted to log in
#
##----
##  Scenario: Display "No Workouts Available" message if all slots are booked
##    Given All workout slots are booked
##    When Client accesses the workout booking form
##    Then Message "No Workouts Available" should be clearly displayed
#
## ----
##  Scenario: Attempt to double-book the same time slot
##    Given Client is logged in
##    And the client has already booked a workout at "10:00 AM"
##    When the client tries to book another workout at "10:00 AM"
##    Then an error message "You already have a workout booked at this time" should be displayed
#
#
#  Scenario: Display success message after successful booking
#    Given Client is logged in
#    When the client successfully books a workout
#    Then a success message should appear on top of the screen
#
#  Scenario: Verify Login button on dialog box redirects correctly
#    Given the user sees the login required dialog box
#    When the user clicks the Login button on the dialog
#    Then the user should be redirected to the login page
#
#
#  Scenario: Check visibility and interaction of Home Page UI elements
#    Given Client is not logged in
#    Then all primary UI elements should be visible, properly aligned, and interactable