import React, { useState } from 'react';
import {
  Card,
  Button,
  Tag,
  Typography,
  Table,
  Empty,
  Input,
  Message
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconHistory,
  IconArchive
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

// 集装箱动态记录接口
interface ContainerDynamic {
  id: string;
  dynamicCode: string;
  dynamicName: string;
  dynamicTime: string;
  bookingNo: string;
  billOfLading: string;
  vesselVoyage: string;
  relatedUnit: string;
  createTime: string;
  operator: string;
}

// 集装箱信息接口
interface ContainerInfo {
  containerNo: string;
  containerType: string;
  status: string;
  location: string;
  dynamics: ContainerDynamic[];
}

const SingleContainerMaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchContainerNo, setSearchContainerNo] = useState('');
  const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // 动态列表表格列配置
  const dynamicColumns = [
    {
      title: '动态代码',
      dataIndex: 'dynamicCode',
      width: 120,
      render: (code: string) => (
        <Tag color={getDynamicCodeColor(code)}>{code}</Tag>
      )
    },
    {
      title: '动态名称',
      dataIndex: 'dynamicName',
      width: 100
    },
    {
      title: '动态时间',
      dataIndex: 'dynamicTime',
      width: 160,
      render: (time: string) => (
        <span style={{ fontFamily: 'monospace' }}>{time}</span>
      )
    },
    {
      title: '订舱号',
      dataIndex: 'bookingNo',
      width: 150,
      render: (bookingNo: string) => (
        bookingNo ? (
          <span style={{ fontFamily: 'monospace' }}>{bookingNo}</span>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )
      )
    },
    {
      title: '提单号',
      dataIndex: 'billOfLading',
      width: 150,
      render: (billOfLading: string) => (
        billOfLading ? (
          <span style={{ fontFamily: 'monospace' }}>{billOfLading}</span>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )
      )
    },
    {
      title: '船名航次',
      dataIndex: 'vesselVoyage',
      width: 180,
      render: (vesselVoyage: string) => (
        vesselVoyage ? (
          <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{vesselVoyage}</span>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )
      )
    },
    {
      title: '关联单位',
      dataIndex: 'relatedUnit',
      width: 180
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
      render: (time: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{time}</span>
      )
    }
  ];

  // 搜索集装箱
  const handleSearchContainer = async () => {
    if (!searchContainerNo.trim()) {
      Message.warning('请输入箱号');
      return;
    }

    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      // 模拟数据
      const mockContainerInfo: ContainerInfo = {
        containerNo: searchContainerNo.toUpperCase(),
        containerType: '20GP',
        status: '可用',
        location: '上海港洋山码头',
        dynamics: [
          {
            id: '1',
            dynamicCode: 'GATE_IN',
            dynamicName: '进场',
            dynamicTime: '2023-12-01 08:30:00',
            bookingNo: 'SHA202312010001',
            billOfLading: 'COSCO123456789',
            vesselVoyage: 'COSCO SHANGHAI/2312E',
            relatedUnit: '上海物流有限公司',
            createTime: '2023-12-01 08:35:00',
            operator: '张三'
          },
          {
            id: '2',
            dynamicCode: 'LOAD',
            dynamicName: '装船',
            dynamicTime: '2023-12-02 14:20:00',
            bookingNo: 'SHA202312010001',
            billOfLading: 'COSCO123456789',
            vesselVoyage: 'COSCO SHANGHAI/2312E',
            relatedUnit: 'COSCO SHIPPING',
            createTime: '2023-12-02 14:25:00',
            operator: '李四'
          },
          {
            id: '3',
            dynamicCode: 'DISCHARGE',
            dynamicName: '卸船',
            dynamicTime: '2023-12-10 09:15:00',
            bookingNo: 'LAX202312100001',
            billOfLading: 'COSCO123456789',
            vesselVoyage: 'COSCO SHANGHAI/2312E',
            relatedUnit: 'LA Port Terminal',
            createTime: '2023-12-10 09:20:00',
            operator: 'John Smith'
          },
          {
            id: '4',
            dynamicCode: 'EMPTY_RETURN',
            dynamicName: '还空箱',
            dynamicTime: '2023-12-15 16:45:00',
            bookingNo: '',
            billOfLading: '',
            vesselVoyage: '',
            relatedUnit: '洛杉矶空箱堆场',
            createTime: '2023-12-15 16:50:00',
            operator: 'Mike Johnson'
          }
        ]
      };

      setContainerInfo(mockContainerInfo);
      setLoading(false);
      Message.success('查询成功');
    }, 1000);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchContainerNo('');
    setContainerInfo(null);
  };

  // 新增动态 - 跳转到新增动态页面
  const handleAddDynamic = () => {
    if (!containerInfo) {
      Message.warning('请先搜索集装箱');
      return;
    }
    
    // 跳转到新增动态页面，传递集装箱号参数
    navigate(`/smartainer/add-dynamic?containerNo=${containerInfo.containerNo}`);
  };

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

  // 获取动态代码标签颜色
  const getDynamicCodeColor = (code: string) => {
    const colorMap: Record<string, string> = {
      'GATE_IN': 'blue',
      'GATE_OUT': 'purple',
      'LOAD': 'green',
      'DISCHARGE': 'orange',
      'PICKUP': 'cyan',
      'RETURN': 'magenta',
      'EMPTY_RETURN': 'red',
      'REPAIR_IN': 'yellow',
      'REPAIR_OUT': 'lime',
      'CLEANING': 'geekblue',
      'INSPECTION': 'volcano',
      'STORAGE': 'gold'
    };
    return colorMap[code] || 'gray';
  };

  return (
    <div>
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <Title heading={4} style={{ margin: 0 }}>单箱维护</Title>
        </div>

        {/* 搜索区域 */}
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ width: '300px' }}>
              <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>集装箱号</div>
              <Input
                placeholder="请输入集装箱号，如：CSLU3456789"
                value={searchContainerNo}
                onChange={setSearchContainerNo}
                onPressEnter={handleSearchContainer}
                style={{ fontFamily: 'monospace' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                type="primary" 
                icon={<IconSearch />} 
                onClick={handleSearchContainer}
                loading={loading}
              >
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handleReset}>
                重置
              </Button>
            </div>
          </div>
        </Card>

        {/* 集装箱信息展示 */}
        {containerInfo && (
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title heading={5} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                <IconArchive style={{ marginRight: '8px', color: '#165DFF' }} />
                集装箱信息
              </Title>
              <Button type="primary" icon={<IconPlus />} onClick={handleAddDynamic}>
                新增动态
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ marginBottom: '4px', color: '#666', fontSize: '14px' }}>箱号</div>
                <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>
                  {containerInfo.containerNo}
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '4px', color: '#666', fontSize: '14px' }}>箱型</div>
                <div>{containerInfo.containerType}</div>
              </div>
              <div>
                <div style={{ marginBottom: '4px', color: '#666', fontSize: '14px' }}>状态</div>
                <div>
                  <Tag color={getStatusColor(containerInfo.status)}>{containerInfo.status}</Tag>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '4px', color: '#666', fontSize: '14px' }}>当前位置</div>
                <div>{containerInfo.location}</div>
              </div>
            </div>
          </Card>
        )}

        {/* 历史动态展示 */}
        {containerInfo && (
          <Card>
            <div style={{ marginBottom: '16px' }}>
              <Title heading={5} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                <IconHistory style={{ marginRight: '8px', color: '#165DFF' }} />
                历史动态 ({containerInfo.dynamics.length}条)
              </Title>
            </div>

            {containerInfo.dynamics.length > 0 ? (
              <>
                <Table
                  columns={dynamicColumns}
                  data={containerInfo.dynamics}
                  pagination={{
                    pageSize: 10,
                    showTotal: true,
                    showJumper: true,
                    sizeCanChange: true,
                    sizeOptions: [5, 10, 20, 50]
                  }}
                  scroll={{ y: 400 }}
                  rowKey="id"
                  stripe
                  size="middle"
                  rowClassName={(_, index) => {
                    // 最新的动态记录高亮显示
                    return index === 0 ? 'latest-dynamic-row' : '';
                  }}
                />
                
                <style>{`
                  .latest-dynamic-row {
                    background: linear-gradient(90deg, rgba(22, 93, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%) !important;
                  }
                  .latest-dynamic-row:hover {
                    background: linear-gradient(90deg, rgba(22, 93, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%) !important;
                  }
                `}</style>
              </>
            ) : (
              <Empty description="暂无动态记录" />
            )}
          </Card>
        )}

        {/* 空状态 */}
        {!containerInfo && !loading && (
          <Card>
            <Empty 
              description="请输入集装箱号进行搜索"
              style={{ padding: '60px 0' }}
            />
          </Card>
        )}
      </Card>
    </div>
  );
};

export default SingleContainerMaintenancePage; 