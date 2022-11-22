const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MEISHIcian API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer <JWT token here>',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './validations/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  // Swagger page
  // console.log(swaggerSpec);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;
