<template>
  <section class="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">无处不在的AI</h2>
        <p class="text-xl text-gray-600">AI助手在各个业务场景中为您提供智能支持</p>
      </div>
      
      <!-- Tab切换按钮 -->
      <div class="flex justify-center mb-8">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-purple-200/50">
          <div class="flex gap-2">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectTab(index)"
              :class="[
                'px-6 py-3 rounded-xl font-medium transition-all duration-300',
                selectedTab === index
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              ]"
            >
              <i :class="tab.icon" class="mr-2"></i>
              {{ tab.title }}
            </button>
          </div>
        </div>
      </div>

      <!-- AI对话演示区域 -->
      <div class="max-w-4xl mx-auto">
        <div 
          class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 overflow-hidden"
          style="height: 600px;"
        >
          <!-- 对话框头部 -->
          <div class="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-3 shadow-md">
                  <img src="/assets/g6qmm-vsolk.gif" alt="AI助手" class="w-full h-full object-cover" />
                </div>
                <div>
                  <div class="text-lg font-medium text-gray-800">{{ tabs[selectedTab].title }}AI助手</div>
                  <div class="text-sm text-purple-600">{{ tabs[selectedTab].description }}</div>
                </div>
              </div>
                             <div class="flex items-center space-x-2">
                 <button 
                   @click="resetDemo"
                   class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                 >
                   <i class="fas fa-refresh mr-2"></i>
                   重新演示
                 </button>
               </div>
            </div>
          </div>

          <!-- 消息区域 -->
          <div class="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/10" style="height: calc(600px - 140px);">
                         <!-- 欢迎消息 -->
             <div v-if="messages.length === 0 && !isPlaying" class="flex justify-center items-center h-full">
               <div class="text-center">
                 <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4 shadow-lg">
                   <img src="/assets/g6qmm-vsolk.gif" alt="AI助手" class="w-full h-full object-cover" />
                 </div>
                 <h3 class="text-xl font-medium text-gray-800 mb-2">{{ tabs[selectedTab].title }}AI助手</h3>
                 <p class="text-gray-600 mb-4">{{ tabs[selectedTab].welcomeMessage }}</p>
                 <div class="flex items-center justify-center">
                   <i class="fas fa-spinner fa-spin text-blue-500 mr-2"></i>
                   <span class="text-gray-600">AI演示即将开始...</span>
                 </div>
               </div>
             </div>

            <!-- 对话消息 -->
                         <div v-for="(message, index) in messages" :key="index" :class="['flex mb-4', message.isUser ? 'justify-end' : 'justify-start']">
               <div v-if="!message.isUser" class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                 <img src="/assets/g6qmm-vsolk.gif" alt="AI" class="w-full h-full object-cover" />
               </div>
               <div :class="[message.isUser ? 'max-w-[70%]' : 'flex-1 mr-4', message.isUser ? 'flex justify-end' : '']">
                <div :class="[
                  'px-4 py-3 rounded-2xl',
                  message.isUser 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-md shadow-sm'
                ]">
                  <div v-if="message.type === 'price-list'" class="space-y-3 w-full">
                    <div class="font-medium mb-3">为您找到以下运价选项：</div>
                                         <div v-for="(price, idx) in message.priceData" :key="idx" class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                       <div class="flex justify-between items-start mb-3">
                         <div class="font-medium text-blue-800">{{ price.carrier }}</div>
                         <div class="text-right">
                           <div class="grid grid-cols-3 gap-2 text-sm">
                             <div class="text-center">
                               <div class="text-xs text-gray-500">20GP</div>
                               <div class="font-bold text-blue-600">${{ price.price20GP }}</div>
                             </div>
                             <div class="text-center">
                               <div class="text-xs text-gray-500">40GP</div>
                               <div class="font-bold text-blue-600">${{ price.price40GP }}</div>
                             </div>
                             <div class="text-center">
                               <div class="text-xs text-gray-500">40HC</div>
                               <div class="font-bold text-blue-600">${{ price.price40HC }}</div>
                             </div>
                           </div>
                         </div>
                       </div>
                       <div class="text-sm text-gray-600 space-y-1">
                         <div><i class="fas fa-ship mr-2"></i>{{ price.service }}</div>
                         <div><i class="fas fa-clock mr-2"></i>{{ price.transit }}</div>
                         <div><i class="fas fa-calendar mr-2"></i>{{ price.sailing }}</div>
                       </div>
                     </div>
                  </div>
                                     <div v-else-if="message.type === 'inquiry-form'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                       <div class="text-green-800 font-medium mb-2">
                         <i class="fas fa-file-alt mr-2"></i>询价单已生成
                       </div>
                       <div class="text-sm space-y-2">
                         <div><span class="font-medium">询价编号：</span>{{ message.inquiryData.number }}</div>
                         <div><span class="font-medium">货物信息：</span>{{ message.inquiryData.cargo }}</div>
                         <div><span class="font-medium">专属销售：</span>{{ message.inquiryData.sales }}</div>
                         <div><span class="font-medium">预计回复：</span>{{ message.inquiryData.response }}</div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'task-list'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="space-y-3">
                       <div class="bg-orange-50 rounded-lg p-3 border border-orange-200">
                         <div class="text-orange-800 font-medium mb-2">
                           <i class="fas fa-clipboard-list mr-2"></i>待提交舱单
                         </div>
                         <div class="flex flex-wrap gap-2">
                           <span v-for="order in message.taskData.pendingManifest" :key="order" class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">{{ order }}</span>
                         </div>
                       </div>
                       <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                         <div class="text-blue-800 font-medium mb-2">
                           <i class="fas fa-file-invoice mr-2"></i>待确认账单
                         </div>
                         <div class="flex flex-wrap gap-2">
                           <span v-for="order in message.taskData.pendingBilling" :key="order" class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{{ order }}</span>
                         </div>
                       </div>
                       <div class="bg-red-50 rounded-lg p-3 border border-red-200">
                         <div class="text-red-800 font-medium mb-2">
                           <i class="fas fa-undo mr-2"></i>退关待确认
                         </div>
                         <div class="flex flex-wrap gap-2">
                           <span v-for="order in message.taskData.pendingReturn" :key="order" class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">{{ order }}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'operation-result'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="space-y-3">
                       <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                         <div class="text-green-800 font-medium mb-2">
                           <i class="fas fa-check-circle mr-2"></i>退关操作
                         </div>
                         <div class="text-sm text-green-700">{{ message.operationData.returnResult }}</div>
                       </div>
                       <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                         <div class="text-blue-800 font-medium mb-2">
                           <i class="fas fa-edit mr-2"></i>箱型修改
                         </div>
                         <div class="text-sm space-y-1">
                           <div><span class="font-medium">订单号：</span>{{ message.operationData.modifyResult.orderNo }}</div>
                           <div><span class="font-medium">修改前：</span>{{ message.operationData.modifyResult.before }}</div>
                           <div><span class="font-medium">修改后：</span>{{ message.operationData.modifyResult.after }}</div>
                           <div><span class="font-medium">状态：</span>{{ message.operationData.modifyResult.ediStatus }}</div>
                           <div><span class="font-medium">EDI通道：</span>{{ message.operationData.modifyResult.ediChannel }}</div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'pending-release'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                       <div class="text-yellow-800 font-medium mb-2">
                         <i class="fas fa-ship mr-2"></i>马士基 - 待放舱订单
                       </div>
                       <div class="flex flex-wrap gap-2">
                         <span v-for="order in message.pendingOrders" :key="order" class="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-lg">{{ order }}</span>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'batch-return'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-red-50 rounded-lg p-3 border border-red-200">
                       <div class="text-red-800 font-medium mb-2">
                         <i class="fas fa-check-circle mr-2"></i>批量退关完成
                       </div>
                       <div class="space-y-2">
                         <div v-for="order in message.returnedOrders" :key="order" class="flex items-center text-sm">
                           <i class="fas fa-check text-green-600 mr-2"></i>
                           <span class="text-gray-700">{{ order }} 已成功退关</span>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'file-upload'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                       <div class="text-blue-800 font-medium mb-2">
                         <i class="fas fa-file-upload mr-2"></i>文件上传
                       </div>
                       <div class="text-sm space-y-2">
                         <div><span class="font-medium text-blue-700">文件名：</span><span class="font-bold text-blue-700">{{ message.fileName }}</span></div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'diff-list'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                       <div class="text-green-800 font-medium mb-2">
                         <i class="fas fa-list mr-2"></i>差异项
                       </div>
                       <div class="text-sm space-y-2">
                         <div v-for="(diff, idx) in message.diffData" :key="idx" class="flex justify-between items-start">
                           <div class="font-medium text-gray-800">{{ diff.field }}</div>
                           <div class="text-right">
                             <div class="text-xs text-gray-500">旧值：{{ diff.old }}</div>
                             <div class="text-xs text-gray-500">新值：{{ diff.new }}</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'update-list'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                       <div class="text-yellow-800 font-medium mb-2">
                         <i class="fas fa-update mr-2"></i>数据更新
                       </div>
                       <div class="text-sm space-y-2">
                         <div v-for="(update, idx) in message.updateData" :key="idx" class="flex justify-between items-start">
                           <div class="font-medium text-gray-800">{{ update.field }}</div>
                           <div class="text-right">
                             <div class="text-xs text-gray-500">旧值：{{ update.old }}</div>
                             <div class="text-xs text-gray-500">新值：{{ update.value }}</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'tracking-info'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                       <div class="text-yellow-800 font-medium mb-2">
                         <i class="fas fa-info-circle mr-2"></i>物流节点信息
                       </div>
                       <div class="text-sm space-y-2">
                         <div v-for="(event, idx) in message.trackingData.events" :key="idx" class="flex justify-between items-start">
                           <div class="font-medium text-gray-800">{{ event.port }}</div>
                           <div class="text-right">
                             <div v-for="(node, idx) in event.nodes" :key="idx" class="text-xs text-gray-500">{{ node.label }} - {{ node.time }}</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                                       <div v-else-if="message.type === 'chart'" class="space-y-3 w-full">
                      <div class="font-medium mb-3">{{ message.text }}</div>
                      <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div :ref="(el: any) => setChartRef(el, `chart-${index}`)" style="width: 100%; height: 300px;"></div>
                      </div>
                    </div>
                    <div v-else-if="message.type === 'multi-chart'" class="space-y-3 w-full">
                      <div class="font-medium mb-3">{{ message.text }}</div>
                      <div class="space-y-4">
                        <div v-for="(chart, idx) in message.charts" :key="idx" class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div :ref="(el: any) => setChartRef(el, `multi-chart-${index}-${idx}`)" style="width: 100%; height: 280px;"></div>
                        </div>
                      </div>
                    </div>
                                     <div v-else>
                     {{ message.text }}
                     <span v-if="message.isTyping" class="typing-cursor">|</span>
                   </div>
                </div>
              </div>
            </div>

            <!-- 正在输入指示器 -->
            <div v-if="isTyping" class="flex justify-start mb-4">
              <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                <img src="/assets/g6qmm-vsolk.gif" alt="AI" class="w-full h-full object-cover" />
              </div>
              <div class="bg-white text-gray-700 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                <div class="flex items-center space-x-1">
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                  <span class="ml-2 text-sm text-gray-500">AI正在思考...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// Tab配置
const tabs = ref([
  {
    title: '智能运价',
    icon: 'fas fa-calculator',
    description: '智能运价查询与询价助手',
    welcomeMessage: '我可以帮您查询运价、生成询价单，让运价管理更简单高效'
  },
  {
    title: '订单管理',
    icon: 'fas fa-clipboard-list',
    description: '订单处理与状态跟踪助手',
    welcomeMessage: '我可以帮您处理订单、跟踪状态，让订单管理更轻松便捷'
  },
  {
    title: 'AI识别',
    icon: 'fas fa-eye',
    description: '智能文档识别与数据提取',
    welcomeMessage: '我可以帮您识别各种单据、提取关键信息，让数据录入更准确快速'
  },
  {
    title: '运单跟踪',
    icon: 'fas fa-route',
    description: '货物运输状态实时跟踪',
    welcomeMessage: '我可以帮您跟踪货物状态、预测到达时间，让物流信息更透明及时'
  },
  {
    title: 'ChatBI',
    icon: 'fas fa-chart-bar',
    description: '智能数据分析与报表生成',
    welcomeMessage: '我可以帮您分析业务数据、生成可视化报表，让决策更科学准确'
  }
])

