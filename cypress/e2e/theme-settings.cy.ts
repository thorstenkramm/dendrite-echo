describe('theme settings', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('persists dark theme preference to localStorage', () => {
    cy.visit('/dashboard')

    cy.get('[data-cy="settings-toggle"]').click()
    cy.get('[data-cy="settings-menu"]').should('be.visible')
    cy.get('[data-cy="theme-dark"]').click()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('dendrite-echo-theme')).to.eq('dark')
    })
    cy.get('html').should('have.class', 'dark')
  })

  it('persists light theme preference to localStorage', () => {
    cy.visit('/dashboard')

    cy.get('[data-cy="settings-toggle"]').click()
    cy.get('[data-cy="theme-light"]').click()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('dendrite-echo-theme')).to.eq('light')
    })
    cy.get('html').should('not.have.class', 'dark')
  })

  it('restores theme preference from localStorage on page load', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('dendrite-echo-theme', 'dark')
    })

    cy.visit('/dashboard')

    cy.get('html').should('have.class', 'dark')
  })

  it('auto theme uses OS preference', () => {
    cy.visit('/dashboard')

    cy.get('[data-cy="settings-toggle"]').click()
    cy.get('[data-cy="theme-auto"]').click()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('dendrite-echo-theme')).to.eq('auto')
    })
  })

  it('closes settings menu after selecting theme', () => {
    cy.visit('/dashboard')

    cy.get('[data-cy="settings-toggle"]').click()
    cy.get('[data-cy="settings-menu"]').should('be.visible')
    cy.get('[data-cy="theme-dark"]').click()

    cy.get('[data-cy="settings-menu"]').should('not.exist')
  })
})
