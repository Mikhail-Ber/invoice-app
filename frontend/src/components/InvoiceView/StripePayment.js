import React, { useEffect } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import CheckoutForm from './CheckoutForm';

const StripePayment = ({ clientInfo, payAmount }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <StripeProvider apiKey="pk_test_51HwAr2FGuFvqzlgwoS72Q3NeoanVzGWD1iOPGt75JcXNxY3gi6Tyg8Eeq8DlKKZTkShZJDnbop1KTntIR9cLRvib00N1Z7Nw3r">
      <Elements>
        <CheckoutForm clientInfo={clientInfo} payAmount={payAmount} />
      </Elements>
    </StripeProvider>
  )
}

export default StripePayment