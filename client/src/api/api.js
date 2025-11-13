const API_BASE_URL = 'http://localhost:9999/api';

const api = {
  getAllComputers: async (status = null) => {
    try {
      const url = status ? `${API_BASE_URL}/computers?status=${status}` : `${API_BASE_URL}/computers`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch computers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching computers:', error);
      throw error;
    }
  },

  getComputerById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/computers/${id}`);
      if (!response.ok) throw new Error('Failed to fetch computer');
      return await response.json();
    } catch (error) {
      console.error('Error fetching computer:', error);
      throw error;
    }
  },

  createComputer: async (computerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/computers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(computerData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create computer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating computer:', error);
      throw error;
    }
  },

  updateComputer: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/computers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update computer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating computer:', error);
      throw error;
    }
  },

  deleteComputer: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/computers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete computer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting computer:', error);
      throw error;
    }
  },

  createReservation: async (reservationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create reservation');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  getAllServicePackages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/service-packages`);
      if (!response.ok) throw new Error('Failed to fetch service packages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching service packages:', error);
      throw error;
    }
  },

  processPayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  getAllPayments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  getUsageLogs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usage-logs`);
      if (!response.ok) throw new Error('Failed to fetch usage logs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching usage logs:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getAllMenuItems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu-items`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  getAllServiceOrders: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_BASE_URL}/service-orders?${query}` : `${API_BASE_URL}/service-orders`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch service orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching service orders:', error);
      throw error;
    }
  },

  getServiceOrderById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/service-orders/${id}`);
      if (!response.ok) throw new Error('Failed to fetch service order');
      return await response.json();
    } catch (error) {
      console.error('Error fetching service order:', error);
      throw error;
    }
  },

  updateServiceOrder: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/service-orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update service order');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating service order:', error);
      throw error;
    }
  },

  createServiceOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/service-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create service order');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating service order:', error);
      throw error;
    }
  },

  getAllReservations: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_BASE_URL}/reservations?${query}` : `${API_BASE_URL}/reservations`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch reservations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },

  updateReservation: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update reservation');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  },

  getNotificationsByUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  createNotification: async (notificationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create notification');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  markNotificationAsRead: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark notification as read');
      }
      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete notification');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  getAllNotifications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      if (!response.ok) throw new Error('Failed to fetch all notifications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      throw error;
    }
  },
};

export default api;