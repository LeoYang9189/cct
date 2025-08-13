import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LeadFormModal.css';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadFormModal = ({ isOpen, onClose }: LeadFormModalProps) => {
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    businessType: '',
    message: '',
    agreeTerms: false
  });

  // 表单验证状态
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // 清除该字段的错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名';
    }

    if (!formData.company.trim()) {
      newErrors.company = '请输入公司名称';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '请阅读并同意服务条款和隐私政策';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 这里可以添加实际的API调用来提交表单数据
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitSuccess(true);

      // 重置表单
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({
          name: '',
          company: '',
          position: '',
          email: '',
          phone: '',
          businessType: '',
          message: '',
          agreeTerms: false
        });
      }, 2000);
    } catch (error) {
      console.error('提交表单时出错:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 按ESC键关闭弹窗
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // 当弹窗打开时禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 lead-form-modal-overlay"
            onClick={onClose}
          />

          {/* 弹窗内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto lead-form-modal"
            onClick={e => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              type="button"
              className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors duration-200 z-10 bg-white/20 rounded-full p-1.5"
              onClick={onClose}
              aria-label="关闭"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 弹窗标题 */}
            <div className="lead-form-header text-white py-8 px-8 rounded-t-xl">
              <h2 className="text-2xl font-bold">免费试用申请</h2>
              <p className="mt-2 text-white/90 font-light">填写以下信息，我们的顾问将尽快与您联系</p>
            </div>

            {submitSuccess ? (
              // 提交成功信息
              <div className="p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg success-icon"
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">提交成功！</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  感谢您的申请，我们的顾问将在<span className="text-primary font-medium">1-2个工作日</span>内与您联系。
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 px-8 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-300 font-medium"
                >
                  关闭窗口
                </button>
              </div>
            ) : (
              // 表单内容
              <form onSubmit={handleSubmit} className="p-8 lead-form-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {/* 姓名 */}
                  <div className="col-span-1 relative">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 form-label">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary form-input`}
                        placeholder="请输入您的姓名"
                      />
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5 absolute opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    {errors.name && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.name}</p>}
                  </div>

                  {/* 公司 */}
                  <div className="col-span-1 relative">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5 form-label">
                      公司名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary form-input`}
                      placeholder="请输入公司名称"
                    />
                    {errors.company && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.company}</p>}
                  </div>

                  {/* 职位 */}
                  <div className="col-span-1 relative">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1.5 form-label">
                      职位
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary form-input"
                      placeholder="请输入您的职位"
                    />
                  </div>

                  {/* 邮箱 */}
                  <div className="col-span-1 relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 form-label">
                      邮箱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary form-input`}
                      placeholder="请输入您的邮箱"
                    />
                    {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email}</p>}
                  </div>

                  {/* 手机号 */}
                  <div className="col-span-1 relative">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5 form-label">
                      手机号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary form-input`}
                      placeholder="请输入您的手机号"
                    />
                    {errors.phone && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.phone}</p>}
                  </div>

                  {/* 业务类型 */}
                  <div className="col-span-1 relative">
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1.5 form-label">
                      业务类型
                    </label>
                    <div className="relative">
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary form-input appearance-none"
                      >
                        <option value="">请选择业务类型</option>
                        <option value="国际货运">国际货运</option>
                        <option value="航空物流">航空物流</option>
                        <option value="供应链管理">供应链管理</option>
                        <option value="跨境电商">跨境电商</option>
                        <option value="其他">其他</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* 留言 */}
                  <div className="col-span-2 relative">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5 form-label">
                      留言
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary form-input"
                      placeholder="请输入您的需求或留言"
                    ></textarea>
                  </div>

                  {/* 同意条款 */}
                  <div className="col-span-2 mt-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded opacity-0 absolute"
                        />
                        <div
                          className={`custom-checkbox ${formData.agreeTerms ? 'checked' : ''}`}
                          onClick={() => setFormData({...formData, agreeTerms: !formData.agreeTerms})}
                        ></div>
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreeTerms" className={`font-medium ${errors.agreeTerms ? 'text-red-500' : 'text-gray-700'}`}>
                          我已阅读并同意 <a href="/terms" className="text-primary hover:text-secondary" target="_blank" rel="noopener noreferrer">服务条款</a> 和 <a href="/privacy" className="text-primary hover:text-secondary" target="_blank" rel="noopener noreferrer">隐私政策</a>
                        </label>
                      </div>
                    </div>
                    {errors.agreeTerms && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.agreeTerms}</p>}
                  </div>
                </div>

                {/* 提交按钮 */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 relative submit-button"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        提交中...
                      </>
                    ) : '提交申请'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadFormModal;
