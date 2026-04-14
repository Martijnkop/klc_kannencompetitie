import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  NumberInput,
  Stack,
  Group as MantineGroup,
  Loader,
  Center,
  Alert,
  Card,
  Text,
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { getProducts, updateProductMultiplier } from '../api/client';
import type { Product } from '../types/api';

interface ProductWithEditing extends Product {
  editingMultiplier?: number;
  isSaving?: boolean;
}

const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<ProductWithEditing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditMultiplier = (productId: number, currentMultiplier: number) => {
    setEditingId(productId);
    setEditingValue(currentMultiplier);
  };

  const handleSaveMultiplier = async (productId: number) => {
    if (editingValue === null || editingValue < 0 || editingValue > 127) {
      setError('Multiplier must be between 0 and 127');
      return;
    }

    try {
      await updateProductMultiplier(productId, editingValue);
      setProducts(
        products.map((p) =>
          p.product_id === productId
            ? { ...p, multiplier: editingValue }
            : p
        )
      );
      setEditingId(null);
      setEditingValue(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update multiplier');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue(null);
  };

  const rows = products.map((product) => (
    <Table.Tr key={product.product_id}>
      <Table.Td fw={500}>{product.product_id}</Table.Td>
      <Table.Td>{product.product_name}</Table.Td>
      <Table.Td>
        {editingId === product.product_id ? (
          <NumberInput
            value={editingValue || 0}
            onChange={(value) => setEditingValue(typeof value === 'number' ? value : null)}
            min={0}
            max={127}
            step={0.1}
            w={100}
            autoFocus
          />
        ) : (
          <Text fw={600}>{product.multiplier}</Text>
        )}
      </Table.Td>
      <Table.Td align="right">
        {editingId === product.product_id ? (
          <MantineGroup gap={4} justify="flex-end">
            <Button
              variant="subtle"
              color="green"
              size="xs"
              leftSection={<IconCheck size={14} />}
              onClick={() => handleSaveMultiplier(product.product_id)}
            >
              Save
            </Button>
            <Button
              variant="subtle"
              color="red"
              size="xs"
              leftSection={<IconX size={14} />}
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </MantineGroup>
        ) : (
          <Button
            variant="subtle"
            size="xs"
            onClick={() =>
              handleEditMultiplier(product.product_id, product.multiplier)
            }
          >
            Edit
          </Button>
        )}
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
        <h2>Products</h2>
        <Button variant="light" onClick={fetchProducts} loading={loading}>
          Refresh
        </Button>
      </MantineGroup>

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
                  <Table.Th>Multiplier</Table.Th>
                  <Table.Th align="right">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.length > 0 ? (
                  rows
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Center p="xl">No products found</Center>
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

export default ProductsManager;
