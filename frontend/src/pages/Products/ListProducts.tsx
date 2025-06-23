import React, { useEffect } from 'react';
import ProductList from '../../components/Products/ProductList';
import { getProducts } from '../../api/products';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Paper } from '@mui/material';

const ListProducts = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  const handleProductClick = (id: number) => {
    navigate(`/products/${id}`);
  };

  const fetchProducts = async () => {
    const response = await getProducts(accessToken || '');
    return response.data;
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <ProductList fetchProducts={fetchProducts} onProductClick={handleProductClick} />
      </Paper>
    </Box>
  );
};

export default ListProducts;