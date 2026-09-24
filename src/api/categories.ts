import api from '@/lib/axios';
import { Category } from '@/types/product';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/products/categories');
  return response.data;
};
