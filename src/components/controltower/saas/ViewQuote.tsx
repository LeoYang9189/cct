import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Breadcrumb,
  Button,
  Space,
  Modal,
  Message,
  Checkbox,
  Tag,
  Table,
  Typography,
  Grid,
  Input
} from '@arco-design/web-react';
import { IconClose, IconDownload, IconCopy, IconPrinter } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";

const { Title } = Typography;
const { Row, Col } = Grid;

const { TextArea } = Input;

interface QuoteBasicInfo {
  quoteNo: string;
  inquiryNo: string;
  quoter: string;
  clientType: string;
  clientCompany: string;
  clientName: string;
  cargoNature: string;
  cargoReadyTime: string;
  cargoReadyDate?: string;
  loadingPointDetail?: string;
  addressType?: string;
  zipCode?: string;
  address?: string;
  warehouseCode?: string;
}

interface QuoteCargoInfo {
  transitType: string;
  route: string;
  departurePort: string;
  dischargePort: string;
  transitPort?: string;
  weight: string;
  shipCompany: string;
  remark: string;
}

interface ContainerInfo {
  id: number;
  type: string;
  count: number;
}

interface RateItem {
  id: number;
  feeName: string;
  currency: string;
  unit: string;
  unitPrice?: string;
  containerRates?: Record<string, string>;
  remark: string;
}

interface MainlineRate {
  id: number;
  selected: boolean;
  rateCode: string; // 运价编号
  shipCompany: string;
  validPeriod: string;
  transitType: string;
  transitTime: string;
  freeBox: string;
  freeStorage: string;
  status: '已报价' | '待报价' | '拒绝报价' | '无需报价';
  rateItems: RateItem[];
}

interface PrecarriageRate {
  id: number;
  selected: boolean;
  rateCode: string; // 运价编号
  type: string;
  subType?: string;
  vendor: string;
  validPeriod: string;
  status: '已报价' | '待报价' | '拒绝报价' | '无需报价';
  rateItems: RateItem[];
}

interface OncarriageRate {
  id: number;
  selected: boolean;
  rateCode: string; // 运价编号
  agentName: string;
  validPeriod: string;
  status: '已报价' | '待报价' | '拒绝报价' | '无需报价';
  rateItems: RateItem[];
}

