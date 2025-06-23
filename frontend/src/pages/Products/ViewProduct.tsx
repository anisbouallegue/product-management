import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProduct } from '../../api/products';
import ProductView from '../../components/Products/ProductView';
import { Box } from '@mui/material';

const ViewProduct = () => {
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
        const response = await getProduct(Number(id), accessToken || '');
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product', error);
        navigate('/products');
      }
    };

    fetchProduct();
  }, [id, accessToken, navigate]);

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  if (!product) return <Box sx={{ mt: 4, textAlign: 'center' }}>Loading...</Box>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <ProductView product={product} onEdit={handleEdit} />
    </Box>
  );
};

export default ViewProduct;