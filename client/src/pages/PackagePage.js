import React, { useState, useEffect } from "react";
import api from "../api/api";

function PackagePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await api.getAllServicePackages();
        // Filter only active packages
        const activePackages = data.filter(pkg => pkg.isActive);
        setPackages(activePackages);
      } catch (error) {
        console.error("Failed to fetch service packages:", error);
        setError("Không thể tải danh sách gói dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-cyan-400">Danh sách gói dịch vụ</h1>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-cyan-400">Danh sách gói dịch vụ</h1>
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">Danh sách gói dịch vụ</h1>

        {packages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Không có gói dịch vụ nào khả dụng</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-400 transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">{pkg.name}</h3>

                <div className="space-y-2 mb-4">
                  {pkg.duration_minutes && (
                    <div className="flex items-center text-gray-300">
                      <span className="font-medium">Thời gian:</span>
                      <span className="ml-2">{pkg.duration_minutes} phút</span>
                    </div>
                  )}

                  <div className="flex items-center text-green-400">
                    <span className="font-medium">Giá:</span>
                    <span className="ml-2 text-lg font-bold">{pkg.price.toLocaleString()} VND</span>
                  </div>
                </div>

                {pkg.description && (
                  <p className="text-gray-400 text-sm leading-relaxed">{pkg.description}</p>
                )}

                <button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                  Chọn gói này
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PackagePage;