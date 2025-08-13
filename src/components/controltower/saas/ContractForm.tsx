import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Form,
  Input,
  Select,
  Message,
  Typography,
  DatePicker,
  Popconfirm
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
const { RangePicker } = DatePicker;

// 合约表单数据接口
interface ContractFormData {
  shipCompanyNumber: string;
  applicableRoute: string[];
  shipCompany: string;
  contractNature: string;
  destinationName: string;
  nacs: string[];
  mqc: string;
  configuration: string;
  effectiveDate: [Date, Date] | null;
  status: 'enabled' | 'disabled';
}

// 船公司选项
const shipCompanyOptions = [
  { value: 'MSC', label: 'MSC | 地中海' },
  { value: 'COSCO', label: 'COSCO | 中远海运' },
  { value: 'OOCL', label: 'OOCL | 东方海外' },
  { value: 'CMA', label: 'CMA | 达飞轮船' },
  { value: 'ONE', label: 'ONE | 海洋网联' },
  { value: 'HAPAG', label: 'HAPAG | 赫伯罗特' },
  { value: 'ZIM', label: 'ZIM | 以星轮船' },
  { value: 'MAERSK', label: 'MAERSK | 马士基' },
  { value: 'EVERGREEN', label: 'EVERGREEN | 长荣海运' }
];

// 约价性质选项
const contractNatureOptions = [
  { value: '自有约价', label: '自有约价' },
  { value: '客户约价', label: '客户约价' },
  { value: '海外代理约价', label: '海外代理约价' },
  { value: '无约价', label: '无约价' },
  { value: '同行约价', label: '同行约价' },
  { value: 'AFC约价', label: 'AFC约价' },
  { value: 'AFG约价', label: 'AFG约价' }
];

// 适用航线选项
const applicableRouteOptions = [
  { value: '亚欧航线', label: '亚欧航线' },
  { value: '跨太平洋航线', label: '跨太平洋航线' },
  { value: '亚美航线', label: '亚美航线' },
  { value: '地中海航线', label: '地中海航线' },
  { value: '亚洲区域航线', label: '亚洲区域航线' },
  { value: '中东航线', label: '中东航线' },
  { value: '非洲航线', label: '非洲航线' },
  { value: '欧美航线', label: '欧美航线' },
  { value: '波罗的海航线', label: '波罗的海航线' },
  { value: '南美航线', label: '南美航线' }
];

// 适用品名选项
const destinationNameOptions = [
  { value: 'FAK', label: 'FAK' },
  { value: '危险品', label: '危险品' },
  { value: '特种柜', label: '特种柜' },
  { value: '冷冻货', label: '冷冻货' },
  { value: '化工品', label: '化工品' },
  { value: '纺织品', label: '纺织品' },
  { value: '其他', label: '其他' }
];

// 舱保选项
const configurationOptions = [
  { value: '有（20 TEU/月）', label: '有（20 TEU/月）' },
  { value: '有（50 TEU/月）', label: '有（50 TEU/月）' },
  { value: '有（100 TEU/月）', label: '有（100 TEU/月）' },
  { value: '有（300 TEU/月）', label: '有（300 TEU/月）' },
  { value: '无', label: '无' }
];

const ContractForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<ContractFormData>({
    shipCompanyNumber: '',
    applicableRoute: [],
    shipCompany: '',
    contractNature: '',
    destinationName: '',
    nacs: [''],
    mqc: '',
    configuration: '',
    effectiveDate: null,
    status: 'enabled'
  });
  const [loading, setLoading] = useState(false);

  // 初始化数据
  useEffect(() => {
    if (isEditing) {
      // 模拟从API获取数据
      const mockData: ContractFormData = {
        shipCompanyNumber: '888888',
        applicableRoute: ['亚欧航线', '地中海航线'],
        shipCompany: 'MSC',
        contractNature: '客户约价',
        destinationName: '化工品',
        nacs: ['NAC001', 'NAC002', 'NAC003'],
        mqc: '140',
        configuration: '有（20 TEU/月）',
        effectiveDate: [new Date('2024-01-01'), new Date('2024-12-31')],
        status: 'enabled'
      };
      setFormData(mockData);
      form.setFieldsValue({
        ...mockData,
        effectiveDate: mockData.effectiveDate
      });
    }
  }, [id, isEditing, form]);

  // 添加NAC
  const handleAddNac = () => {
    const newNacs = [...formData.nacs, ''];
    setFormData(prev => ({ ...prev, nacs: newNacs }));
  };

  // 删除NAC
  const handleDeleteNac = (index: number) => {
    if (formData.nacs.length <= 1) {
      Message.warning('至少需要保留一个NAC');
      return;
    }
    const newNacs = formData.nacs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, nacs: newNacs }));
  };

  // 更新NAC值
  const handleNacChange = (index: number, value: string) => {
    // 校验NAC格式：大写字母和数字组合
    const nacRegex = /^[A-Z0-9]*$/;
    if (value && !nacRegex.test(value)) {
      Message.warning('NAC只能包含大写字母和数字');
      return;
    }
    
    const newNacs = [...formData.nacs];
    newNacs[index] = value;
    setFormData(prev => ({ ...prev, nacs: newNacs }));
  };

  // 保存数据
  const handleSave = async () => {
    try {
      const basicValues = await form.validate();
      
      // 验证NAC
      const validNacs = formData.nacs.filter(nac => nac.trim() !== '');
      if (validNacs.length === 0) {
        Message.error('请至少填写一个NAC');
        return;
      }

      // 检查NAC重复
      const uniqueNacs = [...new Set(validNacs)];
      if (uniqueNacs.length !== validNacs.length) {
        Message.error('NAC不能重复');
        return;
      }

      setLoading(true);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const saveData = {
        ...basicValues,
        nacs: validNacs,
        effectiveDate: basicValues.effectiveDate ? 
          `${basicValues.effectiveDate[0].toLocaleDateString()} 至 ${basicValues.effectiveDate[1].toLocaleDateString()}` : ''
      };

      console.log('保存数据:', saveData);
      
      Message.success(isEditing ? '编辑成功' : '新增成功');
      
      // 保存成功后返回列表页
      setTimeout(() => {
        navigate('/controltower/saas/contract-management');
      }, 1000);

    } catch (error) {
      console.error('保存失败:', error);
      Message.error('保存失败，请检查表单数据');
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    navigate('/controltower/saas/contract-management');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title heading={4}>
            {isEditing ? '编辑合约' : '新增合约'}
          </Title>
          <Button
            icon={<IconArrowLeft />}
            onClick={handleCancel}
          >
            返回列表
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            setFormData(prev => ({ ...prev, ...changedValues }));
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <Form.Item
                label="船公司约号"
                field="shipCompanyNumber"
                rules={[
                  { required: true, message: '请输入船公司约号' },
                  { maxLength: 50, message: '船公司约号不能超过50个字符' }
                ]}
              >
                <Input placeholder="请输入船公司约号" />
              </Form.Item>

              <Form.Item
                label="船公司"
                field="shipCompany"
                rules={[{ required: true, message: '请选择船公司' }]}
              >
                <Select placeholder="请选择船公司">
                  {shipCompanyOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="约价性质"
                field="contractNature"
                rules={[{ required: true, message: '请选择约价性质' }]}
              >
                <Select placeholder="请选择约价性质">
                  {contractNatureOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="适用航线"
                field="applicableRoute"
                rules={[{ required: true, message: '请选择适用航线' }]}
              >
                <Select
                  placeholder="请选择适用航线"
                  mode="multiple"
                  allowClear
                >
                  {applicableRouteOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="适用品名"
                field="destinationName"
                rules={[{ required: true, message: '请选择适用品名' }]}
              >
                <Select placeholder="请选择适用品名">
                  {destinationNameOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="MQC"
                field="mqc"
                rules={[
                  { required: true, message: '请输入MQC' },
                  { 
                    validator: (value, callback) => {
                      if (value && !/^\d+$/.test(value)) {
                        callback('MQC只能输入数字');
                      } else {
                        callback();
                      }
                    }
                  }
                ]}
              >
                <Input placeholder="请输入MQC" />
              </Form.Item>

              <Form.Item
                label="舱保"
                field="configuration"
                rules={[{ required: true, message: '请选择舱保' }]}
              >
                <Select placeholder="请选择舱保">
                  {configurationOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="有效期"
                field="effectiveDate"
                rules={[{ required: true, message: '请选择有效期' }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                />
              </Form.Item>

              <Form.Item
                label="状态"
                field="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="enabled">启用</Option>
                  <Option value="disabled">禁用</Option>
                </Select>
              </Form.Item>
            </div>
          </Card>

          {/* NAC配置 */}
          <Card 
            title="NAC配置" 
            extra={
              <Button
                type="primary"
                size="small"
                icon={<IconPlus />}
                onClick={handleAddNac}
              >
                添加NAC
              </Button>
            }
            style={{ marginBottom: '20px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {formData.nacs.map((nac, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Input
                    placeholder="请输入NAC（大写字母数字组合）"
                    value={nac}
                    onChange={(value) => handleNacChange(index, value)}
                    style={{ textTransform: 'uppercase' }}
                  />
                  {formData.nacs.length > 1 && (
                    <Popconfirm
                      title="确定要删除这个NAC吗？"
                      onOk={() => handleDeleteNac(index)}
                    >
                      <Button
                        type="text"
                        size="small"
                        status="danger"
                        icon={<IconDelete />}
                      />
                    </Popconfirm>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              注意：NAC只能包含大写字母和数字，不允许重复
            </div>
          </Card>

          {/* 操作按钮 */}
          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button size="large" onClick={handleCancel}>
                取消
              </Button>
              <Button
                type="primary"
                size="large"
                loading={loading}
                icon={<IconSave />}
                onClick={handleSave}
              >
                {isEditing ? '保存修改' : '保存新增'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ContractForm; 