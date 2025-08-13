import { BrowserRouter as Router } from 'react-router-dom'
import { ModalProvider } from './contexts/ModalContext'
import './index.css'

// AppContent组件
import AppContent from './components/AppContent'

// Stagewise imports (only in development)
import { StagewiseToolbar } from '@stagewise/toolbar-react'

function App() {
  return (
    <Router>
      <ModalProvider>
        <AppContent />
        {/* Stagewise Toolbar - 仅在开发模式下显示 */}
        {import.meta.env.DEV && (
          <StagewiseToolbar
            config={{
              plugins: [],
            }}
          />
        )}
      </ModalProvider>
    </Router>
  )
}

export default App
