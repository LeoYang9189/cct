import React, { useState } from 'react';
import { Modal, Form, Input, Button, Message } from '@arco-design/web-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faBuilding, faComments } from '@fortawesome/free-solid-svg-icons';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

interface LeadFormModalProps {
  visible: boolean;
  onClose: () => void;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      await form.validate();
      setLoading(true);
      
      // 模拟提交API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Message.success('咨询信息提交成功！我们会在24小时内联系您。');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 验证邮箱或电话至少填写一个
  const validateEmailOrPhone = (_: any, callback: any) => {
    const formData = form.getFieldsValue();
    if (!formData.email && !formData.phone) {
      callback('请至少填写邮箱或电话其中一项');
    } else {
      callback();
    }
  };

  return (
    <Modal
      title={
        <div className="text-center py-2">
          <h3 className="text-xl font-bold text-gray-900 mb-2">免费咨询方案</h3>
          <p className="text-sm text-gray-600">专业团队为您定制专属物流解决方案</p>
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{ width: '500px' }}
      className="lead-form-modal"
    >
      <div className="p-6">
        <Form
          form={form}
          layout="vertical"
          onSubmit={handleSubmit}
        >
          <FormItem
            label={
              <span className="flex items-center text-gray-700 font-medium">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                联系人姓名
              </span>
            }
            field="name"
            rules={[{ required: true, message: '请输入联系人姓名' }]}
          >
            <Input
              placeholder="请输入您的姓名"
              size="large"
              className="rounded-lg"
            />
          </FormItem>

          <FormItem
            label={
              <span className="flex items-center text-gray-700 font-medium">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-500" />
                联系电话
              </span>
            }
            field="phone"
            rules={[
              { validator: validateEmailOrPhone },
              { 
                validator: (value) => {
                  if (!value || /^1[3-9]\d{9}$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject('请输入正确的手机号码');
                }
              }
            ]}
          >
            <Input
              placeholder="请输入您的手机号码（与邮箱二选一）"
              size="large"
              className="rounded-lg"
            />
          </FormItem>

          <FormItem
            label={
              <span className="flex items-center text-gray-700 font-medium">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-purple-500" />
                邮箱地址
              </span>
            }
            field="email"
            rules={[
              { validator: validateEmailOrPhone },
              { 
                validator: (value) => {
                  if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject('请输入正确的邮箱格式');
                }
              }
            ]}
          >
            <Input
              placeholder="请输入您的邮箱地址（与电话二选一）"
              size="large"
              className="rounded-lg"
            />
          </FormItem>

          <FormItem
            label={
              <span className="flex items-center text-gray-700 font-medium">
                <FontAwesomeIcon icon={faBuilding} className="mr-2 text-orange-500" />
                公司名称
              </span>
            }
            field="company"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input
              placeholder="请输入您的公司名称"
              size="large"
              className="rounded-lg"
            />
          </FormItem>



          <FormItem
            label={
              <span className="flex items-center text-gray-700 font-medium">
                <FontAwesomeIcon icon={faComments} className="mr-2 text-cyan-500" />
                需求描述
              </span>
            }
            field="requirements"
          >
            <TextArea
              placeholder="请简单描述您的物流需求或业务场景，方便我们为您提供更精准的解决方案"
              rows={4}
              className="rounded-lg"
            />
          </FormItem>

          <div className="flex justify-center gap-6 pt-4">
            <Button
              type="secondary"
              size="large"
              className="px-8 rounded-lg"
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              type="primary"
              size="large"
              className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 border-0 rounded-lg"
              loading={loading}
              onClick={handleSubmit}
            >
              提交咨询
            </Button>
          </div>
        </Form>

        {/* 底部说明 */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            我们承诺保护您的隐私信息，仅用于业务咨询目的
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LeadFormModal; 