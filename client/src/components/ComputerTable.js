import React from 'react';

const ComputerTable = ({ computersByRoom, handleEdit, handleDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-400 border-green-400';
      case 'in-use': return 'text-orange-400 border-orange-400';
      case 'maintenance': return 'text-red-400 border-red-400';
      default: return 'text-white border-white';
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(computersByRoom).map(([roomName, roomComputers]) => (
        <div key={roomName} className="space-y-4">
          {/* Room Header */}
          <h2 className="text-2xl font-orbitron font-bold text-center text-cyan-400 border-b-2 border-cyan-400/30 pb-2">
            {roomName.toUpperCase()} ROOM
          </h2>

          {/* Computer Table for this room */}
          <table className="table table-zebra w-full bg-slate-800/50 backdrop-blur-sm border-2 border-cyan-400/50 border-collapse shadow-[0_0_20px_rgba(0,255,255,0.3)] rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="border border-cyan-400/20 text-cyan-300 font-orbitron">Computer Name</th>
                <th className="border border-cyan-400/20 text-cyan-300 font-orbitron">Status</th>
                <th className="border border-cyan-400/20 text-cyan-300 font-orbitron">CPU</th>
                <th className="border border-cyan-400/20 text-cyan-300 font-orbitron">GPU</th>
                <th className="border border-cyan-400/20 text-cyan-300 font-orbitron">RAM</th>
                <th className="border border-cyan-400/20 text-cyan-300 font-orbitron">Storage</th>
                <th className="border border-cyan-400/20 text-cyan-300 font-orbitron">Hourly Rate</th>
                <th className="border border-cyan-400/20 text-cyan-300 font-orbitron">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomComputers.map((computer) => (
                <tr key={computer._id} className="hover:bg-slate-700/30">
                  <td className="border border-cyan-400/20 p-2 text-white">{computer.computer_name}</td>
                  <td className={`border border-cyan-400/20 p-2 font-bold ${getStatusColor(computer.status)}`}>{computer.status}</td>
                  <td className="border border-cyan-400/20 p-2 text-white">{computer.specs.cpu}</td>
                  <td className="border border-cyan-400/20 p-2 text-white">{computer.specs.gpu}</td>
                  <td className="border border-cyan-400/20 p-2 text-white">{computer.specs.ram}</td>
                  <td className="border border-cyan-400/20 p-2 text-white">{computer.specs.storage}</td>
                  <td className="border border-cyan-400/20 p-2 text-yellow-400 font-bold">{computer.hourly_rate} VND/h</td>
                  <td className="border border-cyan-400/20 p-2">
                    <button
                      onClick={() => handleEdit(computer)}
                      className="btn btn-xs btn-primary mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(computer._id)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ComputerTable;