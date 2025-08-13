<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- 用户名和手机号 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-gray-700 font-semibold mb-2">用户名</label>
        <div class="relative">
          <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="registerForm.username"
            type="text"
            placeholder="请输入用户名"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label class="block text-gray-700 font-semibold mb-2">手机号</label>
        <div class="relative">
          <i class="fas fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="registerForm.phone"
            type="tel"
            placeholder="请输入手机号"
            pattern="^1[3-9]\d{9}$"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>
      </div>
    </div>

    <!-- 手机验证码 -->
    <div>
      <label class="block text-gray-700 font-semibold mb-2">手机验证码</label>
      <div class="flex space-x-3">
        <input
          v-model="registerForm.phoneCode"
          type="text"
          placeholder="请输入验证码"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          required
        />
        <button
          type="button"
          :disabled="countdown > 0"
          @click="handleSendCode"
          class="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
        </button>
      </div>
    </div>

    <!-- 邮箱（可选） -->
    <div>
      <label class="block text-gray-700 font-semibold mb-2">邮箱（可选）</label>
      <div class="relative">
        <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="registerForm.email"
          type="email"
          placeholder="请输入邮箱（可选）"
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>

    <!-- 密码设置 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-gray-700 font-semibold mb-2">设置密码</label>
        <div class="relative">
          <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="registerForm.password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="至少6位密码"
            minlength="6"
            class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <button
            type="button"
            @click="togglePasswordVisible"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>

      <div>
        <label class="block text-gray-700 font-semibold mb-2">确认密码</label>
        <div class="relative">
          <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="registerForm.confirmPassword"
            :type="confirmPasswordVisible ? 'text' : 'password'"
            placeholder="请再次输入密码"
            class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <button
            type="button"
            @click="toggleConfirmPasswordVisible"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i :class="confirmPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 用户协议 -->
    <div class="flex items-start">
      <input
        v-model="agreedToTerms"
        type="checkbox"
        id="terms"
        class="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        required
      />
      <label for="terms" class="text-sm text-gray-600">
        我已阅读并同意
        <button
          type="button"
          @click="$emit('showAgreement')"
          class="text-blue-600 hover:text-blue-700"
        >
          《用户协议》
        </button>
        和
        <button
          type="button"
          @click="$emit('showPrivacy')"
          class="text-blue-600 hover:text-blue-700"
        >
          《隐私政策》
        </button>
      </label>
    </div>

    <!-- 注册按钮 -->
    <button
      type="submit"
      :disabled="loading || !agreedToTerms"
      class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all flex items-center justify-center"
    >
      <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
      {{ loading ? '注册中...' : '立即注册' }}
    </button>

    <!-- 企业用户提示 -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <div class="flex items-start">
        <i class="fas fa-building text-blue-600 mt-1 mr-3"></i>
        <div>
          <h4 class="text-sm font-semibold text-gray-800 mb-1">企业用户？</h4>
          <p class="text-sm text-gray-600">
            请联系您的企业管理员或
            <button
              type="button"
              @click="handleStaffAuth"
              class="text-blue-600 hover:text-blue-700 font-medium"
            >
              使用员工通道登录
            </button>
          </p>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthState } from '../composables/useAuthState'

// Props
interface Props {
  loading: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  submit: [values: any]
  sendCode: []
  showAgreement: []
  showPrivacy: []
}>()

// 使用状态管理
const {
  registerForm,
  passwordVisible,
  confirmPasswordVisible,
  countdown,
  togglePasswordVisible,
  toggleConfirmPasswordVisible,
  startCountdown
} = useAuthState()

const router = useRouter()
const agreedToTerms = ref(false)

// 处理表单提交
const handleSubmit = async () => {
  // 验证表单
  if (!registerForm.value.username) {
    alert('请输入用户名')
    return
  }
  
  if (!registerForm.value.phone || !/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    alert('请输入有效的手机号')
    return
  }
  
  if (!registerForm.value.phoneCode) {
    alert('请输入验证码')
    return
  }
  
  if (!registerForm.value.password || registerForm.value.password.length < 6) {
    alert('密码至少6位')
    return
  }
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  if (!agreedToTerms.value) {
    alert('请同意用户协议和隐私政策')
    return
  }
  
  emit('submit', registerForm.value)
}

// 发送验证码
const handleSendCode = () => {
  if (!registerForm.value.phone) {
    alert('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    alert('请输入有效的手机号')
    return
  }
  
  startCountdown()
  emit('sendCode')
  alert('验证码已发送 📱')
}

// 跳转到员工登录
const handleStaffAuth = () => {
  router.push('/staff/auth')
}
</script> 