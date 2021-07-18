import React from 'react';
import { Modal } from 'react-bootstrap';
import StripePayment from './StripePayment';

function StripeModal({clientInfo, payAmount, ...props}) {

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton />
      <Modal.Body>
        <StripePayment clientInfo={clientInfo} payAmount={payAmount}/>
      </Modal.Body>
    </Modal>
  );
}

export default StripeModal;