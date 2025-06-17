import { useState, useEffect, useCallback } from "react";
import data from "./../data.json";
import type { Product, SnackbarMessage } from "./types";
import { ProductForm } from "./components/ProductForm";
import { ProductGrid } from "./components/ProductGrid";
import { SnackbarAlert } from "./components/SnackbarAlert";
import { validateProduct } from "./utils/validation";

const App = () => {
  // Initialize products state from localStorage or data file
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem("gridRows");
      if (savedProducts) {
        return JSON.parse(savedProducts);
      }
    } catch (error) {
      console.error("Could not parse products from localStorage", error);
    }
    // If no saved data, initialize from data.json
    return data.map((product) => ({
      ...product,
      id: product.Id, // Add id for DataGrid component
    }));
  });

  useEffect(() => {
    localStorage.setItem("gridRows", JSON.stringify(products));
  }, [products]);

  const [snackbar, setSnackbar] = useState<SnackbarMessage>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = useCallback(
    async (newRow: Product) => {
      // Validate the product
      const validation = validateProduct(newRow, products);
      
      if (!validation.isValid) {
        return Promise.reject(new Error(validation.errorMessage));
      }

      // If validation passes, update the products
      return new Promise<Product>((resolve) => {
        const updatedProducts = products.map((product) =>
          product.Id === newRow.Id ? newRow : product
        );
        setProducts(updatedProducts);
        setSnackbar({
          children: "Product successfully updated",
          severity: "success",
        });
        resolve(newRow);
      });
    },
    [products]
  );

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    console.error(error);
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  // Handle adding a new product
  const handleAddProduct = (product: Omit<Product, "Id">) => {
    // Validate the new product
    const validation = validateProduct(product, products);
    
    if (!validation.isValid) {
      setSnackbar({ children: validation.errorMessage || "Invalid product", severity: "error" });
      return;
    }

    // Add new product with a new ID
    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.Id)) + 1 : 1;
    const newProduct: Product = {
      Id: nextId,
      ...product,
    };
    
    setProducts([...products, { ...newProduct, id: newProduct.Id }]);
    setSnackbar({ children: "Product added!", severity: "success" });
  };

  return (
    <div>
      <ProductForm onAddProduct={handleAddProduct} />
      <ProductGrid
        rows={products}
        onRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
      <SnackbarAlert snackbar={snackbar} onClose={handleCloseSnackbar} />
    </div>
  );
};

export default App;
