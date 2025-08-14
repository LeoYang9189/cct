import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button, Message, Divider } from '@arco-design/web-react';
import { IconFile, IconList, IconCalendar, IconUser, IconSettings as IconSettingsIcon, IconApps, IconHome, IconPhone, IconRobot, IconSound } from '@arco-design/web-react/icon';

// 快捷入口项目接口
interface ShortcutItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  category: string;
  description?: string;
}

// 所有可用的快捷入口选项
const ALL_SHORTCUTS: ShortcutItem[] = [
  // 超级运价
  { key: 'rate-query', title: '运价查询', icon: <IconFile />, path: '/controltower/saas/rate-query', category: '超级运价', description: '查询各类运价信息' },
  { key: 'rate-maintenance', title: '运价维护', icon: <IconSettingsIcon />, path: '/controltower/saas/fcl-rates', category: '超级运价', description: '维护和管理运价数据' },
  { key: 'inquiry-management', title: '询价管理', icon: <IconList />, path: '/controltower/saas/inquiry-management', category: '超级运价', description: '管理询价单据' },
  { key: 'quote-management', title: '报价管理', icon: <IconList />, path: '/controltower/saas/quote-management', category: '超级运价', description: '管理报价单据' },
  { key: 'space-query', title: '舱位查询', icon: <IconFile />, path: '/controltower/saas/space-query', category: '超级运价', description: '查询舱位信息' },
  { key: 'space-booking', title: '舱位预订', icon: <IconCalendar />, path: '/controltower/saas/space-booking', category: '超级运价', description: '预订舱位' },
  { key: 'space-statistics', title: '舱位统计', icon: <IconApps />, path: '/controltower/saas/space-statistics', category: '超级运价', description: '舱位数据统计' },
  { key: 'contract-management', title: '合约管理', icon: <IconFile />, path: '/controltower/saas/contract-management', category: '超级运价', description: '管理合约信息' },
  { key: 'surcharge-maintenance', title: '附加费维护', icon: <IconSettingsIcon />, path: '/controltower/saas/surcharge-management', category: '超级运价', description: '维护附加费信息' },
  { key: 'pricing-rule-maintenance', title: '加价规则维护', icon: <IconSettingsIcon />, path: '/controltower/saas/pricing-rule-management', category: '超级运价', description: '维护加价规则' },
  { key: 'create-inquiry', title: '新建询价', icon: <IconFile />, path: '/controltower/saas/create-fcl-inquiry', category: '超级运价', description: '创建新的询价单' },
  { key: 'create-quote', title: '新建报价', icon: <IconFile />, path: '/controltower/saas/quote-form', category: '超级运价', description: '创建新的报价单' },
  
  // 订单中心
  { key: 'order-management', title: '订单管理', icon: <IconList />, path: '/controltower/order-management', category: '订单中心', description: '管理订单信息' },
  
  // 船期中心
  { key: 'route-maintenance', title: '航线维护', icon: <IconSettingsIcon />, path: '/controltower/route-maintenance', category: '船期中心', description: '维护航线信息' },
  { key: 'schedule-query', title: '船期查询', icon: <IconCalendar />, path: '/controltower/schedule-query', category: '船期中心', description: '查询船期信息' },
  
  // 数据中心
  { key: 'port-management', title: '港口管理', icon: <IconHome />, path: '/controltower/port-management', category: '数据中心', description: '管理港口数据' },
  { key: 'carrier-management', title: '承运商管理', icon: <IconUser />, path: '/controltower/carrier-management', category: '数据中心', description: '管理承运商信息' },
  { key: 'country-region-management', title: '国家地区管理', icon: <IconHome />, path: '/controltower/country-region-management', category: '数据中心', description: '管理国家地区数据' },
  
  // 系统管理
  { key: 'user-management', title: '用户管理', icon: <IconUser />, path: '/controltower/user-management', category: '系统管理', description: '管理系统用户' },
  { key: 'employee-management', title: '员工管理', icon: <IconUser />, path: '/controltower/employee-management', category: '系统管理', description: '管理员工信息' },
  { key: 'permission-management', title: '权限管理', icon: <IconSettingsIcon />, path: '/controltower/permission-management', category: '系统管理', description: '管理系统权限' },
  { key: 'company-management', title: '公司管理', icon: <IconHome />, path: '/controltower/company-management', category: '系统管理', description: '管理公司信息' },
  
  // 销售百宝箱
  { key: 'customer-management', title: '客户管理', icon: <IconUser />, path: '/controltower/customer-management', category: '销售百宝箱', description: '管理客户信息' },
  { key: 'contact-management', title: '联系人管理', icon: <IconPhone />, path: '/controltower/contact-management', category: '销售百宝箱', description: '管理联系人信息' },
  { key: 'ai-customer-acquisition', title: 'AI获客', icon: <IconRobot />, path: '/controltower/ai-customer-acquisition', category: '销售百宝箱', description: 'AI智能获客' },
  { key: 'ai-marketing', title: 'AI营销', icon: <IconSound />, path: '/controltower/ai-marketing', category: '销售百宝箱', description: 'AI智能营销' },
];

