import React, { useState } from 'react';
import {
  Container,
  Paper,
  PasswordInput,
  Button,
  Text,
  Stack,
  Center,
  Alert,
} from '@mantine/core';
import { IconAlertCircle, IconLock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate async login
    setTimeout(() => {
      if (login(password)) {
        navigate('/admin');
      } else {
        setError('Invalid password');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <Container size="sm" py="xl">
      <Center mih="100vh">
        <Paper p="lg" radius="md" withBorder w="100%" maw={400}>
          <Stack gap="md">
            <div>
              <Center mb="md">
                <IconLock size={48} color="var(--mantine-color-blue-6)" />
              </Center>
              <Text ta="center" fw={700} size="lg">
                Admin Access
              </Text>
              <Text ta="center" c="dimmed" size="sm">
                Enter the admin password to access management tools
              </Text>
            </div>

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <PasswordInput
                  label="Password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                  autoFocus
                />

                <Button type="submit" fullWidth loading={loading}>
                  Login
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
};
