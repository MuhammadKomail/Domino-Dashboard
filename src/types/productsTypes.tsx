// Note: Response structure for total products count API...!
// Note: Products Types Start Here
export interface TotalProductsCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: number | null; // Total count will be a number
  exception: string[];
}

export interface Product {
  productId: string;
  name: string;
  createdBy: string;
  createdDate: string;
  isActive: boolean;
  isArchived: boolean;
  updatedBy: string;
  updatedDate: string;
  brand: Array<{ brandId: string; brandName: string }>;
  model: Array<{ modelId: string; modelName: string }>;
  category: Array<{ categoryId: string; categoryName: string }>;
}

export interface ListProductsResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Data; // Ensure this matches the expected structure
  exception: string[];
}

export interface Data {
  totalCount: number;
  products: Product[];
}
export interface UploadProductsResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: string[]; // Updated to match the new payload structure
  exception: string[];
}

export interface UploadProductRequest {
  registeredNewProducts: RegisteredNewProduct[];
}

export interface RegisteredNewProduct {
  productName: string;
  brandName: string;
  model: string;
  modelDescription: string;
  productCategory: string;
}

export interface AddProduct {
  productName: string;
  brandId: string;
  categoryId: string;
  modelId: string;
}

export interface AddProductResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: null;
  exception: any[];
}

export interface UpdatedProduct {
  productId: string;
  productName: string;
  brandId: string;
  categoryId: string;
  modelId: string;
}

export interface DeleteProduct {
  productId: string;
}

// Note: Delete Product Type Start Here
export interface DeleteProductResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

// Note: Categories Types Start Here
export interface TotalCategoriesCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Data;
  exception: any[];
}

export interface Data {
  totalCount: number;
  productCategories: Categories[];
}
export interface CategoriesCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: null;
  exception: any[];
}
export interface AddCategories {
  productCategoryName: string;
}

export interface Categories {
  productCategoryId: string;
  name: string;
  createdBy: string;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  updatedBy: string;
  updatedDate: Date;
}

export interface UpdatedCategories {
  productCategoryId: string;
  productCategoryName: string;
}

export interface DeleteCategories {
  productCategoryId: string;
}

// Note: Delete Categorie Type Start Here
export interface DeleteCategorieResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

// Note: Brands Types Start Here
export interface AddBrand {
  brandName: string;
}

export interface TotalBrandsCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Data;
  exception: any[];
}

export interface Data {
  totalCount: number;
  brands: Brands[];
}

export interface Brands {
  brandId: string;
  name: string;
  createdBy: string;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  updatedBy: string;
  updatedDate: Date;
}

export interface UpdatedBrand {
  brandId: string;
  brandName: string;
}

export interface DeleteBrand {
  brandId: string;
}

// Note: Delete Brand Type Start Here
export interface DeleteBrandResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}

// Note: Models Types Start Here
export interface TotalModelsCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Data;
  exception: any[];
}


export interface Data {
  totalCount: number;
  models: Models[];
}


export interface AddModel {
  modelName: string;
  description: string;
}

export interface Models {
  modelId: string;
  name: string;
  description: string;
  createdBy: string;
  createdDate: Date;
  isActive: boolean;
  isArchived: boolean;
  updatedBy: string;
  updatedDate: Date;
}

export interface UpdatedModel {
  modelId: string;
  modelName: string;
  description: string;
}

export interface DeleteModel {
  modelId: string;
}

// Note: Delete Model Type Start Here
export interface DeleteModelResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: any;
  exception: any[];
}