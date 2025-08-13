import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Message,
  Typography,
  Upload,
  Checkbox,
  Divider
} from '@arco-design/web-react';
import {
  IconUpload,
  IconDownload,
  IconPlus,
  IconDelete
} from '@arco-design/web-react/icon';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

// 集装箱信息接口
interface BatchContainerInfo {
  id: string;
  containerNo: string;
  containerType: string;
  status: string;
  location: string;
  selected: boolean;
}

// 动态代码选项
const dynamicCodeOptions = [
  { value: 'GATE_IN', label: 'GATE_IN - 进场' },
  { value: 'GATE_OUT', label: 'GATE_OUT - 出场' },
  { value: 'LOAD', label: 'LOAD - 装船' },
  { value: 'DISCHARGE', label: 'DISCHARGE - 卸船' },
  { value: 'PICKUP', label: 'PICKUP - 提箱' },
  { value: 'RETURN', label: 'RETURN - 还箱' },
  { value: 'EMPTY_RETURN', label: 'EMPTY_RETURN - 还空箱' },
  { value: 'REPAIR_IN', label: 'REPAIR_IN - 进修理厂' },
  { value: 'REPAIR_OUT', label: 'REPAIR_OUT - 出修理厂' },
  { value: 'CLEANING', label: 'CLEANING - 洗箱' },
  { value: 'INSPECTION', label: 'INSPECTION - 验箱' },
  { value: 'STORAGE', label: 'STORAGE - 入库' }
];

