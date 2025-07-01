import { useEffect, useState, useRef } from 'react'
import WertWidget from '@wert-io/widget-initializer'
import './App.css'

const ErrorIcon = () => (
  <svg className="status-icon error-icon" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="circle" cx="40" cy="40" r="38" stroke="#ff8a80" strokeWidth="4"/>
    <path className="cross-1" d="M25 25L55 55" stroke="#ff8a80" strokeWidth="4" strokeLinecap="round"/>
    <path className="cross-2" d="M55 25L25 55" stroke="#ff8a80" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const SuccessIcon = () => (
  <svg className="status-icon success-icon" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="circle" cx="40" cy="40" r="38" stroke="#a5d6a7" strokeWidth="4"/>
    <path className="checkmark" d="M24 41.5L36.5 54L58 32.5" stroke="#a5d6a7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoadingIcon = () => (
  <svg className="status-icon spinner-icon" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
    <path d="M40 2C19.027 2 2 19.027 2 40" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);


function App() {
  const [status, setStatus] = useState<string>('Ödeme başlatılıyor...')
  const [error, setError] = useState<string | null>(null)
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false)
  const [txId, setTxId] = useState<string | null>(null)
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
          throw new Error('Geçersiz ödeme linki. Lütfen ödemeyi tekrar başlatın.')
        }

        setStatus('Ödeme detayları alınıyor...')
        // prod url https://express-js-on-vercel-amber.vercel.app/
        const devOrProd = process.env.NODE_ENV === 'production' ? 'https://express-js-on-vercel-amber.vercel.app' : 'http://localhost:3000'
        const response = await fetch(`${devOrProd}/api/get-payment-data?token=${token}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Ödeme verileri alınamadı.')
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || 'Backend ödeme verilerini sağlayamadı.')
        }

        setStatus('Ödeme arayüzü açılıyor...')

        const wertWidget = new WertWidget({
          ...data.signedData,
          ...data.widgetOptions,
          listeners: {
            'payment-status': (data) => {
              console.log('Payment status:', data);
              if (data.status === 'success') {
                setStatus('Ödeme başarılı!');
                setIsPaymentSuccessful(true);
                setTxId(data.tx_id ?? null);
              } else if (data.status === 'pending') {
                setStatus('Ödeme işleniyor...');
              }
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
        const message = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.'
        console.error('Initialization failed:', message)
        setError(message)
        setStatus('Başarısız')
      }
    }

    initializePayment()
  }, [])

  return (
    <div className="container">
      <h1>Ödeme Ekranı</h1>
      <div className="status-card">
        {error ? (
          <div className="status-error">
            <ErrorIcon />
            <h2>Bir şeyler ters gitti</h2>
            <p>{error}</p>
            <button className="btn-return" onClick={() => console.log('Return home')}>Ana Sayfaya Dön</button>
          </div>
        ) : isPaymentSuccessful ? (
          <div className="status-success">
            <SuccessIcon />
            <h2>Ödeme Başarılı</h2>
            <p>İşleminiz başarıyla tamamlandı.</p>
            {txId && (
              <div className="tx-info">
                <p>İşlem Kodu:</p>
                <span>{txId}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="status-info">
            <LoadingIcon />
            <h2>Oturumunuz Güvenle Hazırlanıyor</h2>
            <p>{status}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
