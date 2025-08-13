import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Breadcrumb,
  Select,
  Message,
  Space
} from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";

const FormItem = Form.Item;
const Option = Select.Option;

interface RegionFormData {
  name: string;
  level: string;
  parentId?: string;
}

const CreateRegion: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parentOptions, setParentOptions] = useState<{ label: string; value: string; level: string }[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  // 行政级别选项
  const levelOptions = [
    { label: '省级', value: 'province', parentLevel: null },
    { label: '市级', value: 'city', parentLevel: 'province' },
    { label: '区县级', value: 'district', parentLevel: 'city' },
    { label: '街道级', value: 'street', parentLevel: 'district' }
  ];

  // 模拟获取上级区划数据
  const fetchParentRegions = async (level: string) => {
    // 这里应该调用实际的API
    const mockData = {
      province: [],
      city: [
        { label: '浙江省', value: '330000', level: 'province' }
      ],
      district: [
        { label: '杭州市', value: '330100', level: 'city' },
        { label: '宁波市', value: '330200', level: 'city' }
      ],
      street: [
        { label: '西湖区', value: '330106', level: 'district' },
        { label: '上城区', value: '330102', level: 'district' }
      ]
    };

    const parentLevel = levelOptions.find(opt => opt.value === level)?.parentLevel;
    if (parentLevel) {
      setParentOptions(mockData[parentLevel as keyof typeof mockData] || []);
    } else {
      setParentOptions([]);
    }
  };

  // 处理行政级别变化
  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    form.setFieldValue('parentId', undefined);
    fetchParentRegions(value);
  };

  // 表单提交
  const handleSubmit = async (values: RegionFormData) => {
    try {
      setLoading(true);
      console.log('提交的数据:', values);
      // 这里添加实际的提交逻辑
      Message.success('保存成功');
      navigate('/controltower/saas/region-management');
    } catch (error) {
      Message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 返回列表页
  const handleBack = () => {
    navigate('/controltower/saas/region-management');
  };

  return (
    <ControlTowerSaasLayout
      menuSelectedKey="region"
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>基础数据</Breadcrumb.Item>
          <Breadcrumb.Item>行政区划</Breadcrumb.Item>
          <Breadcrumb.Item>新增区划</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Card>
        <Form
          form={form}
          style={{ width: '600px', margin: '0 auto' }}
          autoComplete="off"
          onSubmit={handleSubmit}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <FormItem
            label="行政级别"
            field="level"
            rules={[{ required: true, message: '请选择行政级别' }]}
          >
            <Select
              placeholder="请选择行政级别"
              onChange={handleLevelChange}
              allowClear
            >
              {levelOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          {selectedLevel !== 'province' && (
            <FormItem
              label="上级区划"
              field="parentId"
              rules={[{ required: true, message: '请选择上级区划' }]}
            >
              <Select
                placeholder="请选择上级区划"
                allowClear
                disabled={!selectedLevel}
              >
                {parentOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </FormItem>
          )}

          <FormItem
            label="名称"
            field="name"
            rules={[
              { required: true, message: '请输入名称' },
              { 
                minLength: 2, 
                message: '名称长度不能小于2个字符' 
              }
            ]}
          >
            <Input placeholder="请输入名称" />
          </FormItem>

          <FormItem wrapperCol={{ offset: 6 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
              <Button onClick={handleBack}>取消</Button>
            </Space>
          </FormItem>
        </Form>
      </Card>
    </ControlTowerSaasLayout>
  );
};

export default CreateRegion; 