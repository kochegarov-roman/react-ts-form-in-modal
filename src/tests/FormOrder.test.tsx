import "jsdom-global/register";
import React from 'react';
import {mount} from "enzyme";
import {FormOrder, FormOrderProps} from "../components/FormOrder";
import {AdditionalFeatures, ProductType} from "../constants/types";

const additionalFeatures: AdditionalFeatures = {
    0: {title: 'Additinal feature for $100', price: 100},
    1: {title: 'Additinal feature for $200', price: 200},
    2: {title: 'Additinal feature for $300', price: 300},
    3: {title: 'Additinal feature for $400', price: 400},
    4: {title: 'Additinal feature for $500', price: 500}
};

const productsTypes: Array<ProductType> = [
    {title: 'Product $50', price: 50},
    {title: 'Product $100', price: 100},
    {title: 'Product $300', price: 300},
];


describe('check validation style', () => {

    const handleSendForm = jest.fn();
    const setUp = (props: FormOrderProps, email: string) => {
        const wrapper = mount(
            <FormOrder
                additionalFeatures={props.additionalFeatures}
                productsTypes={props.productsTypes}
                handleSendForm={props.handleSendForm}/>
        );
        wrapper.find('[name="email"]').simulate('change', {
            target: {
                value: email,
                name: 'email'
            },
        });
        wrapper.find('form').simulate('submit');
        return wrapper;
    };


    it('check visible error email', () => {
        const email = 'usertest.com';
        const wrapper = setUp({additionalFeatures, productsTypes, handleSendForm}, email);
        expect(wrapper.find('#email.error-field')).toHaveLength(1);
    });

    it('check visible true email', () => {
        const email = 'user@gmail.com';
        const wrapper = setUp({additionalFeatures, productsTypes, handleSendForm}, email);
        expect(wrapper.find('#email.error-field')).toHaveLength(0);
    });
});


describe('check total price', () => {

    const additionalFeaturesMock = {
            0: {title: 'for 120', price: 120},
            1: {title: 'for 1000', price: 1000}
    };

    const productsTypesMock = [
        {title: 'additional for 777', price: 777},
        {title: 'additional for 10000', price: 10000}
    ];

    const sendForm = jest.fn();

    const setUp = () => {
        return mount(
            <FormOrder
                additionalFeatures={additionalFeaturesMock}
                productsTypes={productsTypesMock}
                handleSendForm={sendForm}/>
        );
    };


    it('choice AdditionalFeatures and check total price', () => {
        const wrapper = setUp();
        wrapper.find('[data-name="feature"] .checkbox').forEach(
            node => {
                node.simulate('change',
                    {target: {checked: true, name: node.props().name, value: node.props().value}});
            }
        );
        const allTotalPriceInFeatures = Object.values(additionalFeaturesMock).reduce(
            (acc, cur) => acc+cur.price, 0);
        expect(wrapper.find('#total-price').text()).toEqual(`$${allTotalPriceInFeatures}`);
    });

    it('choice productType and check total price', () => {
        const wrapper = setUp();
        wrapper.find('.title-accordion').simulate('click');
        wrapper.find('.accordion-item').first().simulate('click');
        expect(wrapper.find('#total-price').text()).toEqual(`$${productsTypesMock[0].price}`);
    })
});


it('check callback send form', () => {

    const sendForm = jest.fn();
    const email = 'user@gmail.com';
    const wrapper = mount(
            <FormOrder
                additionalFeatures={additionalFeatures}
                productsTypes={productsTypes}
                handleSendForm={sendForm}/>
        );

    wrapper.find('[name="email"]').simulate('change', {
        target: {
            value: email,
            name: 'email'
        },
    });

    wrapper.find('[name="firstName"]').simulate('change', {
        target: {
            value: 'firstName',
            name: 'firstName'
        },
    });

    wrapper.find('[name="lastName"]').simulate('change', {
        target: {
            value: 'lastName',
            name: 'lastName'
        },
    });

    wrapper.find('[name="comment"]').simulate('change', {
        target: {
            value: 'comment test',
            name: 'comment'
        },
    });

    wrapper.find('.title-accordion').simulate('click');
    wrapper.find('.accordion-item').first().simulate('click');


    wrapper.find('[data-name="feature"] .checkbox').forEach(
        node => {
            node.simulate('change',
                {target: {checked: true, name: node.props().name, value: node.props().value}});
        }
    );

    wrapper.find('form').simulate('submit');

    const allTotalPriceInFeatures = Object.values(additionalFeatures).reduce(
            (acc, cur) => acc+cur.price, 0);

    expect(sendForm).toHaveBeenCalledWith({
        additionalFeatures:  Object.values(additionalFeatures),
        comment: "comment test",
        email: "user@gmail.com",
        firstName: "firstName",
        lastName: "lastName",
        productType: productsTypes[0],
        totalPrice: allTotalPriceInFeatures + productsTypes[0].price
    });

});








