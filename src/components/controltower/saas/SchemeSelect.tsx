import React, { useState } from 'react';
import { Dropdown, Menu } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import { IconSettings } from '@arco-design/web-react/icon';

interface SchemeOption {
  id: string;
  name: string;
  isDefault?: boolean;
}

interface SchemeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  schemes: SchemeOption[];
  onSchemeManagement: () => void;
  placeholder?: string;
  style?: React.CSSProperties;
  size?: 'mini' | 'small' | 'default' | 'large';
}

const SchemeSelect: React.FC<SchemeSelectProps> = ({
  value,
  onChange,
  schemes,
  onSchemeManagement,
  placeholder = "选择方案",
  style = { width: '180px' }
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // 处理方案选择
  const handleSchemeSelect = (schemeId: string) => {
    if (onChange) {
      onChange(schemeId);
    }
    setDropdownVisible(false);
  };

  // 处理方案管理点击
  const handleSchemeManagement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownVisible(false);
    onSchemeManagement();
  };

  // 获取宽度值
  const getWidth = () => {
    if (typeof style?.width === 'string') {
      return style.width;
    } else if (typeof style?.width === 'number') {
      return `${style.width}px`;
    }
    return '180px';
  };

  // 创建下拉菜单
  const droplist = (
    <Menu style={{ maxHeight: '300px', minWidth: getWidth() }}>
      {/* 方案列表 - 可滚动区域 */}
      <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
        {schemes.map(scheme => (
          <Menu.Item 
            key={scheme.id} 
            onClick={() => handleSchemeSelect(scheme.id)}
            className={value === scheme.id ? 'arco-menu-item-selected' : ''}
          >
            <div className="flex items-center justify-between">
              <span>{scheme.name}</span>
              {scheme.isDefault && (
                <span className="text-xs text-green-500 ml-2">默认</span>
              )}
            </div>
          </Menu.Item>
        ))}
      </div>
      
      {/* 分割线 */}
      <div className="arco-menu-divider" style={{ margin: '4px 0', height: '1px', backgroundColor: '#f0f0f0' }} />
      
      {/* 固定的方案管理选项 */}
      <Menu.Item 
        key="scheme-management" 
        onClick={handleSchemeManagement}
        className="scheme-management-item"
        style={{ 
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid #f0f0f0',
          zIndex: 1
        }}
      >
        <div className="flex items-center gap-2">
          <IconSettings className="text-blue-500" />
          <span className="text-blue-500">方案管理</span>
        </div>
      </Menu.Item>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .scheme-management-item:hover {
            background-color: #f0f9ff !important;
          }
          .scheme-management-item {
            font-weight: 500 !important;
          }
          .scheme-management-item .text-blue-500 {
            color: #3b82f6 !important;
          }
        `
      }} />
    </Menu>
  );

  // 获取当前选中方案的名称
  const selectedScheme = schemes.find(s => s.id === value);
  const displayValue = selectedScheme ? selectedScheme.name : undefined;

  return (
    <Dropdown
      droplist={droplist}
      trigger="click"
      position="bottom"
      popupVisible={dropdownVisible}
      onVisibleChange={setDropdownVisible}
    >
      <div 
        className="arco-select arco-select-size-small cursor-pointer"
        style={{ 
          ...style, 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '28px',
          padding: '0 8px',
          border: '1px solid #C9CDD4',
          borderRadius: '0px',
          backgroundColor: '#fff'
        }}
      >
        <div style={{ 
          flex: 1, 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          marginRight: '16px',
          fontSize: '14px',
          color: displayValue ? '#1D2129' : '#86909C'
        }}>
          {displayValue || placeholder}
        </div>
        <div style={{ 
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px'
        }}>
          <IconDown 
            style={{ 
              fontSize: '12px',
              color: '#86909C',
              transform: dropdownVisible ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} 
          />
        </div>
      </div>
    </Dropdown>
  );
};

export default SchemeSelect; 