import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import "./Statistical.css";
import { Chart, registerables } from 'chart.js';
import APIs, { endpoints } from '../../configs/APIs';

const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

const Statistical = () => {
    const [selectedTime, setSelectedTime] = useState('month');
    const [selectedType, setSelectedType] = useState('density'); // 'density' or 'revenue'
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [years, setYears] = useState([]);

    Chart.register(...registerables);

    useEffect(() => {
        const fetchYears = async () => {
            const currentYear = new Date().getFullYear();
            const yearList = Array.from({ length: currentYear - 2019 }, (_, index) => currentYear - index);
            setYears(yearList);
        };

        fetchYears();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let response;

                if (selectedType === 'density') {
                    if (selectedTime === 'month') {
                        response = await APIs.get(endpoints.statistics + 'monthly-density/?year=' + selectedYear);
                        setReportData(response.data.monthly_density || []);
                    } else if (selectedTime === 'quarter') {
                        response = await APIs.get(endpoints.statistics + 'quarterly-density/?year=' + selectedYear);
                        setReportData(response.data.quarterly_density || []);
                    } else {
                        response = await APIs.get(endpoints.statistics + 'yearly-density/');
                        setReportData(response.data.yearly_density || []);
                    }
                } else { // Doanh thu
                    if (selectedTime === 'month') {
                        response = await APIs.get(endpoints.statistics + 'monthly-revenue/?year=' + selectedYear);
                        setReportData(response.data.monthly_revenue || []);
                    } else if (selectedTime === 'quarter') {
                        response = await APIs.get(endpoints.statistics + 'quarterly-revenue/?year=' + selectedYear);
                        setReportData(response.data.quarterly_revenue || []);
                    } else {
                        response = await APIs.get(endpoints.statistics + 'yearly-revenue/');
                        setReportData(response.data.yearly_revenue || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
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

    // Thay đổi dữ liệu cho biểu đồ
    const chartData = {
        labels: selectedTime === 'month' ? 
            ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'] :
            selectedTime === 'quarter' ? ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'] : 
            reportData.map(item => `Năm ${item.year}`),
        datasets: [
            {
                label: selectedType === 'density' ? 'Mật độ Tiệc Cưới' : 'Doanh Thu',
                data: selectedType === 'density' ? 
                    reportData.map(item => item.total_density || 0) :  // Lấy dữ liệu mật độ
                    reportData.map(item => item.total_revenue || 0), // Lấy dữ liệu doanh thu
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="stat-container">
            <h1 className='text-center'>Thống Kê Tiệc Cưới</h1>
            <div className="controls">
                <label>
                    Chọn loại thống kê:
                    <select value={selectedType} onChange={handleTypeChange}>
                        <option value="density">Mật độ Tiệc Cưới</option>
                        <option value="revenue">Doanh Thu</option>
                    </select>
                </label>
                <label>
                    Chọn khoảng thời gian:
                    <select value={selectedTime} onChange={handleTimeChange}>
                        <option value="month">Tháng</option>
                        <option value="quarter">Quý</option>
                        <option value="year">Năm</option>
                    </select>
                </label>
                <label>
                    Chọn năm:
                    <select value={selectedYear} onChange={handleYearChange} disabled={selectedTime === 'year'}>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </label>
            </div>
            {loading ? (
                <p className="loading">Đang tải dữ liệu...</p>
            ) : (
                <div>
                    <Bar data={chartData} />
                    <table>
                        <thead>
                            <tr>
                                <th>Khoảng Thời Gian</th>
                                <th>{selectedType === 'density' ? 'Số Tiệc' : 'Doanh Thu'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedTime === 'year' ? (
                                reportData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{`Năm ${data.year}`}</td>
                                        <td>{selectedType === 'density' ? data.total_density : data.total_revenue}</td>
                                    </tr>
                                ))
                            ) : (
                                reportData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{selectedTime === 'month' ? `Tháng ${index + 1}` : `Quý ${index + 1}`}</td>
                                        <td>{selectedType === 'density' ? formatCurrency(data.total_density) || 0 : formatCurrency(data.total_revenue) || 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Statistical;
