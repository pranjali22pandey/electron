const reporter =require("cucumber-html-reporter")
const options={
    theme: 'bootstrap',
    jsonFile: 'cucumber_report.json',
    output:'reports/cucumber_report.html',
    reportSuiteAsScenario:true,
    scenarioTimestamp: true,
    displayReportTime: true,
    displayDuration: true,
    launchReport: true,
    addsTimestamp :true,
    ignoreBadJsonFile: true,
    overwrite: false,
    screenshot:"only-on failure",
    video:"retain-on-failure",
    storeScreenshots:true,
    noInlineScreenshots:true,
    screenshotsDirectory: '/screenshots/',
    metadata:{
        "App Version":'2.0.0',
        'Test Environment':'Dev',
        Browser:'Chrome',
        Platform:'Windows 10'
    },

}
reporter.generate(options)