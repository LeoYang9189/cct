import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Typography, 
  Space, 
  Divider, 
  Tag, 
  Collapse,
  Tabs,
  Input,
  Tooltip,
  Modal
} from '@arco-design/web-react';
import {   IconLeft,  IconEdit,  IconCopy,  IconClose,  IconSend,  IconRight,  IconDown,  IconEye} from '@arco-design/web-react/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, 
  faAnchor, 
  faTruck, 
  faWarehouse, 
  faFileContract, 
  faFileInvoiceDollar, 
  faReceipt, 
  faShippingFast,
  faGlobe,
  faCogs,
  faDollarSign,
  faWeight,
  faFileImport,
  faFileText,
  faExchangeAlt,
  faBox,
  faClock,
  faCheckCircle,
  faCubes,
  faPlay,
  faStop,
  faShoppingCart,
  faUndo
} from '@fortawesome/free-solid-svg-icons';

const { Title } = Typography;
const CollapseItem = Collapse.Item;
const TabPane = Tabs.TabPane;

interface OrderDetailProps {}

// 业务流程节点类型
type NodeStatus = 'completed' | 'partial' | 'pending';

// 任务数据类型
interface TaskItem {
  name: string;
  type: 'customer' | 'operation';
  status: 'completed' | 'pending' | 'skipped';
  time?: string;
}

// 节点数据类型
interface NodeItem {
  id: string;
  title: string;
  icon: any; // FontAwesome图标
  status: NodeStatus;
  active: boolean;
  tasks: TaskItem[];
}

// 业务节点数据
const businessNodes: NodeItem[] = [
  { 
    id: 'production', 
    title: '生产', 
    icon: faCogs, 
    status: 'completed',
    active: true,
    tasks: [
      { name: '生产安排', type: 'operation', status: 'completed', time: '2024-03-10 09:00:00' }
    ]
  },
  { 
    id: 'freight_rate', 
    title: '运价', 
    icon: faDollarSign, 
    status: 'partial',
    active: true,
    tasks: [
      { name: '提交询价', type: 'customer', status: 'completed', time: '2024-03-10 14:00:00' },
      { name: '提交报价', type: 'operation', status: 'pending' }
    ]
  },
  { 
    id: 'booking', 
    title: '订舱', 
    icon: faAnchor, 
    status: 'completed',
    active: true,
    tasks: [
      { name: '订舱申请', type: 'customer', status: 'completed', time: '2024-03-11 10:00:00' },
      { name: '订舱确认', type: 'operation', status: 'completed', time: '2024-03-11 15:00:00' }
    ]
  },
  { 
    id: 'trucking', 
    title: '拖车', 
    icon: faTruck, 
    status: 'completed',
    active: false,
    tasks: [
      { name: '拖车安排', type: 'operation', status: 'completed', time: '2024-03-12 14:00:00' }
    ]
  },
  { 
    id: 'warehouse', 
    title: '仓库', 
    icon: faWarehouse, 
    status: 'partial',
    active: false,
    tasks: [
      { name: '入库安排', type: 'operation', status: 'completed', time: '2024-03-13 16:00:00' },
      { name: '仓储费用', type: 'customer', status: 'skipped', time: '2024-03-13 17:00:00' }
    ]
  },
  { 
    id: 'customs', 
    title: '报关', 
    icon: faFileContract, 
    status: 'completed',
    active: false,
    tasks: [
      { name: '报关资料', type: 'customer', status: 'completed', time: '2024-03-14 09:00:00' },
      { name: '报关申报', type: 'operation', status: 'completed', time: '2024-03-14 11:00:00' }
    ]
  },
  { 
    id: 'manifest', 
    title: '舱单', 
    icon: faFileAlt, 
    status: 'completed',
    active: false,
    tasks: [
      { name: '舱单制作', type: 'operation', status: 'completed', time: '2024-03-15 09:00:00' }
    ]
  },
  { 
    id: 'vgm', 
    title: 'VGM', 
    icon: faWeight, 
    status: 'completed',
    active: false,
    tasks: [
      { name: 'VGM提交', type: 'customer', status: 'completed', time: '2024-03-15 14:00:00' }
    ]
  },
  { 
    id: 'supplement', 
    title: '补料', 
    icon: faFileImport, 
    status: 'partial',
    active: true,
    tasks: [
      { name: '补料提交', type: 'customer', status: 'completed', time: '2024-03-16 10:00:00' },
      { name: '补料审核', type: 'operation', status: 'pending' },
      { name: '补料费用', type: 'customer', status: 'skipped', time: '2024-03-16 11:00:00' }
    ]
  },
  { 
    id: 'bill', 
    title: '账单', 
    icon: faReceipt, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '账单生成', type: 'operation', status: 'pending' }
    ]
  },
  { 
    id: 'invoice', 
    title: '发票', 
    icon: faFileInvoiceDollar, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '发票开具', type: 'operation', status: 'pending' }
    ]
  },
  { 
    id: 'bill_of_lading', 
    title: '提单', 
    icon: faFileText, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '提单签发', type: 'operation', status: 'pending' }
    ]
  },
  { 
    id: 'switch_bill', 
    title: '换单', 
    icon: faExchangeAlt, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '换单处理', type: 'operation', status: 'pending' }
    ]
  },
  { 
    id: 'container_pickup', 
    title: '提柜', 
    icon: faBox, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '提柜安排', type: 'operation', status: 'pending' }
    ]
  },
  { 
    id: 'delivery', 
    title: '送货', 
    icon: faShippingFast, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '配送安排', type: 'operation', status: 'pending' }
    ]
  }
];

