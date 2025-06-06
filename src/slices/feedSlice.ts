import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TInitialState = {
  isFeedLoading: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  feedError: string | null;
};

export const initialState: TInitialState = {
  isFeedLoading: false,
  orders: [],
  total: 0,
  totalToday: 0,
  feedError: null
};

export const getFeed = createAsyncThunk('feed/getFeed', () => getFeedsApi());
export const getOrders = createAsyncThunk('feed/getOrders', () =>
  getOrdersApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectIsFeedLoading: (state) => state.isFeedLoading,
    selectOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isFeedLoading = true;
        state.feedError = null;
      })
      .addCase(getOrders.pending, (state) => {
        state.isFeedLoading = true;
        state.feedError = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feedError = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feedError = null;
        state.orders = action.payload;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.feedError = action.error.message as string;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.feedError = action.error.message as string;
      });
  }
});

export const {
  selectIsFeedLoading,
  selectOrders,
  selectTotal,
  selectTotalToday
} = feedSlice.selectors;

export default feedSlice.reducer;
