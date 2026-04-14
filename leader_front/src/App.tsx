import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MantineProvider, AppShell, Group as MantineGroup, Button, Container } from '@mantine/core';
import '@mantine/core/styles.css';
import { AuthProvider } from './context/AuthContext';
import { Leaderboard } from './pages/Leaderboard';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AppShell.Header px="md">
      <Container size="xl" h="100%" display="flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Kannencompetitie</h2>
        </Link>
        <MantineGroup>
          {isAuthenticated && (
            <Button component={Link} to="/admin" variant="subtle" size="sm">
              Admin
            </Button>
          )}
        </MantineGroup>
      </Container>
    </AppShell.Header>
  );
};

function AppContent() {
  return (
    <Router>
      <AppShell header={{ height: 60 }}>
        <Navigation />
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<Leaderboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
}

function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;