const selectedTab = ref(0)
const messages = ref<any[]>([])
const isPlaying = ref(false)
const isTyping = ref(false)
const currentTypingText = ref('')
const typingMessageIndex = ref(-1)
const chartRefs = ref<Record<string, any>>({})
const chartInstances = ref<Record<string, any>>({})

// 智能运价演示对话数据
const smartPricingDemo = [
  {
    isUser: true,
    text: '上海到洛杉矶下周什么价格？'
  },
  {
    isUser: false,
    type: 'price-list',
    text: '为您找到以下运价选项：',
    priceData: [
      {
        carrier: 'COSCO',
        price20GP: '2,650',
        price40GP: '2,850',
        price40HC: '3,020',
        service: 'CCX',
        transit: '15天',
        sailing: '下周二开船'
      },
      {
        carrier: 'OOCL',
        price20GP: '2,720',
        price40GP: '2,920',
        price40HC: '3,100',
        service: 'PAX',
        transit: '14天',
        sailing: '下周四开船'
      },
      {
        carrier: 'MSC',
        price20GP: '2,950',
        price40GP: '3,100',
        price40HC: '3,280',
        service: 'Eagle Express',
        transit: '12天',
        sailing: '下周六开船'
      }
    ]
  },
  {
    isUser: true,
    text: '太贵了，我有大票货要申请特价。'
  },
  {
    isUser: false,
    text: '请提供货号、时间、货量、品名等信息，将为您自动生成询价单。'
  },
  {
    isUser: true,
    text: '两周后货好，20*40HC，家具货，要快船。'
  },
  {
    isUser: false,
    type: 'inquiry-form',
    text: '已为您自动生成询价单：',
    inquiryData: {
      number: 'INQ20241230001',
      cargo: '20×40HC 家具货（快船）',
      sales: 'James Liu',
      response: '1小时内回复'
    }
  }
]

