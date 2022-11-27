const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
//const swaggerSpec = swaggerJsdoc(options);

const swaggerFile = require('./swagger_output.json'); // 剛剛輸出的 JSON

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
const openapiSpecification = swaggerJsdoc(options);

function swaggerDocs(app) {
  // Swagger page
  // console.log(swaggerSpec);
  //app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  //app.use('/v2/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

  // Docs in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;
