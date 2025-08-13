import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Table,
  Tag,
  Switch,
  Avatar,
  Modal,
  Upload,
  Cascader,
  Image,
  Spin
} from '@arco-design/web-react';
import { 
  IconArrowLeft,
  IconSave,
  IconUser,
  IconPhone,
  IconEmail,
  IconPlus,
  IconEdit,
  IconDelete,
  IconStar,
  IconStarFill,
  IconUpload,
  IconEye,
  IconFile,
  IconSync,
  IconExclamationCircleFill,
  IconExclamation
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

interface CompanyFormData {
  id?: string;
  companyCode?: string; // 企业编码，新建时不存在，编辑时系统自动生成
  name: string;
  englishName: string;
  businessLicense: string;
  description: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  // 国家和五级行政区划
  country: string;
  province: string;
  city: string;
  district: string;
  street: string;
  detailAddress: string;
  // 营业执照
  businessLicenseFile?: string;
  businessLicenseUploadTime?: string;
}

interface ContactPerson {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  isDefault: boolean;
  isReconciliationContact?: boolean;
}

interface RelatedUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'user';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createTime: string;
  thirdPartyUserIds?: {
    [systemName: string]: string;
  };
}

interface AuthorizedProduct {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  expireDate: string;
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

interface ThirdPartySystem {
  id: string;
  systemName: string;
  systemId: string;
  accessKey: string;
  secretKey: string;
  systemType: 'ERP' | 'WMS' | 'TMS' | 'OMS' | 'CRM' | 'FMS' | 'OTHER';
  status: 'active' | 'inactive';
  createTime: string;
  lastSyncTime?: string;
}

const CompanyDataManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [financialForm] = Form.useForm();
  const [setAdminModalVisible, setSetAdminModalVisible] = useState(false);
  const [targetUser, setTargetUser] = useState<RelatedUser | null>(null);
  const [financialEditMode, setFinancialEditMode] = useState(false);
  const [businessLicenseModalVisible, setBusinessLicenseModalVisible] = useState(false);
  const [businessLicenseUploadVisible, setBusinessLicenseUploadVisible] = useState(false);
  const [aiRecognizing, setAiRecognizing] = useState(false);
  const [recognitionSuccess, setRecognitionSuccess] = useState(false);
  const [setDefaultModalVisible, setSetDefaultModalVisible] = useState(false);
  const [targetDefaultContact, setTargetDefaultContact] = useState<ContactPerson | null>(null);
  const [deleteContactModalVisible, setDeleteContactModalVisible] = useState(false);
  const [targetDeleteContact, setTargetDeleteContact] = useState<ContactPerson | null>(null);
  const [removeUserModalVisible, setRemoveUserModalVisible] = useState(false);
  const [targetRemoveUser, setTargetRemoveUser] = useState<RelatedUser | null>(null);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [productToggleModalVisible, setProductToggleModalVisible] = useState(false);
  const [targetProduct, setTargetProduct] = useState<{ product: AuthorizedProduct; enabled: boolean } | null>(null);
  const [thirdPartyModalVisible, setThirdPartyModalVisible] = useState(false);
  const [editingThirdParty, setEditingThirdParty] = useState<ThirdPartySystem | null>(null);
  const [viewingThirdParty, setViewingThirdParty] = useState<ThirdPartySystem | null>(null);
  const [thirdPartyForm] = Form.useForm();
  
  // 第三方同步相关状态
  const [syncModalVisible, setSyncModalVisible] = useState(false);
  const [syncForm] = Form.useForm();
  const [syncing, setSyncing] = useState(false);
  
  // 用户详情弹窗相关状态
  const [userDetailModalVisible, setUserDetailModalVisible] = useState(false);
  const [currentViewingUser, setCurrentViewingUser] = useState<RelatedUser | null>(null);
  const [financialData, setFinancialData] = useState<FinancialInfo>({
    invoiceCompanyName: '',
    invoiceTaxNumber: '',
    invoiceAddress: '',
    invoicePhone: '',
    invoiceBankName: '',
    invoiceBankAccount: '',
    cnyBankName: '',
    cnyBankAccount: '',
    cnyAccountName: '',
    cnySwiftCode: '',
    cnyBankAddress: '',
    usdBankName: '',
    usdBankAccount: '',
    usdAccountName: '',
    usdSwiftCode: '',
    usdBankAddress: '',
    reconciliationContactId: ''
  });
  
  const isEdit = true; // 企业资料管理页面总是编辑模式
  const pageTitle = '企业资料管理';

  // 模拟企业数据
  const [, setCompanyData] = useState<CompanyFormData>({
    name: '',
    englishName: '',
    businessLicense: '',
    description: '',
    status: 'pending',
    country: '中国',
    province: '',
    city: '',
    district: '',
    street: '',
    detailAddress: ''
  });

  // 联系人数据
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactPerson | null>(null);

  // 模拟关联用户数据
  const [relatedUsers, setRelatedUsers] = useState<RelatedUser[]>([
    {
      id: 'A3K9M2X7N8Q5',
      username: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138001',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15 14:30:22',
      createTime: '2023-12-01 09:15:30',
      thirdPartyUserIds: {
        'CargoWare': 'huh768gh',
        'eTower': 'ghuhi788'
      }
    },
    {
      id: 'E9L4Z2M6X8Q3',
      username: '陈七',
      email: 'chenqi@example.com',
      phone: '13800138007',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-14 16:45:10',
      createTime: '2023-12-15 14:20:45',
      thirdPartyUserIds: {
        'CargoWare': 'abc123def',
        'eTower': 'xyz789uvw'
      }
    }
  ]);

  // 模拟已授权产品数据
  const [authorizedProducts, setAuthorizedProducts] = useState<AuthorizedProduct[]>([
    {
      id: 'product-1',
      name: '超级运价',
      description: '智能运价计算和优化系统',
      enabled: true,
      expireDate: '2024-12-31'
    },
    {
      id: 'product-2',
      name: '控制塔',
      description: '物流全程可视化管控平台',
      enabled: true,
      expireDate: '2024-12-31'
    },
    {
      id: 'product-3',
      name: '智慧箱管',
      description: '集装箱智能管理系统',
      enabled: false,
      expireDate: '2024-06-30'
    }
  ]);

  // 模拟第三方系统数据
  const [thirdPartySystems, setThirdPartySystems] = useState<ThirdPartySystem[]>([
    {
      id: 'sys-1',
      systemName: 'CargoWare',
      systemId: 'CARGOWARE_ERP_001',
      accessKey: 'AK_CARGOWARE_123456',
      secretKey: 'SK_CARGOWARE_ABCDEF',
      systemType: 'ERP',
      status: 'active',
      createTime: '2023-12-01 10:30:00',
      lastSyncTime: '2024-01-15 14:30:22'
    },
    {
      id: 'sys-2',
      systemName: 'eTower',
      systemId: 'ETOWER_WMS_002',
      accessKey: 'AK_ETOWER_789012',
      secretKey: 'SK_ETOWER_GHIJKL',
      systemType: 'WMS',
      status: 'active',
      createTime: '2023-12-15 16:20:00',
      lastSyncTime: '2024-01-14 16:45:10'
    },
    {
      id: 'sys-3',
      systemName: 'CargoWare',
      systemId: 'CARGOWARE_FMS_003',
      accessKey: 'AK_CARGOWARE_345678',
      secretKey: 'SK_CARGOWARE_MNOPQR',
      systemType: 'FMS',
      status: 'inactive',
      createTime: '2024-01-01 09:15:00'
    }
  ]);

