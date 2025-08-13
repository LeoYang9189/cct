import React, { useState } from 'react';
import { Card, Typography, Space, Table, Tag, Input, Tabs, Button } from '@arco-design/web-react';
import { IconArrowUp } from '@arco-design/web-react/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip, faTruck, faFileInvoice, faMoneyBillWave, faAnchor, faWarehouse, faFileAlt, faWeightHanging, faFileContract, faReceipt, faFileInvoiceDollar, faShippingFast, faClipboardList, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [currentTask, setCurrentTask] = useState('报价待确认');

  // 任务卡片数据
  const taskCards = [
    { title: '报价待确认', count: 12, color: 'blue' },
    { title: '待提交订舱', count: 8, color: 'green' },
    { title: '待提交报关资料', count: 15, color: 'orange' },
    { title: '待提交VGM', count: 6, color: 'purple' },
    { title: '待提交反恐舱单', count: 4, color: 'red' },
    { title: '待提交预配舱单', count: 9, color: 'cyan' },
    { title: '待提交提单补料', count: 18, color: 'blue' },
    { title: '待确认提单格式件', count: 7, color: 'green' },
    { title: '待确认账单', count: 11, color: 'orange' },
    { title: '待确认发票', count: 5, color: 'purple' },
    { title: '待上传水单', count: 3, color: 'red' }
  ];

  // 根据当前选择的任务获取数据
  const getTaskData = () => {
    // 基础数据模板
    const baseData = [
      {
        key: '1',
        businessId: 'CD250301758',
        departurePort: 'SHANGHAI',
        etd: '2023-05-02',
        eta: '2023-05-20',
        destinationPort: 'YOKOHAMA',
        vesselName: 'GLORY SHENZHEN',
        voyage: 'V.2519E',
        containerNo: 'TWCU2190679',
        createdDate: '2023-04-15',
      },
      {
        key: '2',
        businessId: 'CD250401843',
        departurePort: 'SHANGHAI',
        etd: '2023-04-30',
        eta: '2023-05-15',
        destinationPort: 'PORT KELANG',
        vesselName: 'WAN HAI 522',
        voyage: 'V.W030',
        containerNo: 'SEGU4804325',
        createdDate: '2023-04-16',
      },
      {
        key: '3',
        businessId: 'CD250402017',
        departurePort: 'SHANGHAI',
        etd: '2023-05-05',
        eta: '2023-05-25',
        destinationPort: 'CHENNAI',
        vesselName: 'WAN HAI 510',
        voyage: 'V.W188',
        containerNo: 'CSNU6606947',
        createdDate: '2023-04-17',
      },
      {
        key: '4',
        businessId: 'CD250402024',
        departurePort: 'SHANGHAI',
        etd: '2023-05-05',
        eta: '2023-05-25',
        destinationPort: 'CHENNAI',
        vesselName: 'WAN HAI 510',
        voyage: 'V.W188',
        containerNo: 'CSNU6606947',
        createdDate: '2023-04-17',
      },
      {
        key: '5',
        businessId: 'CD250402535',
        departurePort: 'SHANGHAI',
        etd: '2023-05-02',
        eta: '2023-05-18',
        destinationPort: 'INCHEON',
        vesselName: 'CONCERTO',
        voyage: 'V.531E',
        containerNo: 'CSLU6081466',
        createdDate: '2023-04-21',
      }
    ];

    // 根据任务类型返回不同的数量
    const taskCardObj = taskCards.find(card => card.title === currentTask);
    return {
      total: taskCardObj ? taskCardObj.count : 0,
      data: baseData
    };
  };

  // 获取当前任务按钮名称
  const getTaskButtonText = () => {
    switch(currentTask) {
      case '报价待确认': return '确认';
      case '待提交订舱': return '提交';
      case '待提交报关资料': return '上传';
      case '待提交VGM': return '提交';
      case '待提交反恐舱单': return '提交';
      case '待提交预配舱单': return '提交';
      case '待提交提单补料': return '补料';
      case '待确认提单格式件': return '确认';
      case '待确认账单': return '确认';
      case '待确认发票': return '确认';
      case '待上传水单': return '上传';
      default: return '处理';
    }
  };

  const taskData = getTaskData();

  return (
    <>
      <div className="page-header mb-3">
        <Title heading={4}>仪表盘</Title>
      </div>
      
      <div className="grid grid-cols-5 gap-4 w-full">
        <Card className="stat-card" bordered={false}>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="text-gray-500 text-sm">总订单数</div>
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold">4,823</span>
              </div>
              <div className="flex items-center mt-3 text-xs">
                <span className="text-gray-500">同比上周</span>
                <span className="text-green-500 ml-2 flex items-center">
                  <IconArrowUp className="mr-1" /> 12.5%
                </span>
              </div>
            </div>
            <div className="w-24 h-24">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#165DFF" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#165DFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,70 C10,60 20,40 30,50 C40,60 50,30 60,35 C70,40 80,25 90,30 C95,35 98,25 100,30"
                  fill="none" 
                  stroke="#165DFF" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path 
                  d="M0,70 C10,60 20,40 30,50 C40,60 50,30 60,35 C70,40 80,25 90,30 C95,35 98,25 100,30 L100,100 L0,100 Z"
                  fill="url(#gradient1)" 
                />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card" bordered={false}>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="text-gray-500 text-sm">待履约</div>
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold">426</span>
              </div>
              <div className="flex items-center mt-3 text-xs">
                <span className="text-gray-500">较昨日</span>
                <span className="text-orange-500 ml-2 flex items-center">
                  <IconArrowUp className="mr-1" /> 5.2%
                </span>
              </div>
            </div>
            <div className="w-24 h-24">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <rect 
                    key={i}
                    x={i * 18 + 5} 
                    y={60 - Math.abs(Math.sin(i * 0.8) * 40)}
                    width="12" 
                    height={Math.abs(Math.sin(i * 0.8) * 40) + 5}
                    rx="4"
                    ry="4"
                    fill="#FF7D00"
                    opacity={0.8 - i * 0.05}
                  />
                ))}
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card" bordered={false}>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="text-gray-500 text-sm">履约中</div>
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold">1,252</span>
              </div>
              <div className="flex items-center mt-3 text-xs">
                <span className="text-gray-500">准班率</span>
                <span className="text-blue-500 ml-2">98.7%</span>
              </div>
            </div>
            <div className="w-24 h-24 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#f0f2f5" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f2f5" strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#722ED1" 
                  strokeWidth="8" 
                  strokeDasharray="251.3"
                  strokeDashoffset="3.3"
                  strokeLinecap="round"
                />
                <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="600" fill="#722ED1">98.7%</text>
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card" bordered={false}>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="text-gray-500 text-sm">已完结</div>
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold">2,952</span>
              </div>
              <div className="flex items-center mt-3 text-xs">
                <span className="text-gray-500">满意度</span>
                <span className="text-green-500 ml-2">96.3%</span>
              </div>
            </div>
            <div className="w-24 h-24 flex items-center justify-center relative">
              <svg width="100%" height="12" viewBox="0 0 100 12">
                <defs>
                  <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00B42A" />
                    <stop offset="100%" stopColor="#14C9C9" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100" height="12" rx="6" ry="6" fill="#f0f2f5" />
                <rect x="0" y="0" width="96.3" height="12" rx="6" ry="6" fill="url(#gradient4)" />
              </svg>
              <div className="absolute top-0 mt-4 text-sm font-medium text-green-600">96.3%</div>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card" bordered={false}>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="text-gray-500 text-sm">已关闭</div>
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-bold">193</span>
              </div>
              <div className="flex items-center mt-3 text-xs">
                <span className="text-gray-500">关闭率</span>
                <span className="text-gray-500 ml-2">4.0%</span>
              </div>
            </div>
            <div className="w-24 h-24">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <defs>
                  <clipPath id="wave-clip">
                    <rect x="0" y="0" width="100" height="100" />
                  </clipPath>
                </defs>
                <path 
                  d="M 0 50 C 20 30, 30 70, 50 50 C 70 30, 80 70, 100 50 L 100 100 L 0 100 Z" 
                  fill="#86909C" 
                  opacity="0.2"
                  clipPath="url(#wave-clip)"
                />
                <path 
                  d="M 0 60 C 20 40, 30 80, 50 60 C 70 40, 80 80, 100 60 L 100 100 L 0 100 Z" 
                  fill="#86909C" 
                  opacity="0.3"
                  clipPath="url(#wave-clip)"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <Card title="订单跟踪" bordered={false} className="shadow-sm">
          <div className="mb-4 flex">
            <Input.Search
              placeholder="请输入订单号/报价单号/Job号/MBL号/HBL号查询"
              style={{ width: '500px' }}
              searchButton={true}
              size="default"
            />
          </div>
          
          <Tabs defaultActiveTab="business">
            <Tabs.TabPane key="business" title="业务节点">
              <div className="tracking-nodes mt-4 relative overflow-x-auto pb-4">
                <div className="tracking-flow flex min-w-max">
                  <div className="tracking-line absolute left-0 right-0 top-[24px] h-[2px] bg-gray-200 z-0"></div>
                  
                  {/* 生成订单节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500" />生成订单
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已完成</Tag>
                      <div className="text-gray-400 text-xs">2023-07-10</div>
                    </div>
                  </div>
                  
                  {/* 运价节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-blue-500" />运价
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已报价</Tag>
                      <div className="text-gray-400 text-xs">2023-07-10</div>
                    </div>
                  </div>
                  
                  {/* 订舱节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faAnchor} className="mr-2 text-blue-500" />订舱
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">舱位确认</Tag>
                      <div className="text-gray-400 text-xs">2023-07-11</div>
                    </div>
                  </div>
                  
                  {/* 拖车节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faTruck} className="mr-2 text-blue-500" />拖车
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已装箱</Tag>
                      <div className="text-gray-400 text-xs">2023-07-12</div>
                    </div>
                  </div>
                  
                  {/* 仓库节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faWarehouse} className="mr-2 text-blue-500" />仓库
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已进仓</Tag>
                      <div className="text-gray-400 text-xs">2023-07-13</div>
                    </div>
                  </div>
                  
                  {/* 报关节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faFileContract} className="mr-2 text-orange-500" />报关
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-orange-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-orange-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="orange" className="mb-2 mx-auto block w-24">已报关</Tag>
                      <div className="text-gray-400 text-xs">2023-07-14</div>
                    </div>
                  </div>
                  
                  {/* VGM节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faWeightHanging} className="mr-2 text-gray-400" />VGM
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待提交</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>
                  
                  {/* 提单补料节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-gray-400" />提单补料
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待提交</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>

                  {/* 账单节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2 text-gray-400" />账单
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待生成</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>
                  
                  {/* 发票节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faFileInvoice} className="mr-2 text-gray-400" />发票
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待开票</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>
                  
                  {/* 水单节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faReceipt} className="mr-2 text-gray-400" />水单
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待上传</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>
                  
                  {/* 提单节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faShippingFast} className="mr-2 text-gray-400" />提单
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待签单</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane key="shipping" title="运踪节点">
              <div className="tracking-nodes mt-4 relative overflow-x-auto pb-4">
                <div className="tracking-flow flex min-w-max">
                  <div className="tracking-line absolute left-0 right-0 top-[24px] h-[2px] bg-gray-200 z-0"></div>
                  
                  {/* 报关节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faFileContract} className="mr-2 text-blue-500" />报关
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已完成</Tag>
                      <div className="text-gray-400 text-xs">2023-04-05 10:00:00</div>
                    </div>
                  </div>
                  
                  {/* 海上订舱节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faAnchor} className="mr-2 text-blue-500" />海上订舱
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已完成</Tag>
                      <div className="text-gray-400 text-xs">2023-04-24 12:00:00</div>
                    </div>
                  </div>
                  
                  {/* 港区单证节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500" />港区单证
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已完成</Tag>
                      <div className="text-gray-400 text-xs">2023-04-24 12:00:00</div>
                    </div>
                  </div>
                  
                  {/* 车辆进场节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faTruck} className="mr-2 text-blue-500" />车辆进场
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已完成</Tag>
                      <div className="text-gray-400 text-xs">2023-04-25 10:00:00</div>
                    </div>
                  </div>
                  
                  {/* 装卸作业节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faWarehouse} className="mr-2 text-blue-500" />装卸作业
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已完成</Tag>
                      <div className="text-gray-400 text-xs">2023-04-27 11:00:00</div>
                    </div>
                  </div>
                  
                  {/* 船舶靠离节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faShip} className="mr-2 text-blue-500" />船舶靠离
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-blue-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-blue-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="blue" className="mb-2 mx-auto block w-24">已完成</Tag>
                      <div className="text-gray-400 text-xs">2023-04-28 11:00:00</div>
                    </div>
                  </div>
                  
                  {/* 离港开航节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faShippingFast} className="mr-2 text-orange-500" />离港开航
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-orange-500 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-orange-500"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="orange" className="mb-2 mx-auto block w-24">进行中</Tag>
                      <div className="text-gray-400 text-xs">2023-04-30 01:45:00</div>
                    </div>
                  </div>
                  
                  {/* 在途追踪节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faShip} className="mr-2 text-gray-400" />在途追踪
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待开始</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>
                  
                  {/* 抵达目的港节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faAnchor} className="mr-2 text-gray-400" />抵达目的港
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待开始</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>
                  
                  {/* 海关节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faFileContract} className="mr-2 text-gray-400" />海关
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待开始</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>
                  
                  {/* 送货节点 */}
                  <div className="tracking-node flex flex-col items-center px-10 relative z-10">
                    <div className="node-content text-center w-[120px] mb-2">
                      <div className="font-bold text-gray-800 mb-1 whitespace-nowrap">
                        <FontAwesomeIcon icon={faTruck} className="mr-2 text-gray-400" />送货
                      </div>
                    </div>
                    <div className="node-dot w-[12px] h-[12px] rounded-full bg-gray-300 mb-2"></div>
                    <div className="node-line h-[30px] w-[2px] bg-gray-300"></div>
                    <div className="node-status text-center w-[120px]">
                      <Tag color="gray" className="mb-2 mx-auto block w-24">待开始</Tag>
                      <div className="text-gray-400 text-xs">-</div>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Card>
        
        <Card title="待办任务" bordered={false} className="shadow-sm mt-4">
          <div className="task-cards mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {taskCards.map((card, index) => {
              // 计算选中状态的样式
              const ringClass = currentTask === card.title ? 'ring-2' : '';
              
              return (
                <div 
                  key={index}
                  className={`task-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all ${ringClass} relative`}
                  style={{
                    backgroundColor: card.color === 'blue' ? '#eff6ff' : 
                                     card.color === 'green' ? '#f0fdf4' : 
                                     card.color === 'orange' ? '#fff7ed' : 
                                     card.color === 'purple' ? '#faf5ff' : 
                                     card.color === 'red' ? '#fef2f2' : 
                                     card.color === 'cyan' ? '#ecfeff' : '#f9fafb',
                    borderColor: card.color === 'blue' ? '#bfdbfe' : 
                                 card.color === 'green' ? '#bbf7d0' : 
                                 card.color === 'orange' ? '#fed7aa' : 
                                 card.color === 'purple' ? '#e9d5ff' : 
                                 card.color === 'red' ? '#fecaca' : 
                                 card.color === 'cyan' ? '#a5f3fc' : '#e5e7eb',
                    boxShadow: currentTask === card.title ? `0 0 0 2px ${
                      card.color === 'blue' ? '#3b82f6' : 
                      card.color === 'green' ? '#22c55e' : 
                      card.color === 'orange' ? '#f97316' : 
                      card.color === 'purple' ? '#a855f7' : 
                      card.color === 'red' ? '#ef4444' : 
                      card.color === 'cyan' ? '#06b6d4' : '#6b7280'
                    }` : 'none'
                  }}
                  onClick={() => setCurrentTask(card.title)}
                >
                  {/* 选中状态的勾选角标 */}
                  {currentTask === card.title && (
                    <div 
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-md flex items-center justify-center"
                      style={{
                        backgroundColor: card.color === 'blue' ? '#3b82f6' : 
                                        card.color === 'green' ? '#22c55e' : 
                                        card.color === 'orange' ? '#f97316' : 
                                        card.color === 'purple' ? '#a855f7' : 
                                        card.color === 'red' ? '#ef4444' : 
                                        card.color === 'cyan' ? '#06b6d4' : '#6b7280'
                      }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
                    </div>
                  )}
                  <div className="font-bold mb-1" style={{
                    color: card.color === 'blue' ? '#1d4ed8' : 
                           card.color === 'green' ? '#15803d' : 
                           card.color === 'orange' ? '#c2410c' : 
                           card.color === 'purple' ? '#7e22ce' : 
                           card.color === 'red' ? '#b91c1c' : 
                           card.color === 'cyan' ? '#0e7490' : '#374151'
                  }}>
                    {card.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    待处理订单: <span className="font-bold" style={{
                      color: card.color === 'blue' ? '#2563eb' : 
                             card.color === 'green' ? '#16a34a' : 
                             card.color === 'orange' ? '#ea580c' : 
                             card.color === 'purple' ? '#9333ea' : 
                             card.color === 'red' ? '#dc2626' : 
                             card.color === 'cyan' ? '#0891b2' : '#4b5563'
                    }}>{card.count}</span> 单
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="order-task-list bg-white border border-gray-100 rounded-lg">
            <div className="flex justify-between items-center p-3 border-b border-gray-100">
              <div className="text-lg font-bold text-gray-700">{currentTask}任务</div>
              <div className="text-sm text-gray-500">共 {taskData.total} 个订单需要处理</div>
            </div>
            
            <Table 
              columns={[
                {
                  title: '业务编号',
                  dataIndex: 'businessId',
                  key: 'businessId',
                  render: (text) => <a href="#" className="text-blue-600 hover:underline">{text}</a>,
                },
                {
                  title: '起运港',
                  dataIndex: 'departurePort',
                  key: 'departurePort',
                },
                {
                  title: 'ETD',
                  dataIndex: 'etd',
                  key: 'etd',
                },
                {
                  title: 'ETA',
                  dataIndex: 'eta',
                  key: 'eta',
                },
                {
                  title: '目的港',
                  dataIndex: 'destinationPort',
                  key: 'destinationPort',
                },
                {
                  title: '船名',
                  dataIndex: 'vesselName',
                  key: 'vesselName',
                },
                {
                  title: '航次/航班',
                  dataIndex: 'voyage',
                  key: 'voyage',
                },
                {
                  title: '箱号',
                  dataIndex: 'containerNo',
                  key: 'containerNo',
                },
                {
                  title: '创建日期',
                  dataIndex: 'createdDate',
                  key: 'createdDate',
                },
                {
                  title: '操作',
                  key: 'action',
                  render: () => (
                    <Space size="small">
                      <Button type="text" size="small" className="text-blue-600">{getTaskButtonText()}</Button>
                      <Button type="text" size="small">查看</Button>
                    </Space>
                  ),
                },
              ]} 
              data={taskData.data}
              pagination={{
                total: taskData.total,
                pageSize: 5,
                current: 1,
                showTotal: (total) => `共 ${total} 条`,
                sizeCanChange: true
              }}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default Dashboard; 