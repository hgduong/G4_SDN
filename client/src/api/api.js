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
};

export default api;