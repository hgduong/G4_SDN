import React, { useState, useEffect } from 'react';
import api from '../api/api';

const PaymentPage = () => {
  const [usageLogs, setUsageLogs] = useState([]);
  const [allUsageLogs, setAllUsageLogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedUsageLog, setSelectedUsageLog] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  useEffect(() => {
    loadActiveUsageLogs();
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await api.getAllPayments();
      console.log('Payments from MongoDB:', data);
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const loadActiveUsageLogs = async () => {
    try {
      const data = await api.getUsageLogs();
      console.log('Usage logs from MongoDB:', data); // Debug log
      setAllUsageLogs(data); // Store all logs for debugging
      // Filter for in-progress sessions
      const activeLogs = data.filter(log => log.session_status === 'in-progress');
      console.log('Active usage logs:', activeLogs); // Debug log
      setUsageLogs(activeLogs);
    } catch (error) {
      console.error('Error loading usage logs:', error);
      setMessage('Lỗi khi tải danh sách phiên đang hoạt động');
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedUsageLog) {
      setMessage('Vui lòng chọn phiên cần thanh toán');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await api.processPayment({
        usage_log_id: selectedUsageLog._id,
        payment_method: paymentMethod
      });

      setPaymentResult(result);
      setMessage('Thanh toán thành công!');
      // Reload usage logs and payments to update status
      loadActiveUsageLogs();
      loadPayments();
      setSelectedUsageLog(null);
    } catch (error) {
      setMessage(error.message || 'Lỗi khi xử lý thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center neon-glow">
          Xử Lý Thanh Toán
        </h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('thành công')
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chọn Phiên Cần Thanh Toán</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAllLogs(!showAllLogs)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {showAllLogs ? 'Ẩn Usage Logs' : 'Hiển thị Usage Logs'}
              </button>
              <button
                onClick={() => setShowPayments(!showPayments)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {showPayments ? 'Ẩn Payments' : 'Hiển thị Payments'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usageLogs.map((log) => (
              <div
                key={log._id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedUsageLog?._id === log._id
                    ? 'border-cyan-400 bg-cyan-900/20'
                    : 'border-gray-600 hover:border-cyan-300'
                }`}
                onClick={() => setSelectedUsageLog(log)}
              >
                <h3 className="font-semibold text-lg">
                  Máy: {log.computer_id?.computer_name || `ID: ${log.computer_id}`}
                </h3>
                <p className="text-gray-300">Phòng: {log.computer_id?.room || 'N/A'}</p>
                <p className="text-gray-300">
                  Người dùng: {log.user_id?.username || `ID: ${log.user_id}`}
                </p>
                <p className="text-cyan-400">
                  Bắt đầu: {new Date(log.start_time).toLocaleString('vi-VN')}
                </p>
                <p className="text-green-400">Trạng thái: {log.session_status}</p>
                <p className="text-yellow-400">Thời gian: {log.total_time || 0} phút</p>
                <p className="text-orange-400">Chi phí: {log.cost || 0}đ</p>
              </div>
            ))}
          </div>

          {usageLogs.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              Không có phiên nào đang hoạt động
            </p>
          )}
        </div>

        {showAllLogs && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">
              Tất cả Usage Logs từ MongoDB ({allUsageLogs.length})
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {allUsageLogs.map((log) => (
                <div key={log._id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-300"><strong>ID:</strong> {log._id}</p>
                      <p className="text-cyan-400">
                        <strong>Máy:</strong> {log.computer_id?.computer_name || log.computer_id || 'N/A'}
                      </p>
                      <p className="text-gray-300">
                        <strong>Phòng:</strong> {log.computer_id?.room || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-green-400">
                        <strong>Người dùng:</strong> {log.user_id?.username || log.user_id || 'N/A'}
                      </p>
                      <p className="text-yellow-400">
                        <strong>Trạng thái:</strong> {log.session_status}
                      </p>
                      <p className="text-orange-400">
                        <strong>Thời gian:</strong> {log.total_time || 0} phút
                      </p>
                    </div>
                    <div>
                      <p className="text-purple-400">
                        <strong>Bắt đầu:</strong> {new Date(log.start_time).toLocaleString('vi-VN')}
                      </p>
                      {log.end_time && (
                        <p className="text-purple-400">
                          <strong>Kết thúc:</strong> {new Date(log.end_time).toLocaleString('vi-VN')}
                        </p>
                      )}
                      <p className="text-red-400">
                        <strong>Chi phí:</strong> {log.cost || 0}đ
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {allUsageLogs.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                Không có dữ liệu usage logs trong MongoDB
              </p>
            )}
          </div>
        )}

        {showPayments && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              Tất cả Payments từ MongoDB ({payments.length})
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {payments.map((payment) => (
                <div key={payment._id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-300"><strong>ID:</strong> {payment._id}</p>
                      <p className="text-cyan-400"><strong>Mã thanh toán:</strong> {payment.payment_id}</p>
                      <p className="text-green-400"><strong>Số tiền:</strong> {payment.amount}đ</p>
                    </div>
                    <div>
                      <p className="text-orange-400"><strong>Phương thức:</strong> {payment.method}</p>
                      <p className="text-yellow-400"><strong>Trạng thái:</strong> {payment.status}</p>
                      <p className="text-purple-400">
                        <strong>Người dùng:</strong> {payment.user_id?.username || payment.user_id || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-400">
                        <strong>Thời gian:</strong> {new Date(payment.created_at).toLocaleString('vi-VN')}
                      </p>
                      {payment.reservation_id && (
                        <p className="text-red-400">
                          <strong>Reservation:</strong> {payment.reservation_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {payments.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                Không có dữ liệu payments trong MongoDB
              </p>
            )}
          </div>
        )}

        {selectedUsageLog && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Thông Tin Thanh Toán</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Phiên đã chọn:</h3>
                <p className="text-cyan-400">Máy: {selectedUsageLog.computer_id?.computer_name || 'N/A'}</p>
                <p className="text-gray-300">Phòng: {selectedUsageLog.computer_id?.room || 'N/A'}</p>
                <p className="text-gray-300">Người dùng: {selectedUsageLog.user_id?.username || 'N/A'}</p>
                <p className="text-gray-300">
                  Bắt đầu: {new Date(selectedUsageLog.start_time).toLocaleString('vi-VN')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Phương thức thanh toán:</h3>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="cash">Tiền mặt</option>
                  <option value="card">Thẻ tín dụng</option>
                  <option value="momo">Ví MoMo</option>
                  <option value="bank_transfer">Chuyển khoản</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={loading}
              className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Xử Lý Thanh Toán'}
            </button>
          </div>
        )}

        {paymentResult && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              Hóa Đơn Thanh Toán
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Thông tin thanh toán:</h3>
                <p>Mã thanh toán: <span className="text-cyan-400">{paymentResult.payment?.payment_id}</span></p>
                <p>Tổng tiền: <span className="text-green-400">{paymentResult.payment?.amount}đ</span></p>
                <p>Phương thức: <span className="text-cyan-400">{paymentResult.payment?.method}</span></p>
                <p>Trạng thái: <span className="text-green-400">{paymentResult.payment?.status}</span></p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Chi tiết sử dụng:</h3>
                <p>Thời gian: <span className="text-cyan-400">{paymentResult.usage?.total_time_minutes} phút</span></p>
                <p>Giờ chơi: <span className="text-cyan-400">{paymentResult.usage?.total_hours}</span></p>
                <p>Giá/giờ: <span className="text-cyan-400">{paymentResult.usage?.rate_per_hour}đ</span></p>
                {paymentResult.usage?.is_night && (
                  <p className="text-orange-400">Đã áp dụng giá đêm</p>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Trạng thái máy:</h3>
              <p>Máy <span className="text-cyan-400">{paymentResult.computer?.computer_name}</span> đã được chuyển về trạng thái <span className="text-green-400">available</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;