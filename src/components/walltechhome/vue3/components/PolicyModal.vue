<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
      <!-- 头部 -->
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-xl font-semibold">{{ title }}</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <!-- 内容 -->
      <div class="p-6 overflow-y-auto flex-1">
        <!-- 用户协议内容 -->
        <div v-if="type === 'agreement'" class="prose max-w-none">
          <h4 class="text-lg font-semibold mb-4">1. 服务条款</h4>
          <p class="text-gray-600 mb-4">
            欢迎使用WallTech智慧物流平台。使用我们的服务前，请仔细阅读本用户协议。
          </p>
          
          <h4 class="text-lg font-semibold mb-4">2. 用户注册</h4>
          <p class="text-gray-600 mb-4">
            用户在使用本服务前需要注册一个账号。用户需要提供真实、准确、最新和完整的个人资料。
          </p>
          
          <h4 class="text-lg font-semibold mb-4">3. 服务使用规范</h4>
          <p class="text-gray-600 mb-4">
            用户在使用服务时，必须遵守中华人民共和国相关法律法规，不得利用本服务从事违法违规活动。
          </p>
          
          <h4 class="text-lg font-semibold mb-4">4. 知识产权</h4>
          <p class="text-gray-600 mb-4">
            本平台的所有内容，包括但不限于文字、图片、音频、视频、软件等，均受知识产权法律保护。
          </p>
          
          <h4 class="text-lg font-semibold mb-4">5. 免责声明</h4>
          <p class="text-gray-600 mb-4">
            对于因不可抗力或本平台不能控制的原因造成的服务中断或其他缺陷，本平台不承担任何责任。
          </p>
        </div>
        
        <!-- 隐私政策内容 -->
        <div v-else-if="type === 'privacy'" class="prose max-w-none">
          <h4 class="text-lg font-semibold mb-4">1. 信息收集</h4>
          <p class="text-gray-600 mb-4">
            我们收集您的信息是为了向您提供更好的服务。我们收集信息的方式如下：
          </p>
          <ul class="list-disc list-inside text-gray-600 mb-4 space-y-2">
            <li>您向我们提供的信息</li>
            <li>我们在您使用服务的过程中获取的信息</li>
            <li>第三方向我们提供的信息</li>
          </ul>
          
          <h4 class="text-lg font-semibold mb-4">2. 信息使用</h4>
          <p class="text-gray-600 mb-4">
            我们使用收集的信息来提供、维护、保护和改进我们的服务，同时开发新的服务。
          </p>
          
          <h4 class="text-lg font-semibold mb-4">3. 信息安全</h4>
          <p class="text-gray-600 mb-4">
            我们非常重视您的信息安全。我们采用业界标准的安全措施来保护您的个人信息。
          </p>
          
          <h4 class="text-lg font-semibold mb-4">4. 信息共享</h4>
          <p class="text-gray-600 mb-4">
            除非经过您的同意，我们不会向第三方共享您的个人信息，法律法规另有规定的除外。
          </p>
          
          <h4 class="text-lg font-semibold mb-4">5. 联系我们</h4>
          <p class="text-gray-600 mb-4">
            如果您对本隐私政策有任何疑问，请通过以下方式联系我们：
          </p>
          <p class="text-gray-600">
            邮箱：privacy@walltech.com<br>
            电话：400-XXX-XXXX
          </p>
        </div>
      </div>
      
      <!-- 底部 -->
      <div class="p-6 border-t">
        <button
          @click="$emit('close')"
          class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          我已了解
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  visible: boolean
  type: 'agreement' | 'privacy'
}

const props = defineProps<Props>()

// 计算标题
const title = computed(() => {
  return props.type === 'agreement' ? '用户协议' : '隐私政策'
})

// Emits
defineEmits<{
  close: []
}>()
</script>

<style scoped>
.prose h4 {
  color: #1f2937;
}

.prose p,
.prose li {
  line-height: 1.7;
}
</style> 