// 按类别分组快捷入口
const groupShortcutsByCategory = (shortcuts: ShortcutItem[]) => {
  return shortcuts.reduce((groups, shortcut) => {
    const category = shortcut.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(shortcut);
    return groups;
  }, {} as Record<string, ShortcutItem[]>);
};

interface ShortcutSettingsProps {
  visible: boolean;
  onClose: () => void;
  selectedShortcuts: string[];
  onSave: (shortcuts: string[]) => void;
}

/**
 * 快捷入口设置弹窗组件
 * 允许用户选择和配置快捷入口按钮
 */
const ShortcutSettings: React.FC<ShortcutSettingsProps> = ({
  visible,
  onClose,
  selectedShortcuts,
  onSave,
}) => {
  const [checkedValues, setCheckedValues] = useState<string[]>(selectedShortcuts);
  const groupedShortcuts = groupShortcutsByCategory(ALL_SHORTCUTS);

  useEffect(() => {
    setCheckedValues(selectedShortcuts);
  }, [selectedShortcuts]);

  /**
   * 处理保存操作
   */
  const handleSave = () => {
    if (checkedValues.length === 0) {
      Message.warning('请至少选择一个快捷入口');
      return;
    }
    if (checkedValues.length > 12) {
      Message.warning('最多只能选择12个快捷入口');
      return;
    }
    onSave(checkedValues);
    onClose();
    Message.success('快捷入口设置已保存');
  };

  /**
   * 处理复选框变化
   */
  const handleCheckboxChange = (checkedValues: string[]) => {
    setCheckedValues(checkedValues);
  };

  /**
   * 处理全选/取消全选某个类别
   */
  const handleCategorySelectAll = (category: string, checked: boolean) => {
    const categoryShortcuts = groupedShortcuts[category].map(item => item.key);
    if (checked) {
      // 添加该类别的所有快捷入口
      const newValues = [...new Set([...checkedValues, ...categoryShortcuts])];
      setCheckedValues(newValues);
    } else {
      // 移除该类别的所有快捷入口
      const newValues = checkedValues.filter(value => !categoryShortcuts.includes(value as string));
      setCheckedValues(newValues);
    }
  };

  /**
   * 检查某个类别是否全选
   */
  const isCategoryAllSelected = (category: string) => {
    const categoryShortcuts = groupedShortcuts[category].map(item => item.key);
    return categoryShortcuts.every(key => checkedValues.includes(key));
  };

  /**
   * 检查某个类别是否部分选中
   */
  const isCategoryIndeterminate = (category: string) => {
    const categoryShortcuts = groupedShortcuts[category].map(item => item.key);
    const selectedCount = categoryShortcuts.filter(key => checkedValues.includes(key)).length;
    return selectedCount > 0 && selectedCount < categoryShortcuts.length;
  };

  return (
    <Modal
      title="设置快捷入口"
      visible={visible}
      onCancel={onClose}
      style={{ width: 800 }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          保存
        </Button>,
      ]}
    >
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <p style={{ marginBottom: 16, color: '#666' }}>
          选择您需要的快捷入口（最多12个），已选择：{checkedValues.length}/12
        </p>
        
        {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
          <div key={category} style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 12 }}>
              <Checkbox
                checked={isCategoryAllSelected(category)}
                indeterminate={isCategoryIndeterminate(category)}
                onChange={(checked) => handleCategorySelectAll(category, checked)}
                style={{ fontWeight: 'bold', fontSize: 16 }}
              >
                {category}
              </Checkbox>
            </div>
            
            <Checkbox.Group
              value={checkedValues}
              onChange={handleCheckboxChange}
              style={{ width: '100%' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', paddingLeft: 24 }}>
                {shortcuts.map((shortcut) => (
                  <Checkbox key={shortcut.key} value={shortcut.key}>
                    <span style={{ marginRight: 8 }}>{shortcut.icon}</span>
                    {shortcut.title}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
            
            <Divider style={{ margin: '16px 0' }} />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ShortcutSettings;
export { ALL_SHORTCUTS };
export type { ShortcutItem };