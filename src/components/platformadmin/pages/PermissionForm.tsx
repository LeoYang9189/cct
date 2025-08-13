import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Message,
  Cascader,
  Typography
} from '@arco-design/web-react';
import { IconArrowLeft, IconClose } from '@arco-design/web-react/icon';
import { useNavigate, useLocation } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

// 权限数据接口（用于类型定义）
interface Permission {
  id: string;
  nameZh: string;
  nameEn: string;
  permissionClass: string;
  permissionType: string;
  permissionCode: string;
  description?: string;
  parentId?: string;
  children?: Permission[];
  status: 'enabled' | 'disabled';
}

// 权限类选项
const permissionClassOptions = [
  { value: 'module', label: 'module' },
  { value: 'write', label: 'write' },
  { value: 'read', label: 'read' },
  { value: 'delete', label: 'delete' }
];

// 权限型选项
const permissionTypeOptions = [
  { value: 'subsystem', label: 'subsystem' },
  { value: 'basicinfo', label: 'basicinfo' },
  { value: 'business', label: 'business' },
  { value: 'report', label: 'report' },
  { value: 'system', label: 'system' }
];

const PermissionForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [permissionTree, setPermissionTree] = useState<any[]>([]);
  
  // 从路由状态获取数据
  const { permission, isEditing, parentPermission }: {
    permission?: Permission;
    isEditing?: boolean;
    parentPermission?: Permission;
  } = location.state || {};

  // 模拟权限树数据
  useEffect(() => {
    // 这里应该从API获取完整的权限树数据
    const mockTreeData = [
      {
        value: '1',
        label: '基础资料',
        children: [
          {
            value: '1-1',
            label: '海港',
            children: [
              {
                value: '1-1-1',
                label: '海港修改'
              }
            ]
          },
          {
            value: '1-2',
            label: '空港'
          }
        ]
      },
      {
        value: '2',
        label: '合作伙伴'
      },
      {
        value: '3',
        label: '汇率管理'
      },
      {
        value: '4',
        label: '收费项目'
      },
      {
        value: '5',
        label: '费用方案',
        children: [
          {
            value: '5-1',
            label: '参数设置'
          },
          {
            value: '5-2',
            label: '收发通地址'
          }
        ]
      },
      {
        value: '6',
        label: '国家',
        children: [
          {
            value: '6-1',
            label: '财务月管理'
          }
        ]
      }
    ];
    
    setPermissionTree(mockTreeData);
  }, []);

  // 根据ID路径查找权限名称路径
  const getPermissionNamePath = (idPath: string[]): string[] => {
    const namePath: string[] = [];
    
    const findNameInTree = (tree: any[], targetId: string): string | null => {
      for (const node of tree) {
        if (node.value === targetId) {
          return node.label;
        }
        if (node.children) {
          const found = findNameInTree(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    for (const id of idPath) {
      const name = findNameInTree(permissionTree, id);
      if (name) {
        namePath.push(name);
      }
    }
    
    return namePath;
  };

  // 初始化表单数据
  useEffect(() => {
    if (permissionTree.length === 0) return; // 等待权限树数据加载完成

    if (isEditing && permission) {
      // 编辑模式：填充现有数据
      const parentPath = getParentPath(permission.parentId);
      form.setFieldsValue({
        nameZh: permission.nameZh,
        nameEn: permission.nameEn,
        permissionClass: permission.permissionClass,
        permissionType: permission.permissionType,
        permissionCode: permission.permissionCode,
        description: permission.description,
        parentPermission: parentPath
      });
    } else if (parentPermission) {
      // 新增子权限模式：预设父权限
      const parentPath = getParentPath(parentPermission.id);
      form.setFieldsValue({
        parentPermission: parentPath
      });
    }
  }, [isEditing, permission, parentPermission, form, permissionTree]);

  // 获取父权限路径
  const getParentPath = (parentId?: string): string[] => {
    if (!parentId) return [];
    
    // 这里应该根据parentId查找完整的路径
    // 简化处理，直接返回ID数组
    const pathParts = parentId.split('-');
    const path: string[] = [];
    
    for (let i = 0; i < pathParts.length; i++) {
      if (i === 0) {
        path.push(pathParts[i]);
      } else {
        path.push(pathParts.slice(0, i + 1).join('-'));
      }
    }
    
    return path;
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validate();
      
      // 处理父权限ID
      const parentId = values.parentPermission && values.parentPermission.length > 0 
        ? values.parentPermission[values.parentPermission.length - 1] 
        : undefined;

      const formData = {
        ...values,
        parentId,
        parentPermission: undefined // 移除级联选择器的值，只保留parentId
      };

      console.log('提交数据:', formData);
      
      // 这里应该调用API保存数据
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      
      Message.success(isEditing ? '权限更新成功' : '权限创建成功');
      navigate('/platformadmin/permission-management');
    } catch (error) {
      console.error('保存失败:', error);
      Message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    navigate('/platformadmin/permission-management');
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题和操作 */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button 
            icon={<IconArrowLeft />} 
            onClick={handleCancel}
            style={{ padding: '4px 8px' }}
          />
          <Title heading={4} style={{ margin: 0 }}>
            {isEditing ? '编辑权限' : '新增权限'}
          </Title>
        </div>
        <Space size="medium">
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={loading}
            size="large"
            style={{ 
              borderRadius: '6px',
              padding: '8px 16px',
              minWidth: '100px'
            }}
          >
            {isEditing ? '更新' : '创建'}
          </Button>
          <Button 
            icon={<IconClose />}
            onClick={handleCancel}
            size="large"
            style={{ 
              borderRadius: '6px',
              padding: '8px 16px'
            }}
          >
            取消
          </Button>
        </Space>
      </div>

      {/* 表单卡片 */}
      <Card>
        <Form 
          form={form} 
          layout="vertical"
          style={{ maxWidth: '800px' }}
        >
          {/* 父权限选择 */}
          <Form.Item
            field="parentPermission"
            label="父权限"
            tooltip="选择父级权限，如果不选择则为根级权限"
          >
            <Cascader
              placeholder="请选择父权限（可选）"
              options={permissionTree}
              expandTrigger="hover"
              allowClear
              showSearch={{
                retainInputValue: true,
                retainInputValueWhileSelect: false
              }}
              style={{ width: '100%' }}
              onChange={(value) => {
                // 当选择改变时，可以在这里处理
                console.log('选择的父权限路径:', value);
              }}
            />
          </Form.Item>

          {/* 显示当前选择的父权限路径 */}
          <Form.Item shouldUpdate noStyle>
            {(values) => {
              const parentPath = values.parentPermission;
              if (parentPath && parentPath.length > 0) {
                const namePath = getPermissionNamePath(parentPath);
                return (
                  <div style={{ 
                    marginBottom: '24px',
                    padding: '12px',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#0369a1', marginBottom: '4px' }}>
                      当前选择的父权限路径：
                    </div>
                    <div style={{ fontSize: '14px', color: '#1e40af', fontWeight: 500 }}>
                      {namePath.join(' > ')}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          </Form.Item>

          {/* 基本信息 */}
          <div style={{ 
            marginBottom: '24px', 
            padding: '16px', 
            backgroundColor: '#fafbfc', 
            borderRadius: '6px',
            border: '1px solid #e5e6eb'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>基本信息</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                field="nameZh"
                label="权限名（中文）"
                rules={[{ required: true, message: '请输入中文权限名' }]}
              >
                <Input placeholder="请输入中文权限名" />
              </Form.Item>
              
              <Form.Item
                field="nameEn"
                label="权限名（英文）"
                rules={[{ required: true, message: '请输入英文权限名' }]}
              >
                <Input placeholder="请输入英文权限名" />
              </Form.Item>
            </div>
          </div>

          {/* 权限分类 */}
          <div style={{ 
            marginBottom: '24px', 
            padding: '16px', 
            backgroundColor: '#fafbfc', 
            borderRadius: '6px',
            border: '1px solid #e5e6eb'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>权限分类</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                field="permissionClass"
                label="权限类"
                rules={[{ required: true, message: '请选择权限类' }]}
              >
                <Select placeholder="请选择权限类">
                  {permissionClassOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                field="permissionType"
                label="权限型"
                rules={[{ required: true, message: '请选择权限型' }]}
              >
                <Select placeholder="请选择权限型">
                  {permissionTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* 权限标识 */}
          <div style={{ 
            marginBottom: '24px', 
            padding: '16px', 
            backgroundColor: '#fafbfc', 
            borderRadius: '6px',
            border: '1px solid #e5e6eb'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>权限标识</h4>
            
            <Form.Item
              field="permissionCode"
              label="权限点"
              rules={[{ required: true, message: '请输入权限点' }]}
            >
              <Input 
                placeholder="请输入权限点代码" 
                style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
              />
            </Form.Item>
          </div>

          {/* 权限描述 */}
          <div style={{ 
            marginBottom: '32px', 
            padding: '16px', 
            backgroundColor: '#fafbfc', 
            borderRadius: '6px',
            border: '1px solid #e5e6eb'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>权限描述</h4>
            
            <Form.Item
              field="description"
              label="详细描述"
            >
              <TextArea 
                placeholder="请输入权限的详细描述" 
                rows={4}
                showWordLimit
                maxLength={500}
              />
            </Form.Item>
          </div>


        </Form>
      </Card>
    </div>
  );
};

export default PermissionForm; 