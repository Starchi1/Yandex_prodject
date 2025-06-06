import { expect, test, describe } from '@jest/globals';
import constructorReducer, {
  addIngredients,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  clearConstructor,
  initialState
} from '../burgerConstructorSlice';
import type { TConstructorSlice } from '../burgerConstructorSlice';
import { nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: jest.fn(() => 'mockedID')
}));

describe('Reducer burgerConstructorSlice', () => {
  const baseState: TConstructorSlice = JSON.parse(JSON.stringify(initialState));

  baseState.constructorItems = {
    bun: {
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
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      id: '0'
    },
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        id: '1'
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        id: '2'
      }
    ]
  };

  test('Добавление ингредиента в конструктор', () => {
    const newIngredient = {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    };

    const expectedState = JSON.parse(JSON.stringify(baseState));
    expectedState.constructorItems.ingredients.push({
      ...newIngredient,
      id: 'mockedID'
    });

    const result = constructorReducer(baseState, addIngredients(newIngredient));

    expect(nanoid).toHaveBeenCalled();
    expect(result).toEqual(expectedState);
  });

  test('Удаление ингредиента из конструктора', () => {
    const targetId = '1';
    const expectedState = JSON.parse(JSON.stringify(baseState));
    expectedState.constructorItems.ingredients = expectedState.constructorItems.ingredients.filter(
      (item: TConstructorIngredient) => item.id !== targetId
    );

    const result = constructorReducer(baseState, removeIngredient(targetId));
    expect(result).toEqual(expectedState);
  });

  describe('Изменение порядка ингредиентов', () => {
    test('Перемещение ингредиента вверх по списку', () => {
      const index = 1;
      const expectedState = JSON.parse(JSON.stringify(baseState));

      const items = expectedState.constructorItems.ingredients;
      [items[index - 1], items[index]] = [items[index], items[index - 1]];

      const result = constructorReducer(baseState, moveIngredientUp(index));
      expect(result).toEqual(expectedState);
    });

    test('Перемещение ингредиента вниз по списку', () => {
      const index = 0;
      const expectedState = JSON.parse(JSON.stringify(baseState));

      const items = expectedState.constructorItems.ingredients;
      [items[index], items[index + 1]] = [items[index + 1], items[index]];

      const result = constructorReducer(baseState, moveIngredientDown(index));
      expect(result).toEqual(expectedState);
    });
  });

  test('Очистка конструктора', () => {
    const expectedState: TConstructorSlice = {
      ...baseState,
      constructorItems: {
        bun: null,
        ingredients: []
      }
    };

    const result = constructorReducer(baseState, clearConstructor());
    expect(result).toEqual(expectedState);
  });
});
