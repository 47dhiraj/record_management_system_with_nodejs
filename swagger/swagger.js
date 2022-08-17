const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Record Management System with Rest API",
        version: "1.0.0",
        description: "This is RMS Rest API made with Expressjs and documented with Swagger",
        license: {
            name: "MIT",
            url: "https://opensource.org/licenses/MIT"
        }
      },
      servers: [
        {
          url: "http://localhost:3500",
          description: 'Development server'
        },
      ],
      components: {
        schemas: {
            User: {
                type: 'object',
                required: ['username', 'password', 'roles'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'id of the user'
                    },
                    username: {
                        type: 'string',
                        description: 'Username of the user'
                    },
                    password: {
                        type: 'string',
                        description: 'Password of the user'
                    },
                    roles: [],
                    active: {
                        type: 'boolean',
                        description: 'current status of the user'
                    }
                },
                example: {
                    id: '62fbe8c05cef68c45f5813bd',
                    username: 'admin',
                    password: 'admin',
                    roles: ["Admin"],
                    active: true
                }
            },
            Record: {
                type: 'object',
                required: ['user', 'title', 'text'],
                properties: {
                    user: {
                        type: 'string',
                        description: 'objectid of the user'
                    },
                    title: {
                        type: 'string',
                        description: 'Title of the record'
                    },
                    text: {
                        type: 'string',
                        description: 'Description of the record'
                    },
                    completed: {
                        type: 'boolean',
                        description: 'status of record'
                    },
                    image: {}
                },
                example: {
                    user: '62fbe8c05cef68c45f5813bd',
                    title: 'first record',
                    text: 'this is first record',
                    completed: false,
                    image: ''
                }
            },
        },
        responses : {
            400: {
                description: 'Missing API key - include it in the Authorization header',
                contents: 'application/json'
            },
            401: {
                description: 'Unauthorized - incorrect API key or incorrect format',
                contents: 'application/json'
            },
            404: {
                description: 'Not found - the user was not found',
                contents: 'application/json'
            }
        },
        securitySchemes: {
            ApiKeyAuth: {
                "type": "http",
                "description": "JWT Authorization header using the Bearer scheme.",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
          }
      },
      security: [{
        ApiKeyAuth: []
      }]

    },
    apis: [
        "./controllers/usersController.js",
        "./controllers/recordsController.js",
    ],
}


module.exports = options
  