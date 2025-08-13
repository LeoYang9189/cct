import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Tabs, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Message,
  Breadcrumb,
  Upload,
  Cascader,
  Image,
  Modal,
  Tag,
  Table,
  Avatar
} from '@arco-design/web-react';
import { 
  IconArrowLeft,
  IconSave,
  IconUpload,
  IconEye,
  IconFile,
  IconUser,
  IconPlus,
  IconStarFill,
  IconPhone,
  IconEmail,
  IconEdit,
  IconDelete,
  IconStar
} from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 行政区划数据（简化版）
const addressOptions = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          {
            value: '朝阳区',
            label: '朝阳区',
            children: [
              { value: '建国门外街道', label: '建国门外街道' },
              { value: '朝外街道', label: '朝外街道' },
              { value: '呼家楼街道', label: '呼家楼街道' }
            ]
          },
          {
            value: '海淀区',
            label: '海淀区',
            children: [
              { value: '中关村街道', label: '中关村街道' },
              { value: '学院路街道', label: '学院路街道' }
            ]
          }
        ]
      }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          {
            value: '浦东新区',
            label: '浦东新区',
            children: [
              { value: '陆家嘴街道', label: '陆家嘴街道' },
              { value: '张江镇', label: '张江镇' }
            ]
          },
          {
            value: '黄浦区',
            label: '黄浦区',
            children: [
              { value: '南京东路街道', label: '南京东路街道' },
              { value: '外滩街道', label: '外滩街道' }
            ]
          }
        ]
      }
    ]
  },
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          {
            value: '南山区',
            label: '南山区',
            children: [
              { value: '粤海街道', label: '粤海街道' },
              { value: '科技园街道', label: '科技园街道' }
            ]
          },
          {
            value: '福田区',
            label: '福田区',
            children: [
              { value: '园岭街道', label: '园岭街道' },
              { value: '福田街道', label: '福田街道' }
            ]
          }
        ]
      },
      {
        value: '广州市',
        label: '广州市',
        children: [
          {
            value: '天河区',
            label: '天河区',
            children: [
              { value: '珠江新城街道', label: '珠江新城街道' },
              { value: '体育西路街道', label: '体育西路街道' }
            ]
          }
        ]
      }
    ]
  }
];

// interface CompanyFormData {
//   name: string;
//   englishName: string;
//   businessLicense: string;
//   description: string;
//   country: string;
//   province: string;
//   city: string;
//   district: string;
//   street: string;
//   detailAddress: string;
//   businessLicenseFile?: string;
//   businessLicenseUploadTime?: string;
// }

interface ContactPerson {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

interface FinancialInfo {
  // 开票信息
  invoiceCompanyName: string;
  invoiceTaxNumber: string;
  invoiceAddress: string;
  invoicePhone: string;
  invoiceBankName: string;
  invoiceBankAccount: string;
  
  // 人民币账户
  cnyBankName: string;
  cnyBankAccount: string;
  cnyAccountName: string;
  cnySwiftCode: string;
  cnyBankAddress: string;
  
  // 美金账户
  usdBankName: string;
  usdBankAccount: string;
  usdAccountName: string;
  usdSwiftCode: string;
  usdBankAddress: string;
  
  // 对账联系人ID
  reconciliationContactId: string;
}

const CompanyCertification: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [financialForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [businessLicenseModalVisible, setBusinessLicenseModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactPerson | null>(null);
  const [financialEditMode, setFinancialEditMode] = useState(false);
  const [setDefaultModalVisible, setSetDefaultModalVisible] = useState(false);
  const [targetDefaultContact, setTargetDefaultContact] = useState<ContactPerson | null>(null);
  const [deleteContactModalVisible, setDeleteContactModalVisible] = useState(false);
  const [targetDeleteContact, setTargetDeleteContact] = useState<ContactPerson | null>(null);
  
  // 联系人数据
  const [contacts, setContacts] = useState<ContactPerson[]>([
    {
      id: '1',
      name: '张经理',
      title: '总经理',
      phone: '13800138001',
      email: 'zhangmanager@company.com',
      isDefault: true
    }
  ]);

  // 提交申请确认弹窗
  const [submitConfirmVisible, setSubmitConfirmVisible] = useState(false);

  // 企业重名演示弹窗
  const [duplicateNameModalVisible, setDuplicateNameModalVisible] = useState(false);

  // 财务信息数据
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    // 开票信息
    invoiceCompanyName: '',
    invoiceTaxNumber: '',
    invoiceAddress: '',
    invoicePhone: '',
    invoiceBankName: '',
    invoiceBankAccount: '',
    
    // 人民币账户
    cnyBankName: '',
    cnyBankAccount: '',
    cnyAccountName: '',
    cnySwiftCode: '',
    cnyBankAddress: '',
    
    // 美金账户
    usdBankName: '',
    usdBankAccount: '',
    usdAccountName: '',
    usdSwiftCode: '',
    usdBankAddress: '',
    
    // 对账联系人ID
    reconciliationContactId: '1'
  });