  // 模拟可选择的用户数据（排除已关联的用户）
  const availableUsers: RelatedUser[] = [
    {
      id: 'USR_001',
      username: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138001',
      role: 'user' as const,
      status: 'active' as const,
      lastLogin: '2024-01-15 09:30:00',
      createTime: '2024-01-01 10:00:00'
    },
    {
      id: 'USR_002',
      username: '李四',
      email: 'lisi@example.com',
      phone: '13800138002',
      role: 'user' as const,
      status: 'active' as const,
      lastLogin: '2024-01-14 16:45:00',
      createTime: '2024-01-02 11:00:00'
    },
    {
      id: 'USR_003',
      username: '王五',
      email: 'wangwu@example.com',
      phone: '13800138003',
      role: 'user' as const,
      status: 'active' as const,
      lastLogin: '2024-01-13 14:20:00',
      createTime: '2024-01-03 09:30:00'
    },
    {
      id: 'USR_004',
      username: '赵六',
      email: 'zhaoliu@example.com',
      phone: '13800138004',
      role: 'user' as const,
      status: 'inactive' as const,
      lastLogin: '2024-01-10 11:15:00',
      createTime: '2024-01-04 14:00:00'
    },
    {
      id: 'USR_005',
      username: 'John Smith',
      email: 'john.smith@example.com',
      phone: '13800138005',
      role: 'user' as const,
      status: 'active' as const,
      lastLogin: '2024-01-12 10:30:00',
      createTime: '2024-01-05 15:30:00'
    },
    {
      id: 'USR_006',
      username: '陈七',
      email: 'chenqi@example.com',
      phone: '13800138006',
      role: 'user' as const,
      status: 'pending' as const,
      lastLogin: '2024-01-11 13:25:00',
      createTime: '2024-01-06 16:45:00'
    }
  ].filter(user => !relatedUsers.some(relatedUser => relatedUser.id === user.id));

