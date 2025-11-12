import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const ReservationPage = () => {
  const [computers, setComputers] = useState([]);
  const [servicePackages, setServicePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    room: "",
    computer_name: "",
    start_time: "",
    duration_hours: 1,
    service_package_id: ""
  });
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [computersRes, packagesRes] = await Promise.all([
          api.getAllComputers("available"),
          api.getAllServicePackages()
        ]);
        setComputers(computersRes);
        setServicePackages(packagesRes);
      } catch (e) {
        console.error(e);
        alert("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateCost = useCallback(() => {
    const computer = computers.find(c => c.computer_name === formData.computer_name && c.room === formData.room);
    if (!computer) return 0;

    let cost = formData.duration_hours * computer.hourly_rate;
    if (formData.service_package_id) {
      const pkg = servicePackages.find(p => p._id === formData.service_package_id);
      if (pkg) cost += pkg.price;
    }
    return cost;
  }, [computers, formData, servicePackages]);

  useEffect(() => {
    setEstimatedCost(calculateCost());
  }, [calculateCost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.room || !formData.computer_name || !formData.start_time || !formData.duration_hours) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        user_id: "671f4a50e5d9d70012fa0001", // Mock user ID, should get from auth
        room: formData.room,
        computer_name: formData.computer_name,
        start_time: formData.start_time,
        duration_hours: parseInt(formData.duration_hours),
        service_package_id: formData.service_package_id || undefined
      };

      const result = await api.createReservation(payload);
      alert(`Đặt chỗ thành công! ID: ${result.reservation.reservation_id}\nChi phí ước tính: ${result.reservation.estimated_cost} VND`);
      navigate("/");
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const availableRooms = [...new Set(computers.map(c => c.room))];
  const availableComputers = computers.filter(c => c.room === formData.room);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Đặt chỗ máy tính</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Chọn phòng:</label>
          <select
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn phòng</option>
            {availableRooms.map(room => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Chọn máy:</label>
          <select
            name="computer_name"
            value={formData.computer_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            disabled={!formData.room}
          >
            <option value="">Chọn máy</option>
            {availableComputers.map(comp => (
              <option key={comp._id} value={comp.computer_name}>
                {comp.computer_name} - {comp.specs.cpu} - {comp.hourly_rate} VND/giờ
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Thời gian bắt đầu:</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Số giờ sử dụng (1-12):</label>
          <input
            type="number"
            name="duration_hours"
            value={formData.duration_hours}
            onChange={handleInputChange}
            min="1"
            max="12"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gói dịch vụ (tùy chọn):</label>
          <select
            name="service_package_id"
            value={formData.service_package_id}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Không chọn gói</option>
            {servicePackages.filter(p => p.isActive).map(pkg => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.name} - {pkg.price} VND
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Chi phí ước tính: {estimatedCost} VND</h3>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting ? "Đang xử lý..." : "Xác nhận đặt chỗ"}
        </button>
      </form>
    </div>
  );
};

export default ReservationPage;