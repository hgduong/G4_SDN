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
    service_package_id: "",
    customer_name: "",
    already_paid: false
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
        room: formData.room,
        computer_name: formData.computer_name,
        start_time: formData.start_time,
        duration_hours: parseInt(formData.duration_hours),
        service_package_id: formData.service_package_id || undefined,
        customer_name: formData.customer_name.trim(),
        already_paid: formData.already_paid
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

  if (loading) return <div className="text-red-300">Đang tải...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-red-300">
      <h2 className="text-2xl font-bold mb-6 text-red-300">Đặt chỗ máy tính</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-red-300">Chọn phòng:</label>
          <select
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-red-300"
            required
          >
            <option value="" className="text-red-300">Chọn phòng</option>
            {availableRooms.map(room => (
              <option key={room} value={room} className="text-red-300">{room}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-red-300">Chọn máy:</label>
          <select
            name="computer_name"
            value={formData.computer_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-red-300"
            required
            disabled={!formData.room}
          >
            <option value="" className="text-red-300">Chọn máy</option>
            {availableComputers.map(comp => (
              <option key={comp._id} value={comp.computer_name} className="text-red-300">
                {comp.computer_name} - {comp.specs.cpu} - {comp.hourly_rate} VND/giờ
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-red-300">Thời gian bắt đầu:</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-red-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-red-300">Số giờ sử dụng (1-12):</label>
          <input
            type="number"
            name="duration_hours"
            value={formData.duration_hours}
            onChange={handleInputChange}
            min="1"
            max="12"
            className="w-full p-2 border rounded text-red-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-red-300">Gói dịch vụ (tùy chọn):</label>
          <select
            name="service_package_id"
            value={formData.service_package_id}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-red-300"
          >
            <option value="" className="text-red-300">Không chọn gói</option>
            {servicePackages.filter(p => p.isActive).map(pkg => (
              <option key={pkg._id} value={pkg._id} className="text-red-300">
                {pkg.name} - {pkg.price} VND
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold text-red-300">Chi phí ước tính: {estimatedCost} VND</h3>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-red-300">Tên khách hàng:</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-red-300"
            placeholder="Nhập tên khách hàng"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="already_paid"
            name="already_paid"
            checked={formData.already_paid}
            onChange={(e) => setFormData(prev => ({ ...prev, already_paid: e.target.checked }))}
            className="mr-2"
          />
          <label htmlFor="already_paid" className="text-sm text-red-300">
            Đã thanh toán
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 text-red-300 py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting ? "Đang xử lý..." : "Xác nhận đặt chỗ"}
        </button>
      </form>
    </div>
  );
};

export default ReservationPage;