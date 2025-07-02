import type { Order } from '../types';
import './OrderTable.css';
import EmptyState from './EmptyState';

type OrderTableProps = {
  orders: Order[];
};

const OrderTable = ({ orders }: OrderTableProps) => {
  if (orders.length === 0) {
    return <EmptyState message="No orders found." />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="table-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>User Email</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Wert Order ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{formatDate(order.createdAt)}</td>
              <td>{order.user?.email || 'N/A'}</td>
              <td>
                <span className={`status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>${order.currencyAmount.toFixed(2)} {order.currency}</td>
              <td>{order.wertOrderId}</td>
              <td>
                <button className="btn-details">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable; 