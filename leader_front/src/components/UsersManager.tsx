import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  TextInput,
  Select,
  Stack,
  Group as MantineGroup,
  Loader,
  Center,
  Alert,
  Modal,
  Card,
} from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import {
  getUsers,
  getGroups,
  createUser,
  assignUserToGroup,
} from '../api/client';
import type { User, Group } from '../types/api';

const UsersManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserGroupId, setNewUserGroupId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, groupsRes] = await Promise.all([
        getUsers(),
        getGroups(),
      ]);
      setUsers(usersRes.data);
      setGroups(groupsRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    try {
      setCreating(true);
      const groupId = newUserGroupId ? parseInt(newUserGroupId) : undefined;
      const res = await createUser(newUserName, groupId);
      setUsers([...users, res.user]);
      setNewUserName('');
      setNewUserGroupId(null);
      setOpenModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleChangeUserGroup = async (lidNaam: string, groupId: string | null) => {
    try {
      const numGroupId = groupId ? parseInt(groupId) : null;
      const res = await assignUserToGroup(lidNaam, numGroupId);
      setUsers(users.map((u) => (u.lid_naam === lidNaam ? res.user : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const groupOptions = [
    { value: '', label: 'No Group' },
    ...groups.map((g) => ({
      value: g.id.toString(),
      label: g.name,
    })),
  ];

  const rows = users.map((user) => (
    <Table.Tr key={user.lid_naam}>
      <Table.Td>{user.lid_naam}</Table.Td>
      <Table.Td>
        <Select
          placeholder="Select group"
          data={groupOptions}
          value={user.group_id?.toString() || ''}
          onChange={(value) => handleChangeUserGroup(user.lid_naam, value)}
          searchable
          clearable
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      )}

      <MantineGroup justify="space-between">
        <h2>Users</h2>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setOpenModal(true)}
        >
          Add User
        </Button>
      </MantineGroup>

      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreateUser}>
          <Stack gap="md">
            <TextInput
              label="User Name (lid_naam)"
              placeholder="Enter user name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.currentTarget.value)}
              required
            />
            <Select
              label="Group (Optional)"
              placeholder="Select a group"
              data={groupOptions}
              value={newUserGroupId}
              onChange={setNewUserGroupId}
              searchable
              clearable
            />
            <MantineGroup justify="flex-end">
              <Button variant="subtle" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={creating}>
                Create
              </Button>
            </MantineGroup>
          </Stack>
        </form>
      </Modal>

      <Card withBorder>
        {loading ? (
          <Center p="xl">
            <Loader />
          </Center>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>User Name</Table.Th>
                  <Table.Th>Group</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.length > 0 ? (
                  rows
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Center p="xl">No users yet</Center>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Card>
    </Stack>
  );
};

export default UsersManager;
