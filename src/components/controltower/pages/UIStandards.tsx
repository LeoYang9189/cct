import React, { useState } from 'react';
import { 
  Card, 
  Grid,
  Tabs,
  Button,
  Input,
  Select,
  Message,
  Modal,
  Drawer,
  Form
} from '@arco-design/web-react';
import { 
  IconPalette, 
  IconFile,
  IconSettings,
  IconCode,
  IconPlus,
  IconEdit,
  IconDelete,
  IconSearch,
  IconRefresh,
  IconSave,
  IconArrowLeft,
  IconUpload,
  IconDownload,
  IconEye
} from '@arco-design/web-react/icon';

const { Row, Col } = Grid;
const { TabPane } = Tabs;

const UIStandards: React.FC = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
      {/* 主要内容区域 */}
      <Tabs 
        activeTab={activeTab} 
        onChange={setActiveTab}
        size="large"
        style={{ background: 'white', borderRadius: '8px', padding: '16px' }}
      >
        {/* 颜色规范 */}
        <TabPane key="colors" title={
          <span>
            <IconPalette style={{ marginRight: '8px' }} />
            颜色规范
          </span>
        }>
          <div style={{ padding: '16px 0' }}>
            
            <Row gutter={24}>
              <Col span={12}>
                <Card title="主色调" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#165DFF', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#165DFF</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>主蓝色 - 按钮、链接、强调色</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#4080FF', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#4080FF</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>浅蓝色 - 渐变、辅助色</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="状态颜色" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#00B42A', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#00B42A</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>成功/正常状态</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#F53F3F', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#F53F3F</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>错误/危险状态</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#F7BA1E', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#F7BA1E</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>警告/待处理状态</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            
            <Row gutter={24}>
              <Col span={12}>
                <Card title="文字颜色" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#1d2129', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#1d2129</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>主要文字色</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#4e5969', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#4e5969</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>次要文字色</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#86909c', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#86909c</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>提示文字色</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="背景颜色" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#f7f8fa', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#f7f8fa</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>页面背景色</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#f2f3f5', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#f2f3f5</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>内容区背景色</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#ffffff', 
                        borderRadius: '6px',
                        border: '1px solid #e0e6ed'
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>#ffffff</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>卡片/组件背景色</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        {/* 字体规范 */}
        <TabPane key="typography" title={
          <span>
            <IconFile style={{ marginRight: '8px' }} />
            字体规范
          </span>
        }>
          <div style={{ padding: '16px 0' }}>
            
            <Row gutter={24}>
              <Col span={12}>
                <Card title="字体大小规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1d2129', marginBottom: '4px' }}>超大标题</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>36px - 主页标题、重要展示文字</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d2129', marginBottom: '4px' }}>大标题</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>24px - 页面主标题、统计数字</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1d2129', marginBottom: '4px' }}>中等标题</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>18px - 卡片标题、章节标题</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1d2129', marginBottom: '4px' }}>小标题</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>16px - 表单标题、弹窗标题</div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="正文字体规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '14px', color: '#1d2129', marginBottom: '4px' }}>主要正文</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>14px - 表格内容、表单输入、按钮文字</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '13px', color: '#4e5969', marginBottom: '4px' }}>次要正文</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>13px - 辅助说明、次要信息</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '4px' }}>提示文字</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>12px - 提示信息、时间戳、标签</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '4px' }}>小字提示</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>11px - 极小提示、版权信息</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Card title="Title组件层级规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1d2129', marginBottom: '8px' }}>heading=2</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>页面主标题</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1d2129', marginBottom: '8px' }}>heading=3</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>页面副标题</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1d2129', marginBottom: '8px' }}>heading=4</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>卡片标题</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1d2129', marginBottom: '8px' }}>heading=5</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>区块标题</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1d2129', marginBottom: '8px' }}>heading=6</div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>小标题</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Card title="字体族规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>系统默认字体</div>
                      <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '8px' }}>system-ui, -apple-system, sans-serif</div>
                      <div style={{ fontSize: '14px', color: '#4e5969' }}>用于：界面文字、按钮、标签等</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ fontFamily: 'Courier New, monospace', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>等宽字体</div>
                      <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '8px' }}>Courier New, monospace</div>
                      <div style={{ fontSize: '14px', color: '#4e5969' }}>用于：代码、ID、时间戳等</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        {/* 组件规范 */}
        <TabPane key="components" title={
          <span>
            <IconSettings style={{ marginRight: '8px' }} />
            组件规范
          </span>
        }>
          <div style={{ padding: '16px 0' }}>
            
            <Row gutter={24}>
              <Col span={8}>
                <Card title="按钮规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>主要按钮</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="primary" icon={<IconSave />}>保存</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>type="primary" + 图标</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>次要按钮</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="outline" icon={<IconPlus />}>新增</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>type="outline" + 图标</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>文字按钮</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="text" icon={<IconEdit />}>编辑</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>type="text" + 图标</div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={8}>
                <Card title="图标规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>CRUD操作图标</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <IconPlus style={{ color: '#165DFF' }} /> 新增
                        <IconEdit style={{ color: '#165DFF' }} /> 编辑
                        <IconDelete style={{ color: '#F53F3F' }} /> 删除
                        <IconEye style={{ color: '#86909c' }} /> 查看
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>固定图标组合</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>操作图标</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <IconSearch style={{ color: '#165DFF' }} /> 搜索
                        <IconRefresh style={{ color: '#86909c' }} /> 重置
                        <IconUpload style={{ color: '#165DFF' }} /> 上传
                        <IconDownload style={{ color: '#165DFF' }} /> 下载
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>常用操作图标</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>导航图标</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <IconArrowLeft style={{ color: '#86909c' }} /> 返回
                        <IconSave style={{ color: '#165DFF' }} /> 保存
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>页面导航图标</div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={8}>
                <Card title="状态按钮" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>成功状态</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="text" status="success">启用</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>type="text" status="success" 绿色字体</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>警告状态</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="text" status="warning">禁用</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>type="text" status="warning" 橙色字体</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>危险状态</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="text" status="danger" icon={<IconDelete />}>删除</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>type="text" status="danger" 红色字体</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Card title="表单组件规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>输入框</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Input placeholder="请输入内容" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>placeholder要清晰说明输入要求</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>下拉选择</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Select placeholder="请选择..." style={{ width: '100%' }}>
                          <Select.Option value="option1">选项1</Select.Option>
                        </Select>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>默认显示"请选择..."提示</div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="消息提示规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>成功提示样例</div>
                      <div style={{ marginBottom: '8px', padding: '8px 12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px', color: '#52c41a', fontSize: '12px' }}>
                        ✅ 操作已成功
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>Message.success() 绿色成功提示</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>错误提示样例</div>
                      <div style={{ marginBottom: '8px', padding: '8px 12px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '4px', color: '#ff4d4f', fontSize: '12px' }}>
                        ❌ 操作失败
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>Message.error() 红色错误提示</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>警告提示样例</div>
                      <div style={{ marginBottom: '8px', padding: '8px 12px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '4px', color: '#faad14', fontSize: '12px' }}>
                        ⚠️ 请注意
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>Message.warning() 橙色警告提示</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>信息提示样例</div>
                      <div style={{ marginBottom: '8px', padding: '8px 12px', backgroundColor: '#f6ffed', border: '1px solid #91d5ff', borderRadius: '4px', color: '#1890ff', fontSize: '12px' }}>
                        ℹ️ 这是一条信息
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>Message.info() 蓝色信息提示</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Card title="筛选区域规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>条件操作符样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <Select placeholder="操作符" style={{ width: '80px' }} size="small">
                          <Select.Option value="equal">等于</Select.Option>
                          <Select.Option value="notEqual">不等于</Select.Option>
                          <Select.Option value="contains">包含</Select.Option>
                          <Select.Option value="notContains">不包含</Select.Option>
                        </Select>
                        <Input placeholder="请输入" style={{ width: '120px' }} size="small" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>每个输入控件前必须有操作符选择</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>筛选方案功能样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px' }}>方案:</span>
                        <Select placeholder="选择方案" style={{ width: '120px' }} size="small">
                          <Select.Option value="default">默认方案</Select.Option>
                          <Select.Option value="custom1">自定义方案1</Select.Option>
                        </Select>
                        <Button size="small" type="outline">另存为方案</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>支持保存、应用、删除筛选方案</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>展开收起样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Button type="text" size="small">收起</Button>
                        <Button type="text" size="small">展开</Button>
                        <Button type="outline" size="small" icon={<IconSettings />}>增减条件</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>默认显示第一行，支持展开全部条件</div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="自定义表格抽屉" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>抽屉操作样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Button type="outline" icon={<IconSettings />} size="small" onClick={() => setDrawerVisible(true)}>自定义表格</Button>
                        <span style={{ fontSize: '12px', color: '#86909c' }}>→ 抽屉弹出 width=480</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>点击触发抽屉，配置表格列显示</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>快捷操作样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center', padding: '8px', backgroundColor: '#f2f3f5', borderRadius: '4px' }}>
                        <span style={{ fontSize: '12px' }}>已选 8/15 个字段</span>
                        <Button size="small" onClick={() => Message.success('已全选所有字段')}>全选</Button>
                        <Button size="small" onClick={() => Message.info('已清空所有选择')}>清空</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>显示选择状态，提供全选全不选</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>拖拽排序样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', padding: '6px', border: '1px solid #e5e6e7', borderRadius: '4px', backgroundColor: 'white' }}>
                          <span style={{ marginRight: '8px', color: '#86909c' }}>⋮⋮</span>
                          <span style={{ fontSize: '12px', backgroundColor: '#f2f3f5', padding: '2px 6px', borderRadius: '2px', marginRight: '8px' }}>1</span>
                          <span style={{ fontSize: '12px', flex: 1 }}>运价号</span>
                          <Button size="mini" type="text">✓</Button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', padding: '6px', border: '1px solid #e5e6e7', borderRadius: '4px', backgroundColor: 'white' }}>
                          <span style={{ marginRight: '8px', color: '#86909c' }}>⋮⋮</span>
                          <span style={{ fontSize: '12px', backgroundColor: '#f2f3f5', padding: '2px 6px', borderRadius: '2px', marginRight: '8px' }}>2</span>
                          <span style={{ fontSize: '12px', flex: 1 }}>起运港</span>
                          <Button size="mini" type="text">✓</Button>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>支持拖拽改变列顺序，Switch控制显示</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Card title="响应式布局规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>大屏适配 (≥1200px)</div>
                      <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                        • 筛选区：Col span={8} 一行三列<br/>
                        • 卡片网格：3-4列布局<br/>
                        • 表格：完整显示所有列<br/>
                        • 侧边栏：展开显示菜单文字
                      </div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>中屏适配 (768-1199px)</div>
                      <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                        • 筛选区：Col span={12} 一行两列<br/>
                        • 卡片网格：2列布局<br/>
                        • 表格：部分列隐藏，滚动查看<br/>
                        • 侧边栏：可折叠，显示图标
                      </div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>小屏适配 (≤767px)</div>
                      <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                        • 筛选区：Col span={24} 单列布局<br/>
                        • 卡片网格：1列垂直排列<br/>
                        • 表格：转为卡片列表模式<br/>
                        • 侧边栏：抽屉模式
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        {/* 高级组件规范 */}
        <TabPane key="advanced" title={
          <span>
            <IconCode style={{ marginRight: '8px' }} />
            高级组件规范
          </span>
        }>
          <div style={{ padding: '16px 0' }}>
            
            <Row gutter={24}>
              <Col span={8}>
                <Card title="行政区划级联选择器" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>四级级联样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Select placeholder="请选择省份" size="small">
                          <Select.Option value="guangdong">广东省</Select.Option>
                          <Select.Option value="beijing">北京市</Select.Option>
                        </Select>
                        <Select placeholder="请选择城市" size="small">
                          <Select.Option value="guangzhou">广州市</Select.Option>
                          <Select.Option value="shenzhen">深圳市</Select.Option>
                        </Select>
                        <Select placeholder="请选择区县" size="small">
                          <Select.Option value="tianhe">天河区</Select.Option>
                          <Select.Option value="nanshan">南山区</Select.Option>
                        </Select>
                        <Select placeholder="请选择街道" size="small">
                          <Select.Option value="zhujiang">珠江街道</Select.Option>
                          <Select.Option value="shahe">沙河街道</Select.Option>
                        </Select>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>省→市→区→街道四级联动选择</div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={8}>
                <Card title="日期区间选择器" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>RangePicker样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Input placeholder="开始日期 - 结束日期" size="small" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>DatePicker.RangePicker组件</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>时间范围样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Input placeholder="开始时间 - 结束时间" size="small" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>TimePicker.RangePicker组件</div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={8}>
                <Card title="下拉复选框" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>多选下拉样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Select mode="multiple" placeholder="请选择多个选项" size="small" style={{ width: '100%' }}>
                          <Select.Option value="option1">选项1</Select.Option>
                          <Select.Option value="option2">选项2</Select.Option>
                          <Select.Option value="option3">选项3</Select.Option>
                        </Select>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>mode="multiple" 支持多选</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Card title="弹窗组件规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                         <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                       <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>标准弹窗样例</div>
                       <div style={{ marginBottom: '8px' }}>
                         <Button size="small" onClick={() => setModalVisible(true)}>打开弹窗</Button>
                       </div>
                       <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                         • title: 标题文字<br/>
                         • footer: [取消, 确认]按钮<br/>
                         • onCancel: 关闭弹窗<br/>
                         • maskClosable: false
                       </div>
                     </div>
                     <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                       <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>抽屉组件样例</div>
                       <div style={{ marginBottom: '8px' }}>
                         <Button size="small" onClick={() => setDrawerVisible(true)}>打开抽屉</Button>
                       </div>
                       <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                         • width: 480 | 720 | 1080<br/>
                         • placement: "right"<br/>
                         • footer: 底部操作按钮<br/>
                         • 适用于配置类页面
                       </div>
                     </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="加载和状态" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Loading状态样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                        <Button loading size="small">加载中</Button>
                        <Button size="small">正常状态</Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>loading=true 显示加载图标</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>面包屑导航样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ color: '#165DFF', fontSize: '12px', cursor: 'pointer' }}>控制台</span>
                        <span style={{ color: '#86909c', fontSize: '12px' }}>/</span>
                        <span style={{ color: '#165DFF', fontSize: '12px', cursor: 'pointer' }}>系统管理</span>
                        <span style={{ color: '#86909c', fontSize: '12px' }}>/</span>
                        <span style={{ color: '#1d2129', fontSize: '12px' }}>UI规范</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>Breadcrumb组件层级导航</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Card title="表格组件完整规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>表头排序样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>创建时间</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '10px', color: '#165DFF' }}>▲</span>
                          <span style={{ fontSize: '10px', color: '#86909c' }}>▼</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>sorter: true 启用排序功能</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>多选Checkbox样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" />
                        <span style={{ fontSize: '12px' }}>全选</span>
                        <span style={{ fontSize: '12px', color: '#86909c' }}>(已选 3/10)</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>rowSelection 多选功能</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>分页组件样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                        <span>共 156 条</span>
                        <span>|</span>
                        <span>每页</span>
                        <select style={{ fontSize: '12px' }}>
                          <option>10</option>
                          <option>20</option>
                        </select>
                        <span>条</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>showTotal + sizeCanChange</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>

        {/* 标准功能 */}
        <TabPane key="functions" title={
          <span>
            <IconCode style={{ marginRight: '8px' }} />
            标准功能
          </span>
        }>
          <div style={{ padding: '16px 0' }}>
            
            <Row gutter={24}>
              <Col span={12}>
                <Card title="CRUD操作规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#165DFF' }}>新增功能样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="primary" icon={<IconPlus />} onClick={() => Message.success('合约已添加')}>
                          新增合约
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                        type="primary" + IconPlus<br/>
                        成功提示：名称+已添加
                      </div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#165DFF' }}>编辑功能样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="text" icon={<IconEdit />} onClick={() => Message.success('信息已更新')}>
                          编辑
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                        type="text" + IconEdit<br/>
                        成功提示：信息已更新
                      </div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#F53F3F' }}>删除功能样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="text" status="danger" icon={<IconDelete />} onClick={() => Message.success('已删除')}>
                          删除
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                        type="text" status="danger" + IconDelete<br/>
                        必须有确认弹窗
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="状态切换规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#00B42A' }}>启用操作样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="text" status="success" onClick={() => Message.success('合约已启用')}>
                          启用
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                        type="text" status="success"<br/>
                        批量操作：批量启用 (5)
                      </div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#F7BA1E' }}>禁用操作样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="text" status="warning" onClick={() => Message.success('合约已禁用')}>
                          禁用
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c', lineHeight: '1.6' }}>
                        type="text" status="warning"<br/>
                        批量操作：批量禁用 (3)
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Card title="弹窗交互规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>确认弹窗样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="text" status="danger" onClick={() => {
                          // 模拟确认弹窗
                          if (window.confirm('确认删除此项吗？\n\n删除后将无法恢复，请谨慎操作。')) {
                            Message.success('删除成功');
                          }
                        }}>
                          删除操作
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>危险操作弹窗确认示例</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>表单弹窗样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button type="primary" onClick={() => {
                          Message.info('📝 新增用户弹窗已打开\n\n布局：layout="vertical"\n必填验证：用户名、邮箱\n按钮：取消、保存');
                        }}>
                          新增用户
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>表单弹窗配置示例</div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="搜索筛选规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>搜索功能样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Input placeholder="请输入关键词" allowClear size="small" style={{ width: '150px' }} />
                        <Button type="primary" icon={<IconSearch />} size="small" onClick={() => Message.success('🔍 搜索完成，找到 23 条结果')}>
                          搜索
                        </Button>
                        <Button icon={<IconRefresh />} size="small" onClick={() => Message.info('🔄 筛选条件已重置')}>
                          重置
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>搜索按钮+重置按钮+结果提示</div>
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>筛选卡片样例</div>
                      <div style={{ marginBottom: '8px', padding: '12px', backgroundColor: '#fafbfc', borderRadius: '4px', border: '1px solid #e5e6e7' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>筛选条件</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          <Select placeholder="状态" allowClear size="small">
                            <Select.Option value="active">启用</Select.Option>
                            <Select.Option value="inactive">禁用</Select.Option>
                          </Select>
                          <Input placeholder="开始日期 - 结束日期" size="small" />
                          <Select placeholder="分类" allowClear size="small">
                            <Select.Option value="type1">类型1</Select.Option>
                            <Select.Option value="type2">类型2</Select.Option>
                          </Select>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>三列网格布局筛选卡片</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Card title="数据加载规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Loading状态样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Button loading size="small">数据保存中...</Button>
                        <div style={{ padding: '8px', backgroundColor: '#f2f3f5', borderRadius: '4px', textAlign: 'center', fontSize: '12px' }}>
                          🔄 表格数据加载中...
                        </div>
                        <Button 
                          size="small" 
                          loading={loading}
                          onClick={() => {
                            setLoading(true);
                            setTimeout(() => {
                              setLoading(false);
                              Message.success('操作完成！');
                            }, 2000);
                          }}
                        >
                          模拟加载
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>按钮loading + 表格loading</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>空数据状态样例</div>
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ padding: '40px 20px', backgroundColor: '#fafbfc', borderRadius: '4px', textAlign: 'center', border: '1px dashed #d9d9d9' }}>
                          <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.6 }}>📄</div>
                          <div style={{ fontSize: '14px', color: '#86909c', marginBottom: '4px' }}>暂无数据</div>
                          <div style={{ fontSize: '12px', color: '#bbb' }}>当前筛选条件下没有找到相关数据</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>标准空状态展示，无操作按钮</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>错误处理样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Button size="small" status="danger" onClick={() => {
                          Message.error('❌ 网络请求失败，请稍后重试');
                          console.log('网络错误处理逻辑');
                        }}>
                          网络错误
                        </Button>
                        <Button size="small" status="warning" onClick={() => {
                          Message.error('❌ 数据验证失败：用户名不能为空');
                          console.log('验证错误处理逻辑');
                        }}>
                          验证错误
                        </Button>
                        <Button size="small" status="danger" onClick={() => {
                          Message.error('❌ 服务器异常 (500)，请联系管理员');
                          console.log('服务器错误处理逻辑');
                        }}>
                          服务器错误
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>具体的错误信息提示</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Card title="页面导航规范" style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>面包屑导航样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', alignItems: 'center', padding: '8px', backgroundColor: '#fafbfc', borderRadius: '4px' }}>
                        <span style={{ color: '#165DFF', fontSize: '12px', cursor: 'pointer' }} onClick={() => Message.info('返回控制台')}>控制台</span>
                        <span style={{ color: '#86909c', fontSize: '12px' }}>/</span>
                        <span style={{ color: '#165DFF', fontSize: '12px', cursor: 'pointer' }} onClick={() => Message.info('返回系统管理')}>系统管理</span>
                        <span style={{ color: '#86909c', fontSize: '12px' }}>/</span>
                        <span style={{ color: '#1d2129', fontSize: '12px' }}>UI规范</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>可点击的三级面包屑导航</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid #e5e6e7', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>操作按钮组样例</div>
                      <div style={{ marginBottom: '8px', display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', padding: '8px', backgroundColor: '#fafbfc', borderRadius: '4px' }}>
                        <Button type="text" icon={<IconArrowLeft />} size="small" onClick={() => Message.info('返回上一页')}>
                          返回
                        </Button>
                        <Button size="small" onClick={() => Message.info('取消操作')}>
                          取消
                        </Button>
                        <Button type="primary" icon={<IconSave />} size="small" onClick={() => Message.success('保存成功')}>
                          保存
                        </Button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#86909c' }}>右对齐操作按钮组合</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>


          </div>
        </TabPane>
      </Tabs>

      {/* 弹窗示例 */}
      <Modal
        title="新增用户"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={() => {
            setModalVisible(false);
            Message.success('用户创建成功');
          }}>
            确认
          </Button>
        ]}
        maskClosable={false}
      >
        <Form layout="vertical">
          <Form.Item label="用户名" required>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="邮箱" required>
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
          <Form.Item label="角色">
            <Select placeholder="请选择角色">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="user">普通用户</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 抽屉示例 */}
      <Drawer
        title="系统设置"
        visible={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        width={480}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button onClick={() => setDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => {
              setDrawerVisible(false);
              Message.success('设置已保存');
            }}>
              确认
            </Button>
          </div>
        }
      >
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>通知设置</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <input type="checkbox" id="email" defaultChecked />
                <label htmlFor="email" style={{ marginLeft: '8px' }}>邮件通知</label>
              </div>
              <div>
                <input type="checkbox" id="sms" />
                <label htmlFor="sms" style={{ marginLeft: '8px' }}>短信通知</label>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>界面设置</div>
            <Select placeholder="选择主题" style={{ width: '100%' }}>
              <Select.Option value="light">浅色主题</Select.Option>
              <Select.Option value="dark">深色主题</Select.Option>
            </Select>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default UIStandards; 