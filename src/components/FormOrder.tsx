import React, {BaseSyntheticEvent, ChangeEvent, ChangeEventHandler, useEffect, useState} from 'react';
import '../index.sass';
import {Accordion} from './Accordion'
import {
    AdditionalFeature,
    AdditionalFeatures,
    FormOrderInterface,
    ProductType,
    ValidationParamsInterface
} from "../constants/types";


const requiredField = {firstName: false, lastName: false, email: false, productType: false};

const initialValidationParams: ValidationParamsInterface<typeof requiredField> = {
    formFieldValid: {firstName: false, lastName: false, email: false, productType: false},
    formValid: undefined,
    emailCheck: true,
    readyToSend: false,
    emptyField: ['firstName', 'lastName', 'productType']
};

export interface FormOrderProps {
    additionalFeatures: AdditionalFeatures
    productsTypes: Array<ProductType>
    handleSendForm: (data: any) => {}
}

export const FormOrder: React.FC<FormOrderProps> = (props) => {

    const {additionalFeatures, productsTypes} = props;
    const [totalPrice, setTotalPrice] = useState(0);
    const [productType, setProductType] = useState<undefined | ProductType>(undefined);
    const [additionalFeatureState, setAdditionalFeatureState] = useState<Set<number>>(new Set());
    const [stateForm, setStateForm] = useState<Partial<FormOrderInterface>>({});
    const [validationState, setValidation] = useState(initialValidationParams);

    useEffect(() => {
        let priceForFeature = Array.from(additionalFeatureState)
            .reduce((acc, featureId) => acc + additionalFeatures[featureId].price, 0);
        setTotalPrice(priceForFeature + (productType?.price || 0));
    }, [additionalFeatureState, productType]);

    useEffect(() => {
        setStateForm({...stateForm, productType: productType});
        setValidation(prevState => {
            prevState.formFieldValid.productType = true;
            return prevState;
        })
    }, [productType]);


    useEffect(() => {
        if (validationState.readyToSend) {
            let order = {...stateForm, totalPrice};
            let _additionalFeatures: Array<AdditionalFeature> = [];
            Array.from(additionalFeatureState).forEach(
                featureId => _additionalFeatures.push(additionalFeatures[featureId])
            );
            order.additionalFeatures = _additionalFeatures;
            props.handleSendForm(order);
        }
    }, [validationState]);

    const handleChangeFeatures: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
        const featureId = parseInt(e.target.value);
        if (!e.target.checked) {
            setAdditionalFeatureState(prevState => {
                prevState.delete(featureId);
                return new Set(prevState);
            });
        } else {
            setAdditionalFeatureState(prevState => {
                prevState.add(featureId);
                return new Set(prevState);
            });
        }
    };

    const handleSubmit = (event: BaseSyntheticEvent) => {
        event.preventDefault();
        validation(stateForm);
    };

    const validation = (state: Partial<FormOrderInterface>) => {
        setValidation((prevState) => {
            const newState = {...prevState};
            prevState.emptyField.forEach(
                (fieldName) => {
                    newState.formFieldValid[fieldName] = !!state[fieldName];
                }
            );
            // match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            if (prevState.emailCheck) {
                const emailValid = !!state.email?.match(/^([\w.%+-]+)@gmail.com$/i);
                newState.formFieldValid.email = emailValid;
            }
            const isValidForm = Object.entries(newState.formFieldValid).every(
                ([nameField, isValidField]) => isValidField
            );
            newState.formValid = isValidForm;
            newState.readyToSend = isValidForm;
            return newState;
        });
    };

    const handleChange = (event: BaseSyntheticEvent) => {
        setStateForm({...stateForm, [event.target.name]: event.target.value});
        setValidation(prevState => {
            prevState.formFieldValid[event.target.name] = true;
            return prevState;
        })
    };

    return (
        <div id='order-form'>
            <form action="/" onSubmit={handleSubmit}>
                <div className="title">Title form</div>

                <div className='form-field'>
                    <p
                        className={validationState.formValid !== undefined
                        && !validationState.formFieldValid.firstName ? 'error-text' : 'd-none'}>Please fill in first
                        name</p>
                    <input className={validationState.formValid !== undefined
                    && !validationState.formFieldValid.firstName ? 'error-field' : ''}
                           type="text" id='first-name' name="firstName" placeholder=" " onChange={handleChange}/>
                    <label htmlFor="first-name" className="required">First name</label>
                </div>

                <div className='form-field'>
                    <p className={validationState.formValid !== undefined
                    && !validationState.formFieldValid.lastName ? 'error-text' : 'd-none'}>Please fill in last name</p>
                    <input className={validationState.formValid !== undefined
                    && !validationState.formFieldValid.lastName ? 'error-field' : ''} type="text" id='last-name'
                           name="lastName" placeholder=" " onChange={handleChange}/>
                    <label htmlFor="last-name" className="required">Last Name</label>
                </div>

                <div className='form-field'>
                    <p className={validationState.formValid !== undefined
                    && !validationState.formFieldValid.email ? 'error-text' : 'd-none'}>
                        {stateForm.email === undefined ? 'Please fill in email' : 'Please enter a valid email address'}
                    </p>
                    <input className={validationState.formValid !== undefined
                    && !validationState.formFieldValid.email ? 'error-field' : ''}
                           type="text" id='email' name="email" placeholder=" " onChange={handleChange}/>
                    <label htmlFor="email" className="required">user@gmail.com</label>
                </div>

                <div className='field-around'>
                    <label htmlFor="product-type" className='required'>Product Type</label>
                    <div className='field-select'>
                        <Accordion
                            items={productsTypes}
                            handleChange={setProductType}
                            className={validationState.formValid !== undefined
                            && !validationState.formFieldValid.productType ? 'error-field' : ''}
                        />
                        <p className={validationState.formValid !== undefined
                        && !validationState.formFieldValid.productType ? 'error-text' : 'd-none'}>
                            Please select product type</p>
                    </div>
                    <input type="text" className='d-none' name='productType' onChange={handleChange}
                           value={productType?.title || ""}/>
                </div>

                {Object.entries(additionalFeatures).map(
                    ([featureId, feature], ind) =>
                        <div className='field-around' data-name='feature' key={ind}>
                            <input type="checkbox"
                                   name={feature.title}
                                   value={featureId}
                                   className="checkbox"
                                   id={`feature-${featureId}`}
                                   onChange={handleChangeFeatures}
                            />
                            <label htmlFor={`feature-${featureId}`} className='w100'>{feature.title}</label>
                        </div>
                )}

                <div className='form-field'>
                    <textarea name="comment" id="comment" onChange={handleChange} placeholder=" " cols={40} rows={3}/>
                    <label htmlFor="email" className="">Type your comment</label>
                </div>

                <div className='field-around'>
                    <div>Total price</div>
                    <div id='total-price'>${totalPrice}</div>
                </div>
                <div style={{'textAlign': 'center'}}>
                    <button type='submit' id='submit-btn'>Send form</button>
                </div>
            </form>
        </div>
    )
}
