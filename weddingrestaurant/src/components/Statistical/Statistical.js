import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "./Statistical.css";
import { Chart, registerables } from "chart.js";
import APIs, { endpoints } from "../../configs/APIs";
import vietnameseFont from "../../assets/fonts/Roboto/Roboto-Regular.ttf";
import { formatCurrency } from "../Base/Base"

const Statistical = () => {
  const [selectedTime, setSelectedTime] = useState("month");
  const [selectedType, setSelectedType] = useState("density");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);

  Chart.register(...registerables);

  useEffect(() => {
    const fetchYears = async () => {
      const currentYear = new Date().getFullYear();
      const yearList = Array.from(
        { length: currentYear - 2019 },
        (_, index) => currentYear - index
      );
      setYears(yearList);
    };

    fetchYears();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        // Mật độ
        if (selectedType === "density") {
          if (selectedTime === "month") {
            response = await APIs.get(
              endpoints.statistics + "monthly-density/?year=" + selectedYear
            );
            setReportData(response.data.monthly_density || []);
          } else if (selectedTime === "quarter") {
            response = await APIs.get(
              endpoints.statistics + "quarterly-density/?year=" + selectedYear
            );
            setReportData(response.data.quarterly_density || []);
          } else {
            response = await APIs.get(endpoints.statistics + "yearly-density/");
            setReportData(response.data.yearly_density || []);
          }
        } else {
          // Doanh thu
          if (selectedTime === "month") {
            response = await APIs.get(
              endpoints.statistics + "monthly-revenue/?year=" + selectedYear
            );
            setReportData(response.data.monthly_revenue || []);
          } else if (selectedTime === "quarter") {
            response = await APIs.get(
              endpoints.statistics + "quarterly-revenue/?year=" + selectedYear
            );
            setReportData(response.data.quarterly_revenue || []);
          } else {
            response = await APIs.get(endpoints.statistics + "yearly-revenue/");
            setReportData(response.data.yearly_revenue || []);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTime, selectedType, selectedYear]);

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    // doc.setFont("times");

    let title = `Thống kê theo ${
      selectedTime === "month"
        ? "tháng"
        : selectedTime === "quarter"
        ? "quý"
        : "năm"
    } - Năm ${selectedYear}`;
    doc.text(title, 20, 10);

    doc.autoTable({
      head: [
        [
          selectedTime === "month"
            ? "Tháng"
            : selectedTime === "quarter"
            ? "Quý"
            : "Năm",
          selectedType === "density" ? "Số Tiệc" : "Doanh Thu",
        ],
      ],
      body: reportData.map((data, index) => [
        selectedTime === "month"
          ? `Tháng ${index + 1}`
          : selectedTime === "quarter"
          ? `Quý ${index + 1}`
          : `Năm ${data.year}`,
        selectedType === "density"
          ? data.total_density || 0
          : formatCurrency(data.total_revenue) || 0,
      ]),
    //   styles: {
    //     font: "times",
    //   },
    });

    doc.save(`stat-${selectedTime}.pdf`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        `Thống kê theo ${
          selectedTime === "month"
            ? "tháng"
            : selectedTime === "quarter"
            ? "quý"
            : "năm"
        } - Năm ${selectedYear}`,
      ], // Tiêu đề
      [
        selectedTime === "month"
          ? "Tháng"
          : selectedTime === "quarter"
          ? "Quý"
          : "Năm",
        selectedType === "density" ? "Số Tiệc" : "Doanh Thu",
      ],
      ...reportData.map((data, index) => [
        selectedTime === "month"
          ? `Tháng ${index + 1}`
          : selectedTime === "quarter"
          ? `Quý ${index + 1}`
          : `Năm ${data.year}`,
        selectedType === "density"
          ? data.total_density || 0
          : data.total_revenue || 0,
      ]),
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thống Kê");
    XLSX.writeFile(workbook, `stat-${selectedTime}.xlsx`);
  };

  const chartData = {
    labels:
      selectedTime === "month"
        ? [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ]
        : selectedTime === "quarter"
        ? ["Quý 1", "Quý 2", "Quý 3", "Quý 4"]
        : reportData.map((item) => `Năm ${item.year}`),
    datasets: [
      {
        label: selectedType === "density" ? "Mật độ Tiệc Cưới" : "Doanh Thu",
        data:
          selectedType === "density"
            ? reportData.map((item) => item.total_density || 0)
            : reportData.map((item) => item.total_revenue || 0),
        backgroundColor: "rgba(63, 150, 162, 0.7)",
        borderColor: "rgba(63, 150, 162, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      <h1 className="stat-title">Thống Kê</h1>
      <div className="stat-container">
        <div className="controls">
          <label>
            Chọn loại thống kê:
            <select value={selectedType} onChange={handleTypeChange}>
              <option value="density">Mật Độ Tiệc</option>
              <option value="revenue">Doanh Thu</option>
            </select>
          </label>
          <label>
            Thống kê theo:
            <select value={selectedTime} onChange={handleTimeChange}>
              <option value="month">Tháng</option>
              <option value="quarter">Quý</option>
              <option value="year">Năm</option>
            </select>
          </label>
          <label>
            Chọn năm:
            <select
              value={selectedYear}
              onChange={handleYearChange}
              disabled={selectedTime === "year"}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <p className="loading">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div>
            <Bar className="stat-bar" data={chartData} />
            <h5 className="table-title">Bảng số liệu:</h5>
            <table className="stat-table">
              <thead>
                <tr>
                  <th>Khoảng Thời Gian</th>
                  <th>
                    {selectedType === "density" ? "Số Tiệc" : "Doanh Thu"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedTime === "year"
                  ? reportData.map((data, index) => (
                      <tr key={`year-${index}`}>
                        <td>{`Năm ${data.year}`}</td>
                        <td>
                          {selectedType === "density"
                            ? data.total_density
                            : formatCurrency(data.total_revenue)}
                        </td>
                      </tr>
                    ))
                  : reportData.map((data, index) => (
                      <tr key={`time-${index}`}>
                        <td>
                          {selectedTime === "month"
                            ? `Tháng ${index + 1}`
                            : `Quý ${index + 1}`}
                        </td>
                        <td>
                          {selectedType === "density"
                            ? data.total_density
                            : formatCurrency(data.total_revenue)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="export-buttons">
          <button onClick={exportPDF}>Xuất PDF</button>
          <button onClick={exportExcel}>Xuất Excel</button>
        </div>
      </div>
    </>
  );
};

export default Statistical;
