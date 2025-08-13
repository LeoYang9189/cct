import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Message,
    Switch,
    Tag,
    Radio,
    Popconfirm,
    Upload,
    Tabs
} from '@arco-design/web-react';
import {
    IconPlus,
    IconEdit,
    IconDelete,
    IconDragArrow,
    IconUpload,
    // IconSettings,
    IconBranch
} from '@arco-design/web-react/icon';
import FlowEditor from './FlowEditor';

const { Option } = Select;

// 业务类型定义
type BusinessType = 'sea' | 'air' | 'land' | 'rail';

// 任务类型定义
type TaskType = 'customer' | 'operation';

// 岗位类型定义
type PositionType = 'sales' | 'service' | 'documentation' | 'operation' | 'business';

// 任务定义
interface Task {
    id: string;
    name: string;
    type: TaskType;
    position?: PositionType; // 运营任务时需要
    skippable: boolean;
    relatedPage?: {
        name: string;
        url: string;
    };
}

// 业务节点数据类型定义
interface BusinessNode {
    id: string;
    name: string;
    enabled: boolean;
    tasks: Task[];
    order: number;
    description?: string;
    icon?: string; // 节点图标URL
    connections?: string[]; // 连接到的后续节点ID列表
    position?: { x: number; y: number }; // 节点在画布中的位置
}

// 业务流程定义
interface BusinessFlow {
    type: BusinessType;
    name: string;
    nodes: BusinessNode[];
}

