import React, { useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ProductForm from '../../components/Products/ProductForm';
import { createProduct } from '../../api/products';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (values: any) => {
    try {
      await createProduct(values, accessToken || '');
      navigate('/products');
    } catch (error) {
      console.error('Failed to create product', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Create New Product
        </Typography>
        <ProductForm onSubmit={handleSubmit} title="Create New Product" />
      </Paper>
    </Box>
  );
};

export default CreateProduct;