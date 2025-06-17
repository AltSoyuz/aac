import { Box, Button, Rating, TextField } from "@mui/material";
import { useState } from "react";
import type { Product } from "../types";

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, "Id">) => void;
}

export const ProductForm = ({ onAddProduct }: ProductFormProps) => {
  const [newProduct, setNewProduct] = useState<Omit<Product, "Id">>({
    Name: "",
    Reference: "",
    Price: 0,
    Rating: 0,
  });

  const handleNewProductChange = (
    field: keyof Omit<Product, "Id">,
    value: string | number
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct(newProduct);
    setNewProduct({ Name: "", Reference: "", Price: 0, Rating: 0 });
  };

  return (
    <form
      onSubmit={handleAddProduct}
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <TextField
        label="Name"
        size="small"
        value={newProduct.Name}
        onChange={(e) => handleNewProductChange("Name", e.target.value)}
        required
      />
      <TextField
        label="Reference"
        size="small"
        value={newProduct.Reference}
        onChange={(e) => handleNewProductChange("Reference", e.target.value)}
        required
      />
      <TextField
        label="Price"
        size="small"
        type="number"
        value={newProduct.Price}
        onChange={(e) =>
          handleNewProductChange("Price", Number(e.target.value))
        }
        required
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Rating
          name="new-product-rating"
          value={newProduct.Rating}
          precision={1}
          onChange={(_, value) =>
            handleNewProductChange("Rating", value ?? 0)
          }
        />
      </Box>
      <Button type="submit" variant="contained" color="primary">
        Add Product
      </Button>
    </form>
  );
};
