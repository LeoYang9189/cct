// @ts-ignore
import { ref, computed } from 'vue'

// 表单数据接口
export interface LoginFormData {
  account: string // 邮箱或手机号
  password?: string
  code?: string
}

export interface RegisterFormData {
  username: string
  phone: string
  email?: string
  password: string
  confirmPassword: string
  phoneCode: string
}

// 创建认证状态管理
export const useAuthState = () => {
  // 基础状态
  const isLogin = ref(true)
  const loading = ref(false)
  const loginType = ref<'password' | 'code'>('password')
  const countdown = ref(0)
  const mounted = ref(false)
  
  // 密码可见性
  const passwordVisible = ref(false)
  const confirmPasswordVisible = ref(false)
  
  // 弹窗状态
  const userAgreementVisible = ref(false)
  const privacyPolicyVisible = ref(false)
  
  // 表单数据
  const loginForm = ref<LoginFormData>({
    account: '',
    password: '',
    code: ''
  })
  
  const registerForm = ref<RegisterFormData>({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneCode: ''
  })
  
  // 切换登录/注册
  const toggleAuthMode = () => {
    isLogin.value = !isLogin.value
  }
  
  // 切换登录方式
  const setLoginType = (type: 'password' | 'code') => {
    loginType.value = type
  }
  
  // 切换密码可见性
  const togglePasswordVisible = () => {
    passwordVisible.value = !passwordVisible.value
  }
  
  const toggleConfirmPasswordVisible = () => {
    confirmPasswordVisible.value = !confirmPasswordVisible.value
  }
  
  // 开始倒计时
  const startCountdown = () => {
    if (countdown.value > 0) return
    
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  
  // 重置表单
  const resetForms = () => {
    loginForm.value = {
      account: '',
      password: '',
      code: ''
    }
    registerForm.value = {
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneCode: ''
    }
  }
  
  return {
    // 状态
    isLogin,
    loading,
    loginType,
    countdown,
    mounted,
    passwordVisible,
    confirmPasswordVisible,
    userAgreementVisible,
    privacyPolicyVisible,
    loginForm,
    registerForm,
    
    // 方法
    toggleAuthMode,
    setLoginType,
    togglePasswordVisible,
    toggleConfirmPasswordVisible,
    startCountdown,
    resetForms
  }
} 