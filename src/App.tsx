import { Navigate, Route, Routes } from 'react-router-dom';

import { DashboardPage } from './pages/dashboard';
import { WelcomePage } from './pages/welcome';
import { useGitStore } from './stores/git.store';

function RootGuard() {
  const savedRepos = useGitStore((s) => s.savedRepos);
  if (savedRepos.length === 0) {
    return <Navigate to="/welcome" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const savedRepos = useGitStore((s) => s.savedRepos);
  if (savedRepos.length === 0) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootGuard />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
