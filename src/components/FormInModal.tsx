import React, {useState} from 'react';
import {FormOrder} from "./FormOrder";
import {useModal} from "../modal/useModal";
import {Modal} from "../modal/Modal";
import {additionalFeatures, productsTypes} from "../constants/mock";


export const FormInModal: React.FC = () => {

    const {isShown: isShown, toggle: toggleShow} = useModal();
    const [errorSend, setErrorSend] = useState<undefined | boolean>(undefined);
    const [sending, setSending] = useState(false);

    const sendForm = async (data: any) => {
        const url = 'https://httpbin.org/post';
        setSending(true);
        toggleShow();
        const result = await fetch(url, {
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
             Accept: 'application/json',
            },
            body: JSON.stringify({...data}),
        })
            .then(response => {
                setErrorSend(false);
                return response.json();
            })
            .catch(reason =>{
                console.error(reason);
                setErrorSend(true);
            })
            .finally(() => {
                setSending(false);
            });
        console.log('result', result);
    };

    const handleClick = () => {
        toggleShow();
        setErrorSend(undefined);
    };

    return(
        <div className='form-in-modal'>
            <div className='block-center'>
                {errorSend !== undefined &&
                    <div className='result-send'>
                        {errorSend ? 'Sending error.' : 'Successfully sent.'}
                    </div>
                }
                {sending &&
                    <div className='result-send'>Sending...</div>
                }

                <button type='button' id="open-form" onClick={handleClick}>Fill in the form</button>
            </div>
            <Modal isShown={isShown}
                   hide={toggleShow}
                   modalContent={<FormOrder additionalFeatures={additionalFeatures}
                                            productsTypes={productsTypes}
                                            handleSendForm={sendForm}/>}
                   headerText={""}/>
        </div>
    )
};