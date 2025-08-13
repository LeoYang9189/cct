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
  Modal
} from '@arco-design/web-react';
import {   IconLeft,  IconEdit,  IconCopy,  IconClose,  IconSend,  IconRight,  IconDown} from '@arco-design/web-react/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, 
  faFileInvoice, 
  faMoneyBillWave, 
  faAnchor, 
  faTruck, 
  faWarehouse, 
  faFileContract, 
  faWeightHanging, 
  faClipboardList, 
  faFileInvoiceDollar, 
  faReceipt, 
  faShippingFast,
  faShip,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

const { Title } = Typography;
const CollapseItem = Collapse.Item;
const TabPane = Tabs.TabPane;

interface OrderDetailProps {}

// 业务流程节点类型
type NodeStatus = 'completed' | 'active' | 'pending';

// 节点数据类型
interface NodeItem {
  id: string;
  title: string;
  icon: any; // FontAwesome图标
  status: NodeStatus;
  date: string;
  active: boolean;
}

// 业务节点数据
const businessNodes: NodeItem[] = [
  { id: '1', title: '创建订单', icon: faFileAlt, status: 'completed', date: '2024-12-21 17:25', active: true },
  { id: '2', title: '运价', icon: faMoneyBillWave, status: 'completed', date: '2024-12-21 17:25', active: true },
  { id: '3', title: '订舱', icon: faAnchor, status: 'active', date: '2024-12-21 17:25', active: true },
  { id: '4', title: '拖车', icon: faTruck, status: 'pending', date: '', active: false },
  { id: '5', title: '仓库', icon: faWarehouse, status: 'pending', date: '', active: false },
  { id: '6', title: '报关', icon: faFileContract, status: 'pending', date: '', active: false },
  { id: '7', title: 'VGM', icon: faWeightHanging, status: 'pending', date: '', active: false },
  { id: '8', title: '提单补料', icon: faClipboardList, status: 'pending', date: '', active: true },
  { id: '9', title: '账单', icon: faFileInvoiceDollar, status: 'pending', date: '', active: false },
  { id: '10', title: '发票', icon: faFileInvoice, status: 'pending', date: '', active: false },
  { id: '11', title: '水单', icon: faReceipt, status: 'pending', date: '', active: false },
  { id: '12', title: '提单', icon: faShippingFast, status: 'pending', date: '', active: false }
];

// 运踪节点数据
const shippingNodes: NodeItem[] = [
  { id: 's1', title: '报关', icon: faFileContract, status: 'completed', date: '2024-12-21 17:25', active: true },
  { id: 's2', title: '海上订舱', icon: faAnchor, status: 'completed', date: '2024-12-21 17:25', active: true },
  { id: 's3', title: '港区单证', icon: faFileAlt, status: 'active', date: '2024-12-21 17:25', active: true },
  { id: 's4', title: '车辆进场', icon: faTruck, status: 'pending', date: '', active: false },
  { id: 's5', title: '装卸作业', icon: faWarehouse, status: 'pending', date: '', active: false },
  { id: 's6', title: '船舶靠离', icon: faShip, status: 'pending', date: '', active: false },
  { id: 's7', title: '离港开航', icon: faShippingFast, status: 'pending', date: '', active: false },
  { id: 's8', title: '在途追踪', icon: faShip, status: 'pending', date: '', active: false },
  { id: 's9', title: '抵达目的港', icon: faAnchor, status: 'pending', date: '', active: false },
  { id: 's10', title: '海关', icon: faFileContract, status: 'pending', date: '', active: false },
  { id: 's11', title: '送货', icon: faTruck, status: 'pending', date: '', active: false }
];

