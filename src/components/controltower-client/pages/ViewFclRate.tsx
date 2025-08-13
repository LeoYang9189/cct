import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Table,
  Descriptions
} from '@arco-design/web-react';
import { IconArrowLeft, IconDownload } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;

// 按箱型计费项目接口
interface ContainerRateItem {
  key: number;
  feeName: string;
  currency: string;
  '20gp': string;
  '40gp': string;
  '40hc': string;
  '45hc': string;
  '40nor': string;
  '20nor': string;
  '20hc': string;
  '20tk': string;
  '40tk': string;
  '20ot': string;
  '40ot': string;
  '20fr': string;
  '40fr': string;
  specialNote: string;
}

// 非按箱型计费项目接口
interface NonContainerRateItem {
  key: number;
  feeName: string;
  currency: string;
  unit: string;
  price: string;
  specialNote: string;
}

/**
 * 整箱运价查看页面
 */
const ViewFclRate: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const rateId = params.id;
  
  // 基本信息状态
  const [rateData, setRateData] = useState<any>({
    routeLine: '', // 确保有默认值
  });
  
  // 按箱型计费列表状态 - 海运费
  const [containerRateList, setContainerRateList] = useState<ContainerRateItem[]>([]);
  
  // 按箱型计费列表状态 - 附加费
  const [containerSurchargeList, setContainerSurchargeList] = useState<ContainerRateItem[]>([]);
  
  // 非按箱型计费列表状态
  const [nonContainerRateList, setNonContainerRateList] = useState<NonContainerRateItem[]>([]);
  
  // 非按箱型计费列表状态 - 附加费
  const [nonContainerSurchargeList, setNonContainerSurchargeList] = useState<NonContainerRateItem[]>([]);
  
  // 箱型显示设置
  const [boxTypeVisibility] = useState({
    '20gp': true,
    '40gp': true,
    '40hc': true,
    '20nor': true,
    '40nor': true,
    '45hc': true,
    '20hc': false,
    '20tk': false,
    '40tk': false,
    '20ot': false,
    '40ot': false,
    '20fr': false,
    '40fr': false
  });

  // 加载运价数据
  useEffect(() => {
    if (rateId) {
      loadRateData(rateId);
    }
  }, [rateId]);

  const loadRateData = async (id: string) => {
    try {
  
      // 模拟API调用获取运价数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟返回的数据
      const mockData = {
        routeCode: `FCL${id}`,
        rateType: '合约价',
        cargoType: '普货',
        departurePort: 'CNSHA',
        dischargePort: 'USLAX',
        transitType: '直达',
        shipCompany: 'COSCO',
        spaceStatus: '正常',
        contractNo: 'CONTRACT001',
        priceStatus: '价格稳定',
        nac: 'NAC01',
        routeLine: '美加线',
        vesselSchedule: ['周一', '周三'],
        voyage: 15,
        chargeSpecialNote: '注意包装',
        shipName: 'COSCO SHIPPING',
        voyageNumber: 'V001',
        freeContainerDays: 7,
        freeStorageDays: 5,
        validFrom: '2024-04-01',
        validTo: '2024-04-30',
        overweightNote: '超重加收费用',
        notes: '该运价已包含基本港杂费'
      };
      
      setRateData(mockData);
      
      // 模拟按箱型计费数据 - 海运费
      setContainerRateList([
        {
          key: 1,
          feeName: '海运费',
          currency: 'USD',
          '20gp': '1500',
          '40gp': '2500',
          '40hc': '2700',
          '45hc': '2900',
          '40nor': '2500',
          '20nor': '1500',
          '20hc': '',
          '20tk': '',
          '40tk': '',
          '20ot': '',
          '40ot': '',
          '20fr': '',
          '40fr': '',
          specialNote: '包含基本港杂费'
        }
      ]);
      
      // 模拟按箱型计费数据 - 附加费
      setContainerSurchargeList([
        {
          key: 1,
          feeName: 'THC',
          currency: 'USD',
          '20gp': '120',
          '40gp': '180',
          '40hc': '180',
          '45hc': '200',
          '40nor': '180',
          '20nor': '120',
          '20hc': '',
          '20tk': '',
          '40tk': '',
          '20ot': '',
          '40ot': '',
          '20fr': '',
          '40fr': '',
          specialNote: '码头操作费'
        },
        {
          key: 2,
          feeName: '操作费',
          currency: 'USD',
          '20gp': '50',
          '40gp': '80',
          '40hc': '80',
          '45hc': '90',
          '40nor': '80',
          '20nor': '50',
          '20hc': '',
          '20tk': '',
          '40tk': '',
          '20ot': '',
          '40ot': '',
          '20fr': '',
          '40fr': '',
          specialNote: '订舱操作费'
        }
      ]);
      
      // 模拟非按箱型计费数据 - 海运费
      setNonContainerRateList([
        {
          key: 1,
          feeName: '订舱费',
          currency: 'USD',
          unit: '票',
          price: '50',
          specialNote: '每票收取'
        }
      ]);
      
      // 模拟非按箱型计费数据 - 附加费
      setNonContainerSurchargeList([
        {
          key: 1,
          feeName: '铅封费',
          currency: 'USD',
          unit: '个',
          price: '15',
          specialNote: '每个铅封收取'
        },
        {
          key: 2,
          feeName: '打单费',
          currency: 'USD',
          unit: '票',
          price: '25',
          specialNote: '单据打印费'
        },
        {
          key: 3,
          feeName: 'EDI费',
          currency: 'USD',
          unit: '票',
          price: '30',
          specialNote: '电子数据交换费'
        }
      ]);
      
          } catch (error) {
        console.error('加载运价数据失败:', error);
      }
  };

  // 返回列表页
  const handleGoBack = () => {
    navigate('/controltower-client/saas/rate-query');
  };

  // 导出运价
  const handleExportRate = () => {
    console.log('导出运价数据');
    // TODO: 实现导出功能
  };

  return (
    <div>
      {/* 页面头部 */}
      <Card style={{ marginBottom: '20px' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Title heading={4} style={{ margin: 0 }}>查看整箱运价</Title>
          </div>
          <Space>
            <Button onClick={handleGoBack} icon={<IconArrowLeft />}>返回</Button>
            <Button 
              type="primary" 
              onClick={handleExportRate} 
              icon={<IconDownload />}
            >
              导出运价
            </Button>
          </Space>
        </div>
      </Card>

        {/* 基本信息区域 */}
        <Card title="基本信息" className="mb-6">
          <Descriptions 
            column={3}
            layout="vertical"
            data={[
              { label: '运价号', value: rateData.routeCode },
              { label: '运价类型', value: rateData.rateType },
              { label: '货物类型', value: rateData.cargoType },
              { label: '舱位状态', value: rateData.spaceStatus },
              { label: '价格趋势', value: rateData.priceStatus },
            ]}
          />
        </Card>

        {/* 航线信息区域 */}
        <Card title="航线信息" className="mb-6">
          <Descriptions 
            column={3}
            layout="vertical"
            data={[
              { label: '航线', value: rateData.routeLine || '美加线' },
              { label: '起运港', value: rateData.departurePort },
              { label: '目的港', value: rateData.dischargePort },
              { label: '直达/中转', value: rateData.transitType },
              { label: '船名', value: rateData.shipName },
              { label: '航次', value: rateData.voyageNumber },
              { label: '船期', value: rateData.vesselSchedule?.join(', ') },
              { label: '航程', value: `${rateData.voyage} 天` },
            ]}
          />
        </Card>

        {/* 船公司信息区域 */}
        <Card title="船公司信息" className="mb-6">
          <Descriptions 
            column={3}
            layout="vertical"
            data={[
              { label: '船公司', value: rateData.shipCompany },
              { label: '约号', value: rateData.contractNo },
              { label: 'NAC', value: rateData.nac },
            ]}
          />
        </Card>

        {/* 免费期限设置 */}
        <Card title="D&D" className="mb-6">
          <Descriptions 
            column={2}
            layout="vertical"
            data={[
              { label: '免用箱', value: `${rateData.freeContainerDays} 天` },
              { label: '免堆存', value: `${rateData.freeStorageDays} 天` },
            ]}
          />
        </Card>

        {/* 有效期设置 */}
        <Card title="有效期设置" className="mb-6">
          <Descriptions 
            column={1}
            layout="vertical"
            data={[
              { label: '有效期', value: `${rateData.validFrom} ~ ${rateData.validTo}` },
            ]}
          />
        </Card>

        {/* 备注信息 */}
        <Card title="备注信息" className="mb-6">
          <Descriptions 
            column={2}
            layout="vertical"
            data={[
              { label: '超重说明', value: rateData.overweightNote },
              { label: '接货特殊说明', value: rateData.chargeSpecialNote },
              { label: '备注', value: rateData.notes, span: 2 },
            ]}
          />
        </Card>

        {/* 海运费区域 */}
        <Card title="海运费" className="mb-6">
          {/* 按箱型计费 - 海运费 */}
          <div className="mb-8">
            <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">按箱型计费</div>
            
            <Table
              borderCell={true}
              columns={[
                {
                  title: '费用名称',
                  dataIndex: 'feeName',
                  width: 180,
                },
                {
                  title: '币种',
                  dataIndex: 'currency',
                  width: 120,
                },
                ...(boxTypeVisibility['20gp'] ? [{
                  title: '20GP',
                  dataIndex: '20gp',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40gp'] ? [{
                  title: '40GP',
                  dataIndex: '40gp',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40hc'] ? [{
                  title: '40HC',
                  dataIndex: '40hc',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['20nor'] ? [{
                  title: '20NOR',
                  dataIndex: '20nor',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40nor'] ? [{
                  title: '40NOR',
                  dataIndex: '40nor',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['45hc'] ? [{
                  title: '45HC',
                  dataIndex: '45hc',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                {
                  title: '特殊备注',
                  dataIndex: 'specialNote',
                  width: 200,
                }
              ]}
              data={containerRateList}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </div>

          {/* 非按箱型计费 - 海运费 */}
          <div className="mb-4">
            <div className="text-green-600 font-bold border-l-4 border-green-600 pl-2 mb-4">非按箱型计费</div>
            
            <Table
              borderCell={true}
              columns={[
                {
                  title: '费用名称',
                  dataIndex: 'feeName',
                  width: 200,
                },
                {
                  title: '币种',
                  dataIndex: 'currency',
                  width: 120,
                },
                {
                  title: '计费单位',
                  dataIndex: 'unit',
                  width: 120,
                },
                {
                  title: '单价',
                  dataIndex: 'price',
                  width: 150,
                  render: (value: string, record: NonContainerRateItem) => value ? `${record.currency} ${value}` : '-'
                },
                {
                  title: '特殊备注',
                  dataIndex: 'specialNote',
                  width: 250,
                }
              ]}
              data={nonContainerRateList}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </Card>

        {/* 附加费区域 */}
        <Card title="附加费" className="mb-6">
          {/* 按箱型计费 - 附加费 */}
          <div className="mb-8">
            <div className="text-orange-600 font-bold border-l-4 border-orange-600 pl-2 mb-4">按箱型计费</div>
            
            <Table
              borderCell={true}
              columns={[
                {
                  title: '费用名称',
                  dataIndex: 'feeName',
                  width: 180,
                },
                {
                  title: '币种',
                  dataIndex: 'currency',
                  width: 120,
                },
                ...(boxTypeVisibility['20gp'] ? [{
                  title: '20GP',
                  dataIndex: '20gp',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40gp'] ? [{
                  title: '40GP',
                  dataIndex: '40gp',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40hc'] ? [{
                  title: '40HC',
                  dataIndex: '40hc',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['20nor'] ? [{
                  title: '20NOR',
                  dataIndex: '20nor',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40nor'] ? [{
                  title: '40NOR',
                  dataIndex: '40nor',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['45hc'] ? [{
                  title: '45HC',
                  dataIndex: '45hc',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                {
                  title: '特殊备注',
                  dataIndex: 'specialNote',
                  width: 200,
                }
              ]}
              data={containerSurchargeList}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </div>

          {/* 非按箱型计费 - 附加费 */}
          <div className="mb-4">
            <div className="text-purple-600 font-bold border-l-4 border-purple-600 pl-2 mb-4">非按箱型计费</div>
            
            <Table
              borderCell={true}
              columns={[
                {
                  title: '费用名称',
                  dataIndex: 'feeName',
                  width: 200,
                },
                {
                  title: '币种',
                  dataIndex: 'currency',
                  width: 120,
                },
                {
                  title: '计费单位',
                  dataIndex: 'unit',
                  width: 120,
                },
                {
                  title: '单价',
                  dataIndex: 'price',
                  width: 150,
                  render: (value: string, record: NonContainerRateItem) => value ? `${record.currency} ${value}` : '-'
                },
                {
                  title: '特殊备注',
                  dataIndex: 'specialNote',
                  width: 250,
                }
              ]}
              data={nonContainerSurchargeList}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </Card>
    </div>
  );
};

export default ViewFclRate; 