// 订单管理演示对话数据
const orderManagementDemo = [
  {
    isUser: true,
    text: '今天有啥待办任务？'
  },
  {
    isUser: false,
    type: 'task-list',
    text: '有以下订单待处理：',
    taskData: {
      pendingManifest: ['SH2024120001', 'SH2024120002'],
      pendingBilling: ['SH2024119001', 'SH2024119002'],
      pendingReturn: ['SH2024118001', 'SH2024118002']
    }
  },
  {
    isUser: true,
    text: 'SH2024119001退关，SH2024119002箱型改成2*20GP后重新订舱'
  },
  {
    isUser: false,
    type: 'operation-result',
    text: '操作完成：',
    operationData: {
      returnResult: 'SH2024119001已操作退关',
      modifyResult: {
        orderNo: 'SH2024119002',
        before: '1*40HQ',
        after: '2*20GP',
        ediStatus: '订舱EDI已提交',
        ediChannel: 'INTTRA'
      }
    }
  },
  {
    isUser: true,
    text: '下周ETD 船公司 马士基 还有几票没放舱？'
  },
  {
    isUser: false,
    type: 'pending-release',
    text: 'ETD在下周之内，舱位状态为Pending的订单有：',
    pendingOrders: ['SH2024120101', 'SH2024120102', 'SH2024120103']
  },
  {
    isUser: true,
    text: '这些都给我退关吧。'
  },
  {
    isUser: false,
    type: 'batch-return',
    text: '以下订单已操作退关：',
    returnedOrders: ['SH2024120101', 'SH2024120102', 'SH2024120103']
  }
]

