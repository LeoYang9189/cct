import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Descriptions,
  Table,
  Modal,
  InputNumber,
  Select,
  Grid,
  Input,
  Message
} from '@arco-design/web-react';
import { IconArrowLeft, IconDownload, IconCopy, IconPrinter } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;
const { Row, Col } = Grid;
const { Option } = Select;
const { TextArea } = Input;

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
 * 港前运价查看页面
 */
const ViewPrecarriageRate: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const rateId = params.id;
  
  // 基本信息状态
  const [rateData, setRateData] = useState<any>({});
  
  // 按箱型计费列表状态
  const [containerRateList, setContainerRateList] = useState<ContainerRateItem[]>([]);
  
  // 非按箱型计费列表状态
  const [nonContainerRateList, setNonContainerRateList] = useState<NonContainerRateItem[]>([]);
  
  // 箱型显示设置
  const [boxTypeVisibility] = useState({
    '20gp': true,
    '40gp': true,
    '40hc': true,
    '45hc': true,
    '40nor': true
  });

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
        code: `PCR2024050${id.padStart(3, '0')}`,
        rateType: '直拖',
        sublineType: null,
        origin: '浙江省杭州市萧山区',
        destination: 'CNSHA | SHANGHAI',
        terminal: '洋山',
        vendor: '安吉物流',
        '20gp': 800,
        '40gp': 1200,
        '40hc': 1300,
        '40nor': 1250,
        '45hc': 1500,
        validDateRange: '2024-05-01 至 2024-12-31',
        status: '正常',
        remark: '需提前24小时预约',
        createDate: '2024-05-01',
        createPerson: '张三',
        modifyDate: '2024-05-15',
        modifyPerson: '李四',
        validFrom: '2024-05-01',
        validTo: '2024-12-31'
      };
      
      setRateData(mockData);
      
      // 设置按箱型计费数据
      setContainerRateList([
        {
          key: 1,
          feeName: '港前运费',
          currency: 'CNY',
          '20gp': '800',
          '40gp': '1200',
          '40hc': '1300',
          '45hc': '1500',
          '40nor': '1250',
          specialNote: '基础运输费用'
        },
        {
          key: 2,
          feeName: '装卸费',
          currency: 'CNY',
          '20gp': '180',
          '40gp': '320',
          '40hc': '350',
          '45hc': '380',
          '40nor': '320',
          specialNote: '码头装卸操作费'
        },
        {
          key: 3,
          feeName: '操作费',
          currency: 'CNY',
          '20gp': '120',
          '40gp': '200',
          '40hc': '220',
          '45hc': '250',
          '40nor': '200',
          specialNote: '港前操作服务费'
        },
        {
          key: 4,
          feeName: '报关费',
          currency: 'CNY',
          '20gp': '150',
          '40gp': '150',
          '40hc': '150',
          '45hc': '150',
          '40nor': '150',
          specialNote: '出口报关费用'
        },
        {
          key: 5,
          feeName: '查验费',
          currency: 'CNY',
          '20gp': '300',
          '40gp': '450',
          '40hc': '450',
          '45hc': '500',
          '40nor': '450',
          specialNote: '海关查验时收取'
        }
      ]);
      
      // 设置非按箱型计费数据
      setNonContainerRateList([
        {
          key: 1,
          feeName: '订舱费',
          currency: 'CNY',
          unit: '票',
          price: '120',
          specialNote: '每票订舱手续费'
        },
        {
          key: 2,
          feeName: '单证费',
          currency: 'CNY',
          unit: '票',
          price: '80',
          specialNote: '单据制作费用'
        },
        {
          key: 3,
          feeName: '铅封费',
          currency: 'CNY',
          unit: '个',
          price: '25',
          specialNote: '每个铅封收取'
        },
        {
          key: 4,
          feeName: '监管费',
          currency: 'CNY',
          unit: '票',
          price: '150',
          specialNote: '监管查验费用'
        },
        {
          key: 5,
          feeName: '预录费',
          currency: 'CNY',
          unit: '票',
          price: '100',
          specialNote: '海关预录入费'
        }
      ]);
      
    } catch (error) {
      console.error('加载运价数据失败:', error);
    } finally {
      
    }
  };

  // 返回列表页
  const handleGoBack = () => {
    navigate('/controltower-client/saas/rate-query');
  };

  // 导出运价
  const handleExportRate = () => {
    setExportModalVisible(true);
  };

  // 生成快捷报价文本
  const generateQuotationText = () => {
    const selectedContainers = containerSelections
      .filter(item => item.count > 0)
      .map(item => `${item.count}*${item.type.toUpperCase()}`)
      .join(' + ');

    if (!selectedContainers || containerSelections.length === 0) {
      Message.warning('请先选择箱型箱量');
      return;
    }

    // 计算总价格
    let totalContainerFees = 0;
    let totalOtherFees = 0;

    containerSelections.forEach(selection => {
      if (selection.count > 0) {
        containerRateList.forEach(item => {
          if (item[selection.type as keyof ContainerRateItem]) {
            totalContainerFees += parseInt(item[selection.type as keyof ContainerRateItem] as string || '0') * selection.count;
          }
        });
      }
    });

    // 非按箱型计费
    nonContainerRateList.forEach(item => {
      totalOtherFees += parseInt(item.price || '0');
    });

    const totalCost = totalContainerFees + totalOtherFees;

    const text = `
【港前运价报价】

运价编号：${rateData.code}
运价类型：${rateData.rateType}
起运地：${rateData.origin}
起运港：${rateData.destination}
码头：${rateData.terminal}
供应商：${rateData.vendor}
箱型箱量：${selectedContainers}

价格明细：
- 港前运输费：¥ ${totalContainerFees}
- 其他费用：¥ ${totalOtherFees}
总计：¥ ${totalCost}

有效期：${rateData.validDateRange}
备注：${rateData.remark}

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
    const selectedContainers = containerSelections.filter(item => item.count > 0);

    if (selectedContainers.length === 0) {
      Message.warning('请先选择箱型箱量');
      return;
    }

    setExportModalVisible(false);
    setPdfPreviewVisible(true);
  };

  // 添加新的箱型选择
  const addContainerSelection = () => {
    const newId = Math.max(...containerSelections.map(item => item.id)) + 1;
    setContainerSelections([...containerSelections, { id: newId, type: '20gp', count: 1 }]);
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
    return Object.entries(boxTypeVisibility)
      .filter(([_, visible]) => visible)
      .map(([type, _]) => ({ label: type.toUpperCase(), value: type }));
  };

  return (
    <div>
      {/* 页面头部 */}
      <Card style={{ marginBottom: '20px' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Title heading={4} style={{ margin: 0 }}>查看港前运价</Title>
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
            { label: '港前运价编号', value: rateData.code },
            { label: '运价类型', value: rateData.rateType },
            { label: '支线类型', value: rateData.sublineType || '-' },
            { label: '状态', value: rateData.status },
          ]}
        />
      </Card>

      {/* 起运信息区域 */}
      <Card title="起运信息" className="mb-6">
        <Descriptions 
          column={3}
          layout="vertical"
          data={[
            { label: '起运地', value: rateData.origin },
            { label: '起运港', value: rateData.destination },
            { label: '码头', value: rateData.terminal },
            { label: '供应商', value: rateData.vendor },
          ]}
        />
      </Card>

      {/* 有效期设置 */}
      <Card title="有效期设置" className="mb-6">
        <Descriptions 
          column={1}
          layout="vertical"
          data={[
            { label: '有效期', value: rateData.validDateRange },
          ]}
        />
      </Card>

      {/* 运价明细区域 */}
      <Card title="运价明细" className="mb-6">
        <div className="mb-4">
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
              {
                title: '20GP',
                dataIndex: '20gp',
                width: 120,
                render: (value: string) => value ? `¥ ${value}` : '-'
              },
              {
                title: '40GP',
                dataIndex: '40gp',
                width: 120,
                render: (value: string) => value ? `¥ ${value}` : '-'
              },
              {
                title: '40HC',
                dataIndex: '40hc',
                width: 120,
                render: (value: string) => value ? `¥ ${value}` : '-'
              },
              {
                title: '40NOR',
                dataIndex: '40nor',
                width: 120,
                render: (value: string) => value ? `¥ ${value}` : '-'
              },
              {
                title: '45HC',
                dataIndex: '45hc',
                width: 120,
                render: (value: string) => value ? `¥ ${value}` : '-'
              },
              {
                title: '特殊备注',
                dataIndex: 'specialNote',
                width: 200,
              }
            ]}
            data={[
              {
                key: 1,
                feeName: '港前运费',
                currency: 'CNY',
                '20gp': rateData['20gp'],
                '40gp': rateData['40gp'],
                '40hc': rateData['40hc'],
                '40nor': rateData['40nor'],
                '45hc': rateData['45hc'],
                specialNote: '基础运输费用'
              },
              {
                key: 2,
                feeName: '装卸费',
                currency: 'CNY',
                '20gp': '180',
                '40gp': '320',
                '40hc': '350',
                '40nor': '320',
                '45hc': '380',
                specialNote: '码头装卸操作费'
              },
              {
                key: 3,
                feeName: '操作费',
                currency: 'CNY',
                '20gp': '120',
                '40gp': '200',
                '40hc': '220',
                '40nor': '200',
                '45hc': '250',
                specialNote: '港前操作服务费'
              },
              {
                key: 4,
                feeName: '报关费',
                currency: 'CNY',
                '20gp': '150',
                '40gp': '150',
                '40hc': '150',
                '40nor': '150',
                '45hc': '150',
                specialNote: '出口报关费用'
              },
              {
                key: 5,
                feeName: '查验费',
                currency: 'CNY',
                '20gp': '300',
                '40gp': '450',
                '40hc': '450',
                '40nor': '450',
                '45hc': '500',
                specialNote: '海关查验时收取'
              }
            ]}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </div>

        {/* 非按箱型计费 */}
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
                render: (value: string, record: any) => value ? `${record.currency} ${value}` : '-'
              },
              {
                title: '特殊备注',
                dataIndex: 'specialNote',
                width: 250,
              }
            ]}
            data={[
              {
                key: 1,
                feeName: '订舱费',
                currency: 'CNY',
                unit: '票',
                price: '120',
                specialNote: '每票订舱手续费'
              },
              {
                key: 2,
                feeName: '单证费',
                currency: 'CNY',
                unit: '票',
                price: '80',
                specialNote: '单据制作费用'
              },
              {
                key: 3,
                feeName: '铅封费',
                currency: 'CNY',
                unit: '个',
                price: '25',
                specialNote: '每个铅封收取'
              },
              {
                key: 4,
                feeName: '监管费',
                currency: 'CNY',
                unit: '票',
                price: '150',
                specialNote: '监管查验费用'
              },
              {
                key: 5,
                feeName: '预录费',
                currency: 'CNY',
                unit: '票',
                price: '100',
                specialNote: '海关预录入费'
              }
            ]}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </Card>

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
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">选择箱型箱量</h4>
              <Button 
                type="primary" 
                size="small"
                onClick={addContainerSelection}
              >
                + 添加箱型
              </Button>
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
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
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
        title="港前运价报价单预览"
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
              <h1 className="text-2xl font-bold mb-2">港前运价报价单</h1>
              <p className="text-gray-600">Quotation for Precarriage Rate</p>
            </div>

            {/* 基本信息 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">基本信息</h3>
              <Row gutter={[16, 8]}>
                <Col span={8}>运价编号：{rateData.code}</Col>
                <Col span={8}>运价类型：{rateData.rateType}</Col>
                <Col span={8}>支线类型：{rateData.sublineType || '-'}</Col>
                <Col span={8}>起运地：{rateData.origin}</Col>
                <Col span={8}>起运港：{rateData.destination}</Col>
                <Col span={8}>码头：{rateData.terminal}</Col>
                <Col span={8}>供应商：{rateData.vendor}</Col>
                <Col span={8}>状态：{rateData.status}</Col>
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

            {/* 港前运输费明细 */}
            <div className="mb-6">
              <div className="bg-blue-50 px-4 py-2 mb-3 rounded">
                <h3 className="text-lg font-semibold text-blue-800">港前运输费明细</h3>
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
                  {containerRateList.map((item, index) => (
                    <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-3 font-medium">{item.feeName}</td>
                      <td className="border border-gray-300 p-3 text-center">{item.currency}</td>
                      {containerSelections
                        .filter(selection => selection.count > 0)
                        .map(selection => {
                          const unitPrice = item[selection.type as keyof ContainerRateItem] as string;
                          const totalPrice = unitPrice ? parseInt(unitPrice) * selection.count : 0;
                          return (
                            <td key={selection.id} className="border border-gray-300 p-3 text-center">
                              {unitPrice ? (
                                <div>
                                  <div className="text-sm text-gray-600">¥ {unitPrice} × {selection.count}</div>
                                  <div className="font-medium">¥ {totalPrice}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}
                      <td className="border border-gray-300 p-3 text-center font-bold text-blue-700 bg-blue-50">
                        ¥ {containerSelections
                          .filter(selection => selection.count > 0)
                          .reduce((sum, selection) => {
                            const price = item[selection.type as keyof ContainerRateItem] as string;
                            return sum + (price ? parseInt(price) * selection.count : 0);
                          }, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 其他费用明细 */}
            {nonContainerRateList.length > 0 && (
              <div className="mb-6">
                <div className="bg-green-50 px-4 py-2 mb-3 rounded">
                  <h3 className="text-lg font-semibold text-green-800">其他费用明细</h3>
                </div>
                <table className="w-full border-collapse border border-gray-300 shadow-sm">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="border border-gray-300 p-3 text-left font-semibold">费用项目</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">币种</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">计费单位</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">单价</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nonContainerRateList.map((item, index) => (
                      <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-3 font-medium">{item.feeName}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.currency}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.unit}</td>
                        <td className="border border-gray-300 p-3 text-center font-medium">
                          ¥ {item.price}
                        </td>
                        <td className="border border-gray-300 p-3 text-sm text-gray-600">{item.specialNote}</td>
                      </tr>
                    ))}
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
                  <Col span={12}>
                    <div className="text-lg">
                      <span className="text-gray-600">港前运输费总计：</span>
                      <span className="font-bold text-blue-700">
                        ¥ {containerRateList.reduce((total, item) => {
                          return total + containerSelections
                            .filter(selection => selection.count > 0)
                            .reduce((sum, selection) => {
                              const price = item[selection.type as keyof ContainerRateItem] as string;
                              return sum + (price ? parseInt(price) * selection.count : 0);
                            }, 0);
                        }, 0)}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-lg">
                      <span className="text-gray-600">其他费用总计：</span>
                      <span className="font-bold text-green-700">
                        ¥ {nonContainerRateList.reduce((sum, item) => sum + parseInt(item.price || '0'), 0)}
                      </span>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="text-xl pt-3 border-t border-gray-300 mt-3">
                      <span className="text-gray-600">报价总计：</span>
                      <span className="font-bold text-2xl text-red-600">
                        ¥ {containerRateList.reduce((total, item) => {
                          return total + containerSelections
                            .filter(selection => selection.count > 0)
                            .reduce((sum, selection) => {
                              const price = item[selection.type as keyof ContainerRateItem] as string;
                              return sum + (price ? parseInt(price) * selection.count : 0);
                            }, 0);
                        }, 0) + nonContainerRateList.reduce((sum, item) => sum + parseInt(item.price || '0'), 0)}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            {/* 其他信息 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">其他信息</h3>
              <Row gutter={[16, 8]}>
                <Col span={24}>有效期：{rateData.validDateRange}</Col>
                {rateData.remark && <Col span={24}>备注：{rateData.remark}</Col>}
              </Row>
            </div>

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
    </div>
  );
};

export default ViewPrecarriageRate; 