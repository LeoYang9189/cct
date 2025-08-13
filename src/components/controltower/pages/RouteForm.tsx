import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card,
  Button,
  Space,
  Form,
  Input,
  Select,
  Message,
  Typography,
  Grid,
  Tabs,
  DatePicker,

  Drawer
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSave,
  IconArrowLeft,
  IconDelete
} from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;
const { Row, Col } = Grid;

// 船代信息接口
interface AgentInfo {
  spaceSharing: string; // 共舱方
  slotAgent: string; // 舱位船代
  dangerousAgent: string; // 危险品船代
}

// 时间信息接口
interface TimeInfo {
  weekday: string; // 周几 (T-2, T-1, T+0 等)
  time: string; // 时间 (HH:mm)
}

// 港口信息接口
interface PortInfo {
  id: string; // 唯一标识
  port: string; // 港口
  terminal: string; // 挂靠码头
  cutoffDate: TimeInfo; // 截关日
  terrorismCutoff: TimeInfo; // 截反恐申报
  siCutoff: TimeInfo; // 截单
  vgmCutoff: TimeInfo; // 截VGM
  oogCutoff: TimeInfo; // 截OOG List
  dangerousCutoff: TimeInfo; // 截危申报
  agents: AgentInfo[]; // 船代信息列表
}

// 航线表单数据接口
interface RouteFormData {
  routeCode: string;
  routeName: string;
  alliance: string;
  spaceSharing: string[]; // 保留用于基础信息
  ports: PortInfo[]; // 港口信息列表
  status: 'enabled' | 'disabled';
}

// 联盟选项
const allianceOptions = [
  { value: 'GEMINI', label: '双子星联盟（Gemini）' },
  { value: 'OCEAN_ALLIANCE', label: '海洋OA联盟（Ocean Alliance）' },
  { value: 'PREMIER_ALLIANCE', label: 'PA联盟 (Premier Alliance)' },
  { value: 'INDEPENDENT', label: '独立运营' }
];

// 港口选项
const portOptions = [
  { value: 'CNSHA', label: '上海港 Shanghai Port (CNSHA)' },
  { value: 'CNNGB', label: '宁波港 Ningbo Port (CNNGB)' },
  { value: 'CNSZN', label: '深圳港 Shenzhen Port (CNSZN)' },
  { value: 'CNQIN', label: '青岛港 Qingdao Port (CNQIN)' },
  { value: 'CNTXG', label: '天津港 Tianjin Port (CNTXG)' },
  { value: 'CNDLC', label: '大连港 Dalian Port (CNDLC)' },
  { value: 'CNXMN', label: '厦门港 Xiamen Port (CNXMN)' },
  { value: 'CNHKG', label: '香港港 Hong Kong Port (CNHKG)' },
  { value: 'SGSIN', label: '新加坡港 Singapore Port (SGSIN)' },
  { value: 'JPYOK', label: '横滨港 Yokohama Port (JPYOK)' },
  { value: 'JPTYO', label: '东京港 Tokyo Port (JPTYO)' },
  { value: 'JPKOB', label: '神户港 Kobe Port (JPKOB)' },
  { value: 'KRPUS', label: '釜山港 Busan Port (KRPUS)' },
  { value: 'USLAX', label: '洛杉矶港 Los Angeles Port (USLAX)' },
  { value: 'USLGB', label: '长滩港 Long Beach Port (USLGB)' },
  { value: 'USOAK', label: '奥克兰港 Oakland Port (USOAK)' },
  { value: 'USNYC', label: '纽约港 New York Port (USNYC)' },
  { value: 'USSAV', label: '萨凡纳港 Savannah Port (USSAV)' },
  { value: 'USCHA', label: '查尔斯顿港 Charleston Port (USCHA)' },
  { value: 'USNOR', label: '诺福克港 Norfolk Port (USNOR)' },
  { value: 'DEHAM', label: '汉堡港 Hamburg Port (DEHAM)' },
  { value: 'NLRTM', label: '鹿特丹港 Rotterdam Port (NLRTM)' },
  { value: 'BEANR', label: '安特卫普港 Antwerp Port (BEANR)' },
  { value: 'FRLEH', label: '勒阿弗尔港 Le Havre Port (FRLEH)' },
  { value: 'ITGOA', label: '热那亚港 Genoa Port (ITGOA)' },
  { value: 'ESVLC', label: '瓦伦西亚港 Valencia Port (ESVLC)' },
  { value: 'GBFEL', label: '费利克斯托港 Felixstowe Port (GBFEL)' },
  { value: 'GBLGP', label: '伦敦门户港 London Gateway Port (GBLGP)' }
];

// 码头选项（按港口分组）
const terminalOptions: { [key: string]: { value: string; label: string }[] } = {
  'CNSHA': [
    { value: '洋山深水港一期', label: '洋山深水港一期' },
    { value: '洋山深水港二期', label: '洋山深水港二期' },
    { value: '洋山深水港三期', label: '洋山深水港三期' },
    { value: '洋山深水港四期', label: '洋山深水港四期' },
    { value: '外高桥一期', label: '外高桥一期' },
    { value: '外高桥二期', label: '外高桥二期' },
    { value: '外高桥三期', label: '外高桥三期' },
    { value: '外高桥四期', label: '外高桥四期' }
  ],
  'SGSIN': [
    { value: 'PSA Keppel Terminal', label: 'PSA Keppel Terminal' },
    { value: 'PSA Tanjong Pagar Terminal', label: 'PSA Tanjong Pagar Terminal' },
    { value: 'PSA Brani Terminal', label: 'PSA Brani Terminal' },
    { value: 'PSA Pasir Panjang Terminal', label: 'PSA Pasir Panjang Terminal' }
  ],
  'USLAX': [
    { value: 'LBCT', label: 'LBCT' },
    { value: 'APM Terminal', label: 'APM Terminal' },
    { value: 'TRAPAC', label: 'TRAPAC' },
    { value: 'EVERPORT', label: 'EVERPORT' }
  ],
  'DEHAM': [
    { value: 'HHLA Container Terminal', label: 'HHLA Container Terminal' },
    { value: 'EUROGATE Container Terminal', label: 'EUROGATE Container Terminal' },
    { value: 'CTH Container Terminal', label: 'CTH Container Terminal' }
  ],
  'NLRTM': [
    { value: 'APM Terminal', label: 'APM Terminal' },
    { value: 'ECT Delta Terminal', label: 'ECT Delta Terminal' },
    { value: 'RWG Terminal', label: 'RWG Terminal' }
  ]
};

// 周几选项
const weekdayOptions = [
  { value: '1', label: '周一' },
  { value: '2', label: '周二' },
  { value: '3', label: '周三' },
  { value: '4', label: '周四' },
  { value: '5', label: '周五' },
  { value: '6', label: '周六' },
  { value: '7', label: '周日' }
];