// AI识别演示对话数据
const aiRecognitionDemo = [
  {
    isUser: true,
    type: 'file-upload',
    fileName: 'SHSE123456 SI 补料.pdf',
    text: '上传文件：SHSE123456 SI 补料.pdf'
  },
  {
    isUser: false,
    text: '已收到文件"SHSE123456 SI 补料.pdf"，正在识别...'
  },
  {
    isUser: false,
    text: '识别文件类型为"提单补料"，是否开启对单？'
  },
  {
    isUser: true,
    text: '是'
  },
  {
    isUser: false,
    type: 'diff-list',
    text: '已完成对单，以下为差异项：',
    diffData: [
      { field: '箱号', old: '空值', new: 'TCNU1122330' },
      { field: '品名', old: 'General Cargo', new: 'Chair、Table' },
      { field: '件数', old: '10', new: '12' },
      { field: '毛重', old: '8000kg', new: '8200kg' },
      { field: '唛头', old: 'N/M', new: 'WOOO' }
    ]
  },
  {
    isUser: false,
    text: '是否覆盖系统数据？'
  },
  {
    isUser: true,
    text: '确认'
  },
  {
    isUser: false,
    type: 'update-list',
    text: '以下数据已更新：',
    updateData: [
      { field: '箱号', value: 'TCNU1122330' },
      { field: '品名', value: 'Chair、Table' },
      { field: '件数', value: '12' },
      { field: '毛重', value: '8200kg' },
      { field: '唛头', value: 'WOOO' }
    ]
  }
]

