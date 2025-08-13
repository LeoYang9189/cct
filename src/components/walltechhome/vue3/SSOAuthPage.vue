<template>
  <div class="min-h-screen relative overflow-hidden auth-container">
    <!-- 动态背景 -->
    <div :class="`fixed inset-0 auth-background ${providerInfo.bgColor}`">
      <div :class="`absolute inset-0 bg-gradient-to-br ${providerInfo.color}/20`"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
      </div>
      <div class="absolute inset-0 grid-background"></div>
    </div>

    <!-- 返回按钮 -->
    <div class="absolute top-8 left-8 z-50">
      <button 
        @click="handleBackToStaffAuth"
        class="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-gray-800/30 text-gray-800 hover:bg-white/20 hover:border-gray-800/50 transition-all duration-300 hover:scale-105"
      >
        <i class="fas fa-arrow-left text-lg group-hover:-translate-x-1 transition-transform duration-300"></i>
        <span class="font-medium">返回登录</span>
      </button>
    </div>

    <!-- 主内容区域 -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div :class="`w-full max-w-md transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`">
        
        <!-- 授权卡片 -->
        <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8">
          <!-- Logo区域 -->
          <div class="text-center mb-8">
            <div class="flex items-center justify-center mb-4">
              <div :class="`w-16 h-16 rounded-2xl bg-gradient-to-br ${providerInfo.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`">
                <img 
                  v-if="provider === 'etower' || provider === 'cargoware'"
                  :src="providerInfo.logo" 
                  :alt="providerInfo.name" 
                  class="w-10 h-10 object-contain"
                />
                <span v-else>{{ providerInfo.logo }}</span>
              </div>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">
              {{ providerInfo.name }} 授权登录
            </h1>
            <p class="text-gray-500">
              请使用您的 {{ providerInfo.name }} 账户进行授权
            </p>
          </div>

          <!-- 登录表单 -->
          <form @submit.prevent="handleAuth" class="space-y-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">用户名</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  v-model="authForm.username"
                  type="text"
                  placeholder="请输入用户名"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-700 font-semibold mb-2">密码</label>
              <div class="relative">
                <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  v-model="authForm.password"
                  :type="passwordVisible ? 'text' : 'password'"
                  placeholder="请输入密码"
                  class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  @click="passwordVisible = !passwordVisible"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full mt-6 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ loading ? '授权中...' : '授权登录' }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">
              登录即表示您同意授权控制塔系统访问您的 {{ providerInfo.name }} 账户信息
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 租户选择弹窗 -->
    <div 
      v-if="showTenantModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeTenantModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">🏢 选择租户</h3>
          <button @click="closeTenantModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="p-6">
          <p class="text-gray-600 mb-6">请选择要绑定的租户：</p>
          
          <div class="space-y-3">
            <label
              v-for="tenant in tenants"
              :key="tenant.id"
              :class="`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedTenant === tenant.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`"
            >
              <input
                v-model="selectedTenant"
                type="radio"
                :value="tenant.id"
                class="mr-3"
              />
              <div class="flex-1">
                <div class="font-semibold text-gray-800">{{ tenant.name }}</div>
                <div class="text-sm text-gray-500">租户号：{{ tenant.code }}</div>
              </div>
            </label>
          </div>
        </div>
        
        <div class="flex space-x-3 p-6 border-t">
          <button
            @click="closeTenantModal"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            @click="handleTenantConfirm"
            :disabled="!selectedTenant"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            确认绑定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUser } from './composables/useUser'
import './PortalStyles.css'

interface AuthFormData {
  username: string
  password: string
}

interface Tenant {
  id: string
  code: string
  name: string
}

// 响应式状态
const loading = ref(false)
const passwordVisible = ref(false)
const mounted = ref(false)
const showTenantModal = ref(false)
const selectedTenant = ref('')

// 表单数据
const authForm = ref<AuthFormData>({
  username: '',
  password: ''
})

// 路由相关
const router = useRouter()
const route = useRoute()
const { login } = useUser()

// 获取provider参数
const provider = computed(() => route.params.provider as string)

// 模拟租户列表
const tenants: Tenant[] = [
  { id: 'tenant_001', code: 'CT001', name: 'eTower运营租户' },
  { id: 'tenant_002', code: 'CT002', name: 'CargoWare物流租户' },
  { id: 'tenant_003', code: 'CT003', name: '集团总部租户' },
  { id: 'tenant_004', code: 'CT004', name: '华东区域租户' },
]

// 获取SSO提供商信息
const providerInfo = computed(() => {
  switch (provider.value) {
    case 'etower':
      return {
        name: 'eTower',
        logo: '/assets/111.png',
        color: 'from-blue-600 to-blue-800',
        bgColor: 'bg-blue-50'
      }
    case 'cargoware':
      return {
        name: 'CargoWare',
        logo: '/assets/v2_snyjmq-Lh_sDSg4.png',
        color: 'from-teal-600 to-teal-800',
        bgColor: 'bg-teal-50'
      }
    default:
      return {
        name: 'Unknown',
        logo: '🔐',
        color: 'from-gray-600 to-gray-800',
        bgColor: 'bg-gray-50'
      }
  }
})

// 组件挂载
onMounted(() => {
  mounted.value = true
})

// 处理授权登录
const handleAuth = async () => {
  if (!authForm.value.username || !authForm.value.password) {
    alert('请填写完整的登录信息')
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟授权验证
    const validCredentials = [
      { username: 'admin', password: '123456' },
      { username: 'user', password: 'password' },
      { username: 'test', password: '1' },
    ]
    
    const isValid = validCredentials.some(
      cred => cred.username === authForm.value.username && cred.password === authForm.value.password
    )
    
    if (!isValid) {
      alert('用户名或密码错误')
      loading.value = false
      return
    }
    
    alert(`${providerInfo.value.name} 授权成功！`)
    
    // 显示租户选择弹窗
    showTenantModal.value = true
    
  } catch (error) {
    alert('授权失败，请重试')
  } finally {
    loading.value = false
  }
}

// 确认租户选择
const handleTenantConfirm = async () => {
  if (!selectedTenant.value) {
    alert('请选择租户')
    return
  }
  
  const tenant = tenants.find(t => t.id === selectedTenant.value)
  if (!tenant) return
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 创建用户数据
    const userData = {
      id: `sso_${Date.now()}`,
      username: `${providerInfo.value.name}用户`,
      email: `user@${provider.value}.com`,
      phone: '13800000000',
      tenant: tenant,
      provider: provider.value,
    }
    
    login(userData)
    
    alert('绑定成功！正在跳转到控制塔系统...')
    
    setTimeout(() => {
      router.push('/controltower')
    }, 1000)
    
  } catch (error) {
    alert('绑定失败，请重试')
  }
}

// 关闭租户选择弹窗
const closeTenantModal = () => {
  showTenantModal.value = false
  selectedTenant.value = ''
}

// 返回员工登录页面
const handleBackToStaffAuth = () => {
  router.push('/staff/auth')
}
</script>

<style scoped>
/* SSOAuthPage特定样式 */
.auth-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.grid-background {
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style> 