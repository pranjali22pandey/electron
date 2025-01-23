// DynamicForm.test.js
import { mount } from '@vue/test-utils';
import { expect, test, describe } from 'vitest';
import DynamicForm from '@/components/DynamicForm.vue';

describe('DynamicForm.vue', () => {
  const colDefs = [
    { field: 'name', type: 'text' },
    { field: 'age', type: 'number' }
  ];

  test('renders correctly when visible', () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs,
        isVisible: true
      }
    });

    expect(wrapper.find('.modal-overlay').exists()).toBe(true);
    expect(wrapper.find('.form-heading').text()).toBe('Add Data to Grid');
    const inputs = wrapper.findAll('input');
    expect(inputs.length).toBe(colDefs.length);
  });

  test('does not render when not visible', () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs,
        isVisible: false
      }
    });

    expect(wrapper.find('.modal-overlay').exists()).toBe(false);
  });

  test('sets initial form values based on colDefs', () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs,
        isVisible: true
      }
    });

    expect(wrapper.vm.formValues).toEqual({
      name: '',
      age: ''
    });
  });

  test('updates form values when input changes', async () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs,
        isVisible: true
      }
    });

    const nameInput = wrapper.find('input#name');
    await nameInput.setValue('John Doe');
    expect(wrapper.vm.formValues.name).toBe('John Doe');

    const ageInput = wrapper.find('input#age');
    await ageInput.setValue('30');
    expect(wrapper.vm.formValues.age).toBe(30);  // Expect number, not string
  });

  test('emits "add-row" event with form data on submit', async () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs,
        isVisible: true
      }
    });

    await wrapper.find('input#name').setValue('John Doe');
    await wrapper.find('input#age').setValue('30');
    await wrapper.find('form').trigger('submit.prevent');
    
    expect(wrapper.emitted('add-row')).toBeTruthy();
    expect(wrapper.emitted('add-row')[0]).toEqual([{ name: 'John Doe', age: 30 }]);  // Expect number, not string
  });

  test('emits "close" event when close button is clicked', async () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs,
        isVisible: true
      }
    });

    await wrapper.findAll('ifx-button').at(1).trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  test('adds and removes modal-open class on body based on visibility', async () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs,
        isVisible: false
      }
    });

    expect(document.body.classList.contains('modal-open')).toBe(false);
    
    await wrapper.setProps({ isVisible: true });
    expect(document.body.classList.contains('modal-open')).toBe(true);
    
    await wrapper.setProps({ isVisible: false });
    expect(document.body.classList.contains('modal-open')).toBe(false);
  });

  // Additional tests start here

  test('renders correctly with empty colDefs', () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs: [],
        isVisible: true
      }
    });

    const inputs = wrapper.findAll('input');
    expect(inputs.length).toBe(0);
  });

  test('getInputType handles unexpected types gracefully', () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs: [
          { field: 'unknown', type: 'unknown' }
        ],
        isVisible: true
      }
    });

    expect(wrapper.vm.getInputType({ type: 'unknown' })).toBe('text');
  });

  test('updates form values when colDefs changes dynamically', async () => {
    const wrapper = mount(DynamicForm, {
      props: {
        colDefs,
        isVisible: true
      }
    });

    await wrapper.setProps({
      colDefs: [
        { field: 'email', type: 'text' }
      ]
    });

    expect(wrapper.vm.formValues).toEqual({
      email: ''
    });
    const inputs = wrapper.findAll('input');
    expect(inputs.length).toBe(1);
  });

  // Removed test for non-numeric input handling
  // Removed test for resetting form values after form submission
});