const BatchContainerMaintenancePage: React.FC = () => {
  const [containerList, setContainerList] = useState<BatchContainerInfo[]>([]);

  const [batchAddModalVisible, setBatchAddModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [manualInputModalVisible, setManualInputModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [manualForm] = Form.useForm();

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      '可用': 'green',
      '占用': 'orange',
      '维修中': 'red',
      '运输中': 'blue'
    };
    return colorMap[status] || 'gray';
  };

  // 表格列配置
  const columns = [
    {
      title: '选择',
      dataIndex: 'selected',
      width: 60,
      render: (_: any, record: BatchContainerInfo) => (
        <Checkbox
          checked={record.selected}
          onChange={(checked) => handleSelectContainer(record.id, checked)}
        />
      )
    },
    {
      title: '集装箱号',
      dataIndex: 'containerNo',
      width: 150,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{text}</span>
      )
    },
    {
      title: '箱型',
      dataIndex: 'containerType',
      width: 80
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '当前位置',
      dataIndex: 'location',
      width: 200
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: BatchContainerInfo) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            onClick={() => handleRemoveContainer(record.id)}
          >
            移除
          </Button>
        </Space>
      )
    }
  ];

  // 选择/取消选择集装箱
  const handleSelectContainer = (id: string, checked: boolean) => {
    setContainerList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, selected: checked } : item
      )
    );
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    setContainerList(prev => 
      prev.map(item => ({ ...item, selected: checked }))
    );
  };

  // 移除集装箱
  const handleRemoveContainer = (id: string) => {
    setContainerList(prev => prev.filter(item => item.id !== id));
  };

  // 清空列表
  const handleClearList = () => {
    setContainerList([]);
  };

  // 手动输入箱号
  const handleManualInput = async () => {
    try {
      const values = await manualForm.validate();
      const containerNos = values.containerNos
        .split('\n')
        .map((no: string) => no.trim().toUpperCase())
        .filter((no: string) => no.length > 0);

      // 模拟查询集装箱信息
      const newContainers: BatchContainerInfo[] = containerNos.map((no: string, index: number) => ({
        id: Date.now().toString() + index,
        containerNo: no,
        containerType: ['20GP', '40GP', '40HQ'][Math.floor(Math.random() * 3)],
        status: ['可用', '占用', '运输中'][Math.floor(Math.random() * 3)],
        location: ['上海港洋山码头', '宁波港', '深圳港', '青岛港'][Math.floor(Math.random() * 4)],
        selected: false
      }));

      // 过滤重复的箱号
      const existingNos = containerList.map(item => item.containerNo);
      const filteredContainers = newContainers.filter(
        container => !existingNos.includes(container.containerNo)
      );

      setContainerList(prev => [...prev, ...filteredContainers]);
      setManualInputModalVisible(false);
      manualForm.resetFields();
      Message.success(`成功添加 ${filteredContainers.length} 个集装箱`);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 文件上传处理
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
        // 模拟解析Excel/CSV文件
        const newContainers: BatchContainerInfo[] = lines.map((line, index) => {
          const containerNo = line.split(',')[0] || line; // 支持CSV格式或纯文本
          return {
            id: Date.now().toString() + index,
            containerNo: containerNo.toUpperCase(),
            containerType: ['20GP', '40GP', '40HQ'][Math.floor(Math.random() * 3)],
            status: ['可用', '占用', '运输中'][Math.floor(Math.random() * 3)],
            location: ['上海港洋山码头', '宁波港', '深圳港', '青岛港'][Math.floor(Math.random() * 4)],
            selected: false
          };
        });

        // 过滤重复的箱号
        const existingNos = containerList.map(item => item.containerNo);
        const filteredContainers = newContainers.filter(
          container => !existingNos.includes(container.containerNo)
        );

        setContainerList(prev => [...prev, ...filteredContainers]);
        setUploadModalVisible(false);
        Message.success(`成功导入 ${filteredContainers.length} 个集装箱`);
      } catch (error) {
        Message.error('文件解析失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 下载模板
  const handleDownloadTemplate = () => {
    const template = 'CSLU1234567\nMSCU2345678\nCOSU3456789';
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '集装箱号导入模板.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 批量添加动态
  const handleBatchAddDynamic = () => {
    const selectedContainers = containerList.filter(item => item.selected);
    if (selectedContainers.length === 0) {
      Message.warning('请先选择要添加动态的集装箱');
      return;
    }
    form.resetFields();
    setBatchAddModalVisible(true);
  };

  // 动态代码变化处理
  const handleDynamicCodeChange = (value: string) => {
    const selectedOption = dynamicCodeOptions.find(option => option.value === value);
    if (selectedOption) {
      form.setFieldValue('dynamicName', selectedOption.label.split(' - ')[1]);
    }
  };

  // 保存批量动态
  const handleSaveBatchDynamic = async () => {
    try {
      await form.validate();
      const selectedContainers = containerList.filter(item => item.selected);
      
      // 模拟批量保存
      setBatchAddModalVisible(false);
      Message.success(`成功为 ${selectedContainers.length} 个集装箱添加动态`);
      
      // 取消选择状态
      setContainerList(prev => 
        prev.map(item => ({ ...item, selected: false }))
      );
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const selectedCount = containerList.filter(item => item.selected).length;

  return (
    <div>
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <Title heading={4} style={{ margin: 0 }}>批量维护</Title>
        </div>

        {/* 操作区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Space>
                <Button 
                  type="primary" 
                  icon={<IconPlus />} 
                  onClick={() => setManualInputModalVisible(true)}
                >
                  手动输入
                </Button>
                <Button 
                  icon={<IconUpload />} 
                  onClick={() => setUploadModalVisible(true)}
                >
                  文件导入
                </Button>
                <Button 
                  icon={<IconDownload />} 
                  onClick={handleDownloadTemplate}
                >
                  下载模板
                </Button>
                <Divider type="vertical" />
                <Button 
                  type="primary" 
                  disabled={selectedCount === 0}
                  onClick={handleBatchAddDynamic}
                >
                  批量添加动态 ({selectedCount})
                </Button>
              </Space>
            </div>
            <div>
              <Space>
                <Button 
                  type="text" 
                  onClick={() => handleSelectAll(true)}
                  disabled={containerList.length === 0}
                >
                  全选
                </Button>
                <Button 
                  type="text" 
                  onClick={() => handleSelectAll(false)}
                  disabled={selectedCount === 0}
                >
                  取消全选
                </Button>
                <Button 
                  type="text" 
                  status="danger"
                  icon={<IconDelete />} 
                  onClick={handleClearList}
                  disabled={containerList.length === 0}
                >
                  清空列表
                </Button>
              </Space>
            </div>
          </div>
        </Card>

        {/* 集装箱列表 */}
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Title heading={5} style={{ margin: 0 }}>
              集装箱列表 (共 {containerList.length} 个，已选择 {selectedCount} 个)
            </Title>
          </div>
          
          <Table
            columns={columns}
            data={containerList}
            pagination={{
              pageSize: 20,
              showTotal: true,
              showJumper: true,
              sizeCanChange: true
            }}
            scroll={{ y: 400 }}
            noDataElement={
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{ marginBottom: '16px', fontSize: '16px', color: '#999' }}>
                  暂无集装箱数据
                </div>
                <div style={{ color: '#666' }}>
                  请通过"手动输入"或"文件导入"添加集装箱
                </div>
              </div>
            }
          />
        </Card>
      </Card>

      {/* 手动输入弹窗 */}
      <Modal
        title="手动输入集装箱号"
        visible={manualInputModalVisible}
        onOk={handleManualInput}
        onCancel={() => setManualInputModalVisible(false)}
        okText="确定"
        cancelText="取消"
        style={{ width: '500px' }}
      >
        <Form form={manualForm} layout="vertical">
          <Form.Item
            label="集装箱号"
            field="containerNos"
            rules={[{ required: true, message: '请输入集装箱号' }]}
          >
            <TextArea
              placeholder="请输入集装箱号，每行一个&#10;例如：&#10;CSLU1234567&#10;MSCU2345678&#10;COSU3456789"
              rows={8}
              showWordLimit
              maxLength={10000}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>
          <div style={{ fontSize: '12px', color: '#999' }}>
            提示：每行输入一个集装箱号，系统会自动去重并查询集装箱信息
          </div>
        </Form>
      </Modal>

      {/* 文件上传弹窗 */}
      <Modal
        title="文件导入集装箱号"
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        style={{ width: '500px' }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Upload
            drag
            accept=".txt,.csv,.xlsx"
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <div style={{ padding: '40px 0' }}>
              <IconUpload style={{ fontSize: '48px', color: '#165DFF', marginBottom: '16px' }} />
              <div style={{ marginBottom: '8px', fontSize: '16px' }}>
                点击或拖拽文件到此区域上传
              </div>
              <div style={{ color: '#999', fontSize: '14px' }}>
                支持 .txt、.csv、.xlsx 格式文件
              </div>
            </div>
          </Upload>
          
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>文件格式要求：</div>
            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
              • TXT格式：每行一个集装箱号<br/>
              • CSV格式：第一列为集装箱号<br/>
              • Excel格式：第一列为集装箱号
            </div>
          </div>
        </div>
      </Modal>

      {/* 批量添加动态弹窗 */}
      <Modal
        title={`批量添加动态 (${selectedCount} 个集装箱)`}
        visible={batchAddModalVisible}
        onOk={handleSaveBatchDynamic}
        onCancel={() => setBatchAddModalVisible(false)}
        okText="保存"
        cancelText="取消"
        style={{ width: '600px' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="动态代码"
            field="dynamicCode"
            rules={[{ required: true, message: '请选择动态代码' }]}
          >
            <Select
              placeholder="请选择动态代码"
              onChange={handleDynamicCodeChange}
            >
              {dynamicCodeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="动态名称"
            field="dynamicName"
          >
            <Input placeholder="根据动态代码自动填充" disabled />
          </Form.Item>

          <Form.Item
            label="动态时间"
            field="dynamicTime"
            rules={[{ required: true, message: '请选择动态时间' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="订舱号"
            field="bookingNo"
          >
            <Input placeholder="请输入订舱号（可选）" />
          </Form.Item>

          <Form.Item
            label="提单号"
            field="billOfLading"
          >
            <Input placeholder="请输入提单号（可选）" />
          </Form.Item>

          <Form.Item
            label="船名航次"
            field="vesselVoyage"
          >
            <Input placeholder="请输入船名航次，如：COSCO SHANGHAI/2312E（可选）" />
          </Form.Item>

          <Form.Item
            label="关联单位"
            field="relatedUnit"
            rules={[{ required: true, message: '请输入关联单位' }]}
          >
            <Input placeholder="请输入关联单位" />
          </Form.Item>
        </Form>
        
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f7f8fa', borderRadius: '4px' }}>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
            将为以下集装箱添加动态：
          </div>
          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {containerList
              .filter(item => item.selected)
              .map(item => (
                <Tag key={item.id} style={{ margin: '2px', fontFamily: 'monospace' }}>
                  {item.containerNo}
                </Tag>
              ))
            }
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BatchContainerMaintenancePage; 