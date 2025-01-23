// SideBar.test.js
import { mount } from '@vue/test-utils';
import { expect, test, describe } from 'vitest';
import SideBar from '@/components/SideBar.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { RouterLink } from 'vue-router';

// Create a mock router for Vue 3
const routes = [
  { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
  { path: '/ag-grid', name: 'AG-Grid', component: { template: '<div>AG-Grid</div>' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

describe('SideBar.vue', () => {
  test('renders sidebar with proper attributes', () => {
    const wrapper = mount(SideBar, {
      global: {
        plugins: [router]
      }
    });
    const ifxSidebar = wrapper.find('ifx-sidebar');
    expect(ifxSidebar.exists()).toBe(true);
    expect(ifxSidebar.attributes('application-name')).toBe('Application Name');
    expect(ifxSidebar.attributes('show-header')).toBe('true');
    expect(ifxSidebar.attributes('show-footer')).toBe('true');
    expect(ifxSidebar.attributes('initial-collapse')).toBe('true');
    expect(ifxSidebar.attributes('terms-of-use')).toBe('https://yourwebsite.com/terms');
    expect(ifxSidebar.attributes('imprint')).toBe('https://yourwebsite.com/imprint');
    expect(ifxSidebar.attributes('privacy-policy')).toBe('https://yourwebsite.com/privacy-policy');
    expect(ifxSidebar.attributes('copyright-text')).toBe('© 1999 - 2024 Infineon Technologies AG');
  });

  test('renders sidebar items with RouterLink', () => {
    const wrapper = mount(SideBar, {
      global: {
        plugins: [router]
      }
    });
    const sidebarItems = wrapper.findAll('ifx-sidebar-item');
    expect(sidebarItems.length).toBe(2);

    const homeLink = sidebarItems.at(0).findComponent(RouterLink);
    expect(homeLink.exists()).toBe(true);
    expect(homeLink.text()).toBe('Home');
    expect(homeLink.attributes('href')).toBe('/');

    const agGridLink = sidebarItems.at(1).findComponent(RouterLink);
    expect(agGridLink.exists()).toBe(true);
    expect(agGridLink.text()).toBe('AG-Grid');
    expect(agGridLink.attributes('href')).toBe('/ag-grid');
  });
});