// 运单跟踪演示对话数据
const trackingDemo = [
  {
    isUser: true,
    text: 'SHSE11122223'
  },
  {
    isUser: false,
    type: 'tracking-info',
    text: '已为您查询到运单【SHSE11122223】的最新物流节点信息：',
    trackingData: {
      containerNo: 'A14FX01920',
      origin: 'HONG KONG, CHINA',
      destination: 'SINGAPORE',
      events: [
        { port: 'HONG KONG, CHINA', nodes: [
          { label: '提空箱', time: '2025-05-28 14:56' },
          { label: '进场', time: '2025-05-28 19:53' },
          { label: '驶船装船', time: '2025-05-29 09:50' },
          { label: '驶船离港', time: '2025-05-29 17:37' }
        ]},
        { port: 'SINGAPORE', nodes: [
          { label: '抵港', time: '2025-06-02 23:38' },
          { label: '靠泊', time: '2025-06-03 00:12' },
          { label: '卸船', time: '2025-06-03 05:34' },
          { label: '提柜(货)', time: '2025-06-03 19:08' },
          { label: '还空箱', time: '2025-06-06 13:59' }
        ]}
      ],
      vessel: {
        name: 'WAN HAI 370',
        voyage: 'S016',
        mmsi: '563220900',
        imo: '9958092'
      }
    }
  }
]

// ChatBI演示对话数据
const chatBIDemo = [
  {
    isUser: true,
    text: '查一下这个月的订单，美线的业务，做成柱形图。'
  },
  {
    isUser: false,
    type: 'chart',
    text: '已为您生成本月美线订单柱形图：',
    chartData: {
      type: 'bar',
      title: '2024年12月美线订单统计',
      data: [
        { label: '美西基本港', value: 156 },
        { label: '美东基本港', value: 89 },
        { label: '美西偏港', value: 45 },
        { label: '美东偏港', value: 32 }
      ]
    }
  },
  {
    isUser: true,
    text: '5月份每个销售的业务利润率和目标达成率，分别做成折线图'
  },
  {
    isUser: false,
    type: 'multi-chart',
    text: '已为您生成5月份销售业绩分析图表：',
    charts: [
      {
        type: 'line',
        title: '5月份销售业务利润率',
        data: [
          { label: 'James Liu', values: [12, 15, 18, 16, 20] },
          { label: 'Sarah Chen', values: [10, 13, 14, 17, 19] },
          { label: 'Mike Wang', values: [8, 11, 13, 15, 16] },
          { label: 'Lisa Zhang', values: [14, 16, 15, 18, 22] }
        ]
      },
      {
        type: 'line',
        title: '5月份销售目标达成率',
        data: [
          { label: 'James Liu', values: [85, 90, 95, 92, 98] },
          { label: 'Sarah Chen', values: [80, 88, 92, 96, 102] },
          { label: 'Mike Wang', values: [75, 82, 87, 90, 94] },
          { label: 'Lisa Zhang', values: [90, 95, 93, 98, 105] }
        ]
      }
    ]
  }
]

// 切换Tab
const selectTab = async (index: number) => {
  selectedTab.value = index
  resetDemo()
  // 延迟一秒后自动开始演示
  await delay(1000)
  startDemo()
}

// 开始演示
const startDemo = async () => {
  if (isPlaying.value) return
  
  isPlaying.value = true
  messages.value = []
  
  if (selectedTab.value === 0) {
    // 智能运价演示
    await playSmartPricingDemo()
  } else if (selectedTab.value === 1) {
    // 订单管理演示
    await playOrderManagementDemo()
  } else if (selectedTab.value === 2) {
    // AI识别演示
    await playAiRecognitionDemo()
  } else if (selectedTab.value === 3) {
    // 运单跟踪演示
    await playTrackingDemo()
  } else if (selectedTab.value === 4) {
    // ChatBI演示
    await playChatBIDemo()
  }
  
  isPlaying.value = false
}

