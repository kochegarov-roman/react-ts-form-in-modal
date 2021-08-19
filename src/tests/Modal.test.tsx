import "jsdom-global/register";
import React from 'react';
import {mount} from "enzyme";
import {FormInModal} from "../components/FormInModal";


describe('open & close Modal', () => {

    const setUp = () => mount(<FormInModal/>);

    it('should render Modal after click', () => {
        const wrapper = setUp();
        wrapper.find('#open-form').simulate('click');
        expect(wrapper.find(".modal")).toHaveLength(1);
    });

    it('close Modal', () => {
        const wrapper = setUp();
        wrapper.find('#open-form').simulate('click');
        wrapper.find('.modal-close-button').simulate('click');
        expect(wrapper.find(".modal")).toHaveLength(0);
    });

});