const { consoleLogger } = require('../consoleLogger.js');
const fs = require('fs');
const path = require('path');


module.exports = function (api, options) {
  let promptResults = options;
  let currentFolderName;
  if (process.cwd().includes("/")) currentFolderName = process.cwd().split('/').pop();
  else currentFolderName = process.cwd().split('\\').pop();
  promptResults.directoryName = currentFolderName;
  consoleLogger(promptResults);

  /** Mandatory dependencies */
  let dependencies = {
    "@electron-toolkit/preload": "^3.0.1",
    "@electron-toolkit/utils": "^3.0.0",
    "@infineon/design-system-tokens": "^3.3.2",
    "@infineon/infineon-design-system-vue": "^24.1.0",
    "ag-grid-community": "^32.0.1",
    "ag-grid-vue3": "^32.0.1",
    "axios": "^1.7.7",
    "babel-eslint": "^10.1.0",
    "core-js": "^3.8.3",
    "electron-updater": "^6.1.7",
    "pinia": "^2.2.2",
    "sass": "^1.79.3",
    "sass-loader": "^16.0.2",
    "vue-router": "^4.1.6",
  };

  let devDependencies = {
    "@babel/core": "^7.23.5",
    "@babel/eslint-parser": "^7.23.3",
    "@electron-toolkit/eslint-config": "^1.0.2",
    "@ifxglobal/vue-cli-plugin-chart-themes": "~1.0.0",
    "@ifxglobal/vue-cli-plugin-grid-theme": "~1.0.0",
    "@rushstack/eslint-patch": "^1.10.3",
    "@vitejs/plugin-vue": "^5.0.5",
    "@vue/cli-plugin-babel": "~5.0.0",
    "@vue/cli-plugin-eslint": "~5.0.0",
    "@vue/cli-service": "~5.0.0",
    "@vue/compiler-sfc": "^3.4.30",
    "@vue/eslint-config-prettier": "^9.0.0",
    "@webdevelopment/vue-cli-plugin-frontend-vue-template-gridcharts": "~1.0.0",
    "electron": "^31.0.2",
    "electron-builder": "^24.13.3",
    "electron-vite": "^2.3.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-vue": "^9.26.0",
    "globals": "^15.6.0",
    "jsdoc": "^4.0.3",
    "jsdoc-vuejs": "^4.0.0",
    "prettier": "^3.3.2",
    "vite": "^5.3.1",
    "vite-plugin-eslint": "^1.8.1",
    "vue": "^3.4.30",
    "xlsx": "^0.18.5"
  };
  
  if(promptResults.playwright_automation) {//e2e
    devDependencies = {
      ...devDependencies,
      "playwright": "^1.22.2",
      "chai": "^4.3.6", 
      "@playwright/test": "^1.31.1",
      "@cucumber/cucumber": "^8.3.0",
      "@cucumber/pretty-formatter": "^1.0.0-alpha.2",
      "multiple-cucumber-html-reporter": "^1.21.4"
    }
    api.render("./e2eFiles", {
      promptResults,
    });
  }
  
 
  if(promptResults.unit_test_case) { // Vitest
    devDependencies = {
      ...devDependencies,
      "vitest": "^1.5.0",
      "@vitest/coverage-v8": "^1.5.2",
      "@vitest/ui": "^1.5.2",
      "@vue/test-utils": "^2.4.5",
      "happy-dom": "^14.7.1",
    }
    api.render("./unitTestFiles", {
      promptResults,
    });
  }

//miami
  if (promptResults.authRequired === "Authentication using MIAMI (OAuth)") {
    dependencies["@miami/miami"] = "^1.1.0";
  }
  
  if (promptResults.authRequired === "Authentication using MIAMI (OAuth)") {
    devDependencies["axios"] = "^1.6.4";
    devDependencies["vue3-toastify"] = "^0.2.1";
    devDependencies["concurrently"] = "^8.2.2";
  }

  const commonScripts = {
    format: "prettier --write .",
    lint: "eslint . --ext .js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    start: "electron-vite preview",
    dev: "electron-vite dev",
    build: "electron-vite build",
    "build:web": "vite build",
    postinstall: "electron-builder install-app-deps",
    "build:unpack": "npm run build && electron-builder --dir",
    "build:win": "npm run build && electron-builder --win",
    "build:mac": "npm run build && electron-builder --mac",
    "build:linux": "npm run build && electron-builder --linux",
    "test:e2e": "playwright test",
    doc: "jsdoc src -r -c jsdoc_config.json -d documents",
  };

  const miamiScripts = {
    "start:dev": "electron-vite dev",
    "start:serve": "docker compose up",
    "start:both": "concurrently \"npm run start:dev\" \"npm run start:serve\"",
    dev: "npm run start:both",
  };

  const playwrightScripts = {
    "test:e2e": "npx cucumber-js -p test_runner --tags",
  };

  const unitTestScripts = {
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui --coverage",
  };

  api.extendPackage({
    version: "1.0.0",
    dependencies: dependencies,
    devDependencies: devDependencies,
    scripts: {
      ...commonScripts,
      ...(promptResults.authRequired === "Authentication using MIAMI (OAuth)" ? miamiScripts : {}),
      ...(promptResults.playwright_automation ? playwrightScripts : {}),
      ...(promptResults.unit_test_case ? unitTestScripts : {}),
    },
  });
 

  // Conditionally render the appropriate templates based on user choices

  api.afterInvoke(() => {

    // Remove existing files/directories if they exist
    const existingFiles = ["./src/components/HelloWorld.vue",
      "./src/components/TheWelcome.vue",
      "./src/components/WelcomeItem.vue"
     ]; 

    existingFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        if (fs.statSync(file).isDirectory()) {
          fs.rmdirSync(file, { recursive: true });
        } else {
          fs.unlinkSync(file);
        }
      }
    });
  });

  if(promptResults.authRequired === "Authentication using MIAMI (OAuth)") {
    api.render("./templateFiles/miami", {
      promptResults,
    });
  }

  
  api.render("./templates", {
    promptResults,
  });


  if(promptResults.isSideBarRequired === "Horizontal Menu") {
    api.render("./templateFiles/horizontalNavBar", {
      promptResults,
    });
  }

};