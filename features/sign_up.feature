Feature: Sign Up
  In order for users to sign up
  A visitor
  Should be able to register on the site (once they receive the correct invite URL)

  @javascript
  Scenario: Register as a new user with a new account
    Given a user named "John" is registered
      And the database has the necessary lookup tables
      And an account called "Acme" is set up for "John"
      And I am on the sign up page
    When I press "Sign up"
    Then I should see "You must enter an account name"
      And there should be 5 "this field is required messages"
      And I should see "Please enter your full name"
    When I fill in "Sign Up Account Name" using Javascript with "Acme"
      And I press "Sign up"
      And I wait for 2 seconds
    Then I should see "An account with this name is already set up"
    When I fill in "Account Name" with "Big co"
      And I select "British English" from "What is your preferred language setting?"
      And I fill in "Default day rate" with "800"
      And I fill in "Default velocity achieved per day" with "5"
      And I fill in "Full name" with "James"
      And I fill in "Sign Up Email" using Javascript with "john@acme.com"
      And I fill in "Password" with "123"
      And I press "Sign up"
    Then I should see "Someone is already registered with that email address"
      And I should see "Please enter at least 6 characters"
    When I fill in "Email" with "james@acme.com"
      And I fill in "Password" with "password"
      And I press "Sign up"
    Then I should see "The password confirmation is not the same"
    When I fill in "Password confirmation" with "password"
      And I press "Sign up"
    Then I should see the notice "Your new account has been created for you"
    And I should see "Big co" within the "primary page heading"

    Then I should see the text "Example corporate website backlog"
      And I should see the text "We've added this great example of how people are using easyBacklog"