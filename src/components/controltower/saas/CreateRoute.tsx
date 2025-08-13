import React, { useState } from 'react';
import { 
  Card, 
  Breadcrumb, 
  Typography, 
  Button, 
  Space, 
  Input, 
  Select, 
  Form, 
  Grid, 
  Tabs,
  Message,
  Table,
  Tag
} from '@arco-design/web-react';
import { IconSave, IconDelete, IconPlus, IconMinus /*, IconUpload */ } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './CreateFclInquiry.css'; // 复用已有的CSS

const { Title } = Typography;
const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

// 负责人接口
interface Manager {
  key: number;
  name: string;
  ports: string[];
}

// 负责人类型
type ManagerType = 'precarriage' | 'mainline' | 'lastmile';

/**
 * 航线创建组件
 */
const CreateRoute: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 保存表单状态
  const [formState, setFormState] = useState({
    routeCode: '',
    nameZh: '',
    nameEn: '',
    remark: ''
  });

  // 负责人列表状态
  const [managers, setManagers] = useState<Record<ManagerType, Manager[]>>({
    precarriage: [{ key: 1, name: '', ports: [] }],
    mainline: [{ key: 1, name: '', ports: [] }],
    lastmile: [{ key: 1, name: '', ports: [] }]
  });

  // 人员选项
  const personOptions = [
    { label: '张三', value: '张三' },
    { label: '李四', value: '李四' },
    { label: '王五', value: '王五' },
    { label: '赵六', value: '赵六' },
    { label: '钱七', value: '钱七' },
    { label: '孙八', value: '孙八' },
    { label: '周九', value: '周九' },
    { label: '吴十', value: '吴十' }
  ];

  // 港口选项
  const portOptions = [
    { label: 'CNSHA | 上海', value: 'CNSHA' },
    { label: 'CNNGB | 宁波', value: 'CNNGB' },
    { label: 'CNQIN | 青岛', value: 'CNQIN' },
    { label: 'CNTXG | 天津新港', value: 'CNTXG' },
    { label: 'USLAX | 洛杉矶', value: 'USLAX' },
    { label: 'USNYC | 纽约', value: 'USNYC' },
    { label: 'DEHAM | 汉堡', value: 'DEHAM' },
    { label: 'NLRTM | 鹿特丹', value: 'NLRTM' },
    { label: 'SGSIN | 新加坡', value: 'SGSIN' }
  ];

  // 更新表单状态
  const handleFormChange = (key: string, value: any) => {
    setFormState({
      ...formState,
      [key]: value
    });
  };

  // 添加负责人
  const addManager = (type: ManagerType) => {
    const currentManagers = managers[type];
    const newKey = currentManagers.length > 0 
      ? Math.max(...currentManagers.map(m => m.key)) + 1 
      : 1;
    
    setManagers({
      ...managers,
      [type]: [...currentManagers, { key: newKey, name: '', ports: [] }]
    });
  };

  // 移除负责人
  const removeManager = (type: ManagerType, key: number) => {
    const currentManagers = managers[type];
    if (currentManagers.length === 1) {
      Message.warning('至少需要保留一个负责人');
      return;
    }
    
    setManagers({
      ...managers,
      [type]: currentManagers.filter(m => m.key !== key)
    });
  };

  // 更新负责人字段
  const updateManager = (type: ManagerType, key: number, field: string, value: any) => {
    setManagers({
      ...managers,
      [type]: managers[type].map(manager => {
        if (manager.key === key) {
          return { ...manager, [field]: value };
        }
        return manager;
      })
    });
  };

  // 获取指定类型中已选择的负责人名称列表
  const getSelectedManagerNames = (type: ManagerType, currentKey: number) => {
    return managers[type]
      .filter(manager => manager.key !== currentKey && manager.name)
      .map(manager => manager.name);
  };

  // 负责人类型标题映射
  const managerTypeLabels: Record<ManagerType, string> = {
    precarriage: '港前运价负责人',
    mainline: '干线运价负责人',
    lastmile: '尾程运价负责人'
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validate().then((values) => {
      // 验证每种类型的负责人设置
      const validationErrors: string[] = [];
      
      // 遍历每种类型的负责人
      Object.entries(managers).forEach(([type, managerList]) => {
        const typeLabel = managerTypeLabels[type as ManagerType];
        const emptyPortManagers = managerList.filter(manager => manager.name && (!manager.ports || manager.ports.length === 0));
        const specificPortManagers = managerList.filter(manager => manager.name && manager.ports && manager.ports.length > 0);
        
        // 如果同时存在"起运港为空"和"指定港口"的负责人，则报错
        if (emptyPortManagers.length > 0 && specificPortManagers.length > 0) {
          validationErrors.push(`${typeLabel}中，起运港为空的负责人与指定港口的负责人互斥，不能同时存在`);
        }
        
        // 如果有多个"起运港为空"的负责人，则报错
        if (emptyPortManagers.length > 1) {
          validationErrors.push(`${typeLabel}中，起运港为空的负责人只能设置一位`);
        }
      });
      
      // 如果有验证错误，显示第一个错误并阻止提交
      if (validationErrors.length > 0) {
        Message.error(validationErrors[0]);
        return;
      }
      
      // 整合表单数据
      const formData = {
        ...formState,
        ...values,
        managers
      };
      
      console.log('表单数据:', formData);
      // 提交表单数据
      Message.success('航线创建成功');
      navigate('/controltower/saas/route-management');
    }).catch(error => {
      console.error('表单错误:', error);
    });
  };

  // 取消并返回列表页面
  const handleCancel = () => {
    navigate('/controltower/saas/route-management');
  };

  // 生成负责人表格列
  const getManagerColumns = (type: ManagerType) => [
    {
      title: '操作',
      width: 80,
      render: (_: any, record: Manager) => (
        <Button 
          type="text"
          icon={<IconMinus />}
          onClick={() => removeManager(type, record.key)}
          size="mini"
        />
      )
    },
    {
      title: '负责人名称',
      dataIndex: 'name',
      width: 180,
      render: (value: string, record: Manager) => {
        // 获取当前类型中已选择的负责人名称
        const selectedNames = getSelectedManagerNames(type, record.key);
        
        return (
          <Select 
            placeholder="请选择负责人" 
            value={value}
            onChange={val => updateManager(type, record.key, 'name', val)}
            style={{ width: '100%' }}
            allowClear
          >
            {personOptions.map(option => {
              // 判断该选项是否已被其他行选择
              const isDisabled = selectedNames.includes(option.value);
              return (
                <Option 
                  key={option.value} 
                  value={option.value} 
                  disabled={isDisabled}
                >
                  {option.label}
                </Option>
              );
            })}
          </Select>
        );
      }
    },
    {
      title: '负责起运港',
      dataIndex: 'ports',
      width: 300,
      render: (value: string[], record: Manager) => (
        <Select
          placeholder="请选择负责起运港(可多选)"
          mode="multiple"
          value={value}
          onChange={val => updateManager(type, record.key, 'ports', val)}
          style={{ width: '100%' }}
          allowClear
          renderTag={({ value, closable, onClose }: { value: string; closable: boolean; onClose: (e: any) => void }) => {
            const port = portOptions.find(p => p.value === value);
            return (
              <Tag closable={closable} onClose={onClose} style={{ margin: '2px' }}>
                {port ? port.label.split('|')[0].trim() : value}
              </Tag>
            );
          }}
        >
          {portOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )
    }
  ];

  // 渲染负责人管理Tab
  const renderManagerTab = (type: ManagerType) => (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-800 font-medium">{managerTypeLabels[type]}</div>
        <Button 
          type="primary" 
          icon={<IconPlus />} 
          size="small"
          onClick={() => addManager(type)}
        >
          添加负责人
        </Button>
      </div>
      
      <Table
        borderCell={true}
        columns={getManagerColumns(type)}
        data={managers[type]}
        pagination={false}
        rowKey="key"
      />
    </div>
  );

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="18" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>基础数据</Breadcrumb.Item>
          <Breadcrumb.Item>航线管理</Breadcrumb.Item>
          <Breadcrumb.Item>新增航线</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Form form={form} layout="vertical" initialValues={formState} requiredSymbol={{ position: 'start' }}>
        <Card className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <Title heading={5}>新增航线</Title>
            <Space>
              <Button type="primary" icon={<IconSave />} onClick={handleSubmit}>保存</Button>
              <Button icon={<IconDelete />} onClick={handleCancel}>取消</Button>
            </Space>
          </div>
          
          <Row gutter={[16, 16]}>
            {/* 基本信息 */}
            <Col span={24}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">基本信息</div>
                
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <FormItem label="航线代码" field="routeCode" rules={[{ required: true, message: '请输入航线代码' }]}>
                      <Input 
                        placeholder="例如：TPEB、FEWB" 
                        value={formState.routeCode}
                        onChange={(value) => handleFormChange('routeCode', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={8}>
                    <FormItem label="中文名" field="nameZh" rules={[{ required: true, message: '请输入中文名' }]}>
                      <Input 
                        placeholder="例如：跨太平洋东行" 
                        value={formState.nameZh}
                        onChange={(value) => handleFormChange('nameZh', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={8}>
                    <FormItem label="英文名" field="nameEn" rules={[{ required: true, message: '请输入英文名' }]}>
                      <Input 
                        placeholder="例如：Trans-Pacific Eastbound" 
                        value={formState.nameEn}
                        onChange={(value) => handleFormChange('nameEn', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="备注" field="remark">
                      <Input.TextArea 
                        placeholder="请输入备注信息" 
                        style={{ minHeight: '80px' }}
                        value={formState.remark}
                        onChange={(value) => handleFormChange('remark', value)}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </Col>
            
            {/* 负责人设置 */}
            <Col span={24}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">航线负责人设置</div>
                
                <Tabs defaultActiveTab="precarriage">
                  <TabPane key="precarriage" title="港前运价负责人">
                    {renderManagerTab('precarriage')}
                  </TabPane>
                  <TabPane key="mainline" title="干线运价负责人">
                    {renderManagerTab('mainline')}
                  </TabPane>
                  <TabPane key="lastmile" title="尾程运价负责人">
                    {renderManagerTab('lastmile')}
                  </TabPane>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Card>
      </Form>
    </ControlTowerSaasLayout>
  );
};

export default CreateRoute; 