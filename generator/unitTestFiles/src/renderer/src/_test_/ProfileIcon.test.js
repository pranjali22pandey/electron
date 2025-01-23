import { mount } from '@vue/test-utils';
import { expect, test, describe } from 'vitest'
import ProfileIcon from '@/components/ProfileIcon.vue';

describe('test ProfileIcon component', () => {
    test('render component', () => {
        const wrapper = mount(ProfileIcon, { props: {
            userName: "Infineon",
            userNameShort: "IND"
        }});
        expect(wrapper.text()).toContain('IND');
    })
})
