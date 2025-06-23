import axios from 'axios';
import { Product, Variant } from '../types';

const API_URL = 'http://localhost:5000/products';

const getAuthHeader = (accessToken: string) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const getProducts = (accessToken: string) => {
  return axios.get(API_URL, getAuthHeader(accessToken));
};

export const getProduct = (id: number, accessToken: string) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader(accessToken));
};

export const createProduct = (product: Partial<Product>, accessToken: string) => {
  return axios.post(API_URL, product, getAuthHeader(accessToken));
};

export const updateProduct = (id: number, product: Partial<Product>, accessToken: string) => {
  return axios.put(`${API_URL}/${id}`, product, getAuthHeader(accessToken));
};

export const deleteProduct = (id: number, accessToken: string) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader(accessToken));
};

export const uploadProductImages = (id: number, files: File[], accessToken: string) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  return axios.post(`${API_URL}/${id}/gallery`, formData, {
    ...getAuthHeader(accessToken),
    headers: {
      ...getAuthHeader(accessToken).headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProductImage = (id: number, imageId: number, accessToken: string) => {
  return axios.delete(`${API_URL}/${id}/gallery/${imageId}`, getAuthHeader(accessToken));
};

export const upload3dModel = (id: number, file: File, accessToken: string) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axios.post(`${API_URL}/${id}/3dmodel`, formData, {
    ...getAuthHeader(accessToken),
    headers: {
      ...getAuthHeader(accessToken).headers,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getVariants = (id: number, accessToken: string) => {
  return axios.get(`${API_URL}/${id}/variants`, getAuthHeader(accessToken));
};

export const addVariant = (id: number, variant: Partial<Variant>, accessToken: string) => {
  return axios.post(`${API_URL}/${id}/variants`, variant, getAuthHeader(accessToken));
};

export const updateVariant = (id: number, variantId: number, variant: Partial<Variant>, accessToken: string) => {
  return axios.put(`${API_URL}/${id}/variants/${variantId}`, variant, getAuthHeader(accessToken));
};

export const deleteVariant = (id: number, variantId: number, accessToken: string) => {
  return axios.delete(`${API_URL}/${id}/variants/${variantId}`, getAuthHeader(accessToken));
};

export const updateStock = (id: number, stock: number, variantId?: number, accessToken?: string) => {
  return axios.put(
    `${API_URL}/${id}/stock`,
    { stock, variantId },
    getAuthHeader(accessToken || '')
  );
};

export const getStockHistory = (id: number, accessToken: string) => {
  return axios.get(`${API_URL}/${id}/stock/history`, getAuthHeader(accessToken));
};

export const addTag = (id: number, name: string, accessToken: string) => {
  return axios.post(`${API_URL}/${id}/tag`, { name }, getAuthHeader(accessToken));
};

export const deleteTag = (id: number, tagId: number, accessToken: string) => {
  return axios.delete(`${API_URL}/${id}/tag/${tagId}`, getAuthHeader(accessToken));
};

export const updatePromotion = (id: number, promoted: boolean, accessToken: string) => {
  return axios.put(`${API_URL}/${id}/promotion`, { promoted }, getAuthHeader(accessToken));
};

export const updateSeo = (id: number, slug: string, accessToken: string) => {
  return axios.put(`${API_URL}/${id}/seo`, { slug }, getAuthHeader(accessToken));
};