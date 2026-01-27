import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'

function App() {

  return (
    <AuthProvider>
      <ProgressProvider>
        <AppRoutes/>
      </ProgressProvider>
    </AuthProvider>
  )
}

export default App
