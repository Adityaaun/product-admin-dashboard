import api from '@/lib/axios';
import { ProductListResponse, Product } from '@/types/product';

export const getProducts = async (limit: number = 30, skip: number = 0): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>('/products', {
    params: { limit, skip },
  });
  return response.data;
};

export const searchProducts = async (
  query: string,
  limit: number = 30,
  skip: number = 0,
  signal?: AbortSignal
): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>('/products/search', {
    params: { q: query, limit, skip },
    signal,
  });
  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  limit: number = 30,
  skip: number = 0
): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>(`/products/category/${category}`, {
    params: { limit, skip },
  });
  return response.data;
};

export const getProductById = async (id: number | string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData: Partial<Product>): Promise<Product> => {
  const response = await api.post<Product>('/products/add', productData);
  return response.data;
};

export const updateProduct = async (id: number | string, productData: Partial<Product>): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: number | string): Promise<Product> => {
  const response = await api.delete<Product>(`/products/${id}`);
  return response.data;
};
