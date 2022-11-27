const swaggerAutogen = require('swagger-autogen');
const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./app.js']; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

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
    tags: [
      {
        name: '1. 會員驗證',
        description: '會員驗證',
      },
      {
        name: '2. 名片管理',
        description: '名片管理相關功能',
      },
      {
        name: '3. 個人名片',
        description: '名片管理相關功能',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './validations/*.js'],
};
swaggerAutogen(outputFile, endpointsFiles, options); // swaggerAutogen 的方法
