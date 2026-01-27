import { useAuth } from "../../context/AuthContext";

// Debug component to show current auth status
const AuthStatus = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="bg-gray-100 p-2 text-sm text-gray-600">
        Status: Not authenticated (Guest view)
      </div>
    );
  }

  return (
    <div className="bg-green-100 p-2 text-sm text-green-700">
      Status: Authenticated as {user?.name} ({user?.role})
    </div>
  );
};

export default AuthStatus;