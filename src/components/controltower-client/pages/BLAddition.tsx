import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Typography, 
  Space, 
  Input, 
  Form,
  Upload,
  Message,
  Modal,
  Checkbox,
  Table
} from '@arco-design/web-react';
import { 
  IconLeft, 
  IconUpload,
  IconSend,
  IconClose,
  IconCheck,
  IconFile,
  IconRefresh,
  IconRight,
  IconLeft as IconLeftArrow,
  IconExclamationCircle,
  IconInfoCircle
} from '@arco-design/web-react/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLightbulb,
  faShield,
  faListCheck
} from '@fortawesome/free-solid-svg-icons';

const { Title, Text } = Typography;
const TextArea = Input.TextArea;

// 使用Arco Design的上传文件类型定义
type UploadItem = import('@arco-design/web-react/es/Upload/interface').UploadItem;

// 识别结果字段类型
interface RecognizedField {
  fieldName: string;
  recognizedValue: string;
  currentValue: string;
  isDifferent: boolean;
  isAccepted: boolean;
}

// 字段分组类型
interface FieldGroup {
  title: string;
  fields: RecognizedField[];
}

// 保函类型定义
interface GuaranteeType {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

// 校验规则类型
interface ValidationRule {
  field: string;
  message: string;
}

const BLAddition: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadItem[]>([]);
  
  // 提单字段数据
  const [shipper, setShipper] = useState('ROOM 2101, BUILDING 9, 970 DALIAN ROAD, YANGPU DISTRICT, SHANGHAI WALLTECH LIMIT CO.,LTD');
  const [consignee, setConsignee] = useState('1213');
  const [notifyParty, setNotifyParty] = useState('SAME AS CONSIGNEE');
  const [forwardingAgent, setForwardingAgent] = useState('');
  const [vessel, setVessel] = useState('756543');
  const [voyage, setVoyage] = useState('qewewrwer');
  const [portOfLoading, setPortOfLoading] = useState('PALEMBANG');
  const [portOfDischarge, setPortOfDischarge] = useState('SHERMAN OAKS');
  const [placeOfReceipt, setPlaceOfReceipt] = useState('');
  // 注释下面这行，因为没有使用该状态
  // const [placeOfDelivery, setPlaceOfDelivery] = useState('PALEMBANG');
  const [placeOfIssue, setPlaceOfIssue] = useState('PALEMBANG');
  const [finalDestination, setFinalDestination] = useState('SHERMAN OAKS');
  const [dateOfIssue, setDateOfIssue] = useState('2025-05-08');
  const [containerNumbers, setContainerNumbers] = useState('1*20GP');
  const [packageCount, setPackageCount] = useState('12');
  // 注释下面这行，因为没有使用该状态
  // const [packageType, setPackageType] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [grossWeight, setGrossWeight] = useState('12.000');
  const [measurement, setMeasurement] = useState('12.000');
  const [transTerm, setTransTerm] = useState('CY-CY');
  const [freightTerm, setFreightTerm] = useState('PP');
  const [originalCount, setOriginalCount] = useState('ONE');
  const [marks, setMarks] = useState('');
  const [goodsDescription, setGoodsDescription] = useState('');
  const [portRequirements, setPortRequirements] = useState('');
  const [remarks, setRemarks] = useState('');
  
  // 设备信息
  const [eqSize, setEqSize] = useState('20');
  const [eqType, setEqType] = useState('GP');
  const [eqNo, setEqNo] = useState('XH234');
  const [sealNo, setSealNo] = useState('FH1234');
  const [eqWeight, setEqWeight] = useState('0.000');
  const [eqPackageCount, setEqPackageCount] = useState('12');
  const [eqGrossWeight, setEqGrossWeight] = useState('12.000');
  const [eqMeasurement, setEqMeasurement] = useState('12.000');
  
  // B/L方式
  const [blWay, setBlWay] = useState('surrendered');
  
  // 增加规则提示弹窗状态
  const [rulesVisible, setRulesVisible] = useState(false);

