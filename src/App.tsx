import { Route, Routes } from 'react-router-dom';

import RootLayout from './layouts/root.layout';
import { DashboardPage } from './pages/dashboard';
import { WelcomePage } from './pages/welcome';

export default function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </RootLayout>
  );
}
