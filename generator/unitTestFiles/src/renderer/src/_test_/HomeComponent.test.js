// HomeComponent.test.js
import { mount } from '@vue/test-utils';
import { expect, test, describe } from 'vitest';
import HomeComponent from '@/components/HomeComponent.vue';

describe('HomeComponent.vue', () => {
  test('renders default user', () => {
    const wrapper = mount(HomeComponent);
    expect(wrapper.text()).toContain('Hello ! User');
  });

  test('renders provided userName', () => {
    const wrapper = mount(HomeComponent, {
      props: {
        userName: 'Infineon'
      }
    });
    expect(wrapper.text()).toContain('Hello ! Infineon');
  });
});
