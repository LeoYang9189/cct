<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">八大核心功能</h2>
        <p class="text-xl text-gray-600">强大的功能模块，全面提升物流管理效率</p>
      </div>
      
      <!-- 8个功能卡片 - 一行展示 -->
      <div class="grid grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          @click="selectFeature(index)"
          :class="[
            'group relative bg-white rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105',
            selectedFeature === index 
              ? 'shadow-xl ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-white' 
              : 'shadow-lg hover:shadow-2xl'
          ]"
        >
          <!-- 装饰性背景 -->
          <div 
            :class="[
              'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
              selectedFeature === index ? 'opacity-100' : 'group-hover:opacity-50'
            ]"
            :style="{
              background: selectedFeature === index 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.02) 100%)'
            }"
          ></div>
          
          <div class="relative z-10 text-center">
            <!-- 只保留纯icon -->
            <i 
              :class="`${feature.icon} text-lg transition-colors duration-300 mb-3`"
              :style="{ 
                color: selectedFeature === index ? '#2563eb' : '#3B82F6',
                textShadow: selectedFeature === index ? '0 0 10px rgba(59,130,246,0.15)' : 'none'
              }"
            ></i>
            
            <!-- 标题 -->
            <h3 
              :class="[
                'text-sm font-bold leading-tight transition-colors duration-300',
                selectedFeature === index ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
              ]"
            >
              {{ feature.title }}
            </h3>
            
            <!-- 选中指示器 -->
            <div 
              :class="[
                'w-1 h-1 mx-auto mt-2 rounded-full transition-all duration-300',
                selectedFeature === index ? 'bg-blue-500 scale-150' : 'bg-transparent'
              ]"
            ></div>
          </div>
          
          <!-- 悬浮时的微光效果 -->
          <div class="shimmer-effect"></div>
        </div>
      </div>
      
      <!-- 详细展示大卡片 -->
      <div 
        v-if="selectedFeature !== null" 
        class="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-slideUp max-w-6xl mx-auto relative"
      >
        <!-- 左上蓝色渐变圆形光斑 -->
        <div class="absolute -left-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 via-blue-200 to-transparent opacity-30 z-0"></div>
        <!-- 右下淡蓝色圆形光斑 -->
        <div class="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-gradient-to-tl from-blue-100 via-cyan-100 to-transparent opacity-40 z-0"></div>
        <div class="grid grid-cols-1 lg:grid-cols-7">
          <!-- 左侧文字内容 -->
          <div class="lg:col-span-3 p-6 lg:p-8">
            <div class="flex items-center mb-4">
              <!-- 只保留纯icon -->
              <i :class="`${features[selectedFeature].icon} text-xl text-blue-600 mr-3`"></i>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">{{ features[selectedFeature].title }}</h3>
                <p class="text-blue-600 font-medium text-sm">{{ features[selectedFeature].category }}</p>
              </div>
            </div>
            
            <p class="text-base text-gray-600 mb-6 leading-relaxed">
              {{ features[selectedFeature].detailDescription }}
            </p>
            
                        <!-- 关键特性列表 -->
            <div class="space-y-3">
              <h4 class="text-lg font-bold text-gray-900 mb-3">核心特性</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div 
                  v-for="(highlight, index) in features[selectedFeature].highlights" 
                  :key="index"
                  class="flex items-start"
                >
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span class="text-gray-700 text-sm">{{ highlight }}</span>
                </div>
              </div>
            </div>
            
            <!-- 行动按钮 -->
            <div class="mt-6 flex gap-3">
              <button 
                @click="handleExperience"
                class="bg-blue-600 text-white px-5 py-2.5 hover:bg-blue-700 transition-colors font-medium text-sm border-0 rounded-none"
              >
                立即体验
              </button>
            </div>
          </div>
          
          <!-- 右侧视频区域 -->
          <div class="lg:col-span-4 flex items-center justify-center p-6 lg:p-8 bg-white">
            <div class="w-full">
              <!-- 视频播放器 -->
              <div class="relative bg-white rounded-xl overflow-hidden aspect-video">
                <video 
                  v-if="features[selectedFeature].videoUrl"
                  :src="features[selectedFeature].videoUrl"
                  autoplay
                  loop
                  muted
                  playsinline
                  class="w-full h-full object-cover"
                  :poster="features[selectedFeature].videoPoster"
                >
                  您的浏览器不支持视频播放。
                </video>
                
                <!-- 视频占位符 -->
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div class="text-center text-gray-600">
                    <i class="fas fa-play-circle text-5xl mb-3 opacity-70"></i>
                    <p class="text-gray-500 text-sm">演示视频即将上线</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 默认提示 -->
      <div v-else class="mt-16 text-center py-12">
        <i class="fas fa-mouse-pointer text-4xl text-gray-400 mb-4"></i>
        <p class="text-xl text-gray-500">点击上方功能卡片查看详细介绍</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, nextTick } from 'vue'

const selectedFeature = ref<number | null>(0) // 默认展开第一个BI面板

// 定义emit
const emit = defineEmits<{
  openLeadForm: []
}>()

