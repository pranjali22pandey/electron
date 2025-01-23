// tests/unit/App.test.js
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import App from '@/App.vue'; // Adjust the import path as necessary

describe('App.vue', () => {
  it('renders the component correctly', () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });
});
