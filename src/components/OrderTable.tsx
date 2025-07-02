import { useState, useMemo } from 'react';
import type { Order } from '../types';
import './OrderTable.css';
import EmptyState from './EmptyState';

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'createdAt' | 'currencyAmount' | 'status' | 'email';

interface OrderFilters {
  search: string;
  status: string;
  currency: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}

type OrderTableProps = {
  orders: Order[];
};

const OrderTable = ({ orders }: OrderTableProps) => {
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: '',
    currency: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
  });

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Get unique values for filter options
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(orders.map(order => order.status))];
    return statuses.sort();
  }, [orders]);

  const uniqueCurrencies = useMemo(() => {
    const currencies = [...new Set(orders.map(order => order.currency))];
    return currencies.sort();
  }, [orders]);

  // Filter and sort logic
  const filteredAndSortedOrders = useMemo(() => {
    const filtered = orders.filter(order => {
      // Search filter (email or wertOrderId)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const emailMatch = order.user?.email?.toLowerCase().includes(searchLower);
        const orderIdMatch = order.wertOrderId.toLowerCase().includes(searchLower);
        if (!emailMatch && !orderIdMatch) return false;
      }

      // Status filter
      if (filters.status && order.status !== filters.status) return false;

      // Currency filter
      if (filters.currency && order.currency !== filters.currency) return false;

      // Date range filter
      if (filters.dateFrom) {
        const orderDate = new Date(order.createdAt);
        const fromDate = new Date(filters.dateFrom);
        if (orderDate < fromDate) return false;
      }
      if (filters.dateTo) {
        const orderDate = new Date(order.createdAt);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (orderDate > toDate) return false;
      }

      // Amount range filter
      if (filters.amountMin && order.currencyAmount < parseFloat(filters.amountMin)) return false;
      if (filters.amountMax && order.currencyAmount > parseFloat(filters.amountMax)) return false;

      return true;
    });

    // Sort logic
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aValue: string | number | Date;
        let bValue: string | number | Date;

        switch (sortField) {
          case 'createdAt':
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          case 'currencyAmount':
            aValue = a.currencyAmount;
            bValue = b.currencyAmount;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'email':
            aValue = a.user?.email || '';
            bValue = b.user?.email || '';
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [orders, filters, sortField, sortDirection]);

  const handleFilterChange = (key: keyof OrderFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: '',
      currency: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
    });
    setSortField(null);
    setSortDirection(null);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || sortField !== null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const exportToCSV = () => {
    const headers = ['Date', 'User Email', 'Status', 'Amount', 'Currency', 'Wert Order ID'];
    const rows = filteredAndSortedOrders.map(order => [
      `"${formatDate(order.createdAt)}"`,
      `"${order.user?.email || 'N/A'}"`,
      `"${order.status}"`,
      order.currencyAmount.toFixed(2),
      `"${order.currency}"`,
      `"${order.wertOrderId}"`
    ].join(',')).join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\n' + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (orders.length === 0) {
    return <EmptyState message="No orders found." />;
  }

  return (
    <div className="order-table-wrapper">
      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="search">Search:</label>
            <input
              id="search"
              type="text"
              placeholder="Search by email or order ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="currency">Currency:</label>
            <select
              id="currency"
              value={filters.currency}
              onChange={(e) => handleFilterChange('currency', e.target.value)}
              className="filter-select"
            >
              <option value="">All Currencies</option>
              {uniqueCurrencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="dateFrom">From Date:</label>
            <input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="dateTo">To Date:</label>
            <input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="amountMin">Min Amount:</label>
            <input
              id="amountMin"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.amountMin}
              onChange={(e) => handleFilterChange('amountMin', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="amountMax">Max Amount:</label>
            <input
              id="amountMax"
              type="number"
              step="0.01"
              placeholder="999999.99"
              value={filters.amountMax}
              onChange={(e) => handleFilterChange('amountMax', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <div className="results-info">
            <span className="results-count">
              Showing {filteredAndSortedOrders.length} of {orders.length} orders
            </span>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="clear-filters-btn">
                Clear All Filters
              </button>
            )}
          </div>
          <button onClick={exportToCSV} className="export-csv-btn">
            Export to CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {filteredAndSortedOrders.length === 0 ? (
          <EmptyState message="No orders match your current filters." />
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th 
                  onClick={() => handleSort('createdAt')}
                  className="sortable-header"
                >
                  Date {getSortIcon('createdAt')}
                </th>
                <th 
                  onClick={() => handleSort('email')}
                  className="sortable-header"
                >
                  User Email {getSortIcon('email')}
                </th>
                <th 
                  onClick={() => handleSort('status')}
                  className="sortable-header"
                >
                  Status {getSortIcon('status')}
                </th>
                <th 
                  onClick={() => handleSort('currencyAmount')}
                  className="sortable-header"
                >
                  Amount {getSortIcon('currencyAmount')}
                </th>
                <th>Wert Order ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedOrders.map((order) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderTable;