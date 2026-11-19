import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Product } from "../../types";

type ProductsStatus = "idle" | "loading" | "succeeded" | "failed";

interface ProductsState {
  items: Product[];
  status: ProductsStatus;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.price === "number" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    typeof value.image === "string"
  );
}

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string; state: RootState }
>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      return rejectWithValue(`Không thể tải sản phẩm (HTTP ${response.status}).`);
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data.every(isProduct)) {
      return rejectWithValue("Dữ liệu sản phẩm nhận được không hợp lệ.");
    }

    return data;
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().products;
      return status === "idle" || status === "failed";
    },
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Đã xảy ra lỗi khi tải sản phẩm.";
      });
  },
});

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;

export default productsSlice.reducer;
