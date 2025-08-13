import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Grid,
  Modal,
  Message,
  Radio
} from '@arco-design/web-react';
import { IconEye, IconRefresh } from '@arco-design/web-react/icon';

const { Row, Col } = Grid;

/**
 * API设置页面组件
 * 提供API相关的配置和管理功能
 */
const ApiSettings: React.FC = () => {
  // const [form] = Form.useForm();
  const [callbackForm] = Form.useForm();
  const [ipForm] = Form.useForm();
  // const [loading, setLoading] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [ipLoading, setIpLoading] = useState(false);
  const [showSK, setShowSK] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetSuccessModalVisible, setResetSuccessModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('phone'); // 'phone' or 'email'
  const [newSecretKey, setNewSecretKey] = useState('');

  // 模拟的AK/SK数据
  const [akskData] = useState({
    accessKey: 'AKIAIOSFODNN7EXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
  });

  // 模拟的联系方式数据
  const contactInfo = {
    phone: '138****8888',
    email: 'user****@example.com'
  };

  /**
   * 查看SK
   */
  const handleViewSK = () => {
    setShowSK(!showSK);
  };

  /**
   * 发送验证码
   */
  const handleSendVerificationCode = async () => {
    setSendingCode(true);
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      const target = verificationMethod === 'phone' ? '手机' : '邮箱';
      Message.success(`验证码已发送到您的${target}`);
    } catch (error) {
      Message.error('发送验证码失败');
    } finally {
      setSendingCode(false);
    }
  };

  /**
   * 重置AK/SK
   */
  const handleReset = async () => {
    if (!verificationCode) {
      Message.error('请输入验证码');
      return;
    }
    
    try {
      // 模拟验证码验证和重置
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成新的SK
      const newSK = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' + Math.random().toString(36).substring(2, 8);
      setNewSecretKey(newSK);
      
      // 关闭重置弹窗，显示成功弹窗
      setResetModalVisible(false);
      setVerificationCode('');
      setResetSuccessModalVisible(true);
    } catch (error) {
      Message.error('重置失败');
    }
  };

  /**
   * 保存回调地址
   * @param values 表单值
   */
  const handleSaveCallback = async (values: any) => {
    setCallbackLoading(true);
    try {
      console.log('保存回调地址:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      Message.success('回调地址保存成功');
    } catch (error) {
      console.error('保存失败:', error);
      Message.error('保存失败');
    } finally {
      setCallbackLoading(false);
    }
  };

  /**
   * 保存IP设置
   * @param values 表单值
   */
  const handleSaveIP = async (values: any) => {
    setIpLoading(true);
    try {
      console.log('保存IP设置:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      Message.success('IP设置保存成功');
    } catch (error) {
      console.error('保存失败:', error);
      Message.error('保存失败');
    } finally {
      setIpLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ width: '100%' }}>
        {/* 安全设置 */}
        <Card 
          title="安全设置"
          style={{ marginBottom: '24px' }}
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Access Key (AK)">
                  <Input 
                    value={akskData.accessKey}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Secret Key (SK)">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Input 
                      value={showSK ? akskData.secretKey : '••••••••••••••••••••••••••••••••'}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5', width: '300px' }}
                    />
                    <Button 
                      type="primary"
                      icon={<IconEye />}
                      onClick={handleViewSK}
                    >
                      {showSK ? '隐藏' : '查看'}
                    </Button>
                    <Button 
                      icon={<IconRefresh />}
                      onClick={() => setResetModalVisible(true)}
                      status="warning"
                    >
                      重置
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* 回调地址设置 */}
        <Card 
          title="回调地址设置"
          style={{ marginBottom: '24px' }}
        >
          <Form
            form={callbackForm}
            layout="vertical"
            onSubmit={handleSaveCallback}
          >
            <Form.Item label="正式回调地址：" field="callbackUrl">
              <Input.TextArea 
                rows={4}
                placeholder=""
              />
            </Form.Item>

            <Form.Item label="测试回调地址：" field="testCallbackUrl">
              <Input.TextArea 
                rows={4}
                placeholder=""
              />
            </Form.Item>

            <div style={{ textAlign: 'left' }}>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={callbackLoading}
              >
                保存回调地址
              </Button>
            </div>
          </Form>
        </Card>

        {/* IP设置 */}
        <Card 
          title="IP设置"
          style={{ marginBottom: '24px' }}
        >
          <Form
            form={ipForm}
            layout="vertical"
            onSubmit={handleSaveIP}
          >
            <Form.Item 
              label="白名单IP地址（一行一个）：" 
              field="ipWhitelist"
              extra="请输入需要加入白名单的IP地址，每行一个IP地址"
            >
              <Input.TextArea 
                rows={8}
                placeholder="192.168.1.1&#10;10.0.0.1&#10;172.16.0.1"
              />
            </Form.Item>

            <div style={{ textAlign: 'left' }}>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={ipLoading}
              >
                保存IP设置
              </Button>
            </div>
          </Form>
        </Card>

        {/* 重置AK/SK模态框 */}
        <Modal
          title="重置AK/SK"
          visible={resetModalVisible}
          onCancel={() => {
            setResetModalVisible(false);
            setVerificationCode('');
          }}
          footer={[
            <Button key="cancel" onClick={() => setResetModalVisible(false)}>
              取消
            </Button>,
            <Button 
              key="confirm" 
              type="primary" 
              onClick={handleReset}
              loading={sendingCode}
            >
              确认重置
            </Button>
          ]}
        >
          <div style={{ marginBottom: '16px' }}>
            <p>重置后将生成新的AK/SK，原有的AK/SK将失效。请选择接收验证码的方式：</p>
          </div>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Radio.Group 
                value={verificationMethod} 
                onChange={setVerificationMethod}
                style={{ marginBottom: '16px' }}
              >
                <Radio value="phone">手机号接收</Radio>
                <Radio value="email">邮箱接收</Radio>
              </Radio.Group>
            </div>
            
            <div>
              <Input
                placeholder={verificationMethod === 'phone' ? '手机号' : '邮箱'}
                value={verificationMethod === 'phone' ? contactInfo.phone : contactInfo.email}
                disabled
                style={{ width: '200px', marginRight: '8px', backgroundColor: '#f5f5f5' }}
              />
            </div>
            
            <div>
              <Input
                placeholder="请输入验证码"
                value={verificationCode}
                onChange={setVerificationCode}
                style={{ width: '200px', marginRight: '8px' }}
              />
              <Button 
                onClick={handleSendVerificationCode}
                loading={sendingCode}
              >
                发送验证码
              </Button>
            </div>
          </Space>
        </Modal>

        {/* 重置成功模态框 */}
        <Modal
          title="重置成功"
          visible={resetSuccessModalVisible}
          onCancel={() => setResetSuccessModalVisible(false)}
          footer={[
            <Button 
              key="confirm" 
              type="primary" 
              onClick={() => setResetSuccessModalVisible(false)}
            >
              我知道了
            </Button>
          ]}
        >
          <div style={{ padding: '16px 0' }}>
            <p style={{ color: '#52c41a', fontWeight: 'bold', marginBottom: '16px' }}>
              重置成功！新SK 为：
            </p>
            <div style={{ 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              padding: '12px', 
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <code style={{ color: '#389e0d', fontFamily: 'monospace' }}>
                {newSecretKey}
              </code>
            </div>
            <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
              请妥善保管，绝不可泄露！
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ApiSettings;