import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SmartDataGrid from '../../components/SmartDataGrid';
import '../../styles/admin/FinanceManagement.css';

function FinanceManagement() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    // محاكاة جلب البيانات من الخادم
    const fetchTransactions = async () => {
      try {
        // في التطبيق الحقيقي، هذا سيكون طلب API
        const mockTransactions = [
          {
            id: 1,
            type: 'اشتراك',
            amount: 100,
            status: 'مكتمل',
            date: '2024-03-20',
            user: 'أحمد محمد',
            paymentMethod: 'بطاقة ائتمان'
          },
          {
            id: 2,
            type: 'سحب',
            amount: 500,
            status: 'قيد المعالجة',
            date: '2024-03-19',
            user: 'د. سارة أحمد',
            paymentMethod: 'تحويل بنكي'
          },
          // ... المزيد من المعاملات
        ];
        setTransactions(mockTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const columns = {
    subscriptions: [
      { key: 'date', label: 'التاريخ', render: (item) => new Date(item.date).toLocaleDateString('ar-SA') },
      { key: 'user', label: 'المستخدم' },
      { key: 'amount', label: 'المبلغ', render: (item) => `$${item.amount}` },
      { key: 'paymentMethod', label: 'طريقة الدفع' },
      { key: 'status', label: 'الحالة' },
      {
        key: 'actions',
        label: 'الإجراءات',
        render: (item) => (
          <div className="actions">
            <button 
              className="action-button view"
              title="عرض التفاصيل"
              onClick={() => handleViewDetails(item.id)}
            >
              <i className="fas fa-eye" />
            </button>
            <button 
              className="action-button refund"
              title="استرداد"
              onClick={() => handleRefund(item.id)}
            >
              <i className="fas fa-undo" />
            </button>
          </div>
        ),
      },
    ],
    withdrawals: [
      { key: 'date', label: 'التاريخ', render: (item) => new Date(item.date).toLocaleDateString('ar-SA') },
      { key: 'user', label: 'المدرس' },
      { key: 'amount', label: 'المبلغ', render: (item) => `$${item.amount}` },
      { key: 'paymentMethod', label: 'طريقة السحب' },
      { key: 'status', label: 'الحالة' },
      {
        key: 'actions',
        label: 'الإجراءات',
        render: (item) => (
          <div className="actions">
            <button 
              className="action-button view"
              title="عرض التفاصيل"
              onClick={() => handleViewDetails(item.id)}
            >
              <i className="fas fa-eye" />
            </button>
            <button 
              className="action-button approve"
              title="موافقة"
              onClick={() => handleApprove(item.id)}
            >
              <i className="fas fa-check" />
            </button>
            <button 
              className="action-button reject"
              title="رفض"
              onClick={() => handleReject(item.id)}
            >
              <i className="fas fa-times" />
            </button>
          </div>
        ),
      },
    ]
  };

  const handleViewDetails = (id) => {
    // معالجة عرض تفاصيل المعاملة
    console.log('View details:', id);
  };

  const handleRefund = (id) => {
    // معالجة استرداد المبلغ
    console.log('Refund:', id);
  };

  const handleApprove = (id) => {
    // معالجة الموافقة على السحب
    console.log('Approve withdrawal:', id);
  };

  const handleReject = (id) => {
    // معالجة رفض السحب
    console.log('Reject withdrawal:', id);
  };

  return (
    <div className={`admin-layout ${theme}`}>
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1>النظام المالي</h1>
          <div className="header-actions">
            <button className="export-finance">
              <i className="fas fa-file-export" /> تصدير التقرير
            </button>
          </div>
        </div>

        <div className="finance-tabs">
          <button 
            className={`tab-button ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            الاشتراكات
          </button>
          <button 
            className={`tab-button ${activeTab === 'withdrawals' ? 'active' : ''}`}
            onClick={() => setActiveTab('withdrawals')}
          >
            طلبات السحب
          </button>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>نوع المعاملة:</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="all">الكل</option>
              <option value="subscription">اشتراك</option>
              <option value="withdrawal">سحب</option>
            </select>
          </div>

          <div className="filter-group">
            <label>الحالة:</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">الكل</option>
              <option value="completed">مكتمل</option>
              <option value="pending">قيد المعالجة</option>
              <option value="failed">فاشل</option>
            </select>
          </div>

          <div className="filter-group">
            <label>الفترة الزمنية:</label>
            <select 
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            >
              <option value="all">الكل</option>
              <option value="today">اليوم</option>
              <option value="week">الأسبوع</option>
              <option value="month">الشهر</option>
            </select>
          </div>
        </div>

        <div className="finance-summary">
          <div className="summary-card">
            <h3>إجمالي الإيرادات</h3>
            <p className="amount">$25,000</p>
            <p className="change positive">+12% عن الشهر الماضي</p>
          </div>
          <div className="summary-card">
            <h3>المدفوعات المعلقة</h3>
            <p className="amount">$5,000</p>
            <p className="change negative">-5% عن الشهر الماضي</p>
          </div>
          <div className="summary-card">
            <h3>صافي الربح</h3>
            <p className="amount">$20,000</p>
            <p className="change positive">+8% عن الشهر الماضي</p>
          </div>
        </div>

        <SmartDataGrid
          data={transactions}
          columns={columns[activeTab]}
          loading={loading}
          pageSize={10}
          sortable={true}
          filterable={true}
        />
      </div>
    </div>
  );
}

export default FinanceManagement; 