const features = ref([
  // 1. 智能BI面板
  {
    title: "智能BI面板",
    description: "实时数据分析与可视化",
    icon: "fas fa-chart-bar",
    category: "数据分析",
    detailDescription: "基于AI技术的智能商业智能面板，提供实时数据监控、趋势分析和预测功能。通过直观的图表和仪表板，帮助管理者快速了解业务状况，做出数据驱动的决策。支持自定义报表、数据钻取和多维分析。",
    highlights: [
      "实时数据监控和告警",
      "智能趋势分析和预测",
      "可视化图表和仪表板",
      "自定义报表生成",
      "多维数据钻取分析"
    ],
    videoUrl: "/qrcodes/video/BI.mp4",
    videoPoster: "/assets/video-poster-bi.jpg"
  },
  // 2. AI智能助手
  {
    title: "AI智能助手",
    description: "24/7在线智能解答",
    icon: "fas fa-robot",
    category: "人工智能",
    detailDescription: "基于大语言模型的智能助手，提供24小时不间断的专业咨询服务。能够理解自然语言查询，提供准确的业务解答，协助处理日常操作，大幅提升工作效率。",
    highlights: [
      "自然语言对话交互",
      "专业业务知识问答",
      "智能操作指导",
      "多语言支持",
      "学习用户习惯优化服务"
    ],
    videoUrl: "/qrcodes/video/AI.mp4",
    videoPoster: ""
  },
  // 3. 询价报价
  {
    title: "询价报价",
    description: "功能齐全的报价管理系统",
    icon: "fas fa-calculator",
    category: "业务管理",
    detailDescription: "完整的询价报价管理流程，支持多渠道询价、智能报价推荐、价格比较分析。内置费用计算引擎，支持复杂的费用结构和计费规则。",
    highlights: [
      "多渠道询价管理",
      "智能报价推荐",
      "费用自动计算",
      "价格比较分析",
      "报价版本管理"
    ],
    videoUrl: "/qrcodes/video/quote.mp4",
    videoPoster: ""
  },
  // 4. 订单协作
  {
    title: "订单协作",
    description: "高度协同的订单履约管理",
    icon: "fas fa-handshake",
    category: "协作管理",
    detailDescription: "端到端的订单履约管理平台，支持多方协作、实时状态跟踪、自动化流程处理。提供可视化的订单进度监控，确保订单按时交付。",
    highlights: [
      "端到端订单跟踪",
      "多方协作平台",
      "自动化流程引擎",
      "实时状态更新",
      "异常预警处理"
    ],
    videoUrl: "/qrcodes/video/doc.mp4",
    videoPoster: ""
  },
  // 5. API整合
  {
    title: "API整合",
    description: "完善第三方系统对接",
    icon: "fas fa-plug",
    category: "系统集成",
    detailDescription: "提供完善的API接口和SDK，支持与ERP、WMS、TMS等系统无缝集成。标准化的接口设计，简化系统对接流程，实现数据互通和业务协同。",
    highlights: [
      "RESTful API接口",
      "多种SDK支持",
      "标准化数据格式",
      "实时数据同步",
      "接口监控和管理"
    ],
    videoUrl: "/qrcodes/video/api.mp4",
    videoPoster: ""
  },
  // 6. AI识别
  {
    title: "AI识别",
    description: "强大文档识别与数据提取",
    icon: "fas fa-eye",
    category: "智能识别",
    detailDescription: "基于深度学习的文档识别技术，支持发票、提单、报关单等物流单据的自动识别和数据提取。大幅减少人工录入工作，提高数据准确性。",
    highlights: [
      "多种单据类型识别",
      "高精度数据提取",
      "自动数据校验",
      "批量处理能力",
      "识别结果可追溯"
    ],
    videoUrl: "/qrcodes/video/scan.mp4",
    videoPoster: ""
  },
  // 7. 权限体系
  {
    title: "权限体系",
    description: "完整组织架构权限管理",
    icon: "fas fa-users-cog",
    category: "安全管理",
    detailDescription: "企业级权限管理系统，支持复杂组织架构和角色权限配置。提供细粒度的功能权限控制，确保数据安全和操作合规。支持SSO单点登录和多因子认证。",
    highlights: [
      "多级组织架构支持",
      "细粒度权限控制",
      "角色权限管理",
      "SSO单点登录",
      "审计日志追踪"
    ],
    videoUrl: "/qrcodes/video/per.mp4",
    videoPoster: ""
  },
  // 8. 灵活部署
  {
    title: "灵活部署",
    description: "云端和本地部署支持",
    icon: "fas fa-cloud",
    category: "基础架构",
    detailDescription: "支持公有云、私有云、混合云等多种部署模式，满足不同企业的安全和合规要求。提供Docker容器化部署，支持自动扩缩容，确保系统高可用性。",
    highlights: [
      "多云环境支持",
      "容器化部署",
      "自动扩缩容",
      "高可用架构",
      "灾备方案"
    ],
    videoUrl: "/qrcodes/video/yun.mp4",
    videoPoster: ""
  }
])

const selectFeature = (index: number) => {
  selectedFeature.value = index
}

// 处理立即体验按钮点击
const handleExperience = () => {
  // 跳转到登录注册页面
  window.location.href = '/walltech-vue3-auth'
}

// 选择功能处理
// 移除了滚动相关代码，因为现在是固定网格布局
</script>

<style scoped>
/* PortalFeatures特定样式 */
.animate-slideUp {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 微光效果动画 */
.shimmer-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s ease;
  pointer-events: none;
  animation: shimmer 2s infinite;
}

.group:hover .shimmer-effect {
  opacity: 1;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 卡片悬浮阴影优化 */
.group:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04),
              0 0 0 1px rgba(59, 130, 246, 0.05);
}

/* 选中状态的特殊效果 */
.group.ring-2 {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25),
              0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* 响应式优化 */
@media (max-width: 1024px) {
  .grid-cols-4 {
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .grid-cols-4 .group {
    padding: 0.75rem;
  }
  
  .grid-cols-4 h3 {
    font-size: 0.75rem;
    line-height: 1;
  }
  
  .grid-cols-4 .w-12 {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style> 