  // 初始化表单数据
  useEffect(() => {
    form.setFieldsValue({
      name: '',
      englishName: '',
      businessLicense: '',
      description: '',
      country: '中国',
      province: '',
      city: '',
      district: '',
      street: '',
      detailAddress: '',
      businessLicenseFile: '',
      businessLicenseUploadTime: ''
    });

    // 初始化财务表单
    financialForm.setFieldsValue(financialInfo);
  }, [form, financialForm, financialInfo]);

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { text: '待审核', color: 'orange' },
      active: { text: '已认证', color: 'green' },
      rejected: { text: '审核拒绝', color: 'red' },
      inactive: { text: '已停用', color: 'gray' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { text: '未知', color: 'blue' };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 保存表单
  // const handleSave = async () => {
  //   setSubmitConfirmVisible(true);
  // };

  // 确认提交申请
  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      // 这里应该是提交API调用
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API请求
      
      Message.success('企业认证申请已提交，请等待审核');
      setSubmitConfirmVisible(false);
      
      // 跳转到企业管理页面
      navigate('/controltower/company-profile');
    } catch (error) {
      Message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 营业执照上传
  const handleBusinessLicenseUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const uploadTime = new Date().toLocaleString('zh-CN');
    form.setFieldsValue({
      businessLicenseFile: url,
      businessLicenseUploadTime: uploadTime
    });
    Message.success('营业执照上传成功');
    return false; // 阻止默认上传行为
  };

  // 营业执照预览
  const handleBusinessLicensePreview = () => {
    setBusinessLicenseModalVisible(true);
  };

  // 添加联系人
  const handleAddContact = () => {
    setEditingContact(null);
    contactForm.resetFields();
    setContactModalVisible(true);
  };

  // 编辑联系人
  const handleEditContact = (contact: ContactPerson) => {
    setEditingContact(contact);
    contactForm.setFieldsValue(contact);
    setContactModalVisible(true);
  };

  // 删除联系人
  const handleDeleteContact = (contactId: string) => {
    const targetContact = contacts.find(c => c.id === contactId);
    if (targetContact) {
      setTargetDeleteContact(targetContact);
      setDeleteContactModalVisible(true);
    }
  };

  // 设置默认联系人
  const handleSetDefaultContact = (contactId: string) => {
    const targetContact = contacts.find(c => c.id === contactId);
    if (targetContact) {
      setTargetDefaultContact(targetContact);
      setSetDefaultModalVisible(true);
    }
  };

  // 提交联系人表单
  const handleContactSubmit = async () => {
    try {
      await contactForm.validate();
      const values = await contactForm.getFields();
      
      if (editingContact) {
        // 编辑联系人
        setContacts(prev => prev.map(c => 
          c.id === editingContact.id ? { ...c, ...values } : c
        ));
        Message.success('联系人信息已更新');
      } else {
        // 新增联系人
        const newContact: ContactPerson = {
          id: Date.now().toString(),
          name: values.name,
          title: values.title,
          phone: values.phone,
          email: values.email,
          isDefault: contacts.length === 0 // 如果是第一个联系人，设为默认
        };
        setContacts(prev => [...prev, newContact]);
        Message.success('联系人已添加');
      }
      
      setContactModalVisible(false);
      contactForm.resetFields();
      setEditingContact(null);
    } catch (error) {
      console.error('联系人表单验证失败:', error);
    }
  };

  // 财务信息保存
  const handleFinancialSave = async () => {
    try {
      await financialForm.validate();
      const values = financialForm.getFieldsValue();
      setFinancialInfo(values as FinancialInfo);
      setFinancialEditMode(false);
      Message.success('财务信息已保存');
    } catch (error) {
      console.error('财务表单验证失败:', error);
      Message.error('请检查财务信息填写是否正确');
    }
  };

