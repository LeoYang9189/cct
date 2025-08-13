import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Space, 
  Message,
  Switch,
  Radio,
  Upload,
  Typography,
  Modal
} from '@arco-design/web-react';
import { 
  IconSave,
  IconRefresh,
  IconUpload,
  IconPlus,
  IconEdit
} from '@arco-design/web-react/icon';

const { Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const PersonalizationConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('website');
  const [form] = Form.useForm();
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [footerLogoFileList, setFooterLogoFileList] = useState<any[]>([]);
  
  // 自定义域名相关状态
  const [customDomain, setCustomDomain] = useState('abc123def456'); // 默认10位随机域名前缀
  const [domainEditing, setDomainEditing] = useState(false);
  const [tempDomain, setTempDomain] = useState('');
  const [domainWarningVisible, setDomainWarningVisible] = useState(false);
  const [domainCheckVisible, setDomainCheckVisible] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState(false);
  
  // 社交媒体配置状态
  const [socialMediaSettings, setSocialMediaSettings] = useState({
    wechat: { enabled: false, type: 'qr', value: '' },
    douyin: { enabled: false, type: 'qr', value: '' },
    tiktok: { enabled: false, type: 'link', value: '' },
    xiaohongshu: { enabled: false, type: 'qr', value: '' },
    linkedin: { enabled: false, type: 'link', value: '' },
    facebook: { enabled: false, type: 'link', value: '' },
    twitter: { enabled: false, type: 'link', value: '' },
    wecom: { enabled: false, type: 'qr', value: '' }
  });

  const handleSave = () => {
    form.validate().then((values: any) => {
      console.log('保存的配置信息:', values);
      Message.success('配置保存成功！');
    }).catch((error: any) => {
      console.error('表单验证失败:', error);
    });
  };

  const handleReset = () => {
    form.resetFields();
    Message.info('配置已重置为默认值');
  };

  const handleLogoUpload = (info: any, type: 'header' | 'footer') => {
    const { fileList } = info;
    if (type === 'header') {
      setLogoFileList(fileList);
    } else {
      setFooterLogoFileList(fileList);
    }
  };

  const handleSocialMediaChange = (platform: string, field: string, value: any) => {
    setSocialMediaSettings(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // 域名相关处理函数
  const handleDomainEdit = () => {
    setDomainWarningVisible(true);
  };

  const handleDomainWarningConfirm = () => {
    setDomainWarningVisible(false);
    setTempDomain(customDomain);
    setDomainEditing(true);
  };

  const handleDomainWarningCancel = () => {
    setDomainWarningVisible(false);
  };

  const validateDomain = (domain: string) => {
    // 域名前缀校验规则：至少4位字符，只能字母和数字组合
    const regex = /^[a-zA-Z0-9]{4,}$/;
    return regex.test(domain);
  };

  const handleDomainCheck = () => {
    if (!validateDomain(tempDomain)) {
      Message.error('域名前缀至少4位字符，只能包含字母和数字');
      return;
    }

    // 模拟域名可用性检查
    const isAvailable = Math.random() > 0.5; // 50%概率可用
    setDomainAvailable(isAvailable);
    setDomainCheckVisible(true);
  };

  const handleDomainCheckClose = () => {
    setDomainCheckVisible(false);
  };

  const handleDomainConfirm = () => {
    setCustomDomain(tempDomain);
    setDomainEditing(false);
    setTempDomain('');
    setDomainCheckVisible(false);
    Message.success('域名修改成功！');
  };

  const handleDomainCancel = () => {
    setDomainEditing(false);
    setTempDomain('');
  };

  const renderSocialMediaItem = (platform: string, label: string) => {
    const setting = socialMediaSettings[platform as keyof typeof socialMediaSettings];
    
    return (
      <div key={platform} style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 500 }}>{label}</span>
          <Switch 
            checked={setting.enabled}
            onChange={(checked) => handleSocialMediaChange(platform, 'enabled', checked)}
          />
        </div>
        {setting.enabled && (
          <div>
            <Radio.Group 
              value={setting.type}
              onChange={(value) => handleSocialMediaChange(platform, 'type', value)}
              style={{ marginBottom: 8 }}
            >
              <Radio value="qr">二维码</Radio>
              <Radio value="link">跳转链接</Radio>
            </Radio.Group>
            {setting.type === 'qr' ? (
              <Upload
                listType="picture-card"
                limit={1}
                beforeUpload={() => false}
              >
                <div>
                  <IconPlus />
                  <div style={{ marginTop: 8 }}>上传二维码</div>
                </div>
              </Upload>
            ) : (
              <Input 
                placeholder="请输入跳转链接"
                value={setting.value}
                onChange={(value) => handleSocialMediaChange(platform, 'value', value)}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const renderWebsiteConfig = () => {
    return (
      <div>
        <Card 
          style={{ marginBottom: 20 }}
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
            配置网站的基本信息和展示内容
          </Text>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              siteName: '物流控制塔系统',
              headerLogoType: 'logo_only',
              footerLogoType: 'logo_only',
              skinTheme: 'business',
              showCustomerPhone: true,
              showCustomerEmail: true
            }}
          >
            {/* 网站皮肤设置 */}
            <Card size="small" title="网站皮肤设置" style={{ marginBottom: 16 }}>
              <Form.Item 
                field="skinTheme" 
                label="网站模板"
                tooltip="选择网站的整体视觉风格"
              >
                <Radio.Group type="button">
                  <Radio value="business">简约商务</Radio>
                  <Radio value="premium">高端尊享</Radio>
                  <Radio value="fresh">清新现代</Radio>
                  <Radio value="tech">未来科技</Radio>
                </Radio.Group>
              </Form.Item>
            </Card>

            {/* 基础信息设置 */}
            <Card size="small" title="基础信息设置" style={{ marginBottom: 16 }}>
              {/* 自定义域名设置 */}
              <Form.Item label="自定义域名设置">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {domainEditing ? (
                    <>
                      <Input
                        value={tempDomain}
                        onChange={setTempDomain}
                        placeholder="请输入域名前缀"
                        style={{ width: 200 }}
                        maxLength={20}
                      />
                      <span style={{ color: '#666' }}>.walltechsystem.com</span>
                      <Button 
                        type="outline" 
                        size="small"
                        onClick={handleDomainCheck}
                        disabled={!tempDomain || !validateDomain(tempDomain)}
                      >
                        校验可用性
                      </Button>
                      <Button 
                        size="small"
                        onClick={handleDomainCancel}
                      >
                        取消
                      </Button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '4px 8px', borderRadius: 4 }}>
                        {customDomain}.walltechsystem.com
                      </span>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<IconEdit />}
                        onClick={handleDomainEdit}
                      >
                        编辑
                      </Button>
                    </>
                  )}
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', 
                  border: '1px solid #1976d2', 
                  borderRadius: 6, 
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span style={{ color: '#1976d2', fontSize: 14 }}>💡</span>
                  <Text style={{ color: '#1976d2', fontSize: 13, fontWeight: 500 }}>
                    控制塔系统支持使用您自有域名，如有需要，请联系客服支持人员。
                  </Text>
                </div>
              </Form.Item>

              <Form.Item field="siteName" label="网站名称">
                <Input placeholder="请输入网站名称" />
              </Form.Item>

              <Form.Item label="Header区Logo设置">
                <Form.Item field="headerLogoType" style={{ marginBottom: 12 }}>
                  <Radio.Group>
                    <Radio value="logo_only">单独Logo</Radio>
                    <Radio value="logo_with_slogan">Logo + 标语</Radio>
                  </Radio.Group>
                </Form.Item>
                <Upload
                  fileList={logoFileList}
                  onChange={(fileList) => handleLogoUpload({ fileList }, 'header')}
                  beforeUpload={() => false}
                  limit={1}
                >
                  <Button icon={<IconUpload />}>上传Header Logo</Button>
                </Upload>
                <Form.Item field="headerSlogan" style={{ marginTop: 8 }}>
                  <Input placeholder="Logo标语（选择Logo+标语时显示）" />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Footer区Logo设置">
                <Form.Item field="footerLogoType" style={{ marginBottom: 12 }}>
                  <Radio.Group>
                    <Radio value="logo_only">单独Logo</Radio>
                    <Radio value="logo_with_slogan">Logo + 标语</Radio>
                  </Radio.Group>
                </Form.Item>
                <Upload
                  fileList={footerLogoFileList}
                  onChange={(fileList) => handleLogoUpload({ fileList }, 'footer')}
                  beforeUpload={() => false}
                  limit={1}
                >
                  <Button icon={<IconUpload />}>上传Footer Logo</Button>
                </Upload>
                <Form.Item field="footerSlogan" style={{ marginTop: 8 }}>
                  <Input placeholder="Logo标语（选择Logo+标语时显示）" />
                </Form.Item>
              </Form.Item>

              <Form.Item field="copyright" label="版权信息">
                <TextArea autoSize={{ minRows: 2 }} placeholder="请输入版权信息" />
              </Form.Item>

              <Form.Item field="privacyPolicy" label="隐私政策链接">
                <Input placeholder="请输入隐私政策页面链接" />
              </Form.Item>

              <Form.Item field="termsOfService" label="服务条款链接">
                <Input placeholder="请输入服务条款页面链接" />
              </Form.Item>
            </Card>

            {/* 社交媒体设置 */}
            <Card size="small" title="社交媒体设置" style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                {renderSocialMediaItem('wechat', '微信公众号')}
                {renderSocialMediaItem('douyin', '抖音')}
                {renderSocialMediaItem('tiktok', 'TikTok')}
                {renderSocialMediaItem('xiaohongshu', '小红书')}
                {renderSocialMediaItem('linkedin', '领英')}
                {renderSocialMediaItem('facebook', 'Facebook')}
                {renderSocialMediaItem('twitter', 'X (Twitter)')}
                {renderSocialMediaItem('wecom', '企业微信')}
              </div>
            </Card>

            {/* 备案信息设置 */}
            <Card size="small" title="备案信息设置" style={{ marginBottom: 16 }}>
              <Form.Item label="管局备案信息">
                <Input.Group>
                  <Form.Item field="icpNumber" style={{ width: '50%', marginBottom: 0, marginRight: 8 }}>
                    <Input placeholder="备案编号" />
                  </Form.Item>
                  <Form.Item field="icpLink" style={{ width: '50%', marginBottom: 0 }}>
                    <Input placeholder="备案查询链接" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Form.Item label="公安备案信息">
                <Input.Group>
                  <Form.Item field="policeNumber" style={{ width: '50%', marginBottom: 0, marginRight: 8 }}>
                    <Input placeholder="公安备案编号" />
                  </Form.Item>
                  <Form.Item field="policeLink" style={{ width: '50%', marginBottom: 0 }}>
                    <Input placeholder="公安备案查询链接" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Card>

            {/* 联系信息设置 */}
            <Card size="small" title="联系信息设置" style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>客服电话</span>
                    <Form.Item field="showCustomerPhone" triggerPropName="checked" style={{ margin: 0 }}>
                      <Switch />
                    </Form.Item>
                  </div>
                  <Form.Item field="customerPhone">
                    <Input placeholder="请输入客服电话" />
                  </Form.Item>
                </div>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>客服邮箱</span>
                    <Form.Item field="showCustomerEmail" triggerPropName="checked" style={{ margin: 0 }}>
                      <Switch />
                    </Form.Item>
                  </div>
                  <Form.Item field="customerEmail">
                    <Input placeholder="请输入客服邮箱" />
                  </Form.Item>
                </div>
              </div>
            </Card>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<IconSave />}
                  onClick={handleSave}
                >
                  保存配置
                </Button>
                <Button 
                  icon={<IconRefresh />}
                  onClick={handleReset}
                >
                  重置
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    );
  };

  const renderFieldsConfig = () => {
    return (
      <Card title="页面字段配置">
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          页面字段配置功能开发中...
        </div>
      </Card>
    );
  };

  const renderAIConfig = () => {
    return (
      <Card title="AI助手配置">
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          AI助手配置功能开发中...
        </div>
      </Card>
    );
  };



  return (
    <div style={{ padding: 24 }}>
      <Card title="个性化配置">
        <Tabs 
          activeTab={activeTab} 
          onChange={setActiveTab}
          type="card"
        >
          <TabPane key="website" title="网站基本信息">
            {renderWebsiteConfig()}
          </TabPane>
          <TabPane key="fields" title="页面字段配置">
            {renderFieldsConfig()}
          </TabPane>
          <TabPane key="ai" title="AI助手配置">
            {renderAIConfig()}
          </TabPane>
        </Tabs>
      </Card>

      {/* 域名修改警告弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #faad14, #ff7875)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16
            }}>
              ⚠️
            </div>
            <span style={{ fontSize: 16, fontWeight: 600 }}>域名修改提醒</span>
          </div>
        }
        visible={domainWarningVisible}
        onOk={handleDomainWarningConfirm}
        onCancel={handleDomainWarningCancel}
        okText="确认修改"
        cancelText="取消"
        style={{ borderRadius: 12 }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, #fff7e6, #fffbe6)',
            border: '1px solid #faad14',
            borderRadius: 8,
            padding: '16px 20px',
            marginBottom: 20
          }}>
            <p style={{ 
              color: '#d46b08', 
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 8,
              lineHeight: 1.5
            }}>
              域名每6个月仅可修改一次，请慎重操作
            </p>
            <p style={{ 
              color: '#8c8c8c', 
              fontSize: 13,
              marginBottom: 0,
              lineHeight: 1.4
            }}>
              修改后将立即生效，请确保新域名符合您的需求
            </p>
          </div>
          <p style={{ color: '#595959', fontSize: 14, marginBottom: 0 }}>
            确认要修改域名吗？
          </p>
        </div>
      </Modal>

      {/* 域名可用性检查结果弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: domainAvailable 
                ? 'linear-gradient(135deg, #52c41a, #73d13d)' 
                : 'linear-gradient(135deg, #ff4d4f, #ff7875)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              color: 'white',
              fontWeight: 'bold'
            }}>
              {domainAvailable ? '✓' : '✗'}
            </div>
            <span style={{ fontSize: 16, fontWeight: 600 }}>域名可用性检查</span>
          </div>
        }
        visible={domainCheckVisible}
        onOk={domainAvailable ? handleDomainConfirm : handleDomainCheckClose}
        onCancel={handleDomainCheckClose}
        okText={domainAvailable ? "确认修改" : "关闭"}
        cancelText={domainAvailable ? "取消" : undefined}
        cancelButtonProps={domainAvailable ? {} : { style: { display: 'none' } }}
        style={{ borderRadius: 12 }}
      >
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          {domainAvailable ? (
            <div>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #f6ffed, #d9f7be)',
                border: '3px solid #52c41a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 32,
                color: '#52c41a'
              }}>
                ✓
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #f6ffed, #d9f7be)',
                border: '1px solid #52c41a',
                borderRadius: 8,
                padding: '16px 20px',
                marginBottom: 16
              }}>
                <p style={{ 
                  color: '#389e0d', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  marginBottom: 8 
                }}>
                  🎉 恭喜您，域名可用！
                </p>
                <p style={{ 
                  color: '#52c41a', 
                  fontSize: 14,
                  marginBottom: 0,
                  fontFamily: 'monospace',
                  background: 'rgba(255,255,255,0.8)',
                  padding: '4px 8px',
                  borderRadius: 4,
                  display: 'inline-block'
                }}>
                  {tempDomain}.walltechsystem.com
                </p>
              </div>
              <p style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 0 }}>
                点击"确认修改"完成域名设置
              </p>
            </div>
          ) : (
            <div>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #fff2f0, #ffccc7)',
                border: '3px solid #ff4d4f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 32,
                color: '#ff4d4f'
              }}>
                ✗
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #fff2f0, #ffccc7)',
                border: '1px solid #ff4d4f',
                borderRadius: 8,
                padding: '16px 20px',
                marginBottom: 16
              }}>
                <p style={{ 
                  color: '#cf1322', 
                  fontSize: 18, 
                  fontWeight: 600, 
                  marginBottom: 8 
                }}>
                  😞 抱歉，该域名已被使用
                </p>
                <p style={{ 
                  color: '#ff4d4f', 
                  fontSize: 14,
                  marginBottom: 0,
                  fontFamily: 'monospace',
                  background: 'rgba(255,255,255,0.8)',
                  padding: '4px 8px',
                  borderRadius: 4,
                  display: 'inline-block'
                }}>
                  {tempDomain}.walltechsystem.com
                </p>
              </div>
              <p style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 0 }}>
                请尝试其他域名前缀
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PersonalizationConfig;