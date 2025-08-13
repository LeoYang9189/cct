import React, { useState } from 'react';
import { 
  Drawer, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Message, 
  Input,
  Popconfirm 
} from '@arco-design/web-react';
import { 
  IconEdit, 
  IconDelete, 
  IconCheckCircle,
  IconCheck,
  IconClose
} from '@arco-design/web-react/icon';

// 方案数据接口
export interface SchemeData {
  id: string;
  name: string;
  isDefault: boolean;
  createTime: string;
  conditions: any[];
}

interface SchemeManagementModalProps {
  visible: boolean;
  onCancel: () => void;
  schemes: SchemeData[];
  onDeleteScheme: (id: string) => void;
  onSetDefault: (id: string) => void;
  onRenameScheme: (id: string, newName: string) => void;
}

const SchemeManagementModal: React.FC<SchemeManagementModalProps> = ({
  visible,
  onCancel,
  schemes,
  onDeleteScheme,
  onSetDefault,
  onRenameScheme
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // 开始编辑
  const startEdit = (id: string, currentName: string) => {
    // 如果是默认方案（id为'default'），不允许编辑
    if (id === 'default') {
      Message.warning('默认方案名称不可修改');
      return;
    }
    setEditingId(id);
    setEditingName(currentName);
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // 确认编辑
  const confirmEdit = () => {
    if (!editingName.trim()) {
      Message.error('方案名称不能为空');
      return;
    }
    
    if (editingId) {
      onRenameScheme(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
      Message.success('方案名称修改成功');
    }
  };

  // 删除方案
  const handleDelete = (id: string) => {
    // 默认方案（id为'default'）不能删除
    if (id === 'default') {
      Message.error('系统默认方案不能删除');
      return;
    }
    const scheme = schemes.find(s => s.id === id);
    if (scheme?.isDefault) {
      Message.error('当前默认方案不能删除');
      return;
    }
    onDeleteScheme(id);
    Message.success('方案删除成功');
  };

  // 设为默认
  const handleSetDefault = (id: string) => {
    onSetDefault(id);
    Message.success('已设为默认方案');
  };

  const columns = [
    {
      title: '方案名称',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (name: string, record: SchemeData) => {
        if (editingId === record.id) {
          return (
            <div className="flex items-center gap-2">
              <Input
                value={editingName}
                onChange={setEditingName}
                placeholder="请输入方案名称"
                style={{ width: '180px' }}
                maxLength={50}
              />
              <Button 
                type="primary" 
                size="mini"
                icon={<IconCheck />}
                onClick={confirmEdit}
              />
              <Button 
                size="mini"
                icon={<IconClose />}
                onClick={cancelEdit}
              />
            </div>
          );
        }
        // 如果是系统默认方案（id为'default'），不允许编辑
        if (record.id === 'default') {
          return (
            <span className="text-gray-700">
              {name}
              <Tag color="blue" size="small" className="ml-2">系统默认</Tag>
            </span>
          );
        }
        
        return (
          <span 
            className="cursor-pointer hover:text-blue-500"
            onDoubleClick={() => startEdit(record.id, name)}
            title="双击编辑"
          >
            {name}
          </span>
        );
      }
    },
    {
      title: '是否默认',
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: 100,
      render: (isDefault: boolean) => (
        isDefault ? (
          <Tag color="green" icon={<IconCheckCircle />}>是</Tag>
        ) : (
          <Tag color="gray">否</Tag>
        )
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: SchemeData) => (
        <Space>
          {/* 系统默认方案不显示编辑按钮 */}
          {record.id !== 'default' && (
            <Button 
              type="text"
              size="mini"
              icon={<IconEdit />}
              onClick={() => startEdit(record.id, record.name)}
            >
              编辑
            </Button>
          )}
          {/* 只有非当前默认方案才显示"设为默认"按钮 */}
          {!record.isDefault && (
            <Button 
              type="text"
              size="mini"
              onClick={() => handleSetDefault(record.id)}
              style={{ color: '#00B42A' }}
            >
              设为默认
            </Button>
          )}
          {/* 当前默认方案不显示删除按钮 */}
          {!record.isDefault && (
            <Popconfirm
              title="方案删除后无法恢复，确认删除？"
              onOk={() => handleDelete(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button 
                type="text"
                size="mini"
                icon={<IconDelete />}
                status="danger"
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <Drawer
      title="方案管理"
      visible={visible}
      onCancel={onCancel}
      footer={
        <div className="flex justify-end">
          <Button onClick={onCancel}>
            关闭
          </Button>
        </div>
      }
      width={800}
    >
      <div className="mb-4 text-gray-600 text-sm">
        管理您的筛选方案，双击方案名称可快速编辑
      </div>
      
      <Table
        columns={columns}
        data={schemes}
        rowKey="id"
        pagination={false}
        scroll={{ y: 400 }}
        noDataElement={
          <div className="text-center py-8 text-gray-500">
            暂无方案，请先保存筛选方案
          </div>
        }
      />
      
      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <div className="font-medium mb-1">使用说明：</div>
        <div>• 双击方案名称可直接编辑（系统默认方案除外）</div>
        <div>• 只能有一个默认方案</div>
        <div>• 系统默认方案和当前默认方案不能删除</div>
        <div>• 点击设为默认，可以更改默认方案</div>
      </div>
    </Drawer>
  );
};

export default SchemeManagementModal; 