const ViewQuote: React.FC = () => {
  const navigate = useNavigate();
  const { quoteId } = useParams<{ quoteId: string }>();
  
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [incompleteModalVisible, setIncompleteModalVisible] = useState(false);
  const [copyTextModalVisible, setCopyTextModalVisible] = useState(false);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [quotationText, setQuotationText] = useState('');
  
  // 报价数据
  const [basicInfo, setBasicInfo] = useState<QuoteBasicInfo>({} as QuoteBasicInfo);
  const [cargoInfo, setCargoInfo] = useState<QuoteCargoInfo>({} as QuoteCargoInfo);
  const [containerList, setContainerList] = useState<ContainerInfo[]>([]);
  const [mainlineRates, setMainlineRates] = useState<MainlineRate[]>([]);
  const [precarriageRates, setPrecarriageRates] = useState<PrecarriageRate[]>([]);
  const [oncarriageRates, setOncarriageRates] = useState<OncarriageRate[]>([]);

  // 加载报价数据
  useEffect(() => {
    loadQuoteData();
  }, [quoteId]);

  const loadQuoteData = async () => {
    setLoading(true);
    try {
      // 模拟加载数据
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 设置基本信息
      setBasicInfo({
        quoteNo: `QT${Date.now().toString().slice(-8)}`,
        inquiryNo: 'INQ20241201001',
        quoter: '张三',
        clientType: '正式客户',
        clientCompany: '阿里巴巴集团',
        clientName: '',
        cargoNature: '询价',
        cargoReadyTime: '一周内',
        loadingPointDetail: '浙江省杭州市萧山区某某路123号',
        addressType: '第三方地址',
        zipCode: '92101',
        address: 'San Diego, CA'
      });

      // 设置货物信息
      setCargoInfo({
        transitType: '中转',
        route: '美加线',
        departurePort: 'CNSHA | Shanghai',
        dischargePort: 'USLAX | Los Angeles',
        transitPort: 'SGSIN | Singapore',
        weight: '1500',
        shipCompany: 'MSC | 地中海',
        remark: 'LSE已含'
      });

      // 设置箱型箱量
      setContainerList([
        { id: 1, type: '20GP', count: 2 },
        { id: 2, type: '40HC', count: 1 }
      ]);

      // 设置mock运价数据
      setMainlineRates(generateMockMainlineRates());
      setPrecarriageRates(generateMockPrecarriageRates());
      setOncarriageRates(generateMockOncarriageRates());
      
    } catch (error) {
      Message.error('加载报价数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 生成mock数据的函数
  const generateMockMainlineRates = (): MainlineRate[] => {
    const statuses: Array<'已报价' | '待报价' | '拒绝报价' | '无需报价'> = ['已报价', '已报价', '已报价']; // 只返回已报价的运价
    
    return Array(3).fill(null).map((_, index) => ({
      id: index + 1,
      selected: index === 0, // 默认选中第一个
      rateCode: `FCL${2024}${String(index + 1).padStart(4, '0')}`, // 运价编号
      shipCompany: ['MSC | 地中海', 'COSCO | 中远海运', 'MAERSK | 马士基'][index],
      validPeriod: '2024-05-01 至 2024-12-31',
      transitType: ['直达', '中转', '直达'][index],
      transitTime: `${20 + index * 2}天`,
      freeBox: `${7 + index}天`,
      freeStorage: `${5 + index}天`,
      status: statuses[index],
      rateItems: [
        {
          id: 1,
          feeName: '海运费',
          currency: 'USD',
          unit: '箱',
          containerRates: {
            '20GP': (500 + index * 50).toString(),
            '40HC': (900 + index * 80).toString()
          },
          remark: 'LSE已含'
        },
        {
          id: 2,
          feeName: '港杂费',
          currency: 'USD',
          unit: '箱',
          containerRates: {
            '20GP': (150 + index * 20).toString(),
            '40HC': (250 + index * 30).toString()
          },
          remark: ''
        },
        {
          id: 3,
          feeName: '单证费',
          currency: 'USD',
          unit: '票',
          unitPrice: (50 + index * 10).toString(),
          remark: '每票收取'
        },
        {
          id: 4,
          feeName: '拖车费',
          currency: 'CNY',
          unit: '公里',
          unitPrice: (8 + index * 2).toString(),
          remark: '按公里计费'
        }
      ]
    }));
  };

  const generateMockPrecarriageRates = (): PrecarriageRate[] => {
    // Mock数据：港前待报价，返回空数组表示无运价
    return [];
  };

  const generateMockOncarriageRates = (): OncarriageRate[] => {
    // Mock数据：尾程拒绝报价，返回空数组表示无运价
    return [];
  };

  // 关闭页面
  const handleClose = () => {
    navigate(-1);
  };

  // 导出报价
  const handleExportQuote = () => {
    // 检查报价完整性
    const incompleteRates = checkQuoteCompleteness();
    
    if (incompleteRates.length > 0) {
      setIncompleteModalVisible(true);
    } else {
      setExportModalVisible(true);
    }
  };

  // 检查报价完整性
  const checkQuoteCompleteness = () => {
    const incomplete: string[] = [];
    
    // 检查干线运价
    const mainlineSelected = mainlineRates.filter(rate => rate.selected);
    if (mainlineSelected.some(rate => rate.status === '待报价' || rate.status === '拒绝报价')) {
      incomplete.push('干线运价：待报价');
    }
    
    // 检查港前运价
    const precarriageSelected = precarriageRates.filter(rate => rate.selected);
    if (precarriageSelected.some(rate => rate.status === '待报价' || rate.status === '拒绝报价')) {
      incomplete.push('港前运价：待报价');
    }
    
    // 检查尾程运价
    const oncarriageSelected = oncarriageRates.filter(rate => rate.selected);
    if (oncarriageSelected.some(rate => rate.status === '待报价' || rate.status === '拒绝报价')) {
      incomplete.push('尾程运价：待报价');
    }
    
    return incomplete;
  };

  // 处理运价选择（单选）
  const handleMainlineRateSelect = (rateId: number, checked: boolean) => {
    if (checked) {
      // 单选：取消其他选中，只选中当前项
      setMainlineRates(prev => prev.map(rate => ({
        ...rate,
        selected: rate.id === rateId
      })));
    } else {
      // 取消选中
      setMainlineRates(prev => prev.map(rate => 
        rate.id === rateId ? { ...rate, selected: false } : rate
      ));
    }
  };

  const handlePrecarriageRateSelect = (rateId: number, checked: boolean) => {
    if (checked) {
      // 单选：取消其他选中，只选中当前项
      setPrecarriageRates(prev => prev.map(rate => ({
        ...rate,
        selected: rate.id === rateId
      })));
    } else {
      // 取消选中
      setPrecarriageRates(prev => prev.map(rate => 
        rate.id === rateId ? { ...rate, selected: false } : rate
      ));
    }
  };

  const handleOncarriageRateSelect = (rateId: number, checked: boolean) => {
    if (checked) {
      // 单选：取消其他选中，只选中当前项
      setOncarriageRates(prev => prev.map(rate => ({
        ...rate,
        selected: rate.id === rateId
      })));
    } else {
      // 取消选中
      setOncarriageRates(prev => prev.map(rate => 
        rate.id === rateId ? { ...rate, selected: false } : rate
      ));
    }
  };

  // 生成快捷报价文本
  const generateQuotationText = () => {
    const containerInfo = containerList.map(c => `${c.count}*${c.type}`).join(' + ');
    
    // 获取选中的运价
    const selectedMainline = mainlineRates.find(rate => rate.selected);
    const selectedPrecarriage = precarriageRates.find(rate => rate.selected);
    const selectedOncarriage = oncarriageRates.find(rate => rate.selected);
    
    // 计算总价格
    let totalCost = 0;
    const costDetails: string[] = [];
    
    // 计算干线费用
    if (selectedMainline && selectedMainline.status === '已报价') {
      selectedMainline.rateItems.forEach(item => {
        containerList.forEach(container => {
          const rate = item.containerRates?.[container.type];
          if (rate) {
            const cost = parseFloat(rate) * container.count;
            totalCost += cost;
          }
        });
      });
      costDetails.push(`干线运价：${selectedMainline.rateCode} - ${selectedMainline.shipCompany}`);
    }
    
    // 计算港前费用
    if (selectedPrecarriage && selectedPrecarriage.status === '已报价') {
      selectedPrecarriage.rateItems.forEach(item => {
        containerList.forEach(container => {
          const rate = item.containerRates?.[container.type];
          if (rate) {
            const cost = parseFloat(rate) * container.count;
            totalCost += cost;
          }
        });
      });
      costDetails.push(`港前运价：${selectedPrecarriage.rateCode} - ${selectedPrecarriage.vendor}`);
    }
    
    // 计算尾程费用
    if (selectedOncarriage && selectedOncarriage.status === '已报价') {
      selectedOncarriage.rateItems.forEach(item => {
        containerList.forEach(container => {
          const rate = item.containerRates?.[container.type];
          if (rate) {
            const cost = parseFloat(rate) * container.count;
            totalCost += cost;
          }
        });
      });
      costDetails.push(`尾程运价：${selectedOncarriage.rateCode} - ${selectedOncarriage.agentName}`);
    }

    const text = `
【报价单】

报价编号：${basicInfo.quoteNo}
询价编号：${basicInfo.inquiryNo}
委托单位：${basicInfo.clientType === '正式客户' ? basicInfo.clientCompany : basicInfo.clientName}

航线信息：
${cargoInfo.departurePort} → ${cargoInfo.dischargePort}
船公司：${cargoInfo.shipCompany}
航线：${cargoInfo.route}
直达/中转：${cargoInfo.transitType}

箱型箱量：${containerInfo}

运价方案：
${costDetails.join('\n')}

报价总计：USD ${totalCost.toFixed(2)}

备注：${cargoInfo.remark || '无'}

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
    setExportModalVisible(false);
    setPdfPreviewVisible(true);
  };



  // 渲染运价表格
  const renderRateTable = (rateItems: RateItem[], containerTypes: string[]) => {
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
        render: (_: any, record: RateItem) => record.containerRates?.[type] || '-'
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

  return (
    <ControlTowerSaasLayout
      menuSelectedKey="10"
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>询价报价</Breadcrumb.Item>
          <Breadcrumb.Item>报价管理</Breadcrumb.Item>
          <Breadcrumb.Item>查看报价</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Card 
        loading={loading}
        title={
          <div className="flex justify-between items-center">
            <span>报价详情</span>
            <Space>
              <Button 
                type="primary" 
                icon={<IconDownload />}
                onClick={handleExportQuote}
              >
                导出报价
              </Button>
              <Button 
                icon={<IconClose />}
                onClick={handleClose}
              >
                关闭
              </Button>
            </Space>
          </div>
        }
      >
        {/* 运价类型选择 */}
        <div className="border rounded p-4 mb-4">
          <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">运价类型</div>
          <div className="flex items-center gap-8">
            <Checkbox
              checked={true}
              disabled={true}
              className="text-gray-500"
            >
              干线运价
            </Checkbox>
            <Checkbox
              checked={true}
              disabled={true}
              className="text-gray-500"
            >
              港前运价
            </Checkbox>
            <Checkbox
              checked={true}
              disabled={true}
              className="text-gray-500"
            >
              尾程运价
            </Checkbox>
          </div>
        </div>

        {/* 上半部分：基本信息和货物信息并排 */}
        <Row gutter={[16, 16]} className="mb-4">
          {/* 左侧：基本信息 */}
          <Col span={12}>
            <div className="border rounded p-4">
              <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">基本信息</div>
              <Descriptions
                column={1}
                data={[
                  { label: '报价编号', value: basicInfo.quoteNo },
                  { label: '询价编号', value: basicInfo.inquiryNo },
                  { label: '报价人', value: basicInfo.quoter },
                  { label: '货盘性质', value: basicInfo.cargoNature },
                  { label: '货好时间', value: basicInfo.cargoReadyTime },
                  { label: '委托单位', value: basicInfo.clientType === '正式客户' ? basicInfo.clientCompany : basicInfo.clientName },
                  ...(basicInfo.loadingPointDetail ? [{ label: '装箱门点', value: basicInfo.loadingPointDetail }] : []),
                  ...(basicInfo.addressType ? [
                    { label: '配送地址类型', value: basicInfo.addressType },
                    ...(basicInfo.addressType === '第三方地址' ? [
                      { label: '邮编', value: basicInfo.zipCode },
                      { label: '地址', value: basicInfo.address }
                    ] : [
                      { label: '仓库代码', value: basicInfo.warehouseCode }
                    ])
                  ] : [])
                ]}
              />
            </div>
          </Col>
          
          {/* 右侧：货物信息 */}
          <Col span={12}>
            <div className="border rounded p-4 mb-4">
              <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">货物信息</div>
              <Descriptions
                column={1}
                data={[
                  { label: '直达/中转', value: cargoInfo.transitType },
                  { label: '航线', value: cargoInfo.route },
                  { label: '起运港', value: cargoInfo.departurePort },
                  { label: '卸货港', value: cargoInfo.dischargePort },
                  ...(cargoInfo.transitPort ? [{ label: '中转港', value: cargoInfo.transitPort }] : []),
                  { label: '重量', value: cargoInfo.weight ? `${cargoInfo.weight} KGS` : '' },
                  { label: '船公司', value: cargoInfo.shipCompany },
                  { label: '备注', value: cargoInfo.remark }
                ]}
              />
            </div>
            
            {/* 箱型箱量 */}
            <div className="border rounded p-4">
              <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">箱型箱量</div>
              <div className="flex items-center gap-4">
                {containerList.map((container) => (
                  <span key={container.id} className="text-lg font-medium">
                    {container.count} × {container.type}
                  </span>
                ))}
              </div>
            </div>
          </Col>
        </Row>



        {/* 运价明细模块 */}
        <div>
          <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-6 text-lg">运价明细</div>
          
          {/* 干线运价 */}
          {mainlineRates.length > 0 && (
            <div className="mb-6">
              <Title heading={6} className="mb-4 text-blue-600">干线运价</Title>
              <div className="space-y-4">
                {mainlineRates.map((rate) => (
                  <Card key={rate.id} className="border border-gray-200">
                    <div className="flex items-start gap-4">
                      {/* 选择框 */}
                      <div className="mt-2">
                        <Checkbox
                          checked={rate.selected}
                          onChange={(checked) => handleMainlineRateSelect(rate.id, checked)}
                        />
                      </div>
                      
                      {/* 运价内容 */}
                      <div className="flex-1">
                        {/* 基本信息 */}
                        <div className="flex items-center gap-4 mb-4">
                          <span className="font-medium text-blue-600">运价编号：{rate.rateCode}</span>
                          <span className="font-medium">船公司：{rate.shipCompany}</span>
                          <span>有效期：{rate.validPeriod}</span>
                          <span>直达/中转：{rate.transitType}</span>
                          <span>航程：{rate.transitTime}</span>
                        </div>
                        
                        {/* 免用箱免堆存 */}
                        <div className="flex gap-4 mb-4 text-sm text-gray-600">
                          <span>免用箱：{rate.freeBox}</span>
                          <span>免堆存：{rate.freeStorage}</span>
                        </div>
                        
                        {/* 费用明细表格 */}
                        {renderRateTable(rate.rateItems, containerList.map(c => c.type))}
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
            {precarriageRates.length > 0 ? (
              <div className="space-y-4">
                {precarriageRates.map((rate) => (
                  <Card key={rate.id} className="border border-gray-200">
                    <div className="flex items-start gap-4">
                      {/* 选择框 */}
                      <div className="mt-2">
                        <Checkbox
                          checked={rate.selected}
                          onChange={(checked) => handlePrecarriageRateSelect(rate.id, checked)}
                        />
                      </div>
                      
                      {/* 运价内容 */}
                      <div className="flex-1">
                        {/* 基本信息 */}
                        <div className="flex items-center gap-4 mb-4">
                          <span className="font-medium">类型：{rate.type}</span>
                          {rate.subType && <span>子类型：{rate.subType}</span>}
                          <span>供应商：{rate.vendor}</span>
                          <span>有效期：{rate.validPeriod}</span>
                        </div>
                        
                        {/* 费用明细表格 */}
                        {renderRateTable(rate.rateItems, containerList.map(c => c.type))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                <Tag color="orange" className="mb-2">待报价</Tag>
                <p className="text-gray-500">暂无港前运价方案</p>
              </div>
            )}
          </div>

          {/* 尾程运价 */}
          <div className="mb-6">
            <Title heading={6} className="mb-4 text-blue-600">尾程运价</Title>
            {oncarriageRates.length > 0 ? (
              <div className="space-y-4">
                {oncarriageRates.map((rate) => (
                  <Card key={rate.id} className="border border-gray-200">
                    <div className="flex items-start gap-4">
                      {/* 选择框 */}
                      <div className="mt-2">
                        <Checkbox
                          checked={rate.selected}
                          onChange={(checked) => handleOncarriageRateSelect(rate.id, checked)}
                        />
                      </div>
                      
                      {/* 运价内容 */}
                      <div className="flex-1">
                        {/* 基本信息 */}
                        <div className="flex items-center gap-4 mb-4">
                          <span className="font-medium">代理名称：{rate.agentName}</span>
                          <span>有效期：{rate.validPeriod}</span>
                        </div>
                        
                        {/* 费用明细表格 */}
                        {renderRateTable(rate.rateItems, containerList.map(c => c.type))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-gray-200 rounded bg-gray-50">
                <Tag color="red" className="mb-2">拒绝报价</Tag>
                <p className="text-gray-500">暂无尾程运价方案</p>
              </div>
            )}
          </div>
        </div>

      </Card>

      {/* 报价不完整提示弹窗 */}
      <Modal
        title="报价不完整提示"
        visible={incompleteModalVisible}
        onOk={() => {
          setIncompleteModalVisible(false);
          setExportModalVisible(true);
        }}
        onCancel={() => setIncompleteModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <div className="space-y-4">
          <p>当前报价尚不完整，存在以下报价信息缺失：</p>
          <ul className="list-disc list-inside space-y-1">
            {checkQuoteCompleteness().map((item, index) => (
              <li key={index} className="text-red-500">{item}</li>
            ))}
          </ul>
          <p>是否仅导出已有的报价？</p>
        </div>
      </Modal>

      {/* 导出报价弹窗 */}
      <Modal
        title="导出报价"
        visible={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
        style={{ width: 600 }}
      >
        <div className="space-y-6">
          {/* 已选择的运价方案 */}
          <div>
            <h4 className="text-lg font-medium mb-4">已选择的运价方案</h4>
            <div className="space-y-2 bg-gray-50 p-4 rounded">
              {mainlineRates.filter(r => r.selected && r.status === '已报价').map(rate => (
                <div key={rate.id} className="flex justify-between">
                  <span>干线运价：{rate.rateCode} - {rate.shipCompany}</span>
                  <Tag color="green">已报价</Tag>
                </div>
              ))}
              {precarriageRates.filter(r => r.selected && r.status === '已报价').map(rate => (
                <div key={rate.id} className="flex justify-between">
                  <span>港前运价：{rate.rateCode} - {rate.vendor}</span>
                  <Tag color="green">已报价</Tag>
                </div>
              ))}
              {oncarriageRates.filter(r => r.selected && r.status === '已报价').map(rate => (
                <div key={rate.id} className="flex justify-between">
                  <span>尾程运价：{rate.rateCode} - {rate.agentName}</span>
                  <Tag color="green">已报价</Tag>
                </div>
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
            以下是根据您选择的运价方案生成的报价文本，您可以复制后发送给客户：
          </p>
          <TextArea
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
              <h1 className="text-2xl font-bold mb-2">报价单</h1>
              <p className="text-gray-600">Quotation</p>
            </div>

            {/* 基本信息 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">基本信息</h3>
              <Row gutter={[16, 8]}>
                <Col span={8}>报价编号：{basicInfo.quoteNo}</Col>
                <Col span={8}>询价编号：{basicInfo.inquiryNo}</Col>
                <Col span={8}>报价人：{basicInfo.quoter}</Col>
                <Col span={8}>委托单位：{basicInfo.clientType === '正式客户' ? basicInfo.clientCompany : basicInfo.clientName}</Col>
                <Col span={8}>货盘性质：{basicInfo.cargoNature}</Col>
                <Col span={8}>货好时间：{basicInfo.cargoReadyTime}</Col>
              </Row>
            </div>

            {/* 货物信息 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">货物信息</h3>
              <Row gutter={[16, 8]}>
                <Col span={8}>起运港：{cargoInfo.departurePort}</Col>
                <Col span={8}>卸货港：{cargoInfo.dischargePort}</Col>
                <Col span={8}>船公司：{cargoInfo.shipCompany}</Col>
                <Col span={8}>航线：{cargoInfo.route}</Col>
                <Col span={8}>直达/中转：{cargoInfo.transitType}</Col>
                {cargoInfo.weight && <Col span={8}>重量：{cargoInfo.weight} KGS</Col>}
              </Row>
            </div>

            {/* 箱型箱量 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">箱型箱量</h3>
              <div className="grid grid-cols-3 gap-4">
                {containerList.map(container => (
                  <div key={container.id} className="border p-3 text-center">
                    <div className="font-medium">{container.type}</div>
                    <div className="text-xl font-bold text-blue-600">{container.count} 箱</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 运价明细 - 后续步骤实现 */}
            <div className="text-center py-8 text-gray-500">
              运价明细部分将在后续步骤完善
            </div>
          </div>
        </div>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default ViewQuote; 