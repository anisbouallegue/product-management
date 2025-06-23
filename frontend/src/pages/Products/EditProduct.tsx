import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import ProductForm from '../../components/Products/ProductForm';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct } from '../../api/products';
import { useAuth } from '../../contexts/AuthContext';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    const fetchProduct = async () => {
      try {
        const response = await getProduct(Number(id), accessToken);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product', error);
        navigate('/products');
      }
    };

    fetchProduct();
  }, [id, accessToken, navigate]);

  const handleSubmit = async (values: any) => {
    try {
      await updateProduct(Number(id), values, accessToken || '');
      navigate(`/products/${id}`);
    } catch (error) {
      console.error('Failed to update product', error);
    }
  };

  if (!product) {
    return <Box sx={{ mt: 4, textAlign: 'center' }}>Loading...</Box>;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Edit Product
        </Typography>
        <ProductForm initialValues={product} onSubmit={handleSubmit} title="Edit Product" />
      </Paper>
    </Box>
  );
};

export default EditProduct;