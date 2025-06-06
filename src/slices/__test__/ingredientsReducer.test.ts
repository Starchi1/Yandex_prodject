import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

const initializeStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer
    }
  });

describe('Проверка экшенов ingredients', () => {
  describe('Асинхронный экшен fetchIngredients', () => {
    test('Состояние при fetchIngredients.pending', () => {
      const store = initializeStore();
      store.dispatch({ type: fetchIngredients.pending.type });
      const { ingredients } = store.getState();
      expect(ingredients.isIngredientsLoading).toBe(true);
      expect(ingredients.ingredientsError).toBeNull();
    });

    test('Состояние при fetchIngredients.rejected', () => {
      const store = initializeStore();
      const mockError = 'mocked error';
      store.dispatch({
        type: fetchIngredients.rejected.type,
        error: { message: mockError }
      });
      const { ingredients } = store.getState();
      expect(ingredients.isIngredientsLoading).toBe(false);
      expect(ingredients.ingredientsError).toBe(mockError);
    });

    test('Состояние при fetchIngredients.fulfilled', () => {
      const mockIngredient = {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      };
      const store = initializeStore();
      store.dispatch({
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredient
      });
      const { ingredients } = store.getState();
      expect(ingredients.isIngredientsLoading).toBe(false);
      expect(ingredients.ingredientsError).toBeNull();
      expect(ingredients.ingredients).toEqual(mockIngredient);
    });
  });
});
