import React, { useState, useRef } from 'react';
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Message,
  Popconfirm,
  Badge,
  Select
} from '@arco-design/web-react';
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconRefresh,
  IconSearch,
  IconCheck,
  IconLocation,
  IconCalendar,
  IconPrinter,
  IconQrcode
} from '@arco-design/web-react/icon';
import QRCode from 'qrcode';

const { Title } = Typography;
const FormItem = Form.Item;
const { Option } = Select;


// 放箱记录数据类型
interface ReleaseRecord {
  key: string;
  serialNumber: string;        // 流水号
  bookingNumber: string;       // 订舱号
  billOfLading: string;        // 提单号
  status: 'unreleased' | 'released' | 'picked' | 'hold'; // 状态
  releaseYard: string;         // 放箱堆场
  containerNumber?: string;    // 箱号（只有已提箱的有值）
  updatedBy: string;          // 更新人
  updatedTime: string;        // 更新时间
  createdBy: string;
  createdTime: string;
}

// 状态枚举
enum ReleaseStatus {
  UNRELEASED = 'unreleased',
  RELEASED = 'released', 
  PICKED = 'picked',
  HOLD = 'hold'
}

// 状态显示配置
const STATUS_CONFIG = {
  [ReleaseStatus.UNRELEASED]: { text: '未放箱', color: 'gray' },
  [ReleaseStatus.RELEASED]: { text: '已放箱', color: 'blue' },
  [ReleaseStatus.PICKED]: { text: '已提箱', color: 'green' },
  [ReleaseStatus.HOLD]: { text: 'HOLD', color: 'red' }
};

// 可选堆场列表
const YARD_OPTIONS = [
  '长胜2堆场',
  '东海物流园',
  '临港空箱中心',
  '宝山重箱堆场',
  '外高桥物流园',
  '洋山港堆场'
];