// 运踪节点数据
const shippingNodes: NodeItem[] = [
  { 
    id: 'empty_pickup', 
    title: '提空箱', 
    icon: faBox, 
    status: 'completed',
    active: true,
    tasks: [
      { name: '空箱提取', type: 'operation', status: 'completed', time: '2024-03-15 09:00:00' }
    ]
  },
  { 
    id: 'expected_port_open', 
    title: '预计开港', 
    icon: faClock, 
    status: 'completed',
    active: true,
    tasks: [
      { name: '开港通知', type: 'operation', status: 'completed', time: '2024-03-15 14:00:00' }
    ]
  },
  { 
    id: 'port_cutoff', 
    title: '港区截单', 
    icon: faFileAlt, 
    status: 'completed',
    active: true,
    tasks: [
      { name: '截单确认', type: 'operation', status: 'completed', time: '2024-03-16 10:00:00' }
    ]
  },
  { 
    id: 'heavy_entry', 
    title: '重箱进场', 
    icon: faTruck, 
    status: 'partial',
    active: false,
    tasks: [
      { name: '进场申请', type: 'customer', status: 'completed', time: '2024-03-16 15:00:00' },
      { name: '进场确认', type: 'operation', status: 'pending' },
      { name: '加急费用', type: 'customer', status: 'skipped', time: '2024-03-16 16:00:00' }
    ]
  },
  { 
    id: 'customs_release', 
    title: '海关放行', 
    icon: faCheckCircle, 
    status: 'completed',
    active: false,
    tasks: [
      { name: '海关审核', type: 'operation', status: 'completed', time: '2024-03-17 11:00:00' }
    ]
  },
  { 
    id: 'terminal_release', 
    title: '码头放行', 
    icon: faWarehouse, 
    status: 'completed',
    active: false,
    tasks: [
      { name: '码头确认', type: 'operation', status: 'completed', time: '2024-03-17 16:00:00' }
    ]
  },
  { 
    id: 'actual_berth', 
    title: '实际靠泊', 
    icon: faAnchor, 
    status: 'completed',
    active: false,
    tasks: [
      { name: '靠泊确认', type: 'operation', status: 'completed', time: '2024-03-18 08:00:00' }
    ]
  },
  { 
    id: 'loading_plan', 
    title: '配载', 
    icon: faCubes, 
    status: 'completed',
    active: false,
    tasks: [
      { name: '配载计划', type: 'operation', status: 'completed', time: '2024-03-18 14:00:00' }
    ]
  },
  { 
    id: 'actual_departure', 
    title: '实际开船', 
    icon: faPlay, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '开船确认', type: 'operation', status: 'pending' }
    ]
  },
  { 
    id: 'unloading', 
    title: '卸船', 
    icon: faStop, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '卸船作业', type: 'operation', status: 'pending' }
    ]
  },
  { 
    id: 'heavy_pickup', 
    title: '提重', 
    icon: faShoppingCart, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '重箱提取', type: 'operation', status: 'pending' }
    ]
  },
  { 
    id: 'return_empty', 
    title: '还箱', 
    icon: faUndo, 
    status: 'pending',
    active: false,
    tasks: [
      { name: '空箱归还', type: 'operation', status: 'pending' }
    ]
  }
];

