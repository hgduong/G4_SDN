import React, { useState, useEffect } from 'react';
import api from '../api/api';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    user_id: '',
    title: '',
    message: '',
    type: 'system'
  });

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getAllNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createNotification({
        ...newNotification,
        noti_id: Date.now().toString() // Generate unique ID
      });
      setNotifications([created.data, ...notifications]);
      setNewNotification({ user_id: '', title: '', message: '', type: 'system' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create notification:', err);
      setError('Failed to create notification');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications(notifications.filter(notif => notif._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  if (loading) return <div className="text-center py-4">Loading notifications...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notification Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {showCreateForm ? 'Cancel' : 'Create Notification'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateNotification} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="User ID (leave empty for broadcast)"
              value={newNotification.user_id}
              onChange={(e) => setNewNotification({...newNotification, user_id: e.target.value})}
              className="p-2 border rounded"
            />
            <select
              value={newNotification.type}
              onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
              className="p-2 border rounded"
            >
              <option value="system">System</option>
              <option value="user">User</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Title"
            value={newNotification.title}
            onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
            className="w-full p-2 border rounded mt-4"
            required
          />
          <textarea
            placeholder="Message"
            value={newNotification.message}
            onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
            className="w-full p-2 border rounded mt-4 h-24"
            required
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send Notification
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Message</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Created</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notif) => (
              <tr key={notif._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{notif.user_id || 'All'}</td>
                <td className="border border-gray-300 px-4 py-2">{notif.title}</td>
                <td className="border border-gray-300 px-4 py-2 max-w-xs truncate">{notif.message}</td>
                <td className="border border-gray-300 px-4 py-2">{notif.type}</td>
                <td className="border border-gray-300 px-4 py-2">{notif.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(notif.created_at).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationManagement;