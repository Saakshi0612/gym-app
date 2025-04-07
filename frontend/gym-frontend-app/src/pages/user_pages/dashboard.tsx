import LogoutButton from "../../components/LogoutButton";
import { useAppSelector} from "../../store/store";
function Dashboard() {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {isAuthenticated ? (
          <p className="text-lg">Welcome to your fitness journey, {user?.firstName}!</p>
        ) : (
          <p className="text-lg">You are logged out. Click "Log In" to continue your fitness journey.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;