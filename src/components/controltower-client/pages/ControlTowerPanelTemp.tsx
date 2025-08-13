import React, { useState, useEffect } from 'react';
import { IconArrowUp, IconArrowDown, IconEye, IconClose, IconArrowRight, IconSun, IconMoon } from '@arco-design/web-react/icon';
import './ControlTowerPanelStylesTemp.css';
import { useNavigate } from 'react-router-dom';



// 任务类型定义
interface TaskItem {
  id: string;
  orderNumber: string;
  taskType: string;
  customerName: string;
  deadline: Date;
  overdueHours?: number;
  status: 'pending' | 'overdue';
  priority: 'high' | 'medium' | 'low';
}

// 任务弹窗组件
const TaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tasks: TaskItem[];
}> = ({ isOpen, onClose, title, tasks }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const formatDeadline = (deadline: Date) => {
    return deadline.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatOverdueTime = (hours: number) => {
    if (hours < 24) {
      return `${hours}小时`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return remainingHours > 0 ? `${days}天${remainingHours}小时` : `${days}天`;
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    const colors = {
      '待确认报价': '#ff9500',
      '待确认提单': '#1890ff',
      '待确认账单': '#722ed1',
      '待提交VGM': '#eb2f96',
      '待上传SI': '#13c2c2',
      '待补充文件': '#faad14',
      '待客户确认': '#52c41a',
      '待海关放行': '#f5222d'
    };
    return colors[taskType as keyof typeof colors] || '#1890ff';
  };

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className="task-modal-content">
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task.id} className={`task-modal-item ${task.status}`}>
                {/* 优先级绸带 */}
                <div className={`task-priority-ribbon ${task.priority}`}>
                  {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                </div>
                
                <div className="task-main-info">
                  <div className="task-left">
                    <div className="task-order-info">
                      <span className="task-order-number">{task.orderNumber}</span>
                      <span className="task-customer">{task.customerName}</span>
                    </div>
                    <div className="task-type-info">
                      <span 
                        className="task-type-tag"
                        style={{ 
                          backgroundColor: `${getTaskTypeColor(task.taskType)}20`,
                          borderColor: getTaskTypeColor(task.taskType),
                          color: getTaskTypeColor(task.taskType)
                        }}
                      >
                        {task.taskType}
                      </span>
                    </div>
                  </div>
                  <div className="task-right">
                    <div className="task-deadline">
                      <span className="deadline-label">截止时间</span>
                      <span className="deadline-time">{formatDeadline(task.deadline)}</span>
                    </div>
                    {task.status === 'overdue' && task.overdueHours && (
                      <div className="task-overdue">
                        <span className="overdue-label">逾期时间</span>
                        <span className="overdue-time">{formatOverdueTime(task.overdueHours)}</span>
                      </div>
                    )}
                    <button 
                      className="view-button"
                      onClick={() => navigate('/controltower/saas/quote-form/fcl/QT2024050001')}
                      title="去处理"
                    >
                      <IconArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="task-modal-footer">
          <div className="task-summary">
            共 {tasks.length} 个任务
            {title.includes('逾期') && (
              <span className="overdue-summary">
                ，逾期总时长：{tasks.reduce((total, task) => total + (task.overdueHours || 0), 0)}小时
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlTowerPanel: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realtimeTasks, setRealtimeTasks] = useState<Array<{id: string, task: string, time: string}>>([]);
  
  // 主题状态 - 默认浅色模式
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // 弹窗状态
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalTitle, setTaskModalTitle] = useState('');
  const [taskModalData, setTaskModalData] = useState<TaskItem[]>([]);
  
  // 运价指数数据状态已删除

  // 运价指数数据更新已删除

  // 注册世界地图数据（使用懒加载避免阻塞）
  useEffect(() => {
    const registerWorldMap = () => {
      // 延迟加载地图数据，避免阻塞初始渲染
      setTimeout(async () => {
      try {
        // 使用CDN加载世界地图GeoJSON数据
        await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        
        // Map registration completed
      } catch (error) {
        console.error('Failed to load world map:', error);
        // 如果加载失败，使用备用方案
      }
      }, 1000); // 延迟1秒加载，确保界面先渲染
    };

    registerWorldMap();
  }, []);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 实时订单生成已删除

  // 实时任务生成
  useEffect(() => {
    const generateTask = () => {
      const orderNumber = `WO${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
      const task = '待确认报价';
      const time = new Date().toLocaleTimeString('zh-CN');
      
      setRealtimeTasks(prev => {
        const newTasks = [{
          id: orderNumber,
          task: task,
          time: time
        }, ...prev];
        // 保持最多15条记录
        return newTasks.slice(0, 15);
      });
    };

    // 初始生成几条任务
    for (let i = 0; i < 3; i++) {
      setTimeout(() => generateTask(), i * 800);
    }

    // 每5-9秒随机生成一条新任务
    const interval = setInterval(() => {
      generateTask();
    }, Math.random() * 4000 + 5000);

    return () => clearInterval(interval);
  }, []);

  // 通关异常订单直方图初始化已删除



  // 热门询价排行榜初始化
  useEffect(() => {
    const contentElement = document.getElementById('hot-inquiry-ranking-content');
    if (contentElement) {
      
      // 热门航线数据
      const hotRoutes = [
        { route: 'Shanghai → Los Angeles', count: Math.floor(Math.random() * 200) + 300, rank: 1 },
        { route: 'Qingdao → Rotterdam', count: Math.floor(Math.random() * 180) + 250, rank: 2 },
        { route: 'Shenzhen → Hamburg', count: Math.floor(Math.random() * 160) + 220, rank: 3 },
        { route: 'Ningbo → Long Beach', count: Math.floor(Math.random() * 150) + 200, rank: 4 },
        { route: 'Tianjin → Dubai', count: Math.floor(Math.random() * 140) + 180, rank: 5 },
        { route: 'Xiamen → Singapore', count: Math.floor(Math.random() * 130) + 160, rank: 6 },
        { route: 'Dalian → Antwerp', count: Math.floor(Math.random() * 120) + 140, rank: 7 },
        { route: 'Guangzhou → New York', count: Math.floor(Math.random() * 110) + 120, rank: 8 },
        { route: 'Yantai → Felixstowe', count: Math.floor(Math.random() * 100) + 100, rank: 9 },
        { route: 'Lianyungang → Le Havre', count: Math.floor(Math.random() * 90) + 80, rank: 10 }
      ];

      const renderRanking = () => {
        // 重新排序（基于count降序）
        const sortedRoutes = [...hotRoutes].sort((a, b) => b.count - a.count);
        
        const rankingHTML = sortedRoutes.map((item, index) => {
          const rank = index + 1;
          const rankClass = rank <= 3 ? `top-${rank}` : 'normal';
          const trendClass = Math.random() > 0.5 ? 'up' : 'down';
          const trendIcon = trendClass === 'up' ? '↗' : '↘';
          
          return `
            <div class="ranking-item ${rankClass}" style="animation-delay: ${index * 0.1}s;">
              <div class="rank-number">
                <span class="rank">${rank}</span>
                ${rank <= 3 ? '<span class="crown">👑</span>' : ''}
              </div>
              <div class="route-info">
                <div class="route-name">${item.route}</div>
                <div class="route-meta">
                  <span class="inquiry-count">${item.count} 次询价</span>
                  <span class="trend ${trendClass}">${trendIcon} ${Math.floor(Math.random() * 20) + 5}%</span>
                </div>
              </div>
              <div class="ranking-bar">
                <div class="bar-fill ${rankClass}" style="width: ${(item.count / sortedRoutes[0].count) * 100}%"></div>
              </div>
            </div>
          `;
        }).join('');
        
        contentElement.innerHTML = rankingHTML;
      };

      // 初始渲染
      renderRanking();

      // 定时更新数据
      const updateInterval = setInterval(() => {
        // 随机更新部分航线的询价次数
        hotRoutes.forEach(route => {
          const change = Math.floor(Math.random() * 20) - 10; // -10 到 +10 的变化
          route.count = Math.max(50, route.count + change); // 确保最小值为50
        });
        
        renderRanking();
      }, 20000); // 每20秒更新一次

      return () => {
        clearInterval(updateInterval);
      };
    }
  }, []);





  // 数据总览配置
  const overviewData = [
    { title: '总任务数', value: 104, change: -20, trend: 'down', unit: '个' },
    { title: '待处理任务', value: 89, change: -12, trend: 'down', unit: '个' },
    { title: '逾期任务', value: 15, change: -8, trend: 'down', unit: '个' },
  ];

  // 生成虚拟任务数据
  const generateTaskData = (type: 'pending' | 'overdue', count: number): TaskItem[] => {
    const customers = ['华为技术有限公司', '阿里巴巴集团', '腾讯科技', '比亚迪股份', '海康威视', '小米集团', '京东集团', '宁德时代'];
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    
    const tasks: TaskItem[] = [];
    
    for (let i = 0; i < count; i++) {
      const now = new Date();
      const taskType = '待确认报价';
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      let deadline: Date;
      let overdueHours: number | undefined;
      
      if (type === 'pending') {
        // 待处理任务：截止时间在未来1-48小时内
        deadline = new Date(now.getTime() + (Math.random() * 48 + 1) * 60 * 60 * 1000);
      } else {
        // 逾期任务：截止时间在过去，逾期1-168小时（1周）
        overdueHours = Math.floor(Math.random() * 168) + 1;
        deadline = new Date(now.getTime() - overdueHours * 60 * 60 * 1000);
      }
      
      const orderNumber = `WO${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
      
      tasks.push({
        id: `task-${i}-${Date.now()}`,
        orderNumber,
        taskType,
        customerName: customer,
        deadline,
        overdueHours,
        status: type,
        priority
      });
    }
    
    // 按优先级和截止时间排序
    return tasks.sort((a, b) => {
      // 优先级排序：high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // 同优先级按截止时间排序
      if (type === 'pending') {
        return a.deadline.getTime() - b.deadline.getTime(); // 即将到期的在前
      } else {
        return (b.overdueHours || 0) - (a.overdueHours || 0); // 逾期时间长的在前
      }
    });
  };
  
  // 打开任务弹窗
  const openTaskModal = (type: 'pending' | 'overdue') => {
    if (type === 'pending') {
      setTaskModalTitle('待处理任务列表');
      setTaskModalData(generateTaskData('pending', 89));
    } else {
      setTaskModalTitle('逾期任务列表');
      setTaskModalData(generateTaskData('overdue', 15));
    }
    setIsTaskModalOpen(true);
  };

  // 关闭任务弹窗
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskModalTitle('');
    setTaskModalData([]);
  };

  // 跳转到报价表单页面
  const goToQuoteForm = () => {
    // 跳转到报价表单页面
    navigate('/controltower/saas/quote-form/fcl/QT2024050001');
  };

  // 主题切换函数
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`control-tower-panel ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* 运价指数滚动条已删除 */}

      {/* 顶部标题栏 */}
      <div className="panel-header">
        <div className="header-left">
          <div className="panel-title">
            <span className="title-icon">◆</span>
            <span>XXX公司驾驶舱</span>
          </div>
        </div>
        <div className="header-center">
          <div className="current-time">
            {currentTime.toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
        <div className="header-right">
          <button className="theme-toggle-button" onClick={toggleTheme} title={isDarkTheme ? '切换到浅色主题' : '切换到深色主题'}>
            {isDarkTheme ? <IconSun /> : <IconMoon />}
          </button>
          <div className="system-status">

          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="panel-content">
        {/* 顶部数据概览 */}
        <div className="overview-section">
          {overviewData.map((item, index) => (
            <div key={index} className="overview-card">
              <div className="card-header">
                <span className="card-title">{item.title}</span>
                <div className="card-header-right">
                <div className={`trend-indicator ${item.trend}`}>
                  {item.trend === 'up' ? <IconArrowUp /> : <IconArrowDown />}
                  {Math.abs(item.change)}
                  </div>
                  {(item.title === '待处理任务' || item.title === '逾期任务') && (
                    <button 
                      className="view-button"
                      onClick={() => openTaskModal(item.title === '待处理任务' ? 'pending' : 'overdue')}
                      title={`查看${item.title}详情`}
                    >
                      <IconEye />
                    </button>
                  )}
                </div>
              </div>
              <div className="card-value">
                <span className="value">{item.value.toLocaleString()}</span>
                <span className="unit">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 图表区域 */}
        <div className="charts-section">
          {/* 实时任务模块与热门询价排行榜并排布局 */}
          <div className="charts-row two-column-custom">
            {/* 实时任务模块 */}
            <div className="chart-card realtime-tasks">
              <div className="chart-title">
                <span className="title-icon">◆</span>
                实时任务
              </div>
              <div className="tasks-list">
                {realtimeTasks.map((task, index) => (
                  <div key={`${task.id}-${task.time}`} className={`task-item ${index === 0 ? 'new-task' : ''}`}>
                    <div className="task-header">
                      <span className="task-order-number">{task.id}</span>
                      <span className="task-time">{task.time}</span>
                      <button 
                        className="view-button"
                        onClick={() => goToQuoteForm()}
                        title="编辑报价"
                      >
                        <IconArrowRight />
                      </button>
                    </div>
                    <div className="task-content">
                      <span className={`task-tag task-${task.task}`}>{task.task}</span>
                    </div>
                  </div>
                ))}
                {realtimeTasks.length === 0 && (
                  <div className="no-tasks">暂无实时任务</div>
                )}
              </div>
            </div>
            
            {/* 热门询价排行榜 */}
            <div className="chart-card hot-inquiry-ranking">
              <div className="chart-title">
                <span className="title-icon">◆</span>
                热门询价排行榜 TOP10
              </div>
              <div className="ranking-list">
                {/* 排行榜内容将通过useEffect动态生成 */}
                <div id="hot-inquiry-ranking-content" className="ranking-content">
                  {/* 动态内容 */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 任务弹窗 */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={closeTaskModal}
          title={taskModalTitle}
          tasks={taskModalData}
        />
      )}
    </div>
  );
};

export default ControlTowerPanel;