import AppRoutes from './routes/AppRoutes'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'

// Component to conditionally wrap with ProgressProvider
function AppContent() {
  const { user, getUserRole } = useAuth();
  const userRole = getUserRole();

  // Only provide ProgressProvider for regular users, not for admin or guests
  if (user && userRole === 'user') {
    return (
      <ProgressProvider>
        <AppRoutes/>
      </ProgressProvider>
    );
  }

  // For admin, guest, or no user - no progress tracking needed
  return <AppRoutes/>;
}

function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  )
}

export default App
