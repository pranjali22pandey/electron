const options = `
--require setup/assertions.js
--require setup/hooks.js
--require e2e/playwright/step-definitions/**/*.js
--require playwright.config.js
--format @cucumber/pretty-formatter 
-f json:cucumber_report.json --publish-quiet
`

let run_features = ['e2e/playwright/features/', options].join(' ')

module.exports = {
  test_runner: run_features
}
