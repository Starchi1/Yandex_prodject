import { deleteCookie, setCookie } from '../../../src/utils/cookie';

const URL = 'https://norma.nomoreparties.space/api';

describe('Проверка конструктора бургеров', () => {
  beforeEach(() => {
    setCookie(
      'accessToken',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjBhMDAyOTdlZGUwMDAxZDA2MDg1NCIsImlhdCI6MTcxMjMxMDE2NiwiZXhwIjoxNzEyMzExMzY2fQ.v7kdecJvLfdmlBsvf_BySvsfnXX3K0Er__GNYw-NRLM'
    );
    localStorage.setItem(
      'refreshToken',
      '9cbdd5b777edfb92bd9183a7cf2372a12b545c045a9796f94c1afd0b9d374a8794aa15bee20a7556'
    );

    cy.intercept('GET', `${URL}/auth/user`, { fixture: 'user.json' }).as('fetchUser');
    cy.intercept('GET', `${URL}/ingredients`, { fixture: 'ingredients.json' }).as('fetchIngredients');
    cy.intercept('POST', `${URL}/orders`, { fixture: 'order.json' }).as('submitOrder');

    cy.visit('/');
    cy.wait('@fetchUser');
    cy.wait('@fetchIngredients');
  });

  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Получение и отображение ингредиентов', () => {
    cy.get('[data-cy="ingredient-item"]').should('have.length.greaterThan', 0);
  });

  it('Добавление ингредиентов в конструктор', () => {
    cy.get('[data-cy="Булки"]').find('button').first().click();
    cy.get('[data-cy="Начинки"]').find('button').first().click();

    cy.get('[data-cy="constructor"]').should('contain.text', 'булка');
    cy.get('[data-cy="constructor"]').should('contain.text', 'котлета');
  });

  it('Открытие и закрытие модального окна ингредиента', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Закрытие модалки по клику по оверлею', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal-overlay"]').click('topRight', { force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Оформление заказа с булкой и начинкой', () => {
    cy.get('[data-cy="Булки"]').find('button').first().click();
    cy.get('[data-cy="Начинки"]').find('button').first().click();

    cy.get('[data-cy="order-button"]').click();

    cy.wait('@submitOrder');

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal"]').should('contain.text', '777666');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Не позволяет оформить заказ без ингредиентов', () => {
    cy.get('[data-cy="order-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Открытие модалки повторно после закрытия', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="ingredient-item"]').eq(1).click();
    cy.get('[data-cy="modal"]').should('be.visible');
  });
});
