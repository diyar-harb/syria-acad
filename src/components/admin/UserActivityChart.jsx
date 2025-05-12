import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../../styles/admin/UserActivityChart.css';

function UserActivityChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // تدمير المخطط السابق إذا وجد
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // بيانات نموذجية
      const data = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [
          {
            label: 'المستخدمون الجدد',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.4
          },
          {
            label: 'المستخدمون النشطون',
            data: [28, 48, 40, 19, 86, 27],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            tension: 0.4
          }
        ]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 12
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 20
            }
          }
        }
      };

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="chart-wrapper">
      <canvas ref={chartRef} />
    </div>
  );
}

export default UserActivityChart; 