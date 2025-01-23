// tests/unit/router.test.js
import { describe, it, expect } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import router from '@/router'; // Adjust the import path as necessary
import AgGrid from '@/components/AgGrid.vue'; // Adjust the import path as necessary
import HomeComponent from '@/components/HomeComponent.vue'; // Adjust the import path as necessary

describe('Router configuration', () => {
  it('should have the correct routes', () => {
    expect(router.options.routes).toEqual([
      {
        path: '/',
        name: 'Home',
        component: HomeComponent,
      },
      {
        path: '/ag-grid',
        name: 'AG-Grid',
        component: AgGrid,
      }
    ]);
  });

  it('should render HomeComponent for the root path', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(HomeComponent, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should render AgGrid component for the /ag-grid path', async () => {
    router.push('/ag-grid');
    await router.isReady();

    const wrapper = mount(AgGrid, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });
});
