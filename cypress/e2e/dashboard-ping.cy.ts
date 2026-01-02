describe('dashboard ping', () => {
  it('should show the API status after opening the dashboard tab', () => {
    cy.intercept('GET', '/api/v1/ping', {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
      },
      body: {
        data: {
          type: 'ping',
          id: 'ping',
          attributes: {
            message: 'pong',
          },
        },
      },
    }).as('ping')

    cy.visit('/dashboard')
    cy.wait('@ping')

    cy.get('[data-cy="coming-soon"]').should('contain', 'coming soon')
    cy.get('[data-cy="api-status"]').should('contain', 'API reachable')
    cy.get('[data-cy="tab-dashboard"]').click()
    cy.wait('@ping')
  })

  it('should show error when API is unreachable', () => {
    cy.intercept('GET', '/api/v1/ping', { forceNetworkError: true }).as('pingFail')

    cy.visit('/dashboard')
    cy.wait('@pingFail')

    cy.get('[data-cy="api-status"]').should('contain', 'Unable to reach')
  })

  it('should show error when API returns server error', () => {
    cy.intercept('GET', '/api/v1/ping', {
      statusCode: 500,
      body: { errors: [{ title: 'Internal Server Error' }] },
    }).as('pingError')

    cy.visit('/dashboard')
    cy.wait('@pingError')

    cy.get('[data-cy="api-status"]').should('contain', 'Unable to reach')
  })
})