const OrderDetail: React.FC<OrderDetailProps> = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  /**
   * 处理跳过任务的确认弹窗
   * @param taskName 任务名称
   */
  const handleSkipTask = (taskName: string) => {
    console.log('handleSkipTask 被调用，任务名称:', taskName);
    alert(`跳过任务: ${taskName}`);
    Modal.confirm({
      title: '跳过任务',
      content: `跳过任务，将直接将此节点标记为完成，无需后续操作，确认跳过？`,
      onOk: () => {
        console.log('确认跳过任务:', taskName);
        // 这里可以添加实际的跳过任务逻辑
      },
      onCancel: () => {
        console.log('取消跳过任务:', taskName);
      }
    });
  };
  // 注释掉未使用的状态变量
  // const [activeKey, setActiveKey] = useState<string[]>(['1', '2', '3']);
  const [message, setMessage] = useState<string>('');
  const [nodeTab, setNodeTab] = useState<string>('business');
  const [activeKeys, setActiveKeys] = useState<string[]>(['3', '8']);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
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

  const renderNodeContent = (node: NodeItem) => {
    if (node.id === '3') { // 订舱节点
      return (
        <div className="mt-3 px-4 pb-4">
          <div className="grid grid-cols-12 text-sm mb-3">
            <div className="col-span-4 text-gray-500">当前状态:</div>
            <div className="col-span-8 font-medium">已订舱待确认</div>
          </div>
          <div className="grid grid-cols-12 text-sm mb-3">
            <div className="col-span-4 text-gray-500">状态时间:</div>
            <div className="col-span-8">2024-12-21 17:25</div>
          </div>
          <div className="grid grid-cols-12 text-sm mb-3">
            <div className="col-span-4 text-gray-500">待办任务:</div>
            <div className="col-span-8 text-blue-600 font-medium">上传订舱确认</div>
          </div>
          <div className="grid grid-cols-12 text-sm">
            <div className="col-span-4 text-gray-500">任务人:</div>
            <div className="col-span-8">
              <div className="font-medium">Stella Wu</div>
              <div className="text-gray-500 text-xs mt-1">@上海得普赛国际货运代理有限公司</div>
            </div>
          </div>
        </div>
      );
    }
    
    if (node.id === '8') { // 提单补料节点
      return (
        <div className="mt-3 px-4 pb-4">
          <div className="grid grid-cols-12 text-sm mb-3">
            <div className="col-span-4 text-gray-500">当前状态:</div>
            <div className="col-span-8 font-medium">已确认</div>
          </div>
          <div className="grid grid-cols-12 text-sm mb-3">
            <div className="col-span-4 text-gray-500">状态时间:</div>
            <div className="col-span-8">2024-12-21 17:25</div>
          </div>
          <div className="grid grid-cols-12 text-sm mb-3">
            <div className="col-span-4 text-gray-500">待办任务:</div>
            <div className="col-span-8 text-blue-600 font-medium">上传提单样件</div>
          </div>
          <div className="grid grid-cols-12 text-sm">
            <div className="col-span-4 text-gray-500">任务人:</div>
            <div className="col-span-8">
              <div className="font-medium">Steve Wu</div>
              <div className="text-gray-500 text-xs mt-1">@上海XXX货运代理</div>
            </div>
          </div>
        </div>
      );
    }
    
    // 业务节点中ID为2的节点
    if (node.id === '2') {
      return (
        <div className="mt-3 px-4 pb-4">
          <div className="grid grid-cols-12 text-sm mb-3">
            <div className="col-span-4 text-gray-500">当前状态:</div>
            <div className="col-span-8 font-medium">已接价待确认</div>
          </div>
          <div className="grid grid-cols-12 text-sm mb-3">
            <div className="col-span-4 text-gray-500">状态时间:</div>
            <div className="col-span-8">2024-12-21 17:25</div>
          </div>
          <div className="grid grid-cols-12 text-sm mb-3">
            <div className="col-span-4 text-gray-500">待办任务:</div>
            <div className="col-span-8 text-blue-600 font-medium">确认报价</div>
          </div>
          <div className="grid grid-cols-12 text-sm">
            <div className="col-span-4 text-gray-500">任务人:</div>
            <div className="col-span-8">
              <div className="font-medium">Steve Wu</div>
              <div className="text-gray-500 text-xs mt-1">@上海XXX货运代理</div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const StatusIcon = ({ status, icon }: { status: NodeStatus, icon: any }) => {
    const bgColor = status === 'completed' ? 'bg-blue-500' : 
                   status === 'active' ? 'bg-blue-500' : 'bg-gray-300';
    
    return (
      <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center text-white shadow-sm`}>
        <FontAwesomeIcon icon={icon} className="text-sm" />
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
          const isActive = node.status === 'active';
          const isPending = node.status === 'pending';
          
          // 展开状态
          const isExpanded = activeKeys.includes(node.id);
          
          return (
            <div key={node.id} className="mb-5 relative">
              {/* 节点图标 */}
              <div className="absolute left-0 z-10">
                <StatusIcon status={node.status} icon={node.icon} />
              </div>
              
              {/* 节点卡片 */}
              <div className="ml-12">
                <div 
                  className={`border rounded-lg ${isExpanded ? 'border-blue-200 bg-blue-50 shadow-sm' : 'border-gray-200'} overflow-hidden transition-all duration-200 ease-in-out hover:shadow-sm`}
                  onClick={() => {
                    if (node.active) {
                      setActiveKeys(
                        isExpanded 
                          ? activeKeys.filter(key => key !== node.id)
                          : [...activeKeys, node.id]
                      );
                    }
                  }}
                >
                  {/* 卡片头部 */}
                  <div className={`px-4 py-3 flex justify-between items-center ${node.active ? 'cursor-pointer' : ''}`}>
                    <div className="flex items-center space-x-2">
                      <div className="text-base font-medium">
                        {node.title}
                      </div>
                      {isActive && (
                        <Tag color="orange" size="small" className="border border-orange-200">进行中</Tag>
                      )}
                      {isCompleted && (
                        <Tag color="blue" size="small" className="border border-blue-200">已完成</Tag>
                      )}
                      {isPending && (
                        <Tag color="gray" size="small" className="border border-gray-200">待处理</Tag>
                      )}
                    </div>
                    <div className="flex items-center">
                      {/* 缩起状态下在卡片内显示日期 */}
                      {!isExpanded && node.date && (
                        <div className="text-xs text-gray-500 mr-3">
                          {node.date}
                        </div>
                      )}
                      {node.active && (
                        <div className="text-gray-400 hover:text-blue-500 transition-colors">
                          {isExpanded ? <IconDown /> : <IconRight />}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 卡片内容 */}
                  {isExpanded && (
                    <div className="border-t border-blue-100">
                      {renderNodeContent(node)}
                    </div>
                  )}
                </div>
                
                {/* 节点日期 - 只在未展开且有日期时显示（这部分被替换，所以实际不显示了） */}
                {false && node.date && !isExpanded && (
                  <div className="mt-1 ml-3 text-xs text-gray-500">
                    {node.date}
                  </div>
                )}
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

      <div className="grid grid-cols-3 gap-4">
        {/* 左侧内容 */}
        <div className="col-span-2">
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
                      <Title heading={6} style={{ margin: 0 }}>未完成任务（12）</Title>
                    </div>
                  }
                  name="1"
                >
                  {/* 客户端版未完成任务 */}
                  {[
                    { name: '提交询价', deadline: 'Nov 10, 2021 17:00', executor: '华为技术有限公司', generated: 'Nov 09, 2021 10:00' },
                    { name: '提交订舱', deadline: 'Nov 12, 2021 14:00', executor: '阿里巴巴集团', generated: 'Nov 11, 2021 09:30' },
                    { name: '提交拖车订单', deadline: 'Nov 15, 2021 16:30', executor: '腾讯科技有限公司', generated: 'Nov 13, 2021 10:15' },
                    { name: '提交进仓申请', deadline: 'Nov 18, 2021 12:00', executor: '比亚迪股份有限公司', generated: 'Nov 16, 2021 14:20' },
                    { name: '提交报关资料', deadline: 'Nov 20, 2021 15:30', executor: '海康威视数字技术股份有限公司', generated: 'Nov 18, 2021 11:45' },
                    { name: '提交舱单', deadline: 'Nov 22, 2021 10:00', executor: '小米集团', generated: 'Nov 20, 2021 16:30' },
                    { name: '提交VGM', deadline: 'Nov 25, 2021 13:45', executor: '京东集团', generated: 'Nov 23, 2021 09:15' },
                    { name: '提交补料', deadline: 'Nov 28, 2021 11:20', executor: '宁德时代新能源科技股份有限公司', generated: 'Nov 26, 2021 14:50' },
                    { name: '确认账单', deadline: 'Dec 01, 2021 16:00', executor: '中国平安保险集团股份有限公司', generated: 'Nov 29, 2021 10:30' },
                    { name: '确认发票', deadline: 'Dec 03, 2021 14:15', executor: '招商银行股份有限公司', generated: 'Dec 01, 2021 12:45' },
                    { name: '确认提单', deadline: 'Dec 05, 2021 17:30', executor: '中国建设银行股份有限公司', generated: 'Dec 03, 2021 15:20' },
                    { name: '确认收货', deadline: 'Dec 08, 2021 10:45', executor: '中国工商银行股份有限公司', generated: 'Dec 06, 2021 13:10' }
                  ].map((task, index) => (
                    <div key={index} className={index < 11 ? "border-b pb-4 mb-4 border-gray-200" : ""}>
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
                            icon={<IconSend />}
                            onClick={() => navigate(`/controltower/bl-addition/${orderId || 'DEFAULT'}`)}
                          >处理</Button>
                          <Button 
                            type="outline" 
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
                      <Title heading={6} style={{ margin: 0 }}>已完成任务（12）</Title>
                    </div>
                  }
                  name="1"
                >
                  {/* 客户端版已完成任务 */}
                  {[
                    { name: '提交询价', completedTime: 'Oct 15, 2021 09:30', executor: '华为技术有限公司', deadline: 'Oct 15, 2021 17:00' },
                    { name: '提交订舱', completedTime: 'Oct 18, 2021 11:45', executor: '阿里巴巴集团', deadline: 'Oct 18, 2021 14:00' },
                    { name: '提交拖车订单', completedTime: 'Oct 20, 2021 14:20', executor: '腾讯科技有限公司', deadline: 'Oct 20, 2021 16:30' },
                    { name: '提交进仓申请', completedTime: 'Oct 22, 2021 10:15', executor: '比亚迪股份有限公司', deadline: 'Oct 22, 2021 12:00' },
                    { name: '提交报关资料', completedTime: 'Oct 25, 2021 13:30', executor: '海康威视数字技术股份有限公司', deadline: 'Oct 25, 2021 15:30' },
                    { name: '提交舱单', completedTime: 'Oct 28, 2021 08:45', executor: '小米集团', deadline: 'Oct 28, 2021 10:00' },
                    { name: '提交VGM', completedTime: 'Oct 30, 2021 12:20', executor: '京东集团', deadline: 'Oct 30, 2021 13:45' },
                    { name: '提交补料', completedTime: 'Nov 02, 2021 09:50', executor: '宁德时代新能源科技股份有限公司', deadline: 'Nov 02, 2021 11:20' },
                    { name: '确认账单', completedTime: 'Nov 05, 2021 15:10', executor: '中国平安保险集团股份有限公司', deadline: 'Nov 05, 2021 16:00' },
                    { name: '确认发票', completedTime: 'Nov 08, 2021 12:35', executor: '招商银行股份有限公司', deadline: 'Nov 08, 2021 14:15' },
                    { name: '确认提单', completedTime: 'Nov 10, 2021 16:45', executor: '中国建设银行股份有限公司', deadline: 'Nov 10, 2021 17:30' },
                    { name: '确认收货', completedTime: 'Nov 12, 2021 09:20', executor: '中国工商银行股份有限公司', deadline: 'Nov 12, 2021 10:45' }
                  ].map((task, index) => (
                    <div key={index} className={index < 11 ? "border-b pb-4 mb-4 border-gray-200" : ""}>
                      <div className="grid grid-cols-4 gap-4 mt-3 relative">
                        <div className="border-r border-gray-200 pr-4">
                          <div className="text-gray-500 mb-1">完成时间</div>
                          <div className="font-medium">{task.completedTime}</div>
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
                          <div className="font-medium text-green-600">已完成 <span className="text-xs text-gray-500 ml-1">完成于 {task.completedTime}</span></div>
                        </div>
                        
                        {/* 查看按钮放在最右侧 */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                          <Button 
                            type="outline" 
                            onClick={() => console.log('查看任务:', task.name)}
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
                      className="w-48"
                      placeholder="搜索文件名..."
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
                        >全部</div>
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
                        >提单补料</div>
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
        <div className="col-span-1">
          <Card className="shadow-sm border-0">
            <div className="border-b pb-3 mb-4 flex">
              <div className={`cursor-pointer px-4 py-2 ${nodeTab === 'business' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600'}`} onClick={() => setNodeTab('business')}>
                业务节点
              </div>
              <div className={`cursor-pointer px-4 py-2 ${nodeTab === 'shipping' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600'}`} onClick={() => setNodeTab('shipping')}>
                运踪节点
              </div>
            </div>
            {nodeTab === 'business' ? renderNodes(businessNodes) : renderNodes(shippingNodes)}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;