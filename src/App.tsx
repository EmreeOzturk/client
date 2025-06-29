import { useEffect, useState, useRef } from 'react'
import WertWidget from '@wert-io/widget-initializer'
import './App.css'

function App() {
  const [status, setStatus] = useState<string>('Initializing payment...')
  const [error, setError] = useState<string | null>(null)
  const effectRan = useRef(false)


  useEffect(() => {
    if (effectRan.current === true) {
      return
    }
    effectRan.current = true

    const initializePayment = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search)
        const token = queryParams.get('token')

        if (!token) {
          throw new Error('Payment token is missing. Please initiate the payment again.')
        }

        setStatus('Fetching payment details...')
        // prod url https://express-js-on-vercel-amber.vercel.app/
        const devOrProd = process.env.NODE_ENV === 'production' ? 'https://express-js-on-vercel-amber.vercel.app/' : 'http://localhost:8080'
        const response = await fetch(`${devOrProd}/api/get-payment-data?token=${token}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to retrieve payment data.')
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || 'Backend failed to provide payment data.')
        }

        setStatus('Opening payment widget...')

        const wertWidget = new WertWidget({
          ...data.signedData,
          ...data.widgetOptions,
          listeners: {
            'payment-status': (data) => {
              console.log('Payment status:', data);
            },
            'close': () => {
              console.log('Widget closed');
            },
            'error': (error) => {
              console.error('Widget error:', error);
            }
          }
        })

        wertWidget.open()

      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.'
        console.error('Initialization failed:', message)
        setError(message)
        setStatus('Failed')
      }
    }

    initializePayment()
  }, [])

  return (
    <div className="container">
      <h1>Payment Gateway</h1>
      <div className="status-card">
        {error ? (
          <div className="status-error">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="status-info">
            <h2>Securing your session...</h2>
            <p>{status}</p>
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
