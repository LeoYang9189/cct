import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Breadcrumb, 
  Typography, 
  Button, 
  Space, 
  Table, 
  Radio, 
  Modal,
  InputNumber,
  Select,
  Input, 
  Message,
  Grid,
  Checkbox
} from '@arco-design/web-react';
import { IconArrowLeft, IconDownload, IconCopy, IconPrinter } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './CreateFclInquiry.css';

const { Title } = Typography;
const { Row, Col } = Grid;

// 定义类型接口
interface ContainerInfo {
  type: string;
  count: number;
}

interface MainlineRate {
  id: string;
  certNo: string;
  departurePort: string;
  dischargePort: string;
  shipCompany: string;
  validPeriod: string;
  transitType: string;
  '20GP': string;
  '40GP': string;
  '40HC': string;
  transitTime: string;
  etd: string;
  eta: string;
  price: string;
  currency: string;
}

interface PrecarriageRate {
  id: string;
  certNo: string;
  type: string;
  origin: string;
  destination: string;
  vendor: string;
  '20GP': string;
  '40GP': string;
  '40HC': string;
  price: string;
  currency: string;
}

interface OncarriageRate {
  id: string;
  certNo: string;
  destination: string;
  addressType: string;
  zipCode: string;
  address: string;
  agentName: string;
  price: string;
  currency: string;
}

interface InquiryDetail {
  inquiryNo: string;
  inquiryType: 'fcl' | 'lcl' | 'air';
  source: string;
  inquirer: string;
  inquiryStatus: string;
  cargoReadyTime: string;
  cargoNature: string;
  shipCompany: string;
  transitType: string;
  route: string;
  departurePort: string;
  dischargePort: string;
  remark: string;
  clientType: string;
  clientName: string;
  // 价格勾选状态
  precarriageChecked?: boolean;
  mainlineChecked?: boolean;
  lastmileChecked?: boolean;
  // 整箱特有字段
  containerInfo?: ContainerInfo[];
  // 拼箱/空运特有字段
  weight?: string;
  volume?: string;
  // 报价方案数据
  mainlineRates: MainlineRate[];
  precarriageRates: PrecarriageRate[];
  oncarriageRates: OncarriageRate[];
}

const InquiryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { type, id } = useParams<{ type: string; id: string }>();
  
  // 状态
  const [inquiryDetail, setInquiryDetail] = useState<InquiryDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMainlineRate, setSelectedMainlineRate] = useState<string>('');
  const [selectedPrecarriageRate, setSelectedPrecarriageRate] = useState<string>('');
  const [selectedOncarriageRate, setSelectedOncarriageRate] = useState<string>('');

  // 导出运价相关状态
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [containerSelections, setContainerSelections] = useState<Array<{
    id: number;
    type: string;
    count: number;
  }>>([{ id: 1, type: '20gp', count: 1 }]);
  const [copyTextModalVisible, setCopyTextModalVisible] = useState(false);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [quotationText, setQuotationText] = useState('');

  // 模拟加载详情数据
  useEffect(() => {
    const fetchInquiryDetail = async () => {
      setIsLoading(true);
      
      // 这里应该调用API获取数据
      // 暂时使用模拟数据
      setTimeout(() => {
        const mockDetail: InquiryDetail = {
          inquiryNo: id || '',
          inquiryType: (type as 'fcl' | 'lcl' | 'air') || 'fcl',
          source: '内部',
          inquirer: '张三',
          inquiryStatus: '已提交',
          cargoReadyTime: '1周内',
          cargoNature: '询价',
          shipCompany: '不指定',
          transitType: '直达',
          route: '跨太平洋东行',
          departurePort: 'CNSHA | Shanghai',
          dischargePort: 'USLAX | Los Angeles',
          remark: '电子产品 优先考虑直达航线',
          clientType: '正式客户',
          clientName: '上海测试',
          
          // 根据类型设置不同字段
          ...(type === 'fcl' ? {
            containerInfo: [
              { type: '20GP', count: 1 },
              { type: '40HC', count: 2 }
            ]
          } : {
            weight: '1200',
            volume: '3.5'
          }),
          
          // 报价方案数据
          mainlineRates: [
            {
              id: '1',
              certNo: 'M001',
              departurePort: 'CNSHA | Shanghai',
              dischargePort: 'USLAX | Los Angeles',
              shipCompany: '地中海',
              validPeriod: '2024-06-01 ~ 2024-07-01',
              transitType: '直达',
              '20GP': '1500 USD',
              '40GP': '2800 USD',
              '40HC': '2900 USD',
              transitTime: '14天',
              etd: '2024-07-10',
              eta: '2024-07-24',
              price: '2900',
              currency: 'USD'
            },
            {
              id: '2',
              certNo: 'M002',
              departurePort: 'CNSHA | Shanghai',
              dischargePort: 'USLAX | Los Angeles',
              shipCompany: '马士基',
              validPeriod: '2024-07-01 ~ 2024-08-01',
              transitType: '中转',
              '20GP': '1450 USD',
              '40GP': '2750 USD',
              '40HC': '2850 USD',
              transitTime: '16天',
              etd: '2024-08-08',
              eta: '2024-08-24',
              price: '2850',
              currency: 'USD'
            }
          ],
          precarriageRates: [
            {
              id: '1',
              certNo: 'P001',
              type: '直达',
              origin: '苏州工业园区',
              destination: '洋山港',
              vendor: '德邦专线',
              '20GP': '800 CNY',
              '40GP': '1200 CNY',
              '40HC': '1300 CNY',
              price: '1300',
              currency: 'CNY'
            },
            {
              id: '2',
              certNo: 'P002',
              type: '支线',
              origin: '太仓港',
              destination: '洋山港',
              vendor: '速航65号',
              '20GP': '400 CNY',
              '40GP': '700 CNY',
              '40HC': '750 CNY',
              price: '750',
              currency: 'CNY'
            }
          ],
          oncarriageRates: [
            {
              id: '1',
              certNo: 'O001',
              destination: 'San Diego, CA',
              addressType: '第三方地址',
              zipCode: '92101',
              address: 'San Diego, CA',
              agentName: 'XPO TRUCK LLC',
              price: '800',
              currency: 'USD'
            },
            {
              id: '2',
              certNo: 'O002',
              destination: 'Amazon ONT8',
              addressType: '亚马逊仓库',
              zipCode: '',
              address: '',
              agentName: 'DRAYEASY INC',
              price: '750',
              currency: 'USD'
            }
          ]
        };
        
        setInquiryDetail(mockDetail);
        // 默认选中第一个报价
        if (mockDetail.mainlineRates.length > 0) {
          setSelectedMainlineRate(mockDetail.mainlineRates[0].id);
        }
        if (mockDetail.precarriageRates.length > 0) {
          setSelectedPrecarriageRate(mockDetail.precarriageRates[0].id);
        }
        if (mockDetail.oncarriageRates.length > 0) {
          setSelectedOncarriageRate(mockDetail.oncarriageRates[0].id);
        }
        
        setIsLoading(false);
      }, 500);
    };
    
    fetchInquiryDetail();
  }, [id, type]);

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  // 导出报价
  const handleExportQuotation = () => {
    setExportModalVisible(true);
  };

  // 生成快捷报价文本
  const generateQuotationText = () => {
    if (!inquiryDetail || !selectedMainlineRate) {
      Message.warning('请先选择运价方案');
      return;
    }

    const selectedContainers = containerSelections
      .filter(item => item.count > 0)
      .map(item => `${item.count}*${item.type.toUpperCase()}`)
      .join(' + ');

    if (!selectedContainers || containerSelections.length === 0) {
      Message.warning('请先选择箱型箱量');
      return;
    }

    // 获取选中的运价信息
    const mainlineRate = inquiryDetail.mainlineRates.find(r => r.id === selectedMainlineRate);
    const precarriageRate = inquiryDetail.precarriageRates.find(r => r.id === selectedPrecarriageRate);
    const oncarriageRate = inquiryDetail.oncarriageRates.find(r => r.id === selectedOncarriageRate);

    // 计算总价格
    let totalMainlineFees = 0;
    let totalPrecarriageFees = 0;
    let totalOncarriageFees = 0;

    containerSelections.forEach(selection => {
      if (selection.count > 0) {
        // 干线费用
        if (mainlineRate) {
          const rate = type === 'fcl' ? parseInt(mainlineRate[selection.type as keyof MainlineRate] as string || '0') : parseInt(mainlineRate.price || '0');
          totalMainlineFees += rate * selection.count;
        }
        
        // 港前费用
        if (precarriageRate) {
          const rate = type === 'fcl' ? parseInt(precarriageRate[selection.type as keyof PrecarriageRate] as string || '0') : parseInt(precarriageRate.price || '0');
          totalPrecarriageFees += rate * selection.count;
        }
        
        // 尾程费用
        if (oncarriageRate) {
          const rate = parseInt(oncarriageRate.price || '0');
          totalOncarriageFees += rate * selection.count;
        }
      }
    });

    const totalCost = totalMainlineFees + totalPrecarriageFees + totalOncarriageFees;

    const text = `
【询价报价单】

询价编号：${inquiryDetail.inquiryNo}
询价类型：${inquiryDetail.inquiryType.toUpperCase()}
询价人：${inquiryDetail.inquirer}
${type === 'fcl' ? `箱型箱量：${selectedContainers}` : `重量：${inquiryDetail.weight} KGS\n体积：${inquiryDetail.volume} CBM`}

航线信息：
起运港：${inquiryDetail.departurePort}
目的港：${inquiryDetail.dischargePort}
${type === 'air' ? '航空公司' : '船公司'}：${inquiryDetail.shipCompany}
直达/中转：${inquiryDetail.transitType}

价格明细：
- 干线费用：${totalMainlineFees} ${mainlineRate?.currency || 'USD'}
- 港前费用：${totalPrecarriageFees} ${precarriageRate?.currency || 'CNY'}
- 尾程费用：${totalOncarriageFees} ${oncarriageRate?.currency || 'USD'}
总计：${totalCost} ${mainlineRate?.currency || 'USD'}

货好时间：${inquiryDetail.cargoReadyTime}
委托单位：${inquiryDetail.clientName}
备注：${inquiryDetail.remark}

※ 以上价格仅供参考，实际价格以正式合同为准
※ 如有任何疑问，请联系我们的客服团队
    `.trim();

    setQuotationText(text);
    setExportModalVisible(false);
    setCopyTextModalVisible(true);
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quotationText);
      Message.success('报价文本已复制到剪贴板');
      setCopyTextModalVisible(false);
    } catch (err) {
      Message.error('复制失败，请手动复制');
    }
  };

  // 生成并预览PDF
  const generatePDF = () => {
    if (!inquiryDetail || !selectedMainlineRate) {
      Message.warning('请先选择运价方案');
      return;
    }

    const selectedContainers = containerSelections.filter(item => item.count > 0);

    if (selectedContainers.length === 0) {
      Message.warning('请先选择箱型箱量');
      return;
    }

    setExportModalVisible(false);
    setPdfPreviewVisible(true);
  };



  // 删除箱型选择
  const removeContainerSelection = (id: number) => {
    if (containerSelections.length > 1) {
      setContainerSelections(containerSelections.filter(item => item.id !== id));
    }
  };

  // 更新箱型选择
  const updateContainerSelection = (id: number, field: 'type' | 'count', value: string | number) => {
    setContainerSelections(containerSelections.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 获取可选择的箱型列表
  const getAvailableContainerTypes = () => {
    const containerTypes = ['20gp', '40gp', '40hc', '45hc', '40nor'];
    return containerTypes.map(type => ({ label: type.toUpperCase(), value: type }));
  };

  // 渲染运价表格 - 复制自 ViewQuote.tsx
  const renderRateTable = (rateItems: any[], containerTypes: string[]) => {
    // 按计费方式分组
    const containerRateItems = rateItems.filter(item => item.containerRates);
    const unitRateItems = rateItems.filter(item => item.unitPrice && !item.containerRates);

    // 按箱计费表格列
    const containerColumns = [
      {
        title: '费用名称',
        dataIndex: 'feeName',
        width: 120,
      },
      {
        title: '币种',
        dataIndex: 'currency',
        width: 80,
      },
      ...containerTypes.map(type => ({
        title: type,
        dataIndex: 'containerRates',
        width: 100,
        render: (_: any, record: any) => record.containerRates?.[type] || '-'
      })),
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
        render: (value: string) => value || '-'
      }
    ];

    // 非按箱计费表格列
    const unitColumns = [
      {
        title: '费用名称',
        dataIndex: 'feeName',
        width: 120,
      },
      {
        title: '币种',
        dataIndex: 'currency',
        width: 80,
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 80,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
        render: (value: string) => value || '-'
      }
    ];

    return (
      <div className="space-y-4">
        {/* 按箱计费表格 */}
        {containerRateItems.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">按箱计费</div>
            <Table
              columns={containerColumns}
              data={containerRateItems}
              rowKey="id"
              pagination={false}
              size="small"
              border={{
                wrapper: true,
                cell: true
              }}
            />
          </div>
        )}

        {/* 非按箱计费表格 */}
        {unitRateItems.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">非按箱计费</div>
            <Table
              columns={unitColumns}
              data={unitRateItems}
              rowKey="id"
              pagination={false}
              size="small"
              border={{
                wrapper: true,
                cell: true
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // 生成委托
  const handleGenerateDelegate = () => {
    // 检查是否选择了必要的运价
    if (!selectedMainlineRate) {
      Message.warning('请选择干线运价');
      return;
    }

    Message.success('生成委托成功，即将跳转...');
    // 导航到委托页面，带上所选报价ID
    navigate(`/controltower/saas/create-delegate/${type}/${id}`, {
      state: {
        mainlineRateId: selectedMainlineRate,
        precarriageRateId: selectedPrecarriageRate,
        oncarriageRateId: selectedOncarriageRate
      }
    });
  };




  

  
  // 表格列 - 港前运价
  const precarriageColumns = [
    {
      title: '选择',
      width: 80,
      render: (_: unknown, record: PrecarriageRate) => (
        <Radio
          checked={selectedPrecarriageRate === record.id}
          onChange={() => setSelectedPrecarriageRate(record.id)}
        />
      ),
    },
    { title: '运价编号', dataIndex: 'certNo', width: 120 },
    { title: '类型', dataIndex: 'type', width: 100 },
    { title: '起运地', dataIndex: 'origin', width: 150 },
    { title: '目的地', dataIndex: 'destination', width: 150 },
    { title: '承运人', dataIndex: 'vendor', width: 120 }
  ];
  
  // 添加箱型相关列 (仅整箱)
  if (type === 'fcl') {
    precarriageColumns.push(
      { title: '20GP', dataIndex: '20GP', width: 100 },
      { title: '40GP', dataIndex: '40GP', width: 100 },
      { title: '40HC', dataIndex: '40HC', width: 100 }
    );
  } else {
    precarriageColumns.push(
      { title: '运价', dataIndex: 'price', width: 100 },
      { title: '币种', dataIndex: 'currency', width: 80 }
    );
  }
  


  if (!inquiryDetail) {
    return (
      <ControlTowerSaasLayout menuSelectedKey="9" breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>询价报价</Breadcrumb.Item>
          <Breadcrumb.Item>询价管理</Breadcrumb.Item>
          <Breadcrumb.Item>询价详情</Breadcrumb.Item>
        </Breadcrumb>
      }>
        <Card>
          <div className="p-4 text-center">{isLoading ? '加载中...' : '未找到详情信息'}</div>
        </Card>
      </ControlTowerSaasLayout>
    );
  }

  return (
    <ControlTowerSaasLayout menuSelectedKey="9" breadcrumb={
      <Breadcrumb>
        <Breadcrumb.Item>询价报价</Breadcrumb.Item>
        <Breadcrumb.Item>询价管理</Breadcrumb.Item>
        <Breadcrumb.Item>询价详情</Breadcrumb.Item>
      </Breadcrumb>
    }>
      <Card>
        <div className="flex items-center mb-4">
          <Button icon={<IconArrowLeft />} onClick={handleGoBack}>返回</Button>
          <Title heading={6} className="ml-4 mb-0">询价详情：{inquiryDetail.inquiryNo}</Title>
        </div>
        
          {/* 顶部checkbox区域和操作按钮 */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <Checkbox 
                checked={inquiryDetail.precarriageChecked || true} 
                disabled
                style={{ marginRight: 16 }}
              >
                港前价格
              </Checkbox>
              <Checkbox 
                checked={inquiryDetail.mainlineChecked || true}
                disabled
                style={{ marginRight: 16 }}
              >
                干线价格
              </Checkbox>
              <Checkbox 
                checked={inquiryDetail.lastmileChecked || true}
                disabled
              >
                尾程价格
              </Checkbox>
            </div>
            <Space>
              <Button icon={<IconDownload />} onClick={handleExportQuotation}>导出报价</Button>
              <Button type="primary" onClick={handleGenerateDelegate}>生成委托</Button>
            </Space>
          </div>
          
          <Row gutter={[16, 16]}>
            {/* 左侧区域：基本信息 */}
            <Col span={12}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">基本信息</div>
                
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">询价编号</label>
                      <Input value={inquiryDetail.inquiryNo} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">询价来源</label>
                      <Input value={inquiryDetail.source} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">询价人</label>
                      <Input value={inquiryDetail.inquirer} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">货盘性质</label>
                      <Input value={inquiryDetail.cargoNature} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">货好时间</label>
                      <Input value={inquiryDetail.cargoReadyTime} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">委托单位</label>
                      <Input value={`${inquiryDetail.clientType} - ${inquiryDetail.clientName}`} disabled />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            
            {/* 右侧区域：货物信息 */}
            <Col span={12}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">货物信息</div>
                
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">直达/中转</label>
                      <Input value={inquiryDetail.transitType} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">航线</label>
                      <Input value={inquiryDetail.route} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{type === 'air' ? '起始地' : '起运港'}</label>
                      <Input value={inquiryDetail.departurePort} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{type === 'air' ? '目的地' : '卸货港'}</label>
                      <Input value={inquiryDetail.dischargePort} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{type === 'air' ? '航空公司' : '船公司'}</label>
                      <Input value={inquiryDetail.shipCompany} disabled />
                    </div>
                  </Col>
                  
                  <Col span={24}>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                      <Input.TextArea value={inquiryDetail.remark} disabled style={{ minHeight: '60px' }} />
                    </div>
                  </Col>
                </Row>
              </div>
              
              {/* 箱型箱量信息 */}
              <div className="border rounded p-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">
                  {type === 'fcl' ? '箱型箱量' : '货物信息'}
                </div>
                
                {type === 'fcl' ? (
                  <div className="space-y-3">
                    {inquiryDetail.containerInfo?.map((container, index) => (
                      <Row gutter={[16, 16]} key={index}>
                        <Col span={12}>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">箱型</label>
                            <Input value={container.type} disabled />
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
                            <Input value={String(container.count)} disabled />
                          </div>
                        </Col>
                      </Row>
                    )) || (
                      <div className="text-gray-500">暂无箱型信息</div>
                    )}
                  </div>
                ) : (
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">重量(KGS)</label>
                        <Input value={inquiryDetail.weight || '-'} disabled />
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">体积(CBM)</label>
                        <Input value={inquiryDetail.volume || '-'} disabled />
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </Col>
          </Row>
          
          {/* 下半部分：运价明细模块 */}
          <div className="mt-6">
            <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-6 text-lg">运价明细</div>
            
            {/* 干线运价 */}
            {inquiryDetail.mainlineRates.length > 0 && (
              <div className="mb-6">
                <Title heading={6} className="mb-4 text-blue-600">干线运价</Title>
                <div className="space-y-4">
                  {inquiryDetail.mainlineRates.map((rate) => (
                    <Card key={rate.id} className="border border-gray-200">
                      <div className="flex items-start gap-4">
                        {/* 选择框 */}
                        <div className="mt-2">
                          <Radio
                            checked={selectedMainlineRate === rate.id}
                            onChange={() => setSelectedMainlineRate(rate.id)}
                          />
                        </div>
                        
                        {/* 运价内容 */}
                        <div className="flex-1">
                          {/* 基本信息 */}
                          <div className="flex items-center gap-4 mb-4">
                            <span className="font-medium text-blue-600">运价编号：{rate.certNo}</span>
                            <span className="font-medium">船公司：{rate.shipCompany}</span>
                            <span>有效期：{rate.validPeriod}</span>
                            <span>直达/中转：{rate.transitType}</span>
                            <span>航程：{rate.transitTime}</span>
                          </div>
                          
                          {/* 免用箱免堆存 */}
                          <div className="flex gap-4 mb-4 text-sm text-gray-600">
                            <span>ETD：{rate.etd}</span>
                            <span>ETA：{rate.eta}</span>
                          </div>
                          
                          {/* 费用明细表格 */}
                          {renderRateTable([
                            {
                              id: 1,
                              feeName: '海运费',
                              currency: rate.currency,
                              unit: '箱',
                              containerRates: {
                                '20GP': rate['20GP']?.replace(/\s*USD$/, ''),
                                '40GP': rate['40GP']?.replace(/\s*USD$/, ''),
                                '40HC': rate['40HC']?.replace(/\s*USD$/, '')
                              },
                              remark: 'LSE已含'
                            }
                          ], inquiryDetail.containerInfo?.map(c => c.type) || ['20GP', '40HC'])}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 港前运价 */}
            <div className="mb-6">
              <Title heading={6} className="mb-4 text-blue-600">港前运价</Title>
              {inquiryDetail.precarriageRates.length > 0 ? (
                <div className="space-y-4">
                  {inquiryDetail.precarriageRates.map((rate) => (
                    <Card key={rate.id} className="border border-gray-200">
                      <div className="flex items-start gap-4">
                        {/* 选择框 */}
                        <div className="mt-2">
                          <Radio
                            checked={selectedPrecarriageRate === rate.id}
                            onChange={() => setSelectedPrecarriageRate(rate.id)}
                          />
                        </div>
                        
                        {/* 运价内容 */}
                        <div className="flex-1">
                          {/* 基本信息 */}
                          <div className="flex items-center gap-4 mb-4">
                            <span className="font-medium text-blue-600">运价编号：{rate.certNo}</span>
                            <span className="font-medium">类型：{rate.type}</span>
                            <span>供应商：{rate.vendor}</span>
                            <span>起始地：{rate.origin}</span>
                            <span>目的地：{rate.destination}</span>
                          </div>
                          
                          {/* 费用明细表格 */}
                          {renderRateTable([
                            {
                              id: 1,
                              feeName: '拖车费',
                              currency: rate.currency,
                              unit: '箱',
                              containerRates: {
                                '20GP': rate['20GP']?.replace(/\s*CNY$/, ''),
                                '40GP': rate['40GP']?.replace(/\s*CNY$/, ''),
                                '40HC': rate['40HC']?.replace(/\s*CNY$/, '')
                              },
                              remark: ''
                            }
                          ], inquiryDetail.containerInfo?.map(c => c.type) || ['20GP', '40HC'])}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                  <div className="text-gray-500">暂无港前运价数据</div>
                </div>
              )}
            </div>

            {/* 尾程运价 */}
            <div className="mb-6">
              <Title heading={6} className="mb-4 text-blue-600">尾程运价</Title>
              {inquiryDetail.oncarriageRates.length > 0 ? (
                <div className="space-y-4">
                  {inquiryDetail.oncarriageRates.map((rate) => (
                    <Card key={rate.id} className="border border-gray-200">
                      <div className="flex items-start gap-4">
                        {/* 选择框 */}
                        <div className="mt-2">
                          <Radio
                            checked={selectedOncarriageRate === rate.id}
                            onChange={() => setSelectedOncarriageRate(rate.id)}
                          />
                        </div>
                        
                        {/* 运价内容 */}
                        <div className="flex-1">
                          {/* 基本信息 */}
                          <div className="flex items-center gap-4 mb-4">
                            <span className="font-medium text-blue-600">运价编号：{rate.certNo}</span>
                            <span className="font-medium">代理名称：{rate.agentName}</span>
                            <span>目的地：{rate.destination}</span>
                            <span>地址类型：{rate.addressType}</span>
                          </div>
                          
                          {/* 费用明细表格 */}
                          {renderRateTable([
                            {
                              id: 1,
                              feeName: '配送费',
                              currency: rate.currency,
                              unit: '票',
                              unitPrice: rate.price,
                              remark: ''
                            }
                          ], inquiryDetail.containerInfo?.map(c => c.type) || ['20GP', '40HC'])}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                  <div className="text-gray-500">暂无尾程运价数据</div>
                </div>
              )}
            </div>
          </div>

          {/* 导出运价弹窗 */}
          <Modal
            title="导出运价"
            visible={exportModalVisible}
            onCancel={() => setExportModalVisible(false)}
            footer={null}
            style={{ width: 600 }}
          >
            <div className="space-y-6">
              {/* 箱型箱量选择 */}
              <div>
                <div className="mb-4">
                  <h4 className="text-lg font-medium">选择箱型箱量</h4>
                </div>
                
                <div className="space-y-3">
                  {containerSelections.map((selection) => (
                    <Row key={selection.id} gutter={16} align="center">
                      <Col span={8}>
                        <Select
                          placeholder="选择箱型"
                          value={selection.type}
                          onChange={(value) => updateContainerSelection(selection.id, 'type', value)}
                          style={{ width: '100%' }}
                        >
                          {getAvailableContainerTypes().map(option => (
                            <Select.Option key={option.value} value={option.value}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Col>
                      <Col span={8}>
                        <InputNumber
                          min={1}
                          max={999}
                          value={selection.count}
                          onChange={(value) => updateContainerSelection(selection.id, 'count', value || 1)}
                          style={{ width: '100%' }}
                          placeholder="数量"
                        />
                      </Col>
                      <Col span={8}>
                        <Button
                          type="text"
                          status="danger"
                          disabled={containerSelections.length === 1}
                          onClick={() => removeContainerSelection(selection.id)}
                        >
                          删除
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-center gap-4">
                <Button
                  type="primary"
                  icon={<IconCopy />}
                  onClick={generateQuotationText}
                  size="large"
                >
                  复制快捷报价文本
                </Button>
                <Button
                  type="primary"
                  icon={<IconPrinter />}
                  onClick={generatePDF}
                  size="large"
                >
                  打印报价单文件
                </Button>
              </div>
            </div>
          </Modal>

          {/* 快捷报价文本弹窗 */}
          <Modal
            title="快捷报价文本"
            visible={copyTextModalVisible}
            onCancel={() => setCopyTextModalVisible(false)}
            footer={
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setCopyTextModalVisible(false)}>
                  关闭
                </Button>
                <Button type="primary" icon={<IconCopy />} onClick={copyToClipboard}>
                  复制文本
                </Button>
              </div>
            }
            style={{ width: 700 }}
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                以下是根据您选择的箱型箱量生成的报价文本，您可以复制后发送给客户：
              </p>
              <Input.TextArea
                value={quotationText}
                readOnly
                rows={15}
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </Modal>



          {/* PDF预览弹窗 */}
          <Modal
            title="报价单预览"
            visible={pdfPreviewVisible}
            onCancel={() => setPdfPreviewVisible(false)}
            footer={
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setPdfPreviewVisible(false)}>
                  关闭
                </Button>
                <Button type="primary" icon={<IconDownload />}>
                  下载PDF
                </Button>
              </div>
            }
            style={{ width: 900, top: 20 }}
          >
            <div className="space-y-4" style={{ height: '600px', overflow: 'auto' }}>
              {/* PDF预览内容 */}
              <div className="bg-white p-8 shadow-sm border" style={{ fontFamily: 'SimSun, serif' }}>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">询价报价单</h1>
                  <p className="text-gray-600">Quotation for Inquiry</p>
                </div>

                {/* 基本信息 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">基本信息</h3>
                  <Row gutter={[16, 8]}>
                    <Col span={8}>询价编号：{inquiryDetail?.inquiryNo}</Col>
                    <Col span={8}>询价类型：{type?.toUpperCase()}</Col>
                    <Col span={8}>询价人：{inquiryDetail?.inquirer}</Col>
                    <Col span={8}>起运港：{inquiryDetail?.departurePort}</Col>
                    <Col span={8}>目的港：{inquiryDetail?.dischargePort}</Col>
                    <Col span={8}>{type === 'air' ? '航空公司' : '船公司'}：{inquiryDetail?.shipCompany}</Col>
                  </Row>
                </div>

                {/* 箱型箱量 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">箱型箱量</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {containerSelections
                      .filter(selection => selection.count > 0)
                      .map(selection => (
                        <div key={selection.id} className="border p-3 text-center">
                          <div className="font-medium">{selection.type.toUpperCase()}</div>
                          <div className="text-xl font-bold text-blue-600">{selection.count} 箱</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 干线费用明细 */}
                {selectedMainlineRate && inquiryDetail?.mainlineRates.find(r => r.id === selectedMainlineRate) && (
                  <div className="mb-6">
                    <div className="bg-blue-50 px-4 py-2 mb-3 rounded">
                      <h3 className="text-lg font-semibold text-blue-800">干线费用明细</h3>
                    </div>
                    <table className="w-full border-collapse border border-gray-300 shadow-sm">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="border border-gray-300 p-3 text-left font-semibold">费用项目</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">币种</th>
                          {containerSelections
                            .filter(selection => selection.count > 0)
                            .map(selection => (
                              <th key={selection.id} className="border border-gray-300 p-3 text-center font-semibold">
                                {selection.type.toUpperCase()} × {selection.count}
                              </th>
                            ))}
                          <th className="border border-gray-300 p-3 text-center font-semibold bg-blue-200">小计</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="border border-gray-300 p-3 font-medium">干线运输费</td>
                          <td className="border border-gray-300 p-3 text-center">{inquiryDetail.mainlineRates.find(r => r.id === selectedMainlineRate)?.currency}</td>
                          {containerSelections
                            .filter(selection => selection.count > 0)
                            .map(selection => {
                              const mainlineRate = inquiryDetail.mainlineRates.find(r => r.id === selectedMainlineRate);
                              const unitPrice = type === 'fcl' ? mainlineRate?.[selection.type as keyof MainlineRate] as string || '0' : mainlineRate?.price || '0';
                              const totalPrice = parseInt(unitPrice) * selection.count;
                              return (
                                <td key={selection.id} className="border border-gray-300 p-3 text-center">
                                  <div>
                                    <div className="text-sm text-gray-600">{mainlineRate?.currency} {unitPrice} × {selection.count}</div>
                                    <div className="font-medium">{mainlineRate?.currency} {totalPrice}</div>
                                  </div>
                                </td>
                              );
                            })}
                          <td className="border border-gray-300 p-3 text-center font-bold text-blue-700 bg-blue-50">
                            {inquiryDetail.mainlineRates.find(r => r.id === selectedMainlineRate)?.currency} {containerSelections
                              .filter(selection => selection.count > 0)
                              .reduce((sum, selection) => {
                                const mainlineRate = inquiryDetail.mainlineRates.find(r => r.id === selectedMainlineRate);
                                const unitPrice = type === 'fcl' ? mainlineRate?.[selection.type as keyof MainlineRate] as string || '0' : mainlineRate?.price || '0';
                                return sum + (parseInt(unitPrice) * selection.count);
                              }, 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 港前费用明细 */}
                {selectedPrecarriageRate && inquiryDetail?.precarriageRates.find(r => r.id === selectedPrecarriageRate) && (
                  <div className="mb-6">
                    <div className="bg-green-50 px-4 py-2 mb-3 rounded">
                      <h3 className="text-lg font-semibold text-green-800">港前费用明细</h3>
                    </div>
                    <table className="w-full border-collapse border border-gray-300 shadow-sm">
                      <thead>
                        <tr className="bg-green-100">
                          <th className="border border-gray-300 p-3 text-left font-semibold">费用项目</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">币种</th>
                          {containerSelections
                            .filter(selection => selection.count > 0)
                            .map(selection => (
                              <th key={selection.id} className="border border-gray-300 p-3 text-center font-semibold">
                                {selection.type.toUpperCase()} × {selection.count}
                              </th>
                            ))}
                          <th className="border border-gray-300 p-3 text-center font-semibold bg-green-200">小计</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="border border-gray-300 p-3 font-medium">港前运输费</td>
                          <td className="border border-gray-300 p-3 text-center">{inquiryDetail.precarriageRates.find(r => r.id === selectedPrecarriageRate)?.currency}</td>
                          {containerSelections
                            .filter(selection => selection.count > 0)
                            .map(selection => {
                              const precarriageRate = inquiryDetail.precarriageRates.find(r => r.id === selectedPrecarriageRate);
                              const unitPrice = type === 'fcl' ? precarriageRate?.[selection.type as keyof PrecarriageRate] as string || '0' : precarriageRate?.price || '0';
                              const totalPrice = parseInt(unitPrice) * selection.count;
                              return (
                                <td key={selection.id} className="border border-gray-300 p-3 text-center">
                                  <div>
                                    <div className="text-sm text-gray-600">{precarriageRate?.currency} {unitPrice} × {selection.count}</div>
                                    <div className="font-medium">{precarriageRate?.currency} {totalPrice}</div>
                                  </div>
                                </td>
                              );
                            })}
                          <td className="border border-gray-300 p-3 text-center font-bold text-green-700 bg-green-50">
                            {inquiryDetail.precarriageRates.find(r => r.id === selectedPrecarriageRate)?.currency} {containerSelections
                              .filter(selection => selection.count > 0)
                              .reduce((sum, selection) => {
                                const precarriageRate = inquiryDetail.precarriageRates.find(r => r.id === selectedPrecarriageRate);
                                const unitPrice = type === 'fcl' ? precarriageRate?.[selection.type as keyof PrecarriageRate] as string || '0' : precarriageRate?.price || '0';
                                return sum + (parseInt(unitPrice) * selection.count);
                              }, 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 尾程费用明细 */}
                {selectedOncarriageRate && inquiryDetail?.oncarriageRates.find(r => r.id === selectedOncarriageRate) && (
                  <div className="mb-6">
                    <div className="bg-orange-50 px-4 py-2 mb-3 rounded">
                      <h3 className="text-lg font-semibold text-orange-800">尾程费用明细</h3>
                    </div>
                    <table className="w-full border-collapse border border-gray-300 shadow-sm">
                      <thead>
                        <tr className="bg-orange-100">
                          <th className="border border-gray-300 p-3 text-left font-semibold">费用项目</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">币种</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">单价</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold">数量</th>
                          <th className="border border-gray-300 p-3 text-center font-semibold bg-orange-200">小计</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="border border-gray-300 p-3 font-medium">尾程配送费</td>
                          <td className="border border-gray-300 p-3 text-center">{inquiryDetail.oncarriageRates.find(r => r.id === selectedOncarriageRate)?.currency}</td>
                          <td className="border border-gray-300 p-3 text-center">{inquiryDetail.oncarriageRates.find(r => r.id === selectedOncarriageRate)?.price}</td>
                          <td className="border border-gray-300 p-3 text-center">
                            {containerSelections.filter(selection => selection.count > 0).reduce((sum, selection) => sum + selection.count, 0)} 箱
                          </td>
                          <td className="border border-gray-300 p-3 text-center font-bold text-orange-700 bg-orange-50">
                            {inquiryDetail.oncarriageRates.find(r => r.id === selectedOncarriageRate)?.currency} {
                              parseInt(inquiryDetail.oncarriageRates.find(r => r.id === selectedOncarriageRate)?.price || '0') * 
                              containerSelections.filter(selection => selection.count > 0).reduce((sum, selection) => sum + selection.count, 0)
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 费用汇总 */}
                <div className="mb-6">
                  <div className="bg-gray-100 px-4 py-2 mb-3 rounded">
                    <h3 className="text-lg font-semibold text-gray-800">费用汇总</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border">
                    <Row gutter={[16, 8]}>
                      {selectedMainlineRate && (
                        <Col span={8}>
                          <div className="text-lg">
                            <span className="text-gray-600">干线费用：</span>
                            <span className="font-bold text-blue-700">
                              {inquiryDetail?.mainlineRates.find(r => r.id === selectedMainlineRate)?.currency} {containerSelections
                                .filter(selection => selection.count > 0)
                                .reduce((sum, selection) => {
                                  const mainlineRate = inquiryDetail?.mainlineRates.find(r => r.id === selectedMainlineRate);
                                  const unitPrice = type === 'fcl' ? mainlineRate?.[selection.type as keyof MainlineRate] as string || '0' : mainlineRate?.price || '0';
                                  return sum + (parseInt(unitPrice) * selection.count);
                                }, 0)}
                            </span>
                          </div>
                        </Col>
                      )}
                      {selectedPrecarriageRate && (
                        <Col span={8}>
                          <div className="text-lg">
                            <span className="text-gray-600">港前费用：</span>
                            <span className="font-bold text-green-700">
                              {inquiryDetail?.precarriageRates.find(r => r.id === selectedPrecarriageRate)?.currency} {containerSelections
                                .filter(selection => selection.count > 0)
                                .reduce((sum, selection) => {
                                  const precarriageRate = inquiryDetail?.precarriageRates.find(r => r.id === selectedPrecarriageRate);
                                  const unitPrice = type === 'fcl' ? precarriageRate?.[selection.type as keyof PrecarriageRate] as string || '0' : precarriageRate?.price || '0';
                                  return sum + (parseInt(unitPrice) * selection.count);
                                }, 0)}
                            </span>
                          </div>
                        </Col>
                      )}
                      {selectedOncarriageRate && (
                        <Col span={8}>
                          <div className="text-lg">
                            <span className="text-gray-600">尾程费用：</span>
                            <span className="font-bold text-orange-700">
                              {inquiryDetail?.oncarriageRates.find(r => r.id === selectedOncarriageRate)?.currency} {
                                parseInt(inquiryDetail?.oncarriageRates.find(r => r.id === selectedOncarriageRate)?.price || '0') * 
                                containerSelections.filter(selection => selection.count > 0).reduce((sum, selection) => sum + selection.count, 0)
                              }
                            </span>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>

                {/* 其他信息 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">其他信息</h3>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>货好时间：{inquiryDetail?.cargoReadyTime}</Col>
                    <Col span={12}>委托单位：{inquiryDetail?.clientName}</Col>
                    {type === 'fcl' ? (
                      <Col span={24}>箱型箱量：{inquiryDetail?.containerInfo?.map(item => `${item.count}*${item.type}`).join('+')}</Col>
                    ) : (
                      <>
                        <Col span={12}>重量：{inquiryDetail?.weight} KGS</Col>
                        <Col span={12}>体积：{inquiryDetail?.volume} CBM</Col>
                      </>
                    )}
                  </Row>
                </div>

                {/* 备注 */}
                {inquiryDetail?.remark && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">备注</h3>
                    <p className="text-gray-700">{inquiryDetail.remark}</p>
                  </div>
                )}

                {/* 免责声明 */}
                <div className="mt-8 p-4 bg-gray-50 border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>重要声明：</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 以上价格仅供参考，实际价格以正式合同为准</li>
                    <li>• 价格有效期以报价单中标注的日期为准</li>
                    <li>• 如有任何疑问，请联系我们的客服团队</li>
                  </ul>
                </div>

                {/* 页脚 */}
                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>报价单生成时间：{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Modal>
      </Card>
    </ControlTowerSaasLayout>
  );
};

export default InquiryDetail;