import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';


const app = createApp(App)
const pinia = createPinia();
app.use(router);
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
app.use(pinia);
app.mount('#app');


console.log("Renderer process started");

function showAlert(message) {
  console.log(`showAlert called with message: ${message}`);
  const alertContainer = document.getElementById('alert-container');
  if (alertContainer) {
    const alert = document.createElement('ifx-alert');
    
    alert.setAttribute('aria-live', 'assertive');
    alert.setAttribute('variant', 'warning');
    alert.setAttribute('icon', 'c-info-24');
    alert.setAttribute('closable', 'true');
    alert.innerText = `Attention! ${message} — check it out!`;
    
    alertContainer.appendChild(alert);

    setTimeout(() => {
      if (alertContainer.contains(alert)) {
        alertContainer.removeChild(alert);
      }
    }, 60000); // 1 minute
  } else {
    console.error('Alert container not found!');
  }
}

window.electron.api.onNewArtifact((message) => {
//   console.log(`Received message in renderer: ${message}`);
  showAlert(message);
});

// Test IPC
// window.electron.api.sendTestMessage('Hello from renderer');
// window.electron.api.onTestReply((arg) => {
//   console.log(`Received reply in renderer: ${arg}`);
// });