const BusinessNodeSettings: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [currentBusinessType, setCurrentBusinessType] = useState<BusinessType>('sea');
    const [businessFlows, setBusinessFlows] = useState<BusinessFlow[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingNode, setEditingNode] = useState<BusinessNode | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [form] = Form.useForm();

    // 业务类型配置
    const businessTypes = [
        { key: 'sea', label: '海运订单', color: 'blue' },
        { key: 'air', label: '空运订单', color: 'green' },
        { key: 'land', label: '陆运订单', color: 'orange' },
        { key: 'rail', label: '铁路订单', color: 'purple' }
    ];

    // 初始化模拟数据
    useEffect(() => {
        const defaultNodes = [
            {
                name: '生产',
                description: '货物生产制造环节',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiMxODkwZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0iIzE4OTBmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+',
                tasks: [{
                    id: 'task_1',
                    name: '生产制造',
                    type: 'operation' as TaskType,
                    position: 'operation' as PositionType,
                    skippable: false
                }]
            },
            {
                name: '运价',
                description: '计算运输价格',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTQgOEwyMCA5TDE0IDE1TDEyIDIyTDEwIDE1TDQgOUwxMCA4TDEyIDJaIiBzdHJva2U9IiMxODkwZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0iIzUyYzQxYSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+',
                tasks: [{
                    id: 'task_2',
                    name: '运价计算',
                    type: 'operation' as TaskType,
                    position: 'business' as PositionType,
                    skippable: false,
                    relatedPage: { name: '填写报价单', url: '/quote-form' }
                }]
            },
            {
                name: '订舱',
                description: '预订船舱位置',
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMTEiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxMCIgcng9IjIiIHN0cm9rZT0iIzE4OTBmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjZmY3ODc1IiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNNyA5VjdBNCA0IDAgMCAxIDE1IDdWOSIgc3Ryb2tlPSIjMTg5MGZmIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
                tasks: [{
                    id: 'task_3',
                    name: '舱位预订',
                    type: 'operation' as TaskType,
                    position: 'operation' as PositionType,
                    skippable: false,
                    relatedPage: { name: '填写订舱单', url: '/booking-form' }
                }]
            },
            {
                name: '拖车',
                description: '安排拖车运输',
                tasks: [{
                    id: 'task_4',
                    name: '拖车安排',
                    type: 'operation' as TaskType,
                    position: 'operation' as PositionType,
                    skippable: false
                }]
            },
            {
                name: '仓库',
                description: '货物仓储管理',
                tasks: [{
                    id: 'task_5',
                    name: '仓储管理',
                    type: 'operation' as TaskType,
                    position: 'operation' as PositionType,
                    skippable: false
                }]
            },
            {
                name: '报关',
                description: '向海关申报货物',
                tasks: [{
                    id: 'task_6',
                    name: '海关申报',
                    type: 'operation' as TaskType,
                    position: 'documentation' as PositionType,
                    skippable: false,
                    relatedPage: { name: '填写报关单', url: '/customs-form' }
                }]
            },
            {
                name: '舱单',
                description: '制作货物舱单',
                tasks: [{
                    id: 'task_7',
                    name: '舱单制作',
                    type: 'operation' as TaskType,
                    position: 'documentation' as PositionType,
                    skippable: false
                }]
            },
            {
                name: 'VGM',
                description: '集装箱称重验证',
                tasks: [{
                    id: 'task_8',
                    name: 'VGM称重',
                    type: 'operation' as TaskType,
                    position: 'operation' as PositionType,
                    skippable: false
                }]
            },
            {
                name: '补料',
                description: '客户补充相关资料',
                tasks: [{
                    id: 'task_9',
                    name: '补充资料',
                    type: 'customer' as TaskType,
                    skippable: true,
                    relatedPage: { name: '上传BC件', url: '/upload-bc' }
                }]
            },
            {
                name: '账单',
                description: '客户确认账单',
                tasks: [{
                    id: 'task_10',
                    name: '账单确认',
                    type: 'customer' as TaskType,
                    skippable: false
                }]
            },
            {
                name: '发票',
                description: '开具运输发票',
                tasks: [{
                    id: 'task_11',
                    name: '发票开具',
                    type: 'operation' as TaskType,
                    position: 'business' as PositionType,
                    skippable: false
                }]
            },
            {
                name: '提单',
                description: '签发提货单据',
                tasks: [{
                    id: 'task_12',
                    name: '提单签发',
                    type: 'operation' as TaskType,
                    position: 'documentation' as PositionType,
                    skippable: false
                }]
            },
            {
                name: '换单',
                description: '处理换单手续',
                tasks: [{
                    id: 'task_13',
                    name: '换单处理',
                    type: 'operation' as TaskType,
                    position: 'documentation' as PositionType,
                    skippable: false
                }]
            },
            {
                name: '提柜',
                description: '提取空集装箱',
                tasks: [{
                    id: 'task_14',
                    name: '提取集装箱',
                    type: 'operation' as TaskType,
                    position: 'operation' as PositionType,
                    skippable: false
                }]
            },
            {
                name: '送货',
                description: '最终货物配送',
                tasks: [{
                    id: 'task_15',
                    name: '货物配送',
                    type: 'operation' as TaskType,
                    position: 'operation' as PositionType,
                    skippable: false
                }]
            }
        ];

        const mockFlows: BusinessFlow[] = [
            {
                type: 'sea',
                name: '海运订单',
                nodes: [
                    {
                        id: 'sea_1',
                        name: '生产',
                        enabled: true,
                        tasks: defaultNodes[0].tasks,
                        order: 1,
                        description: defaultNodes[0].description,
                        icon: defaultNodes[0].icon,
                        connections: ['sea_2'],
                        position: { x: 50, y: 100 }
                    },
                    {
                        id: 'sea_2',
                        name: '运价',
                        enabled: true,
                        tasks: defaultNodes[1].tasks,
                        order: 2,
                        description: defaultNodes[1].description,
                        icon: defaultNodes[1].icon,
                        connections: ['sea_3'],
                        position: { x: 350, y: 100 }
                    },
                    {
                        id: 'sea_3',
                        name: '订舱',
                        enabled: true,
                        tasks: defaultNodes[2].tasks,
                        order: 3,
                        description: defaultNodes[2].description,
                        icon: defaultNodes[2].icon,
                        connections: ['sea_4', 'sea_5', 'sea_6', 'sea_7'], // 多对多连接
                        position: { x: 650, y: 100 }
                    },
                    {
                        id: 'sea_4',
                        name: '报关',
                        enabled: true,
                        tasks: defaultNodes[3].tasks,
                        order: 4,
                        description: defaultNodes[3].description,
                        icon: defaultNodes[3].icon,
                        connections: ['sea_8'],
                        position: { x: 950, y: 20 }
                    },
                    {
                        id: 'sea_5',
                        name: '舱单',
                        enabled: true,
                        tasks: defaultNodes[4].tasks,
                        order: 5,
                        description: defaultNodes[4].description,
                        icon: defaultNodes[4].icon,
                        connections: ['sea_8'],
                        position: { x: 950, y: 200 }
                    },
                    {
                        id: 'sea_6',
                        name: 'VGM',
                        enabled: true,
                        tasks: defaultNodes[5].tasks,
                        order: 6,
                        description: defaultNodes[5].description,
                        icon: defaultNodes[5].icon,
                        connections: ['sea_8'],
                        position: { x: 950, y: 380 }
                    },
                    {
                        id: 'sea_7',
                        name: '补料',
                        enabled: true,
                        tasks: defaultNodes[6].tasks,
                        order: 7,
                        description: defaultNodes[6].description,
                        icon: defaultNodes[6].icon,
                        connections: ['sea_8'],
                        position: { x: 950, y: 560 }
                    },
                    {
                        id: 'sea_8',
                        name: '拖车',
                        enabled: true,
                        tasks: defaultNodes[7].tasks,
                        order: 8,
                        description: defaultNodes[7].description,
                        icon: defaultNodes[7].icon,
                        connections: ['sea_9'],
                        position: { x: 1250, y: 290 }
                    },
                    {
                        id: 'sea_9',
                        name: '送货',
                        enabled: true,
                        tasks: defaultNodes[14].tasks,
                        order: 9,
                        description: defaultNodes[14].description,
                        icon: defaultNodes[14].icon,
                        connections: [],
                        position: { x: 1550, y: 290 }
                    }
                ]
            },
            {
                type: 'air',
                name: '空运订单',
                nodes: defaultNodes.map((node, index) => ({
                    id: `air_${index + 1}`,
                    name: node.name,
                    enabled: true,
                    tasks: node.tasks,
                    order: index + 1,
                    description: node.description,
                    icon: node.icon
                }))
            },
            {
                type: 'land',
                name: '陆运订单',
                nodes: defaultNodes.map((node, index) => ({
                    id: `land_${index + 1}`,
                    name: node.name,
                    enabled: true,
                    tasks: node.tasks,
                    order: index + 1,
                    description: node.description,
                    icon: node.icon
                }))
            },
            {
                type: 'rail',
                name: '铁路订单',
                nodes: defaultNodes.map((node, index) => ({
                    id: `rail_${index + 1}`,
                    name: node.name,
                    enabled: true,
                    tasks: node.tasks,
                    order: index + 1,
                    description: node.description,
                    icon: node.icon
                }))
            }
        ];
        setBusinessFlows(mockFlows);
    }, []);

    // 获取当前业务流程
    const getCurrentFlow = () => {
        return businessFlows.find(flow => flow.type === currentBusinessType);
    };



    // 关联页面枚举数据
    const relatedPageOptions = [
        { label: '填写询价单', value: '/inquiry-form', url: '/inquiry-form' },
        { label: '填写报价单', value: '/quote-form', url: '/quote-form' },
        { label: '填写订舱单', value: '/booking-form', url: '/booking-form' },
        { label: '上传BC件', value: '/upload-bc', url: '/upload-bc' },
        { label: '填写报关单', value: '/customs-form', url: '/customs-form' },
        { label: '填写VGM单', value: '/vgm-form', url: '/vgm-form' },
        { label: '上传提单', value: '/upload-bl', url: '/upload-bl' },
        { label: '填写换单申请', value: '/exchange-form', url: '/exchange-form' },
        { label: '填写拖车申请', value: '/truck-form', url: '/truck-form' },
        { label: '填写仓储申请', value: '/warehouse-form', url: '/warehouse-form' }
    ];

    // 添加任务
    const handleAddTask = () => {
        const newTask: Task = {
            id: `task_${Date.now()}`,
            name: '',
            type: 'operation',
            skippable: false
        };
        setTasks(prev => [...prev, newTask]);
    };

    // 删除任务
    const handleDeleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    };

    // 更新任务
    const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
        ));
    };



    // 渲染连接线（支持多对多连接）
    // const renderConnections = (nodes: BusinessNode[]) => {
    //     const connections: React.ReactElement[] = [];
    //     
    //     nodes.forEach(node => {
    //         if (node.connections && node.connections.length > 0) {
    //             node.connections.forEach(targetId => {
    //                 const targetNode = nodes.find(n => n.id === targetId);
    //                 if (targetNode && node.position && targetNode.position) {
    //                     const startX = node.position.x + 140; // 节点宽度的一半
    //                     const startY = node.position.y + 80; // 节点高度的一半
    //                     const endX = targetNode.position.x;
    //                     const endY = targetNode.position.y + 80;
    //                     
    //                     // 计算控制点，创建贝塞尔曲线
    //                     const controlX1 = startX + (endX - startX) * 0.5;
    //                     const controlY1 = startY;
    //                     const controlX2 = startX + (endX - startX) * 0.5;
    //                     const controlY2 = endY;
    //                     
    //                     const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    //                     
    //                     // 计算连接线中点位置，用于放置加号图标
    //                     const midX = (startX + endX) / 2;
    //                     const midY = (startY + endY) / 2;
    //                     
    //                     connections.push(
    //                         <g key={`${node.id}-${targetId}`}>
    //                             {/* 连接线 */}
    //                             <path
    //                                 d={pathData}
    //                                 stroke="#1890ff"
    //                                 strokeWidth="2"
    //                                 fill="none"
    //                                 strokeDasharray={node.enabled && targetNode.enabled ? "0" : "5,5"}
    //                                 opacity={node.enabled && targetNode.enabled ? 1 : 0.5}
    //                             />
    //                             {/* 箭头 */}
    //                             <polygon
    //                                 points={`${endX-8},${endY-4} ${endX},${endY} ${endX-8},${endY+4}`}
    //                                 fill="#1890ff"
    //                                 opacity={node.enabled && targetNode.enabled ? 1 : 0.5}
    //                             />
    //                             {/* 加号图标 - 用于插入节点 */}
    //                             <g
    //                                 style={{ cursor: 'pointer' }}
    //                                 onClick={(e) => {
    //                                     e.stopPropagation();
    //                                     // 找到当前连接在节点数组中的位置
    //                                     const fromNodeIndex = nodes.findIndex(n => n.id === node.id);
    //                                     const toNodeIndex = nodes.findIndex(n => n.id === targetId);
    //                                     const insertIndex = Math.max(fromNodeIndex, toNodeIndex);
    //                                     handleAddNode(insertIndex);
    //                                 }}
    //                             >
    //                                 <circle
    //                                     cx={midX}
    //                                     cy={midY}
    //                                     r="12"
    //                                     fill="#52c41a"
    //                                     stroke="#ffffff"
    //                                     strokeWidth="2"
    //                                     opacity="0.9"
    //                                 />
    //                                 <text
    //                                     x={midX}
    //                                     y={midY + 1}
    //                                     textAnchor="middle"
    //                                     dominantBaseline="middle"
    //                                     fill="white"
    //                                     fontSize="14"
    //                                     fontWeight="bold"
    //                                 >
    //                                     +
    //                                 </text>
    //                             </g>
    //                         </g>
    //                     );
    //                 }
    //             });
    //         }
    //     });
    //     
    //     return connections;
    // };

    // 渲染流程图画布 - 暂时注释掉未使用的函数
    // const renderFlowCanvas = (nodes: BusinessNode[]) => {
    //     if (!nodes || nodes.length === 0) return null;
    //     
    //     // 计算画布尺寸
    //     const maxX = Math.max(...nodes.map(n => n.position?.x || 0)) + 300;
    //     const maxY = Math.max(...nodes.map(n => n.position?.y || 0)) + 200;
    //     
    //     return (
    //         <div style={{
    //             position: 'relative',
    //             width: '100%',
    //             height: `${Math.max(maxY, 600)}px`,
    //             backgroundColor: '#fafafa',
    //             borderRadius: '8px',
    //             border: '2px dashed #d9d9d9',
    //             overflow: 'auto'
    //         }}>
    //             {/* SVG 连接线层 */}
    //             <svg
    //                 style={{
    //                     position: 'absolute',
    //                     top: 0,
    //                     left: 0,
    //                     width: '100%',
    //                     height: '100%',
    //                     pointerEvents: 'none',
    //                     zIndex: 1
    //                 }}
    //                 viewBox={`0 0 ${maxX} ${maxY}`}
    //                 preserveAspectRatio="xMidYMid meet"
    //             >
    //                 {renderConnections(nodes)}
    //             </svg>
    //             
    //             {/* 节点层 */}
    //             {nodes.map(node => (
    //                 <div
    //                     key={node.id}
    //                     style={{
    //                         position: 'absolute',
    //                         left: `${node.position?.x || 0}px`,
    //                         top: `${node.position?.y || 0}px`,
    //                         zIndex: 2
    //                     }}
    //                 >
    //                     {renderNodeCard(node, 0, nodes)}
    //                 </div>
    //             ))}
    //             
    //             {/* 添加节点按钮 */}
    //             <div style={{
    //                 position: 'absolute',
    //                 bottom: '20px',
    //                 right: '20px',
    //                 zIndex: 3
    //             }}>
    //                 <Button
    //                     type="primary"
    //                     size="large"
    //                     icon={<IconPlus />}
    //                     onClick={() => handleAddNode()}
    //                     style={{
    //                         borderRadius: '50%',
    //                         width: '56px',
    //                         height: '56px',
    //                         boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)'
    //                     }}
    //                 >
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // };

    // 渲染节点卡片
    // const renderNodeCard = (node: BusinessNode, index: number, nodes: BusinessNode[]) => {
    //     const isFirst = index === 0;
    //     const isLast = index === nodes.length - 1;

    //     return (
    //         <div key={node.id} style={{
    //             display: 'flex',
    //             alignItems: 'center'
    //         }}>
                // {/* 节点卡片 */}
                // <Card
                //     style={{
                //         width: '280px',
                //         minHeight: '160px',
                //         border: node.enabled ? '1px solid #bae7ff' : '1px solid #f0f0f0',
                //         backgroundColor: node.enabled ? '#f0f8ff' : '#ffffff',
                //         cursor: 'pointer',
                //         borderRadius: '16px',
                //         boxShadow: node.enabled
                //             ? '0 8px 24px rgba(24, 144, 255, 0.12)'
                //             : '0 4px 16px rgba(0, 0, 0, 0.04)',
                //         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                //         position: 'relative',
                //         overflow: 'visible'
                //     }}
                //     size="small"
                //     hoverable
                //     onClick={() => handleEdit(node)}
                //     onMouseEnter={(e) => {
                //         if (node.enabled) {
                //             e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                //             e.currentTarget.style.boxShadow = '0 12px 32px rgba(24, 144, 255, 0.2)';
                //             e.currentTarget.style.borderColor = '#91d5ff';
                //         } else {
                //             e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                //             e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                //             e.currentTarget.style.borderColor = '#d9d9d9';
                //         }
                //     }}
                //     onMouseLeave={(e) => {
                //         e.currentTarget.style.transform = 'translateY(0) scale(1)';
                //         e.currentTarget.style.boxShadow = node.enabled
                //             ? '0 8px 24px rgba(24, 144, 255, 0.12)'
                //             : '0 4px 16px rgba(0, 0, 0, 0.04)';
                //         e.currentTarget.style.borderColor = node.enabled ? '#bae7ff' : '#f0f0f0';
                //     }}
                // >
                //     {/* 左侧状态指示器 */}
                //     <div style={{
                //         position: 'absolute',
                //         top: '20px',
                //         left: '0',
                //         width: '4px',
                //         height: '40px',
                //         borderRadius: '0 4px 4px 0',
                //         background: node.enabled
                //             ? 'linear-gradient(180deg, #1890ff, #40a9ff)'
                //             : '#d9d9d9',
                //         boxShadow: node.enabled
                //             ? '0 0 12px rgba(24, 144, 255, 0.6), 0 0 24px rgba(24, 144, 255, 0.3)'
                //             : 'none'
                //     }} />
                //
                //     <div style={{
                //         display: 'flex',
                //         justifyContent: 'space-between',
                //         alignItems: 'flex-start',
                //         paddingLeft: '16px'
                //     }}>
                //         <div style={{ flex: 1 }}>
                //             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                //                 {/* 节点图标 */}
                //                 <div style={{
                //                     width: '32px',
                //                     height: '32px',
                //                     borderRadius: '8px',
                //                     backgroundColor: node.enabled ? '#e6f7ff' : '#f5f5f5',
                //                     border: `1px solid ${node.enabled ? '#91d5ff' : '#d9d9d9'}`,
                //                     display: 'flex',
                //                     alignItems: 'center',
                //                     justifyContent: 'center',
                //                     marginRight: '12px',
                //                     overflow: 'hidden'
                //                 }}>
                //                     {node.icon ? (
                //                         <img 
                //                             src={node.icon} 
                //                             alt={node.name}
                //                             style={{
                //                                 width: '20px',
                //                                 height: '20px',
                //                                 objectFit: 'cover'
                //                             }}
                //                         />
                //                     ) : (
                //                         <IconDragArrow 
                //                             style={{
                //                                 fontSize: '16px',
                //                                 color: node.enabled ? '#1890ff' : '#8c8c8c'
                //                             }}
                //                         />
                //                     )}
                //                 </div>
                //                 <span style={{
                //                     fontWeight: '600',
                //                     fontSize: '16px',
                //                     color: node.enabled ? '#262626' : '#8c8c8c',
                //                     lineHeight: '1.3',
                //                     letterSpacing: '0.02em'
                //                 }}>
                //                     {node.name}
                //                 </span>
                //             </div>
                //
                //             {/* 任务数量显示 */}
                //             <div style={{ marginBottom: '12px' }}>
                //                 <div style={{
                //                     display: 'inline-flex',
                //                     alignItems: 'center',
                //                     padding: '4px 12px',
                //                     backgroundColor: node.enabled ? '#f0f9ff' : '#f5f5f5',
                //                     border: `1px solid ${node.enabled ? '#bae7ff' : '#d9d9d9'}`,
                //                     borderRadius: '20px',
                //                     fontSize: '12px',
                //                     fontWeight: '500',
                //                     color: node.enabled ? '#1890ff' : '#8c8c8c'
                //                 }}>
                //                     <span style={{ 
                //                         width: '6px', 
                //                         height: '6px', 
                //                         borderRadius: '50%', 
                //                         backgroundColor: node.enabled ? '#1890ff' : '#d9d9d9',
                //                         marginRight: '6px'
                //                     }} />
                //                     {node.tasks.length} 个任务
                //                 </div>
                //             </div>
                //
                //             {node.description && (
                //                 <div style={{
                //                     fontSize: '12px',
                //                     color: '#595959',
                //                     lineHeight: '1.5',
                //                     marginTop: '12px',
                //                     padding: '8px 12px',
                //                     backgroundColor: node.enabled ? '#f9f9f9' : '#fafafa',
                //                     borderRadius: '8px',
                //                     border: `1px solid ${node.enabled ? '#e6f7ff' : '#f0f0f0'}`,
                //                     fontStyle: 'italic'
                //                 }}>
                //                     {node.description}
                //                 </div>
                //             )}
                //         </div>
                //
                //         <div style={{
                //             display: 'flex',
                //             flexDirection: 'column',
                //             alignItems: 'center',
                //             marginLeft: '16px',
                //             gap: '8px'
                //         }}>
                //             <div style={{
                //                 padding: '6px',
                //                 borderRadius: '8px',
                //                 backgroundColor: node.enabled ? '#f0f9ff' : '#fafafa',
                //                 border: `1px solid ${node.enabled ? '#d4edda' : '#e9ecef'}`
                //             }}>
                //                 <Switch
                //                     size="small"
                //                     checked={node.enabled}
                //                     onChange={(checked) => handleToggleNode(node.id, checked)}
                //                     onClick={(e) => e.stopPropagation()}
                //                 />
                //             </div>
                //             
                //             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                //                 <Button
                //                     type="text"
                //                     size="mini"
                //                     icon={<IconEdit />}
                //                     style={{
                //                         color: '#1890ff',
                //                         backgroundColor: 'rgba(24, 144, 255, 0.1)',
                //                         borderRadius: '6px',
                //                         width: '28px',
                //                         height: '28px'
                //                     }}
                //                     onClick={(e) => {
                //                         e.stopPropagation();
                //                         handleEdit(node);
                //                     }}
                //                 />
                //                 {!isFirst && !isLast && (
                //                     <Popconfirm
                //                         title="确认删除节点"
                //                         content="删除后不可恢复，确定要删除这个业务节点吗？"
                //                         onOk={(e) => {
                //                             e?.stopPropagation();
                //                             handleDelete(node.id);
                //                         }}
                //                         onCancel={(e) => {
                //                             e?.stopPropagation();
                //                         }}
                //                         okText="确定删除"
                //                         cancelText="取消"
                //                         position="top"
                //                     >
                //                         <Button
                //                             type="text"
                //                             size="mini"
                //                             status="danger"
                //                             icon={<IconDelete />}
                //                             style={{
                //                                 backgroundColor: 'rgba(255, 77, 79, 0.1)',
                //                                 borderRadius: '6px',
                //                                 width: '28px',
                //                                 height: '28px'
                //                             }}
                //                             onClick={(e) => {
                //                                 e.stopPropagation();
                //                             }}
                //                         />
                //                     </Popconfirm>
                //                 )}
                //             </div>
                //         </div>
                //     </div>
                // </Card>
            // </div>
        // );
    // };
        // );
    // };

    // 切换节点启用状态
    const handleToggleNode = (nodeId: string, enabled: boolean) => {
        setBusinessFlows(prev => prev.map(flow =>
            flow.type === currentBusinessType
                ? {
                    ...flow,
                    nodes: flow.nodes.map(node =>
                        node.id === nodeId ? { ...node, enabled } : node
                    )
                }
                : flow
        ));
        Message.success(enabled ? '节点已启用' : '节点已禁用');
    };

    // 添加节点
    const handleAddNode = (insertIndex?: number) => {
        setEditingNode(null);
        setTasks([]);
        form.resetFields();
        form.setFieldsValue({
            insertIndex: insertIndex // 保存插入位置
        });
        setModalVisible(true);
    };

    // 编辑节点
    const handleEdit = (node: BusinessNode) => {
        setEditingNode(node);
        setTasks(node.tasks || []);
        form.setFieldsValue({
            name: node.name,
            description: node.description,
            icon: node.icon
        });
        setModalVisible(true);
    };

    // 删除节点
    const handleDelete = (nodeId: string) => {
        setBusinessFlows(prev => prev.map(flow =>
            flow.type === currentBusinessType
                ? {
                    ...flow,
                    nodes: flow.nodes.filter(node => node.id !== nodeId)
                }
                : flow
        ));
        Message.success('节点删除成功');
    };

    // 保存节点
    const handleSave = async () => {
        try {
            const values = await form.validate();
            setLoading(true);

            if (editingNode) {
                // 更新现有节点
                setBusinessFlows(prev => prev.map(flow =>
                    flow.type === currentBusinessType
                        ? {
                            ...flow,
                            nodes: flow.nodes.map(node =>
                                node.id === editingNode.id
                                    ? {
                                        ...node,
                                        name: values.name,
                                        description: values.description,
                                        icon: values.icon,
                                        tasks: tasks
                                    }
                                    : node
                            )
                        }
                        : flow
                ));
                Message.success('节点更新成功');
            } else {
                // 新增节点
                // const currentFlow = getCurrentFlow();
                 if (currentFlow) {
                    const insertIndex = values.insertIndex;
                    
                    // 计算新节点的位置
                    let newPosition = { x: 100, y: 100 };
                    if (insertIndex !== undefined && insertIndex < currentFlow.nodes.length) {
                        // 在中间插入，计算两个节点之间的位置
                        const prevNode = currentFlow.nodes[insertIndex - 1];
                        const nextNode = currentFlow.nodes[insertIndex];
                        if (prevNode && nextNode && prevNode.position && nextNode.position) {
                            newPosition = {
                                x: (prevNode.position.x + nextNode.position.x) / 2,
                                y: (prevNode.position.y + nextNode.position.y) / 2 + 50
                            };
                        }
                    } else if (currentFlow.nodes.length > 0) {
                        // 在末尾添加
                        const lastNode = currentFlow.nodes[currentFlow.nodes.length - 1];
                        if (lastNode.position) {
                            newPosition = {
                                x: lastNode.position.x + 300,
                                y: lastNode.position.y
                            };
                        }
                    }
                    
                    const newNode: BusinessNode = {
                        id: `${currentBusinessType}_${Date.now()}`,
                        name: values.name,
                        enabled: true,
                        tasks: tasks,
                        description: values.description,
                        icon: values.icon,
                        order: insertIndex !== undefined ? insertIndex + 1 : currentFlow.nodes.length + 1,
                        position: newPosition,
                        connections: []
                    };

                    setBusinessFlows(prev => prev.map(flow =>
                        flow.type === currentBusinessType
                            ? {
                                ...flow,
                                nodes: insertIndex !== undefined
                                    ? [
                                        ...flow.nodes.slice(0, insertIndex),
                                        newNode,
                                        ...flow.nodes.slice(insertIndex)
                                    ]
                                    : [...flow.nodes, newNode]
                            }
                            : flow
                    ));
                    Message.success('节点添加成功');
                }
            }

            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('保存失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentFlow = getCurrentFlow();

    return (
        <div style={{ padding: '20px' }}>
            {/* 业务类型选择 */}
            <Card style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, marginRight: '16px' }}>选择业务类型：</span>
                </div>
                <Radio.Group
                    value={currentBusinessType}
                    onChange={setCurrentBusinessType}
                    style={{ display: 'flex', gap: '16px' }}
                >
                    {businessTypes.map(type => (
                        <Radio key={type.key} value={type.key}>
                            <Tag color={type.color} style={{ margin: 0 }}>
                                {type.label}
                            </Tag>
                        </Radio>
                    ))}
                </Radio.Group>
            </Card>

            {/* 流程配置标签页 */}
            <Card>
                <Tabs defaultActiveTab="flow-editor" type="card">
                    <Tabs.TabPane
                        key="flow-editor"
                        title={
                            <span>
                                <IconBranch style={{ marginRight: '8px' }} />
                                业务节点编辑器
                            </span>
                        }
                    >
                        <div style={{ height: '600px' }}>
                            <FlowEditor />
                        </div>
                    </Tabs.TabPane>

                </Tabs>
            </Card>

            {/* 新增/编辑节点弹窗 */}
            <Modal
                title={editingNode ? '编辑业务节点' : '新增业务节点'}
                visible={modalVisible}
                onOk={handleSave}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                confirmLoading={loading}
                style={{ width: 600 }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
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
                                // 这里可以添加文件大小和格式验证
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
                                
                                // 模拟上传成功，实际项目中需要调用上传接口
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const imageUrl = e.target?.result as string;
                                    form.setFieldValue('icon', imageUrl);
                                    Message.success('图标上传成功');
                                };
                                reader.readAsDataURL(file);
                                
                                return false; // 阻止默认上传行为
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
                </Form>
            </Modal>
        </div>
    );
};

export default BusinessNodeSettings;