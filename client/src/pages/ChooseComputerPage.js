import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChooseComputerPage = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComputers = async () => {
      try {
        const res = await fetch("/api/computers?status=available");
        const data = await res.json();
        setComputers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchComputers();
  }, []);

  const handleChoose = async (id) => {
    // paymentId should be known after client confirms payment. For demo, we expect it in localStorage as 'lastPaymentId'
    const paymentId = localStorage.getItem("lastPaymentId");
    if (!paymentId) return alert("Không tìm thấy payment đã hoàn thành. Vui lòng thực hiện thanh toán trước.");

    try {
      const res = await fetch(`/api/payments/${paymentId}/assign-computer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ computer_id: id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gán máy thất bại");
      alert("Gán máy thành công!");
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Đang tải danh sách máy...</div>;

  return (
    <div>
      <h2>Chọn máy</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {computers.map((c) => (
          <div key={c._id} style={{ border: "1px solid #ccc", padding: 12, width: 220 }}>
            <h3>{c.computer_name}</h3>
            <div>Phòng: {c.room}</div>
            <div>Trạng thái: {c.status}</div>
            <div>Giá giờ: {c.hourly_rate} VND</div>
            <button onClick={() => handleChoose(c._id)}>Chọn máy này</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseComputerPage;
