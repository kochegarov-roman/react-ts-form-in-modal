import React, {useState} from 'react';
import {AccordionProps, ProductType} from "../constants/types";



export const Accordion: React.FC<AccordionProps<ProductType>> = (props) => {
    const [active, handleSetActive] = useState<undefined | ProductType>(undefined);
    const [isShow, setShow] = useState(false);

    const handleChangeItem = (item: ProductType) => {
        setShow(!isShow);
        handleSetActive(item);
        props.handleChange && props.handleChange(item);
    };

    return (
        <div className={`accordion ${props.className}`}>
            <div className={`title-accordion ${isShow ? 'show-accordion' : ''}`} onClick={() => setShow(!isShow)}>
                {active?.title || 'Select product type'}
                <svg
                    style={isShow ? {'transform': 'rotate(270deg)'} : {}}
                    className={isShow ? 'active' : ''}
                    viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em"
                    fill="currentColor" aria-hidden="true">
                    <path
                        d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                </svg>
            </div>
            <div className={`accordion-body ${isShow ? 'show-accordion-body' : 'hide-accordion-body'}`}>
                {isShow && props.items &&
                    props.items.map(
                        (item: ProductType) => <div key={item.title}
                                     className='accordion-item'
                                     onClick={() => handleChangeItem(item)}>{item.title}</div>
                    )
                }
            </div>
        </div>
    )
};