  // AI识别相关状态
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiResults, setAiResults] = useState<FieldGroup[]>([]);
  const [aiFileList, setAiFileList] = useState<UploadItem[]>([]);
  const [aiFilePreview, setAiFilePreview] = useState<string>('');
  const [showResultComparison, setShowResultComparison] = useState(false);
  
  // 保函相关状态
  const [guaranteeModalVisible, setGuaranteeModalVisible] = useState(false);
  const [guaranteePreviewVisible, setGuaranteePreviewVisible] = useState(false);
  const [guaranteeTypes, setGuaranteeTypes] = useState<GuaranteeType[]>([
    {
      id: "loa_bl_amendment",
      title: "提单修改申请函",
      description: "Letter of Application for Bill of Lading Amendment",
      checked: false
    },
    {
      id: "loi_switch_bl",
      title: "申请转换提单保函",
      description: "LOI for Switch Bill of Lading",
      checked: false
    },
    {
      id: "loi_split_bl_1",
      title: "提单分票收货人保函",
      description: "LOI for Split Bill of Lading-Different B/Ls in Same Container",
      checked: false
    },
    {
      id: "loi_split_bl_2",
      title: "提单分票收货人保函",
      description: "LOI for Split Bill of Lading-Different B/Ls in Same Container",
      checked: false
    },
    {
      id: "letter_telex_release_1",
      title: "电放申请书(使用于提单签发后收回全套正本提单)",
      description: "Letter of application for telex release (the format for the full set of original BLs returned)",
      checked: false
    },
    {
      id: "letter_telex_release_2",
      title: "电放申请书(使用于未签发提单)",
      description: "Letter of application for telex release (the format for none BL issued)",
      checked: false
    },
    {
      id: "application_telex_cancellation",
      title: "电放撤销申请书",
      description: "Application for Telex Release Cancellation",
      checked: false
    },
    {
      id: "letter_confirmation_telex",
      title: "收货人电放确认函",
      description: "Letter of Confirmation for Telex Release",
      checked: false
    }
  ]);
  const [generatedGuarantees, setGeneratedGuarantees] = useState<{id: string, title: string, content: string}[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  
  // 校验提示相关状态
  const [validationModalVisible, setValidationModalVisible] = useState(false);
  
  // 强制校验规则
  const mandatoryRules: ValidationRule[] = [
    {
      field: '收货人',
      message: '目的港为巴西港口（代码BR开头），必须提供收货人VAT税号'
    },
    {
      field: '通知方',
      message: '不能为空，如与收货人相同，请填写"SAME AS CONSIGNEE"'
    },
    {
      field: '货物描述',
      message: '危险品必须标注IMO危险品等级和UN编号'
    },
    {
      field: '集装箱号',
      message: '集装箱号格式不正确，必须为4位字母+7位数字，例如:ABCD1234567'
    },
    {
      field: '包装件数',
      message: '包装件数必须为整数，不能包含小数点'
    }
  ];
  
  // 软性提示规则
  const softRules: ValidationRule[] = [
    {
      field: '发货人',
      message: '建议填写完整公司名称及地址，包含邮编和国家'
    },
    {
      field: '收货人',
      message: '使用英文填写，避免使用特殊字符和缩写'
    },
    {
      field: '船名/航次',
      message: '建议确认船名和航次信息与订舱单一致'
    },
    {
      field: '毛重/尺寸',
      message: '建议换算确认毛重单位为KGS，尺寸单位为CBM'
    },
    {
      field: '唛头',
      message: '建议填写标记和编号，便于识别货物'
    },
    {
      field: '封号',
      message: '建议填写海关封号或船公司封号'
    }
  ];
  
  // 表格列定义
  const tableColumns = [
    {
      title: '字段名',
      dataIndex: 'field',
      width: 150,
    },
    {
      title: '校验提示',
      dataIndex: 'message',
    }
  ];
  
  // 生成随机的识别结果（实际项目中应从API获取）
  const generateMockRecognitionResults = () => {
    const mockShipper = 'ROOM 2101, BUILDING 9, 970 DALIAN ROAD, YANGPU DISTRICT, SHANGHAI WALLTECH CO.,LTD';
    const mockConsignee = 'TECHWORLD LOGISTICS LLC\n2356 CROWN LANE, SHERMAN OAKS, CA 90210, USA';
    const mockNotifyParty = 'SAME AS CONSIGNEE';
    const mockVessel = 'MSC SHANGHAI / 756543';
    const mockVoyage = 'QWE2023001';
    
    return [
      {
        title: '托运人/收货人信息',
        fields: [
          { 
            fieldName: '发货人(Shipper)', 
            recognizedValue: mockShipper, 
            currentValue: shipper, 
            isDifferent: mockShipper !== shipper,
            isAccepted: false 
          },
          { 
            fieldName: '收货人(Consignee)', 
            recognizedValue: mockConsignee, 
            currentValue: consignee, 
            isDifferent: mockConsignee !== consignee,
            isAccepted: false 
          },
          { 
            fieldName: '通知方(Notify Party)', 
            recognizedValue: mockNotifyParty, 
            currentValue: notifyParty, 
            isDifferent: mockNotifyParty !== notifyParty,
            isAccepted: false 
          },
        ]
      },
      {
        title: '运输信息',
        fields: [
          { 
            fieldName: '船名(Vessel)', 
            recognizedValue: mockVessel, 
            currentValue: vessel, 
            isDifferent: mockVessel !== vessel,
            isAccepted: false 
          },
          { 
            fieldName: '航次(Voyage)', 
            recognizedValue: mockVoyage, 
            currentValue: voyage, 
            isDifferent: mockVoyage !== voyage,
            isAccepted: false 
          },
          { 
            fieldName: '起运港(Port of Loading)', 
            recognizedValue: 'PALEMBANG, INDONESIA', 
            currentValue: portOfLoading, 
            isDifferent: 'PALEMBANG, INDONESIA' !== portOfLoading,
            isAccepted: false 
          },
          { 
            fieldName: '卸货港(Port of Discharge)', 
            recognizedValue: 'LOS ANGELES, USA', 
            currentValue: portOfDischarge, 
            isDifferent: 'LOS ANGELES, USA' !== portOfDischarge,
            isAccepted: false 
          },
        ]
      },
      {
        title: '货物信息',
        fields: [
          { 
            fieldName: '集装箱号(Container Numbers)', 
            recognizedValue: '1*20GP', 
            currentValue: containerNumbers, 
            isDifferent: false,
            isAccepted: false 
          },
          { 
            fieldName: '包装件数(Packages)', 
            recognizedValue: '12 PALLETS', 
            currentValue: packageCount, 
            isDifferent: '12 PALLETS' !== packageCount,
            isAccepted: false 
          },
          { 
            fieldName: '货物描述(Description)', 
            recognizedValue: 'ELECTRONIC COMPONENTS\nHSCODE: 8542.31.00\nNON-HAZARDOUS\nNON-DANGEROUS', 
            currentValue: goodsDescription, 
            isDifferent: goodsDescription === '',
            isAccepted: false 
          },
        ]
      }
    ];
  };
  
  const handleGoBack = () => {
    navigate('/controltower/order-detail/' + (orderId || ''));
  };

  const handleSubmit = () => {
    // 首先显示校验提示弹窗
    setValidationModalVisible(true);
  };

  const handleConfirmSubmit = () => {
    setValidationModalVisible(false);
    
    // 执行原有的提交逻辑
    form.validate().then(() => {
      // 提交成功
      Message.success('提单补料信息已提交');
      // 返回订单详情页
      setTimeout(() => {
        handleGoBack();
      }, 1500);
    }).catch(e => {
      // 验证错误
      console.error('表单验证失败', e);
    });
  };
  
  const handleCancelSubmit = () => {
    setValidationModalVisible(false);
  };

  const handleCancel = () => {
    handleGoBack();
  };

  const handleAIRecognition = () => {
    // 显示AI识别弹窗
    setAiModalVisible(true);
    setAiFileList([]);
    setShowResultComparison(false);
    setAiFilePreview('');
  };
  
  const handleAiFileChange = (files: UploadItem[]) => {
    setAiFileList(files);
    
    // 如果有上传的文件，创建预览
    if (files.length > 0 && files[0].originFile) {
      const file = files[0].originFile;
      const reader = new FileReader();
      reader.onload = () => {
        setAiFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAiFilePreview('');
    }
  };
  
  const handleRunRecognition = () => {
    if (aiFileList.length === 0) {
      Message.error('请先上传提单文件');
      return;
    }
    
    setAiProcessing(true);
    
    // 模拟识别过程
    setTimeout(() => {
      setAiProcessing(false);
      setShowResultComparison(true);
      
      // 生成模拟识别结果
      const results = generateMockRecognitionResults();
      setAiResults(results);
    }, 2000);
  };
  
  const handleAcceptField = (groupIndex: number, fieldIndex: number) => {
    const newResults = [...aiResults];
    const field = newResults[groupIndex].fields[fieldIndex];
    field.isAccepted = true;
    setAiResults(newResults);
    
    // 更新对应的字段值
    const fieldName = field.fieldName;
    const value = field.recognizedValue;
    
    // 根据字段名称更新相应的状态
    switch(fieldName) {
      case '发货人(Shipper)':
        setShipper(value);
        break;
      case '收货人(Consignee)':
        setConsignee(value);
        break;
      case '通知方(Notify Party)':
        setNotifyParty(value);
        break;
      case '船名(Vessel)':
        setVessel(value);
        break;
      case '航次(Voyage)':
        setVoyage(value);
        break;
      case '起运港(Port of Loading)':
        setPortOfLoading(value);
        break;
      case '卸货港(Port of Discharge)':
        setPortOfDischarge(value);
        break;
      case '集装箱号(Container Numbers)':
        setContainerNumbers(value);
        break;
      case '包装件数(Packages)':
        setPackageCount(value);
        break;
      case '货物描述(Description)':
        setGoodsDescription(value);
        break;
      default:
        break;
    }
    
    Message.success(`已接受 "${fieldName}" 的识别结果`);
  };
  
  const handleRejectField = (groupIndex: number, fieldIndex: number) => {
    const newResults = [...aiResults];
    newResults[groupIndex].fields[fieldIndex].isAccepted = false;
    setAiResults(newResults);
    Message.info('已拒绝该识别结果');
  };
  
  const handleAcceptAll = () => {
    const newResults = [...aiResults];
    
    // 遍历所有字段并接受
    newResults.forEach(group => {
      group.fields.forEach(field => {
        if (field.isDifferent) {
          field.isAccepted = true;
          
          // 更新对应的字段值
          switch(field.fieldName) {
            case '发货人(Shipper)':
              setShipper(field.recognizedValue);
              break;
            case '收货人(Consignee)':
              setConsignee(field.recognizedValue);
              break;
            case '通知方(Notify Party)':
              setNotifyParty(field.recognizedValue);
              break;
            case '船名(Vessel)':
              setVessel(field.recognizedValue);
              break;
            case '航次(Voyage)':
              setVoyage(field.recognizedValue);
              break;
            case '起运港(Port of Loading)':
              setPortOfLoading(field.recognizedValue);
              break;
            case '卸货港(Port of Discharge)':
              setPortOfDischarge(field.recognizedValue);
              break;
            case '集装箱号(Container Numbers)':
              setContainerNumbers(field.recognizedValue);
              break;
            case '包装件数(Packages)':
              setPackageCount(field.recognizedValue);
              break;
            case '货物描述(Description)':
              setGoodsDescription(field.recognizedValue);
              break;
            default:
              break;
          }
        }
      });
    });
    
    setAiResults(newResults);
    Message.success('已接受所有识别结果');
    setAiModalVisible(false);
  };
  
  const handleRejectAll = () => {
    const newResults = [...aiResults];
    
    newResults.forEach(group => {
      group.fields.forEach(field => {
        field.isAccepted = false;
      });
    });
    
    setAiResults(newResults);
    Message.info('已拒绝所有识别结果');
    setAiModalVisible(false);
  };
  
  const handleCloseAiModal = () => {
    setAiModalVisible(false);
  };

  const handleGenerateGuarantee = () => {
    setGuaranteeModalVisible(true);
  };
  
  const handleGuaranteeModalCancel = () => {
    setGuaranteeModalVisible(false);
    // 重置选择状态
    setGuaranteeTypes(prev => prev.map(type => ({...type, checked: false})));
  };
  
  const handleToggleGuaranteeType = (id: string) => {
    setGuaranteeTypes(prev => 
      prev.map(type => 
        type.id === id 
          ? {...type, checked: !type.checked} 
          : type
      )
    );
  };
  
  const handleConfirmGenerateGuarantee = () => {
    const selectedTypes = guaranteeTypes.filter(type => type.checked);
    
    if (selectedTypes.length === 0) {
      Message.warning('请至少选择一种保函类型');
      return;
    }
    
    // 模拟生成保函内容（实际应用中可能需要调用API）
    const generatedDocs = selectedTypes.map(type => {
      let content = '';
      
      // 根据不同类型生成不同内容
      switch(type.id) {
        case 'loa_bl_amendment':
          content = `
TO: ${shipper}

Dear Sirs,

Re: M/V "${vessel}", Voyage ${voyage}
    B/L NO: ${orderId || 'TBD'}

We hereby request you to amend the Bill of Lading as follows:

FROM: ${consignee}
TO: TECHWORLD LOGISTICS LLC
2356 CROWN LANE, SHERMAN OAKS, CA 90210, USA

We hereby agree to indemnify you, your servants and agents and to hold all of you harmless in respect of any liability, loss, damage or expense of whatsoever nature which you may sustain by reason of delivering the cargo in accordance with our request.

Yours faithfully,
          `;
          break;
          
        case 'loi_switch_bl':
          content = `
Letter of Indemnity for Switch Bill of Lading

TO: ${shipper}

Dear Sirs,

Re: M/V "${vessel}", Voyage ${voyage}
    B/L NO: ${orderId || 'TBD'}

We hereby request you to issue a new set of Bills of Lading in substitution for and to replace the original Bills of Lading for the above shipment, the new Bills of Lading to be issued in identical form in all respects to the original Bills of Lading except as follows:

SHIPPER: ${shipper}
CONSIGNEE: TECHWORLD LOGISTICS LLC
2356 CROWN LANE, SHERMAN OAKS, CA 90210, USA

...
          `;
          break;
          
        default:
          content = `
Sample Guarantee Letter for ${type.title}

From: WALLTECH CO.,LTD
ROOM 2101, BUILDING 9, 970 DALIAN ROAD, YANGPU DISTRICT, SHANGHAI

To: Shipping Company

Re: M/V "${vessel}", Voyage ${voyage}
    B/L NO: ${orderId || 'TBD'}

Date: ${new Date().toLocaleDateString()}

Dear Sirs,

We hereby request [specific request based on guarantee type]...

[Content would be generated based on specific guarantee type]

This guarantee shall be governed by and construed in accordance with [Governing Law] and any dispute arising out of or in connection with this guarantee shall be referred to [Jurisdiction].

Yours faithfully,

WALLTECH CO.,LTD
          `;
      }
      
      return {
        id: type.id,
        title: type.title,
        content: content.trim()
      };
    });
    
    setGeneratedGuarantees(generatedDocs);
    setCurrentPreviewIndex(0);
    setGuaranteeModalVisible(false);
    setGuaranteePreviewVisible(true);
  };
  
  const handleGuaranteePreviewCancel = () => {
    setGuaranteePreviewVisible(false);
    setGeneratedGuarantees([]);
    setCurrentPreviewIndex(0);
  };
  
  const handlePreviousGuarantee = () => {
    if (currentPreviewIndex > 0) {
      setCurrentPreviewIndex(prev => prev - 1);
    }
  };
  
  const handleNextGuarantee = () => {
    if (currentPreviewIndex < generatedGuarantees.length - 1) {
      setCurrentPreviewIndex(prev => prev + 1);
    }
  };
  
  const handleConfirmAndGenerateGuarantees = () => {
    // 这里可以添加保存或下载保函的逻辑
    Message.success('保函生成成功');
    setGuaranteePreviewVisible(false);
  };

  const handleShowRules = () => {
    setRulesVisible(true);
  };

  const handleCloseRules = () => {
    setRulesVisible(false);
  };
  
  // 处理文件上传
  const handleFileChange = (fileList: UploadItem[]) => {
    setFileList(fileList);
  };

  return (
    <div className="bl-addition-page">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button
            type="text"
            icon={<IconLeft />}
            onClick={handleGoBack}
            className="mr-2"
          />
          <Title heading={5} style={{ margin: 0 }}>CT1234567890 - 提单补料</Title>
        </div>
        <div>
          <Space>
            <Button 
              type="outline" 
              icon={<FontAwesomeIcon icon={faLightbulb} />}
              onClick={handleAIRecognition}
            >
              AI识别
            </Button>
            <Button 
              type="outline" 
              icon={<FontAwesomeIcon icon={faShield} />}
              onClick={handleGenerateGuarantee}
            >
              保函生成
            </Button>
            <Button 
              type="outline" 
              icon={<FontAwesomeIcon icon={faListCheck} />}
              onClick={handleShowRules}
            >
              规则提示
            </Button>
            <Button 
              type="primary" 
              icon={<IconSend />}
              onClick={handleSubmit}
            >
              提交补料
            </Button>
            <Button 
              type="secondary" 
              icon={<IconClose />}
              onClick={handleCancel}
            >
              取消
            </Button>
          </Space>
        </div>
      </div>

      <Card bordered={false} className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title heading={4} className="text-gray-700">Master B/L</Title>
          </div>
          <div>
            <Upload
              listType="picture-card"
              multiple
              fileList={fileList}
              onChange={handleFileChange}
              action="/"
              className="float-right"
            >
              <div className="arco-upload-trigger-picture">
                <div className="arco-upload-trigger-picture-text">
                  <IconUpload /> 上传提单附件
                </div>
              </div>
            </Upload>
          </div>
        </div>
        
        <Form form={form} layout="vertical" autoComplete="off" className="mt-6">
          <div className="grid grid-cols-12 gap-4">
            {/* 左侧部分：发货人、收货人、通知方 */}
            <div className="col-span-7">
              {/* 发货人 */}
              <div className="border border-gray-300 rounded-md mb-4">
                <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                  发货人(Shipper)
                </div>
                <div className="p-2">
                  <TextArea 
                    value={shipper}
                    onChange={value => setShipper(value)}
                    style={{ minHeight: '130px', border: 'none', padding: '0' }}
                  />
                </div>
              </div>
              
              {/* 收货人 */}
              <div className="border border-gray-300 rounded-md mb-4">
                <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                  收货人(Consignee)
                </div>
                <div className="p-2">
                  <TextArea 
                    value={consignee}
                    onChange={value => setConsignee(value)}
                    style={{ minHeight: '110px', border: 'none', padding: '0' }}
                  />
                </div>
              </div>
              
              {/* 通知方 */}
              <div className="border border-gray-300 rounded-md mb-5">
                <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                  通知方(Notify Party)
                </div>
                <div className="p-2">
                  <TextArea 
                    value={notifyParty}
                    onChange={value => setNotifyParty(value)}
                    style={{ minHeight: '110px', border: 'none', padding: '0' }}
                  />
                </div>
              </div>
            </div>

            {/* 右侧部分：分单号和运费条款等 */}
            <div className="col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {/* 分单号 */}
                <div className="col-span-2">
                  <div className="border border-gray-300 rounded-md mb-4">
                    <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                      分单号(B/L NO)
                    </div>
                    <div className="p-2">
                      <Input 
                        style={{ border: 'none', padding: '0' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* 运费条款 */}
                <div className="col-span-1">
                  <div className="border border-gray-300 rounded-md mb-4">
                    <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                      付款方式(FRT Term)
                    </div>
                    <div className="p-2">
                      <Input 
                        value={freightTerm}
                        onChange={value => setFreightTerm(value)}
                        style={{ border: 'none', padding: '0' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* 付款地点 */}
                <div className="col-span-1">
                  <div className="border border-gray-300 rounded-md mb-4">
                    <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                      付款地点(Paid Place)
                    </div>
                    <div className="p-2">
                      <Input 
                        value={placeOfIssue}
                        onChange={value => setPlaceOfIssue(value)}
                        style={{ border: 'none', padding: '0' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* 主单号 */}
                <div className="col-span-1">
                  <div className="border border-gray-300 rounded-md mb-4">
                    <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                      主单号(MB/L NO)
                    </div>
                    <div className="p-2">
                      <Input
                        value="MBL123435465"
                        style={{ border: 'none', padding: '0' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* 关单号 */}
                <div className="col-span-1">
                  <div className="border border-gray-300 rounded-md mb-4">
                    <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                      关单号(S/O No)
                    </div>
                    <div className="p-2">
                      <Input
                        value="so1344"
                        style={{ border: 'none', padding: '0' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* 份数 */}
                <div className="col-span-1">
                  <div className="border border-gray-300 rounded-md mb-4">
                    <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                      份数(No.of Original)
                    </div>
                    <div className="p-2">
                      <Input
                        value={originalCount}
                        onChange={value => setOriginalCount(value)}
                        style={{ border: 'none', padding: '0' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 备注 */}
              <div className="border border-gray-300 rounded-md mb-4">
                <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                  备注(Remarks)
                </div>
                <div className="p-2">
                  <TextArea 
                    value={remarks}
                    onChange={value => setRemarks(value)}
                    style={{ minHeight: '80px', border: 'none', padding: '0' }}
                  />
                </div>
              </div>
              
              {/* 代理 */}
              <div className="border border-gray-300 rounded-md mb-4">
                <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                  代理信息(Forwarding Agent)
                </div>
                <div className="p-2">
                  <TextArea 
                    value={forwardingAgent}
                    onChange={value => setForwardingAgent(value)}
                    style={{ minHeight: '80px', border: 'none', padding: '0' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 船舶信息表格 */}
          <div className="border border-gray-300 rounded-md mb-4 overflow-hidden">
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-2 bg-gray-100 border-r border-gray-300 w-1/6">船名<br/>(Vessel)</td>
                  <td className="p-2 border-r border-gray-300 w-1/6">
                    <Input value={vessel} onChange={value => setVessel(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                  <td className="p-2 bg-gray-100 border-r border-gray-300 w-1/6">航次<br/>(Voyage)</td>
                  <td className="p-2 border-r border-gray-300 w-1/6">
                    <Input value={voyage} onChange={value => setVoyage(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                  <td className="p-2 bg-gray-100 border-r border-gray-300 w-1/6">运输条款<br/>(Trans Term)</td>
                  <td className="p-2 w-1/6">
                    <Input value={transTerm} onChange={value => setTransTerm(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-2 bg-gray-100 border-r border-gray-300">签发地点<br/>(Place of Issue)</td>
                  <td className="p-2 border-r border-gray-300">
                    <Input value={placeOfIssue} onChange={value => setPlaceOfIssue(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                  <td className="p-2 bg-gray-100 border-r border-gray-300">签发日期<br/>(Date of Issue)</td>
                  <td className="p-2 border-r border-gray-300" colSpan={3}>
                    <Input value={dateOfIssue} onChange={value => setDateOfIssue(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 bg-gray-100 border-r border-gray-300">收货地<br/>(Place of Receipt)</td>
                  <td className="p-2 border-r border-gray-300">
                    <Input value={placeOfReceipt} onChange={value => setPlaceOfReceipt(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                  <td className="p-2 bg-gray-100 border-r border-gray-300">起运港<br/>(Port of loading)</td>
                  <td className="p-2 border-r border-gray-300">
                    <Input value={portOfLoading} onChange={value => setPortOfLoading(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                  <td className="p-2 bg-gray-100 border-r border-gray-300">件数<br/>(No.of Pkgs)</td>
                  <td className="p-2">
                    <Input value={packageCount} onChange={value => setPackageCount(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* 货物信息表格 */}
          <div className="border border-gray-300 rounded-md mb-4 overflow-hidden">
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-2 bg-gray-100 border-r border-gray-300 w-1/6">卸货港<br/>(Port of Discharge)</td>
                  <td className="p-2 border-r border-gray-300 w-1/6">
                    <Input value={portOfDischarge} onChange={value => setPortOfDischarge(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                  <td className="p-2 bg-gray-100 border-r border-gray-300 w-1/6">交货地<br/>(Final Destination)</td>
                  <td className="p-2 border-r border-gray-300 w-1/6">
                    <Input value={finalDestination} onChange={value => setFinalDestination(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                  <td className="p-2 bg-gray-100 border-r border-gray-300 w-1/6">毛重<br/>(Gross Weight)</td>
                  <td className="p-2 w-1/6">
                    <div className="flex items-center">
                      <Input value={grossWeight} onChange={value => setGrossWeight(value)} style={{ border: 'none', padding: '0' }} />
                      <span className="text-xs ml-1">KGS</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 bg-gray-100 border-r border-gray-300">HS 编号<br/>(HS Code)</td>
                  <td className="p-2 border-r border-gray-300">
                    <Input value={hsCode} onChange={value => setHsCode(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                  <td className="p-2 bg-gray-100 border-r border-gray-300">尺寸<br/>(Measurement)</td>
                  <td className="p-2 border-r border-gray-300">
                    <div className="flex items-center">
                      <Input value={measurement} onChange={value => setMeasurement(value)} style={{ border: 'none', padding: '0' }} />
                      <span className="text-xs ml-1">CBM</span>
                    </div>
                  </td>
                  <td className="p-2 bg-gray-100 border-r border-gray-300">集装箱号码<br/>(Container Numbers)</td>
                  <td className="p-2">
                    <Input value={containerNumbers} onChange={value => setContainerNumbers(value)} style={{ border: 'none', padding: '0' }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* 唛头、货物描述、港口要求 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-1">
              <div className="border border-gray-300 rounded-md h-full">
                <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                  唛头(Marks)
                </div>
                <div className="p-2">
                  <TextArea 
                    value={marks}
                    onChange={value => setMarks(value)}
                    style={{ minHeight: '120px', border: 'none', padding: '0' }}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-1">
              <div className="border border-gray-300 rounded-md h-full">
                <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                  货物品名(Description of Goods)
                </div>
                <div className="p-2">
                  <TextArea 
                    value={goodsDescription}
                    onChange={value => setGoodsDescription(value)}
                    style={{ minHeight: '120px', border: 'none', padding: '0' }}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-1">
              <div className="border border-gray-300 rounded-md h-full">
                <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
                  港口操作要求(Port requirements)
                </div>
                <div className="p-2">
                  <TextArea 
                    value={portRequirements}
                    onChange={value => setPortRequirements(value)}
                    style={{ minHeight: '120px', border: 'none', padding: '0' }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 设备信息表格 */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">装箱信息(EQ Info)</div>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="p-2 border-r border-gray-300 text-left">箱型<br/>(EQ size)</th>
                    <th className="p-2 border-r border-gray-300 text-left">箱种<br/>(EQ type)</th>
                    <th className="p-2 border-r border-gray-300 text-left">箱号<br/>(EQ No.)</th>
                    <th className="p-2 border-r border-gray-300 text-left">封号<br/>(Seal No)</th>
                    <th className="p-2 border-r border-gray-300 text-left">箱重<br/>(EQ Weight)</th>
                    <th className="p-2 border-r border-gray-300 text-left">件数<br/>(No.of Pkgs)</th>
                    <th className="p-2 border-r border-gray-300 text-left">毛重<br/>(Gross Weight)</th>
                    <th className="p-2 text-left">体积<br/>(Measurement)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-r border-gray-300">
                      <Input value={eqSize} onChange={value => setEqSize(value)} style={{ border: 'none', padding: '0' }} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <Input value={eqType} onChange={value => setEqType(value)} style={{ border: 'none', padding: '0' }} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <Input value={eqNo} onChange={value => setEqNo(value)} style={{ border: 'none', padding: '0' }} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <Input value={sealNo} onChange={value => setSealNo(value)} style={{ border: 'none', padding: '0' }} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <Input value={eqWeight} onChange={value => setEqWeight(value)} style={{ border: 'none', padding: '0' }} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <Input value={eqPackageCount} onChange={value => setEqPackageCount(value)} style={{ border: 'none', padding: '0' }} />
                    </td>
                    <td className="p-2 border-r border-gray-300">
                      <Input value={eqGrossWeight} onChange={value => setEqGrossWeight(value)} style={{ border: 'none', padding: '0' }} />
                    </td>
                    <td className="p-2">
                      <Input value={eqMeasurement} onChange={value => setEqMeasurement(value)} style={{ border: 'none', padding: '0' }} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* 大写金额 */}
          <div className="border border-gray-300 rounded-md mb-4">
            <div className="text-xs px-2 py-1 bg-gray-100 border-b border-gray-300">
              件数大写(Quantity in Capital)
            </div>
            <div className="p-2">
              <Input value="SAY TWELVE ONLY" style={{ border: 'none', padding: '0' }} />
            </div>
          </div>
          
          {/* 提单方式 */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">提单方式(BL Way)</div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="original" 
                  name="blWay" 
                  checked={blWay === 'original'} 
                  onChange={() => setBlWay('original')} 
                  className="mr-2"
                />
                <label htmlFor="original">正本(Original)</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="surrendered" 
                  name="blWay" 
                  checked={blWay === 'surrendered'} 
                  onChange={() => setBlWay('surrendered')} 
                  className="mr-2"
                />
                <label htmlFor="surrendered">电放(Surrendered)</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="seawaybill" 
                  name="blWay" 
                  checked={blWay === 'seawaybill'} 
                  onChange={() => setBlWay('seawaybill')} 
                  className="mr-2"
                />
                <label htmlFor="seawaybill">海运单(SEA WAYBILL)</label>
              </div>
            </div>
          </div>
        </Form>
      </Card>

      {/* 规则提示弹窗 */}
      <Modal
        title="提单补料指南"
        visible={rulesVisible}
        onCancel={handleCloseRules}
        footer={null}
        style={{ width: '600px' }}
      >
        <div className="mt-4">
          <Text className="block text-blue-800 font-medium mb-2">填写提示：</Text>
          <ul className="list-disc pl-5 text-blue-700">
            <li className="mb-2">发货人和收货人必须填写完整的公司名称和详细地址</li>
            <li className="mb-2">货物描述必须与实际货物一致，并使用英文填写</li>
            <li className="mb-2">重量和尺寸必须准确填写，单位需标明</li>
            <li className="mb-2">集装箱号格式需正确，例如：1*20GP，2*40HQ等</li>
            <li className="mb-2">建议使用AI识别功能快速导入信息</li>
          </ul>
          
          <div className="mt-4">
            <Text className="block text-blue-800 font-medium mb-2">常见错误：</Text>
            <ul className="list-disc pl-5 text-blue-700">
              <li className="mb-2">提单信息与订舱单不一致</li>
              <li className="mb-2">发货人/收货人信息不完整</li>
              <li className="mb-2">重量与货物描述不匹配</li>
              <li className="mb-2">危险品信息缺失或不准确</li>
            </ul>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button type="primary" onClick={handleCloseRules}>
              我知道了
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* AI识别模态窗口 */}
      <Modal
        title="AI提单识别"
        visible={aiModalVisible}
        onCancel={handleCloseAiModal}
        footer={null}
        style={{ 
          width: showResultComparison ? '98vw' : '500px', 
          height: showResultComparison ? '98vh' : 'auto', 
          maxWidth: showResultComparison ? '98vw' : '500px' 
        }}
        className="ai-recognition-modal"
        wrapClassName="ai-modal-wrapper"
      >
        {!showResultComparison ? (
          <div className="p-6">
            <div className="text-center mb-8">
              <Title heading={5} className="mb-2">上传提单文件进行AI识别</Title>
              <Text className="text-gray-500">支持JPG、PNG、PDF格式，文件大小不超过10MB</Text>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="w-80 h-60 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:border-blue-300 hover:bg-gray-100 transition-all">
                <Upload
                  drag
                  fileList={aiFileList}
                  onChange={handleAiFileChange}
                  limit={1}
                  accept=".jpg,.jpeg,.png,.pdf"
                  action="/"
                  autoUpload={false}
                  showUploadList={false}
                  className="arco-upload-custom-drag"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="text-blue-500 text-3xl mb-2"><IconUpload /></span>
                    <p className="mb-2 text-sm text-gray-700 font-medium">点击或拖拽上传</p>
                    <p className="text-xs text-gray-500">PDF格式</p>
                  </div>
                </Upload>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                type="primary" 
                icon={<IconRefresh />} 
                onClick={handleRunRecognition}
                loading={aiProcessing}
                disabled={aiFileList.length === 0}
                size="large"
              >
                {aiProcessing ? '识别中...' : '开始识别'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="recognition-results h-full" style={{ maxHeight: '95vh' }}>
            <div className="flex justify-between items-center mb-4 px-4 pt-2">
              <Title heading={5}>识别结果对比</Title>
              <Space>
                <Button type="primary" onClick={handleAcceptAll}>接受全部</Button>
                <Button onClick={handleRejectAll}>拒绝全部</Button>
                <Button onClick={handleCloseAiModal}>取消</Button>
              </Space>
            </div>
            
            <div className="grid grid-cols-12 gap-4 px-4 pb-4" style={{ height: 'calc(98vh - 80px)', maxHeight: 'calc(98vh - 80px)' }}>
              {/* 左侧：文件预览 */}
              <div className="col-span-3 border border-gray-200 rounded-md overflow-hidden">
                <div className="text-sm font-medium p-2 bg-gray-50 border-b border-gray-200 text-center">文件预览</div>
                <div className="file-preview bg-gray-100 flex items-center justify-center" style={{ height: 'calc(98vh - 120px)' }}>
                  {aiFilePreview ? (
                    <img 
                      src={aiFilePreview} 
                      alt="提单预览" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <IconFile style={{ fontSize: '48px' }} />
                      <div className="mt-2">无法预览文件</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 中间：识别结果 */}
              <div className="col-span-4 border border-gray-200 rounded-md overflow-hidden">
                <div className="text-sm font-medium p-2 bg-gray-50 border-b border-gray-200 text-center">
                  识别结果
                </div>
                <div className="overflow-auto p-3 pb-20" style={{ height: 'calc(98vh - 120px)' }}>
                  {aiResults.map((group, groupIndex) => (
                    <div key={`group-${groupIndex}`} className="mb-5">
                      <div className="text-md font-medium mb-3 bg-gray-100 p-2 rounded sticky top-0 z-10">
                        {group.title}
                      </div>
                      <div className="pl-2">
                        {group.fields.map((field, fieldIndex) => (
                          <div 
                            key={`field-${groupIndex}-${fieldIndex}`} 
                            className={`mb-4 p-3 rounded border ${field.isDifferent ? 'bg-yellow-50 border-yellow-200' : 'border-gray-100 bg-white'}`}
                          >
                            <div className="text-sm font-medium mb-2">{field.fieldName}</div>
                            <div className="text-sm whitespace-pre-wrap bg-white p-2 rounded border border-gray-100 min-h-[40px]">
                              {field.recognizedValue || '无识别结果'}
                            </div>
                            {field.isDifferent && !field.isAccepted && (
                              <div className="flex justify-end mt-2">
                                <Button 
                                  type="text" 
                                  size="mini" 
                                  className="text-green-600"
                                  icon={<IconCheck />}
                                  onClick={() => handleAcceptField(groupIndex, fieldIndex)}
                                >
                                  接受
                                </Button>
                                <Button 
                                  type="text" 
                                  size="mini" 
                                  className="text-red-600 ml-2"
                                  icon={<IconClose />}
                                  onClick={() => handleRejectField(groupIndex, fieldIndex)}
                                >
                                  拒绝
                                </Button>
                              </div>
                            )}
                            {field.isAccepted && (
                              <div className="text-green-600 text-xs mt-2 flex items-center">
                                <IconCheck /> <span className="ml-1">已接受</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 右侧：当前内容 */}
              <div className="col-span-5 border border-gray-200 rounded-md overflow-hidden">
                <div className="text-sm font-medium p-2 bg-gray-50 border-b border-gray-200 text-center">
                  当前内容
                </div>
                <div className="overflow-auto p-3 pb-20" style={{ height: 'calc(98vh - 120px)' }}>
                  {aiResults.map((group, groupIndex) => (
                    <div key={`current-group-${groupIndex}`} className="mb-5">
                      <div className="text-md font-medium mb-3 bg-gray-100 p-2 rounded sticky top-0 z-10">
                        {group.title}
                      </div>
                      <div className="pl-2">
                        {group.fields.map((field, fieldIndex) => (
                          <div 
                            key={`current-field-${groupIndex}-${fieldIndex}`} 
                            className={`mb-4 p-3 rounded border ${field.isDifferent ? 'bg-yellow-50 border-yellow-200' : 'border-gray-100 bg-white'}`}
                          >
                            <div className="text-sm font-medium mb-2">{field.fieldName}</div>
                            <div className="text-sm whitespace-pre-wrap bg-white p-2 rounded border border-gray-100 min-h-[40px]">
                              {field.currentValue || '未填写'}
                            </div>
                            {field.isDifferent && (
                              <div className="text-orange-500 text-xs mt-2 flex items-center">
                                <IconRefresh /> <span className="ml-1">与识别结果不同</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 保函类型选择弹窗 */}
      <Modal
        title="选择保函类型"
        visible={guaranteeModalVisible}
        onCancel={handleGuaranteeModalCancel}
        footer={[
          <Button key="cancel" onClick={handleGuaranteeModalCancel}>
            取消
          </Button>,
          <Button key="generate" type="primary" onClick={handleConfirmGenerateGuarantee}>
            生成保函
          </Button>
        ]}
        style={{ width: '650px' }}
      >
        <div className="guarantee-type-list p-2">
          <div className="text-gray-500 mb-4">请选择需要生成的保函类型（可多选）：</div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid gap-4">
              {guaranteeTypes.map(type => (
                <div 
                  key={type.id} 
                  className="flex items-start border-b border-gray-100 pb-3"
                >
                  <Checkbox 
                    checked={type.checked}
                    onChange={() => handleToggleGuaranteeType(type.id)}
                  />
                  <div className="ml-2">
                    <div className="font-medium text-sm">{type.title}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      
      {/* 保函预览弹窗 */}
      <Modal
        title={
          <div className="flex justify-between items-center">
            <span>保函预览</span>
            <div className="text-sm font-normal text-gray-500">
              {generatedGuarantees.length > 0 ? 
                `${currentPreviewIndex + 1}/${generatedGuarantees.length}` : '0/0'}
            </div>
          </div>
        }
        visible={guaranteePreviewVisible}
        onCancel={handleGuaranteePreviewCancel}
        footer={[
          <Button key="cancel" onClick={handleGuaranteePreviewCancel}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmAndGenerateGuarantees}>
            确定生成
          </Button>
        ]}
        style={{ width: '800px' }}
      >
        {generatedGuarantees.length > 0 && (
          <div className="guarantee-preview">
            <div className="flex justify-between items-center mb-4">
              <Button 
                type="secondary" 
                icon={<IconLeftArrow />} 
                disabled={currentPreviewIndex === 0}
                onClick={handlePreviousGuarantee}
              >
                上一份
              </Button>
              <div className="font-medium">
                {generatedGuarantees[currentPreviewIndex].title}
              </div>
              <Button 
                type="secondary" 
                icon={<IconRight />} 
                disabled={currentPreviewIndex === generatedGuarantees.length - 1}
                onClick={handleNextGuarantee}
                className="flex items-center"
              >
                下一份
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-md p-6 bg-white max-h-[60vh] overflow-auto">
              <div className="flex mb-4">
                <IconFile className="text-blue-500 text-xl mr-2" />
                <div className="text-lg font-bold">
                  {generatedGuarantees[currentPreviewIndex].title}
                </div>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {generatedGuarantees[currentPreviewIndex].content}
              </pre>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 校验提示弹窗 */}
      <Modal
        title="提单补料校验提示"
        visible={validationModalVisible}
        onCancel={handleCancelSubmit}
        footer={[
          <Button key="cancel" onClick={handleCancelSubmit}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmSubmit}>
            确认提交
          </Button>
        ]}
        style={{ width: '800px' }}
      >
        <div className="validation-tips">
          <div className="mb-5">
            <div className="flex flex-col mb-3">
              <div className="flex items-center">
                <IconExclamationCircle className="text-red-500 mr-2" />
                <Title heading={6} style={{ margin: 0 }}>强制校验规则</Title>
              </div>
              <div className="h-1 bg-gradient-to-r from-red-500 to-red-100 rounded-full mb-1 w-32 ml-6"></div>
            </div>
            <div className="text-gray-500 text-sm mb-3">
              以下规则必须满足，否则可能导致提单无法正常处理：
            </div>
            <Table
              columns={tableColumns}
              data={mandatoryRules}
              borderCell={true}
              stripe={true}
              rowKey="field"
              className="validation-table"
              pagination={false}
              rowClassName={() => 'text-sm'}
            />
          </div>
          
          <div>
            <div className="flex flex-col mb-3">
              <div className="flex items-center">
                <IconInfoCircle className="text-blue-500 mr-2" />
                <Title heading={6} style={{ margin: 0 }}>软性提示规则</Title>
              </div>
              <div className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-100 rounded-full mb-1 w-32 ml-6"></div>
            </div>
            <div className="text-gray-500 text-sm mb-3">
              以下为最佳实践建议，有助于提高提单处理效率：
            </div>
            <Table
              columns={tableColumns}
              data={softRules}
              borderCell={true}
              stripe={true}
              rowKey="field"
              className="validation-table"
              pagination={false}
              rowClassName={() => 'text-sm'}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BLAddition; 