const OrderDetail: React.FC<OrderDetailProps> = () => {
  // 确认跳过任务弹窗状态
  const [skipConfirmVisible, setSkipConfirmVisible] = useState(false);
  const [currentTaskName, setCurrentTaskName] = useState<string>('');
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  /**
   * 处理跳过任务的确认弹窗
   * @param taskName 任务名称
   */
  const handleSkipTask = (taskName: string) => {
    setCurrentTaskName(taskName);
    setSkipConfirmVisible(true);
  };

  /**
   * 确认跳过任务
   */
  const confirmSkipTask = () => {
    console.log('确认跳过任务:', currentTaskName);
    // 这里可以添加实际的跳过任务逻辑
    setSkipConfirmVisible(false);
    setCurrentTaskName('');
  };

  /**
   * 取消跳过任务
   */
  const cancelSkipTask = () => {
    console.log('取消跳过任务:', currentTaskName);
    setSkipConfirmVisible(false);
    setCurrentTaskName('');
  };
  // 注释掉未使用的状态变量
  // const [activeKey, setActiveKey] = useState<string[]>(['1', '2', '3']);
  const [message, setMessage] = useState<string>('');
  const [nodeTab, setNodeTab] = useState<string>('business');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [nodeAreaCollapsed, setNodeAreaCollapsed] = useState<boolean>(false);
  
  // 自定义查看按钮组件，符合截图样式 - 有边框无底色
  const ViewButton = () => (
    <div className="inline-flex items-center px-2 py-1 border border-blue-600 rounded">
      <span className="text-blue-600 mr-1 text-xs">
        <FontAwesomeIcon icon={faFileAlt} />
      </span>
      <span className="text-blue-600 text-xs">查看</span>
    </div>
  );

  const handleGoBack = () => {
    navigate('/controltower/order-management');
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };
  
  // 生成唯一的菜单ID
  const getMenuId = (prefix: string, index: number) => `${prefix}_${index}`;
  
  // 处理三点菜单点击
  const handleMenuClick = (menuId: string) => {
    setActiveMenuId(prevId => prevId === menuId ? null : menuId);
  };
  
  // 添加点击外部区域关闭菜单的处理
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenuId) {
        // 检查点击是否在菜单外部
        const isOutsideClick = !(event.target as Element).closest('.file-menu-btn, .file-menu-dropdown');
        if (isOutsideClick) {
          setActiveMenuId(null);
        }
      }
    };
    
    // 添加全局点击事件监听
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      // 清理事件监听
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenuId]);

  // 注释掉未使用的组件定义
  /*
  const TaskItem = ({ status, title, time, person, org, description }: { 
    status: string; 
    title: string; 
    time: string; 
    person: string; 
    org: string;
    description?: string;
  }) => (
    <div className="task-item mb-4">
      <div className="flex items-center mb-2">
        <Badge status={status === '已完成' ? 'success' : status === '处理中' ? 'processing' : 'default'} />
        <div className="ml-2 text-lg font-medium">{status}:</div>
        <div className="ml-2 text-lg">{title}</div>
      </div>
      <div className="ml-4">
        <div className="flex items-center mb-1">
          <Text className="text-gray-500 mr-2">执行时间:</Text>
          <Text>{time}</Text>
        </div>
        <div className="flex items-center mb-1">
          <Text className="text-gray-500 mr-2">执行人员:</Text>
          <Text>{person}</Text>
          <Text className="ml-4">@ {org}</Text>
        </div>
        {description && (
          <div className="flex items-start mb-1">
            <Text className="text-gray-500 mr-2">任务内容:</Text>
            <Text>{description}</Text>
          </div>
        )}
      </div>
    </div>
  );
  */



  const StatusIcon = ({ status, icon }: { status: NodeStatus, icon: any }) => {
    const bgColor = status === 'completed' ? 'bg-blue-500' : 
                   status === 'partial' ? 'bg-yellow-500' : 'bg-gray-300';
    const iconColor = status === 'pending' ? 'text-gray-500' : 'text-white';
    
    return (
      <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center shadow-sm relative`}>
        <FontAwesomeIcon icon={icon} className={`text-sm ${iconColor}`} />
        {status === 'partial' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
        )}
      </div>
    );
  };

  const renderNodes = (nodes: NodeItem[]) => {
    return (
      <div className="relative">
        {/* 垂直线 */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
        
        {nodes.map((node) => {
          // 节点状态样式
          const isCompleted = node.status === 'completed';
          const isPartial = node.status === 'partial';
          const isPending = node.status === 'pending';
          
          // 展开状态
          const isExpanded = activeKeys.includes(node.id);
          
          return (
            <div key={node.id} className="mb-5 relative">
              {/* 节点图标 */}
              <div className="absolute left-0 z-10">
                <Tooltip
                  content={
                    <div>
                      {node.tasks.map((task: any, index: number) => (
                        <div key={index} style={{ marginBottom: '4px', color: 'white' }}>
                          <span>
                            {task.type === 'customer' ? '客户任务' : '运营任务'}：{task.name} - 
                          </span>
                          <span style={{
                            color: task.status === 'completed' ? '#52c41a' : 
                                   task.status === 'skipped' ? '#faad14' : '#ff4d4f',
                            fontWeight: 'bold'
                          }}>
                            {task.status === 'completed' ? '已完成' : 
                             task.status === 'skipped' ? '已跳过' : '未完成'}
                          </span>
                          {(task.status === 'completed' || task.status === 'skipped') && task.time && (
                            <div style={{ fontSize: '12px', color: '#d9d9d9', marginTop: '2px' }}>
                              {task.time}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  }
                  position="top"
                >
                  <div style={{ cursor: 'pointer' }}>
                    <StatusIcon status={node.status} icon={node.icon} />
                  </div>
                </Tooltip>
              </div>
              
              {/* 节点卡片 */}
              <div className="ml-12">
                <div 
                  className={`border rounded-lg ${isExpanded ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-gray-200'} overflow-hidden transition-all duration-200 ease-in-out hover:shadow-sm`}
                  onClick={() => {
                    setActiveKeys(
                      isExpanded 
                        ? activeKeys.filter(key => key !== node.id)
                        : [...activeKeys, node.id]
                    );
                  }}
                >
                  {/* 卡片头部 */}
                  <div className="px-4 py-3 flex justify-between items-center cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <div className="text-base font-medium">
                        {node.title}
                      </div>
                      {isCompleted && (
                        <Tag color="blue" size="small" className="border border-blue-200">已完成</Tag>
                      )}
                      {isPartial && (
                        <Tag color="orange" size="small" className="border border-orange-200">部分完成</Tag>
                      )}
                      {isPending && (
                        <Tag color="gray" size="small" className="border border-gray-200">未完成</Tag>
                      )}
                    </div>
                    <div className="flex items-center">
                      <div className="text-gray-400 hover:text-blue-500 transition-colors">
                        {isExpanded ? <IconDown /> : <IconRight />}
                      </div>
                    </div>
                  </div>
                  
                  {/* 卡片内容 */}
                  {isExpanded && (
                    <div className="border-t border-blue-100 bg-gray-50 px-4 py-3">
                      <div className="space-y-2">
                        {node.tasks.map((task: any, index: number) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                            <div className="flex items-center space-x-2">
                              <Tag 
                                color={task.type === 'customer' ? 'blue' : 'green'} 
                                size="small"
                              >
                                {task.type === 'customer' ? '客户任务' : '运营任务'}
                              </Tag>
                              <span className="text-sm font-medium">{task.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Tag 
                                color={
                                  task.status === 'completed' ? 'green' : 
                                  task.status === 'skipped' ? 'orange' : 'red'
                                }
                                size="small"
                              >
                                {task.status === 'completed' ? '已完成' : 
                                 task.status === 'skipped' ? '已跳过' : '未完成'}
                              </Tag>
                              {(task.status === 'completed' || task.status === 'skipped') && task.time && (
                                <span className="text-xs text-gray-500">{task.time}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="order-detail-page">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button
            type="text"
            icon={<IconLeft />}
            onClick={handleGoBack}
            className="mr-2"
          />
          <Title heading={5} style={{ margin: 0 }}>CT1234567890</Title>
        </div>
        <div>
          <Space>
            <Button type="primary" icon={<IconCopy />}>复制</Button>
            <Button type="secondary" icon={<IconClose />}>关闭</Button>
            <Button 
              type="secondary"
              icon={<FontAwesomeIcon icon={faGlobe} />} 
              className={showMap ? 'bg-blue-100' : ''}
              onClick={toggleMap}
            />
          </Space>
        </div>
      </div>

      {/* 地图区域 */}
      {showMap && (
        <Card className="mb-4 overflow-hidden">
          <div className="relative">
            <div className="w-full h-96 bg-blue-50 rounded-lg overflow-hidden position-relative">
              {/* 模拟地图显示 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* 世界地图背景 */}
                  <div 
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ 
                      backgroundImage: 'url("https://images.unsplash.com/photo-1589519160732-576f165b9aad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
                      opacity: 0.9
                    }}
                  ></div>
                  
                  {/* 添加一层半透明蓝色覆盖，增强航运气氛 */}
                  <div className="absolute inset-0 bg-blue-900 opacity-10"></div>
                  
                  {/* 地图中间提示文字 */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="bg-white/80 px-5 py-3 rounded-lg shadow-lg">
                      <span className="text-xl font-bold text-blue-800">【脑补下我是世界地图】</span>
                    </div>
                  </div>
                  
                  {/* 出发点 - 中国 */}
                  <div className="absolute" style={{ left: '20%', top: '40%' }}>
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/30"></div>
                    <div className="absolute top-4 left-0 text-xs font-medium bg-white/80 px-1 py-0.5 rounded shadow-sm">
                      CNNBO
                      <div className="text-gray-500 text-xs">DEPA: 2024-09-07 16:00:00</div>
                    </div>
                  </div>
                  
                  {/* 目的地 - 美国 */}
                  <div className="absolute" style={{ left: '80%', top: '35%' }}>
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/30"></div>
                    <div className="absolute top-4 left-0 text-xs font-medium bg-white/80 px-1 py-0.5 rounded shadow-sm">
                      USLA
                      <div className="text-gray-500 text-xs">ARRI: 2024-09-22 06:13:15</div>
                    </div>
                  </div>
                  
                  {/* 第二目的地 - 美国其他地方 */}
                  <div className="absolute" style={{ left: '75%', top: '28%' }}>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/30"></div>
                    <div className="absolute top-4 left-0 text-xs font-medium bg-white/80 px-1 py-0.5 rounded shadow-sm">
                      USLB
                      <div className="text-gray-500 text-xs">ARRI: 2024-10-20 04:00:00</div>
                    </div>
                  </div>
                  
                  {/* 飞线 */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                    <path 
                      d="M 20% 40% Q 50% 20%, 80% 35%" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      filter="drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))"
                    />
                    <path 
                      d="M 80% 35% Q 82% 30%, 75% 28%" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      filter="drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))"
                    />
                  </svg>
                  
                  {/* 当前位置标记 */}
                  <div className="absolute" style={{ left: '50%', top: '30%' }}>
                    <div className="w-5 h-5 bg-blue-500 rounded-full animate-ping opacity-70 shadow-lg shadow-blue-500/50"></div>
                    <div className="absolute w-3 h-3 bg-white rounded-full" style={{ left: '4px', top: '4px' }}></div>
                  </div>
                </div>
              </div>
              
              {/* 地图标题 */}
              <div className="absolute top-2 left-2 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                <span className="font-semibold text-blue-800">CT1234567890 运输路线</span>
              </div>
              
              {/* 地图缩放按钮 */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <button className="bg-white/80 w-8 h-8 flex items-center justify-center rounded-full shadow-sm">
                  <span className="text-gray-700 font-bold">+</span>
                </button>
                <button className="bg-white/80 w-8 h-8 flex items-center justify-center rounded-full shadow-sm">
                  <span className="text-gray-700 font-bold">-</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className={`grid gap-4 transition-all duration-300 ${nodeAreaCollapsed ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {/* 左侧内容 */}
        <div className={`${nodeAreaCollapsed ? 'col-span-1' : 'col-span-3'}`}>
          {/* 任务模块 */}
          <div className="mb-4">
            {/* 未完成任务 */}
            <Card bordered={false} className="mb-4 shadow-sm">
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
              >
                <CollapseItem
                  header={
                    <div className="flex items-center">
                      <Title heading={6} style={{ margin: 0 }}>未完成任务（13）</Title>
                    </div>
                  }
                  name="1"
                >
                  {/* 运营版未完成任务 */}
                  {[
                    { name: '提交报价', deadline: 'Nov 10, 2021 17:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 09, 2021 10:00' },
                    { name: '确认BC件', deadline: 'Nov 12, 2021 14:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 11, 2021 09:30' },
                    { name: '确认派车', deadline: 'Nov 13, 2021 16:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 12, 2021 14:20' },
                    { name: '确认进仓', deadline: 'Nov 14, 2021 10:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 13, 2021 08:15' },
                    { name: '确认报关', deadline: 'Nov 15, 2021 15:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 14, 2021 11:30' },
                    { name: '确认舱单', deadline: 'Nov 16, 2021 12:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 15, 2021 09:45' },
                    { name: '确认VGM', deadline: 'Nov 17, 2021 14:30', executor: '上海得普赛国际物流有限公司', generated: 'Nov 16, 2021 10:20' },
                    { name: '确认补料', deadline: 'Nov 18, 2021 16:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 17, 2021 13:10' },
                    { name: '上传账单', deadline: 'Nov 19, 2021 11:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 18, 2021 15:30' },
                    { name: '上传发票', deadline: 'Nov 20, 2021 13:30', executor: '上海得普赛国际物流有限公司', generated: 'Nov 19, 2021 12:45' },
                    { name: '放单', deadline: 'Nov 21, 2021 15:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 20, 2021 14:20' },
                    { name: '确认换单', deadline: 'Nov 22, 2021 10:30', executor: '上海得普赛国际物流有限公司', generated: 'Nov 21, 2021 16:15' },
                    { name: '上传送货计划', deadline: 'Nov 23, 2021 12:00', executor: '上海得普赛国际物流有限公司', generated: 'Nov 22, 2021 11:40' }
                  ].map((task, index) => (
                    <div key={index} className={`${index < 12 ? 'border-b pb-4 mb-4 border-gray-200' : ''}`}>
                      <div className="grid grid-cols-4 gap-4 mt-3 relative">
                        <div className="border-r border-gray-200 pr-4">
                          <div className="text-gray-500 mb-1">截止时间</div>
                          <div className="font-medium">{task.deadline}</div>
                        </div>
                        
                        <div className="border-r border-gray-200 pr-4">
                          <div className="text-gray-500 mb-1">任务名称</div>
                          <div className="font-medium">{task.name}</div>
                        </div>
                        
                        <div className="border-r border-gray-200 pr-4">
                          <div className="text-gray-500 mb-1">执行人</div>
                          <div className="font-medium">{task.executor}</div>
                        </div>
                        
                        <div>
                          <div className="text-gray-500 mb-1">任务状态</div>
                          <div className="font-medium">待处理 <span className="text-xs text-gray-500 ml-1">生成于 {task.generated}</span></div>
                        </div>
                        
                        {/* 操作按钮放在最右侧 */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex gap-2">
                          <Button 
                            type="primary" 
                            size="small"
                            icon={<IconSend />}
                            onClick={() => {
                              // 根据任务名称跳转到不同页面
                              if (task.name === '提交报价') {
                                navigate('/controltower/saas/quote-form/fcl/QT2024050001');
                              } else {
                                navigate(`/controltower/bl-addition/${orderId || 'DEFAULT'}`);
                              }
                            }}
                          >处理</Button>
                          <Button 
                            size="small"
                            onClick={() => handleSkipTask(task.name)}
                          >跳过</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CollapseItem>
              </Collapse>
            </Card>

            {/* 已完成任务 */}
            <Card bordered={false} className="mb-4 shadow-sm">
              <Collapse
                bordered={false}
                defaultActiveKey={[]}
              >
                <CollapseItem
                  header={
                    <div className="flex items-center">
                      <Title heading={6} style={{ margin: 0 }}>已完成任务（13）</Title>
                    </div>
                  }
                  name="1"
                >
                  {/* 运营版已完成任务 */}
                  {[
                    { name: '提交报价', deadline: 'Nov 01, 2021 17:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 01, 2021 16:30' },
                    { name: '确认BC件', deadline: 'Nov 02, 2021 14:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 02, 2021 13:45' },
                    { name: '确认派车', deadline: 'Nov 03, 2021 16:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 03, 2021 15:20' },
                    { name: '确认进仓', deadline: 'Nov 04, 2021 10:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 04, 2021 09:15' },
                    { name: '确认报关', deadline: 'Nov 05, 2021 15:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 05, 2021 14:30' },
                    { name: '确认舱单', deadline: 'Nov 06, 2021 12:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 06, 2021 11:45' },
                    { name: '确认VGM', deadline: 'Nov 07, 2021 14:30', executor: '上海得普赛国际物流有限公司', completed: 'Nov 07, 2021 14:20' },
                    { name: '确认补料', deadline: 'Nov 08, 2021 16:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 08, 2021 15:10' },
                    { name: '上传账单', deadline: 'Nov 09, 2021 11:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 09, 2021 10:30' },
                    { name: '上传发票', deadline: 'Nov 10, 2021 13:30', executor: '上海得普赛国际物流有限公司', completed: 'Nov 10, 2021 13:15' },
                    { name: '放单', deadline: 'Nov 11, 2021 15:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 11, 2021 14:45' },
                    { name: '确认换单', deadline: 'Nov 12, 2021 10:30', executor: '上海得普赛国际物流有限公司', completed: 'Nov 12, 2021 10:15' },
                    { name: '上传送货计划', deadline: 'Nov 13, 2021 12:00', executor: '上海得普赛国际物流有限公司', completed: 'Nov 13, 2021 11:40' }
                  ].map((task, index) => (
                    <div key={index} className={`${index < 12 ? 'border-b pb-4 mb-4 border-gray-200' : ''}`}>
                      <div className="grid grid-cols-4 gap-4 mt-3 relative">
                        <div className="border-r border-gray-200 pr-4">
                          <div className="text-gray-500 mb-1">截止时间</div>
                          <div className="font-medium">{task.deadline}</div>
                        </div>
                        
                        <div className="border-r border-gray-200 pr-4">
                          <div className="text-gray-500 mb-1">任务名称</div>
                          <div className="font-medium">{task.name}</div>
                        </div>
                        
                        <div className="border-r border-gray-200 pr-4">
                          <div className="text-gray-500 mb-1">执行人</div>
                          <div className="font-medium">{task.executor}</div>
                        </div>
                        
                        <div>
                          <div className="text-gray-500 mb-1">任务状态</div>
                          <div className="font-medium text-green-600">已完成 <span className="text-xs text-gray-500 ml-1">完成于 {task.completed}</span></div>
                        </div>
                        
                        {/* 查看按钮放在最右侧 */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                          <Button 
                            type="outline" 
                            size="small"
                            icon={<IconEye />}
                            onClick={() => navigate(`/controltower/bl-addition/${orderId || 'DEFAULT'}`)}
                          >查看</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CollapseItem>
              </Collapse>
            </Card>
          </div>

          {/* 选项卡区域 */}
          <Card bordered={false} className="mb-4 shadow-sm">
            <Tabs defaultActiveTab="概览">
              <TabPane key="留言板" title="留言板">
                {/* 协作方联系信息 - 可展开缩起 - 移到文本输入框上方 */}
                <Collapse defaultActiveKey={[]} bordered={false} className="mb-4">
                  <CollapseItem
                    header={
                      <div className="flex items-center">
                        <Title heading={6} style={{ margin: 0 }}>协作方联系信息</Title>
                      </div>
                    }
                    name="contactInfo"
                  >
                    <div className="border-t border-gray-200 pt-3">
                      {/* 表头 */}
                      <div className="grid grid-cols-4 gap-4 mb-2 text-gray-500 font-medium">
                        <div>角色</div>
                        <div>姓名</div>
                        <div>电话</div>
                        <div>邮箱</div>
                      </div>
                      
                      {/* 订单创建人 */}
                      <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200">
                        <div className="text-gray-600">订单创建人</div>
                        <div>
                          <div className="font-medium">Kate Hu</div>
                          <div className="text-gray-500 text-xs">@上海KKK国际物流有限公司</div>
                        </div>
                        <div>
                          <div>021-62550212</div>
                          <div>13512345678</div>
                        </div>
                        <div>
                          <div>KK@123.com</div>
                          <div>123@11111.com</div>
                        </div>
                      </div>
                      
                      {/* 专案销售 */}
                      <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200">
                        <div className="text-gray-600">专属销售</div>
                        <div>
                          <div className="font-medium">Judy Wu</div>
                          <div className="text-gray-500 text-xs">@上海得普赛国际物流有限公司</div>
                        </div>
                        <div>
                          <div>18912345678</div>
                          <div>-</div>
                        </div>
                        <div>
                          <div>awa34.f@gmail.com</div>
                        </div>
                      </div>
                      
                      {/* 专案客服 */}
                      <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200">
                        <div className="text-gray-600">专属客服</div>
                        <div>
                          <div className="font-medium">Milk Cat</div>
                          <div className="text-gray-500 text-xs">@上海得普赛国际物流有限公司</div>
                        </div>
                        <div>
                          <div>021-65231111</div>
                          <div>13622221111</div>
                        </div>
                        <div>
                          <div>qwer@gmail.com</div>
                        </div>
                      </div>
                      
                      {/* 分配操作 */}
                      <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200">
                        <div className="text-gray-600">分配操作</div>
                        <div>
                          <div className="font-medium">Milk Cat</div>
                          <div className="text-gray-500 text-xs">@上海得普赛国际物流有限公司</div>
                        </div>
                        <div>
                          <div>021-65231111</div>
                          <div>13622221111</div>
                        </div>
                        <div>
                          <div>ta.rews@gmail.com</div>
                        </div>
                      </div>
                      
                      {/* 分配单证 */}
                      <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200">
                        <div className="text-gray-600">分配单证</div>
                        <div>
                          <div className="font-medium">Milk Cat</div>
                          <div className="text-gray-500 text-xs">@上海得普赛国际物流有限公司</div>
                        </div>
                        <div>
                          <div>021-65231111</div>
                          <div>13622221111</div>
                        </div>
                        <div>
                          <div>asdf@gmail.com</div>
                        </div>
                      </div>
                      
                      {/* 其他1 */}
                      <div className="grid grid-cols-4 gap-4 py-3">
                        <div className="text-gray-600">其他1</div>
                        <div>
                          <div className="font-medium">-</div>
                        </div>
                        <div>
                          <div>-</div>
                        </div>
                        <div>
                          <div>-</div>
                        </div>
                      </div>
                    </div>
                  </CollapseItem>
                </Collapse>
                
                <div className="mb-4">
                  <Input.TextArea 
                    placeholder="请输入你的留言" 
                    style={{ minHeight: '80px' }} 
                    value={message}
                    onChange={(value) => setMessage(value)}
                  />
                </div>
                <div className="flex justify-between">
                  <div>
                    <IconEdit className="mr-2" />
                    <span>附件上传</span>
                  </div>
                  <Button type="primary" icon={<IconSend />}>发送</Button>
                </div>
                
                <Divider style={{ margin: '16px 0' }} />
                
                <div className="message-list">
                  <div className="message-item flex mb-6">
                    <div className="message-avatar bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span>U</span>
                    </div>
                    <div className="message-content flex-grow">
                      <div className="mb-1">
                        <span className="font-medium">Kate Hu</span>
                        <span className="text-gray-500 ml-2">@上海KKK国际物流有限公司</span>
                        <span className="text-gray-400 ml-2 text-sm">11-01 04:29</span>
                      </div>
                      <div className="message-text">
                        <p>很多的率先发文XXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
                      </div>
                      <div className="mt-2">
                        <div className="bg-blue-50 p-2 rounded flex">
                          <img src="https://source.unsplash.com/random/300x300/?airplane,cargo" alt="Attachment" className="w-16 h-16 object-cover mr-2" />
                          <Button type="text" size="small">回复</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="message-item flex mb-6">
                    <div className="message-avatar bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span>U</span>
                    </div>
                    <div className="message-content flex-grow">
                      <div className="mb-1">
                        <span className="font-medium">Judy Wu</span>
                        <span className="text-gray-500 ml-2">@上海得普赛国际物流有限公司</span>
                        <span className="text-gray-400 ml-2 text-sm">11-01 04:29</span>
                      </div>
                      <div className="message-text">
                        <p>很多的率先发文XXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="message-item flex mb-6">
                    <div className="message-avatar bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span>U</span>
                    </div>
                    <div className="message-content flex-grow">
                      <div className="mb-1">
                        <span className="font-medium">Judy Wu</span>
                        <span className="text-gray-500 ml-2">@上海得普赛国际物流有限公司</span>
                        <span className="text-gray-400 ml-2 text-sm">11-01 04:29</span>
                      </div>
                      <div className="message-text">
                        <p>很多的率先发文XXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane key="概览" title="概览">
                {/* 基本信息 */}
                <div className="border-b pb-4 mb-4">
                  <div className="text-base font-medium text-blue-700 mb-4">基本信息</div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-y-3">
                                             <div className="text-gray-500 font-semibold">船名:</div>
                       <div>EMMA MAERSK</div>
                       
                       <div className="text-gray-500 font-semibold">承运人:</div>
                       <div>MSK-马士基</div>
                       
                       <div className="text-gray-500 font-semibold">码头:</div>
                       <div>外二</div>
                       
                       <div className="text-gray-500 font-semibold">截关时间:</div>
                       <div>2024-12-23 15:00</div>
                       
                       <div className="text-gray-500 font-semibold">ETD:</div>
                       <div>2024-12-23 15:00</div>
                       
                       <div className="text-gray-500 font-semibold">订单创建时间:</div>
                       <div>2024-12-23 15:00</div>
                    </div>
                    
                                         <div className="grid grid-cols-2 gap-y-3">
                       <div className="text-gray-500 font-semibold">航次:</div>
                       <div>1123E</div>
                       
                       <div className="text-gray-500 font-semibold">航线代码:</div>
                       <div>TP18</div>
                       
                       <div className="text-gray-500 font-semibold">进港代码:</div>
                       <div>USLG2</div>
                       
                       <div className="text-gray-500 font-semibold">截关时间:</div>
                       <div>2024-12-23 15:00</div>
                       
                       <div className="text-gray-500 font-semibold">ETA:</div>
                       <div>2024-12-23 15:00</div>
                       
                       <div className="text-gray-500 font-semibold">创建人:</div>
                       <div>Kate Hu</div>
                     </div>
                  </div>
                </div>
                
                {/* 路径信息 */}
                <div className="border-b pb-4 mb-4">
                  <div className="text-base font-medium text-blue-700 mb-4">路径信息</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                                                     <th className="pb-2 text-left font-semibold text-gray-500">起运港</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">目的港</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">中转港</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">中转港2</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">预计航程</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">运输条款</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">运输模式</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3">
                            <div>Shanghai</div>
                            <div className="text-gray-500">CNSHA</div>
                          </td>
                          <td className="py-3">
                            <div>Ho Chi Mihn</div>
                            <div className="text-gray-500">VNSGN</div>
                          </td>
                          <td className="py-3">
                            <div>Singapore</div>
                            <div className="text-gray-500">SGSIN</div>
                          </td>
                          <td className="py-3">N/A</td>
                          <td className="py-3">12天</td>
                          <td className="py-3">CY - CY</td>
                          <td className="py-3">FCL</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* 货物信息 */}
                <div className="border-b pb-4 mb-4">
                  <div className="text-base font-medium text-blue-700 mb-4">货物信息</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                                                     <th className="pb-2 text-left font-semibold text-gray-500"></th>
                           <th className="pb-2 text-left font-semibold text-gray-500">件数</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">单位</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">毛重</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">体积</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">类型</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">明细</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-500">订舱数据</td>
                          <td className="py-3">1560</td>
                          <td className="py-3">
                            <div>Packages</div>
                            <div className="text-gray-500">PK</div>
                          </td>
                          <td className="py-3">
                            <div>12000.00</div>
                            <div className="text-gray-500">KGS</div>
                          </td>
                          <td className="py-3">
                            <div>63.4</div>
                            <div className="text-gray-500">CBM</div>
                          </td>
                          <td className="py-3">普通货物</td>
                          <td className="py-3">
                            <ViewButton />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-500">截关数据</td>
                          <td className="py-3">1560</td>
                          <td className="py-3">
                            <div>Packages</div>
                            <div className="text-gray-500">PK</div>
                          </td>
                          <td className="py-3">
                            <div>12000.00</div>
                            <div className="text-gray-500">KGS</div>
                          </td>
                          <td className="py-3">
                            <div>63.4</div>
                            <div className="text-gray-500">CBM</div>
                          </td>
                          <td className="py-3">普通货物</td>
                          <td className="py-3">
                            <ViewButton />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* 集装箱信息 */}
                <div className="border-b pb-4 mb-4">
                  <div className="text-base font-medium text-blue-700 mb-4">集装箱信息</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                                                     <th className="pb-2 text-left font-semibold text-gray-500">箱号</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">封号</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">箱型</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">皮重</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">箱度</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">装箱照片</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3">BURU6619767</td>
                          <td className="py-3">B002809</td>
                          <td className="py-3">
                            <div>Packages</div>
                            <div className="text-gray-500">PK</div>
                          </td>
                          <td className="py-3">
                            <div>12000.00</div>
                            <div className="text-gray-500">KGS</div>
                          </td>
                          <td className="py-3">COC</td>
                          <td className="py-3">
                            <ViewButton />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3">BURU6619767</td>
                          <td className="py-3">B002809</td>
                          <td className="py-3">
                            <div>Packages</div>
                            <div className="text-gray-500">PK</div>
                          </td>
                          <td className="py-3">
                            <div>12000.00</div>
                            <div className="text-gray-500">KGS</div>
                          </td>
                          <td className="py-3">COC</td>
                          <td className="py-3">
                            <ViewButton />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* 参考编号 */}
                <div className="border-b pb-4 mb-4">
                  <div className="text-base font-medium text-blue-700 mb-4">参考编号</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                                                     <th className="pb-2 text-left font-semibold text-gray-500">订单号</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">自定义编号</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">订舱号</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">MBL单号</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">HBL单号</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">AMS No</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">ISF No</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3">
                            <div>ACL12345678</div>
                            <div>00001</div>
                          </td>
                          <td className="py-3">B002809</td>
                          <td className="py-3">1200536200</td>
                          <td className="py-3">
                            <div>ODLU11223</div>
                            <div>3445500</div>
                          </td>
                          <td className="py-3">
                            <div>LYTTSE24SHA</div>
                            <div>11223301</div>
                          </td>
                          <td className="py-3">
                            <div>LYTTSESA</div>
                            <div>11223301</div>
                          </td>
                          <td className="py-3"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* 关联方信息 */}
                <div>
                  <div className="text-base font-medium text-blue-700 mb-4">关联方信息</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                                                     <th className="pb-2 text-left font-semibold text-gray-500">地址</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">地址</th>
                           <th className="pb-2 text-left font-semibold text-gray-500">详细</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-500">发货人</td>
                          <td className="py-3">
                            <div>YIWU CITY XUAN YUAN IMPORT AND</div>
                            <div>EXPORT CO., LTD</div>
                          </td>
                          <td className="py-3">
                            <div>ADDRESS:ROOM 302, NO.498, KUZHUTANG VILLAGE, SHANGXI TOWN,</div>
                            <div>YIWU CITY, JINHUA CITY, ZHEJIANG PROVINCE</div>
                          </td>
                          <td className="py-3">
                            <ViewButton />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-500">收货人</td>
                          <td className="py-3">NEW HEROS INC</td>
                          <td className="py-3">
                            <div>301 S GLENDORA AVE WEST COVINA CA 91790</div>
                            <div>30-140045700</div>
                          </td>
                          <td className="py-3">
                            <ViewButton />
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-500">通知人</td>
                          <td className="py-3">NEW HEROS INC</td>
                          <td className="py-3">
                            <div>301 S GLENDORA AVE WEST COVINA CA 91790</div>
                            <div>30-140045700</div>
                          </td>
                          <td className="py-3">
                            <ViewButton />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-500">通知人2</td>
                          <td className="py-3">-</td>
                          <td className="py-3">-</td>
                          <td className="py-3"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPane>
              <TabPane key="文件" title="文件">
                <div className="flex justify-between mb-4">
                  <div className="flex space-x-4">
                    {/* 文件名搜索 */}
                    <Input 
                      placeholder="搜索文件名"
                      className="w-48"
                      allowClear
                    />
                    <div className="relative">
                      {/* 节点筛选下拉菜单 */}
                      <Button 
                        className="w-32 flex justify-between items-center"
                        onClick={() => {
                          const dropdown = document.getElementById('nodeFilterDropdown');
                          if (dropdown) {
                            dropdown.classList.toggle('hidden');
                          }
                        }}
                      >
                        节点筛选 <IconDown className="text-xs" />
                      </Button>
                      <div 
                        id="nodeFilterDropdown"
                        className="absolute left-0 top-full mt-1 w-32 bg-white shadow-lg rounded z-50 hidden"
                      >
                        <div 
                          className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            document.getElementById('nodeFilterDropdown')?.classList.add('hidden');
                          }}
                        >订舱</div>
                        <div 
                          className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            document.getElementById('nodeFilterDropdown')?.classList.add('hidden');
                          }}
                        >报关</div>
                        <div 
                          className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            document.getElementById('nodeFilterDropdown')?.classList.add('hidden');
                          }}
                        >拖车</div>
                        <div 
                          className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            document.getElementById('nodeFilterDropdown')?.classList.add('hidden');
                          }}
                        >仓库</div>
                        <div 
                          className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            document.getElementById('nodeFilterDropdown')?.classList.add('hidden');
                          }}
                        >VGM</div>
                        <div 
                          className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            document.getElementById('nodeFilterDropdown')?.classList.add('hidden');
                          }}
                        >补料</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="outline" icon={<IconDown />}>下载全部</Button>
                  </div>
                </div>
                
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 text-left w-12">
                        <input type="checkbox" className="form-checkbox" />
                      </th>
                      <th className="py-3 text-left text-blue-600 font-semibold">文件名</th>
                      <th className="py-3 text-left text-gray-500 font-semibold">上传人</th>
                      <th className="py-3 text-left text-gray-500 font-semibold">上传时间</th>
                      <th className="py-3 text-left w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 使用循环渲染表格行，这里为了演示使用静态数据 */}
                    {[1, 2, 3, 4, 5, 6, 7].map((_, index) => {
                      const menuId = getMenuId('file_menu', index);
                      const isEven = index % 2 === 0;
                      
                      return (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-4">
                            <input type="checkbox" className="form-checkbox" />
                          </td>
                          <td className="py-4">
                            <div className="text-blue-600">{isEven ? '订舱-上传BC件' : '报关-上传报关资料'}</div>
                            <div className="text-gray-500 text-sm">
                              {isEven ? 'ACL-Booking-FLEX-1198464.pdf' : '1198464-Shipping-Instructions-20211015T022845.pdf'}
                            </div>
                          </td>
                          <td className="py-4">
                            <div>Kate Hu</div>
                            <div className="text-gray-500 text-sm">@上海KKK国际物流有限公司</div>
                          </td>
                          <td className="py-4">
                            <div>2024-12-25</div>
                            <div className="text-gray-500 text-sm">16:02:00</div>
                          </td>
                          <td className="py-4 text-center relative">
                            <Button 
                              type="text" 
                              className="text-gray-400 file-menu-btn"
                              onClick={() => handleMenuClick(menuId)}
                            >...</Button>
                            <div 
                              className={`file-menu-dropdown absolute right-2 top-full mt-1 w-32 bg-white shadow-lg rounded z-50 ${activeMenuId === menuId ? '' : 'hidden'}`}
                            >
                              <div 
                                className="flex items-center py-2 px-3 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  // 执行下载操作
                                  // ...
                                  // 关闭菜单
                                  setActiveMenuId(null);
                                }}
                              >
                                <IconDown className="mr-2 text-gray-600" />
                                <span>下载文件</span>
                              </div>
                              <div 
                                className="flex items-center py-2 px-3 hover:bg-gray-100 cursor-pointer text-red-500"
                                onClick={() => {
                                  // 执行删除操作
                                  // ...
                                  // 关闭菜单
                                  setActiveMenuId(null);
                                }}
                              >
                                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                                <span>删除文件</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TabPane>
            </Tabs>
          </Card>


        </div>

        {/* 右侧侧边栏 */}
        {!nodeAreaCollapsed && (
          <div className="col-span-1">
            <Card className="shadow-sm border-0">
              <div className="border-b pb-3 mb-4 flex items-center justify-between">
                <div className="flex">
                  <div className={`cursor-pointer px-4 py-2 ${nodeTab === 'business' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600'}`} onClick={() => setNodeTab('business')}>
                    业务节点
                  </div>
                  <div className={`cursor-pointer px-4 py-2 ${nodeTab === 'shipping' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600'}`} onClick={() => setNodeTab('shipping')}>
                    运踪节点
                  </div>
                </div>
                <div 
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 shadow-lg rounded-l-lg p-3 text-white transition-all duration-200 border border-r-0 border-blue-500 hover:border-blue-600 flex items-center justify-center fixed right-0 top-1/2 transform -translate-y-1/2 z-50"
                  onClick={() => setNodeAreaCollapsed(!nodeAreaCollapsed)}
                  title="收起节点区域"
                >
                  <IconRight className="text-lg" />
                </div>
              </div>
              <div className="transition-all duration-300 ease-in-out">
                {nodeTab === 'business' ? renderNodes(businessNodes) : renderNodes(shippingNodes)}
              </div>
            </Card>
          </div>
        )}
        
        {/* 收起状态下的展开按钮 */}
        {nodeAreaCollapsed && (
          <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
            <div 
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 shadow-lg rounded-l-lg p-3 text-white transition-all duration-200 border border-r-0 border-blue-500 hover:border-blue-600 flex items-center justify-center"
              onClick={() => setNodeAreaCollapsed(!nodeAreaCollapsed)}
              title="展开节点区域"
            >
              <IconLeft className="text-lg" />
            </div>
            {/* 添加一个小的文字提示 */}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              点击展开节点区域
            </div>
          </div>
        )}
      </div>

      {/* 跳过任务确认弹窗 */}
       <Modal
         title="跳过任务"
         visible={skipConfirmVisible}
         onOk={confirmSkipTask}
         onCancel={cancelSkipTask}
         okText="确认跳过"
         cancelText="取消"
         okButtonProps={{ type: 'primary' }}
         autoFocus={false}
         focusLock={true}
       >
         <div style={{ padding: '16px 0' }}>
           <Typography.Text>
             跳过任务，将直接将此节点标记为完成，无需后续操作，确认跳过？
           </Typography.Text>
         </div>
       </Modal>
    </div>
  );
};

export default OrderDetail;