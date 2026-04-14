import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  TextInput,
  Stack,
  Group as MantineGroup,
  Loader,
  Center,
  Alert,
  Modal,
  Card,
} from '@mantine/core';
import { IconAlertCircle, IconTrash, IconPlus } from '@tabler/icons-react';
import { getGroups, createGroup } from '../api/client';
import type { Group } from '../types/api';

const GroupsManager: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [creating, setCreating] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getGroups();
      setGroups(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      setCreating(true);
      const res = await createGroup(newGroupName);
      setGroups([...groups, res.group]);
      setNewGroupName('');
      setOpenModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  const rows = groups.map((group) => (
    <Table.Tr key={group.id}>
      <Table.Td>{group.id}</Table.Td>
      <Table.Td>{group.name}</Table.Td>
      <Table.Td align="right">
        <Button
          variant="subtle"
          color="red"
          size="xs"
          leftSection={<IconTrash size={14} />}
          disabled
          title="Delete functionality requires backend support"
        >
          Delete
        </Button>
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
        <h2>Groups</h2>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setOpenModal(true)}
        >
          Add Group
        </Button>
      </MantineGroup>

      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title="Create New Group"
      >
        <form onSubmit={handleCreateGroup}>
          <Stack gap="md">
            <TextInput
              label="Group Name"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.currentTarget.value)}
              required
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
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th align="right">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.length > 0 ? (
                  rows
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={3}>
                      <Center p="xl">No groups yet</Center>
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

export default GroupsManager;
