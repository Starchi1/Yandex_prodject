import { expect, test, describe } from '@jest/globals';
import { rootReducer } from '../store';
import { initialState as userInitialState } from '../../slices/userSlice';
import { initialState as burgerConstructorInitialState } from '../../slices/burgerConstructorSlice';
import { initialState as orderInitialState } from '../../slices/orderSlice';
import { initialState as feedInitialState } from '../../slices/feedSlice';
import { initialState as ingredientsInitialState } from '../../slices/ingredientsSlice';

describe('Проверка начального состояния rootReducer', () => {
  const expectedInitialState = {
    user: { ...userInitialState },
    feed: { ...feedInitialState },
    order: { ...orderInitialState },
    ingredients: { ...ingredientsInitialState },
    burgerConstructor: { ...burgerConstructorInitialState },
  };

  test('Возвращает начальное состояние при неизвестном действии', () => {
    const unknownAction = { type: 'UNKNOW_ACTION' };
    const state = rootReducer(undefined, unknownAction);
    expect(state).toEqual(expectedInitialState);
  });
});