  // 编辑财务信息
  const handleFinancialEdit = () => {
    setFinancialEditMode(true);
  };

  // 取消编辑财务信息
  const handleFinancialCancel = () => {
    financialForm.setFieldsValue(financialInfo);
    setFinancialEditMode(false);
  };

  // 确认设置默认联系人
  const handleConfirmSetDefault = () => {
    if (targetDefaultContact) {
      setContacts(prev => prev.map(c => ({
        ...c,
        isDefault: c.id === targetDefaultContact.id
      } as ContactPerson)));
      setSetDefaultModalVisible(false);
      setTargetDefaultContact(null);
      Message.success('已设置默认联系人');
    }
  };

  // 一键复制功能（开票信息 -> 人民币账户）
  const copyFromInvoiceToCny = () => {
    const invoiceData = financialForm.getFieldsValue();
    financialForm.setFieldsValue({
      cnyBankName: invoiceData.invoiceBankName,
      cnyBankAccount: invoiceData.invoiceBankAccount,
      cnyAccountName: invoiceData.invoiceCompanyName,
      cnyBankAddress: invoiceData.invoiceAddress
    });
    Message.success('已复制开票信息到人民币账户');
  };

  // 一键复制功能（人民币账户 -> 开票信息）
  const copyFromCnyToInvoice = () => {
    const cnyData = financialForm.getFieldsValue();
    financialForm.setFieldsValue({
      invoiceBankName: cnyData.cnyBankName,
      invoiceBankAccount: cnyData.cnyBankAccount,
      invoiceCompanyName: cnyData.cnyAccountName,
      invoiceAddress: cnyData.cnyBankAddress
    });
    Message.success('已复制人民币账户信息到开票信息');
  };

