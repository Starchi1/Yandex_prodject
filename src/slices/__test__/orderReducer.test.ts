import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import orderReducer, { sendOrder, getOrder, setOrderRequest, setNullOrderModalData } from '../orderSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      order: orderReducer
    }
  });

describe('Проверка экшенов заказа', () => {
  describe('Работа getOrder', () => {
    test('Обработка pending состояния', () => {
      const store = createTestStore();
      store.dispatch({ type: getOrder.pending.type });
      const { order } = store.getState();
      expect(order.isOrderLoading).toBe(true);
      expect(order.orderError).toBeNull();
    });

    test('Обработка rejected с ошибкой', () => {
      const store = createTestStore();
      const errorMsg = 'mocked error';
      store.dispatch({
        type: getOrder.rejected.type,
        error: { message: errorMsg }
      });
      const { order } = store.getState();
      expect(order.isOrderLoading).toBe(false);
      expect(order.orderError).toBe(errorMsg);
    });

    test('Обработка успешного fulfilled запроса', () => {
      const fakeData = {
        orders: [
          {
            _id: '660e81bb97ede0001d0643eb',
            ingredients: new Array(8).fill('643d69a5c3f7b9001cfa0943').concat('643d69a5c3f7b9001cfa093d'),
            owner: '65db1c0a97ede0001d05e2d6',
            status: 'done',
            name: 'Space флюоресцентный бургер',
            createdAt: '2024-04-04T10:32:27.595Z',
            updatedAt: '2024-04-04T10:32:28.181Z',
            number: 37596
          }
        ]
      };
      const store = createTestStore();
      store.dispatch({
        type: getOrder.fulfilled.type,
        payload: fakeData
      });
      const { order } = store.getState();
      expect(order.isOrderLoading).toBe(false);
      expect(order.orderError).toBeNull();
      expect(order.order).toEqual(fakeData.orders[0]);
    });
  });

  describe('Работа sendOrder', () => {
    test('pending — установка признака загрузки', () => {
      const store = createTestStore();
      store.dispatch({ type: sendOrder.pending.type });
      const { order } = store.getState();
      expect(order.isOrderLoading).toBe(true);
      expect(order.orderError).toBeNull();
    });

    test('rejected — установка ошибки', () => {
      const store = createTestStore();
      const errorText = 'mocked error';
      store.dispatch({
        type: sendOrder.rejected.type,
        error: { message: errorText }
      });
      const { order } = store.getState();
      expect(order.isOrderLoading).toBe(false);
      expect(order.orderError).toBe(errorText);
    });

    test('fulfilled — сохранение данных заказа', () => {
      const mockResponse = {
        order: {
          _id: 'mockedOrderId',
          ingredients: ['mockedIngredient'],
          owner: 'mockedOwner',
          status: 'done',
          name: 'Mocked Burger',
          createdAt: '2024-04-04T10:32:27.595Z',
          updatedAt: '2024-04-04T10:32:28.181Z',
          number: 12345
        }
      };
      const store = createTestStore();
      store.dispatch({
        type: sendOrder.fulfilled.type,
        payload: mockResponse
      });
      const { order } = store.getState();
      expect(order.isOrderLoading).toBe(false);
      expect(order.orderError).toBeNull();
      expect(order.orderModalData).toEqual(mockResponse.order);
    });
  });

  describe('Проверка обычных экшенов orderSlice', () => {
    test('setOrderRequest корректно обновляет флаг', () => {
      const store = createTestStore();
      store.dispatch(setOrderRequest(true));
      expect(store.getState().order.orderRequest).toBe(true);

      store.dispatch(setOrderRequest(false));
      expect(store.getState().order.orderRequest).toBe(false);
    });

    test('setNullOrderModalData очищает orderModalData', () => {
      const store = createTestStore();

      store.dispatch({
        type: sendOrder.fulfilled.type,
        payload: {
          order: {
            _id: 'mockedOrderId',
            ingredients: ['mockedIngredient'],
            owner: 'mockedOwner',
            status: 'done',
            name: 'Mocked Burger',
            createdAt: '2024-04-04T10:32:27.595Z',
            updatedAt: '2024-04-04T10:32:28.181Z',
            number: 12345
          }
        }
      });

      expect(store.getState().order.orderModalData).not.toBeNull();

      store.dispatch(setNullOrderModalData());
      expect(store.getState().order.orderModalData).toBeNull();
    });
  });
});
