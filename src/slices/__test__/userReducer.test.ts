import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
  forgotPassword,
  resetPassword,
  getUser,
  clearUserError,
  initialState,
  TInitialState
} from '../userSlice';

const createTestStore = () =>
  configureStore({
    reducer: {
      user: userReducer
    }
  });

describe('Проверка пользовательских экшенов', () => {
  const getUserState = (store: ReturnType<typeof createTestStore>) => store.getState().user;

  const testAsyncAction = (
    actionType: string,
    payloadOrError: any,
    expected: Partial<TInitialState>
  ) => {
    const store = createTestStore();
    store.dispatch({ type: actionType, ...payloadOrError });
    const state = getUserState(store);
    for (const key in expected) {
      expect(state[key as keyof TInitialState]).toEqual(expected[key as keyof TInitialState]);
    }
  };

  describe('Логин пользователя', () => {
    test('pending', () => {
      testAsyncAction(loginUser.pending.type, {}, {
        isUserLoading: true,
        userError: null
      });
    });

    test('rejected', () => {
      const error = 'mocked userError';
      testAsyncAction(loginUser.rejected.type, { error: { message: error } }, {
        isUserLoading: false,
        userError: error
      });
    });

    test('fulfilled', () => {
      const payload = {
        accessToken: 'mockToken',
        refreshToken: 'mockRefresh',
        user: { name: 'Test User', email: 'test@example.com' }
      };
      testAsyncAction(loginUser.fulfilled.type, { payload }, {
        isUserLoading: false,
        userError: null,
        user: payload.user,
        isAuthorized: true
      });
    });
  });

  describe('Регистрация пользователя', () => {
    test('pending', () => {
      testAsyncAction(registerUser.pending.type, {}, {
        isUserLoading: true,
        userError: null
      });
    });

    test('rejected', () => {
      const errorMsg = 'mocked userError';
      testAsyncAction(registerUser.rejected.type, { error: { message: errorMsg } }, {
        isUserLoading: false,
        userError: errorMsg
      });
    });

    test('fulfilled', () => {
      const payload = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        user: {
          name: 'Kirill Shcherbinko',
          email: 'kirill.shcherbinko@mirea.ru'
        }
      };
      testAsyncAction(registerUser.fulfilled.type, { payload }, {
        isUserLoading: false,
        userError: null,
        user: payload.user,
        isAuthorized: true
      });
    });
  });

  describe('Логаут', () => {
    test('pending', () => {
      testAsyncAction(logoutUser.pending.type, {}, {
        isUserLoading: true,
        userError: null
      });
    });

    test('rejected', () => {
      testAsyncAction(logoutUser.rejected.type, {
        error: { message: 'mocked userError' }
      }, {
        isUserLoading: false,
        userError: 'mocked userError'
      });
    });

    test('fulfilled', () => {
      testAsyncAction(logoutUser.fulfilled.type, {
        payload: { message: 'Successful logout' }
      }, {
        isUserLoading: false,
        userError: null,
        user: null,
        isAuthorized: false
      });
    });
  });

  describe('Обновление данных пользователя', () => {
    test('pending', () => {
      testAsyncAction(updateUser.pending.type, {}, {
        isUserLoading: true,
        userError: null
      });
    });

    test('rejected', () => {
      testAsyncAction(updateUser.rejected.type, {
        error: { message: 'mocked userError' }
      }, {
        isUserLoading: false,
        userError: 'mocked userError'
      });
    });

    test('fulfilled', () => {
      const updated = {
        user: {
          name: 'Kirill Shcherbinko',
          email: 'kirill.shcherbinko@mirea.ru'
        }
      };
      testAsyncAction(updateUser.fulfilled.type, { payload: updated }, {
        isUserLoading: false,
        userError: null,
        user: updated.user,
        isAuthorized: true
      });
    });
  });

  describe('Восстановление пароля', () => {
    test('pending', () => {
      testAsyncAction(forgotPassword.pending.type, {}, {
        isUserLoading: true,
        userError: null
      });
    });

    test('rejected', () => {
      testAsyncAction(forgotPassword.rejected.type, {
        error: { message: 'mocked userError' }
      }, {
        isUserLoading: false,
        userError: 'mocked userError'
      });
    });

    test('fulfilled', () => {
      testAsyncAction(forgotPassword.fulfilled.type, {
        payload: { message: 'Reset email sent' }
      }, {
        isUserLoading: false,
        userError: null,
        user: null,
        isAuthorized: false
      });
    });
  });

  describe('Сброс пароля', () => {
    test('pending', () => {
      testAsyncAction(resetPassword.pending.type, {}, {
        isUserLoading: true,
        userError: null
      });
    });

    test('rejected', () => {
      testAsyncAction(resetPassword.rejected.type, {
        error: { message: 'mocked userError' }
      }, {
        isUserLoading: false,
        userError: 'mocked userError'
      });
    });

    test('fulfilled', () => {
      testAsyncAction(resetPassword.fulfilled.type, {
        payload: { message: 'Password successfully reset' }
      }, {
        isUserLoading: false,
        userError: null,
        user: null,
        isAuthorized: false
      });
    });
  });

  describe('Получение данных пользователя', () => {
    test('pending', () => {
      testAsyncAction(getUser.pending.type, {}, {
        isUserLoading: true,
        userError: null
      });
    });

    test('rejected', () => {
      testAsyncAction(getUser.rejected.type, {
        error: { message: 'mocked userError' }
      }, {
        isUserLoading: false,
        userError: 'mocked userError'
      });
    });

    test('fulfilled', () => {
      const fetchedUser = {
        user: {
          name: 'Kirill Scherbinko',
          email: 'shcherbinko.kirill@mirea.ru'
        }
      };
      testAsyncAction(getUser.fulfilled.type, { payload: fetchedUser }, {
        isUserLoading: false,
        userError: null,
        user: fetchedUser.user,
        isAuthorized: true
      });
    });
  });

  describe('Редюсер: очистка ошибки', () => {
    test('clearUserError', () => {
      const prevState: TInitialState = {
        ...initialState,
        userError: 'Ошибка'
      };
      const newState = userReducer(prevState, clearUserError());
      expect(newState.userError).toBeNull();
    });
  });
});
