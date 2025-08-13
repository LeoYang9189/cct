<template>
  <section 
    class="relative py-20 overflow-hidden"
    :style="{
      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 25%, #4f46e5 50%, #60a5fa 75%, #93c5fd 100%)',
      backgroundSize: '400% 400%',
      animation: 'aurora 15s ease infinite'
    }"
  >
    <!-- 极光效果层 -->
    <div 
      class="absolute inset-0 opacity-30"
      :style="{
        background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 197, 253, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(96, 165, 250, 0.2) 0%, transparent 50%)',
        animation: 'auroraShift 20s ease-in-out infinite alternate'
      }"
    />
    
    <div class="container mx-auto px-4 text-center relative z-10">
      <h2 
        class="text-4xl font-bold mb-4 leading-tight"
        :style="{
          background: 'linear-gradient(to right, #ffffff, #e0e7ff, #c7d2fe)',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 0 30px rgba(255,255,255,0.5)',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        }"
      >
        准备开始您的智能物流之旅？
      </h2>
      <p 
        class="text-xl mb-8"
        :style="{
          background: 'linear-gradient(to right, #e0e7ff, #c7d2fe, #a5b4fc)',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 0 20px rgba(255,255,255,0.3)'
        }"
      >
        立即体验WallTech控制塔系统，感受AI带来的变革
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          class="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-lg shadow-lg hover:shadow-xl transition-all text-white font-bold"
          @click="handleGetStarted"
        >
          立即开始
        </button>
        <button 
          class="h-12 px-8 border-2 border-white text-white text-lg hover:bg-white hover:text-blue-600 transition-all font-bold"
          @click="handleContact"
        >
          联系我们
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 定义emit
const emit = defineEmits<{
  openLeadForm: []
}>()

// 事件处理函数
const handleGetStarted = () => {
  // 跳转到登录注册页面
  window.location.href = '/walltech-vue3-auth'
}

const handleContact = () => {
  // 触发留资弹窗
  emit('openLeadForm')
}
</script>

<style scoped>
/* PortalCTA特定样式 */
@keyframes aurora {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes auroraShift {
  0% {
    transform: translateX(-10px) translateY(-5px);
    opacity: 0.3;
  }
  100% {
    transform: translateX(10px) translateY(5px);
    opacity: 0.5;
  }
}

/* 按钮悬浮效果 */
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
}
</style> 