import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Checkbox,
  Modal,
  Form,
  Input,
  Select,
  Message,
  Popconfirm,
  Typography,
  Tabs
} from '@arco-design/web-react';
import {
  IconPlus,
  IconEdit,
  IconSearch,
  IconRefresh
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

// 行政区划级别
type DivisionLevel = 'province' | 'city' | 'district' | 'street' | 'village';

// 行政区划数据接口
interface AdministrativeDivision {
  id: string;
  name: string;
  code: string;
  level: DivisionLevel;
  parentId?: string;
  parentName?: string;
  
  // 国家信息
  countryId?: string;
  countryName?: string;
  
  provinceId?: string; // 省ID
  provinceName?: string; // 省名称
  cityId?: string; // 市ID
  cityName?: string; // 市名称
  districtId?: string; // 区县ID
  districtName?: string; // 区县名称
  streetId?: string; // 街道ID
  streetName?: string; // 街道名称
  status: 'enabled' | 'disabled';
}

// 搜索筛选参数
interface SearchParams {
  keyword: string;
  status: string;
  parentId?: string;
  country?: string;
  cityId?: string;
  districtId?: string;
  streetId?: string;
}

// 国家数据
const COUNTRIES = [
  { id: 'CN', name: '中国' },
  { id: 'US', name: '美国' },
  { id: 'JP', name: '日本' },
  { id: 'KR', name: '韩国' },
  { id: 'SG', name: '新加坡' },
  { id: 'MY', name: '马来西亚' },
  { id: 'TH', name: '泰国' },
  { id: 'VN', name: '越南' },
  { id: 'ID', name: '印度尼西亚' },
  { id: 'PH', name: '菲律宾' },
  { id: 'IN', name: '印度' },
  { id: 'AU', name: '澳大利亚' },
  { id: 'NZ', name: '新西兰' },
  { id: 'CA', name: '加拿大' },
  { id: 'MX', name: '墨西哥' },
  { id: 'BR', name: '巴西' },
  { id: 'AR', name: '阿根廷' },
  { id: 'CL', name: '智利' },
  { id: 'PE', name: '秘鲁' },
  { id: 'CO', name: '哥伦比亚' },
  { id: 'GB', name: '英国' },
  { id: 'DE', name: '德国' },
  { id: 'FR', name: '法国' },
  { id: 'IT', name: '意大利' },
  { id: 'ES', name: '西班牙' },
  { id: 'NL', name: '荷兰' },
  { id: 'BE', name: '比利时' },
  { id: 'CH', name: '瑞士' },
  { id: 'AT', name: '奥地利' },
  { id: 'SE', name: '瑞典' },
  { id: 'NO', name: '挪威' },
  { id: 'DK', name: '丹麦' },
  { id: 'FI', name: '芬兰' },
  { id: 'PL', name: '波兰' },
  { id: 'CZ', name: '捷克' },
  { id: 'HU', name: '匈牙利' },
  { id: 'RO', name: '罗马尼亚' },
  { id: 'BG', name: '保加利亚' },
  { id: 'GR', name: '希腊' },
  { id: 'PT', name: '葡萄牙' },
  { id: 'IE', name: '爱尔兰' },
  { id: 'RU', name: '俄罗斯' },
  { id: 'UA', name: '乌克兰' },
  { id: 'BY', name: '白俄罗斯' },
  { id: 'LT', name: '立陶宛' },
  { id: 'LV', name: '拉脱维亚' },
  { id: 'EE', name: '爱沙尼亚' },
  { id: 'EG', name: '埃及' },
  { id: 'SA', name: '沙特阿拉伯' },
  { id: 'AE', name: '阿联酋' },
  { id: 'IL', name: '以色列' },
  { id: 'TR', name: '土耳其' },
  { id: 'ZA', name: '南非' },
  { id: 'NG', name: '尼日利亚' },
  { id: 'KE', name: '肯尼亚' },
  { id: 'GH', name: '加纳' },
  { id: 'MA', name: '摩洛哥' },
  { id: 'TN', name: '突尼斯' },
  { id: 'DZ', name: '阿尔及利亚' }
];

// 行政区划数据库
const ADMINISTRATIVE_DIVISION_DATABASE = {
  provinces: [
    { id: 'db_p_1', name: '北京市', code: '110000', status: 'enabled' },
    { id: 'db_p_2', name: '天津市', code: '120000', status: 'enabled' },
    { id: 'db_p_3', name: '河北省', code: '130000', status: 'enabled' },
    { id: 'db_p_4', name: '山西省', code: '140000', status: 'enabled' },
    { id: 'db_p_5', name: '内蒙古自治区', code: '150000', status: 'enabled' },
    { id: 'db_p_6', name: '辽宁省', code: '210000', status: 'enabled' },
    { id: 'db_p_7', name: '吉林省', code: '220000', status: 'enabled' },
    { id: 'db_p_8', name: '黑龙江省', code: '230000', status: 'enabled' },
    { id: 'db_p_9', name: '上海市', code: '310000', status: 'enabled' },
    { id: 'db_p_10', name: '江苏省', code: '320000', status: 'enabled' },
    { id: 'db_p_11', name: '浙江省', code: '330000', status: 'enabled' },
    { id: 'db_p_12', name: '安徽省', code: '340000', status: 'enabled' },
    { id: 'db_p_13', name: '福建省', code: '350000', status: 'enabled' },
    { id: 'db_p_14', name: '江西省', code: '360000', status: 'enabled' },
    { id: 'db_p_15', name: '山东省', code: '370000', status: 'enabled' },
    { id: 'db_p_16', name: '河南省', code: '410000', status: 'enabled' },
    { id: 'db_p_17', name: '湖北省', code: '420000', status: 'enabled' },
    { id: 'db_p_18', name: '湖南省', code: '430000', status: 'enabled' },
    { id: 'db_p_19', name: '广东省', code: '440000', status: 'enabled' },
    { id: 'db_p_20', name: '广西壮族自治区', code: '450000', status: 'enabled' },
    { id: 'db_p_21', name: '海南省', code: '460000', status: 'enabled' },
    { id: 'db_p_22', name: '重庆市', code: '500000', status: 'enabled' },
    { id: 'db_p_23', name: '四川省', code: '510000', status: 'enabled' },
    { id: 'db_p_24', name: '贵州省', code: '520000', status: 'enabled' },
    { id: 'db_p_25', name: '云南省', code: '530000', status: 'enabled' },
    { id: 'db_p_26', name: '西藏自治区', code: '540000', status: 'enabled' },
    { id: 'db_p_27', name: '陕西省', code: '610000', status: 'enabled' },
    { id: 'db_p_28', name: '甘肃省', code: '620000', status: 'enabled' },
    { id: 'db_p_29', name: '青海省', code: '630000', status: 'enabled' },
    { id: 'db_p_30', name: '宁夏回族自治区', code: '640000', status: 'enabled' },
    { id: 'db_p_31', name: '新疆维吾尔自治区', code: '650000', status: 'enabled' },
    { id: 'db_p_32', name: '台湾省', code: '710000', status: 'enabled' },
    { id: 'db_p_33', name: '香港特别行政区', code: '810000', status: 'enabled' },
    { id: 'db_p_34', name: '澳门特别行政区', code: '820000', status: 'enabled' }
  ],
  cities: [
    // 广东省城市
    { id: 'db_c_1', name: '广州市', code: '440100', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_2', name: '韶关市', code: '440200', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_3', name: '深圳市', code: '440300', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_4', name: '珠海市', code: '440400', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_5', name: '汕头市', code: '440500', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_6', name: '佛山市', code: '440600', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_7', name: '江门市', code: '440700', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_8', name: '湛江市', code: '440800', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_9', name: '茂名市', code: '440900', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_10', name: '肇庆市', code: '441200', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_11', name: '惠州市', code: '441300', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_12', name: '梅州市', code: '441400', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_13', name: '汕尾市', code: '441500', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_14', name: '河源市', code: '441600', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_15', name: '阳江市', code: '441700', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_16', name: '清远市', code: '441800', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_17', name: '东莞市', code: '441900', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_18', name: '中山市', code: '442000', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_19', name: '潮州市', code: '445100', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_20', name: '揭阳市', code: '445200', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    { id: 'db_c_21', name: '云浮市', code: '445300', provinceId: 'db_p_19', provinceName: '广东省', status: 'enabled' },
    
    // 浙江省城市
    { id: 'db_c_22', name: '杭州市', code: '330100', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_23', name: '宁波市', code: '330200', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_24', name: '温州市', code: '330300', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_25', name: '嘉兴市', code: '330400', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_26', name: '湖州市', code: '330500', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_27', name: '绍兴市', code: '330600', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_28', name: '金华市', code: '330700', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_29', name: '衢州市', code: '330800', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_30', name: '舟山市', code: '330900', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_31', name: '台州市', code: '331000', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    { id: 'db_c_32', name: '丽水市', code: '331100', provinceId: 'db_p_11', provinceName: '浙江省', status: 'enabled' },
    
    // 江苏省城市
    { id: 'db_c_33', name: '南京市', code: '320100', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_34', name: '无锡市', code: '320200', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_35', name: '徐州市', code: '320300', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_36', name: '常州市', code: '320400', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_37', name: '苏州市', code: '320500', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_38', name: '南通市', code: '320600', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_39', name: '连云港市', code: '320700', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_40', name: '淮安市', code: '320800', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_41', name: '盐城市', code: '320900', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_42', name: '扬州市', code: '321000', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_43', name: '镇江市', code: '321100', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_44', name: '泰州市', code: '321200', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' },
    { id: 'db_c_45', name: '宿迁市', code: '321300', provinceId: 'db_p_10', provinceName: '江苏省', status: 'enabled' }
  ],
  districts: [
    // 深圳市区县
    { id: 'db_d_1', name: '罗湖区', code: '440303', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    { id: 'db_d_2', name: '福田区', code: '440304', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    { id: 'db_d_3', name: '南山区', code: '440305', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    { id: 'db_d_4', name: '宝安区', code: '440306', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    { id: 'db_d_5', name: '龙岗区', code: '440307', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    { id: 'db_d_6', name: '盐田区', code: '440308', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    { id: 'db_d_7', name: '龙华区', code: '440309', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    { id: 'db_d_8', name: '坪山区', code: '440310', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    { id: 'db_d_9', name: '光明区', code: '440311', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    { id: 'db_d_10', name: '大鹏新区', code: '440312', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_3', cityName: '深圳市', status: 'enabled' },
    
    // 广州市区县
    { id: 'db_d_11', name: '荔湾区', code: '440103', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_12', name: '越秀区', code: '440104', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_13', name: '海珠区', code: '440105', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_14', name: '天河区', code: '440106', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_15', name: '白云区', code: '440111', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_16', name: '黄埔区', code: '440112', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_17', name: '番禺区', code: '440113', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_18', name: '花都区', code: '440114', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_19', name: '南沙区', code: '440115', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_20', name: '从化区', code: '440117', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    { id: 'db_d_21', name: '增城区', code: '440118', provinceId: 'db_p_19', provinceName: '广东省', cityId: 'db_c_1', cityName: '广州市', status: 'enabled' },
    
    // 杭州市区县
    { id: 'db_d_22', name: '上城区', code: '330102', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' },
    { id: 'db_d_23', name: '拱墅区', code: '330105', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' },
    { id: 'db_d_24', name: '西湖区', code: '330106', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' },
    { id: 'db_d_25', name: '滨江区', code: '330108', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' },
    { id: 'db_d_26', name: '萧山区', code: '330109', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' },
    { id: 'db_d_27', name: '余杭区', code: '330110', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' },
    { id: 'db_d_28', name: '富阳区', code: '330111', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' },
    { id: 'db_d_29', name: '临安区', code: '330112', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' },
    { id: 'db_d_30', name: '临平区', code: '330113', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' },
    { id: 'db_d_31', name: '钱塘区', code: '330114', provinceId: 'db_p_11', provinceName: '浙江省', cityId: 'db_c_22', cityName: '杭州市', status: 'enabled' }
  ]
};

// 添加全局样式，强制表头不换行
const tableHeaderStyle = `
  .arco-table-th {
    white-space: nowrap !important;
  }
`;

// Tab配置
const tabConfig = [
  { key: 'province', title: '一级区划', level: 'province' as DivisionLevel },
  { key: 'city', title: '二级区划', level: 'city' as DivisionLevel },
  { key: 'district', title: '三级区划', level: 'district' as DivisionLevel },
  { key: 'street', title: '四级区划', level: 'street' as DivisionLevel },
  { key: 'village', title: '五级区划', level: 'village' as DivisionLevel }
];

const ChinaAdministrativeDivision: React.FC = () => {
  const [activeTab, setActiveTab] = useState('province');
  const [divisionData, setDivisionData] = useState<AdministrativeDivision[]>([]);
  const [filteredData, setFilteredData] = useState<AdministrativeDivision[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectableDivisions, setSelectableDivisions] = useState<any[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [currentDivision, setCurrentDivision] = useState<AdministrativeDivision | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: '',
    parentId: ''
  });
  const [selectSearchParams, setSelectSearchParams] = useState<SearchParams>({
    keyword: '',
    status: '',
    parentId: '',
    country: '',
    cityId: '',
    districtId: '',
    streetId: ''
  });
  const [editForm] = Form.useForm();

  // 多级联动选择状态
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // 初始化示例数据
  useEffect(() => {
    const mockData: AdministrativeDivision[] = [
      // 省份
      { 
        id: '1', 
        name: '广东省', 
        code: '440000', 
        level: 'province',
        countryId: 'CN',
        countryName: '中国',
        status: 'enabled' 
      },
      { 
        id: '2', 
        name: '北京市', 
        code: '110000', 
        level: 'province',
        countryId: 'CN',
        countryName: '中国',
        status: 'enabled' 
      },
      { 
        id: '3', 
        name: '上海市', 
        code: '310000', 
        level: 'province',
        countryId: 'CN',
        countryName: '中国',
        status: 'enabled' 
      },
      { 
        id: '4', 
        name: '浙江省', 
        code: '330000', 
        level: 'province',
        countryId: 'CN',
        countryName: '中国',
        status: 'enabled' 
      },
      
      // 城市
      { 
        id: '5', 
        name: '深圳市', 
        code: '440300', 
        level: 'city', 
        parentId: '1', 
        parentName: '广东省',
        provinceId: '1',
        provinceName: '广东省',
        status: 'enabled' 
      },
      { 
        id: '6', 
        name: '广州市', 
        code: '440100', 
        level: 'city', 
        parentId: '1', 
        parentName: '广东省',
        provinceId: '1',
        provinceName: '广东省',
        status: 'enabled' 
      },
      { 
        id: '7', 
        name: '杭州市', 
        code: '330100', 
        level: 'city', 
        parentId: '4', 
        parentName: '浙江省',
        provinceId: '4',
        provinceName: '浙江省',
        status: 'enabled' 
      },
      { 
        id: '8', 
        name: '宁波市', 
        code: '330200', 
        level: 'city', 
        parentId: '4', 
        parentName: '浙江省',
        provinceId: '4',
        provinceName: '浙江省',
        status: 'enabled' 
      },
      
      // 区县
      { 
        id: '9', 
        name: '南山区', 
        code: '440305', 
        level: 'district', 
        parentId: '5', 
        parentName: '深圳市',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        status: 'enabled' 
      },
      { 
        id: '10', 
        name: '福田区', 
        code: '440304', 
        level: 'district', 
        parentId: '5', 
        parentName: '深圳市',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        status: 'enabled' 
      },
      { 
        id: '11', 
        name: '天河区', 
        code: '440106', 
        level: 'district', 
        parentId: '6', 
        parentName: '广州市',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '6',
        cityName: '广州市',
        status: 'enabled' 
      },
      { 
        id: '12', 
        name: '西湖区', 
        code: '330106', 
        level: 'district', 
        parentId: '7', 
        parentName: '杭州市',
        provinceId: '4',
        provinceName: '浙江省',
        cityId: '7',
        cityName: '杭州市',
        status: 'enabled' 
      },
      
      // 街道
      { 
        id: '13', 
        name: '粤海街道', 
        code: '440305001', 
        level: 'street', 
        parentId: '9', 
        parentName: '南山区',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        status: 'enabled' 
      },
      { 
        id: '14', 
        name: '南头街道', 
        code: '440305002', 
        level: 'street', 
        parentId: '9', 
        parentName: '南山区',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        status: 'enabled' 
      },
      { 
        id: '15', 
        name: '园岭街道', 
        code: '440304001', 
        level: 'street', 
        parentId: '10', 
        parentName: '福田区',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '10',
        districtName: '福田区',
        status: 'enabled' 
      },
      { 
        id: '16', 
        name: '沙头街道', 
        code: '440304002', 
        level: 'street', 
        parentId: '10', 
        parentName: '福田区',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '10',
        districtName: '福田区',
        status: 'enabled' 
      },
      
      // 村/居委会
      { 
        id: '17', 
        name: '深圳湾社区', 
        code: '440305001001', 
        level: 'village', 
        parentId: '13', 
        parentName: '粤海街道',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        streetId: '13',
        streetName: '粤海街道',
        status: 'enabled' 
      },
      { 
        id: '18', 
        name: '科技园社区', 
        code: '440305001002', 
        level: 'village', 
        parentId: '13', 
        parentName: '粤海街道',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        streetId: '13',
        streetName: '粤海街道',
        status: 'enabled' 
      },
      { 
        id: '19', 
        name: '南光社区', 
        code: '440305002001', 
        level: 'village', 
        parentId: '14', 
        parentName: '南头街道',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '9',
        districtName: '南山区',
        streetId: '14',
        streetName: '南头街道',
        status: 'enabled' 
      },
      { 
        id: '20', 
        name: '园东社区', 
        code: '440304001001', 
        level: 'village', 
        parentId: '15', 
        parentName: '园岭街道',
        provinceId: '1',
        provinceName: '广东省',
        cityId: '5',
        cityName: '深圳市',
        districtId: '10',
        districtName: '福田区',
        streetId: '15',
        streetName: '园岭街道',
        status: 'enabled' 
      }
    ];

    setDivisionData(mockData);
    filterDataByLevel('province', mockData);
  }, []);

  // 根据级别筛选数据
  const filterDataByLevel = (level: string, data = divisionData) => {
    let filtered = data.filter(item => item.level === level);
    
    // 应用搜索条件
    if (searchParams.keyword) {
      filtered = filtered.filter(item => 
        item.name.includes(searchParams.keyword) ||
        item.code.includes(searchParams.keyword)
      );
    }
    
    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    if (searchParams.parentId && level !== 'province') {
      filtered = filtered.filter(item => item.parentId === searchParams.parentId);
    }

    setFilteredData(filtered);
  };

  // Tab切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSelectedRowKeys([]);
    filterDataByLevel(key);
  };

  // 搜索筛选功能
  const handleSearch = () => {
    filterDataByLevel(activeTab);
  };

  // 重置搜索
  const handleReset = () => {
    const newSearchParams = {
      keyword: '',
      status: '',
      parentId: ''
    };
    setSearchParams(newSearchParams);
    
    // 重置后重新筛选数据
    const filtered = divisionData.filter(item => item.level === activeTab);
    setFilteredData(filtered);
  };

  // 获取上级行政区划选项
  const getParentOptions = (level: DivisionLevel) => {
    const levelMap = {
      'city': 'province',
      'district': 'city', 
      'street': 'district'
    };
    
    const parentLevel = levelMap[level as keyof typeof levelMap];
    if (!parentLevel) return [];
    
    return divisionData
      .filter(item => item.level === parentLevel && item.status === 'enabled')
      .map(item => ({ value: item.id, label: item.name }));
  };

  // 获取省份选项
  const getProvinceOptions = () => {
    return divisionData
      .filter(item => item.level === 'province' && item.status === 'enabled')
      .map(item => ({ value: item.id, label: item.name }));
  };

  // 获取城市选项
  const getCityOptions = (provinceId: string) => {
    return divisionData
      .filter(item => 
        item.level === 'city' && 
        item.status === 'enabled' && 
        item.provinceId === provinceId
      )
      .map(item => ({ value: item.id, label: item.name }));
  };

  // 表格列定义
  const getColumns = (level: DivisionLevel) => [
    {
      title: (
        <Checkbox
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < filteredData.length}
          checked={selectedRowKeys.length === filteredData.length && filteredData.length > 0}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys(filteredData.map(item => item.id));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: 'checkbox',
      width: 60,
      render: (_: unknown, record: AdministrativeDivision) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(checked) => {
            if (checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 150,
    },
    ...(level === 'province' ? [{
      title: '国家',
      dataIndex: 'countryName',
      width: 120,
      render: (countryName: string) => countryName || '中国',
    }] : []),
    ...(level !== 'province' ? [{
      title: '上级行政区划',
      dataIndex: 'parentName',
      width: 200,
    }] : []),
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status === 'enabled' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: level === 'street' || level === 'village' ? 180 : 120,
      fixed: 'right' as const,
      render: (_: unknown, record: AdministrativeDivision) => (
        <Space>
          {(level === 'street' || level === 'village') && (
            <Button
              type="text"
              size="small"
              icon={<IconEdit />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          )}
          <Popconfirm
            title={`确定要${record.status === 'enabled' ? '禁用' : '启用'}此行政区划吗？`}
            onOk={() => handleToggleStatus(record.id, record.status)}
          >
            <Button 
              type="text" 
              size="small" 
              status={record.status === 'enabled' ? 'warning' : 'success'}
            >
              {record.status === 'enabled' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (record: AdministrativeDivision) => {
    setCurrentDivision(record);
    setIsEditing(true);
    
    // 初始化联动选择状态
    if (record.level === 'city') {
      setSelectedProvince(record.provinceId || '');
      setSelectedCity('');
    } else if (record.level === 'district') {
      setSelectedProvince(record.provinceId || '');
      setSelectedCity(record.cityId || '');
    } else if (record.level === 'street') {
      setSelectedProvince(record.provinceId || '');
      setSelectedCity(record.cityId || '');
    } else if (record.level === 'village') {
      setSelectedProvince(record.provinceId || '');
      setSelectedCity(record.cityId || '');
    } else {
      setSelectedProvince('');
      setSelectedCity('');
    }
    
    editForm.setFieldsValue({
      name: record.name,
      code: record.code,
      provinceId: record.provinceId,
      cityId: record.cityId,
      districtId: record.districtId,
      streetId: record.streetId
    });
    setEditModalVisible(true);
  };

  // 处理新增
  const handleAdd = () => {
    // 所有级别都使用选择模式
    handleSelectMode();
  };

  // 处理选择模式
  const handleSelectMode = () => {
    const currentLevel = activeTab as DivisionLevel;
    const existingNames = divisionData
      .filter(item => item.level === currentLevel)
      .map(item => item.name);
    
    let availableOptions: any[] = [];
    
    if (currentLevel === 'province') {
      availableOptions = ADMINISTRATIVE_DIVISION_DATABASE.provinces.filter(
        province => !existingNames.includes(province.name)
      );
    } else if (currentLevel === 'city') {
      availableOptions = ADMINISTRATIVE_DIVISION_DATABASE.cities.filter(
        city => !existingNames.includes(city.name)
      );
    } else if (currentLevel === 'district') {
      availableOptions = ADMINISTRATIVE_DIVISION_DATABASE.districts.filter(
        district => !existingNames.includes(district.name)
      );
    }
    
    setSelectableDivisions(availableOptions);
    setSelectedDivisions([]);
    setSelectSearchParams({ keyword: '', status: '', parentId: '' });
    setSelectModalVisible(true);
  };

  // 处理选择确认
  const handleSelectConfirm = () => {
    if (selectedDivisions.length === 0) {
      Message.warning('请选择至少一个行政区划');
      return;
    }

    const currentLevel = activeTab as DivisionLevel;
    const newDivisions = selectableDivisions
      .filter(item => selectedDivisions.includes(item.id))
      .map(item => {
        const newItem: AdministrativeDivision = {
          id: Date.now().toString() + '_' + item.id,
          name: item.name,
          code: item.code,
          level: currentLevel,
          status: 'enabled'
        };

        // 添加层级关系信息
        if (currentLevel === 'city') {
          newItem.parentId = item.provinceId;
          newItem.parentName = item.provinceName;
          newItem.provinceId = item.provinceId;
          newItem.provinceName = item.provinceName;
        } else if (currentLevel === 'district') {
          newItem.parentId = item.cityId;
          newItem.parentName = item.cityName;
          newItem.provinceId = item.provinceId;
          newItem.provinceName = item.provinceName;
          newItem.cityId = item.cityId;
          newItem.cityName = item.cityName;
        }

        return newItem;
      });

    setDivisionData(prev => [...prev, ...newDivisions]);
    filterDataByLevel(activeTab, [...divisionData, ...newDivisions]);
    
    setSelectModalVisible(false);
    Message.success(`已添加 ${newDivisions.length} 个${getCurrentTabConfig()?.title}`);
  };

  // 筛选可选择的行政区划
  const filterSelectableDivisions = () => {
    let filtered = [...selectableDivisions];
    
    if (selectSearchParams.keyword) {
      filtered = filtered.filter(item => 
        item.name.includes(selectSearchParams.keyword) ||
        item.code.includes(selectSearchParams.keyword) ||
        (item.provinceName && item.provinceName.includes(selectSearchParams.keyword)) ||
        (item.cityName && item.cityName.includes(selectSearchParams.keyword))
      );
    }

    if (selectSearchParams.status) {
      filtered = filtered.filter(item => item.status === selectSearchParams.status);
    }

    // 如果是市级，可以按省筛选
    if (activeTab === 'city' && selectSearchParams.parentId) {
      filtered = filtered.filter(item => item.provinceId === selectSearchParams.parentId);
    }
    
    // 如果是区县级，可以按市筛选  
    if (activeTab === 'district' && selectSearchParams.parentId) {
      filtered = filtered.filter(item => item.cityId === selectSearchParams.parentId);
    }

    return filtered;
  };

  // 处理状态切换
  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setDivisionData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    filterDataByLevel(activeTab);
    Message.success(`行政区划已${newStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  // 批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要启用的行政区划');
      return;
    }
    
    setDivisionData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'enabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterDataByLevel(activeTab);
    Message.success(`已启用 ${selectedRowKeys.length} 个行政区划`);
  };

  // 批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要禁用的行政区划');
      return;
    }
    
    setDivisionData(prev => prev.map(item => 
      selectedRowKeys.includes(item.id) ? { ...item, status: 'disabled' } : item
    ));
    
    setSelectedRowKeys([]);
    filterDataByLevel(activeTab);
    Message.success(`已禁用 ${selectedRowKeys.length} 个行政区划`);
  };

  // 保存行政区划编辑
  const handleSaveDivision = async () => {
    try {
      const values = await editForm.validate();
      const currentLevel = activeTab as DivisionLevel;
      
      // 构建完整的行政区划信息
      let divisionItem: Partial<AdministrativeDivision> = {
        ...values,
        id: isEditing ? currentDivision?.id : Date.now().toString(),
        level: currentLevel,
        status: isEditing ? currentDivision?.status : 'enabled' as const
      };

      // 根据级别设置父级信息和完整层级信息
      if (currentLevel === 'city') {
        const province = divisionData.find(item => item.id === values.provinceId);
        divisionItem = {
          ...divisionItem,
          parentId: values.provinceId,
          parentName: province?.name,
          provinceId: values.provinceId,
          provinceName: province?.name
        };
      } else if (currentLevel === 'district') {
        const province = divisionData.find(item => item.id === values.provinceId);
        const city = divisionData.find(item => item.id === values.cityId);
        divisionItem = {
          ...divisionItem,
          parentId: values.cityId,
          parentName: city?.name,
          provinceId: values.provinceId,
          provinceName: province?.name,
          cityId: values.cityId,
          cityName: city?.name
        };
      } else if (currentLevel === 'street') {
        const province = divisionData.find(item => item.id === values.provinceId);
        const city = divisionData.find(item => item.id === values.cityId);
        const district = divisionData.find(item => item.id === values.districtId);
        divisionItem = {
          ...divisionItem,
          parentId: values.districtId,
          parentName: district?.name,
          provinceId: values.provinceId,
          provinceName: province?.name,
          cityId: values.cityId,
          cityName: city?.name,
          districtId: values.districtId,
          districtName: district?.name
        };
      } else if (currentLevel === 'village') {
        const province = divisionData.find(item => item.id === values.provinceId);
        const city = divisionData.find(item => item.id === values.cityId);
        const district = divisionData.find(item => item.id === values.districtId);
        const street = divisionData.find(item => item.id === values.streetId);
        divisionItem = {
          ...divisionItem,
          parentId: values.streetId,
          parentName: street?.name,
          provinceId: values.provinceId,
          provinceName: province?.name,
          cityId: values.cityId,
          cityName: city?.name,
          districtId: values.districtId,
          districtName: district?.name,
          streetId: values.streetId,
          streetName: street?.name
        };
      }

      if (isEditing) {
        // 更新现有行政区划
        setDivisionData(prev => prev.map(item => 
          item.id === currentDivision?.id ? { ...item, ...divisionItem } : item
        ));
        Message.success('行政区划信息已更新');
      } else {
        // 新增行政区划
        const newDivision = { ...divisionItem, id: Date.now().toString() } as AdministrativeDivision;
        setDivisionData(prev => [...prev, newDivision]);
        Message.success('行政区划已添加');
      }

      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedProvince('');
      setSelectedCity('');
      filterDataByLevel(activeTab);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 获取当前tab配置
  const getCurrentTabConfig = () => {
    return tabConfig.find(tab => tab.key === activeTab);
  };

  const currentTab = getCurrentTabConfig();

  return (
    <>
      <style>{tableHeaderStyle}</style>
      <Card>
      <div style={{ marginBottom: '20px' }}>
        <Title heading={4} style={{ margin: 0 }}>行政区划</Title>
      </div>

      {/* Tab切换 */}
      <Tabs activeTab={activeTab} onChange={handleTabChange} type="line" size="large">
        {tabConfig.map(tab => (
          <TabPane key={tab.key} title={tab.title} />
        ))}
      </Tabs>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px', marginTop: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'province' ? '1fr 1fr 1fr auto' : '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
            <Input
              placeholder="名称、编码"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>状态</div>
            <Select
              placeholder="选择状态"
              value={searchParams.status}
              onChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}
              allowClear
            >
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </div>
          {activeTab === 'province' ? (
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>国家</div>
              <Select
                placeholder="选择国家"
                value={searchParams.country}
                onChange={(value) => setSearchParams(prev => ({ ...prev, country: value }))}
                allowClear
              >
                {COUNTRIES.map(country => (
                  <Option key={country.id} value={country.id}>{country.name}</Option>
                ))}
              </Select>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>上级行政区划</div>
              <Select
                placeholder="选择上级区划"
                value={searchParams.parentId}
                onChange={(value) => setSearchParams(prev => ({ ...prev, parentId: value }))}
                allowClear
              >
                {getParentOptions(currentTab?.level || 'province').map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<IconRefresh />} onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </Card>

      {/* 操作按钮区域 */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
              新增{currentTab?.title}
            </Button>
          </div>
          {selectedRowKeys.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              paddingLeft: '12px', 
              borderLeft: '1px solid #e5e6e7',
              marginLeft: '4px'
            }}>
              <Button type="outline" onClick={handleBatchEnable}>
                批量启用 ({selectedRowKeys.length})
              </Button>
              <Button type="outline" status="warning" onClick={handleBatchDisable}>
                批量禁用 ({selectedRowKeys.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      <Table
        columns={getColumns(currentTab?.level || 'province')}
        data={filteredData}
        rowKey="id"
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增/编辑行政区划弹窗 */}
      <Modal
        title={isEditing ? `编辑${currentTab?.title}` : `新增${currentTab?.title}`}
        visible={editModalVisible && (activeTab === 'province' || activeTab === 'city' || activeTab === 'district')}
        onOk={handleSaveDivision}
        onCancel={() => setEditModalVisible(false)}
        style={{ width: 600 }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            field="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder={`请输入${currentTab?.title}名称`} />
          </Form.Item>
          
          <Form.Item
            field="code"
            label="编码"
            rules={[{ required: true, message: '请输入编码' }]}
          >
            <Input placeholder="请输入行政区划编码" />
          </Form.Item>
          
          {/* 城市需要选择省 */}
          {activeTab === 'city' && (
            <Form.Item
              field="provinceId"
              label="所属一级行政区划"
              rules={[{ required: true, message: '请选择所属一级行政区划' }]}
            >
              <Select 
                placeholder="请选择所属一级行政区划"
                value={selectedProvince}
                onChange={(value) => {
                  setSelectedProvince(value);
                  editForm.setFieldValue('provinceId', value);
                }}
              >
                {getProvinceOptions().map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* 区县需要选择省市 */}
          {activeTab === 'district' && (
            <>
              <Form.Item
                field="provinceId"
                label="所属一级行政区划"
                rules={[{ required: true, message: '请选择所属一级行政区划' }]}
              >
                <Select 
                  placeholder="请选择所属一级行政区划"
                  value={selectedProvince}
                  onChange={(value) => {
                    setSelectedProvince(value);
                    setSelectedCity('');
                    editForm.setFieldValue('provinceId', value);
                    editForm.setFieldValue('cityId', '');
                  }}
                >
                  {getProvinceOptions().map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="cityId"
                label="所属二级行政区划"
                rules={[{ required: true, message: '请选择所属二级行政区划' }]}
              >
                <Select 
                  placeholder="请选择所属二级行政区划"
                  value={selectedCity}
                  onChange={(value) => {
                    setSelectedCity(value);
                    editForm.setFieldValue('cityId', value);
                  }}
                  disabled={!selectedProvince}
                >
                  {getCityOptions(selectedProvince).map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 选择行政区划弹窗 */}
      <Modal
        title={`选择${getCurrentTabConfig()?.title}`}
        visible={selectModalVisible}
        onOk={handleSelectConfirm}
        onCancel={() => setSelectModalVisible(false)}
        style={{ width: 800 }}
        okText="确定"
        cancelText="取消"
      >
        {/* 搜索筛选区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 第一行：关键词搜索和国家筛选 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
              <div>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>关键词搜索</div>
                <Input
                  placeholder="名称、编码"
                  value={selectSearchParams.keyword}
                  onChange={(value) => setSelectSearchParams(prev => ({ ...prev, keyword: value }))}
                />
              </div>
              
              <div>
                <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>国家</div>
                <Select
                  placeholder="选择国家"
                  value={selectSearchParams.country}
                  onChange={(value) => {
                    if (activeTab === 'province') {
                      setSelectSearchParams(prev => ({ ...prev, country: value }));
                    } else if (activeTab === 'city') {
                      setSelectSearchParams(prev => ({ ...prev, country: value, parentId: '' }));
                    } else if (activeTab === 'district') {
                      setSelectSearchParams(prev => ({ ...prev, country: value, cityId: '', parentId: '' }));
                    } else if (activeTab === 'street') {
                      setSelectSearchParams(prev => ({ ...prev, country: value, parentId: '', cityId: '', districtId: '' }));
                    } else if (activeTab === 'village') {
                      setSelectSearchParams(prev => ({ ...prev, country: value, parentId: '', cityId: '', districtId: '', streetId: '' }));
                    }
                  }}
                  allowClear
                >
                  {COUNTRIES.map(country => (
                    <Option key={country.id} value={country.id}>{country.name}</Option>
                  ))}
                </Select>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="primary" icon={<IconSearch />}>
                  查询
                </Button>
              </div>
            </div>
            
            {/* 第二行：行政区划级联筛选 */}
            {(activeTab === 'city' || activeTab === 'district' || activeTab === 'street' || activeTab === 'village') && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 
                  activeTab === 'city' ? '1fr' : 
                  activeTab === 'district' ? '1fr 1fr' : 
                  activeTab === 'street' ? '1fr 1fr 1fr' : 
                  activeTab === 'village' ? '1fr 1fr 1fr 1fr' : '1fr', 
                gap: '16px', 
                alignItems: 'flex-end' 
              }}>
                {/* 一级行政区划筛选 */}
                {(activeTab === 'city' || activeTab === 'district' || activeTab === 'street' || activeTab === 'village') && (
                  <div>
                    <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>所属一级行政区划</div>
                    <Select
                      placeholder="选择一级行政区划"
                      value={activeTab === 'city' ? selectSearchParams.parentId : 
                             activeTab === 'district' ? selectSearchParams.cityId : 
                             selectSearchParams.parentId}
                      onChange={(value) => {
                        if (activeTab === 'city') {
                          setSelectSearchParams(prev => ({ ...prev, parentId: value }));
                        } else if (activeTab === 'district') {
                          setSelectSearchParams(prev => ({ ...prev, cityId: value, parentId: '' }));
                        } else if (activeTab === 'street') {
                          setSelectSearchParams(prev => ({ ...prev, parentId: value, cityId: '', districtId: '' }));
                        } else if (activeTab === 'village') {
                          setSelectSearchParams(prev => ({ ...prev, parentId: value, cityId: '', districtId: '', streetId: '' }));
                        }
                      }}
                      allowClear
                    >
                      {getProvinceOptions().map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </div>
                )}
                
                {/* 二级行政区划筛选 */}
                {(activeTab === 'district' || activeTab === 'street' || activeTab === 'village') && (
                  <div>
                    <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>所属二级行政区划</div>
                    <Select
                      placeholder="选择二级行政区划"
                      value={activeTab === 'district' ? selectSearchParams.parentId : selectSearchParams.cityId}
                      onChange={(value) => {
                        if (activeTab === 'district') {
                          setSelectSearchParams(prev => ({ ...prev, parentId: value }));
                        } else if (activeTab === 'street') {
                          setSelectSearchParams(prev => ({ ...prev, cityId: value, districtId: '' }));
                        } else if (activeTab === 'village') {
                          setSelectSearchParams(prev => ({ ...prev, cityId: value, districtId: '', streetId: '' }));
                        }
                      }}
                      allowClear
                      disabled={
                        (activeTab === 'district' && !selectSearchParams.cityId) ||
                        (activeTab === 'street' && !selectSearchParams.parentId) ||
                        (activeTab === 'village' && !selectSearchParams.parentId)
                      }
                    >
                      {divisionData
                        .filter(item => item.level === 'city' && item.status === 'enabled' && 
                          (activeTab === 'district' ? 
                            (!selectSearchParams.cityId || item.provinceId === selectSearchParams.cityId) :
                            (!selectSearchParams.parentId || item.provinceId === selectSearchParams.parentId)
                          ))
                        .map(item => ({ value: item.id, label: item.name }))
                        .map(option => (
                          <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))
                      }
                    </Select>
                  </div>
                )}
                
                {/* 三级行政区划筛选 */}
                {(activeTab === 'street' || activeTab === 'village') && (
                  <div>
                    <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>所属三级行政区划</div>
                    <Select
                      placeholder="选择三级行政区划"
                      value={selectSearchParams.districtId}
                      onChange={(value) => {
                        if (activeTab === 'street') {
                          setSelectSearchParams(prev => ({ ...prev, districtId: value }));
                        } else if (activeTab === 'village') {
                          setSelectSearchParams(prev => ({ ...prev, districtId: value, streetId: '' }));
                        }
                      }}
                      allowClear
                      disabled={!selectSearchParams.cityId}
                    >
                      {divisionData
                        .filter(item => item.level === 'district' && item.status === 'enabled' && 
                          (!selectSearchParams.cityId || item.cityId === selectSearchParams.cityId))
                        .map(item => ({ value: item.id, label: item.name }))
                        .map(option => (
                          <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))
                      }
                    </Select>
                  </div>
                )}
                
                {/* 四级行政区划筛选 */}
                {activeTab === 'village' && (
                  <div>
                    <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>所属四级行政区划</div>
                    <Select
                      placeholder="选择四级行政区划"
                      value={selectSearchParams.streetId}
                      onChange={(value) => setSelectSearchParams(prev => ({ ...prev, streetId: value }))}
                      allowClear
                      disabled={!selectSearchParams.districtId}
                    >
                      {divisionData
                        .filter(item => item.level === 'street' && item.status === 'enabled' && 
                          (!selectSearchParams.districtId || item.districtId === selectSearchParams.districtId))
                        .map(item => ({ value: item.id, label: item.name }))
                        .map(option => (
                          <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))
                      }
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        <Table
          columns={[
            {
              title: (
                <Checkbox
                  indeterminate={selectedDivisions.length > 0 && selectedDivisions.length < filterSelectableDivisions().length}
                  checked={selectedDivisions.length === filterSelectableDivisions().length && filterSelectableDivisions().length > 0}
                  onChange={(checked) => {
                    if (checked) {
                      setSelectedDivisions(filterSelectableDivisions().map(item => item.id));
                    } else {
                      setSelectedDivisions([]);
                    }
                  }}
                />
              ),
              dataIndex: 'checkbox',
              width: 60,
              render: (_: unknown, record: any) => (
                <Checkbox
                  checked={selectedDivisions.includes(record.id)}
                  onChange={(checked) => {
                    if (checked) {
                      setSelectedDivisions([...selectedDivisions, record.id]);
                    } else {
                      setSelectedDivisions(selectedDivisions.filter(id => id !== record.id));
                    }
                  }}
                />
              ),
            },
            {
              title: '名称',
              dataIndex: 'name',
              width: 200,
            },
            {
              title: '编码',
              dataIndex: 'code',
              width: 150,
            },
            ...(activeTab === 'province' ? [{
              title: '国家',
              dataIndex: 'countryName',
              width: 150,
            }] : []),
            ...(activeTab === 'city' ? [{
              title: '所属一级区划',
              dataIndex: 'provinceName',
              width: 200,
            }] : []),
            ...(activeTab === 'district' ? [{
              title: '所属一级区划',
              dataIndex: 'provinceName',
              width: 150,
            }, {
              title: '所属二级区划',
              dataIndex: 'cityName',
              width: 150,
            }] : []),
            ...(activeTab === 'street' ? [{
              title: '所属一级区划',
              dataIndex: 'provinceName',
              width: 120,
            }, {
              title: '所属二级区划',
              dataIndex: 'cityName',
              width: 120,
            }, {
              title: '所属三级区划',
              dataIndex: 'districtName',
              width: 120,
            }] : []),
            ...(activeTab === 'village' ? [{
              title: '所属一级区划',
              dataIndex: 'provinceName',
              width: 100,
            }, {
              title: '所属二级区划',
              dataIndex: 'cityName',
              width: 100,
            }, {
              title: '所属三级区划',
              dataIndex: 'districtName',
              width: 100,
            }, {
              title: '所属四级区划',
              dataIndex: 'streetName',
              width: 100,
            }] : [])
          ]}
          data={filterSelectableDivisions()}
          rowKey="id"
          scroll={{ x: activeTab === 'province' ? 600 : 
                      activeTab === 'city' ? 600 : 
                      activeTab === 'district' ? 750 : 
                      activeTab === 'street' ? 950 : 
                      activeTab === 'village' ? 1100 : 450 }}
          pagination={{
            pageSize: 10,
            showTotal: true,
          }}
          style={{ marginTop: '16px' }}
        />
             </Modal>
    </Card>
    </>
  );
};

export default ChinaAdministrativeDivision;