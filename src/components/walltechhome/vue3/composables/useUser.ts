// @ts-ignore
import { ref, computed } from 'vue'

interface User {
  id: string
  username: string
  email?: string
  phone?: string
  avatar?: string
  tenant?: any
  provider?: string
}

interface UserState {
  user: User | null
}

// 全局状态
const state = ref<UserState>({
  user: null
})

// 从localStorage恢复用户状态
const initializeUser = () => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      state.value.user = JSON.parse(savedUser)
    } catch (error) {
      console.error('恢复用户状态失败:', error)
      localStorage.removeItem('user')
    }
  }
}

// 初始化用户状态
initializeUser()

export const useUser = () => {
  // 计算属性
  const isLoggedIn = computed(() => !!state.value.user)

  // 方法
  const login = (userData: User) => {
    state.value.user = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    state.value.user = null
    localStorage.removeItem('user')
  }

  const updateUser = (userData: Partial<User>) => {
    if (state.value.user) {
      state.value.user = { ...state.value.user, ...userData }
      localStorage.setItem('user', JSON.stringify(state.value.user))
    }
  }

  return {
    // 状态
    user: computed(() => state.value.user),
    isLoggedIn,
    
    // 方法
    login,
    logout,
    updateUser
  }
} 