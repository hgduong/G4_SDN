import React, { useEffect, useState } from "react";
import api from "../api/api";

const UsageHistoryPage = () => {
  const [usageLogs, setUsageLogs] = useState([]);
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [activeTab, setActiveTab] = useState('usage'); // 'usage', 'computers', or 'reservations'
  const [reservations, setReservations] = useState([]);
  const [filters, setFilters] = useState({
    computer_id: "",
    user_name: "",
    start_date: "",
    end_date: "",
    status: "in-progress" // Default to show active sessions
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logs, computersData, reservationsData] = await Promise.all([
        api.getUsageLogs(),
        api.getAllComputers(),
        api.getAllReservations()
      ]);
      setUsageLogs(logs);
      setComputers(computersData);
      setReservations(reservationsData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      await api.updateReservation(reservationId, { status: newStatus });
      fetchData(); // Refresh the data
      alert(`Cập nhật trạng thái thành công: ${newStatus}`);
    } catch (error) {
      alert("Lỗi cập nhật trạng thái: " + error.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredLogs = usageLogs.filter(log => {
    const matchesComputer = !filters.computer_id || log.computer_id?.computer_name?.toLowerCase().includes(filters.computer_id.toLowerCase());
    const matchesUser = !filters.user_name || log.user_id?.username?.toLowerCase().includes(filters.user_name.toLowerCase());
    const matchesStatus = !filters.status || log.session_status === filters.status;
    const logDate = new Date(log.start_time);
    const startDate = filters.start_date ? new Date(filters.start_date) : null;
    const endDate = filters.end_date ? new Date(filters.end_date) : null;
    const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);

    return matchesComputer && matchesUser && matchesStatus && matchesDate;
  });

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getReservationActions = (reservation) => {
    const status = reservation.status;
    if (status === "reserved") {
      return (
        <>
          <button
            onClick={() => updateReservationStatus(reservation._id, "confirmed")}
            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded mr-2 text-sm"
          >
            Xác nhận
          </button>
          <button
            onClick={() => updateReservationStatus(reservation._id, "cancelled")}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Hủy
          </button>
        </>
      );
    } else if (status === "confirmed") {
      return (
        <button
          onClick={() => updateReservationStatus(reservation._id, "completed")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Hoàn thành
        </button>
      );
    }
    return null;
  };

  if (loading) return <div className="text-red-300">Đang tải...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-red-300">
      <h2 className="text-2xl font-bold mb-6 text-red-300">Danh sách người đang sử dụng máy</h2>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('usage')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'usage'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Người đang sử dụng
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'reservations'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Danh sách đặt chỗ
        </button>
        <button
          onClick={() => setActiveTab('computers')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'computers'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Thông tin máy tính
        </button>
      </div>

      {activeTab === 'usage' && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-red-300">Danh sách người đang sử dụng máy tính</h3>

          {/* Filters */}
          <div className="bg-gray-100 p-4 rounded mb-6">
            <h3 className="font-semibold mb-4 text-red-300">Bộ lọc</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-red-300">Tên máy:</label>
                <input
                  type="text"
                  name="computer_id"
                  value={filters.computer_id}
                  onChange={handleFilterChange}
                  placeholder="Nhập tên máy"
                  className="w-full p-2 border rounded text-red-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-red-300">Tên khách hàng:</label>
                <input
                  type="text"
                  name="user_name"
                  value={filters.user_name}
                  onChange={handleFilterChange}
                  placeholder="Nhập tên khách hàng"
                  className="w-full p-2 border rounded text-red-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-red-300">Từ ngày:</label>
                <input
                  type="date"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded text-red-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-red-300">Đến ngày:</label>
                <input
                  type="date"
                  name="end_date"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded text-red-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-red-300">Trạng thái:</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded text-red-300"
                >
                  <option value="">Tất cả</option>
                  <option value="in-progress">Đang sử dụng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>

          {/* Usage Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2 text-left text-red-300">Tên máy</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Khách hàng</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Thời gian bắt đầu</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Thời gian sử dụng</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Gói dịch vụ</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-red-300">{log.computer_id?.computer_name || 'N/A'}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{log.user_id?.username || 'N/A'}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{formatDateTime(log.start_time)}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{formatDuration(log.total_time)}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{log.service_package_id?.name || 'Không có'}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-red-300">
              {filters.status === 'in-progress'
                ? 'Hiện tại không có ai đang sử dụng máy tính.'
                : 'Không tìm thấy phiên sử dụng nào phù hợp với bộ lọc.'
              }
            </div>
          )}

          {/* Detail Modal */}
          {selectedLog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 text-red-300">Chi tiết phiên sử dụng</h3>
                <div className="space-y-2 text-red-300">
                  <p><strong>Máy tính:</strong> {selectedLog.computer_id?.computer_name || 'N/A'}</p>
                  <p><strong>Khách hàng:</strong> {selectedLog.user_id?.username || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedLog.user_id?.email || 'N/A'}</p>
                  <p><strong>Thời gian bắt đầu:</strong> {formatDateTime(selectedLog.start_time)}</p>
                  <p><strong>Thời gian kết thúc:</strong> {selectedLog.end_time ? formatDateTime(selectedLog.end_time) : 'Chưa kết thúc'}</p>
                  <p><strong>Thời lượng:</strong> {formatDuration(selectedLog.total_time)}</p>
                  <p><strong>Gói dịch vụ:</strong> {selectedLog.service_package_id?.name || 'Không có'}</p>
                  <p><strong>Tổng phí:</strong> {selectedLog.cost} VND</p>
                  <p><strong>Trạng thái:</strong> {
                    selectedLog.session_status === 'completed' ? 'Hoàn thành' :
                    selectedLog.session_status === 'in-progress' ? 'Đang sử dụng' : 'Đã hủy'
                  }</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'reservations' && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-red-300">Danh sách đặt chỗ máy tính</h3>

          {/* Reservations Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2 text-left text-red-300">Máy tính</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Tên khách hàng</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Thời gian bắt đầu</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Thời gian kết thúc</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Gói dịch vụ</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Chi phí</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Trạng thái</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-red-300">{reservation.computer_id}</td>
                    <td className="border border-gray-300 p-2 text-red-300">
                      {reservation.user_id?.username || reservation.customer_name || 'N/A'}
                    </td>
                    <td className="border border-gray-300 p-2 text-red-300">{formatDateTime(reservation.start_time)}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{formatDateTime(reservation.end_time)}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{reservation.service_package_id?.name || 'Không có'}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{reservation.estimated_cost} VND</td>
                    <td className="border border-gray-300 p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        reservation.status === 'reserved' ? 'bg-blue-200 text-blue-800' :
                        reservation.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                        reservation.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {reservation.status === 'reserved' ? 'Đã đặt' :
                         reservation.status === 'confirmed' ? 'Đã xác nhận' :
                         reservation.status === 'cancelled' ? 'Đã hủy' : reservation.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {getReservationActions(reservation)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reservations.length === 0 && (
            <div className="text-center py-8 text-red-300">
              Không có đặt chỗ nào.
            </div>
          )}
        </>
      )}

      {activeTab === 'computers' && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-red-300">Thông tin tất cả máy tính</h3>

          {/* Computers Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2 text-left text-red-300">Tên máy</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Phòng</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">CPU</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">GPU</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">RAM</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Storage</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Giá/giờ</th>
                  <th className="border border-gray-300 p-2 text-left text-red-300">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {computers.map(computer => (
                  <tr key={computer._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-red-300">{computer.computer_name}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{computer.room}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{computer.specs.cpu}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{computer.specs.gpu}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{computer.specs.ram}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{computer.specs.storage}</td>
                    <td className="border border-gray-300 p-2 text-red-300">{computer.hourly_rate} VND</td>
                    <td className="border border-gray-300 p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        computer.status === 'available' ? 'bg-green-200 text-green-800' :
                        computer.status === 'in-use' ? 'bg-blue-200 text-blue-800' :
                        computer.status === 'maintenance' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {computer.status === 'available' ? 'Sẵn sàng' :
                         computer.status === 'in-use' ? 'Đang sử dụng' :
                         computer.status === 'maintenance' ? 'Bảo trì' : 'Dự trữ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {computers.length === 0 && (
            <div className="text-center py-8 text-red-300">
              Không có máy tính nào trong hệ thống.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsageHistoryPage;