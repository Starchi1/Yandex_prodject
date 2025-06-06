import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import feedReducer, { getFeed, getOrders } from '../feedSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      feed: feedReducer
    }
  });

describe('Проверка экшенов ленты', () => {
  describe('Получение общей ленты', () => {
    test('dispatch pending экшена getFeed', () => {
      const store = createTestStore();
      store.dispatch({ type: getFeed.pending.type });
      const { feed } = store.getState();
      expect(feed.isFeedLoading).toBe(true);
      expect(feed.feedError).toBeNull();
    });

    test('dispatch rejected экшена getFeed', () => {
      const store = createTestStore();
      const errorMessage = 'mocked error';
      store.dispatch({
        type: getFeed.rejected.type,
        error: { message: errorMessage }
      });
      const { feed } = store.getState();
      expect(feed.isFeedLoading).toBe(false);
      expect(feed.feedError).toBe(errorMessage);
    });

    test('dispatch fulfilled экшена getFeed', () => {
      const payload = {
        orders: {
          _id: '660e7df397ede0001d0643df',
          ingredients: [
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Space флюоресцентный бургер',
          createdAt: '2024-04-04T10:16:19.376Z',
          updatedAt: '2024-04-04T10:16:19.994Z',
          number: 37593
        },
        total: 37601,
        totalToday: 45
      };
      const store = createTestStore();
      store.dispatch({
        type: getFeed.fulfilled.type,
        payload
      });
      const { feed } = store.getState();
      expect(feed.isFeedLoading).toBe(false);
      expect(feed.feedError).toBeNull();
      expect(feed.orders).toEqual(payload.orders);
      expect(feed.total).toBe(payload.total);
      expect(feed.totalToday).toBe(payload.totalToday);
    });
  });

  describe('Получение заказов пользователя', () => {
    test('dispatch pending экшена getOrders', () => {
      const store = createTestStore();
      store.dispatch({ type: getOrders.pending.type });
      const { feed } = store.getState();
      expect(feed.isFeedLoading).toBe(true);
      expect(feed.feedError).toBeNull();
    });

    test('dispatch rejected экшена getOrders', () => {
      const store = createTestStore();
      const errorText = 'mocked error';
      store.dispatch({
        type: getOrders.rejected.type,
        error: { message: errorText }
      });
      const { feed } = store.getState();
      expect(feed.isFeedLoading).toBe(false);
      expect(feed.feedError).toBe(errorText);
    });

    test('dispatch fulfilled экшена getOrders', () => {
      const userOrders = {
        _id: '660e7df397ede0001d0643df',
        ingredients: [
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093d'
        ],
        status: 'done',
        name: 'Space флюоресцентный бургер',
        createdAt: '2024-04-04T10:16:19.376Z',
        updatedAt: '2024-04-04T10:16:19.994Z',
        number: 37593
      };
      const store = createTestStore();
      store.dispatch({
        type: getOrders.fulfilled.type,
        payload: userOrders
      });
      const { feed } = store.getState();
      expect(feed.isFeedLoading).toBe(false);
      expect(feed.feedError).toBeNull();
      expect(feed.orders).toEqual(userOrders);
    });
  });
});
