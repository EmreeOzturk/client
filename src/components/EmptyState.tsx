import './EmptyState.css';

type EmptyStateProps = {
  message: string;
};

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  );
};

export default EmptyState; 