import type { User } from '../types';
import './UserTable.css';
import EmptyState from './EmptyState';

type UserTableProps = {
  users: User[];
  onBlacklist: (userId: string) => void;
  onRemoveFromBlacklist: (userId: string) => void;
};

const UserTable = ({ users, onBlacklist, onRemoveFromBlacklist }: UserTableProps) => {
  if (users.length === 0) {
    return <EmptyState message="No users found." />;
  }

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Wallet Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.walletAddress}</td>
              <td>
                <span className={`status ${user.isBlacklisted ? 'status-blacklisted' : 'status-active'}`}>
                  {user.isBlacklisted ? 'Blacklisted' : 'Active'}
                </span>
              </td>
              <td>
                {user.isBlacklisted ? (
                  <button 
                    onClick={() => onRemoveFromBlacklist(user.id)} 
                    className="btn-remove-blacklist"
                  >
                    Remove from Blacklist
                  </button>
                ) : (
                  <button 
                    onClick={() => onBlacklist(user.id)} 
                    className="btn-blacklist"
                  >
                    Blacklist
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable; 