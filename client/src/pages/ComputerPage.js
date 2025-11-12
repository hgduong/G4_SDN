import React, { useState, useEffect } from 'react';
import api from '../api/api.js';
import ComputerTable from '../components/ComputerTable.js';

const ComputerPage = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingComputer, setEditingComputer] = useState(null);
  const [formData, setFormData] = useState({
    computer_name: '',
    status: 'available',
    specs: { cpu: '', gpu: '', ram: '', storage: '' },
    hourly_rate: '',
    room: ''
  });

  useEffect(() => {
    fetchComputers();
  }, []);

  const fetchComputers = async () => {
    try {
      setLoading(true);
      const data = await api.getAllComputers();
      setComputers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load computers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingComputer) {
        await api.updateComputer(editingComputer._id, formData);
      } else {
        await api.createComputer(formData);
      }
      fetchComputers();
      setShowForm(false);
      setEditingComputer(null);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (computer) => {
    setEditingComputer(computer);
    setFormData({
      computer_name: computer.computer_name,
      status: computer.status,
      specs: { ...computer.specs },
      hourly_rate: computer.hourly_rate,
      room: computer.room
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this computer?')) {
      try {
        await api.deleteComputer(id);
        fetchComputers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      computer_name: '',
      status: 'available',
      specs: { cpu: '', gpu: '', ram: '', storage: '' },
      hourly_rate: '',
      room: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingComputer(null);
    resetForm();
  };


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="alert alert-error max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    </div>
  );

  // Group computers by room
  const computersByRoom = computers.reduce((acc, computer) => {
    if (!acc[computer.room]) {
      acc[computer.room] = [];
    }
    acc[computer.room].push(computer);
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#050510] to-[#0D1329] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,0,255,0.05),transparent_50%)] animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,0,0.05),transparent_50%)] animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto relative z-10">
        <h1 className="text-5xl font-orbitron font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 via-pink-500 to-magenta-400 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          GAMING CENTER ADMIN PANEL
        </h1>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-pink-500 hover:to-cyan-500 text-black font-orbitron font-bold px-8 py-3 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transform hover:scale-105 transition-all duration-300 text-lg"
          >
            ADD NEW COMPUTER
          </button>
        </div>

        {showForm && (
          <div className="modal modal-open">
            <div className="modal-box bg-slate-800/95 backdrop-blur-md border-2 border-cyan-400/20 shadow-[0_0_50px_rgba(0,255,255,0.2)] max-w-2xl animate-pulse" style={{animationDuration: '3s'}}>
              <h3 className="font-orbitron font-bold text-3xl mb-6 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                {editingComputer ? 'EDIT COMPUTER' : 'ADD NEW COMPUTER'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-cyan-300 font-rajdhani font-semibold drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">Computer Name</span>
                    </label>
                    <input
                      type="text"
                      value={formData.computer_name}
                      onChange={(e) => setFormData({...formData, computer_name: e.target.value})}
                      className="input input-bordered bg-slate-700/80 backdrop-blur-sm border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-cyan-300 font-rajdhani font-semibold drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">Status</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="select select-bordered bg-slate-700/80 backdrop-blur-sm border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300"
                    >
                      <option value="available" className="text-green-400 bg-slate-800">Available</option>
                      <option value="in-use" className="text-red-400 bg-slate-800">In-use</option>
                      <option value="maintenance" className="text-yellow-400 bg-slate-800">Maintenance</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-cyan-300 font-rajdhani font-semibold drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">CPU</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specs.cpu}
                      onChange={(e) => setFormData({...formData, specs: {...formData.specs, cpu: e.target.value}})}
                      className="input input-bordered bg-slate-700/80 backdrop-blur-sm border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-cyan-300 font-rajdhani font-semibold drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">GPU</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specs.gpu}
                      onChange={(e) => setFormData({...formData, specs: {...formData.specs, gpu: e.target.value}})}
                      className="input input-bordered bg-slate-700/80 backdrop-blur-sm border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-cyan-300 font-rajdhani font-semibold drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">RAM</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specs.ram}
                      onChange={(e) => setFormData({...formData, specs: {...formData.specs, ram: e.target.value}})}
                      className="input input-bordered bg-slate-700/80 backdrop-blur-sm border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-cyan-300 font-rajdhani font-semibold drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">Storage</span>
                    </label>
                    <input
                      type="text"
                      value={formData.specs.storage}
                      onChange={(e) => setFormData({...formData, specs: {...formData.specs, storage: e.target.value}})}
                      className="input input-bordered bg-slate-700/80 backdrop-blur-sm border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-cyan-300 font-rajdhani font-semibold drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">Hourly Rate (VND)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({...formData, hourly_rate: parseFloat(e.target.value)})}
                      className="input input-bordered bg-slate-700/80 backdrop-blur-sm border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300"
                      required
                      min="0"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-cyan-300 font-rajdhani font-semibold drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">Room/Zone</span>
                    </label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => setFormData({...formData, room: e.target.value})}
                      className="input input-bordered bg-slate-700/80 backdrop-blur-sm border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="modal-action gap-4">
                  <button
                    type="submit"
                    className="btn btn-success bg-gradient-to-r from-green-500 via-lime-500 to-cyan-500 hover:from-green-600 hover:via-lime-600 hover:to-cyan-600 border-2 border-green-400/30 text-white font-orbitron font-bold px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  >
                    {editingComputer ? 'UPDATE' : 'CREATE'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost text-gray-400 hover:text-cyan-400 font-orbitron font-bold px-6 py-2 rounded-lg border border-gray-600 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ComputerTable computersByRoom={computersByRoom} handleEdit={handleEdit} handleDelete={handleDelete} />

        {computers.length === 0 && (
          <div className="text-center py-16 bg-slate-800/20 backdrop-blur-sm rounded-2xl border-2 border-cyan-400/10 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
            <h3 className="text-3xl font-orbitron font-bold text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">No Computers Found</h3>
            <p className="text-gray-300 font-rajdhani text-lg drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">Add your first gaming computer to get started!</p>
            <div className="mt-6">
              <div className="inline-block w-24 h-1 bg-gradient-to-r from-cyan-400 to-magenta-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComputerPage;