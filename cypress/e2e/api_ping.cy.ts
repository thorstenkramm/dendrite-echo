describe('API ping', () => {
  it('renders the ping response on the start page', () => {
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

    cy.visit('/')
    cy.contains('button', 'API Ping').click()
    cy.wait('@ping')
    cy.contains('API Response')
    cy.get('pre code').should('contain', '"message": "pong"')
  })
})
