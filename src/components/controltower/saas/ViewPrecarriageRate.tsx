import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Breadcrumb, 
  Typography, 
  Button, 
  Space, 
  Descriptions,
  Table,
  Tag,
  Modal,
  InputNumber,
  Select,
  Input,
  Message
} from '@arco-design/web-react';
import { IconArrowLeft, IconDownload, IconCopy, IconPrinter } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import './CreateFclInquiry.css'; // 复用已有的CSS

const { Title } = Typography;

// 区域项接口定义
interface AreaItem {
  key: number;
  province: string;
  city: string;
  district: string;
  street: string;
}

// 集装箱运价项目接口
interface RateItem {
  key: number;
  feeName: string;
  currency: string;
  '20gp': string;
  '40gp': string;
  '40hc': string;
  '45hc': string;
  '40nor': string;
  specialNote: string; // 添加特殊备注字段
}

// 非按箱型计费项目接口
interface NonContainerRateItem {
  key: number;
  feeName: string;
  currency: string;
  unit: string; // 计费单位
  price: string; // 单价
  specialNote: string;
}

// 表单状态接口
interface FormStateType {
  code: string;
  rateType: string;
  sublineType: string;
  originDetail: string;
  destination: string;
  terminal: string;
  vendor: string;
  etd?: string;
  eta?: string;
  validDateRange: string[];
  remark: string;
  status: string;
}

/**
 * 港前运价查看组件
 */