  // 更新对账联系人
  const updateReconciliationContact = (contactId: string) => {
    setFinancialInfo(prev => ({
      ...prev,
      reconciliationContactId: contactId
    }));
    financialForm.setFieldValue('reconciliationContactId', contactId);
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      Message.success(`${label}已复制到剪贴板`);
    }).catch(() => {
      Message.error('复制失败，请手动复制');
    });
  };

  // 确认删除联系人
  const handleConfirmDeleteContact = () => {
    if (targetDeleteContact) {
      setContacts(prev => prev.filter(c => c.id !== targetDeleteContact.id));
      setDeleteContactModalVisible(false);
      setTargetDeleteContact(null);
      Message.success('联系人已删除');
    }
  };

  // 演示企业重名
  const handleDemoCompanyDuplicate = () => {
    setDuplicateNameModalVisible(true);
  };

  // 处理企业重名弹窗关闭
  const handleDuplicateNameClose = () => {
    setDuplicateNameModalVisible(false);
    // 跳转到企业信息页面的未认证状态
    navigate('/controltower/company-profile?from=certification');
  };

  // 基本信息Tab
  const BasicInfoTab = () => (
    <Card>
      {/* 企业状态标签 */}
      <div style={{ marginBottom: '24px' }}>
        <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>企业状态：</Text>
        {getStatusTag('pending')}
      </div>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            label="企业名称"
            field="name"
            rules={[
              { required: true, message: '请输入企业名称' }
            ]}
          >
            <Input placeholder="请输入企业名称" />
          </Form.Item>

          <Form.Item
            label="英文名称"
            field="englishName"
            rules={[
              { required: true, message: '请输入企业英文名称' }
            ]}
          >
            <Input placeholder="请输入企业英文名称" />
          </Form.Item>
        </div>

        <Form.Item
          label="营业执照号"
          field="businessLicense"
          rules={[
            { required: true, message: '请输入营业执照号' },
            {
              validator: (value, callback) => {
                if (value && !/^[0-9A-Z]{18}$/.test(value)) {
                  callback('请输入有效的营业执照号（18位数字和字母）');
                } else {
                  callback();
                }
              }
            }
          ]}
        >
          <Input placeholder="请输入18位营业执照号" />
        </Form.Item>

        {/* 营业执照文件 */}
        <Form.Item
          label="营业执照"
          field="businessLicenseFile"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {form.getFieldValue('businessLicenseFile') ? (
              <div style={{ 
                padding: '12px', 
                border: '1px solid #E5E6EB', 
                borderRadius: '6px',
                backgroundColor: '#F7F8FA'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconFile style={{ color: '#165DFF' }} />
                  <div style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>营业执照.jpg</Text>
                    <div style={{ fontSize: '12px', color: '#86909C' }}>
                      上传时间: {form.getFieldValue('businessLicenseUploadTime') || '未知'}
                    </div>
                  </div>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<IconEye />}
                    onClick={handleBusinessLicensePreview}
                  >
                    预览
                  </Button>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<IconUpload />}
                    onClick={() => {/* 重新上传逻辑 */}}
                  >
                    替换
                  </Button>
                </div>
              </div>
            ) : (
              <Upload
                accept="image/*"
                beforeUpload={handleBusinessLicenseUpload}
                showUploadList={false}
              >
                <Button type="outline" icon={<IconUpload />}>
                  上传营业执照
                </Button>
              </Upload>
            )}
          </div>
        </Form.Item>

        {/* 国家和地址信息 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px' }}>
          <Form.Item
            label="国家"
            field="country"
            rules={[
              { required: true, message: '请选择国家' }
            ]}
          >
            <Select placeholder="请选择国家" defaultValue="中国">
              <Option value="中国">中国</Option>
              <Option value="美国">美国</Option>
              <Option value="日本">日本</Option>
              <Option value="韩国">韩国</Option>
              <Option value="新加坡">新加坡</Option>
              <Option value="马来西亚">马来西亚</Option>
              <Option value="泰国">泰国</Option>
              <Option value="印度尼西亚">印度尼西亚</Option>
              <Option value="菲律宾">菲律宾</Option>
              <Option value="越南">越南</Option>
              <Option value="德国">德国</Option>
              <Option value="英国">英国</Option>
              <Option value="法国">法国</Option>
              <Option value="荷兰">荷兰</Option>
              <Option value="意大利">意大利</Option>
              <Option value="澳大利亚">澳大利亚</Option>
              <Option value="加拿大">加拿大</Option>
              <Option value="巴西">巴西</Option>
              <Option value="阿根廷">阿根廷</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="企业地址（省市区街道）"
            field="addressCascader"
            rules={[
              { required: true, message: '请选择企业地址' }
            ]}
          >
            <Cascader
              options={addressOptions}
              placeholder="请选择省、市、区、街道"
              expandTrigger="hover"
              onChange={(value) => {
                if (value && value.length >= 4) {
                  form.setFieldsValue({
                    province: value[0],
                    city: value[1], 
                    district: value[2],
                    street: value[3]
                  });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="详细地址"
            field="detailAddress"
            rules={[
              { required: true, message: '请输入详细地址' }
            ]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>
        </div>

        <Form.Item
          label="备注"
          field="description"
        >
          <Input.TextArea
            placeholder="请输入备注信息（可选）"
            rows={4}
            maxLength={500}
            showWordLimit
          />
        </Form.Item>
      </Form>

      {/* 营业执照预览弹窗 */}
      <Modal
        title="营业执照预览"
        visible={businessLicenseModalVisible}
        onCancel={() => setBusinessLicenseModalVisible(false)}
        footer={null}
        style={{ width: '600px' }}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {form.getFieldValue('businessLicenseFile') ? (
            <Image
              src={form.getFieldValue('businessLicenseFile')}
              alt="营业执照"
              style={{ maxWidth: '100%', maxHeight: '400px' }}
              preview={false}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '300px',
              backgroundColor: '#F7F8FA',
              border: '2px dashed #C9CDD4',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#E5E6EB',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconFile style={{ fontSize: '32px', color: '#86909C' }} />
              </div>
              <div style={{
                fontSize: '16px',
                color: '#86909C',
                textAlign: 'center'
              }}>
                暂无营业执照文件
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Card>
  );

  // 联系人Tab
  const ContactTab = () => (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title heading={6} style={{ margin: 0 }}>
          联系人列表 ({contacts.length})
        </Title>
        <Button 
          type="primary" 
          icon={<IconPlus />}
          onClick={handleAddContact}
        >
          添加联系人
        </Button>
      </div>
      
      <Table
        data={contacts}
        columns={[
          {
            title: '联系人信息',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar size={32} style={{ backgroundColor: '#165DFF' }}>
                  <IconUser />
                </Avatar>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {record.name}
                    </Text>
                    {record.isDefault && (
                      <Tag color="orange" icon={<IconStarFill />}>
                        默认
                      </Tag>
                    )}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {record.title}
                  </Text>
                </div>
              </div>
            )
          },
          {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'contact',
            render: (_, record) => (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <IconPhone style={{ fontSize: '12px', color: '#86909C' }} />
                  <Text copyable={{ text: record.phone }} style={{ fontSize: '12px' }}>
                    {record.phone}
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconEmail style={{ fontSize: '12px', color: '#86909C' }} />
                  <Text copyable={{ text: record.email }} style={{ fontSize: '12px' }}>
                    {record.email}
                  </Text>
                </div>
              </div>
            )
          },
          {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record) => (
              <Space>
                {!record.isDefault && (
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<IconStar />}
                    onClick={() => handleSetDefaultContact(record.id)}
                  >
                    设为默认
                  </Button>
                )}
                <Button 
                  type="text" 
                  size="small" 
                  icon={<IconEdit />}
                  onClick={() => handleEditContact(record)}
                >
                  编辑
                </Button>
                {!record.isDefault && (
                  <Button 
                    type="text" 
                    size="small" 
                    status="danger"
                    icon={<IconDelete />}
                    onClick={() => handleDeleteContact(record.id)}
                  >
                    删除
                  </Button>
                )}
              </Space>
            )
          }
        ]}
        pagination={false}
        border
      />

      {/* 联系人添加/编辑模态框 */}
      <Modal
        title={editingContact ? "编辑联系人" : "添加联系人"}
        visible={contactModalVisible}
        onCancel={() => {
          setContactModalVisible(false);
          setEditingContact(null);
          contactForm.resetFields();
        }}
        onOk={handleContactSubmit}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={contactForm}
          layout="vertical"
          autoComplete="off"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="联系人姓名"
              field="name"
              rules={[
                { required: true, message: '请输入联系人姓名' }
              ]}
            >
              <Input placeholder="请输入联系人姓名" />
            </Form.Item>

            <Form.Item
              label="联系人职位"
              field="title"
            >
              <Input placeholder="请输入联系人职位" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="联系电话"
              field="phone"
              rules={[
                { required: true, message: '请输入联系电话' },
                {
                  validator: (value, callback) => {
                    if (value && !/^1[3-9]\d{9}$/.test(value)) {
                      callback('请输入有效的手机号');
                    } else {
                      callback();
                    }
                  }
                }
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>

            <Form.Item
              label="邮箱地址"
              field="email"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { 
                  type: 'email', 
                  message: '请输入有效的邮箱地址' 
                }
              ]}
            >
              <Input placeholder="请输入邮箱地址" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* 设置默认联系人确认弹窗 */}
      <Modal
        title="确认设置默认联系人"
        visible={setDefaultModalVisible}
        onCancel={() => {
          setSetDefaultModalVisible(false);
          setTargetDefaultContact(null);
        }}
        onOk={handleConfirmSetDefault}
        okText="确定设置"
        cancelText="取消"
        okButtonProps={{ type: 'primary' }}
      >
        {targetDefaultContact && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ marginBottom: '12px' }}>
              确定要将 <strong style={{ color: '#165DFF' }}>{targetDefaultContact.name}</strong> 设置为默认联系人吗？
            </div>
            {contacts.find(c => c.isDefault) && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#FFF7E6', 
                borderRadius: '6px',
                border: '1px solid #FFD591',
                fontSize: '14px',
                color: '#D25F00'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>注意：</div>
                <div>当前默认联系人 <strong>{contacts.find(c => c.isDefault)?.name}</strong> 将被取消默认状态</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 删除联系人确认弹窗 */}
      <Modal
        title="确认删除联系人"
        visible={deleteContactModalVisible}
        onCancel={() => {
          setDeleteContactModalVisible(false);
          setTargetDeleteContact(null);
        }}
        onOk={handleConfirmDeleteContact}
        okText="确定删除"
        cancelText="取消"
        okButtonProps={{ status: 'danger' }}
      >
        {targetDeleteContact && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ marginBottom: '12px' }}>
              确定要删除联系人 <strong style={{ color: '#F53F3F' }}>{targetDeleteContact.name}</strong> 吗？
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#FFECE8', 
              borderRadius: '6px',
              border: '1px solid #FFBCB7',
              fontSize: '14px',
              color: '#CB2634'
            }}>
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>注意：</div>
              <div>此操作不可撤销，请谨慎操作</div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );

  // 财务信息Tab
  const renderFinancialTab = () => {
    const reconciliationContact = contacts.find(c => c.id === financialInfo.reconciliationContactId);
    
    if (!financialEditMode) {
      // 非编辑态 - 显示模式
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* 开票信息栏 */}
          <Card title="开票信息" 
                extra={
                  <Button type="text" size="small" onClick={() => copyToClipboard(
                    `公司名称：${financialInfo.invoiceCompanyName}\n税号：${financialInfo.invoiceTaxNumber}\n地址：${financialInfo.invoiceAddress}\n电话：${financialInfo.invoicePhone}\n开户行：${financialInfo.invoiceBankName}\n账号：${financialInfo.invoiceBankAccount}`,
                    "开票信息"
                  )}>
                    复制全部
                  </Button>
                }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">公司名称：</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text copyable={{ text: financialInfo.invoiceCompanyName }}>{financialInfo.invoiceCompanyName || '-'}</Text>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">税务登记号：</Text>
                <Text copyable={{ text: financialInfo.invoiceTaxNumber }}>{financialInfo.invoiceTaxNumber || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">开票地址：</Text>
                <Text copyable={{ text: financialInfo.invoiceAddress }}>{financialInfo.invoiceAddress || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">开票电话：</Text>
                <Text copyable={{ text: financialInfo.invoicePhone }}>{financialInfo.invoicePhone || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">开户银行：</Text>
                <Text copyable={{ text: financialInfo.invoiceBankName }}>{financialInfo.invoiceBankName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行账号：</Text>
                <Text copyable={{ text: financialInfo.invoiceBankAccount }}>{financialInfo.invoiceBankAccount || '-'}</Text>
              </div>
            </div>
          </Card>

          {/* 人民币账户栏 */}
          <Card title="人民币账户" 
                extra={
                  <Button type="text" size="small" onClick={() => copyToClipboard(
                    `银行名称：${financialInfo.cnyBankName}\n账号：${financialInfo.cnyBankAccount}\n账户名：${financialInfo.cnyAccountName}\nSWIFT：${financialInfo.cnySwiftCode}\n银行地址：${financialInfo.cnyBankAddress}`,
                    "人民币账户信息"
                  )}>
                    复制全部
                  </Button>
                }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行名称：</Text>
                <Text copyable={{ text: financialInfo.cnyBankName }}>{financialInfo.cnyBankName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行账号：</Text>
                <Text copyable={{ text: financialInfo.cnyBankAccount }}>{financialInfo.cnyBankAccount || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">账户名称：</Text>
                <Text copyable={{ text: financialInfo.cnyAccountName }}>{financialInfo.cnyAccountName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">SWIFT代码：</Text>
                <Text copyable={{ text: financialInfo.cnySwiftCode }}>{financialInfo.cnySwiftCode || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行地址：</Text>
                <Text copyable={{ text: financialInfo.cnyBankAddress }}>{financialInfo.cnyBankAddress || '-'}</Text>
              </div>
            </div>
          </Card>

          {/* 美金账户栏 */}
          <Card title="美金账户" 
                extra={
                  <Button type="text" size="small" onClick={() => copyToClipboard(
                    `银行名称：${financialInfo.usdBankName}\n账号：${financialInfo.usdBankAccount}\n账户名：${financialInfo.usdAccountName}\nSWIFT：${financialInfo.usdSwiftCode}\n银行地址：${financialInfo.usdBankAddress}`,
                    "美金账户信息"
                  )}>
                    复制全部
                  </Button>
                }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行名称：</Text>
                <Text copyable={{ text: financialInfo.usdBankName }}>{financialInfo.usdBankName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行账号：</Text>
                <Text copyable={{ text: financialInfo.usdBankAccount }}>{financialInfo.usdBankAccount || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">账户名称：</Text>
                <Text copyable={{ text: financialInfo.usdAccountName }}>{financialInfo.usdAccountName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">SWIFT代码：</Text>
                <Text copyable={{ text: financialInfo.usdSwiftCode }}>{financialInfo.usdSwiftCode || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行地址：</Text>
                <Text copyable={{ text: financialInfo.usdBankAddress }}>{financialInfo.usdBankAddress || '-'}</Text>
              </div>
            </div>
          </Card>

          {/* 对账联系人栏 */}
          <Card title="对账联系人">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reconciliationContact ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary">联系人：</Text>
                    <Text>{reconciliationContact.name}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary">职位：</Text>
                    <Text>{reconciliationContact.title}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary">电话：</Text>
                    <Text copyable={{ text: reconciliationContact.phone }}>{reconciliationContact.phone}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary">邮箱：</Text>
                    <Text copyable={{ text: reconciliationContact.email }}>{reconciliationContact.email}</Text>
                  </div>
                </>
              ) : (
                <Text type="secondary">未设置对账联系人</Text>
              )}
            </div>
          </Card>

          {/* 编辑按钮 */}
          <div style={{ gridColumn: 'span 2', marginTop: '16px' }}>
            <Button type="primary" onClick={handleFinancialEdit}>
              编辑财务信息
            </Button>
          </div>
        </div>
      );
    }

    // 编辑态 - 表单模式
    return (
      <Card>
        <Form
          form={financialForm}
          layout="vertical"
          autoComplete="off"
        >
          {/* 开票信息部分 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title heading={6} style={{ margin: 0, color: '#165DFF' }}>开票信息（必填）</Title>
              <Button type="text" size="small" onClick={copyFromCnyToInvoice}>
                从人民币账户复制
              </Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                label="公司名称"
                field="invoiceCompanyName"
                rules={[{ required: true, message: '请输入开票公司名称' }]}
              >
                <Input placeholder="请输入开票公司名称" />
              </Form.Item>
              <Form.Item
                label="税务登记号"
                field="invoiceTaxNumber"
                rules={[{ required: true, message: '请输入税务登记号' }]}
              >
                <Input placeholder="请输入税务登记号" />
              </Form.Item>
              <Form.Item
                label="开票地址"
                field="invoiceAddress"
                rules={[{ required: true, message: '请输入开票地址' }]}
              >
                <Input placeholder="请输入开票地址" />
              </Form.Item>
              <Form.Item
                label="开票电话"
                field="invoicePhone"
                rules={[{ required: true, message: '请输入开票电话' }]}
              >
                <Input placeholder="请输入开票电话" />
              </Form.Item>
              <Form.Item
                label="开户银行"
                field="invoiceBankName"
                rules={[{ required: true, message: '请输入开户银行' }]}
              >
                <Input placeholder="请输入开户银行" />
              </Form.Item>
              <Form.Item
                label="银行账号"
                field="invoiceBankAccount"
                rules={[{ required: true, message: '请输入银行账号' }]}
              >
                <Input placeholder="请输入银行账号" />
              </Form.Item>
            </div>
          </div>

          {/* 人民币账户部分 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title heading={6} style={{ margin: 0, color: '#165DFF' }}>人民币账户（必填）</Title>
              <Button type="text" size="small" onClick={copyFromInvoiceToCny}>
                从开票信息复制
              </Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                label="银行名称"
                field="cnyBankName"
                rules={[{ required: true, message: '请输入银行名称' }]}
              >
                <Input placeholder="请输入银行名称" />
              </Form.Item>
              <Form.Item
                label="银行账号"
                field="cnyBankAccount"
                rules={[{ required: true, message: '请输入银行账号' }]}
              >
                <Input placeholder="请输入银行账号" />
              </Form.Item>
              <Form.Item
                label="账户名称"
                field="cnyAccountName"
                rules={[{ required: true, message: '请输入账户名称' }]}
              >
                <Input placeholder="请输入账户名称" />
              </Form.Item>
              <Form.Item
                label="SWIFT代码"
                field="cnySwiftCode"
                rules={[{ required: true, message: '请输入SWIFT代码' }]}
              >
                <Input placeholder="请输入SWIFT代码" />
              </Form.Item>
              <Form.Item
                label="银行地址"
                field="cnyBankAddress"
                rules={[{ required: true, message: '请输入银行地址' }]}
                style={{ gridColumn: 'span 2' }}
              >
                <Input placeholder="请输入银行地址" />
              </Form.Item>
            </div>
          </div>

          {/* 美金账户部分 */}
          <div style={{ marginBottom: '24px' }}>
            <Title heading={6} style={{ marginBottom: '16px', color: '#86909C' }}>美金账户（选填）</Title>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                label="银行名称"
                field="usdBankName"
              >
                <Input placeholder="请输入银行名称" />
              </Form.Item>
              <Form.Item
                label="银行账号"
                field="usdBankAccount"
              >
                <Input placeholder="请输入银行账号" />
              </Form.Item>
              <Form.Item
                label="账户名称"
                field="usdAccountName"
              >
                <Input placeholder={form.getFieldValue('englishName') || "请输入英文账户名称"} />
              </Form.Item>
              <Form.Item
                label="SWIFT代码"
                field="usdSwiftCode"
              >
                <Input placeholder="请输入SWIFT代码" />
              </Form.Item>
              <Form.Item
                label="银行地址"
                field="usdBankAddress"
                style={{ gridColumn: 'span 2' }}
              >
                <Input placeholder="请输入银行地址" />
              </Form.Item>
            </div>
          </div>

          {/* 对账联系人部分 */}
          <div style={{ marginBottom: '24px' }}>
            <Title heading={6} style={{ marginBottom: '16px', color: '#165DFF' }}>对账联系人</Title>
            <Form.Item
              label="选择对账联系人"
              field="reconciliationContactId"
              rules={[{ required: true, message: '请选择对账联系人' }]}
            >
              <Select 
                placeholder="请选择对账联系人"
                onChange={(value) => updateReconciliationContact(value)}
              >
                {contacts.map(contact => (
                  <Option key={contact.id} value={contact.id}>
                    {contact.name} - {contact.title} ({contact.phone})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="primary" onClick={handleFinancialSave}>
              保存
            </Button>
            <Button onClick={handleFinancialCancel}>
              取消
            </Button>
          </div>
        </Form>
      </Card>
    );
  };

  return (
    <div>
      <div className="page-header mb-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title heading={4}>企业认证</Title>
            <Breadcrumb separator=">" style={{ marginTop: '8px' }}>
              <Breadcrumb.Item>运营版控制塔</Breadcrumb.Item>
              <Breadcrumb.Item>企业信息</Breadcrumb.Item>
              <Breadcrumb.Item>企业认证</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<IconArrowLeft />}
          onClick={() => navigate('/controltower/company-profile')}
        >
          返回
        </Button>
        
        <Space>
          <Button 
            type="outline" 
            status="warning"
            onClick={handleDemoCompanyDuplicate}
          >
            演示企业重名
          </Button>
          <Button onClick={() => navigate('/controltower/company-profile')}>
            取消
          </Button>
          <Button 
            type="primary" 
            onClick={() => setSubmitConfirmVisible(true)}
            loading={loading}
            icon={<IconSave />}
          >
            提交申请
          </Button>
        </Space>
      </div>

      {/* Tab页签内容 */}
      <Tabs 
        activeTab={activeTab} 
        onChange={setActiveTab}
        type="line"
        size="large"
      >
        <TabPane key="basic" title="基本信息">
          <BasicInfoTab />
        </TabPane>
        <TabPane key="contact" title="联系人">
          <ContactTab />
        </TabPane>
        <TabPane key="financial" title="财务信息">
          {renderFinancialTab()}
        </TabPane>
      </Tabs>

      {/* 提交申请确认弹窗 */}
      <Modal
        title="确认提交企业认证申请"
        visible={submitConfirmVisible}
        onCancel={() => setSubmitConfirmVisible(false)}
        onOk={handleConfirmSubmit}
        okText="确认提交"
        cancelText="取消"
        okButtonProps={{ 
          type: 'primary',
          loading: loading
        }}
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ marginBottom: '16px' }}>
            <Text>请确认您要提交企业认证申请，提交后将无法修改，我们将在3个工作日内完成审核。</Text>
          </div>
          
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#F0F8FF', 
            borderRadius: '6px',
            border: '1px solid #B8D4FF',
            fontSize: '14px',
            color: '#1D4ED8'
          }}>
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>提示：</div>
            <div>• 审核通过后，您将能够邀请员工加入企业</div>
            <div>• 审核期间如需修改信息，请联系客服</div>
            <div>• 审核结果将通过邮件和短信通知您</div>
          </div>
        </div>
      </Modal>
      
      {/* 企业重名演示弹窗 */}
      <Modal
        title={
          <div className="flex items-center">
            <IconUser className="text-orange-500 mr-2" style={{ fontSize: 18 }} />
            企业重名提示
          </div>
        }
        visible={duplicateNameModalVisible}
        onCancel={handleDuplicateNameClose}
        footer={
          <Button 
            type="primary" 
            onClick={handleDuplicateNameClose}
          >
            关闭
          </Button>
        }
        style={{ width: 450 }}
      >
        <div style={{ padding: '20px 0' }}>
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <Text style={{ fontSize: '14px', color: '#FF7D00' }}>
              ⚠️ 同样国家下，已存在同名企业，请选择加入企业。
            </Text>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Text style={{ fontSize: '14px', color: '#86909C' }}>
              系统检测到在相同国家/地区已存在同名企业，为避免重复认证，建议您选择"加入已有企业"功能。
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyCertification; 