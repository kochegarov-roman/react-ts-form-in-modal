import {shallow} from "enzyme";
import {Accordion} from "../components/Accordion";
import React from "react";
import {additionalFeatures, productsTypes} from "../constants/mock";
import {FormOrder} from "../components/FormOrder";

describe('render additionalFeatures & Accordion', () => {

    const sendForm = jest.fn();

    it('should render Accordion items after click', () => {
        const wrapper = shallow(
            <Accordion items={productsTypes}/>
        );
        wrapper.find('.title-accordion').simulate('click');
        expect(wrapper.find(".accordion-item")).toHaveLength(productsTypes.length);
    });

    it('should render additionalFeatures', () => {
        const wrapper = shallow(
            <FormOrder additionalFeatures={additionalFeatures}
                       productsTypes={[]}
                       handleSendForm={sendForm}/>
        );
        expect(wrapper.find('[data-name="feature"]')).toHaveLength(Object.values(additionalFeatures).length);
    });
});

