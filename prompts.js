
module.exports = [
  {
    name: 'systemsRequired',
    type: 'checkbox', // Using checkbox to allow multiple selections
    message: 'Choose your system required:',
    choices: [
      { name: 'Windows', value: 'windows' },
      { name: 'Web Development', value: 'webdevelopment' },
      { name: 'macOS', value: 'macos' },
      { name: 'Linux', value: 'linux' },
    ],
    default: ['windows'], 
  },
  {
    name: "authRequired", // Miami authentication
    type: "list",
    message: "Choose the auth type required:",
    choices: [
      { title: "No Authentication", value: "No Authentication" },
      { title: "Authentication using MIAMI (OAuth)", value: "Authentication using MIAMI (OAuth)" },
    ],
    initial: 0, 
  },
  {
    name: "isSideBarRequired", // Menu type
    type: "list",
    message: "Choose the menu type required:",
    choices: [
      { title: "Horizontal Menu", value: "Horizontal Menu" },
      { title: "Vertical Menu", value: "Vertical Menu" },
    ],
    initial: 0, 
    
  },
  {
    name: "isFileBarRequired", 
    type: "confirm",
    message: "Choose the file bar requirement:",
    initial: false, 
  },
  {
    name: "playwright_automation",
    type: "confirm",
    message:
      "Do you wish to include E2E Automation using playwright ?",
    default: false,
  },
  {
    when: answers => answers.playwright_automation,
    name: "t4j_key",
    type: "input",
    default: "testProject",
    message: "Enter your T4J project key",
  },
  {
    name: "unit_test_case",
    type: "confirm",
    message:
      "Do you wish to include Unit test cases using Vitest ?",
    default: false,
  },
];
