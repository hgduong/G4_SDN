import React from 'react';
import NotificationCenter from '../components/NotificationCenter';

const NotificationCenterPage = () => {
  // In a real app, get userId from context or auth
  const userId = 'user123'; // Placeholder - replace with actual user ID

  return (
    <div className="container mx-auto px-4 py-8">
      <NotificationCenter userId={userId} />
    </div>
  );
};

export default NotificationCenterPage;