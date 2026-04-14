import axios from 'axios';
import type {
  UserLeaderboardEntry,
  GroupLeaderboardEntry,
  Product,
  User,
  Group,
  LeaderboardResponse,
} from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Leaderboard endpoints
export const getLeaderboardUsers = async (
  since: string,
  limit: number = 100
): Promise<LeaderboardResponse<UserLeaderboardEntry>> => {
  const response = await client.get('/leaderboard/users', {
    params: { since, limit },
  });
  return response.data;
};

export const getLeaderboardGroups = async (
  since: string,
  limit: number = 100
): Promise<LeaderboardResponse<GroupLeaderboardEntry>> => {
  const response = await client.get('/leaderboard/groups', {
    params: { since, limit },
  });
  return response.data;
};

// Product endpoints
export const getProducts = async (): Promise<{ count: number; data: Product[] }> => {
  const response = await client.get('/products');
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await client.get(`/products/${id}`);
  return response.data;
};

export const updateProductMultiplier = async (
  id: number,
  multiplier: number
): Promise<{ message: string; product: Product }> => {
  const response = await client.put(`/products/${id}/multiplier`, { multiplier });
  return response.data;
};

// User endpoints
export const getUsers = async (): Promise<{ count: number; data: User[] }> => {
  const response = await client.get('/users');
  return response.data;
};

export const getUser = async (lidNaam: string): Promise<User> => {
  const response = await client.get(`/users/${encodeURIComponent(lidNaam)}`);
  return response.data;
};

export const createUser = async (lidNaam: string, groupId?: number): Promise<{ message: string; user: User }> => {
  const response = await client.post('/users', { lid_naam: lidNaam, group_id: groupId || null });
  return response.data;
};

export const assignUserToGroup = async (
  lidNaam: string,
  groupId: number | null
): Promise<{ message: string; user: User }> => {
  const response = await client.put(`/users/${encodeURIComponent(lidNaam)}/group`, { group_id: groupId });
  return response.data;
};

// Group endpoints
export const getGroups = async (): Promise<{ count: number; data: Group[] }> => {
  const response = await client.get('/groups');
  return response.data;
};

export const getGroup = async (id: number): Promise<Group> => {
  const response = await client.get(`/groups/${id}`);
  return response.data;
};

export const createGroup = async (name: string): Promise<{ message: string; group: Group }> => {
  const response = await client.post('/groups', { name });
  return response.data;
};

export default client;