const ReleaseManagementPage: React.FC = () => {
  const [releaseList, setReleaseList] = useState<ReleaseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ReleaseRecord | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [batchReleaseModalVisible, setBatchReleaseModalVisible] = useState(false);
  const [assignContainerModalVisible, setAssignContainerModalVisible] = useState(false);
  const [changeYardModalVisible, setChangeYardModalVisible] = useState(false);
  const [barcodeModalVisible, setBarcodeModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReleaseRecord | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [form] = Form.useForm();
  const [batchForm] = Form.useForm();
  const [containerForm] = Form.useForm();
  const [yardForm] = Form.useForm();
  const printRef = useRef<HTMLDivElement>(null);

  // 模拟放箱记录数据
  const mockReleaseData: ReleaseRecord[] = [
    {
      key: '1',
      serialNumber: 'REL20240201001',
      bookingNumber: 'BKG2024020101',
      billOfLading: 'BL2024020101',
      status: ReleaseStatus.PICKED,
      releaseYard: '长胜2堆场',
      containerNumber: 'MSCU1234567',
      updatedBy: '张操作员',
      updatedTime: '2024-02-01 15:30:00',
      createdBy: '系统管理员',
      createdTime: '2024-02-01 09:00:00'
    },
    {
      key: '2',
      serialNumber: 'REL20240201002',
      bookingNumber: 'BKG2024020102',
      billOfLading: 'BL2024020102',
      status: ReleaseStatus.RELEASED,
      releaseYard: '东海物流园',
      updatedBy: '李操作员',
      updatedTime: '2024-02-01 14:20:00',
      createdBy: '系统管理员',
      createdTime: '2024-02-01 08:30:00'
    },
    {
      key: '3',
      serialNumber: 'REL20240201003',
      bookingNumber: 'BKG2024020103',
      billOfLading: 'BL2024020103',
      status: ReleaseStatus.UNRELEASED,
      releaseYard: '宝山重箱堆场',
      updatedBy: '王操作员',
      updatedTime: '2024-02-01 13:10:00',
      createdBy: '系统管理员',
      createdTime: '2024-02-01 08:00:00'
    },
    {
      key: '4',
      serialNumber: 'REL20240201004',
      bookingNumber: 'BKG2024020104',
      billOfLading: 'BL2024020104',
      status: ReleaseStatus.HOLD,
      releaseYard: '外高桥物流园',
      updatedBy: '赵操作员',
      updatedTime: '2024-02-01 12:45:00',
      createdBy: '系统管理员',
      createdTime: '2024-02-01 07:45:00'
    },
    {
      key: '5',
      serialNumber: 'REL20240201005',
      bookingNumber: 'BKG2024020105',
      billOfLading: 'BL2024020105',
      status: ReleaseStatus.PICKED,
      releaseYard: '洋山港堆场',
      containerNumber: 'TEMU9876543',
      updatedBy: '陈操作员',
      updatedTime: '2024-02-01 16:15:00',
      createdBy: '系统管理员',
      createdTime: '2024-02-01 09:15:00'
    }
  ];

  React.useEffect(() => {
    loadReleaseData();
  }, []);

  // 加载放箱数据
  const loadReleaseData = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setReleaseList(mockReleaseData);
      setLoading(false);
    }, 500);
  };

  // 筛选数据
  const getFilteredData = () => {
    return releaseList.filter(record => {
      const matchKeyword = !searchKeyword ||
        record.serialNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        record.bookingNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        record.billOfLading.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (record.containerNumber && record.containerNumber.toLowerCase().includes(searchKeyword.toLowerCase()));
      
      const matchStatus = !statusFilter || record.status === statusFilter;
      
      return matchKeyword && matchStatus;
    });
  };

  // 打开新增/编辑弹窗
  const openModal = (record?: ReleaseRecord) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue({
        ...record
      });
    } else {
      setEditingRecord(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // 保存放箱记录
  const handleSave = async () => {
    try {
      const values = await form.validate();
      
      const recordData: ReleaseRecord = {
        key: editingRecord?.key || Date.now().toString(),
        ...values,
        createdBy: editingRecord ? editingRecord.createdBy : '当前用户',
        createdTime: editingRecord ? editingRecord.createdTime : new Date().toLocaleString(),
        updatedBy: '当前用户',
        updatedTime: new Date().toLocaleString()
      };

      if (editingRecord) {
        // 编辑
        setReleaseList(prev => prev.map(item =>
          item.key === editingRecord.key ? recordData : item
        ));
        Message.success('放箱记录更新成功！');
      } else {
        // 新增
        setReleaseList(prev => [recordData, ...prev]);
        Message.success('放箱记录添加成功！');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除放箱记录
  const handleDelete = (key: string) => {
    setReleaseList(prev => prev.filter(item => item.key !== key));
    Message.success('放箱记录删除成功！');
  };

  // 批量放箱
  const handleBatchRelease = async () => {
    try {
      const values = await batchForm.validate();
      
      setReleaseList(prev => prev.map(item =>
        selectedRowKeys.includes(item.key)
          ? {
              ...item,
              status: ReleaseStatus.RELEASED,
              releaseYard: values.releaseYard,
              updatedBy: '当前用户',
              updatedTime: new Date().toLocaleString()
            }
          : item
      ));
      
      Message.success(`成功批量放箱 ${selectedRowKeys.length} 条记录！`);
      setBatchReleaseModalVisible(false);
      setSelectedRowKeys([]);
      batchForm.resetFields();
    } catch (error) {
      console.error('批量放箱失败:', error);
    }
  };

  // 指定箱号
  const handleAssignContainer = async () => {
    try {
      const values = await containerForm.validate();
      
      setReleaseList(prev => prev.map(item =>
        selectedRowKeys.includes(item.key)
          ? {
              ...item,
              containerNumber: values.containerNumber,
              status: ReleaseStatus.PICKED,
              updatedBy: '当前用户',
              updatedTime: new Date().toLocaleString()
            }
          : item
      ));
      
      Message.success(`成功为 ${selectedRowKeys.length} 条记录指定箱号！`);
      setAssignContainerModalVisible(false);
      setSelectedRowKeys([]);
      containerForm.resetFields();
    } catch (error) {
      console.error('指定箱号失败:', error);
    }
  };

  // 更改放箱堆场
  const handleChangeYard = async () => {
    try {
      const values = await yardForm.validate();
      
      setReleaseList(prev => prev.map(item =>
        selectedRowKeys.includes(item.key)
          ? {
              ...item,
              releaseYard: values.newYard,
              updatedBy: '当前用户',
              updatedTime: new Date().toLocaleString()
            }
          : item
      ));
      
      Message.success(`成功更改 ${selectedRowKeys.length} 条记录的放箱堆场！`);
      setChangeYardModalVisible(false);
      setSelectedRowKeys([]);
      yardForm.resetFields();
    } catch (error) {
      console.error('更改堆场失败:', error);
    }
  };

  // 生成条码
  const generateBarcode = async (record: ReleaseRecord) => {
    try {
      setSelectedRecord(record);
      
      // 生成二维码数据
      const qrData = JSON.stringify({
        serialNumber: record.serialNumber,
        bookingNumber: record.bookingNumber,
        billOfLading: record.billOfLading,
        releaseYard: record.releaseYard,
        status: record.status,
        generateTime: new Date().toISOString()
      });
      
      // 生成二维码图片
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
      setBarcodeModalVisible(true);
    } catch (error) {
      console.error('生成条码失败:', error);
      Message.error('生成条码失败');
    }
  };

  // 打印PDF
  const printToPDF = () => {
    if (!printRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      Message.error('无法打开打印窗口');
      return;
    }

    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>放箱条码 - ${selectedRecord?.serialNumber}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Microsoft YaHei', sans-serif;
              margin: 20px;
              background: white;
            }
            .barcode-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 2px solid #333;
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 14px;
              color: #666;
            }
            .content {
              display: flex;
              gap: 20px;
              align-items: flex-start;
            }
            .qr-section {
              flex: 0 0 200px;
              text-align: center;
            }
            .qr-code {
              margin-bottom: 10px;
            }
            .qr-title {
              font-size: 12px;
              color: #666;
            }
            .info-section {
              flex: 1;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
              font-size: 14px;
            }
            .info-label {
              font-weight: bold;
              min-width: 100px;
              color: #333;
            }
            .info-value {
              color: #666;
            }
            .footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
            @media print {
              body { margin: 0; }
              .barcode-container { border: 2px solid #333; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // 等待内容加载完成后打印
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    
    Message.success('已发送到打印机');
  };

  // 格式化状态显示
  const formatStatus = (status: 'unreleased' | 'released' | 'picked' | 'hold') => {
    return STATUS_CONFIG[status as ReleaseStatus]?.text || status;
  };

  // 表格列配置
  const columns = [
    {
      title: '流水号',
      dataIndex: 'serialNumber',
      width: 150,
      render: (serialNumber: string) => (
        <div className="font-semibold text-blue-600">{serialNumber}</div>
      )
    },
    {
      title: '订舱号',
      dataIndex: 'bookingNumber',
      width: 140,
    },
    {
      title: '提单号',
      dataIndex: 'billOfLading',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: ReleaseStatus) => {
        const config = STATUS_CONFIG[status];
        return (
          <Badge color={config.color} text={config.text} />
        );
      }
    },
    {
      title: '放箱堆场',
      dataIndex: 'releaseYard',
      width: 150,
      render: (yard: string) => (
        <div className="flex items-center">
          <IconLocation className="mr-1 text-gray-400 w-3 h-3" />
          <span className="text-sm">{yard}</span>
        </div>
      )
    },
    {
      title: '箱号',
      dataIndex: 'containerNumber',
      width: 140,
      render: (containerNumber?: string) => (
        containerNumber ? (
          <div className="flex items-center">
            <IconCheck className="mr-1 text-green-500 w-3 h-3" />
            <span className="text-sm font-medium text-green-600">{containerNumber}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )
      )
    },
    {
      title: '更新信息',
      dataIndex: 'updatedBy',
      width: 150,
      render: (_: any, record: ReleaseRecord) => (
        <div>
          <div className="text-sm">{record.updatedBy}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <IconCalendar className="mr-1 w-3 h-3" />
            {record.updatedTime}
          </div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render: (_: any, record: ReleaseRecord) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          {record.status === ReleaseStatus.RELEASED && (
            <Button
              type="text"
              size="small"
              icon={<IconQrcode />}
              onClick={() => generateBarcode(record)}
              className="text-blue-600"
            >
              生成条码
            </Button>
          )}
          <Popconfirm
            title="确定要删除这条记录吗？"
            onOk={() => handleDelete(record.key)}
          >
            <Button
              type="text"
              size="small"
              status="danger"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* 页面标题和操作区域 */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Title heading={5}>
            <IconCheck className="mr-2" />
            放箱管理
          </Title>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => openModal()}
          >
            新增记录
          </Button>
        </div>
        
        {/* 搜索和筛选区域 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Input
              placeholder="搜索流水号、订舱号、提单号、箱号"
              value={searchKeyword}
              onChange={(value) => setSearchKeyword(value)}
              prefix={<IconSearch />}
              allowClear
            />
          </div>
          
          <div>
            <Select
              placeholder="筛选状态"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value={ReleaseStatus.UNRELEASED}>未放箱</Option>
              <Option value={ReleaseStatus.RELEASED}>已放箱</Option>
              <Option value={ReleaseStatus.PICKED}>已提箱</Option>
              <Option value={ReleaseStatus.HOLD}>HOLD</Option>
            </Select>
          </div>
          
          <div>
            <Button icon={<IconRefresh />} onClick={loadReleaseData}>
              刷新
            </Button>
          </div>
        </div>

        {/* 批量操作按钮 */}
        <div className="flex gap-2">
          <Button
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={() => setBatchReleaseModalVisible(true)}
          >
            批量放箱 ({selectedRowKeys.length})
          </Button>
          <Button
            disabled={selectedRowKeys.length === 0}
            onClick={() => setAssignContainerModalVisible(true)}
          >
            指定箱号 ({selectedRowKeys.length})
          </Button>
          <Button
            disabled={selectedRowKeys.length === 0}
            onClick={() => setChangeYardModalVisible(true)}
          >
            更改放箱堆场 ({selectedRowKeys.length})
          </Button>
        </div>
      </Card>

      {/* 放箱记录列表 */}
      <Card>
        <Table
          columns={columns}
          data={getFilteredData()}
          loading={loading}
          pagination={{
            showTotal: true,
            pageSize: 10,
            showJumper: true
          }}
          scroll={{ x: 1400 }}
          border={{
            wrapper: true,
            cell: true
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys: (string | number)[]) => setSelectedRowKeys(keys.map(String)),
            checkboxProps: (record) => ({
              disabled: record.status === ReleaseStatus.PICKED
            })
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑放箱记录' : '新增放箱记录'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        style={{ width: 600 }}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: ReleaseStatus.UNRELEASED
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem
              label="流水号"
              field="serialNumber"
              rules={[{ required: true, message: '请输入流水号' }]}
            >
              <Input placeholder="请输入流水号" />
            </FormItem>
            
            <FormItem
              label="订舱号"
              field="bookingNumber"
              rules={[{ required: true, message: '请输入订舱号' }]}
            >
              <Input placeholder="请输入订舱号" />
            </FormItem>
            
            <FormItem
              label="提单号"
              field="billOfLading"
              rules={[{ required: true, message: '请输入提单号' }]}
            >
              <Input placeholder="请输入提单号" />
            </FormItem>
            
            <FormItem
              label="状态"
              field="status"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value={ReleaseStatus.UNRELEASED}>未放箱</Option>
                <Option value={ReleaseStatus.RELEASED}>已放箱</Option>
                <Option value={ReleaseStatus.PICKED}>已提箱</Option>
                <Option value={ReleaseStatus.HOLD}>HOLD</Option>
              </Select>
            </FormItem>
            
            <FormItem
              label="放箱堆场"
              field="releaseYard"
              rules={[{ required: true, message: '请选择放箱堆场' }]}
            >
              <Select placeholder="请选择放箱堆场">
                {YARD_OPTIONS.map(yard => (
                  <Option key={yard} value={yard}>{yard}</Option>
                ))}
              </Select>
            </FormItem>
            
            <FormItem
              label="箱号"
              field="containerNumber"
              help="只有已提箱状态需要填写"
            >
              <Input placeholder="请输入箱号" />
            </FormItem>
          </div>
        </Form>
      </Modal>

      {/* 批量放箱弹窗 */}
      <Modal
        title="批量放箱"
        visible={batchReleaseModalVisible}
        onCancel={() => setBatchReleaseModalVisible(false)}
        onOk={handleBatchRelease}
        okText="确认放箱"
        cancelText="取消"
      >
        <Form form={batchForm} layout="vertical">
          <FormItem
            label="放箱堆场"
            field="releaseYard"
            rules={[{ required: true, message: '请选择放箱堆场' }]}
          >
            <Select placeholder="请选择放箱堆场">
              {YARD_OPTIONS.map(yard => (
                <Option key={yard} value={yard}>{yard}</Option>
              ))}
            </Select>
          </FormItem>
          <div className="text-sm text-gray-600">
            将对选中的 {selectedRowKeys.length} 条记录执行批量放箱操作
          </div>
        </Form>
      </Modal>

      {/* 指定箱号弹窗 */}
      <Modal
        title="指定箱号"
        visible={assignContainerModalVisible}
        onCancel={() => setAssignContainerModalVisible(false)}
        onOk={handleAssignContainer}
        okText="确认指定"
        cancelText="取消"
      >
        <Form form={containerForm} layout="vertical">
          <FormItem
            label="箱号"
            field="containerNumber"
            rules={[{ required: true, message: '请输入箱号' }]}
          >
            <Input placeholder="请输入箱号" />
          </FormItem>
          <div className="text-sm text-gray-600">
            将为选中的 {selectedRowKeys.length} 条记录指定相同箱号，并更新状态为"已提箱"
          </div>
        </Form>
      </Modal>

      {/* 更改放箱堆场弹窗 */}
      <Modal
        title="更改放箱堆场"
        visible={changeYardModalVisible}
        onCancel={() => setChangeYardModalVisible(false)}
        onOk={handleChangeYard}
        okText="确认更改"
        cancelText="取消"
      >
        <Form form={yardForm} layout="vertical">
          <FormItem
            label="新的放箱堆场"
            field="newYard"
            rules={[{ required: true, message: '请选择新的放箱堆场' }]}
          >
            <Select placeholder="请选择新的放箱堆场">
              {YARD_OPTIONS.map(yard => (
                <Option key={yard} value={yard}>{yard}</Option>
              ))}
            </Select>
          </FormItem>
          <div className="text-sm text-gray-600">
            将更改选中的 {selectedRowKeys.length} 条记录的放箱堆场
          </div>
        </Form>
      </Modal>

      {/* 条码预览弹窗 */}
      <Modal
        title="放箱条码预览"
        visible={barcodeModalVisible}
        onCancel={() => setBarcodeModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBarcodeModalVisible(false)}>
            关闭
          </Button>,
          <Button key="print" type="primary" icon={<IconPrinter />} onClick={printToPDF}>
            打印PDF
          </Button>
        ]}
        style={{ width: 700 }}
      >
        {selectedRecord && (
          <div ref={printRef}>
            <div className="barcode-container" style={{ border: '2px solid #333', padding: '20px', background: 'white' }}>
              {/* 标题区域 */}
              <div className="header" style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                <div className="title" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                  集装箱放箱条码
                </div>
                <div className="subtitle" style={{ fontSize: '14px', color: '#666' }}>
                  Container Release Barcode
                </div>
              </div>

              {/* 内容区域 */}
              <div className="content" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* 二维码区域 */}
                <div className="qr-section" style={{ flex: '0 0 200px', textAlign: 'center' }}>
                  <div className="qr-code" style={{ marginBottom: '10px' }}>
                    <img src={qrCodeUrl} alt="二维码" style={{ width: '180px', height: '180px' }} />
                  </div>
                  <div className="qr-title" style={{ fontSize: '12px', color: '#666' }}>
                    扫描二维码查看详情
                  </div>
                </div>

                {/* 信息区域 */}
                <div className="info-section" style={{ flex: 1 }}>
                  <div className="info-row" style={{ display: 'flex', marginBottom: '8px', fontSize: '14px' }}>
                    <span className="info-label" style={{ fontWeight: 'bold', minWidth: '100px', color: '#333' }}>
                      流水号：
                    </span>
                    <span className="info-value" style={{ color: '#666' }}>
                      {selectedRecord.serialNumber}
                    </span>
                  </div>
                  
                  <div className="info-row" style={{ display: 'flex', marginBottom: '8px', fontSize: '14px' }}>
                    <span className="info-label" style={{ fontWeight: 'bold', minWidth: '100px', color: '#333' }}>
                      订舱号：
                    </span>
                    <span className="info-value" style={{ color: '#666' }}>
                      {selectedRecord.bookingNumber}
                    </span>
                  </div>
                  
                  <div className="info-row" style={{ display: 'flex', marginBottom: '8px', fontSize: '14px' }}>
                    <span className="info-label" style={{ fontWeight: 'bold', minWidth: '100px', color: '#333' }}>
                      提单号：
                    </span>
                    <span className="info-value" style={{ color: '#666' }}>
                      {selectedRecord.billOfLading}
                    </span>
                  </div>
                  
                  <div className="info-row" style={{ display: 'flex', marginBottom: '8px', fontSize: '14px' }}>
                    <span className="info-label" style={{ fontWeight: 'bold', minWidth: '100px', color: '#333' }}>
                      放箱堆场：
                    </span>
                    <span className="info-value" style={{ color: '#666' }}>
                      {selectedRecord.releaseYard}
                    </span>
                  </div>
                  
                  <div className="info-row" style={{ display: 'flex', marginBottom: '8px', fontSize: '14px' }}>
                    <span className="info-label" style={{ fontWeight: 'bold', minWidth: '100px', color: '#333' }}>
                      状态：
                    </span>
                    <span className="info-value" style={{ color: '#666' }}>
                      {formatStatus(selectedRecord.status)}
                    </span>
                  </div>
                  
                  <div className="info-row" style={{ display: 'flex', marginBottom: '8px', fontSize: '14px' }}>
                    <span className="info-label" style={{ fontWeight: 'bold', minWidth: '100px', color: '#333' }}>
                      更新时间：
                    </span>
                    <span className="info-value" style={{ color: '#666' }}>
                      {selectedRecord.updatedTime}
                    </span>
                  </div>
                  
                  <div className="info-row" style={{ display: 'flex', marginBottom: '8px', fontSize: '14px' }}>
                    <span className="info-label" style={{ fontWeight: 'bold', minWidth: '100px', color: '#333' }}>
                      操作人：
                    </span>
                    <span className="info-value" style={{ color: '#666' }}>
                      {selectedRecord.updatedBy}
                    </span>
                  </div>
                </div>
              </div>

              {/* 页脚区域 */}
              <div className="footer" style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #ddd', fontSize: '12px', color: '#999', textAlign: 'center' }}>
                <div>智慧集装箱管理系统 SMARTAINER</div>
                <div>生成时间：{new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReleaseManagementPage; 