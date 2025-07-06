import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmationModal from '../../components/ConfirmationModal';
import './CorsClientsPage.css';
import { BACKEND_URL } from '../../constants';

interface CorsClient {
    id: string;
    domain: string;
    createdAt: string;
    isActive: boolean;
}

const CorsClientsPage = () => {
    const [clients, setClients] = useState<CorsClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newDomain, setNewDomain] = useState('');
    const [scAddress, setScAddress] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        client: CorsClient | null;
    }>({ isOpen: false, client: null });

    // Fetch CORS clients
    const fetchClients = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/cors-clients`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch CORS clients');
            }

            const data = await response.json();
            setClients(data.clients);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Validate domain URL
    const validateDomain = (domain: string): string | null => {
        if (!domain.trim()) {
            return 'Domain is required';
        }

        // Basic URL validation
        try {
            const url = new URL(domain.startsWith('http') ? domain : `https://${domain}`);

            // Check for valid domain format
            if (!url.hostname || url.hostname === 'localhost' && !url.port) {
                return 'Please enter a valid domain (e.g., https://example.com or localhost:3000)';
            }

            return null;
        } catch {
            return 'Please enter a valid domain format';
        }
    };

    // Add new CORS client
    const handleAddClient = async () => {
        const validation = validateDomain(newDomain);
        if (validation) {
            setValidationError(validation);
            return;
        }

        setIsAdding(true);
        setValidationError(null);
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/cors-clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ domain: newDomain.trim(), scAddress }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add CORS client');
            }

            setNewDomain('');
            setScAddress('');
            await fetchClients(); // Refresh the list
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add CORS client';
            setValidationError(message);
        } finally {
            setIsAdding(false);
        }
    };

    // Delete CORS client
    const handleDeleteClient = async (client: CorsClient) => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${BACKEND_URL}/api/admin/cors-clients/${client.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete CORS client');
            }

            await fetchClients(); // Refresh the list
            setDeleteModal({ isOpen: false, client: null });
        } catch {
            setError('Failed to delete CORS client');
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className="cors-clients-page">
            <div className="page-header">
                <h1>CORS Clients Management</h1>
                <p className="page-description">
                    Manage allowed domains for cross-origin requests. Configure trusted domains that can access your payment gateway.
                </p>
            </div>

            {/* Add New Client Form */}
            <div className="add-client-section">
                <h2>Add New CORS Client</h2>
                <div className="add-client-form">
                    <div className="input-group">
                        <label htmlFor="domain">Domain URL</label>
                        <input
                            id="domain"
                            type="text"
                            placeholder="https://example.com or localhost:3000"
                            value={newDomain}
                            onChange={(e) => {
                                setNewDomain(e.target.value);
                                if (validationError) setValidationError(null);
                            }}
                            className={`domain-input ${validationError ? 'error' : ''}`}
                            disabled={isAdding}
                        />
                        {validationError && (
                            <span className="error-message">{validationError}</span>
                        )}
                    </div>
                    <div className="input-group">
                        <label htmlFor="scAddress">SC Address</label>
                        <input
                            id="scAddress"
                            type="text"
                            value={scAddress}
                            onChange={(e) => { setScAddress(e.target.value) }}
                            className={`domain-input`}
                            disabled={isAdding}
                        />
                    </div>
                    <button
                        onClick={handleAddClient}
                        disabled={isAdding || !newDomain.trim()}
                        className="btn-add-client"
                    >
                        {isAdding ? <Spinner /> : 'Add Client'}
                    </button>
                </div>
            </div>

            {/* Clients List */}
            <div className="clients-section">
                <h2>Current CORS Clients ({clients.length})</h2>

                {isLoading && <Spinner />}
                {error && <p className="error-message">{error}</p>}

                {!isLoading && !error && clients.length === 0 && (
                    <EmptyState
                        message="No CORS clients configured yet. Add your first trusted domain above."
                    />
                )}

                {!isLoading && !error && clients.length > 0 && (
                    <div className="clients-grid">
                        {clients.map((client) => (
                            <div key={client.id} className="client-card">
                                <div className="client-info">
                                    <div className="client-domain">
                                        <span className="domain-text">{client.domain}</span>
                                        <span className={`status-badge ${client.isActive ? 'active' : 'inactive'}`}>
                                            {client.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="client-meta">
                                        <span className="added-date">
                                            Added: {formatDate(client.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="client-actions">
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: true, client })}
                                        className="btn-delete"
                                        title="Delete client"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onConfirm={() => deleteModal.client && handleDeleteClient(deleteModal.client)}
                onClose={() => setDeleteModal({ isOpen: false, client: null })}
                title="Delete CORS Client"
                message={`Are you sure you want to delete "${deleteModal.client?.domain}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default CorsClientsPage; 