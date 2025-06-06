import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TConstructorSlice = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

export const initialState: TConstructorSlice = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredients: (state, action: PayloadAction<TIngredient>) => {
      const constructorIngredient: TConstructorIngredient = {
        ...action.payload,
        id: nanoid()
      };

      constructorIngredient.type === 'bun'
        ? (state.constructorItems.bun = constructorIngredient)
        : state.constructorItems.ingredients.push(constructorIngredient);
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.constructorItems.ingredients.length - 1) {
        const items = state.constructorItems.ingredients;
        [items[index], items[index + 1]] = [items[index + 1], items[index]];
      }
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const items = state.constructorItems.ingredients;
        [items[index], items[index - 1]] = [items[index - 1], items[index]];
      }
    },

    clearConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  },
  selectors: {
    selectConstructorItems: (state) => state.constructorItems
  }
});

export const { selectConstructorItems } = burgerConstructorSlice.selectors;
export const {
  addIngredients,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
