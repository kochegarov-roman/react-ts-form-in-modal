import React, {useEffect} from "react";
import ReactDOM from 'react-dom';

import './modal.sass';

export interface ModalProps {
  isShown: boolean;
  hide: () => void;
  modalContent: JSX.Element;
  headerText: string;
}

export const Modal: React.FC<ModalProps> = ({
  isShown,
  hide,
  modalContent,
  headerText,
}) => {


  const onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 27 && isShown) {
      hide();
    }
  };


  useEffect(() => {
    isShown ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'unset');
    document.addEventListener('keydown', onKeyDown, false);
    return () => {
      document.removeEventListener('keydown', onKeyDown, false);
    };
  }, [isShown]);


  const modal = (
    <React.Fragment>
      <div className='modal-back'>
        <div className='modal-wrapper' >
          <div className='modal'>
            <div className='modal-header'>
              <div className='modal-header-text'>{headerText}</div>
              <div className='modal-close-button' onClick={hide}>x</div>
            </div>
            <div className='modal-content'>
              <span className='scroll_style'>{modalContent}</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};