// 时间选项（以半小时为步长）
const timeOptions = [
  { value: '00:00', label: '00:00' },
  { value: '00:30', label: '00:30' },
  { value: '01:00', label: '01:00' },
  { value: '01:30', label: '01:30' },
  { value: '02:00', label: '02:00' },
  { value: '02:30', label: '02:30' },
  { value: '03:00', label: '03:00' },
  { value: '03:30', label: '03:30' },
  { value: '04:00', label: '04:00' },
  { value: '04:30', label: '04:30' },
  { value: '05:00', label: '05:00' },
  { value: '05:30', label: '05:30' },
  { value: '06:00', label: '06:00' },
  { value: '06:30', label: '06:30' },
  { value: '07:00', label: '07:00' },
  { value: '07:30', label: '07:30' },
  { value: '08:00', label: '08:00' },
  { value: '08:30', label: '08:30' },
  { value: '09:00', label: '09:00' },
  { value: '09:30', label: '09:30' },
  { value: '10:00', label: '10:00' },
  { value: '10:30', label: '10:30' },
  { value: '11:00', label: '11:00' },
  { value: '11:30', label: '11:30' },
  { value: '12:00', label: '12:00' },
  { value: '12:30', label: '12:30' },
  { value: '13:00', label: '13:00' },
  { value: '13:30', label: '13:30' },
  { value: '14:00', label: '14:00' },
  { value: '14:30', label: '14:30' },
  { value: '15:00', label: '15:00' },
  { value: '15:30', label: '15:30' },
  { value: '16:00', label: '16:00' },
  { value: '16:30', label: '16:30' },
  { value: '17:00', label: '17:00' },
  { value: '17:30', label: '17:30' },
  { value: '18:00', label: '18:00' },
  { value: '18:30', label: '18:30' },
  { value: '19:00', label: '19:00' },
  { value: '19:30', label: '19:30' },
  { value: '20:00', label: '20:00' },
  { value: '20:30', label: '20:30' },
  { value: '21:00', label: '21:00' },
  { value: '21:30', label: '21:30' },
  { value: '22:00', label: '22:00' },
  { value: '22:30', label: '22:30' },
  { value: '23:00', label: '23:00' },
  { value: '23:30', label: '23:30' }
];

// 船公司选项（共舱方）
const spaceSharingOptions = [
  { value: 'MAERSK', label: 'MAERSK | 马士基' },
  { value: 'MSC', label: 'MSC | 地中海航运' },
  { value: 'COSCO', label: 'COSCO | 中远海运' },
  { value: 'EVERGREEN', label: 'EVERGREEN | 长荣海运' },
  { value: 'OOCL', label: 'OOCL | 东方海外' },
  { value: 'CMA', label: 'CMA | 达飞轮船' },
  { value: 'ONE', label: 'ONE | 海洋网联船务' },
  { value: 'HAPAG', label: 'HAPAG | 赫伯罗特' },
  { value: 'YANG_MING', label: 'YANG_MING | 阳明海运' },
  { value: 'HMM', label: 'HMM | 现代商船' },
  { value: 'ZIM', label: 'ZIM | 以星轮船' },
  { value: 'KLINE', label: 'KLINE | 川崎汽船' },
  { value: 'MOL', label: 'MOL | 商船三井' },
  { value: 'NYK', label: 'NYK | 日本邮船' },
  { value: 'PIL', label: 'PIL | 太平船务' },
  { value: 'WANHAI', label: 'WANHAI | 万海航运' },
  { value: 'TS_LINES', label: 'TS_LINES | 德翔海运' },
  { value: 'SINOTRANS', label: 'SINOTRANS | 中外运' }
];

// 船代选项
const agentOptions = [
  { value: '马士基代理（上海）有限公司', label: '马士基代理（上海）有限公司' },
  { value: 'MSC船代（中国）有限公司', label: 'MSC船代（中国）有限公司' },
  { value: '中远海运船务代理有限公司', label: '中远海运船务代理有限公司' },
  { value: '长荣海运（中国）有限公司', label: '长荣海运（中国）有限公司' },
  { value: '东方海外货柜航运（中国）有限公司', label: '东方海外货柜航运（中国）有限公司' },
  { value: '达飞轮船（中国）船务有限公司', label: '达飞轮船（中国）船务有限公司' },
  { value: '海洋网联船务（中国）有限公司', label: '海洋网联船务（中国）有限公司' },
  { value: '赫伯罗特船务（中国）有限公司', label: '赫伯罗特船务（中国）有限公司' },
  { value: '阳明海运（中国）有限公司', label: '阳明海运（中国）有限公司' },
  { value: '现代商船（中国）有限公司', label: '现代商船（中国）有限公司' },
  { value: '以星轮船（中国）有限公司', label: '以星轮船（中国）有限公司' },
  { value: '川崎汽船（中国）有限公司', label: '川崎汽船（中国）有限公司' },
  { value: '商船三井（中国）有限公司', label: '商船三井（中国）有限公司' },
  { value: '日本邮船（中国）有限公司', label: '日本邮船（中国）有限公司' },
  { value: '太平船务（中国）有限公司', label: '太平船务（中国）有限公司' },
  { value: '万海航运（中国）有限公司', label: '万海航运（中国）有限公司' },
  { value: '德翔海运（中国）有限公司', label: '德翔海运（中国）有限公司' },
  { value: '中外运船务代理有限公司', label: '中外运船务代理有限公司' },
  { value: 'Maersk Singapore Pte Ltd', label: 'Maersk Singapore Pte Ltd' },
  { value: 'MSC Singapore Pte Ltd', label: 'MSC Singapore Pte Ltd' },
  { value: 'COSCO SHIPPING Lines Singapore', label: 'COSCO SHIPPING Lines Singapore' },
  { value: 'Evergreen Shipping Singapore', label: 'Evergreen Shipping Singapore' },
  { value: 'OOCL Singapore Pte Ltd', label: 'OOCL Singapore Pte Ltd' },
  { value: 'CMA CGM Singapore Pte Ltd', label: 'CMA CGM Singapore Pte Ltd' },
  { value: 'Ocean Network Express Singapore', label: 'Ocean Network Express Singapore' },
  { value: 'Hapag-Lloyd Singapore Pte Ltd', label: 'Hapag-Lloyd Singapore Pte Ltd' },
  { value: 'Yang Ming Singapore Pte Ltd', label: 'Yang Ming Singapore Pte Ltd' },
  { value: 'HMM Singapore Pte Ltd', label: 'HMM Singapore Pte Ltd' }
];

