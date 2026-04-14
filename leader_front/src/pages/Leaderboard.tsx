import React, { useState, useEffect } from 'react';
import {
  Container,
  Tabs,
  Table,
  Loader,
  Center,
  Alert,
  Group,
  Button,
  Text,
  Stack,
} from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { getLeaderboardUsers, getLeaderboardGroups } from '../api/client';
import type { UserLeaderboardEntry, GroupLeaderboardEntry } from '../types/api';

export const Leaderboard: React.FC = () => {
  const [userLeaderboard, setUserLeaderboard] = useState<UserLeaderboardEntry[]>([]);
  const [groupLeaderboard, setGroupLeaderboard] = useState<GroupLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      setError(null);
      const since = "2020-01-01T00:00:00"

      const [userRes, groupRes] = await Promise.all([
        getLeaderboardUsers(since),
        getLeaderboardGroups(since),
      ]);

      setUserLeaderboard(userRes.data);
      setGroupLeaderboard(groupRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboards');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLeaderboards();
  }, []);

  // Poll every minute for updates
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchLeaderboards();
    }, 60000); // 60 seconds

    return () => clearInterval(pollInterval);
  }, []);

  const userRows = userLeaderboard.map((entry) => (
    <Table.Tr key={entry.lid_naam}>
      <Table.Td fw={600} align="center">
        {entry.rank}
      </Table.Td>
      <Table.Td>{entry.lid_naam}</Table.Td>
      <Table.Td align="right" fw={700} c="blue">
        {entry.score}
      </Table.Td>
    </Table.Tr>
  ));

  const groupRows = groupLeaderboard.map((entry) => (
    <Table.Tr key={`${entry.group_id}-${entry.group_name}`}>
      <Table.Td fw={600} align="center">
        {entry.rank}
      </Table.Td>
      <Table.Td>{entry.group_name}</Table.Td>
      <Table.Td align="right" fw={700} c="blue">
        {entry.score}
      </Table.Td>
      <Table.Td align="center">{entry.member_count}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <div>
          <h1>Kannencompetitie</h1>
        </div>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        <Group justify="right">
          
          <Group>
            <Button
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={() => fetchLeaderboards()}
              loading={loading}
            >
              Refresh
            </Button>
            {lastUpdated && (
              <Text size="sm" c="dimmed">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Text>
            )}
          </Group>
        </Group>

        {loading && userLeaderboard.length === 0 ? (
          <Center p="xl">
            <Loader />
          </Center>
        ) : (
          <Tabs defaultValue="users">
            <Tabs.List>
              <Tabs.Tab value="users">Users</Tabs.Tab>
              <Tabs.Tab value="groups">Groups</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="users" pt="md">
              <div style={{ overflowX: 'auto' }}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th align="center">Rank</Table.Th>
                      <Table.Th>User</Table.Th>
                      <Table.Th align="right">Score</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {userRows.length > 0 ? (
                      userRows
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={5}>
                          <Center p="xl">No users found</Center>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="groups" pt="md">
              <div style={{ overflowX: 'auto' }}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th align="center">Rank</Table.Th>
                      <Table.Th>Group</Table.Th>
                      <Table.Th align="right">Score</Table.Th>
                      <Table.Th align="center">Members</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {groupRows.length > 0 ? (
                      groupRows
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={6}>
                          <Center p="xl">No groups found</Center>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </div>
            </Tabs.Panel>
          </Tabs>
        )}
      </Stack>
    </Container>
  );
};
