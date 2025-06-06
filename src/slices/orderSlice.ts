import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TInitialState = {
  isOrderLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  order: TOrder | null;
  orderError: string | null;
};

export const initialState: TInitialState = {
  isOrderLoading: false,
  orderRequest: false,
  orderModalData: null,
  order: null,
  orderError: null
};

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  (orderData: string[]) => orderBurgerApi(orderData)
);

export const getOrder = createAsyncThunk('order/getOrder', (number: number) =>
  getOrderByNumberApi(number)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderRequest: (state, action) => {
      state.orderRequest = action.payload;
    },
    setNullOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectIsOrderLoading: (state) => state.isOrderLoading,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrder: (state) => state.order
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
      })
      .addCase(getOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = null;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = null;
        state.order = action.payload.orders[0];
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = action.error.message as string;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = action.error.message as string;
      });
  }
});

export const {
  selectIsOrderLoading,
  selectOrderRequest,
  selectOrderModalData,
  selectOrder
} = orderSlice.selectors;

export const { setOrderRequest, setNullOrderModalData } = orderSlice.actions;

export default orderSlice.reducer;
