import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  // useReactFlow,
  Panel,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, Button, Modal, Form, Input, Select, Message, Switch, Popconfirm, Upload } from '@arco-design/web-react';
import { IconPlus, IconEdit, IconDelete, IconUpload } from '@arco-design/web-react/icon';

const { Option } = Select;

// 任务类型定义
type TaskType = 'customer' | 'operation';
type PositionType = 'sales' | 'service' | 'documentation' | 'operation' | 'business';

interface Task {
  id: string;
  name: string;
  type: TaskType;
  position?: PositionType;
  skippable: boolean;
  relatedPage?: {
    name: string;
    url: string;
  };
}

// 业务节点数据类型
interface BusinessNodeData {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  icon?: string;
  tasks: Task[];
}

// 自定义业务节点组件 - 完全复制原来的renderNodeCard样式和功能
const BusinessNode: React.FC<{ 
  data: BusinessNodeData; 
  selected: boolean;
  onEdit?: (node: BusinessNodeData) => void;
  onDelete?: (nodeId: string) => void;
  onToggle?: (nodeId: string, enabled: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ data, selected, onEdit, onDelete, onToggle, isFirst, isLast }) => {
  // const [showConnector, setShowConnector] = useState(false);
  
  return (
    <div 
      className={`business-node ${selected ? 'selected' : ''}`}
      // onMouseEnter={() => setShowConnector(true)}
      // onMouseLeave={() => setShowConnector(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* 节点卡片 - 完全复制原来的样式 */}
      <Card
        style={{
          width: '280px',
          minHeight: '160px',
          border: data.enabled ? '1px solid #bae7ff' : '1px solid #f0f0f0',
          backgroundColor: data.enabled ? '#f0f8ff' : '#ffffff',
          cursor: 'pointer',
          borderRadius: '16px',
          boxShadow: data.enabled
            ? '0 8px 24px rgba(24, 144, 255, 0.12)'
            : '0 4px 16px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'visible'
        }}
        size="small"
        hoverable
        onClick={() => onEdit?.(data)}
        onMouseEnter={(e) => {
          if (data.enabled) {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(24, 144, 255, 0.2)';
            e.currentTarget.style.borderColor = '#91d5ff';
          } else {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderColor = '#d9d9d9';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = data.enabled
            ? '0 8px 24px rgba(24, 144, 255, 0.12)'
            : '0 4px 16px rgba(0, 0, 0, 0.04)';
          e.currentTarget.style.borderColor = data.enabled ? '#bae7ff' : '#f0f0f0';
        }}
      >
        {/* 左侧状态指示器 */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '0',
          width: '4px',
          height: '40px',
          borderRadius: '0 4px 4px 0',
          background: data.enabled
            ? 'linear-gradient(180deg, #1890ff, #40a9ff)'
            : '#d9d9d9',
          boxShadow: data.enabled
            ? '0 0 12px rgba(24, 144, 255, 0.6), 0 0 24px rgba(24, 144, 255, 0.3)'
            : 'none'
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingLeft: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              {/* 节点图标 */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: data.enabled ? '#e6f7ff' : '#f5f5f5',
                border: `1px solid ${data.enabled ? '#91d5ff' : '#d9d9d9'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                overflow: 'hidden'
              }}>
                {data.icon ? (
                  <img 
                    src={data.icon} 
                    alt={data.name}
                    style={{
                      width: '20px',
                      height: '20px',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <IconPlus 
                    style={{
                      fontSize: '16px',
                      color: data.enabled ? '#1890ff' : '#8c8c8c'
                    }}
                  />
                )}
              </div>
              <span style={{
                fontWeight: '600',
                fontSize: '16px',
                color: data.enabled ? '#262626' : '#8c8c8c',
                lineHeight: '1.3',
                letterSpacing: '0.02em'
              }}>
                {data.name}
              </span>
            </div>

            {/* 任务数量显示 */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                backgroundColor: data.enabled ? '#f0f9ff' : '#f5f5f5',
                border: `1px solid ${data.enabled ? '#bae7ff' : '#d9d9d9'}`,
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                color: data.enabled ? '#1890ff' : '#8c8c8c'
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: data.enabled ? '#1890ff' : '#d9d9d9',
                  marginRight: '6px'
                }} />
                {data.tasks.length} 个任务
              </div>
            </div>

            {data.description && (
              <div style={{
                fontSize: '12px',
                color: '#595959',
                lineHeight: '1.5',
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: data.enabled ? '#f9f9f9' : '#fafafa',
                borderRadius: '8px',
                border: `1px solid ${data.enabled ? '#e6f7ff' : '#f0f0f0'}`,
                fontStyle: 'italic'
              }}>
                {data.description}
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: '16px',
            gap: '8px'
          }}>
            <div style={{
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: data.enabled ? '#f0f9ff' : '#fafafa',
              border: `1px solid ${data.enabled ? '#d4edda' : '#e9ecef'}`
            }}>
              <Switch
                size="small"
                checked={data.enabled}
                onChange={(checked) => onToggle?.(data.id, checked)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Button
                type="text"
                size="mini"
                icon={<IconEdit />}
                style={{
                  color: '#1890ff',
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(data);
                }}
              />
              {!isFirst && !isLast && (
                <Popconfirm
                  title="确认删除节点"
                  content="删除后不可恢复，确定要删除这个业务节点吗？"
                  onOk={(e) => {
                    e?.stopPropagation();
                    onDelete?.(data.id);
                  }}
                  onCancel={(e) => {
                    e?.stopPropagation();
                  }}
                  okText="确定删除"
                  cancelText="取消"
                  position="top"
                >
                  <Button
                    type="text"
                    size="mini"
                    status="danger"
                    icon={<IconDelete />}
                    style={{
                      backgroundColor: 'rgba(255, 77, 79, 0.1)',
                      borderRadius: '6px',
                      width: '28px',
                      height: '28px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </Popconfirm>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {/* React Flow 连接点 */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#52c41a',
          border: '2px solid white',
          borderRadius: '50%'
        }}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#1890ff',
          border: '2px solid white',
          borderRadius: '50%'
        }}
      />
    </div>
  );
};

// 自定义连接线组件
const CustomEdge: React.FC<any> = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  // sourcePosition,
  // targetPosition,
  // data,
  markerEnd 
}) => {
  const [showAddButton, setShowAddButton] = useState(false);
  
  // 计算路径
  const edgePath = `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`;
  
  // 计算中点位置
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  return (
    <g>
      <path
        id={id}
        style={{ stroke: '#1890ff', strokeWidth: 2, fill: 'none' }}
        d={edgePath}
        markerEnd={markerEnd}
        onMouseEnter={() => setShowAddButton(true)}
        onMouseLeave={() => setShowAddButton(false)}
      />
      
      {/* 连接线上的加号按钮 */}
      {showAddButton && (
        <g>
          <circle
            cx={midX}
            cy={midY}
            r="12"
            fill="white"
            stroke="#1890ff"
            strokeWidth="2"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              // 触发插入节点事件
              const event = new CustomEvent('insertNode', {
                detail: { edgeId: id, position: { x: midX, y: midY } }
              });
              window.dispatchEvent(event);
            }}
          />
          <text
            x={midX}
            y={midY + 1}
            textAnchor="middle"
            fontSize="14"
            fill="#1890ff"
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => {
              const event = new CustomEvent('insertNode', {
                detail: { edgeId: id, position: { x: midX, y: midY } }
              });
              window.dispatchEvent(event);
            }}
          >
            +
          </text>
        </g>
      )}
    </g>
  );
};

// 创建一个包装组件来传递回调函数
const createBusinessNodeWrapper = (
  onEdit: (node: BusinessNodeData) => void,
  onDelete: (nodeId: string) => void,
  onToggle: (nodeId: string, enabled: boolean) => void
) => {
  return (props: any) => (
    <BusinessNode
      {...props}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggle={onToggle}
      isFirst={false}
      isLast={false}
    />
  );
};

// 连接线类型定义
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// 主要的流程编辑器组件
const FlowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState<BusinessNodeData | null>(null);
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState<Task[]>([]);

  // 关联页面选项
  const relatedPageOptions = [
    { label: '客户信息页', value: '/customer/info', url: '/customer/info' },
    { label: '订单管理页', value: '/order/management', url: '/order/management' },
    { label: '报价页面', value: '/quote/create', url: '/quote/create' },
    { label: '合同页面', value: '/contract/create', url: '/contract/create' },
    { label: '发货页面', value: '/shipping/create', url: '/shipping/create' },
  ];

  // 任务管理函数
  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: '',
      type: 'customer',
      skippable: false
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };
  
  // 切换节点启用状态
  const handleToggleNode = useCallback((nodeId: string, enabled: boolean) => {
    setNodes((nds) => 
      nds.map(node => 
        node.id === nodeId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                enabled 
              } 
            }
          : node
      )
    );
    Message.success(enabled ? '节点已启用' : '节点已禁用');
  }, [setNodes]);
  
  // 编辑节点
  const handleEditNode = useCallback((nodeData: BusinessNodeData) => {
    setEditingNode(nodeData);
    setTasks(nodeData.tasks || []);
    form.setFieldsValue({
      name: nodeData.name,
      description: nodeData.description,
      enabled: nodeData.enabled,
      icon: nodeData.icon
    });
    setModalVisible(true);
  }, [form]);
  
  // 删除节点
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(n => n.id !== nodeId));
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    Message.success('节点删除成功');
  }, [setNodes, setEdges]);
  
  // 节点类型定义
  const nodeTypes: NodeTypes = useMemo(() => ({
    businessNode: createBusinessNodeWrapper(handleEditNode, handleDeleteNode, handleToggleNode),
  }), [handleEditNode, handleDeleteNode, handleToggleNode]);
  
  // 初始化默认节点数据
  const initializeNodes = useCallback(() => {
    const defaultNodesData = [
      {
        id: 'node-1',
        name: '生产',
        description: '货物生产制造环节',
        enabled: true,
        tasks: [{ id: 'task-1', name: '生产制造', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-2',
        name: '运价',
        description: '计算运输价格',
        enabled: true,
        tasks: [{ id: 'task-2', name: '运价计算', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-3',
        name: '订舱',
        description: '预订船舱位置',
        enabled: true,
        tasks: [{ id: 'task-3', name: '舱位预订', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-4',
        name: '拖车',
        description: '安排拖车运输',
        enabled: true,
        tasks: [{ id: 'task-4', name: '拖车安排', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-5',
        name: '仓库',
        description: '货物仓储管理',
        enabled: true,
        tasks: [{ id: 'task-5', name: '仓储管理', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-6',
        name: '报关',
        description: '向海关申报货物',
        enabled: true,
        tasks: [{ id: 'task-6', name: '海关申报', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-7',
        name: '舱单',
        description: '制作货物舱单',
        enabled: true,
        tasks: [{ id: 'task-7', name: '舱单制作', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-8',
        name: 'VGM',
        description: '集装箱称重验证',
        enabled: true,
        tasks: [{ id: 'task-8', name: 'VGM称重', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-9',
        name: '补料',
        description: '客户补充相关资料',
        enabled: true,
        tasks: [{ id: 'task-9', name: '补充资料', type: 'customer' as const, skippable: true }]
      },
      {
        id: 'node-10',
        name: '账单',
        description: '生成费用账单',
        enabled: true,
        tasks: [{ id: 'task-10', name: '账单生成', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-11',
        name: '发票',
        description: '开具发票',
        enabled: true,
        tasks: [{ id: 'task-11', name: '发票开具', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-12',
        name: '提单',
        description: '签发提单',
        enabled: true,
        tasks: [{ id: 'task-12', name: '提单签发', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-13',
        name: '换单',
        description: '换取提货单',
        enabled: true,
        tasks: [{ id: 'task-13', name: '换单操作', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-14',
        name: '提柜',
        description: '提取集装箱',
        enabled: true,
        tasks: [{ id: 'task-14', name: '提柜操作', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-15',
        name: '送货',
        description: '货物配送',
        enabled: true,
        tasks: [{ id: 'task-15', name: '货物配送', type: 'operation' as const, skippable: false }]
      }
    ];
    
    // 创建节点 - 从左到右的流程布局
    const initialNodes: Node[] = defaultNodesData.map((nodeData, index) => {
      const nodeWidth = 300; // 节点宽度
      const nodeHeight = 180; // 节点高度
      const marginX = 80; // 水平间距
      const marginY = 100; // 垂直间距
      const startX = 100; // 起始X位置
      const startY = 100; // 起始Y位置
      
      let x, y;
      
      // 按照业务流程布局：生产→运价→订舱→(拖车、仓库、报关、舱单、VGM、补料)→账单→发票→提单→换单→提柜→送货
      if (index === 0) { // 生产
        x = startX;
        y = startY + 200;
      } else if (index === 1) { // 运价
        x = startX + (nodeWidth + marginX) * 1;
        y = startY + 200;
      } else if (index === 2) { // 订舱
        x = startX + (nodeWidth + marginX) * 2;
        y = startY + 200;
      } else if (index >= 3 && index <= 8) { // 拖车、仓库、报关、舱单、VGM、补料
         const parallelIndex = index - 3;
         // 所有并行节点排列在同一列
         x = startX + (nodeWidth + marginX) * 3;
         y = startY + parallelIndex * (nodeHeight + marginY * 0.7);
      } else if (index === 9) { // 账单
        x = startX + (nodeWidth + marginX) * 6;
        y = startY + 200;
      } else if (index === 10) { // 发票
        x = startX + (nodeWidth + marginX) * 7;
        y = startY + 200;
      } else if (index === 11) { // 提单
        x = startX + (nodeWidth + marginX) * 8;
        y = startY + 200;
      } else if (index === 12) { // 换单
        x = startX + (nodeWidth + marginX) * 9;
        y = startY + 200;
      } else if (index === 13) { // 提柜
        x = startX + (nodeWidth + marginX) * 10;
        y = startY + 200;
      } else { // 送货
        x = startX + (nodeWidth + marginX) * 11;
        y = startY + 200;
      }
      
      return {
        id: nodeData.id,
        type: 'businessNode',
        position: { x, y },
        data: nodeData,
        dragHandle: '.business-node',
      };
    });
    
    // 创建连接线 - 按照业务流程：生产→运价→订舱→(拖车、仓库、报关、舱单、VGM、补料)→账单→发票→提单→换单→提柜→送货
    const initialEdges: Edge[] = [
      // 生产 -> 运价
      { id: 'edge-1-2', source: 'node-1', target: 'node-2', type: 'custom' },
      // 运价 -> 订舱
      { id: 'edge-2-3', source: 'node-2', target: 'node-3', type: 'custom' },
      // 订舱 -> 拖车、仓库、报关、舱单、VGM、补料 (一对多连接)
      { id: 'edge-3-4', source: 'node-3', target: 'node-4', type: 'custom' },
      { id: 'edge-3-5', source: 'node-3', target: 'node-5', type: 'custom' },
      { id: 'edge-3-6', source: 'node-3', target: 'node-6', type: 'custom' },
      { id: 'edge-3-7', source: 'node-3', target: 'node-7', type: 'custom' },
      { id: 'edge-3-8', source: 'node-3', target: 'node-8', type: 'custom' },
      { id: 'edge-3-9', source: 'node-3', target: 'node-9', type: 'custom' },
      // 拖车、仓库、报关、舱单、VGM、补料 -> 账单 (多对一连接)
      { id: 'edge-4-10', source: 'node-4', target: 'node-10', type: 'custom' },
      { id: 'edge-5-10', source: 'node-5', target: 'node-10', type: 'custom' },
      { id: 'edge-6-10', source: 'node-6', target: 'node-10', type: 'custom' },
      { id: 'edge-7-10', source: 'node-7', target: 'node-10', type: 'custom' },
      { id: 'edge-8-10', source: 'node-8', target: 'node-10', type: 'custom' },
      { id: 'edge-9-10', source: 'node-9', target: 'node-10', type: 'custom' },
      // 账单 -> 发票
      { id: 'edge-10-11', source: 'node-10', target: 'node-11', type: 'custom' },
      // 发票 -> 提单
      { id: 'edge-11-12', source: 'node-11', target: 'node-12', type: 'custom' },
      // 提单 -> 换单
      { id: 'edge-12-13', source: 'node-12', target: 'node-13', type: 'custom' },
      // 换单 -> 提柜
      { id: 'edge-13-14', source: 'node-13', target: 'node-14', type: 'custom' },
      // 提柜 -> 送货
      { id: 'edge-14-15', source: 'node-14', target: 'node-15', type: 'custom' },
    ];
    
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);
  
  // 组件挂载时初始化
  React.useEffect(() => {
    initializeNodes();
  }, [initializeNodes]);
  
  // 处理连接
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        type: 'custom',
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );
  
  // 处理删除边（连接线）
  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      setEdges((eds) => eds.filter(edge => !edgesToDelete.find(e => e.id === edge.id)));
      Message.success(`已删除 ${edgesToDelete.length} 条连接线`);
    },
    [setEdges]
  );
  
  // 添加新节点
  const addNewNode = useCallback((position?: { x: number; y: number }) => {
    const newNodeId = `node-${Date.now()}`;
    
    // 如果没有指定位置，计算一个不重叠的位置
    let newPosition = position || { x: 200, y: 200 }; // 提供默认值
    if (!position) {
      const nodeWidth = 300;
      const nodeHeight = 200;
      const margin = 50;
      
      // 找到一个不与现有节点重叠的位置
      let attempts = 0;
      let foundPosition = false;
      
      while (!foundPosition && attempts < 20) {
        const x = Math.random() * (window.innerWidth - nodeWidth - 400) + 200;
        const y = Math.random() * (window.innerHeight - nodeHeight - 300) + 150;
        
        // 检查是否与现有节点重叠
        const overlapping = nodes.some(node => {
          const dx = Math.abs(node.position.x - x);
          const dy = Math.abs(node.position.y - y);
          return dx < nodeWidth + margin && dy < nodeHeight + margin;
        });
        
        if (!overlapping) {
          newPosition = { x, y };
          foundPosition = true;
        }
        attempts++;
      }
      
      // 如果找不到合适位置，使用默认位置
      if (!foundPosition) {
        newPosition = { x: 200 + nodes.length * 50, y: 200 + nodes.length * 30 };
      }
    }
    
    const newNode: Node = {
      id: newNodeId,
      type: 'businessNode',
      position: newPosition,
      data: {
        id: newNodeId,
        name: '新节点',
        description: '请编辑节点信息',
        enabled: true,
        tasks: []
      },
      dragHandle: '.business-node',
    };
    
    setNodes((nds) => [...nds, newNode]);
    setEditingNode(newNode.data);
    setModalVisible(true);
  }, [setNodes, nodes]);
  
  // 监听插入节点事件
  React.useEffect(() => {
    const handleInsertNode = (event: any) => {
      const { edgeId, position } = event.detail;
      
      // 找到要分割的边
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;
      
      // 创建新节点
      const newNodeId = `node-${Date.now()}`;
      const newNode: Node = {
        id: newNodeId,
        type: 'businessNode',
        position: { x: position.x - 80, y: position.y - 40 },
        data: {
          id: newNodeId,
          name: '新节点',
          description: '请编辑节点信息',
          enabled: true,
          tasks: []
        },
        dragHandle: '.business-node',
      };
      
      // 删除原边，添加两条新边
      setEdges((eds) => {
        const newEdges = eds.filter(e => e.id !== edgeId);
        return [
          ...newEdges,
          {
            id: `edge-${edge.source}-${newNodeId}`,
            source: edge.source,
            target: newNodeId,
            type: 'custom'
          },
          {
            id: `edge-${newNodeId}-${edge.target}`,
            source: newNodeId,
            target: edge.target,
            type: 'custom'
          }
        ];
      });
      
      // 添加新节点
      setNodes((nds) => [...nds, newNode]);
    };
    
    window.addEventListener('insertNode', handleInsertNode);
    return () => window.removeEventListener('insertNode', handleInsertNode);
  }, [edges, setNodes, setEdges]);
  
  // 编辑节点（通过节点ID）
  const handleEditNodeById = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      handleEditNode(node.data);
    }
  }, [nodes, handleEditNode]);
  
  // 保存节点编辑
  const handleSaveNode = useCallback(async () => {
    try {
      const values = await form.validate();
      if (editingNode) {
        setNodes((nds) => 
          nds.map(node => 
            node.id === editingNode.id 
              ? { 
                  ...node, 
                  data: { 
                    ...node.data, 
                    ...values,
                    tasks: tasks
                  } 
                }
              : node
          )
        );
      } else {
        // 新增节点 - 直接调用addNewNode，它会自动创建节点并打开编辑
        // 但我们需要在这里手动创建节点，因为我们已经有了表单数据
        const newNodeId = `node-${Date.now()}`;
        const newNode: Node = {
          id: newNodeId,
          type: 'businessNode',
          position: { x: 200 + nodes.length * 50, y: 200 + nodes.length * 30 },
          data: {
            id: newNodeId,
            ...values,
            tasks: tasks
          },
          dragHandle: '.business-node',
        };
        setNodes((nds) => [...nds, newNode]);
      }
      setModalVisible(false);
      setEditingNode(null);
      setTasks([]);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }, [editingNode, form, setNodes, tasks]);
  
  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        onNodeDoubleClick={(_, node) => handleEditNodeById(node.id)}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Meta', 'Ctrl']}
      >
        <Controls />
        <MiniMap 
          nodeColor="#1890ff"
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#f0f0f0"
        />
        
        {/* 工具栏 */}
        <Panel position="top-right">
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              type="primary" 
              icon={<IconPlus />}
              onClick={() => addNewNode()}
            >
              添加节点
            </Button>
            <Button 
              onClick={initializeNodes}
            >
              重置布局
            </Button>
          </div>
        </Panel>
      </ReactFlow>
      
      {/* 编辑节点模态框 */}
      <Modal
        title={editingNode?.id ? '编辑节点' : '新增节点'}
        visible={modalVisible}
        onOk={handleSaveNode}
        onCancel={() => {
          setModalVisible(false);
          setEditingNode(null);
          form.resetFields();
        }}
        okText="保存"
        cancelText="取消"
        style={{ width: 600 }}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="节点名称"
            field="name"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="请输入节点名称，如：报价确认" />
          </Form.Item>
          
          <Form.Item
            label="节点描述"
            field="description"
          >
            <Input.TextArea 
              placeholder="请输入节点描述（可选）" 
              rows={3}
              maxLength={200}
              showWordLimit
            />
          </Form.Item>
          
          <Form.Item
            label="节点图标"
            field="icon"
          >
            <Upload
              listType="picture-card"
              fileList={form.getFieldValue('icon') ? [{
                uid: '1',
                name: 'icon',
                status: 'done',
                url: form.getFieldValue('icon')
              }] : []}
              showUploadList={true}
              accept="image/*"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                const isLt2M = file.size / 1024 / 1024 < 2;
                
                if (!isImage) {
                  Message.error('只能上传图片文件!');
                  return false;
                }
                if (!isLt2M) {
                  Message.error('图片大小不能超过 2MB!');
                  return false;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                  const imageUrl = e.target?.result as string;
                  form.setFieldValue('icon', imageUrl);
                  Message.success('图标上传成功');
                };
                reader.readAsDataURL(file);
                
                return false;
              }}
              onRemove={() => {
                form.setFieldValue('icon', undefined);
                Message.success('图标已移除');
              }}
            >
              {!form.getFieldValue('icon') && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <IconUpload style={{ fontSize: '24px', color: '#999' }} />
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                    上传图标
                  </div>
                </div>
              )}
            </Upload>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              支持 JPG、PNG、GIF 格式，文件大小不超过 2MB
            </div>
          </Form.Item>

          {/* 任务管理区域 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>任务配置</span>
              <Button
                type="primary"
                size="small"
                icon={<IconPlus />}
                onClick={handleAddTask}
              >
                添加任务
              </Button>
            </div>

            {/* 任务列表 */}
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid #e8e9ea',
              borderRadius: '6px',
              padding: '8px'
            }}>
              {tasks.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#8c8c8c',
                  padding: '20px'
                }}>
                  暂无任务，点击"添加任务"开始配置
                </div>
              ) : (
                tasks.map((task, index) => (
                  <div key={task.id} style={{
                    border: '1px solid #e8e9ea',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: '#fafafa'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontWeight: 500 }}>任务 {index + 1}</span>
                      <Button
                        type="text"
                        size="mini"
                        status="danger"
                        icon={<IconDelete />}
                        onClick={() => handleDeleteTask(task.id)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#666' }}>任务名称</label>
                        <Input
                          size="small"
                          value={task.name}
                          placeholder="请输入任务名称"
                          onChange={(value) => handleUpdateTask(task.id, { name: value })}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', color: '#666' }}>任务性质</label>
                        <Select
                          size="small"
                          value={task.type}
                          onChange={(value) => handleUpdateTask(task.id, { type: value as TaskType })}
                        >
                          <Option value="customer">客户任务</Option>
                          <Option value="operation">运营任务</Option>
                        </Select>
                      </div>

                      {task.type === 'operation' && (
                        <div>
                          <label style={{ fontSize: '12px', color: '#666' }}>接收任务岗位</label>
                          <Select
                            size="small"
                            value={task.position}
                            placeholder="请选择岗位"
                            onChange={(value) => handleUpdateTask(task.id, { position: value as PositionType })}
                          >
                            <Option value="sales">专属销售</Option>
                            <Option value="service">专属客服</Option>
                            <Option value="documentation">专属单证</Option>
                            <Option value="operation">专属操作</Option>
                            <Option value="business">专属商务</Option>
                          </Select>
                        </div>
                      )}

                      <div>
                        <label style={{ fontSize: '12px', color: '#666' }}>是否可跳过</label>
                        <Switch
                          size="small"
                          checked={task.skippable}
                          onChange={(checked) => handleUpdateTask(task.id, { skippable: checked })}
                        />
                      </div>
                    </div>

                    {/* 关联页面 */}
                    <div style={{ marginTop: '12px' }}>
                      <label style={{ fontSize: '12px', color: '#666' }}>关联页面（可选）</label>
                      <Select
                        size="small"
                        placeholder="请选择关联页面"
                        value={task.relatedPage?.url || ''}
                        onChange={(value) => {
                          const selectedPage = relatedPageOptions.find(option => option.value === value);
                          handleUpdateTask(task.id, {
                            relatedPage: selectedPage ? {
                              name: selectedPage.label,
                              url: selectedPage.url
                            } : undefined
                          });
                        }}
                        allowClear
                        style={{ marginTop: '4px' }}
                      >
                        {relatedPageOptions.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <Form.Item
            label="启用状态"
            field="enabled"
            triggerPropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// 包装组件，提供ReactFlow上下文
const FlowEditorWrapper: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
};

export default FlowEditorWrapper;