import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { SubjectProvider } from "./context/SubjectContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <SubjectProvider>
        <TaskProvider>
          <AppRoutes />
        </TaskProvider>
      </SubjectProvider>
    </AuthProvider>
  );
}

export default App;