const ViewPrecarriageRate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // 区域选择相关状态
  const [areaList, setAreaList] = useState<AreaItem[]>([]);
  
  // 集装箱运价列表状态
  const [rateList, setRateList] = useState<RateItem[]>([]);
  
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
  
  // 保存表单状态
  const [formState, setFormState] = useState<FormStateType>({
    code: '',
    rateType: '',
    sublineType: '',
    originDetail: '',
    destination: '',
    terminal: '',
    vendor: '',
    validDateRange: [],
    remark: '',
    status: '正常'
  });

  // 返回运价维护列表页面
  const handleGoBack = () => {
    navigate('/controltower/saas/fcl-rates');
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
        rateList.forEach(item => {
          if (item[selection.type as keyof RateItem]) {
            totalContainerFees += parseInt(item[selection.type as keyof RateItem] as string || '0') * selection.count;
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

运价编号：${formState.code}
运价类型：${formState.rateType}
起运地：${formState.originDetail}
起运港：${formState.destination}
码头：${formState.terminal}
供应商：${formState.vendor}
箱型箱量：${selectedContainers}

价格明细：
- 港前运输费：¥ ${totalContainerFees}
- 其他费用：¥ ${totalOtherFees}
总计：¥ ${totalCost}

有效期：${formState.validDateRange.join(' 至 ')}
备注：${formState.remark}

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

  // 模拟加载数据
  useEffect(() => {
    // 模拟异步获取数据
    setTimeout(() => {
      console.log('Loading precarriage rate with ID:', id);
      
      // 模拟从服务器获取的数据
      const mockData = {
        code: `PCR${id || '2024050001'}`,
        rateType: '直拖',
        sublineType: '',
        originDetail: '萧山区宁围街道花城路与金城路交叉口',
        destination: 'CNSHA | SHANGHAI',
        terminal: '洋山',
        vendor: '安吉物流',
        validDateRange: ['2024-05-01', '2024-12-31'],
        remark: '此运价适用于杭州市萧山区及周边地区的工厂提货，有效期内保证价格稳定。',
        status: '正常',
        areas: [
          {
            key: 1,
            province: '浙江省',
            city: '杭州市',
            district: '萧山区',
            street: '宁围街道'
          },
          {
            key: 2,
            province: '浙江省',
            city: '杭州市',
            district: '萧山区',
            street: '北干街道'
          }
        ],
        containerRates: [
          {
            key: 1,
            feeName: '支线拖车费',
            currency: 'CNY',
            '20gp': '800',
            '40gp': '1200',
            '40hc': '1300',
            '45hc': '1500',
            '40nor': '1250',
            specialNote: '含上门提货费用'
          },
          {
            key: 2,
            feeName: '支线订舱费',
            currency: 'CNY',
            '20gp': '150',
            '40gp': '150',
            '40hc': '150',
            '45hc': '180',
            '40nor': '150',
            specialNote: ''
          }
        ],
        nonContainerRates: [
          {
            key: 1,
            feeName: '报关费',
            currency: 'CNY',
            unit: '票',
            price: '350',
            specialNote: '含商检'
          },
          {
            key: 2,
            feeName: '压夜费',
            currency: 'CNY',
            unit: '天',
            price: '200',
            specialNote: '工作日18:00后加收'
          }
        ]
      };

      // 更新状态
      setFormState({
        ...formState,
        code: mockData.code,
        rateType: mockData.rateType,
        sublineType: mockData.sublineType,
        originDetail: mockData.originDetail,
        destination: mockData.destination,
        terminal: mockData.terminal,
        vendor: mockData.vendor,
        validDateRange: mockData.validDateRange,
        remark: mockData.remark,
        status: mockData.status
      });

      setAreaList(mockData.areas);
      setRateList(mockData.containerRates);
      setNonContainerRateList(mockData.nonContainerRates);
    }, 500);
  }, [id]);

  // 获取状态标签样式
  const getStatusTag = (status: string) => {
    let color = 'green';
    if (status === '过期') color = 'gray';
    if (status === '下架') color = 'red';
    return <Tag color={color}>{status}</Tag>;
  };

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="2" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>运价管理</Breadcrumb.Item>
          <Breadcrumb.Item>运价维护</Breadcrumb.Item>
          <Breadcrumb.Item>查看港前运价</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
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
            { label: '港前运价编号', value: formState.code },
            { label: '运价类型', value: formState.rateType },
            { label: '支线类型', value: formState.sublineType || '-' },
            { label: '状态', value: getStatusTag(formState.status) },
          ]}
        />
      </Card>

      {/* 起运信息区域 */}
      <Card title="起运信息" className="mb-6">
        <Descriptions 
          column={3}
          layout="vertical"
          data={[
            { label: '起运地区域', value: areaList.map(area => `${area.province} ${area.city} ${area.district} ${area.street}`).join('；') || '-' },
            { label: '详细地址', value: formState.originDetail },
            { label: '起运港', value: formState.destination },
            { label: '码头', value: formState.terminal },
            { label: '供应商', value: formState.vendor },
            { label: 'ETD', value: formState.etd || '-' },
            { label: 'ETA', value: formState.eta || '-' },
            { label: '备注', value: formState.remark },
          ]}
        />
      </Card>

      {/* 有效期设置 */}
      <Card title="有效期设置" className="mb-6">
        <Descriptions 
          column={1}
          layout="vertical"
          data={[
            { label: '有效期', value: formState.validDateRange.join(' 至 ') },
          ]}
        />
      </Card>
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
                  data={rateList}
                  pagination={false}
                  rowKey="key"
                />
                </div>
                
                <div>
          <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">非按箱型计费</div>
                  
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
                        title: '计费单位',
                        dataIndex: 'unit',
                        width: 120,
                      },
                      {
                        title: '单价',
                        dataIndex: 'price',
                        width: 120,
                render: (value: string) => value ? `¥ ${value}` : '-'
                      },
                      {
                        title: '特殊备注',
                        dataIndex: 'specialNote',
                width: 200,
                      }
                    ]}
                    data={nonContainerRateList}
                    pagination={false}
                    rowKey="key"
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
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">选择箱型箱量：</div>
            {containerSelections.map((selection) => (
              <div key={selection.id} className="flex items-center gap-4 mb-3">
                <Select
                  style={{ width: 120 }}
                  value={selection.type}
                  onChange={(value) => updateContainerSelection(selection.id, 'type', value)}
                >
                  {getAvailableContainerTypes().map(type => (
                    <Select.Option key={type.value} value={type.value}>{type.label}</Select.Option>
                  ))}
                </Select>
                <InputNumber
                  style={{ width: 100 }}
                  min={0}
                  value={selection.count}
                  onChange={(value) => updateContainerSelection(selection.id, 'count', value || 0)}
                />
                <span className="text-sm text-gray-500">个</span>
                {containerSelections.length > 1 && (
                  <Button 
                    size="mini" 
                    type="text" 
                    status="danger"
                    onClick={() => removeContainerSelection(selection.id)}
                  >
                    删除
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="text" 
              size="mini" 
              onClick={addContainerSelection}
              className="text-blue-600"
            >
              + 添加箱型
            </Button>
          </div>
          
          <div className="flex gap-4 pt-4 border-t">
            <Button type="outline" onClick={generateQuotationText} icon={<IconCopy />}>
              快捷报价
            </Button>
            <Button type="primary" onClick={generatePDF} icon={<IconPrinter />}>
              PDF 报价单
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
          <div className="flex justify-end gap-2">
            <Button onClick={() => setCopyTextModalVisible(false)}>关闭</Button>
            <Button type="primary" onClick={copyToClipboard} icon={<IconCopy />}>
              复制到剪贴板
            </Button>
          </div>
        }
        style={{ width: 600 }}
      >
        <Input.TextArea
          value={quotationText}
          readOnly
          autoSize={{ minRows: 15, maxRows: 20 }}
          className="font-mono text-sm"
        />
      </Modal>

      {/* PDF预览弹窗 */}
      <Modal
        title="PDF 报价单预览"
        visible={pdfPreviewVisible}
        onCancel={() => setPdfPreviewVisible(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setPdfPreviewVisible(false)}>关闭</Button>
            <Button type="primary" icon={<IconDownload />}>
              下载 PDF
            </Button>
          </div>
        }
        style={{ width: 800, top: 20 }}
      >
        <div className="pdf-preview bg-white p-6 border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">港前运价报价单</h2>
            <div className="text-sm text-gray-600 mt-2">运价编号：{formState.code}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <div className="font-medium text-gray-700 mb-1">基本信息</div>
              <div>运价类型：{formState.rateType}</div>
              <div>起运地：{formState.originDetail}</div>
              <div>起运港：{formState.destination}</div>
              <div>码头：{formState.terminal}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-1">服务信息</div>
              <div>供应商：{formState.vendor}</div>
              <div>有效期：{formState.validDateRange.join(' 至 ')}</div>
              <div>状态：{formState.status}</div>
            </div>
          </div>

          {/* 显示选中的箱型数量 */}
          <div className="mb-4">
            <div className="font-medium text-gray-700 mb-2">箱型箱量</div>
            <div className="text-sm">
              {containerSelections
                .filter(item => item.count > 0)
                .map(item => `${item.count} × ${item.type.toUpperCase()}`)
                .join('，')
              }
            </div>
          </div>

          {/* 港前运输费明细 */}
          {containerSelections.filter(item => item.count > 0).map((selection, selectionIndex) => (
            <div key={selectionIndex} className="mb-6">
              <div className="bg-blue-50 px-3 py-2 rounded-lg border-l-4 border-blue-500 mb-3">
                <h4 className="font-bold text-blue-800 text-sm">
                  {selection.type.toUpperCase()} × {selection.count} 港前运输费明细
                </h4>
              </div>
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold">费用名称</th>
                      <th className="px-3 py-2 text-center font-bold">单价</th>
                      <th className="px-3 py-2 text-center font-bold">数量</th>
                      <th className="px-3 py-2 text-right font-bold">小计</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateList.map((item, index) => {
                      const unitPrice = parseInt(item[selection.type as keyof RateItem] as string || '0');
                      const total = unitPrice * selection.count;
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-blue-25' : 'bg-white'}>
                          <td className="px-3 py-2 font-medium">{item.feeName}</td>
                          <td className="px-3 py-2 text-center">¥ {unitPrice}</td>
                          <td className="px-3 py-2 text-center">{selection.count}</td>
                          <td className="px-3 py-2 text-right font-bold text-blue-600">¥ {total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* 分类小计 */}
              <div className="mt-2 text-right">
                <span className="inline-block bg-blue-100 px-3 py-1 rounded text-sm font-bold text-blue-800">
                  港前运输费小计：¥ {rateList.reduce((sum, item) => {
                    const unitPrice = parseInt(item[selection.type as keyof RateItem] as string || '0');
                    return sum + (unitPrice * selection.count);
                  }, 0)}
                </span>
              </div>
            </div>
          ))}

          {/* 其他费用明细 */}
          <div className="mb-6">
            <div className="bg-green-50 px-3 py-2 rounded-lg border-l-4 border-green-500 mb-3">
              <h4 className="font-bold text-green-800 text-sm">其他费用明细</h4>
            </div>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-green-500 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold">费用名称</th>
                    <th className="px-3 py-2 text-center font-bold">单价</th>
                    <th className="px-3 py-2 text-center font-bold">单位</th>
                    <th className="px-3 py-2 text-right font-bold">小计</th>
                  </tr>
                </thead>
                <tbody>
                  {nonContainerRateList.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-green-25' : 'bg-white'}>
                      <td className="px-3 py-2 font-medium">{item.feeName}</td>
                      <td className="px-3 py-2 text-center">¥ {item.price}</td>
                      <td className="px-3 py-2 text-center">{item.unit}</td>
                      <td className="px-3 py-2 text-right font-bold text-green-600">¥ {item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分类小计 */}
            <div className="mt-2 text-right">
              <span className="inline-block bg-green-100 px-3 py-1 rounded text-sm font-bold text-green-800">
                其他费用小计：¥ {nonContainerRateList.reduce((sum, item) => sum + parseInt(item.price || '0'), 0)}
              </span>
            </div>
          </div>

          {/* 费用汇总 */}
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-600">港前运输费总计：</div>
                  <div className="text-blue-600 font-bold text-lg">
                    ¥ {containerSelections.reduce((total, selection) => {
                      if (selection.count > 0) {
                        const selectionTotal = rateList.reduce((sum, item) => {
                          const unitPrice = parseInt(item[selection.type as keyof RateItem] as string || '0');
                          return sum + (unitPrice * selection.count);
                        }, 0);
                        return total + selectionTotal;
                      }
                      return total;
                    }, 0)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">其他费用总计：</div>
                  <div className="text-green-600 font-bold text-lg">
                    ¥ {nonContainerRateList.reduce((sum, item) => sum + parseInt(item.price || '0'), 0)}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-300 pt-3 text-center">
                <div className="text-gray-800 text-lg font-bold">
                  总计：
                  <span className="text-red-600 text-xl ml-2">
                    ¥ {
                      containerSelections.reduce((total, selection) => {
                        if (selection.count > 0) {
                          const selectionTotal = rateList.reduce((sum, item) => {
                            const unitPrice = parseInt(item[selection.type as keyof RateItem] as string || '0');
                            return sum + (unitPrice * selection.count);
                          }, 0);
                          return total + selectionTotal;
                        }
                        return total;
                      }, 0) + nonContainerRateList.reduce((sum, item) => sum + parseInt(item.price || '0'), 0)
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500 border-t pt-4">
            <div>备注：{formState.remark}</div>
            <div className="mt-2">
              <div>※ 以上价格仅供参考，实际价格以正式合同为准</div>
              <div>※ 如有任何疑问，请联系我们的客服团队</div>
            </div>
          </div>
        </div>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default ViewPrecarriageRate; 