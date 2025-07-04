import { useEffect, useState } from 'react';
import type { Order } from '../../types';
import OrderTable from '../../components/OrderTable';
import Spinner from '../../components/Spinner';
import './OrdersPage.css';
import { BACKEND_URL } from '../../constants';
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
        const response = await fetch(`${BACKEND_URL}/api/admin/orders`, {
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
      <div className="page-header">
        <h1>Orders Management</h1>
        <p className="page-description">
          Monitor and manage all payment orders. Track transaction statuses, amounts, and user details.
        </p>
      </div>

      {/* Orders Content Section */}
      <div className="orders-content-section">
        <h2>All Orders ({orders.length})</h2>
        
        {isLoading && <Spinner />}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && <OrderTable orders={orders} />}
      </div>
    </div>
  );
};

export default OrdersPage; 