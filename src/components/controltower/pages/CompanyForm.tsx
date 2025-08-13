import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  IconSettings

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
  name: string;
  englishName: string;
  businessLicense: string;
  description: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  // 五级行政区划
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
  systemType: string;
  status: 'active' | 'inactive';
  createTime: string;
  lastSyncTime?: string;
}

interface Coordinator {
  id: string;
  type: string;
  staffId: string;
  name: string;
  phone: string;
  email: string;
}

/**
 * 角色信息接口
 */
interface RoleInfo {
  id: number;
  roleName: string;
  roleCode: string;
  description: string;
  status: boolean;
  createTime: string;
  updateTime: string;
}

const CompanyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEdit = Boolean(id && id !== 'add');
  const pageTitle = isEdit ? '编辑企业' : '添加企业';

  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [financialForm] = Form.useForm();
  const [coordinatorForm] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  // 基本信息状态
  const [, setCompanyData] = useState<CompanyFormData>({
    name: '',
    englishName: '',
    businessLicense: '',
    description: '',
    status: 'pending',
    province: '',
    city: '',
    district: '',
    street: '',
    detailAddress: ''
  });

  // 联系人状态
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactPerson | null>(null);

  // 关联用户状态
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

  // 财务信息状态
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
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
  const [isFinancialEditing, setIsFinancialEditing] = useState(false);

  // 对接人状态
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [coordinatorModalVisible, setCoordinatorModalVisible] = useState(false);
  const [editingCoordinator, setEditingCoordinator] = useState<Coordinator | null>(null);

  // 用户管理状态
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RelatedUser | null>(null);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userDetailModalVisible, setUserDetailModalVisible] = useState(false);
  const [currentViewingUser, setCurrentViewingUser] = useState<RelatedUser | null>(null);

  // 营业执照状态
  const [businessLicenseModalVisible, setBusinessLicenseModalVisible] = useState(false);
  const [businessLicenseUploadVisible, setBusinessLicenseUploadVisible] = useState(false);
  const [aiRecognizing, setAiRecognizing] = useState(false);
  const [recognitionSuccess, setRecognitionSuccess] = useState(false);

  // 角色配置相关状态
  const [assignedRoles, setAssignedRoles] = useState<RoleInfo[]>([]);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<RoleInfo[]>([]);

  // 第三方系统数据
  const [] = useState<ThirdPartySystem[]>([
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

  // mock员工数据
  const mockStaffList = [
    { id: '1', name: '王小明', role: '销售', phone: '13800138001', email: 'xiaoming@company.com' },
    { id: '2', name: '李小红', role: '客服', phone: '13800138002', email: 'xiaohong@company.com' },
    { id: '3', name: '张三', role: '单证', phone: '13800138003', email: 'zhangsan@company.com' },
    { id: '4', name: '赵四', role: '商务', phone: '13800138004', email: 'zhaosi@company.com' },
    { id: '5', name: '钱五', role: '操作', phone: '13800138005', email: 'qianwu@company.com' },
  ];

  // 模拟角色数据（来自角色权限管理）
  const mockRoleList: RoleInfo[] = [
    {
      id: 1,
      roleName: '同行客户',
      roleCode: 'PEER_CUSTOMER',
      description: '同行业客户角色，负责同行业务合作与协调',
      status: true,
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      roleName: '贸易公司',
      roleCode: 'TRADING_COMPANY',
      description: '贸易公司角色，负责进出口贸易业务管理',
      status: true,
      createTime: '2024-01-16 09:20:00',
      updateTime: '2024-01-16 09:20:00'
    },
    {
      id: 3,
      roleName: '工厂',
      roleCode: 'FACTORY',
      description: '工厂角色，负责生产制造相关业务',
      status: true,
      createTime: '2024-01-17 14:15:00',
      updateTime: '2024-01-17 14:15:00'
    },
    {
      id: 4,
      roleName: '电商客户',
      roleCode: 'ECOMMERCE_CUSTOMER',
      description: '电商客户角色，负责电商平台业务管理',
      status: false,
      createTime: '2024-01-18 11:30:00',
      updateTime: '2024-01-18 11:30:00'
    },
    {
      id: 5,
      roleName: '车队',
      roleCode: 'FLEET',
      description: '车队角色，负责运输车队管理与调度',
      status: true,
      createTime: '2024-01-19 08:45:00',
      updateTime: '2024-01-19 08:45:00'
    },
    {
      id: 6,
      roleName: '报关行',
      roleCode: 'CUSTOMS_BROKER',
      description: '报关行角色，负责海关报关业务处理',
      status: true,
      createTime: '2024-01-20 13:20:00',
      updateTime: '2024-01-20 13:20:00'
    },
    {
      id: 7,
      roleName: '同行一代',
      roleCode: 'PEER_AGENT',
      description: '同行一级代理角色，负责同行代理业务',
      status: false,
      createTime: '2024-01-21 16:10:00',
      updateTime: '2024-01-21 16:10:00'
    },
    {
      id: 8,
      roleName: '订舱代理',
      roleCode: 'BOOKING_AGENT',
      description: '订舱代理角色，负责船舶订舱业务代理',
      status: true,
      createTime: '2024-01-22 10:05:00',
      updateTime: '2024-01-22 10:05:00'
    },
    {
      id: 9,
      roleName: '目的港代理',
      roleCode: 'DESTINATION_AGENT',
      description: '目的港代理角色，负责目的港口业务代理',
      status: true,
      createTime: '2024-01-23 15:30:00',
      updateTime: '2024-01-23 15:30:00'
    },
    {
      id: 10,
      roleName: '海外仓',
      roleCode: 'OVERSEAS_WAREHOUSE',
      description: '海外仓角色，负责海外仓储管理与运营',
      status: false,
      createTime: '2024-01-24 12:15:00',
      updateTime: '2024-01-24 12:15:00'
    }
  ];
  
  const coordinatorTypes = [
    { value: 'sales', label: '专属销售' },
    { value: 'service', label: '专属客服' },
    { value: 'doc', label: '专属单证' },
    { value: 'biz', label: '专属商务' },
    { value: 'ops', label: '专属操作' },
  ];

  const handleAddCoordinator = () => {
    setEditingCoordinator(null);
    coordinatorForm.resetFields();
    setCoordinatorModalVisible(true);
  };
  
  const handleEditCoordinator = (item: Coordinator) => {
    setEditingCoordinator(item);
    coordinatorForm.setFieldsValue(item);
    setCoordinatorModalVisible(true);
  };
  
  const handleDeleteCoordinator = (id: string) => {
    setCoordinators(prev => prev.filter(c => c.id !== id));
    Message.success('已删除对接人');
  };
  
  const handleCoordinatorSubmit = () => {
    coordinatorForm.validate().then(values => {
      if (editingCoordinator) {
        setCoordinators(prev => prev.map(c => c.id === editingCoordinator.id ? { ...c, ...values } : c));
        Message.success('对接人信息已更新');
      } else {
        const staff = mockStaffList.find(s => s.id === values.staffId);
        setCoordinators(prev => [...prev, { 
          ...values, 
          id: Date.now().toString(), 
          name: staff?.name || '', 
          phone: staff?.phone || '', 
          email: staff?.email || '' 
        }]);
        Message.success('对接人已添加');
      }
      setCoordinatorModalVisible(false);
      setEditingCoordinator(null);
      coordinatorForm.resetFields();
    });
  };

  /**
   * 处理添加角色
   */
  const handleAddRole = () => {
    setRoleModalVisible(true);
  };

  /**
   * 处理删除角色
   */
  const handleRemoveRole = (roleId: number) => {
    if (assignedRoles.length <= 1) {
      Message.warning('至少需要保留一个角色');
      return;
    }
    setAssignedRoles(prev => prev.filter(role => role.id !== roleId));
    Message.success('角色已移除');
  };

  /**
   * 处理角色选择确认
   */
  const handleRoleConfirm = (selectedRoleIds: number[]) => {
    const newRoles = mockRoleList.filter(role => 
      selectedRoleIds.includes(role.id) && !assignedRoles.some(assigned => assigned.id === role.id)
    );
    setAssignedRoles(prev => [...prev, ...newRoles]);
    setRoleModalVisible(false);
    Message.success(`已添加 ${newRoles.length} 个角色`);
  };

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
        const mockData: CompanyFormData = {
          id: id,
          name: '货拉拉物流科技有限公司',
          englishName: 'Huolala Logistics Technology Co., Ltd.',
          businessLicense: '91110000123456789X',
          description: '专业的物流科技服务提供商，致力于为客户提供高效、便捷的物流解决方案。',
          status: 'active',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          street: '建国门外街道',
          detailAddress: '建国路88号SOHO现代城',
          businessLicenseFile: '/uploads/business-license-91110000123456789X.jpg',
          businessLicenseUploadTime: '2023-12-01 10:30:00'
        };
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
        setFinancialInfo(mockFinancial);
        financialForm.setFieldsValue(mockFinancial);

        // 模拟已分配的角色（编辑时）
        const mockAssignedRoles: RoleInfo[] = [
          mockRoleList[0], // 同行客户
          mockRoleList[1], // 贸易公司
        ];
        setAssignedRoles(mockAssignedRoles);

        setLoading(false);
      }, 1000);
    } else {
      // 新增时，默认分配同行客户角色
      setAssignedRoles([mockRoleList[0]]);
    }

    // 初始化可用角色列表
    setAvailableRoles(mockRoleList.filter(role => role.status));
  }, [id, isEdit, form, financialForm, location.search]);

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
        navigate('/controltower/company-management');
      }, 1000);
    }).catch((error) => {
      console.error('表单验证失败:', error);
    });
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
    Modal.confirm({
      title: '确定要删除这个联系人吗？',
      content: '删除后将无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setContacts(prev => prev.filter(c => c.id !== contactId));
        Message.success('联系人已删除');
      }
    });
  };

  const handleSetDefaultContact = (contactId: string) => {
    setContacts(prev => prev.map(contact => ({
      ...contact,
      isDefault: contact.id === contactId
    })));
    Message.success('已设置为默认联系人');
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
      setFinancialInfo(values);
      // 更新对账联系人标记
      if (values.reconciliationContactId) {
        updateReconciliationContact(values.reconciliationContactId);
      }
      setIsFinancialEditing(false);
      Message.success('财务信息已保存');
    }).catch((error) => {
      console.error('财务信息表单验证失败:', error);
    });
  };

  const handleFinancialEdit = () => {
    setIsFinancialEditing(true);
    financialForm.setFieldsValue(financialInfo);
  };

  const handleFinancialCancel = () => {
    setIsFinancialEditing(false);
    financialForm.resetFields();
  };

  const updateReconciliationContact = (contactId: string) => {
    // 更新财务数据中的对账联系人
    setFinancialInfo(prev => ({ ...prev, reconciliationContactId: contactId }));
    
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



  const handleSetAdmin = (user: RelatedUser) => {
    setSelectedUser(user);
    setAdminModalVisible(true);
  };

  const handleConfirmSetAdmin = () => {
    if (selectedUser) {
      // 更新用户角色：将目标用户设为超级管理员，其他超级管理员改为普通用户
      setRelatedUsers(prev => prev.map(user => ({
        ...user,
        role: user.id === selectedUser.id ? 'super_admin' : 
              (user.role === 'super_admin' ? 'user' : user.role)
      })));
      
      Message.success(`${selectedUser.username} 已设置为超级管理员`);
      setAdminModalVisible(false);
      setSelectedUser(null);
    }
  };

  const handleViewUserDetail = (user: RelatedUser) => {
    setCurrentViewingUser(user);
    setUserDetailModalVisible(true);
  };

  const handleRemoveUser = (user: RelatedUser) => {
    Modal.confirm({
      title: '确定要移除这个用户吗？',
      content: `移除后 ${user.username} 将无法访问该企业的相关功能`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setRelatedUsers(prev => prev.filter(u => u.id !== user.id));
        Message.success(`${user.username} 已从企业中移除`);
      }
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
              <Button 
                type="outline" 
                icon={<IconUpload />}
                onClick={() => setBusinessLicenseUploadVisible(true)}
                style={{ width: '120px' }}
              >
                上传执照
              </Button>
            )}
          </div>
        </Form.Item>

        {/* 五级行政区划 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
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
              {recognitionSuccess ? '关闭' : '取消'}
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
                <Button 
                  type="text" 
                  size="small" 
                  status="danger"
                  icon={<IconDelete />}
                  onClick={() => handleDeleteContact(record.id)}
                  disabled={contacts.length === 1}
                >
                  删除
                </Button>
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
            增加用户
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
                          <Text copyable={{ text: String(userId) }} style={{ fontFamily: 'monospace' }}>
                            {String(userId)}
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
     </Card>
   );

  // 财务信息Tab内容
  const FinancialInfoTab = () => {
    const reconciliationContact = contacts.find(c => c.id === financialInfo.reconciliationContactId);
    
    if (!isFinancialEditing) {
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

  // 对接人Tab内容
  const CoordinatorTab = () => (
    <Card>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <Title heading={6} style={{margin:0}}>对接人列表（{coordinators.length}）</Title>
        <Button type="primary" icon={<IconPlus />} onClick={handleAddCoordinator}>添加对接人</Button>
      </div>
      <Table
        data={coordinators}
        columns={[
          { title: '类型', dataIndex: 'type', render: (v: string) => coordinatorTypes.find(t => t.value === v)?.label },
          { title: '姓名', dataIndex: 'name' },
          { title: '手机号', dataIndex: 'phone' },
          { title: '邮箱', dataIndex: 'email' },
          { title: '操作', key: 'actions', render: (_: any, record: any) => (
            <Space>
              <Button type="text" size="small" onClick={() => handleEditCoordinator(record)}>编辑</Button>
              <Button type="text" size="small" status="danger" onClick={() => handleDeleteCoordinator(record.id)}>删除</Button>
            </Space>
          ) }
        ]}
        pagination={false}
        border
      />
      <Modal
        title={editingCoordinator ? '编辑对接人' : '添加对接人'}
        visible={coordinatorModalVisible}
        onCancel={() => { setCoordinatorModalVisible(false); setEditingCoordinator(null); coordinatorForm.resetFields(); }}
        onOk={handleCoordinatorSubmit}
        okText="确定"
        cancelText="取消"
      >
        <Form form={coordinatorForm} layout="vertical" autoComplete="off">
          <Form.Item label="对接类型" field="type" rules={[{ required: true, message: '请选择对接类型' }] }>
            <Select placeholder="请选择对接类型">
              {coordinatorTypes.map(t => <Option key={t.value} value={t.value}>{t.label}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="员工" field="staffId" rules={[{ required: true, message: '请选择员工' }] }>
            <Select placeholder="请选择员工">
              {mockStaffList.map(s => <Option key={s.id} value={s.id}>{s.name}（{s.role}）</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );

  // 客户等级Tab内容
  type RateTypeKey = 'fcl' | 'lcl' | 'air' | 'rail' | 'precarriage' | 'lastmile';
  const rateTypes: { key: RateTypeKey; label: string }[] = [
    { key: 'fcl', label: '海运整箱' },
    { key: 'lcl', label: '海运拼箱' },
    { key: 'air', label: '空运' },
    { key: 'rail', label: '铁路' },
    { key: 'precarriage', label: '港前' },
    { key: 'lastmile', label: '尾程' }
  ];
  const [customerRateLevel, setCustomerRateLevel] = useState<Record<RateTypeKey, string>>({
    fcl: 'T0',
    lcl: 'T0',
    air: 'T0',
    rail: 'T0',
    precarriage: 'T0',
    lastmile: 'T0'
  });
  const rateLevels = [
    { value: 'T0', label: 'T0' },
    { value: 'T1', label: 'T1' },
    { value: 'T2', label: 'T2' },
    { value: 'T3', label: 'T3' }
  ];

  const RateLevelTab = () => (
    <Card>
      <div style={{maxWidth: 480}}>
        <Form layout="vertical">
          {rateTypes.map((rt) => (
            <Form.Item key={rt.key} label={rt.label}>
              <Select
                value={customerRateLevel[rt.key]}
                onChange={val => setCustomerRateLevel(lv => ({ ...lv, [rt.key]: val }))}
                style={{ width: 120 }}
              >
                {rateLevels.map(lv => (
                  <Option key={lv.value} value={lv.value}>{lv.label}</Option>
                ))}
              </Select>
            </Form.Item>
          ))}
        </Form>
      </div>
      <div style={{color:'#999',marginTop:16}}>设置不同运价类型下，客户可见的运价等级。例如：海运整箱--T0，海运拼箱--T2</div>
    </Card>
  );

  /**
   * 角色配置Tab内容
   */
  const RoleConfigTab = () => (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title heading={6} style={{ margin: 0 }}>
          已分配角色（{assignedRoles.length}）
          <Text style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
            至少需要配置一个角色
          </Text>
        </Title>
        <Button 
          type="primary" 
          icon={<IconPlus />} 
          onClick={handleAddRole}
          disabled={assignedRoles.length >= availableRoles.length}
        >
          添加角色
        </Button>
      </div>

      {assignedRoles.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 0', 
          color: '#999',
          backgroundColor: '#fafafa',
          borderRadius: 6,
          border: '1px dashed #d9d9d9'
        }}>
          <IconSettings style={{ fontSize: 24, marginBottom: 8 }} />
          <div>暂无分配角色，请点击"添加角色"进行配置</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {assignedRoles.map((role) => (
            <Card 
              key={role.id}
              size="small"
              style={{ 
                border: '1px solid #e5e6eb',
                borderRadius: 8,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: 8 
                  }}>
                    <Text bold style={{ fontSize: 14, color: '#1d2129' }}>
                      {role.roleName}
                    </Text>
                    <Tag 
                      color="blue" 
                      size="small" 
                      style={{ marginLeft: 8 }}
                    >
                      {role.roleCode}
                    </Tag>
                  </div>
                  <Text style={{ 
                    fontSize: 12, 
                    color: '#86909c',
                    lineHeight: '1.4',
                    display: 'block',
                    marginBottom: 8
                  }}>
                    {role.description}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#c9cdd4' }}>
                    创建时间：{role.createTime}
                  </Text>
                </div>
                <Button
                  type="text"
                  size="mini"
                  status="danger"
                  icon={<IconDelete />}
                  onClick={() => handleRemoveRole(role.id)}
                  disabled={assignedRoles.length <= 1}
                  style={{ 
                    marginLeft: 8,
                    opacity: assignedRoles.length <= 1 ? 0.5 : 1
                  }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        backgroundColor: '#f7f8fa', 
        borderRadius: 6,
        fontSize: 12,
        color: '#86909c'
      }}>
        <div>💡 角色配置说明：</div>
        <div>• 每个企业至少需要配置一个角色</div>
        <div>• 可以从角色权限管理中选择已有角色进行分配</div>
        <div>• 角色权限由系统管理员在角色权限管理中统一配置</div>
        <div>• 企业用户将根据分配的角色获得相应的系统权限</div>
      </div>

      {/* 角色选择弹窗 */}
      <Modal
        title="选择角色"
        visible={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        onOk={() => {
          const selectedRoleIds = availableRoles
            .filter(role => !assignedRoles.some(assigned => assigned.id === role.id))
            .map(role => role.id);
          if (selectedRoleIds.length > 0) {
            handleRoleConfirm(selectedRoleIds);
          } else {
            Message.warning('没有可添加的角色');
          }
        }}
        okText="全部添加"
        cancelText="取消"
        style={{ width: 600 }}
      >
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {availableRoles
            .filter(role => !assignedRoles.some(assigned => assigned.id === role.id))
            .map((role) => (
              <Card 
                key={role.id}
                size="small"
                style={{ 
                  marginBottom: 12,
                  border: '1px solid #e5e6eb',
                  cursor: 'pointer'
                }}
                hoverable
                onClick={() => handleRoleConfirm([role.id])}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <Text bold style={{ fontSize: 14 }}>{role.roleName}</Text>
                      <Tag color="blue" size="small" style={{ marginLeft: 8 }}>
                        {role.roleCode}
                      </Tag>
                    </div>
                    <Text style={{ fontSize: 12, color: '#86909c' }}>
                      {role.description}
                    </Text>
                  </div>
                  <Button type="primary" size="mini">
                    添加
                  </Button>
                </div>
              </Card>
            ))}
          
          {availableRoles.filter(role => !assignedRoles.some(assigned => assigned.id === role.id)).length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 0', 
              color: '#999' 
            }}>
              所有可用角色都已分配
            </div>
          )}
        </div>
      </Modal>
    </Card>
  );

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

  return (
    <div>
      {/* 面包屑导航 */}
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item>平台运营后台</Breadcrumb.Item>
          <Breadcrumb.Item 
                              onClick={() => navigate('/controltower/company-management')}
            style={{ cursor: 'pointer', color: '#165DFF' }}
          >
            企业管理
          </Breadcrumb.Item>
          <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<IconArrowLeft />}
          onClick={() => navigate('/controltower/company-management')}
        >
          返回
        </Button>
        
        <Space>
          <Button onClick={() => navigate('/controltower/company-management')}>
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
        <TabPane key="contact" title="联系人">
          <ContactTab />
        </TabPane>
        <TabPane key="users" title="关联用户">
          <RelatedUsersTab />
        </TabPane>
        <TabPane key="financial" title="财务信息">
          <FinancialInfoTab />
        </TabPane>
        <TabPane key="coordinator" title="对接人">
          <CoordinatorTab />
        </TabPane>
        <TabPane key="rateLevel" title="客户等级">
          <RateLevelTab />
        </TabPane>
        <TabPane key="roles" title="角色配置">
          <RoleConfigTab />
        </TabPane>
      </Tabs>

      {/* 设置管理员确认弹窗 */}
      <Modal
        title="设置超级管理员"
        visible={adminModalVisible}
        onCancel={() => {
          setAdminModalVisible(false);
          setSelectedUser(null);
        }}
        onOk={handleConfirmSetAdmin}
        okText="确定设置"
        cancelText="取消"
        okButtonProps={{ status: 'warning' }}
      >
        <div style={{ padding: '8px 0' }}>
          <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
            每家租户只能有一个超级管理员，设置 <Text bold style={{ color: '#165DFF' }}>{selectedUser?.username}</Text> 为超级管理员后，
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

export default CompanyForm;