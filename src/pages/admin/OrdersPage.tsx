import { useEffect, useState } from 'react';
import type { Order } from '../../types';
import OrderTable from '../../components/OrderTable';
import Spinner from '../../components/Spinner';
// We can create a dedicated CSS file if needed later
// import './OrdersPage.css'; 

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('https://payment-gateway-dats.vercel.app/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders); // Based on the guide we prepared
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h1>View Orders</h1>
      {isLoading && <Spinner />}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && <OrderTable orders={orders} />}
    </div>
  );
};

export default OrdersPage; 