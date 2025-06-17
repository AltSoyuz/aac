import type { Product } from "../types";

export const validateProduct = (
  product: Omit<Product, "Id"> & { Id?: number },
  existingProducts: Product[]
): { isValid: boolean; errorMessage?: string } => {
  // Validate name is not empty
  if (!product.Name || product.Name.trim() === "") {
    return { isValid: false, errorMessage: "Name cannot be empty." };
  }

  // Validate reference is not empty
  if (!product.Reference || product.Reference.trim() === "") {
    return { isValid: false, errorMessage: "Reference cannot be empty." };
  }

  // Check for unique reference (for existing products being edited)
  if (
    product.Id !== undefined &&
    existingProducts.some(
      (row) => row.Reference === product.Reference && row.Id !== product.Id
    )
  ) {
    return { isValid: false, errorMessage: "Reference must be unique." };
  }

  // Check for unique reference (for new products being added)
  if (
    product.Id === undefined &&
    existingProducts.some((row) => row.Reference === product.Reference)
  ) {
    return { isValid: false, errorMessage: "Reference must be unique." };
  }

  // Check for valid price
  if (isNaN(product.Price) || product.Price < 0) {
    return { isValid: false, errorMessage: "Price cannot be less than 0 euros." };
  }

  // Check for valid rating
  if (isNaN(product.Rating) || product.Rating < 0 || product.Rating > 5) {
    return { isValid: false, errorMessage: "Rating must be between 0 and 5." };
  }

  return { isValid: true };
};
