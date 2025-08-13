import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Tooltip,
  Typography,
  Descriptions
} from '@arco-design/web-react';
import {
  IconArrowLeft,
  IconSave,
  IconUpload
} from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

// 导入任务详情接口
interface ImportTaskDetail {
  id: string;
  fileName: string;
  source: string;
  creator: string;
  status: string;
  importTime: string;
  remark: string;
  successCount: number;
  failureCount: number;
}

// 运价数据接口（简化版本）
interface RateDataItem {
  key: string;
  routeCode: string;
  rateType: string;
  departurePort: string;
  dischargePort: string;
  transitPort: string;
  transitType: string;
  shipCompany: string;
  contractNo: string;
  cargoType: string;
  '20gp': number;
  '40gp': number;
  '40hc': number;
  nac: string;
  validPeriod: string;
  entryPerson: string;
  createDate: string;
}

/**
 * 导入任务详情页面组件
 */
const ImportTaskDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [taskDetail, setTaskDetail] = useState<ImportTaskDetail | null>(null);
  const [rateData, setRateData] = useState<RateDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * 初始化页面数据
   */
  useEffect(() => {
    loadTaskDetail();
    loadRateData();
  }, [id]);

  /**
   * 加载任务详情
   */
  const loadTaskDetail = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟任务详情数据
      const mockDetail: ImportTaskDetail = {
        id: id || '1',
        fileName: '客户信息导入-20241227.xlsx',
        source: '客商中心',
        creator: '张三',
        status: '已完成',
        importTime: '2024-12-27 13:58',
        remark: '文件大小: 24.56 KB, 导出耗时: 116ms, 上传耗时: 132ms',
        successCount: 156,
        failureCount: 12
      };
      
      setTaskDetail(mockDetail);
    } catch (error) {
      console.error('加载任务详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载运价数据（复制自运价查询页面）
   */
  const loadRateData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 生成模拟运价数据
      const mockData: RateDataItem[] = Array(20).fill(null).map((_, index) => {
        const random20gp = [-30, 510, 560, 865, 1130, 530].sort(() => Math.random() - 0.5)[0];
        const random40gp = random20gp === -30 ? -60 : random20gp === 510 ? 1020 : random20gp === 560 ? 1120 : random20gp === 865 ? 1730 : random20gp === 1130 ? 2260 : 1060;

        const departurePorts = [
          { code: 'CNSHA', fullName: 'SHANGHAI', name: '上海' },
          { code: 'CNNGB', fullName: 'NINGBO', name: '宁波' },
          { code: 'CNQIN', fullName: 'QINGDAO', name: '青岛' },
          { code: 'CNYTN', fullName: 'YANTAI', name: '烟台' }
        ];
        const dischargePorts = [
          { code: 'USLAX', fullName: 'LOS ANGELES', name: '洛杉矶' },
          { code: 'USNYC', fullName: 'NEW YORK', name: '纽约' },
          { code: 'USLGB', fullName: 'LONG BEACH', name: '长滩' },
          { code: 'USOAK', fullName: 'OAKLAND', name: '奥克兰' }
        ];
        const transitPorts = [
          { code: 'SINGAPORE', fullName: 'SINGAPORE', name: '新加坡' },
          { code: 'HONG KONG', fullName: 'HONG KONG', name: '香港' },
          { code: 'KRPUS', fullName: 'BUSAN', name: '釜山' }
        ];

        const departurePort = departurePorts[index % departurePorts.length];
        const dischargePort = dischargePorts[index % dischargePorts.length];
        const transitPort = transitPorts[index % transitPorts.length];

        return {
          key: `rate-${index + 1}`,
          routeCode: `FCL${String(index + 1).padStart(6, '0')}`,
          rateType: '合约价', // 统一设为合约价
          departurePort: `${departurePort.code}|${departurePort.fullName}|${departurePort.name}`,
          dischargePort: `${dischargePort.code}|${dischargePort.fullName}|${dischargePort.name}`,
          transitPort: `${transitPort.code}|${transitPort.fullName}|${transitPort.name}`,
          transitType: index % 3 === 0 ? '直达' : '中转',
          shipCompany: ['SITC', 'COSCO', 'MSK', 'ONE', 'MAERSK', 'EVERGREEN'][index % 6],
          contractNo: `CONTRACT00${index + 1}`, // 合约价都有合约号
          cargoType: '普货',
          '20gp': random20gp,
          '40gp': random40gp,
          '40hc': random40gp + 50,
          nac: index % 2 === 0 ? 'YES' : 'NO',
          validPeriod: `2024-01-01 至 2024-12-31`,
          entryPerson: ['张三', '李四', '王五', '赵六'][index % 4],
          createDate: `2024-12-${String(index % 28 + 1).padStart(2, '0')}`
        };
      });

      setRateData(mockData);
    } catch (error) {
      console.error('加载运价数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 返回任务管理页面
   */
  const handleBack = () => {
    navigate('/controltower/task-management');
  };

  /**
   * 存入草稿
   */
  const handleSaveDraft = () => {
    console.log('存入草稿');
    // TODO: 实现存入草稿逻辑
  };

  /**
   * 直接上架
   */
  const handleDirectPublish = () => {
    console.log('直接上架');
    // TODO: 实现直接上架逻辑
  };



  /**
   * 删除运价记录
   */
  const handleDelete = (record: RateDataItem) => {
    console.log('删除运价记录:', record);
    // TODO: 实现删除逻辑
  };

  // 表格列定义（简化版本）
  const columns = [
    {
      title: '运价号',
      dataIndex: 'routeCode',
      width: 180,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '运价类型',
      dataIndex: 'rateType',
      width: 140,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '起运港',
      dataIndex: 'departurePort',
      width: 180,
      render: (value: string) => {
        const [code, name] = value.split('|');
        return (
          <Tooltip content={value} mini>
            <div className="text-left">
              <div className="text-xs font-mono">{code}</div>
              <div className="text-xs text-gray-600">{name}</div>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '目的港',
      dataIndex: 'dischargePort',
      width: 200,
      render: (value: string) => {
        const [code, name] = value.split('|');
        return (
          <Tooltip content={value} mini>
            <div className="text-left">
              <div className="text-xs font-mono">{code}</div>
              <div className="text-xs text-gray-600">{name}</div>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '中转港',
      dataIndex: 'transitPort',
      width: 180,
      render: (value: string) => {
        const [code, name] = value.split('|');
        return (
          <Tooltip content={value} mini>
            <div className="text-left">
              <div className="text-xs font-mono">{code}</div>
              <div className="text-xs text-gray-600">{name}</div>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '中转类型',
      dataIndex: 'transitType',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '船公司',
      dataIndex: 'shipCompany',
      width: 220,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '约号',
      dataIndex: 'contractNo',
      width: 160,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '货物类型',
      dataIndex: 'cargoType',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20GP",
      dataIndex: '20gp',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40GP",
      dataIndex: '40gp',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40HC",
      dataIndex: '40hc',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: 'NAC',
      dataIndex: 'nac',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '有效期',
      dataIndex: 'validPeriod',
      width: 240,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '创建人',
      dataIndex: 'entryPerson',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: RateDataItem) => (
        <Button 
          type="text" 
          status="danger" 
          size="small"
          onClick={() => handleDelete(record)}
        >
          删除
        </Button>
      ),
    }
  ];

  if (!taskDetail) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: '0' }}>
      {/* 顶部操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button 
              type="text" 
              icon={<IconArrowLeft />} 
              onClick={handleBack}
            >
              返回
            </Button>
            <Title heading={5} style={{ margin: 0 }}>
              导入任务详情
            </Title>
          </div>
          <Space>
            <Button 
              icon={<IconSave />} 
              onClick={handleSaveDraft}
            >
              存入草稿
            </Button>
            <Button 
              type="primary" 
              icon={<IconUpload />} 
              onClick={handleDirectPublish}
            >
              直接上架
            </Button>
          </Space>
        </div>
      </Card>

      {/* 任务基本信息 */}
      <Card title="任务基本信息" style={{ marginBottom: 16 }}>
        <Descriptions
          column={3}
          data={[
            {
              label: '文件名称',
              value: taskDetail.fileName
            },
            {
              label: '来源',
              value: taskDetail.source
            },
            {
              label: '创建人',
              value: taskDetail.creator
            },
            {
              label: '状态',
              value: (
                <Tag color={taskDetail.status === '已完成' ? 'green' : 'blue'}>
                  {taskDetail.status}
                </Tag>
              )
            },
            {
              label: '导入时间',
              value: taskDetail.importTime
            },
            {
              label: '备注',
              value: taskDetail.remark
            }
          ]}
        />
      </Card>

      {/* 结果预览 */}
      <Card title="结果预览">
        {/* 导入结果统计 */}
        <div style={{ 
          padding: '16px 0', 
          borderBottom: '1px solid #f0f0f0', 
          marginBottom: 16,
          fontSize: '16px',
          fontWeight: 500
        }}>
          导入成功 <span style={{ color: '#00b42a', fontWeight: 'bold' }}>{taskDetail.successCount}</span> 条，
          导入失败 <span style={{ color: '#f53f3f', fontWeight: 'bold' }}>{taskDetail.failureCount}</span> 条
        </div>

        {/* 运价数据列表 */}
        <Table
          columns={columns}
          data={rateData}
          loading={loading}
          pagination={{
            total: rateData.length,
            pageSize: 10,
            showTotal: true,
            showJumper: true
          }}
          rowKey="key"
          scroll={{ x: 3000 }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default ImportTaskDetail;