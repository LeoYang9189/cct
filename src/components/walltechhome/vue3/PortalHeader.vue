<template>
  <header class="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo区域 -->
        <div class="flex items-center space-x-4">
          <img 
            src="/assets/WX20250627-182147@2x.png" 
            alt="WallTech Logo" 
            class="h-8 w-auto"
          />
          <button 
            class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            @click="goHome"
          >
            回到首页
          </button>
        </div>

        <!-- 右侧按钮 -->
        <div class="flex items-center space-x-4">
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors"
            @click="handleLogin"
          >
            登录/注册
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// 事件处理函数
const goHome = () => {
  window.location.href = 'https://zh.etowertech.com/'
}

const handleLogin = () => {
  // 跳转到登录注册页面
  window.location.href = '/walltech-vue3-auth'
}
</script>

<style scoped>
/* PortalHeader特定样式 */
</style> 