  useEffect(() => {
    // 处理URL参数中的tab
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      switch (tabParam) {
        case 'relatedUsers':
          setActiveTab('users');
          break;
        case 'contacts':
          setActiveTab('contacts');
          break;
        case 'products':
          setActiveTab('products');
          break;
        case 'financial':
          setActiveTab('financial');
          break;
        case 'thirdparty':
          setActiveTab('thirdparty');
          break;
        case 'wtf':
          setActiveTab('wtf');
          break;
        default:
          setActiveTab('basic');
      }
    }

    if (isEdit) {
      // 模拟加载企业数据
      setLoading(true);
      setTimeout(() => {
        // 模拟不同状态的企业数据
        const getCompanyDataById = (id: string) => {
          const baseData = {
            id: id,
            name: '货拉拉物流科技有限公司',
            englishName: 'Huolala Logistics Technology Co., Ltd.',
            businessLicense: '91110000123456789X',
            description: '专业的物流科技服务提供商，致力于为客户提供高效、便捷的物流解决方案。',
            country: '中国',
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            street: '建国门外街道',
            detailAddress: '建国路88号SOHO现代城',
            businessLicenseFile: '/uploads/business-license-91110000123456789X.jpg',
            businessLicenseUploadTime: '2023-12-01 10:30:00'
          };

          // 根据ID模拟不同状态
          switch (id) {
            case '1':
            case '2':
              return {
                ...baseData,
                status: 'active' as const,
                companyCode: `COMP${id.toString().padStart(3, '0')}` // 审核通过，有企业编码
              };
            case '3':
              return {
                ...baseData,
                status: 'pending' as const,
                name: '德邦物流股份有限公司',
                englishName: 'Deppon Logistics Co., Ltd.'
                // 待审核，没有企业编码
              };
            case '5':
              return {
                ...baseData,
                status: 'inactive' as const,
                companyCode: `COMP${id.toString().padStart(3, '0')}`, // 虽然已停用，但之前审核通过过，所以有企业编码
                name: '申通快递有限公司',
                englishName: 'STO Express Co., Ltd.'
              };
            default:
              return {
                ...baseData,
                status: 'rejected' as const,
                // 审核拒绝，没有企业编码
              };
          }
        };

        const mockData = getCompanyDataById('1');
        setCompanyData(mockData);
        form.setFieldsValue({
          ...mockData,
          addressCascader: [mockData.province, mockData.city, mockData.district, mockData.street]
        });

        // 模拟联系人数据
        const mockContacts: ContactPerson[] = [
          {
            id: '1',
            name: '张经理',
            title: '商务总监',
            phone: '13800138001',
            email: 'zhang@huolala.com',
            isDefault: true,
            isReconciliationContact: true
          },
          {
            id: '2',
            name: '李助理',
            title: '商务助理',
            phone: '13800138002',
            email: 'li@huolala.com',
            isDefault: false,
            isReconciliationContact: false
          }
        ];
        setContacts(mockContacts);

        // 模拟财务信息
        const mockFinancial: FinancialInfo = {
          invoiceCompanyName: '货拉拉物流科技有限公司',
          invoiceTaxNumber: '91110000123456789X',
          invoiceAddress: '北京市朝阳区建国路88号SOHO现代城',
          invoicePhone: '13800138001',
          invoiceBankName: '中国银行北京分行',
          invoiceBankAccount: '1234567890123456',
          cnyBankName: '中国银行北京分行',
          cnyBankAccount: '1234567890123456',
          cnyAccountName: '货拉拉物流科技有限公司',
          cnySwiftCode: '100000000000000',
          cnyBankAddress: '北京市朝阳区建国路88号SOHO现代城',
          usdBankName: '中国银行北京分行',
          usdBankAccount: '1234567890123456',
          usdAccountName: '货拉拉物流科技有限公司',
          usdSwiftCode: '100000000000000',
          usdBankAddress: '北京市朝阳区建国路88号SOHO现代城',
          reconciliationContactId: '1'
        };
        setFinancialData(mockFinancial);
        financialForm.setFieldsValue(mockFinancial);

        setLoading(false);
      }, 1000);
    }
  }, [form, financialForm, location.search]);

  const handleSave = () => {
    form.validate().then(() => {
      setLoading(true);
      setTimeout(() => {
        if (isEdit) {
          Message.success('企业信息已更新');
        } else {
          Message.success('企业已添加');
        }
        setLoading(false);
        navigate('/controltower/company-profile');
      }, 1000);
    }).catch((error) => {
      console.error('表单验证失败:', error);
    });
  };

  const handleProductToggle = (productId: string, enabled: boolean) => {
    const product = authorizedProducts.find(p => p.id === productId);
    if (!product) return;
    
    setTargetProduct({ product, enabled });
    setProductToggleModalVisible(true);
  };

  const handleConfirmProductToggle = () => {
    if (targetProduct) {
      setAuthorizedProducts(prev => 
        prev.map(product => 
          product.id === targetProduct.product.id ? { ...product, enabled: targetProduct.enabled } : product
        )
      );
      Message.success(`产品 ${targetProduct.product.name} 已${targetProduct.enabled ? '启用' : '停用'}`);
      setProductToggleModalVisible(false);
      setTargetProduct(null);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    contactForm.resetFields();
    setContactModalVisible(true);
  };

  const handleEditContact = (contact: ContactPerson) => {
    setEditingContact(contact);
    contactForm.setFieldsValue(contact);
    setContactModalVisible(true);
  };

  const handleDeleteContact = (contactId: string) => {
    const targetContact = contacts.find(c => c.id === contactId);
    
    if (!targetContact) return;
    
    // 默认联系人不能删除
    if (targetContact.isDefault) {
      Message.warning('默认联系人不能删除，请先设置其他联系人为默认');
      return;
    }
    
    // 设置目标联系人并显示确认弹窗
    setTargetDeleteContact(targetContact);
    setDeleteContactModalVisible(true);
  };

  const handleConfirmDeleteContact = () => {
    if (targetDeleteContact) {
      setContacts(prev => prev.filter(c => c.id !== targetDeleteContact.id));
      Message.success(`联系人 ${targetDeleteContact.name} 已删除`);
      setDeleteContactModalVisible(false);
      setTargetDeleteContact(null);
    }
  };

  const handleSetDefaultContact = (contactId: string) => {
    const targetContact = contacts.find(c => c.id === contactId);
    
    if (!targetContact) return;
    
    // 如果已经是默认联系人，不需要操作
    if (targetContact.isDefault) {
      Message.info('该联系人已经是默认联系人');
      return;
    }
    
    // 设置目标联系人并显示确认弹窗
    setTargetDefaultContact(targetContact);
    setSetDefaultModalVisible(true);
  };

  const handleConfirmSetDefault = () => {
    if (targetDefaultContact) {
      setContacts(prev => prev.map(contact => ({
        ...contact,
        isDefault: contact.id === targetDefaultContact.id
      })));
      Message.success(`已将 ${targetDefaultContact.name} 设置为默认联系人`);
      setSetDefaultModalVisible(false);
      setTargetDefaultContact(null);
    }
  };

  const handleContactSubmit = () => {
    contactForm.validate().then((values) => {
      if (editingContact) {
        // 编辑联系人
        setContacts(prev => prev.map(contact => 
          contact.id === editingContact.id 
            ? { ...contact, ...values }
            : contact
        ));
        Message.success('联系人信息已更新');
      } else {
        // 添加新联系人
        const newContact: ContactPerson = {
          id: Date.now().toString(),
          ...values,
          isDefault: contacts.length === 0 // 如果是第一个联系人，自动设为默认
        };
        setContacts(prev => [...prev, newContact]);
        Message.success('联系人已添加');
      }
      setContactModalVisible(false);
      setEditingContact(null);
      contactForm.resetFields();
    }).catch((error) => {
      console.error('联系人表单验证失败:', error);
    });
  };

  const handleFinancialSave = () => {
    financialForm.validate().then((values) => {
      setFinancialData(values);
      // 更新对账联系人标记
      if (values.reconciliationContactId) {
        updateReconciliationContact(values.reconciliationContactId);
      }
      setFinancialEditMode(false);
      Message.success('财务信息已保存');
    }).catch((error) => {
      console.error('财务信息表单验证失败:', error);
    });
  };

  const handleFinancialEdit = () => {
    setFinancialEditMode(true);
    financialForm.setFieldsValue(financialData);
  };

  const handleFinancialCancel = () => {
    setFinancialEditMode(false);
    financialForm.resetFields();
  };

  const updateReconciliationContact = (contactId: string) => {
    // 更新财务数据中的对账联系人
    setFinancialData(prev => ({ ...prev, reconciliationContactId: contactId }));
    
    // 更新联系人的对账联系人标记
    setContacts(prev => prev.map(contact => ({
      ...contact,
      isReconciliationContact: contact.id === contactId
    })));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      Message.success(`${label}已复制到剪贴板`);
    }).catch(() => {
      Message.error('复制失败');
    });
  };

  // 从人民币账户复制到开票信息
  const copyFromCnyToInvoice = () => {
    const cnyValues = financialForm.getFieldsValue();
    financialForm.setFieldsValue({
      invoiceCompanyName: cnyValues.cnyAccountName,
      invoiceBankName: cnyValues.cnyBankName,
      invoiceBankAccount: cnyValues.cnyBankAccount
    });
    Message.success('已从人民币账户复制相关信息到开票信息');
  };

  // 从开票信息复制到人民币账户
  const copyFromInvoiceToCny = () => {
    const invoiceValues = financialForm.getFieldsValue();
    financialForm.setFieldsValue({
      cnyAccountName: invoiceValues.invoiceCompanyName,
      cnyBankName: invoiceValues.invoiceBankName,
      cnyBankAccount: invoiceValues.invoiceBankAccount
    });
    Message.success('已从开票信息复制相关信息到人民币账户');
  };

  // 营业执照相关处理
  const handleBusinessLicensePreview = () => {
    setBusinessLicenseModalVisible(true);
  };

  const handleBusinessLicenseUpload = (file: File) => {
    // 开始AI识别流程
    setAiRecognizing(true);
    setRecognitionSuccess(false);
    
    // 模拟AI识别过程，3秒后完成
    setTimeout(() => {
      setAiRecognizing(false);
      setRecognitionSuccess(true);
      
      // 模拟识别结果，自动填充表单
      const formData = form.getFieldsValue();
      const newFile = `/uploads/business-license-${formData.businessLicense || file.name}.jpg`;
      form.setFieldValue('businessLicenseFile', newFile);
      form.setFieldValue('businessLicenseUploadTime', new Date().toLocaleString('zh-CN'));
      
      // 模拟AI识别出的企业信息
      if (!formData.name) {
        form.setFieldValue('name', '货拉拉物流科技有限公司');
      }
      if (!formData.englishName) {
        form.setFieldValue('englishName', 'Huolala Logistics Technology Co., Ltd.');
      }
      if (!formData.businessLicense) {
        form.setFieldValue('businessLicense', '91110000123456789X');
      }
      
      Message.success('AI识别成功，已自动填充企业信息');
      
      // 2秒后关闭弹窗
      setTimeout(() => {
        setBusinessLicenseUploadVisible(false);
        setRecognitionSuccess(false);
      }, 2000);
    }, 3000);
    
    return false; // 阻止默认上传行为
  };

  // 第三方系统相关处理
  const handleAddThirdParty = () => {
    setEditingThirdParty(null);
    thirdPartyForm.resetFields();
    setThirdPartyModalVisible(true);
  };

  const handleViewThirdParty = (system: ThirdPartySystem) => {
    setViewingThirdParty(system);
    thirdPartyForm.setFieldsValue(system);
    setThirdPartyModalVisible(true);
  };

  const handleEditThirdParty = (system: ThirdPartySystem) => {
    setEditingThirdParty(system);
    thirdPartyForm.setFieldsValue(system);
    setThirdPartyModalVisible(true);
  };

  const handleDeleteThirdParty = (systemId: string) => {
    Modal.confirm({
      title: '确认解除授权',
      content: '解除授权后，该第三方系统将无法继续同步数据，确定要解除授权吗？',
      okText: '确定解除',
      cancelText: '取消',
      okButtonProps: { status: 'danger' },
      onOk: () => {
        setThirdPartySystems(prev => prev.filter(sys => sys.id !== systemId));
        Message.success('已解除第三方系统授权');
      }
    });
  };

  // 生成随机AK/SK
  const generateAccessKey = () => {
    return 'AK' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generateSecretKey = () => {
    return 'SK' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleGenerateKeys = () => {
    const newAK = generateAccessKey();
    const newSK = generateSecretKey();
    thirdPartyForm.setFieldsValue({
      accessKey: newAK,
      secretKey: newSK
    });
    Message.success('AK/SK已生成');
  };

  const handleResetKeys = () => {
    const newAK = generateAccessKey();
    const newSK = generateSecretKey();
    thirdPartyForm.setFieldsValue({
      accessKey: newAK,
      secretKey: newSK
    });
    Message.success('AK/SK已重置');
  };

  const handleThirdPartySubmit = () => {
    thirdPartyForm.validate().then((values) => {
      if (editingThirdParty) {
        // 编辑模式
        setThirdPartySystems(prev => 
          prev.map(sys => 
            sys.id === editingThirdParty.id 
              ? { ...sys, ...values }
              : sys
          )
        );
        Message.success('第三方系统信息已更新');
      } else {
        // 新增模式
        const newSystem: ThirdPartySystem = {
          id: `sys-${Date.now()}`,
          ...values,
          status: 'active',
          createTime: new Date().toLocaleString('zh-CN')
        };
        setThirdPartySystems(prev => [...prev, newSystem]);
        Message.success('第三方系统授权已添加');
      }
      setThirdPartyModalVisible(false);
      setEditingThirdParty(null);
      setViewingThirdParty(null);
    }).catch((error) => {
      console.error('表单验证失败:', error);
    });
  };

  const getSystemTypeTag = (type: string) => {
    const typeMap = {
      'ERP': { color: 'blue', text: 'ERP系统' },
      'WMS': { color: 'green', text: 'WMS系统' },
      'TMS': { color: 'orange', text: 'TMS系统' },
      'OMS': { color: 'purple', text: 'OMS系统' },
      'CRM': { color: 'red', text: 'CRM系统' },
      'FMS': { color: 'cyan', text: 'FMS系统' },
      'OTHER': { color: 'gray', text: '其他系统' }
    };
    const config = typeMap[type as keyof typeof typeMap] || typeMap.OTHER;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getThirdPartyStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="green">已连接</Tag>;
      case 'inactive':
        return <Tag color="red">未连接</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };

  const handleSetAdmin = (user: RelatedUser) => {
    setTargetUser(user);
    setSetAdminModalVisible(true);
  };

  const handleConfirmSetAdmin = () => {
    if (targetUser) {
      // 更新用户角色：将目标用户设为超级管理员，其他超级管理员改为普通用户
      setRelatedUsers(prev => prev.map(user => ({
        ...user,
        role: user.id === targetUser.id ? 'super_admin' : 
              (user.role === 'super_admin' ? 'user' : user.role)
      })));
      
      Message.success(`${targetUser.username} 已设置为超级管理员`);
      setSetAdminModalVisible(false);
      setTargetUser(null);
    }
  };

  const handleViewUserDetail = (user: RelatedUser) => {
    setCurrentViewingUser(user);
    setUserDetailModalVisible(true);
  };

  const handleRemoveUser = (user: RelatedUser) => {
    setTargetRemoveUser(user);
    setRemoveUserModalVisible(true);
  };

  const handleConfirmRemoveUser = () => {
    if (targetRemoveUser) {
      setRelatedUsers(prev => prev.filter(u => u.id !== targetRemoveUser.id));
      Message.success(`${targetRemoveUser.username} 已从企业中移除`);
      setRemoveUserModalVisible(false);
      setTargetRemoveUser(null);
    }
  };

  const handleAddUser = () => {
    setAddUserModalVisible(true);
    setSelectedUsers([]);
  };

  const handleConfirmAddUser = () => {
    if (selectedUsers.length === 0) {
      Message.warning('请选择要添加的用户');
      return;
    }

    const usersToAdd = availableUsers.filter(user => selectedUsers.includes(user.id));
    setRelatedUsers(prev => [...prev, ...usersToAdd]);
    Message.success(`成功添加 ${usersToAdd.length} 个用户`);
    setAddUserModalVisible(false);
    setSelectedUsers([]);
  };

  // 处理第三方同步
  const handleThirdPartySync = () => {
    setSyncModalVisible(true);
    syncForm.resetFields();
  };

  const handleSyncSubmit = () => {
    syncForm.validate().then((values) => {
      const selectedSystem = thirdPartySystems.find(sys => sys.id === values.systemId);
      setSyncing(true);
      
      // 模拟同步过程，5秒后完成
      setTimeout(() => {
        setSyncing(false);
        const randomCount = Math.floor(Math.random() * 50) + 10; // 随机生成10-59条数据
        Message.success(`从 ${selectedSystem?.systemName} 同步完成，同步成功 ${randomCount} 条用户数据`);
        setSyncModalVisible(false);
        syncForm.resetFields();
      }, 5000);
    }).catch((error) => {
      console.error('表单验证失败:', error);
    });
  };

  const getRoleTag = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Tag color="blue">超级管理员</Tag>;
      case 'user':
        return <Tag color="gray">普通用户</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="green">正常</Tag>;
      case 'inactive':
        return <Tag color="red">禁用</Tag>;
      case 'pending':
        return <Tag color="orange">待激活</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };

  // 基本信息Tab内容
  const BasicInfoTab = () => (
    <Card>
      {/* 企业状态标签 */}
      <div style={{ marginBottom: '24px' }}>
        <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>企业状态：</Text>
        {form.getFieldValue('status') ? getStatusTag(form.getFieldValue('status')) : <Tag color="gray">未设置</Tag>}
      </div>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        {/* 企业编码 - 只在编辑时显示 */}
        {isEdit && form.getFieldValue('companyCode') && (
          <Form.Item
            label="企业编码"
            field="companyCode"
          >
            <Input 
              placeholder="系统自动生成"
              disabled
              style={{ 
                color: '#165DFF',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            />
          </Form.Item>
        )}

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
                    onClick={() => setBusinessLicenseUploadVisible(true)}
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
            /* 占位图 */
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
                fontWeight: '500'
              }}>
                暂无营业执照
              </div>
              <div style={{
                fontSize: '14px',
                color: '#C9CDD4'
              }}>
                请先上传营业执照文件
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 营业执照上传弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconFile style={{ color: '#165DFF', fontSize: '18px' }} />
            <span>上传营业执照</span>
          </div>
        }
        visible={businessLicenseUploadVisible}
        onCancel={() => setBusinessLicenseUploadVisible(false)}
        footer={null}
        style={{ borderRadius: '12px' }}
      >
        <div style={{ padding: '24px 0' }}>
          {/* 提示信息 */}
          <div style={{ 
            marginBottom: '24px', 
            padding: '16px', 
            backgroundColor: '#F2F3F5', 
            borderRadius: '8px',
            border: '1px solid #E5E6EB'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '8px',
              color: '#4E5969',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              <div style={{ 
                width: '4px', 
                height: '4px', 
                backgroundColor: '#165DFF', 
                borderRadius: '50%', 
                marginTop: '8px',
                flexShrink: 0
              }}></div>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>上传要求：</div>
                <div>• 请上传清晰的营业执照照片或扫描件</div>
                <div>• 支持 JPG、PNG、PDF 格式</div>
                <div>• 文件大小不超过 10MB</div>
                <div>• 建议图片分辨率不低于 1024×768</div>
              </div>
            </div>
          </div>

          {/* 上传区域 */}
          {aiRecognizing ? (
            /* AI识别中状态 */
            <div style={{ 
              padding: '48px 24px',
              border: '2px solid #165DFF',
              borderRadius: '12px',
              backgroundColor: '#F2F3FF',
              textAlign: 'center'
            }}>
              <Spin size={60} />
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#165DFF',
                marginTop: '24px',
                marginBottom: '8px'
              }}>
                AI识别中...
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#86909C',
                lineHeight: '1.5'
              }}>
                正在智能识别营业执照信息，请稍候
              </div>
            </div>
          ) : recognitionSuccess ? (
            /* 识别成功状态 */
            <div style={{ 
              padding: '48px 24px',
              border: '2px solid #00B42A',
              borderRadius: '12px',
              backgroundColor: '#F6FFED',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #00B42A 0%, #23C343 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 180, 42, 0.2)'
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  color: '#FFFFFF',
                  fontWeight: 'bold'
                }}>
                  ✓
                </div>
              </div>
              
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#00B42A',
                marginBottom: '8px'
              }}>
                识别成功！
              </div>
              
              <div style={{ 
                fontSize: '14px', 
                color: '#86909C',
                lineHeight: '1.5'
              }}>
                <div>已成功识别营业执照信息</div>
                <div>企业信息已自动填充到表单中</div>
              </div>
            </div>
          ) : (
            /* 正常上传状态 */
            <Upload
              accept="image/*,.pdf"
              beforeUpload={handleBusinessLicenseUpload}
              showUploadList={false}
              drag
            >
              <div style={{ 
                padding: '48px 24px',
                border: '2px dashed #C9CDD4',
                borderRadius: '12px',
                backgroundColor: '#FBFCFD',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#165DFF';
                e.currentTarget.style.backgroundColor = '#F2F3FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#C9CDD4';
                e.currentTarget.style.backgroundColor = '#FBFCFD';
              }}
              >
                {/* 上传图标 */}
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, #165DFF 0%, #246FFF 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(22, 93, 255, 0.2)'
                }}>
                  <IconUpload style={{ fontSize: '32px', color: '#FFFFFF' }} />
                </div>
                
                {/* 主要文字 */}
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  color: '#1D2129',
                  marginBottom: '8px'
                }}>
                  点击选择文件或拖拽到此处
                </div>
                
                {/* 副文字 */}
                <div style={{ 
                  fontSize: '14px', 
                  color: '#86909C',
                  lineHeight: '1.5'
                }}>
                  <div>将营业执照文件拖拽到此区域</div>
                  <div>或点击选择文件上传，AI将自动识别企业信息</div>
                </div>
              </div>
            </Upload>
          )}

          {/* 底部按钮 */}
          <div style={{ 
            marginTop: '24px', 
            display: 'flex', 
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Button 
              size="large"
              onClick={() => {
                setBusinessLicenseUploadVisible(false);
                setAiRecognizing(false);
                setRecognitionSuccess(false);
              }}
              style={{ minWidth: '100px' }}
              disabled={aiRecognizing}
            >
              取消
            </Button>
            {!aiRecognizing && !recognitionSuccess && (
              <Upload
                accept="image/*,.pdf"
                beforeUpload={handleBusinessLicenseUpload}
                showUploadList={false}
              >
                <Button 
                  type="primary" 
                  size="large"
                  icon={<IconUpload />}
                  style={{ minWidth: '120px' }}
                >
                  选择文件
                </Button>
              </Upload>
            )}
          </div>
        </div>
      </Modal>
    </Card>
  );

  // 联系人Tab内容
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
                    {record.isReconciliationContact && (
                      <Tag color="blue">
                        对账联系人
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
              <div>删除后将无法恢复，请谨慎操作</div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );

  // 关联用户Tab内容
  const RelatedUsersTab = () => (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title heading={6} style={{ margin: 0 }}>
          关联用户 ({relatedUsers.length})
        </Title>
        <Space>
          <Button 
            icon={<IconPlus />}
            onClick={handleAddUser}
          >
            新增用户
          </Button>
          <Button 
            type="primary"
            icon={<IconSync />}
            onClick={handleThirdPartySync}
          >
            第三方同步
          </Button>
        </Space>
      </div>
      <Table
        data={relatedUsers}
        columns={[
          {
            title: '用户ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (id) => (
              <Text style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                {id}
              </Text>
            )
          },
          {
            title: '用户信息',
            dataIndex: 'username',
            key: 'username',
            width: 200,
            render: (_, record) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar size={32} style={{ backgroundColor: '#165DFF' }}>
                  <IconUser />
                </Avatar>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {record.username}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {record.email}
                  </Text>
                </div>
              </div>
            )
          },
          {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
            width: 140,
            render: (phone) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IconPhone style={{ fontSize: '12px', color: '#86909C' }} />
                <Text copyable={{ text: phone }} style={{ fontSize: '12px' }}>
                  {phone}
                </Text>
              </div>
            )
          },
          {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            render: (role) => getRoleTag(role)
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 90,
            render: (status) => getStatusTag(status)
          },
          {
            title: '最后登录',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            width: 160,
            render: (lastLogin) => (
              <Text style={{ fontSize: '12px' }}>
                {lastLogin}
              </Text>
            )
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            render: (createTime) => (
              <Text style={{ fontSize: '12px' }}>
                {createTime}
              </Text>
            )
          },
          {
            title: '操作',
            key: 'actions',
            width: 140,
            render: (_, record) => (
              <Space>
                <Button 
                  type="text" 
                  size="small"
                  onClick={() => handleViewUserDetail(record)}
                >
                  详情
                </Button>
                {record.role === 'user' && (
                  <Button 
                    type="text" 
                    size="small"
                    style={{ color: '#165DFF' }}
                    onClick={() => handleSetAdmin(record)}
                  >
                    设置管理员
                  </Button>
                )}
                <Button 
                  type="text" 
                  size="small" 
                  status="danger"
                  onClick={() => handleRemoveUser(record)}
                >
                  移除
                </Button>
              </Space>
            )
          }
        ]}
        pagination={false}
        border
        scroll={{ x: 1130 }}
      />

      {/* 第三方同步弹窗 */}
      <Modal
        title="第三方用户同步"
        visible={syncModalVisible}
        onCancel={() => {
          if (!syncing) {
            setSyncModalVisible(false);
            syncForm.resetFields();
          }
        }}
        onOk={handleSyncSubmit}
        okText="开始同步"
        cancelText="取消"
        confirmLoading={syncing}
        closable={!syncing}
        maskClosable={!syncing}
        style={{ width: '500px' }}
      >
        {syncing ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #E5E6EB',
              borderTop: '3px solid #165DFF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <Text style={{ fontSize: '16px', color: '#165DFF' }}>
              正在同步用户数据，请稍候...
            </Text>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              预计需要5秒钟完成同步
            </Text>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : (
          <Form
            form={syncForm}
            layout="vertical"
            autoComplete="off"
          >
                         <Form.Item
               label="选择第三方系统"
               field="systemId"
               rules={[{ required: true, message: '请选择要同步的第三方系统' }]}
             >
               <Select 
                 placeholder="请选择已授权的第三方系统"
                 dropdownMenuStyle={{ 
                   maxHeight: '300px'
                 }}
                 showSearch={false}
                 size="large"
               >
                 {thirdPartySystems
                   .filter(system => system.status === 'active')
                   .map(system => (
                     <Option key={system.id} value={system.id}>
                       <div style={{ 
                         display: 'flex', 
                         alignItems: 'center', 
                         gap: '12px',
                         padding: '8px 4px',
                         minHeight: '56px'
                       }}>
                         <Avatar size={32} style={{ backgroundColor: '#165DFF' }}>
                           <IconFile />
                         </Avatar>
                         <div style={{ flex: 1 }}>
                           <div style={{ 
                             fontWeight: 'bold', 
                             fontSize: '14px',
                             marginBottom: '4px',
                             color: '#1D2129'
                           }}>
                             {system.systemName}
                           </div>
                           <div style={{ 
                             display: 'flex', 
                             alignItems: 'center', 
                             gap: '8px'
                           }}>
                             {getSystemTypeTag(system.systemType)}
                             <Text type="secondary" style={{ fontSize: '12px' }}>
                               ID: {system.systemId}
                             </Text>
                           </div>
                         </div>
                       </div>
                     </Option>
                   ))}
               </Select>
             </Form.Item>
            
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#F7F8FA', 
              border: '1px solid #E5E6EB',
              borderRadius: '6px',
              marginTop: '16px'
            }}>
              <Text style={{ fontSize: '13px', color: '#86909C' }}>
                💡 同步说明：系统将从选定的第三方系统中获取用户数据，并自动匹配到企业关联用户列表中。同步过程可能需要几秒钟时间。
              </Text>
            </div>
          </Form>
                 )}
       </Modal>

       {/* 用户详情弹窗 */}
       <Modal
         title="用户详情"
         visible={userDetailModalVisible}
         onCancel={() => {
           setUserDetailModalVisible(false);
           setCurrentViewingUser(null);
         }}
         footer={
           <Button type="primary" onClick={() => setUserDetailModalVisible(false)}>
             确定
           </Button>
         }
         style={{ width: 600 }}
       >
         {currentViewingUser && (
           <div style={{ padding: '16px 0' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px 24px', alignItems: 'center' }}>
               <Text type="secondary">用户头像：</Text>
               <div>
                 <Avatar size={60} style={{ backgroundColor: '#165DFF' }}>
                   <IconUser />
                 </Avatar>
               </div>

               <Text type="secondary">用户名：</Text>
               <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentViewingUser.username}</Text>

               <Text type="secondary">邮箱地址：</Text>
               <Text copyable={{ text: currentViewingUser.email }}>{currentViewingUser.email}</Text>

               <Text type="secondary">手机号：</Text>
               <Text copyable={{ text: currentViewingUser.phone }}>{currentViewingUser.phone}</Text>

               <Text type="secondary">用户角色：</Text>
               <div>{getRoleTag(currentViewingUser.role)}</div>

               <Text type="secondary">用户状态：</Text>
               <div>{getStatusTag(currentViewingUser.status)}</div>

               <Text type="secondary">最后登录：</Text>
               <Text>{currentViewingUser.lastLogin}</Text>

               <Text type="secondary">创建时间：</Text>
               <Text>{currentViewingUser.createTime}</Text>

               <Text type="secondary">用户ID：</Text>
               <Text copyable={{ text: currentViewingUser.id }} style={{ fontFamily: 'monospace' }}>
                 {currentViewingUser.id}
               </Text>

               <Text type="secondary">第三方用户ID：</Text>
               <div>
                 {currentViewingUser.thirdPartyUserIds && Object.keys(currentViewingUser.thirdPartyUserIds).length > 0 ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     {Object.entries(currentViewingUser.thirdPartyUserIds).map(([systemName, userId]) => (
                       <div key={systemName} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <Tag color="blue" style={{ minWidth: '80px', textAlign: 'center' }}>
                           {systemName}
                         </Tag>
                         <Text copyable={{ text: userId }} style={{ fontFamily: 'monospace' }}>
                           {userId}
                         </Text>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <Text type="secondary">暂无关联</Text>
                 )}
               </div>
             </div>
           </div>
         )}
       </Modal>

       {/* 移除用户确认弹窗 */}
       <Modal
         title="移除用户确认"
         visible={removeUserModalVisible}
         onCancel={() => {
           setRemoveUserModalVisible(false);
           setTargetRemoveUser(null);
         }}
         footer={[
           <Button key="cancel" onClick={() => {
             setRemoveUserModalVisible(false);
             setTargetRemoveUser(null);
           }}>
             取消
           </Button>,
           <Button key="confirm" type="primary" status="danger" onClick={handleConfirmRemoveUser}>
             确定移除
           </Button>
         ]}
       >
         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <IconExclamationCircleFill style={{ color: '#F53F3F', fontSize: '16px' }} />
             <Text>确定要移除用户 <Text style={{ color: '#F53F3F', fontWeight: 'bold' }}>{targetRemoveUser?.username}</Text> 吗？</Text>
           </div>
           
           <div style={{ 
             padding: '12px', 
             backgroundColor: '#FFF7E6', 
             border: '1px solid #FFD666',
             borderRadius: '6px'
           }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
               <IconExclamation style={{ color: '#FF7D00', fontSize: '14px' }} />
               <Text style={{ color: '#FF7D00', fontWeight: 'bold', fontSize: '14px' }}>注意</Text>
             </div>
             <Text style={{ color: '#86909C', fontSize: '13px' }}>
               移除后该用户将无法访问该企业的相关功能，此操作不可撤销。
             </Text>
           </div>
         </div>
       </Modal>

       {/* 新增用户弹窗 */}
       <Modal
         title="新增用户"
         visible={addUserModalVisible}
         onCancel={() => {
           setAddUserModalVisible(false);
           setSelectedUsers([]);
         }}
         footer={[
           <Button key="cancel" onClick={() => {
             setAddUserModalVisible(false);
             setSelectedUsers([]);
           }}>
             取消
           </Button>,
           <Button key="confirm" type="primary" onClick={handleConfirmAddUser}>
             确定添加 ({selectedUsers.length})
           </Button>
         ]}
         style={{ width: '800px' }}
       >
         <div style={{ marginBottom: '16px' }}>
           <Text type="secondary">请从下列用户中选择要添加到企业的用户：</Text>
         </div>
         
         <Table
           data={availableUsers}
           rowSelection={{
             type: 'checkbox',
             selectedRowKeys: selectedUsers,
             onChange: (selectedRowKeys) => {
               setSelectedUsers(selectedRowKeys as string[]);
             }
           }}
           columns={[
             {
               title: '用户信息',
               dataIndex: 'username',
               key: 'username',
               width: 300,
               render: (_, record) => (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <Avatar size={32} style={{ backgroundColor: '#165DFF' }}>
                     <IconUser />
                   </Avatar>
                   <div>
                     <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                       {record.username}
                     </div>
                     <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                       ID: {record.id}
                     </Text>
                   </div>
                 </div>
               )
             },
             {
               title: '联系方式',
               dataIndex: 'contact',
               key: 'contact',
               width: 200,
               render: (_, record) => (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <IconPhone style={{ fontSize: '12px', color: '#86909C' }} />
                     <Text style={{ fontSize: '12px' }}>{record.phone}</Text>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <IconEmail style={{ fontSize: '12px', color: '#86909C' }} />
                     <Text style={{ fontSize: '12px' }}>{record.email}</Text>
                   </div>
                 </div>
               )
             },
             {
               title: '状态',
               dataIndex: 'status',
               key: 'status',
               width: 90,
               render: (status) => getStatusTag(status)
             },
             {
               title: '最后登录',
               dataIndex: 'lastLogin',
               key: 'lastLogin',
               width: 140,
               render: (lastLogin) => (
                 <Text style={{ fontSize: '12px' }}>
                   {lastLogin}
                 </Text>
               )
             }
           ]}
           pagination={false}
           border
           scroll={{ x: 730 }}
           style={{ maxHeight: '400px', overflow: 'auto' }}
         />
         
         {selectedUsers.length > 0 && (
           <div style={{ 
             marginTop: '16px', 
             padding: '12px', 
             backgroundColor: '#F8F9FF', 
             border: '1px solid #E5E6EB',
             borderRadius: '6px'
           }}>
             <Text style={{ color: '#165DFF', fontWeight: 'bold' }}>
               已选择 {selectedUsers.length} 个用户
             </Text>
             <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
               {selectedUsers.map(userId => {
                 const user = availableUsers.find(u => u.id === userId);
                 return user ? (
                   <Tag key={userId} color="blue" style={{ margin: 0 }}>
                     {user.id} | {user.username} | {user.phone} | {user.email}
                   </Tag>
                 ) : null;
               })}
             </div>
           </div>
         )}
       </Modal>
     </Card>
   );

  // 已授权产品Tab内容
  const AuthorizedProductsTab = () => (
    <Card title={`已授权产品 (${authorizedProducts.filter(p => p.enabled).length}/${authorizedProducts.length})`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {authorizedProducts.map(product => (
          <Card 
            key={product.id}
            style={{ 
              border: `2px solid ${product.enabled ? '#165DFF' : '#E5E6EB'}`,
              backgroundColor: product.enabled ? '#F8F9FF' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <Title heading={6} style={{ margin: 0, marginBottom: '4px' }}>
                  {product.name}
                </Title>
                <Tag color={product.enabled ? 'green' : 'red'}>
                  {product.enabled ? '已启用' : '已停用'}
                </Tag>
              </div>
              <Switch
                checked={product.enabled}
                onChange={(checked) => handleProductToggle(product.id, checked)}
              />
            </div>
            
            <Text type="secondary" style={{ fontSize: '13px', marginBottom: '12px', display: 'block' }}>
              {product.description}
            </Text>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <Text type="secondary">到期时间</Text>
              <Text style={{ color: product.enabled ? '#165DFF' : '#86909C' }}>
                {product.expireDate}
              </Text>
            </div>
          </Card>
        ))}
      </div>

      {/* 产品开关确认弹窗 */}
      <Modal
        title="产品授权确认"
        visible={productToggleModalVisible}
        onCancel={() => {
          setProductToggleModalVisible(false);
          setTargetProduct(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setProductToggleModalVisible(false);
            setTargetProduct(null);
          }}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmProductToggle}>
            确定{targetProduct?.enabled ? '启用' : '停用'}
          </Button>
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconExclamationCircleFill style={{ color: '#165DFF', fontSize: '16px' }} />
            <Text>
              确定要{targetProduct?.enabled ? '启用' : '停用'}产品 
              <Text style={{ color: '#165DFF', fontWeight: 'bold' }}> {targetProduct?.product.name} </Text>
              吗？
            </Text>
          </div>
          
          {targetProduct?.enabled ? (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#F8F9FF', 
              border: '1px solid #B8D4FF',
              borderRadius: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <IconExclamation style={{ color: '#165DFF', fontSize: '14px' }} />
                <Text style={{ color: '#165DFF', fontWeight: 'bold', fontSize: '14px' }}>启用说明</Text>
              </div>
              <Text style={{ color: '#86909C', fontSize: '13px' }}>
                启用后，该企业将可以使用此产品的所有功能，直到产品到期时间：{targetProduct?.product.expireDate}
              </Text>
            </div>
          ) : (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#FFF7E6', 
              border: '1px solid #FFD666',
              borderRadius: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <IconExclamation style={{ color: '#FF7D00', fontSize: '14px' }} />
                <Text style={{ color: '#FF7D00', fontWeight: 'bold', fontSize: '14px' }}>停用警告</Text>
              </div>
              <Text style={{ color: '#86909C', fontSize: '13px' }}>
                停用后，该企业将无法使用此产品的任何功能，请确认是否继续操作。
              </Text>
            </div>
          )}
        </div>
      </Modal>
    </Card>
  );

  // 财务信息Tab内容
  const FinancialInfoTab = () => {
    const reconciliationContact = contacts.find(c => c.id === financialData.reconciliationContactId);
    
    if (!financialEditMode) {
      // 非编辑态 - 显示模式
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* 开票信息栏 */}
          <Card title="开票信息" 
                extra={
                  <Button type="text" size="small" onClick={() => copyToClipboard(
                    `公司名称：${financialData.invoiceCompanyName}\n税号：${financialData.invoiceTaxNumber}\n地址：${financialData.invoiceAddress}\n电话：${financialData.invoicePhone}\n开户行：${financialData.invoiceBankName}\n账号：${financialData.invoiceBankAccount}`,
                    "开票信息"
                  )}>
                    复制全部
                  </Button>
                }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">公司名称：</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text copyable={{ text: financialData.invoiceCompanyName }}>{financialData.invoiceCompanyName || '-'}</Text>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">税务登记号：</Text>
                <Text copyable={{ text: financialData.invoiceTaxNumber }}>{financialData.invoiceTaxNumber || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">开票地址：</Text>
                <Text copyable={{ text: financialData.invoiceAddress }}>{financialData.invoiceAddress || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">开票电话：</Text>
                <Text copyable={{ text: financialData.invoicePhone }}>{financialData.invoicePhone || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">开户银行：</Text>
                <Text copyable={{ text: financialData.invoiceBankName }}>{financialData.invoiceBankName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行账号：</Text>
                <Text copyable={{ text: financialData.invoiceBankAccount }}>{financialData.invoiceBankAccount || '-'}</Text>
              </div>
            </div>
          </Card>

          {/* 人民币账户栏 */}
          <Card title="人民币账户" 
                extra={
                  <Button type="text" size="small" onClick={() => copyToClipboard(
                    `银行名称：${financialData.cnyBankName}\n账号：${financialData.cnyBankAccount}\n账户名：${financialData.cnyAccountName}\nSWIFT：${financialData.cnySwiftCode}\n银行地址：${financialData.cnyBankAddress}`,
                    "人民币账户信息"
                  )}>
                    复制全部
                  </Button>
                }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行名称：</Text>
                <Text copyable={{ text: financialData.cnyBankName }}>{financialData.cnyBankName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行账号：</Text>
                <Text copyable={{ text: financialData.cnyBankAccount }}>{financialData.cnyBankAccount || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">账户名称：</Text>
                <Text copyable={{ text: financialData.cnyAccountName }}>{financialData.cnyAccountName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">SWIFT代码：</Text>
                <Text copyable={{ text: financialData.cnySwiftCode }}>{financialData.cnySwiftCode || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行地址：</Text>
                <Text copyable={{ text: financialData.cnyBankAddress }}>{financialData.cnyBankAddress || '-'}</Text>
              </div>
            </div>
          </Card>

          {/* 美金账户栏 */}
          <Card title="美金账户" 
                extra={
                  <Button type="text" size="small" onClick={() => copyToClipboard(
                    `银行名称：${financialData.usdBankName}\n账号：${financialData.usdBankAccount}\n账户名：${financialData.usdAccountName}\nSWIFT：${financialData.usdSwiftCode}\n银行地址：${financialData.usdBankAddress}`,
                    "美金账户信息"
                  )}>
                    复制全部
                  </Button>
                }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行名称：</Text>
                <Text copyable={{ text: financialData.usdBankName }}>{financialData.usdBankName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行账号：</Text>
                <Text copyable={{ text: financialData.usdBankAccount }}>{financialData.usdBankAccount || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">账户名称：</Text>
                <Text copyable={{ text: financialData.usdAccountName }}>{financialData.usdAccountName || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">SWIFT代码：</Text>
                <Text copyable={{ text: financialData.usdSwiftCode }}>{financialData.usdSwiftCode || '-'}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">银行地址：</Text>
                <Text copyable={{ text: financialData.usdBankAddress }}>{financialData.usdBankAddress || '-'}</Text>
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

  // 绑定第三方系统Tab内容
  const ThirdPartySystemTab = () => (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title heading={6} style={{ margin: 0 }}>
          授权第三方系统 ({thirdPartySystems.length})
        </Title>
        <Button 
          type="primary" 
          icon={<IconPlus />}
          onClick={handleAddThirdParty}
        >
          新增授权
        </Button>
      </div>
      
      <Table
        data={thirdPartySystems}
        columns={[
          {
            title: '系统信息',
            dataIndex: 'systemName',
            key: 'systemName',
            width: 200,
            render: (_, record) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar size={32} style={{ backgroundColor: '#165DFF' }}>
                  <IconFile />
                </Avatar>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {record.systemName}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    ID: {record.systemId}
                  </Text>
                </div>
              </div>
            )
          },
          {
            title: '系统类型',
            dataIndex: 'systemType',
            key: 'systemType',
            width: 120,
            render: (type) => getSystemTypeTag(type)
          },
          {
            title: '访问密钥',
            dataIndex: 'accessKey',
            key: 'accessKey',
            width: 160,
            render: (accessKey) => (
              <Text copyable={{ text: accessKey }} style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                {accessKey.substring(0, 12)}...
              </Text>
            )
          },
          {
            title: '密钥',
            dataIndex: 'secretKey', 
            key: 'secretKey',
            width: 160,
            render: (secretKey) => (
              <Text copyable={{ text: secretKey }} style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                ****{secretKey.substring(secretKey.length - 4)}
              </Text>
            )
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => getThirdPartyStatusTag(status)
          },
          {
            title: '最后同步时间',
            dataIndex: 'lastSyncTime',
            key: 'lastSyncTime',
            width: 160,
            render: (lastSyncTime) => (
              <Text style={{ fontSize: '12px' }}>
                {lastSyncTime || '-'}
              </Text>
            )
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            render: (createTime) => (
              <Text style={{ fontSize: '12px' }}>
                {createTime}
              </Text>
            )
          },
          {
            title: '操作',
            key: 'actions',
            width: 180,
            render: (_, record) => (
              <Space>
                <Button 
                  type="text" 
                  size="small"
                  onClick={() => handleViewThirdParty(record)}
                >
                  详情
                </Button>
                <Button 
                  type="text" 
                  size="small"
                  onClick={() => handleEditThirdParty(record)}
                >
                  编辑
                </Button>
                <Button 
                  type="text" 
                  size="small" 
                  status="danger"
                  onClick={() => handleDeleteThirdParty(record.id)}
                >
                  解除授权
                </Button>
              </Space>
            )
          }
        ]}
        pagination={false}
        border
        scroll={{ x: 1200 }}
      />

      {/* 第三方系统表单弹窗 */}
      <Modal
        title={viewingThirdParty ? '查看第三方系统详情' : (editingThirdParty ? '编辑第三方系统' : '新增授权')}
        visible={thirdPartyModalVisible}
        onCancel={() => {
          setThirdPartyModalVisible(false);
          setEditingThirdParty(null);
          setViewingThirdParty(null);
        }}
                  onOk={viewingThirdParty ? undefined : handleThirdPartySubmit}
          okText={editingThirdParty ? '更新' : '添加'}
          cancelText={viewingThirdParty ? '关闭' : '取消'}
          footer={viewingThirdParty ? [
            <Button key="cancel" onClick={() => {
              setThirdPartyModalVisible(false);
              setViewingThirdParty(null);
            }}>
              关闭
            </Button>
          ] : undefined}
        style={{ width: '600px' }}
      >
        <Form
          form={thirdPartyForm}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="第三方系统名称"
            field="systemName"
            rules={[{ required: true, message: '请选择第三方系统名称' }]}
          >
            <Select 
              placeholder="请选择第三方系统"
              disabled={!!viewingThirdParty}
            >
              <Option value="CargoWare">CargoWare</Option>
              <Option value="eTower">eTower</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="第三方系统ID"
            field="systemId"
            rules={[{ required: true, message: '请输入第三方系统ID' }]}
          >
            <Input 
              placeholder="请输入第三方系统唯一标识ID" 
              disabled={!!viewingThirdParty}
            />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="第三方AK (Access Key)"
              field="accessKey"
              rules={[{ required: true, message: '请输入访问密钥' }]}
            >
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <Input 
                    placeholder="请输入Access Key" 
                    disabled={!!viewingThirdParty || !!editingThirdParty}
                  />
                </div>
                {!viewingThirdParty && !editingThirdParty && (
                  <Button onClick={handleGenerateKeys}>生成</Button>
                )}
                {editingThirdParty && (
                  <Button onClick={handleResetKeys}>重置</Button>
                )}
              </div>
            </Form.Item>

            <Form.Item
              label="第三方SK (Secret Key)"
              field="secretKey"
              rules={[{ required: true, message: '请输入私有密钥' }]}
            >
              <Input.Password 
                placeholder="请输入Secret Key" 
                disabled={!!viewingThirdParty || !!editingThirdParty}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="第三方系统类型"
            field="systemType"
            rules={[{ required: true, message: '请选择第三方系统类型' }]}
          >
            <Select 
              placeholder="请选择系统类型"
              disabled={!!viewingThirdParty}
            >
              <Option value="ERP">ERP系统</Option>
              <Option value="WMS">WMS系统</Option>
              <Option value="TMS">TMS系统</Option>
              <Option value="OMS">OMS系统</Option>
              <Option value="CRM">CRM系统</Option>
              <Option value="FMS">FMS系统</Option>
              <Option value="OTHER">其他系统</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );

  // WTF信息Tab内容
  const WTFInfoTab = () => (
    <Card>
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 0',
        color: '#86909C'
      }}>
        <Title heading={4} style={{ color: '#86909C', marginBottom: '8px' }}>
          WTF信息
        </Title>
        <Text type="secondary">
          此页签内容正在开发中，敬请期待...
        </Text>
      </div>
    </Card>
  );

  return (
    <div>
      {/* 面包屑导航 */}
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item>控制塔</Breadcrumb.Item>
          <Breadcrumb.Item 
            onClick={() => navigate('/controltower/company-profile')}
            style={{ cursor: 'pointer', color: '#165DFF' }}
          >
            企业信息
          </Breadcrumb.Item>
          <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
        </Breadcrumb>
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
          <Button onClick={() => navigate('/controltower/company-profile')}>
            取消
          </Button>
          <Button
            type="primary"
            icon={<IconSave />}
            loading={loading}
            onClick={handleSave}
          >
            保存
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
        <TabPane key="contacts" title="联系人">
          <ContactTab />
        </TabPane>
        <TabPane key="users" title="关联用户">
          <RelatedUsersTab />
        </TabPane>
        <TabPane key="products" title="已授权产品">
          <AuthorizedProductsTab />
        </TabPane>
        <TabPane key="financial" title="财务信息">
          <FinancialInfoTab />
        </TabPane>
        <TabPane key="thirdparty" title="授权第三方系统">
          <ThirdPartySystemTab />
        </TabPane>
        <TabPane key="wtf" title="WTF信息">
          <WTFInfoTab />
        </TabPane>
      </Tabs>

      {/* 设置管理员确认弹窗 */}
      <Modal
        title="设置超级管理员"
        visible={setAdminModalVisible}
        onCancel={() => {
          setSetAdminModalVisible(false);
          setTargetUser(null);
        }}
        onOk={handleConfirmSetAdmin}
        okText="确定设置"
        cancelText="取消"
        okButtonProps={{ status: 'warning' }}
      >
        <div style={{ padding: '8px 0' }}>
          <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
            每家租户只能有一个超级管理员，设置 <Text bold style={{ color: '#165DFF' }}>{targetUser?.username}</Text> 为超级管理员后，
            原先的超级管理员将被撤销，改为普通用户权限。
          </Text>
          
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            backgroundColor: '#FFF7E6', 
            border: '1px solid #FFD591',
            borderRadius: '6px'
          }}>
            <Text style={{ fontSize: '13px', color: '#D25F00' }}>
              ⚠️ 此操作将影响企业内用户的权限分配，请谨慎操作。
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyDataManagement; 