// 时间选择器组件
interface TimeSelectProps {
  value: TimeInfo;
  onChange: (value: TimeInfo) => void;
  placeholder?: string;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ value, onChange }) => {
  const handleWeekdayChange = (weekday: string) => {
    onChange({ ...value, weekday });
  };

  const handleTimeChange = (time: string) => {
    onChange({ ...value, time });
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Select
        placeholder="选择周几"
        value={value.weekday || undefined}
        onChange={handleWeekdayChange}
        style={{ flex: 1 }}
      >
        {weekdayOptions.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="选择时间"
        value={value.time || '12:00'}
        onChange={handleTimeChange}
        style={{ flex: 1 }}
      >
        {timeOptions.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

const RouteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<RouteFormData>({
    routeCode: '',
    routeName: '',
    alliance: '',
    spaceSharing: [],
    ports: [],
    status: 'enabled'
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basicInfo');
  const [hasBasicInfoSaved, setHasBasicInfoSaved] = useState(false);

  // 初始化数据
  useEffect(() => {
    if (isEditing) {
      // 模拟从API获取数据
      const mockData: RouteFormData = {
        routeCode: 'AE7',
        routeName: '亚欧7号',
        alliance: 'GEMINI',
        spaceSharing: ['MAERSK', 'MSC'],
        ports: [
          {
            id: '1',
            port: 'CNSHA',
            terminal: '洋山深水港四期',
            cutoffDate: { weekday: '5', time: '17:00' },
            terrorismCutoff: { weekday: '4', time: '12:00' },
            siCutoff: { weekday: '6', time: '12:30' },
            vgmCutoff: { weekday: '6', time: '16:00' },
            oogCutoff: { weekday: '2', time: '17:30' },
            dangerousCutoff: { weekday: '1', time: '17:00' },
            agents: [
              { spaceSharing: 'MAERSK', slotAgent: '马士基代理（上海）有限公司', dangerousAgent: '马士基代理（上海）有限公司' },
              { spaceSharing: 'MSC', slotAgent: 'MSC船代（中国）有限公司', dangerousAgent: 'MSC船代（中国）有限公司' }
            ]
          },
          {
            id: '2',
            port: 'SGSIN',
            terminal: 'PSA Keppel Terminal',
            cutoffDate: { weekday: '6', time: '15:30' },
            terrorismCutoff: { weekday: '5', time: '10:30' },
            siCutoff: { weekday: '1', time: '10:00' },
            vgmCutoff: { weekday: '1', time: '14:30' },
            oogCutoff: { weekday: '4', time: '15:00' },
            dangerousCutoff: { weekday: '3', time: '15:30' },
            agents: [
              { spaceSharing: 'MAERSK', slotAgent: 'Maersk Singapore Pte Ltd', dangerousAgent: 'Maersk Singapore Pte Ltd' }
            ]
          },
          {
            id: '3',
            port: 'NLRTM',
            terminal: 'ECT Delta Terminal',
            cutoffDate: { weekday: '2', time: '16:00' },
            terrorismCutoff: { weekday: '1', time: '14:00' },
            siCutoff: { weekday: '3', time: '10:00' },
            vgmCutoff: { weekday: '3', time: '15:00' },
            oogCutoff: { weekday: '7', time: '12:00' },
            dangerousCutoff: { weekday: '6', time: '16:00' },
            agents: [
              { spaceSharing: 'MAERSK', slotAgent: 'Maersk Netherlands B.V.', dangerousAgent: 'Maersk Netherlands B.V.' },
              { spaceSharing: 'MSC', slotAgent: 'MSC Netherlands B.V.', dangerousAgent: 'MSC Netherlands B.V.' }
            ]
          },
          {
            id: '4',
            port: 'DEHAM',
            terminal: 'Eurogate Container Terminal',
            cutoffDate: { weekday: '3', time: '15:00' },
            terrorismCutoff: { weekday: '2', time: '12:00' },
            siCutoff: { weekday: '4', time: '11:00' },
            vgmCutoff: { weekday: '4', time: '14:00' },
            oogCutoff: { weekday: '1', time: '13:00' },
            dangerousCutoff: { weekday: '7', time: '15:00' },
            agents: [
              { spaceSharing: 'MAERSK', slotAgent: 'Maersk Deutschland GmbH', dangerousAgent: 'Maersk Deutschland GmbH' }
            ]
          },
          {
            id: '5',
            port: 'GBFEL',
            terminal: 'Trinity Terminal',
            cutoffDate: { weekday: '4', time: '14:00' },
            terrorismCutoff: { weekday: '3', time: '11:00' },
            siCutoff: { weekday: '5', time: '09:00' },
            vgmCutoff: { weekday: '5', time: '13:00' },
            oogCutoff: { weekday: '2', time: '14:00' },
            dangerousCutoff: { weekday: '1', time: '14:00' },
            agents: [
              { spaceSharing: 'MSC', slotAgent: 'MSC UK Ltd', dangerousAgent: 'MSC UK Ltd' }
            ]
          },
          {
            id: '6',
            port: 'USLAX',
            terminal: 'APM Terminal Pier 400',
            cutoffDate: { weekday: '1', time: '18:00' },
            terrorismCutoff: { weekday: '7', time: '16:00' },
            siCutoff: { weekday: '2', time: '12:00' },
            vgmCutoff: { weekday: '2', time: '17:00' },
            oogCutoff: { weekday: '5', time: '16:00' },
            dangerousCutoff: { weekday: '4', time: '18:00' },
            agents: [
              { spaceSharing: 'MAERSK', slotAgent: 'Maersk Inc. (Los Angeles)', dangerousAgent: 'Maersk Inc. (Los Angeles)' },
              { spaceSharing: 'MSC', slotAgent: 'MSC USA Inc.', dangerousAgent: 'MSC USA Inc.' }
            ]
          }
        ],
        status: 'enabled'
      };
      setFormData(mockData);
      setHasBasicInfoSaved(true); // 编辑模式下认为基本信息已保存
      form.setFieldsValue({
        routeCode: mockData.routeCode,
        routeName: mockData.routeName,
        alliance: mockData.alliance,
        spaceSharing: mockData.spaceSharing
      });
    }
  }, [id, isEditing, form]);

  // 保存基本信息
  const handleSaveBasicInfo = async () => {
    try {
      const values = await form.validate();
      
      // 验证航线代码格式
      const routeCodeRegex = /^[A-Z0-9]+$/;
      if (!routeCodeRegex.test(values.routeCode)) {
        Message.error('航线代码只能包含大写字母和数字');
        return;
      }

      // 验证必填字段
      if (!values.routeName?.trim()) {
        Message.error('请输入航线名称');
        return;
      }

      if (!values.alliance) {
        Message.error('请选择归属联盟');
        return;
      }

      if (!values.spaceSharing || values.spaceSharing.length === 0) {
        Message.error('请选择至少一个共舱方');
        return;
      }

      setLoading(true);

      // 更新表单数据
      setFormData(prev => ({
        ...prev,
        routeCode: values.routeCode,
        routeName: values.routeName,
        alliance: values.alliance,
        spaceSharing: values.spaceSharing
      }));

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      setHasBasicInfoSaved(true);
      Message.success('基本信息保存成功');
      
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 最终保存数据
  const handleFinalSave = async () => {
    try {
      // 验证港口信息
      if (!formData.ports || formData.ports.length === 0) {
        Message.error('请添加至少一个港口信息');
        return;
      }

      // 验证每个港口必须选择港口
      for (let i = 0; i < formData.ports.length; i++) {
        const port = formData.ports[i];
        if (!port.port) {
          Message.error(`港口 ${i + 1} 必须选择港口`);
          return;
        }
      }

      setLoading(true);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      Message.success(isEditing ? '航线更新成功' : '航线创建成功');
      
      // 返回列表页
      navigate('/controltower/route-maintenance');
      
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    navigate('/controltower/route-maintenance');
  };

  // 添加港口信息
  const addPort = () => {
    const newPort: PortInfo = {
      id: Date.now().toString(),
      port: '',
      terminal: '',
      cutoffDate: { weekday: '', time: '12:00' },
      terrorismCutoff: { weekday: '', time: '12:00' },
      siCutoff: { weekday: '', time: '12:00' },
      vgmCutoff: { weekday: '', time: '12:00' },
      oogCutoff: { weekday: '', time: '12:00' },
      dangerousCutoff: { weekday: '', time: '12:00' },
      agents: []
    };
    setFormData(prev => ({
      ...prev,
      ports: [...prev.ports, newPort]
    }));
  };

  // 删除港口信息
  const removePort = (portId: string) => {
    setFormData(prev => ({
      ...prev,
      ports: prev.ports.filter(port => port.id !== portId)
    }));
  };

  // 更新港口信息
  const updatePort = (portId: string, field: keyof PortInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      ports: prev.ports.map(port => 
        port.id === portId ? { ...port, [field]: value } : port
      )
    }));
  };

  // 添加船代信息
  const addAgent = (portId: string) => {
    const newAgent: AgentInfo = {
      spaceSharing: '',
      slotAgent: '',
      dangerousAgent: ''
    };
    setFormData(prev => ({
      ...prev,
      ports: prev.ports.map(port => 
        port.id === portId 
          ? { ...port, agents: [...port.agents, newAgent] }
          : port
      )
    }));
  };

  // 删除船代信息
  const removeAgent = (portId: string, agentIndex: number) => {
    setFormData(prev => ({
      ...prev,
      ports: prev.ports.map(port => 
        port.id === portId 
          ? { ...port, agents: port.agents.filter((_, index) => index !== agentIndex) }
          : port
      )
    }));
  };

  // 更新船代信息
  const updateAgent = (portId: string, agentIndex: number, field: keyof AgentInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      ports: prev.ports.map(port => 
        port.id === portId 
          ? { 
              ...port, 
              agents: port.agents.map((agent, index) => 
                index === agentIndex ? { ...agent, [field]: value } : agent
              )
            }
          : port
      )
    }));
  };

  // 获取可用的共舱方选项（排除已在当前港口选择的）
  const getAvailableSpaceSharing = (portId: string, currentAgentIndex: number) => {
    const port = formData.ports.find(p => p.id === portId);
    if (!port) return [];

    // 获取当前港口已选择的共舱方（排除当前正在编辑的船代）
    const usedSpaceSharing = port.agents
      .filter((_, index) => index !== currentAgentIndex)
      .map(agent => agent.spaceSharing)
      .filter(Boolean);

    // 返回可用的共舱方（基础表单中选择的，且未在当前港口使用的）
    return formData.spaceSharing.filter(sharing => !usedSpaceSharing.includes(sharing));
  };

  // 共舱方航次接口
  interface SpaceSharingVoyage {
    id: string;
    spaceSharing: string; // 共舱方
    internalVoyage: string; // 内部航次
    customsVoyage: string; // 报关航次
  }

  interface ShipSchedule {
    id: string;
    shipName: string; // 船名
    operator: string; // 操船方
    operatorInternalVoyage: string; // 操船方内部航次
    operatorCustomsVoyage: string; // 操船方报关航次
    portDates: { [portCode: string]: { eta: string; etd: string } }; // 各港口的ETA和ETD
  }

  // 长期船期状态
  const [shipSchedules, setShipSchedules] = useState<ShipSchedule[]>([]);
  
  // 补充字段弹窗状态
  const [supplementModalVisible, setSupplementModalVisible] = useState(false);
  const [currentSupplementData, setCurrentSupplementData] = useState<{
    scheduleId: string;
    portCode: string;
    portName: string;
  } | null>(null);
  
  // 补充字段数据状态
  const [supplementFields, setSupplementFields] = useState<{
    [key: string]: { // scheduleId-portCode
      cutoffDate: string;
      terrorismCutoff: string; 
      siCutoff: string;
      vgmCutoff: string;
      oogCutoff: string;
      dangerousCutoff: string;
      spaceSharingVoyages: SpaceSharingVoyage[];
    }
  }>({});

  // 表格同步滚动相关refs
  const frozenTableRef = useRef<HTMLDivElement>(null);
  const scrollableTableRef = useRef<HTMLDivElement>(null);

  // 同步滚动事件处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const source = e.target as HTMLDivElement;
    const scrollTop = source.scrollTop;
    
    // 同步另一个表格的滚动位置
    if (source === frozenTableRef.current && scrollableTableRef.current) {
      scrollableTableRef.current.scrollTop = scrollTop;
    } else if (source === scrollableTableRef.current && frozenTableRef.current) {
      frozenTableRef.current.scrollTop = scrollTop;
    }
  }, []);

  // 添加船期
  const addShipSchedule = () => {
    // 获取上一行的日期数据，用于自动计算新日期（+7天）
    const lastSchedule = shipSchedules.length > 0 ? shipSchedules[shipSchedules.length - 1] : null;
    const newPortDates: { [portCode: string]: { eta: string; etd: string } } = {};
    
    // 如果有上一行数据，则自动计算新日期（+7天）
    if (lastSchedule) {
      formData.ports.forEach(port => {
        const lastDates = lastSchedule.portDates[port.port];
        if (lastDates && lastDates.eta && lastDates.etd) {
          const etaDate = new Date(lastDates.eta);
          const etdDate = new Date(lastDates.etd);
          
          etaDate.setDate(etaDate.getDate() + 7);
          etdDate.setDate(etdDate.getDate() + 7);
          
          newPortDates[port.port] = {
            eta: etaDate.toISOString().slice(0, 16),
            etd: etdDate.toISOString().slice(0, 16)
          };
        } else {
          newPortDates[port.port] = { eta: '', etd: '' };
        }
      });
    } else {
      // 第一行数据，初始化所有港口的空日期
      formData.ports.forEach(port => {
        newPortDates[port.port] = { eta: '', etd: '' };
      });
    }
    
    const newSchedule: ShipSchedule = {
      id: Date.now().toString(),
      shipName: '',
      operator: '',
      operatorInternalVoyage: '',
      operatorCustomsVoyage: '',
      portDates: newPortDates
    };
    setShipSchedules(prev => [...prev, newSchedule]);
  };

  // 删除船期
  const removeShipSchedule = (scheduleId: string) => {
    setShipSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
  };

  // 更新船期信息
  const updateShipSchedule = (scheduleId: string, field: keyof ShipSchedule, value: any) => {
    setShipSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId ? { ...schedule, [field]: value } : schedule
    ));
  };

  // 更新港口日期
  const updatePortDate = (scheduleId: string, portCode: string, dateType: 'eta' | 'etd', value: string | undefined) => {
    setShipSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { 
            ...schedule, 
            portDates: { 
              ...schedule.portDates, 
              [portCode]: {
                ...(schedule.portDates[portCode] || { eta: '', etd: '' }),
                [dateType]: value || ''
              }
            }
          }
        : schedule
    ));
  };

  // 打开补充字段弹窗
  const openSupplementModal = (scheduleId: string, portCode: string, portName: string) => {
    setCurrentSupplementData({ scheduleId, portCode, portName });
    setSupplementModalVisible(true);
  };

  // 关闭补充字段弹窗
  const closeSupplementModal = () => {
    setSupplementModalVisible(false);
    setCurrentSupplementData(null);
  };

  // 计算默认时间（基于ETD和基本信息中的港口设置）
  const calculateDefaultTimes = (portCode: string, etd: string): {
    cutoffDate: string;
    terrorismCutoff: string;
    siCutoff: string;
    vgmCutoff: string;
    oogCutoff: string;
    dangerousCutoff: string;
    spaceSharingVoyages: SpaceSharingVoyage[];
  } => {
    // 找到基本信息中对应的港口
    const portInfo = formData.ports.find(p => p.port === portCode);
    if (!portInfo || !etd) {
      return {
        cutoffDate: '',
        terrorismCutoff: '',
        siCutoff: '',
        vgmCutoff: '',
        oogCutoff: '',
        dangerousCutoff: '',
        spaceSharingVoyages: []
      };
    }

    const etdDate = new Date(etd);
    
    // 根据基本信息中的设置计算各个时间
    const calculateTime = (timeInfo: TimeInfo): string => {
      const dayOffset = parseInt(timeInfo.weekday) - 1; // 周几转换为偏移天数
      const targetDate = new Date(etdDate);
      targetDate.setDate(etdDate.getDate() + dayOffset);
      
      const [hours, minutes] = timeInfo.time.split(':');
      targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      return targetDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm格式
    };

    return {
      cutoffDate: calculateTime(portInfo.cutoffDate),
      terrorismCutoff: calculateTime(portInfo.terrorismCutoff),
      siCutoff: calculateTime(portInfo.siCutoff),
      vgmCutoff: calculateTime(portInfo.vgmCutoff),
      oogCutoff: calculateTime(portInfo.oogCutoff),
      dangerousCutoff: calculateTime(portInfo.dangerousCutoff),
      spaceSharingVoyages: []
    };
  };

  // 保存补充字段
  const saveSupplementFields = (fields: any) => {
    if (!currentSupplementData) return;
    
    const key = `${currentSupplementData.scheduleId}-${currentSupplementData.portCode}`;
    setSupplementFields(prev => ({
      ...prev,
      [key]: fields
    }));
    
    closeSupplementModal();
  };

  // 基本信息Tab内容
  const renderBasicInfoTab = () => (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        style={{ maxWidth: 800 }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="主航线代码"
              field="routeCode"
              rules={[
                { required: true, message: '请输入主航线代码' },
                { 
                  validator: (value, callback) => {
                    if (!value) {
                      callback();
                      return;
                    }
                    const routeCodeRegex = /^[A-Z0-9]+$/;
                    if (!routeCodeRegex.test(value)) {
                      callback('航线代码只能包含大写字母和数字');
                      return;
                    }
                    // 检查唯一性
                    const existingCodes = ['AE1', 'AE2', 'AE3', 'TP1', 'TP2'];
                    if (!isEditing && existingCodes.includes(value.toUpperCase())) {
                      callback('航线代码已存在');
                      return;
                    }
                    callback();
                  }
                }
              ]}
            >
              <Input 
                placeholder="请输入航线代码，如：AE7" 
                maxLength={10}
                style={{ textTransform: 'uppercase' }}
                onChange={(value) => {
                  form.setFieldValue('routeCode', value.toUpperCase());
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="航线名称"
              field="routeName"
              rules={[
                { required: true, message: '请输入航线名称' },
                { maxLength: 50, message: '航线名称不能超过50个字符' }
              ]}
            >
              <Input 
                placeholder="请输入航线名称，如：亚欧7号" 
                maxLength={50}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="归属联盟"
              field="alliance"
              rules={[{ required: true, message: '请选择归属联盟' }]}
            >
              <Select placeholder="请选择归属联盟">
                {allianceOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="共舱方"
          field="spaceSharing"
          rules={[
            { required: true, message: '请选择共舱方' },
            { 
              validator: (value) => {
                if (!value || value.length === 0) {
                  return Promise.reject('请选择至少一个共舱方');
                }
                if (value.length > 10) {
                  return Promise.reject('最多只能选择10个共舱方');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Select
            mode="multiple"
            placeholder="请选择共舱方（最多10个）"
            showSearch
            maxTagCount={3}
          >
            {spaceSharingOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      {/* 港口信息模块 - 只在基本信息tab中显示 */}
      <div style={{ marginTop: 24 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 16,
          padding: '12px 16px',
          backgroundColor: '#f7f8fa',
          borderRadius: 6
        }}>
          <Title heading={6} style={{ margin: 0 }}>挂靠港口信息</Title>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={addPort}
            size="small"
          >
            添加港口
          </Button>
        </div>

        {formData.ports.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <p>暂无港口信息，请点击"添加港口"按钮添加</p>
          </Card>
        ) : (
          formData.ports.map((port, index) => (
            <Card 
              key={port.id} 
              style={{ marginBottom: 16 }}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>港口 {index + 1}</span>
                  <Button
                    type="text"
                    status="danger"
                    icon={<IconDelete />}
                    onClick={() => removePort(port.id)}
                    size="small"
                  >
                    删除
                  </Button>
                </div>
              }
            >
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                      <span style={{ color: 'red' }}>*</span> 港口
                    </label>
                    <Select
                      placeholder="请选择港口"
                      value={port.port}
                      onChange={(value) => updatePort(port.id, 'port', value)}
                      style={{ width: '100%' }}
                    >
                      {portOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>挂靠码头</label>
                    <Select
                      placeholder="请选择挂靠码头"
                      value={port.terminal}
                      onChange={(value) => updatePort(port.id, 'terminal', value)}
                      style={{ width: '100%' }}
                      showSearch
                      allowClear
                    >
                      {(terminalOptions[port.port] || []).map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>截关日</label>
                    <TimeSelect
                      value={port.cutoffDate}
                      onChange={(value) => updatePort(port.id, 'cutoffDate', value)}
                    />
                  </div>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>截反恐申报</label>
                    <TimeSelect
                      value={port.terrorismCutoff}
                      onChange={(value) => updatePort(port.id, 'terrorismCutoff', value)}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>截单</label>
                    <TimeSelect
                      value={port.siCutoff}
                      onChange={(value) => updatePort(port.id, 'siCutoff', value)}
                    />
                  </div>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>截VGM</label>
                    <TimeSelect
                      value={port.vgmCutoff}
                      onChange={(value) => updatePort(port.id, 'vgmCutoff', value)}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>截OOG List</label>
                    <TimeSelect
                      value={port.oogCutoff}
                      onChange={(value) => updatePort(port.id, 'oogCutoff', value)}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>截危申报</label>
                    <TimeSelect
                      value={port.dangerousCutoff}
                      onChange={(value) => updatePort(port.id, 'dangerousCutoff', value)}
                    />
                  </div>
                </Col>
              </Row>

              {/* 船代信息 */}
              <div style={{ marginTop: 24 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 12,
                  padding: '8px 12px',
                  backgroundColor: '#f0f6ff',
                  borderRadius: 4
                }}>
                  <span style={{ fontWeight: 500 }}>船代信息</span>
                  <Button
                    type="primary"
                    icon={<IconPlus />}
                    onClick={() => addAgent(port.id)}
                    size="small"
                  >
                    添加船代
                  </Button>
                </div>

                {port.agents.length === 0 ? (
                  <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: '#999',
                    backgroundColor: '#f9f9f9',
                    borderRadius: 4
                  }}>
                    暂无船代信息，请点击"添加船代"按钮添加
                  </div>
                ) : (
                  port.agents.map((agent, agentIndex) => (
                    <div key={agentIndex} style={{ 
                      marginBottom: 12, 
                      padding: '12px',
                      border: '1px solid #e8e8e8',
                      borderRadius: 4,
                      backgroundColor: '#fafafa'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: 12
                      }}>
                        <span style={{ fontWeight: 500 }}>船代 {agentIndex + 1}</span>
                        <Button
                          type="text"
                          status="danger"
                          icon={<IconDelete />}
                          onClick={() => removeAgent(port.id, agentIndex)}
                          size="small"
                        >
                          删除
                        </Button>
                      </div>
                      <Row gutter={12}>
                        <Col span={8}>
                          <div>
                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>共舱方</label>
                            <Select
                              placeholder="请选择共舱方"
                              value={agent.spaceSharing}
                              onChange={(value) => updateAgent(port.id, agentIndex, 'spaceSharing', value)}
                              style={{ width: '100%' }}
                              showSearch
                              allowClear
                            >
                              {getAvailableSpaceSharing(port.id, agentIndex).map(sharing => {
                                const option = spaceSharingOptions.find(opt => opt.value === sharing);
                                return option ? (
                                  <Option key={option.value} value={option.value}>
                                    {option.label}
                                  </Option>
                                ) : null;
                              })}
                            </Select>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div>
                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>舱位船代</label>
                            <Select
                              placeholder="请选择舱位船代"
                              value={agent.slotAgent}
                              onChange={(value) => updateAgent(port.id, agentIndex, 'slotAgent', value)}
                              style={{ width: '100%' }}
                              showSearch
                              allowClear
                            >
                              {agentOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                  {option.label}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div>
                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>危险品船代</label>
                            <Select
                              placeholder="请选择危险品船代"
                              value={agent.dangerousAgent}
                              onChange={(value) => updateAgent(port.id, agentIndex, 'dangerousAgent', value)}
                              style={{ width: '100%' }}
                              showSearch
                              allowClear
                            >
                              {agentOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                  {option.label}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );

  // 船名选项（模拟数据）
  const shipOptions = [
    { value: 'EVER_LOGIC', label: 'EVER LOGIC' },
    { value: 'EVER_GIVEN', label: 'EVER GIVEN' },
    { value: 'EVER_GOLDEN', label: 'EVER GOLDEN' },
    { value: 'EVER_GLORY', label: 'EVER GLORY' },
    { value: 'MSC_OSCAR', label: 'MSC OSCAR' },
    { value: 'MSC_ZIVA', label: 'MSC ZIVA' },
    { value: 'MSC_MINA', label: 'MSC MINA' },
    { value: 'COSCO_SHIPPING_UNIVERSE', label: 'COSCO SHIPPING UNIVERSE' },
    { value: 'COSCO_SHIPPING_GLOBE', label: 'COSCO SHIPPING GLOBE' },
    { value: 'OOCL_HONG_KONG', label: 'OOCL HONG KONG' },
    { value: 'OOCL_GERMANY', label: 'OOCL GERMANY' },
    { value: 'CMA_CGM_ANTOINE_DE_SAINT_EXUPERY', label: 'CMA CGM ANTOINE DE SAINT EXUPERY' },
    { value: 'MADRID_MAERSK', label: 'MADRID MAERSK' },
    { value: 'MUNICH_MAERSK', label: 'MUNICH MAERSK' }
  ];

  // 长期船期Tab内容
  const renderLongTermScheduleTab = () => (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16,
        padding: '12px 16px',
        backgroundColor: '#f7f8fa',
        borderRadius: 6
      }}>
        <Title heading={6} style={{ margin: 0 }}>长期船期</Title>
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={addShipSchedule}
          size="small"
        >
          添加船期
        </Button>
      </div>

      {shipSchedules.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <p>暂无船期信息，请点击"添加船期"按钮添加</p>
        </Card>
      ) : (
        /* 表格容器 - 支持水平滚动，左侧列冻结，垂直同步滚动 */
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#fff',
          display: 'flex',
          height: 'auto',
          maxHeight: '600px'
        }}>
          {/* 冻结列容器（船名和操船方信息） */}
            <div style={{
            width: '580px',
              backgroundColor: '#fff',
              borderRight: '2px solid #d0d0d0',
              boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
              zIndex: 10,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
            }}>
              {/* 冻结列表头 */}
              <div style={{ 
                display: 'flex',
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              borderBottom: '1px solid #e0e0e0',
              flexShrink: 0
              }}>
                <div style={{ 
                  width: '160px',
                  padding: '12px 8px', 
                  borderRight: '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  船名
                </div>
                <div style={{ 
                width: '140px',
                  padding: '12px 8px',
                borderRight: '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  操船方
                </div>
              <div style={{ 
                width: '140px',
                padding: '12px 8px',
                borderRight: '1px solid #e0e0e0',
                textAlign: 'center'
              }}>
                内部航次
              </div>
              <div style={{ 
                width: '140px',
                padding: '12px 8px',
                textAlign: 'center'
              }}>
                报关航次
              </div>
              </div>

            {/* 冻结列数据容器 - 可滚动 */}
            <div 
              ref={frozenTableRef}
              onScroll={handleScroll}
              style={{ 
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden'
              }}
            >
              {shipSchedules.map((schedule, index) => (
                <div key={schedule.id} style={{ 
                  display: 'flex',
                  borderBottom: index < shipSchedules.length - 1 ? '1px solid #e0e0e0' : 'none',
                  minHeight: '102px', // 固定行高以匹配港口列的3个元素高度
                  alignItems: 'center'
                }}>
                  {/* 船名列 */}
                  <div style={{ 
                    width: '160px',
                    backgroundColor: schedule.shipName ? '#ffffcc' : '#fff', 
                    padding: '8px',
                    borderRight: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <Select
                      placeholder="请选择船名"
                      value={schedule.shipName}
                      onChange={(value) => updateShipSchedule(schedule.id, 'shipName', value)}
                      style={{ width: '100%' }}
                      showSearch
                      allowClear
                      size="small"
                    >
                      {shipOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  {/* 操船方列 */}
                  <div style={{ 
                    width: '140px',
                    backgroundColor: schedule.operator ? '#ffffcc' : '#fff', 
                    padding: '8px',
                    borderRight: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                      <Select
                        placeholder="请选择操船方"
                        value={schedule.operator}
                        onChange={(value) => updateShipSchedule(schedule.id, 'operator', value)}
                        style={{ width: '100%' }}
                        showSearch
                        allowClear
                        size="small"
                      >
                        {formData.spaceSharing.map(sharing => {
                          const option = spaceSharingOptions.find(opt => opt.value === sharing);
                          return option ? (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ) : null;
                        })}
                      </Select>
                      {shipSchedules.length > 1 && (
                        <Button
                          type="text"
                          status="danger"
                          icon={<IconDelete />}
                          onClick={() => removeShipSchedule(schedule.id)}
                          size="mini"
                          style={{ marginLeft: 4, flexShrink: 0 }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 内部航次列 */}
                  <div style={{ 
                    width: '140px',
                    backgroundColor: schedule.operatorInternalVoyage ? '#ffffcc' : '#fff', 
                    padding: '8px',
                    borderRight: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <Input
                      placeholder="请输入内部航次"
                      value={schedule.operatorInternalVoyage}
                      onChange={(value) => updateShipSchedule(schedule.id, 'operatorInternalVoyage', value)}
                      style={{ width: '100%' }}
                      size="small"
                    />
                  </div>

                  {/* 报关航次列 */}
                  <div style={{ 
                    width: '140px',
                    backgroundColor: schedule.operatorCustomsVoyage ? '#ffffcc' : '#fff', 
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <Input
                      placeholder="请输入报关航次"
                      value={schedule.operatorCustomsVoyage}
                      onChange={(value) => updateShipSchedule(schedule.id, 'operatorCustomsVoyage', value)}
                      style={{ width: '100%' }}
                      size="small"
                    />
                  </div>
                </div>
              ))}
            </div>
            </div>

            {/* 可滚动区域（港口列） */}
            <div style={{
              flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 'calc(100vw - 780px)' // 预留左侧菜单和边距空间
            }}>
                {/* 港口列表头 */}
                <div style={{ 
                  display: 'flex',
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
              borderBottom: '1px solid #e0e0e0',
              flexShrink: 0,
              overflowX: 'auto',
              minWidth: `${formData.ports.length * 140}px`
                }}>
                  {formData.ports.map((port, portIndex) => {
                    const portOption = portOptions.find(opt => opt.value === port.port);
                    // 提取英文全称（去掉中文部分）
                    const portName = portOption ? 
                      portOption.label.split(' ').slice(1).join(' ').replace(/\s*\([^)]*\)/, '') : 
                      port.port;
                    return (
                      <div key={port.id} style={{ 
                        width: '140px',
                        padding: '12px 8px', 
                        borderRight: portIndex < formData.ports.length - 1 ? '1px solid #e0e0e0' : 'none',
                        textAlign: 'center',
                        flexShrink: 0
                      }}>
                        {portName}
                      </div>
                    );
                  })}
                </div>

            {/* 港口列数据容器 - 可滚动 */}
            <div 
              ref={scrollableTableRef}
              onScroll={handleScroll}
              style={{ 
                flex: 1,
                overflowY: 'auto',
                overflowX: 'auto'
              }}
            >
              <div style={{ minWidth: `${formData.ports.length * 140}px` }}>
                {shipSchedules.map((schedule, index) => (
                  <div key={schedule.id} style={{ 
                    display: 'flex',
                    borderBottom: index < shipSchedules.length - 1 ? '1px solid #e0e0e0' : 'none',
                    minHeight: '102px', // 与冻结列行高一致
                    alignItems: 'stretch'
                  }}>
                    {/* 各港口ETA/ETD列 */}
                    {formData.ports.map((port, portIndex) => {
                      const portOption = portOptions.find(opt => opt.value === port.port);
                      const portName = portOption ? 
                        portOption.label.split(' ').slice(1).join(' ').replace(/\s*\([^)]*\)/, '') : 
                        port.port;
                      const supplementKey = `${schedule.id}-${port.port}`;
                      const hasSupplementData = supplementFields[supplementKey];
                      const portDates = schedule.portDates[port.port] || { eta: '', etd: '' };
                      
                      return (
                        <div key={port.id} style={{ 
                          width: '140px',
                          backgroundColor: (portDates.eta || portDates.etd) ? '#ffffcc' : '#fff', 
                          padding: '8px',
                          borderRight: portIndex < formData.ports.length - 1 ? '1px solid #e0e0e0' : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          flexShrink: 0,
                          justifyContent: 'center'
                        }}>
                          <DatePicker
                            placeholder="选择ETA"
                            value={portDates.eta}
                            onChange={(value) => updatePortDate(schedule.id, port.port, 'eta', value)}
                            style={{ width: '100%' }}
                            allowClear
                            size="small"
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                          />
                          <DatePicker
                            placeholder="选择ETD"
                            value={portDates.etd}
                            onChange={(value) => updatePortDate(schedule.id, port.port, 'etd', value)}
                            style={{ width: '100%' }}
                            allowClear
                            size="small"
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                          />
                          <Button
                            type="outline"
                            size="mini"
                            onClick={() => openSupplementModal(schedule.id, port.port, portName)}
                            style={{ 
                              width: '100%', 
                              fontSize: '11px', 
                              height: '22px',
                              backgroundColor: hasSupplementData ? '#e6f7ff' : '#fff',
                              borderColor: hasSupplementData ? '#40a9ff' : '#d9d9d9'
                            }}
                          >
                            补充字段{hasSupplementData ? '✓' : ''}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 说明信息 */}
      <div style={{ 
        marginTop: 16, 
        padding: '12px', 
        backgroundColor: '#f6f8fa', 
        borderRadius: 4,
        fontSize: '12px',
        color: '#666'
      }}>
        <p style={{ margin: 0 }}>
          <strong>说明：</strong>
          船名来自基础资料，操船方来自当前航线的共舱方，港口来自基本信息中的挂靠港信息。
          ETA/ETD填写后该格子会高亮显示。添加第二行及后续船期时，ETA/ETD将自动在上一行对应港口日期基础上加7天。
        </p>
      </div>
    </div>
  );

  // 补充字段Drawer组件
  const SupplementDrawer = () => {
    const [form] = Form.useForm();
    const [spaceSharingVoyages, setSpaceSharingVoyages] = useState<SpaceSharingVoyage[]>([]);
    
    const handleSave = () => {
      form.validate().then((values) => {
        const finalValues = {
          ...values,
          spaceSharingVoyages
        };
        saveSupplementFields(finalValues);
        Message.success('补充字段保存成功');
      }).catch((error) => {
        console.error('表单验证失败:', error);
      });
    };

    // 添加共舱方航次
    const addSpaceSharingVoyage = () => {
      const newVoyage: SpaceSharingVoyage = {
        id: Date.now().toString(),
        spaceSharing: '',
        internalVoyage: '',
        customsVoyage: ''
      };
      setSpaceSharingVoyages(prev => [...prev, newVoyage]);
    };

    // 删除共舱方航次
    const removeSpaceSharingVoyage = (id: string) => {
      setSpaceSharingVoyages(prev => prev.filter(voyage => voyage.id !== id));
    };

    // 更新共舱方航次
    const updateSpaceSharingVoyage = (id: string, field: keyof SpaceSharingVoyage, value: string) => {
      setSpaceSharingVoyages(prev => prev.map(voyage => 
        voyage.id === id ? { ...voyage, [field]: value } : voyage
      ));
    };

    const handleDrawerOpen = () => {
      if (currentSupplementData) {
        const { scheduleId, portCode } = currentSupplementData;
        const schedule = shipSchedules.find(s => s.id === scheduleId);
        const etd = schedule?.portDates[portCode]?.etd;
        
        // 获取现有数据或计算默认值
        const supplementKey = `${scheduleId}-${portCode}`;
        const existingData = supplementFields[supplementKey];
        
        if (existingData) {
          form.setFieldsValue(existingData);
          setSpaceSharingVoyages(existingData.spaceSharingVoyages || []);
        } else {
          if (etd) {
          const defaultTimes = calculateDefaultTimes(portCode, etd);
          form.setFieldsValue(defaultTimes);
          }
          setSpaceSharingVoyages([]);
        }
      }
    };

    return (
      <Drawer
        title={`补充字段设置 - ${currentSupplementData?.portName || ''}`}
        visible={supplementModalVisible}
        onOk={handleSave}
        onCancel={closeSupplementModal}
        width={800}
        afterOpen={handleDrawerOpen}
        okText="保存"
        cancelText="取消"
        confirmLoading={false}
      >
        <Form form={form} layout="vertical">
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <Form.Item label="截关日" field="cutoffDate">
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择截关日"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={12}>
              <Form.Item label="截反恐申报" field="terrorismCutoff">
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择截反恐申报时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
          
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <Form.Item label="截单" field="siCutoff">
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择截单时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={12}>
              <Form.Item label="截VGM" field="vgmCutoff">
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择截VGM时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
          
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <Form.Item label="截OOG List" field="oogCutoff">
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择截OOG List时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={12}>
              <Form.Item label="截危申报" field="dangerousCutoff">
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择截危申报时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
          
          {/* 共舱方航次字段 */}
          <div style={{ marginTop: 24 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 16 
            }}>
              <Title heading={6} style={{ margin: 0 }}>共舱方航次</Title>
              <Button
                type="primary"
                icon={<IconPlus />}
                onClick={addSpaceSharingVoyage}
                size="small"
              >
                添加共舱方
              </Button>
            </div>

            {spaceSharingVoyages.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#999',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                border: '1px dashed #d9d9d9'
              }}>
                暂无共舱方航次信息，请点击"添加共舱方"按钮添加
              </div>
            ) : (
              <div>
                {spaceSharingVoyages.map((voyage, index) => (
                  <div key={voyage.id} style={{ 
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    padding: '16px',
                    marginBottom: '12px',
                    backgroundColor: '#fafafa'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <span style={{ fontWeight: 'bold', color: '#333' }}>
                        共舱方 #{index + 1}
                      </span>
                      <Button
                        type="text"
                        status="danger"
                        icon={<IconDelete />}
                        onClick={() => removeSpaceSharingVoyage(voyage.id)}
                        size="mini"
                      />
                    </div>
                    
                    <Grid.Row gutter={16}>
                      <Grid.Col span={8}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '14px', fontWeight: 500 }}>共舱方</label>
                        </div>
                        <Select
                          placeholder="请选择共舱方"
                          value={voyage.spaceSharing}
                          onChange={(value) => updateSpaceSharingVoyage(voyage.id, 'spaceSharing', value)}
                          style={{ width: '100%' }}
                          size="small"
                        >
                          {formData.spaceSharing.map(sharing => {
                            const option = spaceSharingOptions.find(opt => opt.value === sharing);
                            return option ? (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ) : null;
                          })}
                        </Select>
                      </Grid.Col>
                      <Grid.Col span={8}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '14px', fontWeight: 500 }}>内部航次</label>
                        </div>
                        <Input
                          placeholder="请输入内部航次"
                          value={voyage.internalVoyage}
                          onChange={(value) => updateSpaceSharingVoyage(voyage.id, 'internalVoyage', value)}
                          style={{ width: '100%' }}
                          size="small"
                        />
                      </Grid.Col>
                      <Grid.Col span={8}>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '14px', fontWeight: 500 }}>报关航次</label>
                        </div>
                        <Input
                          placeholder="请输入报关航次"
                          value={voyage.customsVoyage}
                          onChange={(value) => updateSpaceSharingVoyage(voyage.id, 'customsVoyage', value)}
                          style={{ width: '100%' }}
                          size="small"
                        />
                      </Grid.Col>
                    </Grid.Row>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ 
            marginTop: 16, 
            padding: '12px', 
            backgroundColor: '#f6f8fa', 
            borderRadius: 4,
            fontSize: '12px',
            color: '#666'
          }}>
            <p style={{ margin: 0 }}>
              <strong>说明：</strong>
              默认时间根据ETD和基本信息中对应港口的设置自动计算，您可以根据实际情况调整。共舱方来自基本信息中的共舱方设置。
            </p>
          </div>
        </Form>
      </Drawer>
    );
  };

  return (
    <div style={{ padding: '16px 24px' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button
              icon={<IconArrowLeft />}
              onClick={handleCancel}
            >
              返回
            </Button>
            <Title heading={5} style={{ margin: 0 }}>
              {isEditing ? '编辑航线' : '新增航线'}
            </Title>
          </Space>
          
          {/* 操作按钮始终显示在右上角 */}
          <Space>
            {activeTab === 'basicInfo' ? (
              <Button
                type="primary"
                icon={<IconSave />}
                loading={loading}
                onClick={handleSaveBasicInfo}
              >
                保存基本信息
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<IconSave />}
                loading={loading}
                onClick={handleFinalSave}
              >
                {isEditing ? '更新' : '保存'}
              </Button>
            )}
            <Button onClick={handleCancel}>
              取消
            </Button>
          </Space>
        </div>

        {/* 状态显示区域 */}
        {isEditing && (
          <div style={{ marginBottom: 24, padding: '12px 16px', backgroundColor: '#f7f8fa', borderRadius: 6 }}>
            <Grid.Row>
              <Grid.Col span={24}>
                <Space>
                  <span style={{ fontWeight: 500 }}>当前状态：</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: 4, 
                    fontSize: 12,
                    backgroundColor: formData.status === 'enabled' ? '#f6ffed' : '#fff2f0',
                    color: formData.status === 'enabled' ? '#52c41a' : '#ff4d4f',
                    border: `1px solid ${formData.status === 'enabled' ? '#b7eb8f' : '#ffccc7'}`
                  }}>
                    {formData.status === 'enabled' ? '启用' : '禁用'}
                  </span>
                </Space>
              </Grid.Col>
            </Grid.Row>
          </div>
        )}

        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabPosition="top"
        >
          <Tabs.TabPane key="basicInfo" title="基本信息">
            {renderBasicInfoTab()}
          </Tabs.TabPane>
          
          {(hasBasicInfoSaved || isEditing) && (
            <Tabs.TabPane key="longTermSchedule" title="长期船期">
              {renderLongTermScheduleTab()}
            </Tabs.TabPane>
          )}
        </Tabs>


      </Card>
      
      {/* 补充字段抽屉 */}
      <SupplementDrawer />
    </div>
  );
};

export default RouteForm;