@Regression
Feature: Electron Application

    Description: Testing functionalities of the electron application.

    # ================================================ ELECTRON APPLICATION VALIDATIONS ============================================= #

    @Electron-1
    Scenario Outline: Electron-1 Verify the Electron application loads
        Given the Electron application is launched
        When the user navigates to the Home page
        Then the Home page should be displayed
        When the title of page should be displayed

        Examples:
            |            |
            |            |

    @Electron-2
    Scenario Outline: Electron-2 Verify navigation to another page
        Given the Electron application is launched
        When the user navigates to the Aggrid page
        Then the Aggrid page should be displayed

        Examples:
            |            |
            |            |
