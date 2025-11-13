// File: ServiceOrdersPage.js
import React, { useState, useEffect } from "react";
import api from "../api/api";

function ServiceOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [computers, setComputers] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComputerId, setSelectedComputerId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newItems, setNewItems] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});

  const staffId = 4; // Hardcoded for demo, in real app from auth

  const statusMap = {
    pending: "Pending",
    in_progress: "In Progress",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const fetchOrders = async () => {
    try {
      const data = await api.getAllServiceOrders();
      setOrders(data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchComputers = async () => {
    try {
      const data = await api.getAllComputers();
      setComputers(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const data = await api.getAllMenuItems();
      setMenuItems(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchComputers();
    fetchUsers();
    fetchMenuItems();
    const interval = setInterval(() => {
      fetchOrders();
      fetchComputers();
      fetchUsers();
      fetchMenuItems();
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.updateServiceOrder(orderId, { status: newStatus, staff_id: staffId });
      fetchOrders(); // Refresh list
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const openOrderModal = () => {
    setSelectedComputerId("");
    setSelectedUserId("");
    setNewItems([]);
    setItemQuantities({});
    setModalOpen(true);
  };

  const addItem = (menuItem) => {
    const qty = itemQuantities[menuItem._id] || 0;
    if (qty > 0) {
      const existing = newItems.find(item => item.item_name === menuItem.name);
      if (existing) {
        setNewItems(newItems.map(item =>
          item.item_name === menuItem.name
            ? { ...item, quantity: item.quantity + qty }
            : item
        ));
      } else {
        setNewItems([...newItems, { item_name: menuItem.name, quantity: qty, price: menuItem.price }]);
      }
      setItemQuantities({ ...itemQuantities, [menuItem._id]: 0 });
    }
  };

  const removeItem = (index) => {
    setNewItems(newItems.filter((_, i) => i !== index));
  };

  const createOrder = async () => {
    if (!selectedComputerId) {
      alert("Select a computer");
      return;
    }
    if (!selectedUserId) {
      alert("Select a user");
      return;
    }
    if (newItems.length === 0) {
      alert("Add at least one item");
      return;
    }
    const computer = computers.find(c => c._id === selectedComputerId);
    if (!computer) {
      alert("Computer not found");
      return;
    }
    try {
      const orderData = {
        user_id: parseInt(selectedUserId),
        computer_id: computer.computer_id,
        items: newItems,
      };
      await api.createServiceOrder(orderData);
      setModalOpen(false);
      fetchOrders();
    } catch (err) {
      alert("Failed to create order: " + err.message);
    }
  };

  const getOrderedItems = (order) => {
    if (order.items && order.items.length > 0) {
      return order.items.map(item => `${item.item_name} x${item.quantity}`).join(", ");
    }
    return "";
  };

  const getComputerName = (computerId) => {
    const computer = computers.find(c => c.computer_id === computerId);
    return computer ? computer.computer_name : `Computer ${computerId}`;
  };

  const getActions = (order) => {
    const status = order.status;
    if (status === "pending") {
      return (
        <>
          <button onClick={() => updateStatus(order._id, "in_progress")} className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded mr-2 neon-glow">Start Preparing</button>
          <button onClick={() => updateStatus(order._id, "cancelled")} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded">Cancel</button>
        </>
      );
    } else if (status === "in_progress") {
      return (
        <button onClick={() => updateStatus(order._id, "delivered")} className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded neon-glow">Deliver</button>
      );
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-cyan-400 neon-glow">Order Management</h1>

      {/* Create Order Button */}
      <div className="mb-6 text-center">
        <button
          onClick={() => openOrderModal(null)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg text-lg neon-glow"
        >
          Create Order
        </button>
      </div>

      {/* Orders Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Current Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-300 text-center">No orders at the moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-cyan-500 rounded-lg shadow-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="border border-cyan-500 px-4 py-3 text-cyan-400">Computer Name</th>
                  <th className="border border-cyan-500 px-4 py-3 text-cyan-400">Ordered Items</th>
                  <th className="border border-cyan-500 px-4 py-3 text-cyan-400">Total Price</th>
                  <th className="border border-cyan-500 px-4 py-3 text-cyan-400">Status</th>
                  <th className="border border-cyan-500 px-4 py-3 text-cyan-400">Order Time</th>
                  <th className="border border-cyan-500 px-4 py-3 text-cyan-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className={order.status === "pending" ? "bg-yellow-900 bg-opacity-50" : "bg-gray-700"}>
                    <td className="border border-cyan-500 px-4 py-2 text-white">{getComputerName(order.computer_id)}</td>
                    <td className="border border-cyan-500 px-4 py-2 text-white">{getOrderedItems(order)}</td>
                    <td className="border border-cyan-500 px-4 py-2 text-white">{order.total_price} VND</td>
                    <td className="border border-cyan-500 px-4 py-2 text-white">{statusMap[order.status]}</td>
                    <td className="border border-cyan-500 px-4 py-2 text-white">{new Date(order.order_time).toLocaleString()}</td>
                    <td className="border border-cyan-500 px-4 py-2">{getActions(order)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Ordering */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 border border-cyan-500 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-xl text-cyan-400 mb-4">Create Order</h3>
            <div className="mb-4">
              <label className="block text-white mb-2">Select Computer:</label>
              <select
                value={selectedComputerId}
                onChange={(e) => setSelectedComputerId(e.target.value)}
                className="w-full p-2 mb-2 bg-gray-700 text-white border border-cyan-500 rounded"
              >
                <option value="">Select a computer</option>
                {computers.map(computer => (
                  <option key={computer._id} value={computer._id}>
                    {computer.computer_name} (ID: {computer.computer_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Select User:</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 mb-2 bg-gray-700 text-white border border-cyan-500 rounded"
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 max-h-60 overflow-y-auto">
              <h4 className="text-white mb-2">Menu Items:</h4>
              {menuItems.map(item => (
                <div key={item._id} className="flex items-center justify-between mb-2 p-2 bg-gray-700 rounded">
                  <span className="text-white">{item.name} - {item.price} VND</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={itemQuantities[item._id] || 0}
                      onChange={(e) => setItemQuantities({ ...itemQuantities, [item._id]: Number(e.target.value) })}
                      className="w-16 p-1 bg-gray-600 text-white border border-cyan-500 rounded mr-2"
                    />
                    <button onClick={() => addItem(item)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-2 py-1 rounded text-sm">Add</button>
                  </div>
                </div>
              ))}
            </div>
            <ul className="mb-4">
              {newItems.map((item, index) => (
                <li key={index} className="text-white flex justify-between">
                  {item.item_name} x{item.quantity} - {item.price} VND
                  <button onClick={() => removeItem(index)} className="text-red-500 ml-2">Remove</button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button onClick={() => setModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
              <button onClick={createOrder} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded">Create Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceOrdersPage;