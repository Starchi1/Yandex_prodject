import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type TInitialState = {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  ingredientsError: string | null;
};

export const initialState: TInitialState = {
  ingredients: [],
  isIngredientsLoading: false,
  ingredientsError: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/getAll',
  () => getIngredientsApi()
);

export const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsIngredientsLoading: (state) => state.isIngredientsLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.ingredientsError = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isIngredientsLoading = false;
          state.ingredientsError = null;
          state.ingredients = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredientsError = action.error.message as string;
      });
  }
});

export const { selectIngredients, selectIsIngredientsLoading } =
  ingredientSlice.selectors;

export default ingredientSlice.reducer;
