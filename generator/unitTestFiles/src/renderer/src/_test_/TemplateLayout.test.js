// TemplateLayout.test.js
<%_ if(promptResults.isSideBarRequired=="Vertical Menu" ) { _%>
import { mount } from '@vue/test-utils';
import { expect, test, describe } from 'vitest';
import TemplateLayout from '@/components/TemplateLayout.vue';
import SideBar from '@/components/SideBar.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Create a mock router for Vue 3
const routes = [
  {
    path: '/',
    component: { template: '<div class="router-view-component"></div>' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

describe('TemplateLayout.vue', () => {
  test('renders SideBar component', () => {
    const wrapper = mount(TemplateLayout, {
      global: {
        plugins: [router]
      }
    });
    const sideBar = wrapper.findComponent(SideBar);
    expect(sideBar.exists()).toBe(true);
  });

  test('renders search field and header icons', () => {
    const wrapper = mount(TemplateLayout, {
      global: {
        plugins: [router]
      }
    });
    const searchField = wrapper.find('ifx-search-field');
    expect(searchField.exists()).toBe(true);
    expect(searchField.attributes('size')).toBe('m');
    expect(searchField.attributes('disabled')).toBe('false');
    expect(searchField.attributes('show-delete-icon')).toBe('true');
    
    const icons = wrapper.findAll('.dds-header-icons');
    expect(icons.length).toBe(3);
  });

  test('passes props to router-view', () => {
    const wrapper = mount(TemplateLayout, {
      global: {
        plugins: [router]
      },
      props: {
        userName: 'Infineon'
      }
    });
    const routerViewComponent = wrapper.find('.router-view-component');
    expect(routerViewComponent.exists()).toBe(true);
    // Assuming that the router-view component would use the prop and render it in some way
    // You need a method to verify the prop, such as text or attribute in the rendered component
  });
});
<%_ } _%>



<%_ if(promptResults.isSideBarRequired == "Horizontal Menu" ) { _%>
import { mount } from '@vue/test-utils';
import { expect, test, describe } from 'vitest';
import TemplateLayout from '@/components/TemplateLayout.vue';
import NavBar from '@/components/NavBar.vue'; // Ensure NavBar is correctly imported
import { createRouter, createWebHistory } from 'vue-router';

// Create a mock router for Vue 3
const routes = [
  {
    path: '/',
    component: { template: '<div class="router-view-component"></div>' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

describe('TemplateLayout.vue', () => {
  test('renders NavBar component', () => {
    const wrapper = mount(TemplateLayout, {
      global: {
        plugins: [router]
      }
    });
    const navBar = wrapper.findComponent(NavBar);
    expect(navBar.exists()).toBe(true);
  });


  
  });
  <%_ } _%>