// 播放智能运价演示
const playSmartPricingDemo = async () => {
  for (let i = 0; i < smartPricingDemo.length; i++) {
    const message = smartPricingDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'price-list' || message.type === 'inquiry-form') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// 播放订单管理演示
const playOrderManagementDemo = async () => {
  for (let i = 0; i < orderManagementDemo.length; i++) {
    const message = orderManagementDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'task-list' || message.type === 'operation-result' || 
          message.type === 'pending-release' || message.type === 'batch-return') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// 播放AI识别演示
const playAiRecognitionDemo = async () => {
  for (let i = 0; i < aiRecognitionDemo.length; i++) {
    const message = aiRecognitionDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'file-upload' || message.type === 'diff-list' || message.type === 'update-list') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// 播放运单跟踪演示
const playTrackingDemo = async () => {
  for (let i = 0; i < trackingDemo.length; i++) {
    const message = trackingDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'tracking-info') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// 播放ChatBI演示
const playChatBIDemo = async () => {
  for (let i = 0; i < chatBIDemo.length; i++) {
    const message = chatBIDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'chart' || message.type === 'multi-chart') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
        
        // 渲染图表
        await nextTick()
        if (message.type === 'chart') {
          const chartKey = `chart-${messages.value.length - 1}`
          await renderBarChart(message.chartData, chartKey)
        } else if (message.type === 'multi-chart' && message.charts) {
          for (let j = 0; j < message.charts.length; j++) {
            const chartKey = `multi-chart-${messages.value.length - 1}-${j}`
            await renderLineChart(message.charts[j], chartKey)
          }
        }
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// 打字机效果
const typewriterEffect = async (text: string, messageIndex: number) => {
  typingMessageIndex.value = messageIndex
  currentTypingText.value = ''
  
  // 添加一个临时消息用于显示打字效果
  const tempMessage = {
    isUser: false,
    text: '',
    isTyping: true
  }
  messages.value.push(tempMessage)
  
  // 逐字显示
  for (let i = 0; i <= text.length; i++) {
    currentTypingText.value = text.slice(0, i)
    tempMessage.text = currentTypingText.value
    await delay(50) // 每个字符延迟50ms
  }
  
  // 完成打字，移除isTyping标记
  tempMessage.isTyping = false
  typingMessageIndex.value = -1
}

// 重置演示
const resetDemo = () => {
  messages.value = []
  isPlaying.value = false
  isTyping.value = false
  currentTypingText.value = ''
  typingMessageIndex.value = -1
}

// 延迟函数
const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 设置图表引用
const setChartRef = (el: any, key: string) => {
  if (el) {
    chartRefs.value[key] = el
  }
}

// 渲染柱形图
const renderBarChart = async (chartData: any, key: string) => {
  await nextTick()
  const dom = chartRefs.value[key]
  if (!dom) return
  
  const myChart = echarts.init(dom)
  chartInstances.value[key] = myChart
  
  const option = {
    title: {
      text: chartData.title,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.data.map((item: any) => item.label),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '订单数量'
    },
    series: [{
      data: chartData.data.map((item: any) => item.value),
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3B82F6' },
          { offset: 1, color: '#1E40AF' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}'
      }
    }]
  }
  
  myChart.setOption(option)
}

// 渲染折线图
const renderLineChart = async (chartData: any, key: string) => {
  await nextTick()
  const dom = chartRefs.value[key]
  if (!dom) return
  
  const myChart = echarts.init(dom)
  chartInstances.value[key] = myChart
  
  const option = {
    title: {
      text: chartData.title,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: chartData.data.map((item: any) => item.label),
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['第1周', '第2周', '第3周', '第4周', '第5周']
    },
    yAxis: {
      type: 'value',
      name: chartData.title.includes('利润率') ? '利润率(%)' : '达成率(%)'
    },
    series: chartData.data.map((item: any) => ({
      name: item.label,
      type: 'line',
      smooth: true,
      data: item.values,
      lineStyle: {
        width: 2
      },
      symbol: 'circle',
      symbolSize: 8
    }))
  }
  
  myChart.setOption(option)
}

// 组件挂载时自动开始演示
onMounted(async () => {
  await delay(500)
  startDemo()
  
  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    Object.values(chartInstances.value).forEach((chart: any) => {
      chart.resize()
    })
  })
})
</script>

<style scoped>
/* PortalAIDemo特定样式 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.message-enter-active {
  animation: fadeIn 0.5s ease-out;
}

.typing-cursor {
  animation: blink 1s infinite;
  color: #3B82F6;
  font-weight: bold;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .max-w-4xl {
    margin-left: 0;
    margin-right: 0;
  }
}
</style> 