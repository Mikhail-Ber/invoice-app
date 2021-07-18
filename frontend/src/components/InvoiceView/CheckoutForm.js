import React, { useState } from 'react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from 'react-stripe-elements'
import { jwtService } from '../../services'
import './CheckoutForm.css'

const CheckoutForm = ({ clientInfo, payAmount, stripe }) => {
  const [receiptUrl, setReceiptUrl] = useState('')
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault()

    const { token } = await stripe.createToken({
      name: clientInfo.name
    })

    setProcessing(true);

    const order = await jwtService.postPayment(payAmount.toString().replace('.', ''), token.id, clientInfo.email);

    setProcessing(false);
    setReceiptUrl(order.data.charge.receipt_url)
  }

  if (receiptUrl) {
    return (
      <div className="success">
        <h2>Payment Successful!</h2>
        <a href={receiptUrl}>View Receipt</a>
      </div>
    )
  }

  return (
    <div className="checkout-form">
      <p>Amount: ${payAmount}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Card details
          <CardNumberElement />
        </label>
        <label>
          Expiration date
          <CardExpiryElement />
        </label>
        <label>
          CVC
          <CardCVCElement />
        </label>
        <button type="submit" className="order-button">
          {processing ? 'Processing' : 'Pay' }
        </button>
      </form>
    </div>
  )
}

export default injectStripe(CheckoutForm)