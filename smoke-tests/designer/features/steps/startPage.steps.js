const { Given, When, Then } = require("cucumber");
const ConfigPage = require("../pageobjects/pages/config.page");

Given("I am on the form designer start page", function () {
  ConfigPage.open();
  expect(ConfigPage.pageHeader).toHaveText(
    "Create a new form or edit an existing form"
  );
});

When("I try to create a new form without entering a form name", function () {
  ConfigPage.startBtn.click();
});

Then("I am informed there is a problem", function () {
  expect(ConfigPage.errorSummary).toBeDisplayed();
  expect(ConfigPage.errorSummaryHeading).toHaveText("There is a problem");
});

Then("the error message {string} is displayed", function (errorMessage) {
  expect(ConfigPage.errorSummaryErrors(0)).toHaveText(errorMessage);
  expect(ConfigPage.nameError).toHaveText(errorMessage);
});