<template>
  <div class="min-h-screen bg-white">
    <PortalHeader />
    <main>
      <PortalHero @open-lead-form="showLeadForm = true" />
      <PortalFeatures @open-lead-form="showLeadForm = true" />
      <PortalAIDemo />
      <PortalCTA @open-lead-form="showLeadForm = true" />
    </main>
    <PortalFooter />
    
    <!-- 留资弹窗 -->
    <div v-if="showLeadForm" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden animate-fadeIn">
        <!-- 关闭按钮 -->
        <button 
          @click="showLeadForm = false"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
        >
          <i class="fas fa-times text-gray-500"></i>
        </button>
        
        <!-- 装饰性头部 -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 pt-8 pb-6 relative">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div class="relative z-10">
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <i class="fas fa-rocket text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">申请产品演示</h3>
            <p class="text-blue-100 text-sm">填写信息，我们将为您提供专业的产品演示</p>
          </div>
        </div>
        
        <!-- 表单内容 -->
        <div class="px-8 py-6">
          <form @submit.prevent="handleSubmitForm" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-user text-blue-500 mr-2"></i>姓名
                </label>
                <input 
                  v-model="formData.name"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="请输入您的姓名"
                  required
                >
              </div>
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-building text-blue-500 mr-2"></i>公司
                </label>
                <input 
                  v-model="formData.company"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="请输入公司名称"
                  required
                >
              </div>
            </div>
            
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-phone text-blue-500 mr-2"></i>电话
              </label>
              <input 
                v-model="formData.phone"
                type="tel" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="请输入联系电话"
                required
              >
            </div>
            
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-envelope text-blue-500 mr-2"></i>邮箱
              </label>
              <input 
                v-model="formData.email"
                type="email" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="请输入邮箱地址"
                required
              >
            </div>
            
            <!-- 隐私提示 -->
            <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div class="flex items-start">
                <i class="fas fa-shield-alt text-blue-500 mt-1 mr-3"></i>
                <div class="text-sm text-gray-600">
                  我们承诺保护您的隐私，您的信息仅用于产品演示预约，不会用于其他商业用途。
                </div>
              </div>
            </div>
            
            <div class="flex gap-3 pt-2">
              <button 
                type="submit"
                class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                立即申请演示
              </button>
              <button 
                type="button"
                @click="showLeadForm = false"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, reactive } from 'vue'
import PortalHeader from './PortalHeader.vue'
import PortalFooter from './PortalFooter.vue'
import PortalHero from './PortalHero.vue'
import PortalFeatures from './PortalFeatures.vue'
import PortalAIDemo from './PortalAIDemo.vue'
import PortalCTA from './PortalCTA.vue'
import './PortalStyles.css'

// 留资弹窗状态
const showLeadForm = ref(false)

// 表单数据
const formData = reactive({
  name: '',
  company: '',
  phone: '',
  email: ''
})

// 提交表单
const handleSubmitForm = () => {
  console.log('提交表单数据:', formData)
  // 这里可以添加实际的提交逻辑
  alert('提交成功！我们会尽快与您联系。')
  showLeadForm.value = false
  // 重置表单
  formData.name = ''
  formData.company = ''
  formData.phone = ''
  formData.email = ''
}
</script>

<style scoped>
/* Portal特定样式 */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style> 