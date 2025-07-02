import { useEffect, useState } from 'react';
import type { User } from '../../types';
import UserTable from '../../components/UserTable';
import Spinner from '../../components/Spinner';
import ConfirmationModal from '../../components/ConfirmationModal';
import './UsersPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for our new confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('https://payment-gateway-dats.vercel.app/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users); // Assuming the API returns { users: [...] }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // This function now just opens the modal
  const handleBlacklistClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // This function runs when the user confirms the action
  const confirmBlacklist = async () => {
    if (!selectedUserId) return;

    const token = localStorage.getItem('authToken');
    
    // Optimistically update the UI
    setUsers(users => users.map(user => 
      user.id === selectedUserId ? { ...user, isBlacklisted: true } : user
    ));
    
    // Close the modal
    setIsModalOpen(false);

    try {
      const response = await fetch('https://payment-gateway-dats.vercel.app/api/admin/users/blacklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: selectedUserId }),
      });

      if (!response.ok) {
        throw new Error('Failed to blacklist user');
      }
    } catch (err) {
      // Revert the UI on failure
      setUsers(users => users.map(user => 
        user.id === selectedUserId ? { ...user, isBlacklisted: false } : user
      ));
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    } finally {
      setSelectedUserId(null);
    }
  };

  const handleRemoveFromBlacklist = async (userId: string) => {
    const token = localStorage.getItem('authToken');
    
    // Optimistically update the UI
    setUsers(users => users.map(user => 
      user.id === userId ? { ...user, isBlacklisted: false } : user
    ));

    try {
      const response = await fetch('https://payment-gateway-dats.vercel.app/api/admin/users/unblacklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove user from blacklist');
      }
    } catch (err) {
      // Revert the UI on failure
      setUsers(users => users.map(user => 
        user.id === userId ? { ...user, isBlacklisted: true } : user
      ));
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
    }
  };

  return (
    <div className="users-page">
      <h1>Manage Users</h1>
      {isLoading && <Spinner />}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && (
        <UserTable 
          users={users} 
          onBlacklist={handleBlacklistClick}
          onRemoveFromBlacklist={handleRemoveFromBlacklist}
        />
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmBlacklist}
        title="Confirm Blacklist"
        message="Are you sure you want to blacklist this user? This action is permanent."
      />
    </div>
  );
};

export default UsersPage; 