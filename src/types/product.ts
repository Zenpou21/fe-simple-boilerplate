/** A product, as the API returns it (one row of the products table). */
export type Product = {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
