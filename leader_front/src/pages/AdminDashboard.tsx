import React from 'react';
import {
  Container,
  Tabs,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GroupsManager from '../components/GroupsManager';
import UsersManager from '../components/UsersManager';
import ProductsManager from '../components/ProductsManager';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <h1>⚙️ Admin Dashboard</h1>
          <Button variant="subtle" color="red" onClick={handleLogout}>
            Logout
          </Button>
        </Group>

        <Tabs defaultValue="groups">
          <Tabs.List>
            <Tabs.Tab value="groups">Manage Groups</Tabs.Tab>
            <Tabs.Tab value="users">Manage Users</Tabs.Tab>
            <Tabs.Tab value="products">Manage Products</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="groups" pt="md">
            <GroupsManager />
          </Tabs.Panel>

          <Tabs.Panel value="users" pt="md">
            <UsersManager />
          </Tabs.Panel>

          <Tabs.Panel value="products" pt="md">
            <ProductsManager />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};
