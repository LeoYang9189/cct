import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Modal,
  Message,
  Tag,
  Tooltip,
  Typography
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconDelete,
  IconDownload,
  IconEye
} from '@arco-design/web-react/icon';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Title } = Typography;

// 任务状态枚举
const TaskStatus = {
  PROCESSING: 'processing', 
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// 任务状态显示配置
const statusConfig = {
  [TaskStatus.PROCESSING]: { text: '处理中', color: 'blue' },
  [TaskStatus.COMPLETED]: { text: '已完成', color: 'green' },
  [TaskStatus.FAILED]: { text: '失败', color: 'red' }
};

// 来源枚举
const TaskSource = {
  SUPER_FREIGHT: '超级运价',
  ORDER_CENTER: '订单中心', 
  CUSTOMER_CENTER: '客商中心'
};

// 任务数据接口
interface TaskData {
  id: string;
  fileName: string;
  source: string;
  creator: string;
  status: string;
  exportTime: string;
  remark: string;
  fileSize?: string;
  duration?: string;
}

const TaskManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('import');
  const [loading, setLoading] = useState(false);
  const [importTasks, setImportTasks] = useState<TaskData[]>([]);
  const [exportTasks, setExportTasks] = useState<TaskData[]>([]);
  
  // 搜索条件
  const [searchForm, setSearchForm] = useState({
    fileName: '',
    creator: '',
    status: '',
    dateRange: [] as any[]
  });

  // 删除确认对话框状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<TaskData | null>(null);

  // 初始化数据
  useEffect(() => {
    loadTaskData();
  }, [activeTab]);

  // 加载任务数据
  const loadTaskData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeTab === 'import') {
        setImportTasks(generateMockImportData());
      } else {
        setExportTasks(generateMockExportData());
      }
    } catch (error) {
      Message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟导入任务数据
  const generateMockImportData = (): TaskData[] => {
    return [
      {
        id: '1',
        fileName: '客户信息导入-20241227.xlsx',
        source: TaskSource.CUSTOMER_CENTER,
        creator: '张三',
        status: TaskStatus.COMPLETED,
        exportTime: '2024-12-27 13:58',
        remark: '文件大小: 24.56 KB, 导出耗时: 116ms, 上传耗时: 132ms',
        fileSize: '24.56 KB',
        duration: '116ms'
      },
      {
        id: '2',
        fileName: '订单数据导入-20241215.xlsx',
        source: TaskSource.ORDER_CENTER,
        creator: '李四',
        status: TaskStatus.PROCESSING,
        exportTime: '2024-12-15 17:15',
        remark: '文件大小: 7.32 KB, 导出耗时: 23ms, 上传耗时: 115ms',
        fileSize: '7.32 KB',
        duration: '23ms'
      },
      {
        id: '3',
        fileName: '运价数据导入-20241012.xlsx',
        source: TaskSource.SUPER_FREIGHT,
        creator: '王五',
        status: TaskStatus.FAILED,
        exportTime: '2024-10-12 10:40',
        remark: '文件大小: 6.69 KB, 导出耗时: 27ms, 上传耗时: 142ms',
        fileSize: '6.69 KB',
        duration: '27ms'
      }
    ];
  };

  // 生成模拟导出任务数据
  const generateMockExportData = (): TaskData[] => {
    return [
      {
        id: '4',
        fileName: '2024年12月订单数据导出-2024-12-27.xlsx',
        source: TaskSource.ORDER_CENTER,
        creator: '张三',
        status: TaskStatus.COMPLETED,
        exportTime: '2024-12-27 13:58',
        remark: '文件大小: 24.56 KB, 导出耗时: 116ms, 上传耗时: 132ms',
        fileSize: '24.56 KB',
        duration: '116ms'
      },
      {
        id: '5',
        fileName: '2024年11月客户统计数据导出-2024-12-15.xlsx',
        source: TaskSource.CUSTOMER_CENTER,
        creator: '李四',
        status: TaskStatus.COMPLETED,
        exportTime: '2024-12-15 17:15',
        remark: '文件大小: 7.32 KB, 导出耗时: 23ms, 上传耗时: 115ms',
        fileSize: '7.32 KB',
        duration: '23ms'
      },
      {
        id: '6',
        fileName: '2024年10月运价数据导出-2024-10-12.xlsx',
        source: TaskSource.SUPER_FREIGHT,
        creator: '王五',
        status: TaskStatus.COMPLETED,
        exportTime: '2024-10-12 10:40',
        remark: '文件大小: 6.69 KB, 导出耗时: 27ms, 上传耗时: 142ms',
        fileSize: '6.69 KB',
        duration: '27ms'
      },
      {
        id: '7',
        fileName: '2024年01月财务数据导出-2024-01-31.xlsx',
        source: TaskSource.CUSTOMER_CENTER,
        creator: '赵六',
        status: TaskStatus.COMPLETED,
        exportTime: '2024-01-31 14:06',
        remark: '文件大小: 6.95 KB, 导出耗时: 33ms, 上传耗时: 123ms',
        fileSize: '6.95 KB',
        duration: '33ms'
      },
      {
        id: '8',
        fileName: '2024年01月客户数据导出-2024-01-31.xlsx',
        source: TaskSource.CUSTOMER_CENTER,
        creator: '张三',
        status: TaskStatus.COMPLETED,
        exportTime: '2024-01-31 14:06',
        remark: '文件大小: 6.95 KB, 导出耗时: 111ms, 上传耗时: 172ms',
        fileSize: '6.95 KB',
        duration: '111ms'
      }
    ];
  };

  // 搜索处理
  const handleSearch = () => {
    loadTaskData();
  };

  // 重置搜索
  const handleReset = () => {
    setSearchForm({
      fileName: '',
      creator: '',
      status: '',
      dateRange: []
    });
    loadTaskData();
  };

  // 删除任务
  const handleDelete = (record: TaskData) => {
    console.log('删除函数被调用', record);
    setDeleteRecord(record);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deleteRecord) {
      console.log('确认删除', deleteRecord.id);
      if (activeTab === 'import') {
        setImportTasks(prev => prev.filter(item => item.id !== deleteRecord.id));
      } else {
        setExportTasks(prev => prev.filter(item => item.id !== deleteRecord.id));
      }
      Message.success('删除成功');
    }
    setDeleteModalVisible(false);
    setDeleteRecord(null);
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteRecord(null);
  };

  // 查看文件
  const handleView = (record: TaskData) => {
    navigate(`/controltower/import-task-detail/${record.id}`);
  };

  // 下载文件
  const handleDownload = (record: TaskData) => {
    Message.success(`下载文件: ${record.fileName}`);
    // 这里可以添加实际的下载逻辑
    // 例如：window.open(record.downloadUrl) 或者其他下载方式
  };

  // 表格列配置
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 300,
      render: (text: string) => (
        <Tooltip content={text}>
          <div style={{ 
            maxWidth: '280px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 120
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      render: (text: string) => (
        <Tooltip content={text}>
          <div style={{ 
            maxWidth: '80px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status];
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: activeTab === 'import' ? '导入时间' : '导出时间',
      dataIndex: 'exportTime',
      key: 'exportTime',
      width: 150
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 300,
      render: (text: string) => (
        <Tooltip content={text}>
          <div style={{ 
            maxWidth: '280px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: TaskData) => {
        const handleDeleteClick = () => {
          console.log('删除按钮被点击', record);
          handleDelete(record);
        };

        const handleViewDownloadClick = () => {
          if (activeTab === 'import') {
            handleView(record);
          } else {
            handleDownload(record);
          }
        };

        return (
          <Space>
            <Button
              type="text"
              size="small"
              icon={activeTab === 'import' ? <IconEye /> : <IconDownload />}
              onClick={handleViewDownloadClick}
              disabled={record.status !== TaskStatus.COMPLETED}
            >
              {activeTab === 'import' ? '查看' : '下载'}
            </Button>
            <Button
              type="text"
              size="small"
              icon={<IconDelete />}
              status="danger"
              onClick={handleDeleteClick}
            >
              删除
            </Button>
          </Space>
        );
      }
    }
  ];

  // 渲染搜索区域
  const renderSearchArea = () => (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: '#333', fontSize: '14px' }}>文件名</span>
          <Input
            placeholder="请输入文件名称"
            value={searchForm.fileName}
            onChange={(value) => setSearchForm(prev => ({ ...prev, fileName: value }))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: '#333', fontSize: '14px' }}>创建人</span>
          <Select
             placeholder="请选择创建人"
             value={searchForm.creator}
             onChange={(value) => setSearchForm(prev => ({ ...prev, creator: value }))}
             style={{ width: 200 }}
             allowClear
           >
             <Select.Option value="张三">张三</Select.Option>
             <Select.Option value="李四">李四</Select.Option>
             <Select.Option value="王五">王五</Select.Option>
             <Select.Option value="赵六">赵六</Select.Option>
           </Select>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: '#333', fontSize: '14px' }}>状态</span>
          <Select
            placeholder="请选择状态"
            value={searchForm.status}
            onChange={(value) => setSearchForm(prev => ({ ...prev, status: value }))}
            style={{ width: 120 }}
            allowClear
          >
            <Select.Option value={TaskStatus.PROCESSING}>处理中</Select.Option>
            <Select.Option value={TaskStatus.COMPLETED}>已完成</Select.Option>
            <Select.Option value={TaskStatus.FAILED}>失败</Select.Option>
          </Select>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: '#333', fontSize: '14px' }}>时间范围</span>
          <RangePicker
            placeholder={['开始时间', '结束时间']}
            value={searchForm.dateRange}
            onChange={(value) => setSearchForm(prev => ({ ...prev, dateRange: value }))}
            style={{ width: 300 }}
          />
        </div>
        
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
  );

  // 渲染操作按钮区域
  const renderActionArea = () => (
    <div style={{ marginBottom: 16 }}>
      <Title heading={6} style={{ margin: 0 }}>
        {activeTab === 'import' ? '导入任务列表' : '导出任务列表'}
      </Title>
    </div>
  );

  const currentData = activeTab === 'import' ? importTasks : exportTasks;

  return (
    <div style={{ padding: '0' }}>
      <Card>
        <Tabs 
          activeTab={activeTab} 
          onChange={setActiveTab}
          size="large"
        >
          <TabPane key="import" title="导入任务">
            {renderSearchArea()}
            {renderActionArea()}
            <Table
              columns={columns}
              data={currentData}
              loading={loading}
              pagination={{
                total: currentData.length,
                pageSize: 10,
                showTotal: true,
                showJumper: true
              }}
              rowKey="id"
              scroll={{ x: 1400 }}
            />
          </TabPane>
          <TabPane key="export" title="导出任务">
            {renderSearchArea()}
            {renderActionArea()}
            <Table
              columns={columns}
              data={currentData}
              loading={loading}
              pagination={{
                total: currentData.length,
                pageSize: 10,
                showTotal: true,
                showJumper: true
              }}
              rowKey="id"
              scroll={{ x: 1400 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 删除确认对话框 */}
      <Modal
        title="确认删除"
        visible={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ status: 'danger' }}
      >
        <p>删除后不可恢复，确认删除？</p>
      </Modal>
    </div>
  );
};

export default TaskManagement;