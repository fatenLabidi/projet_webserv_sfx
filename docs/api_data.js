define({ "api": [
  {
    "type": "post",
    "url": "/users",
    "title": "Create a user",
    "name": "CreateUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>Enregistrer un nouvel utilisateur</p>",
    "examples": [
      {
        "title": "Example",
        "content": " POST /users HTTP/1.1\n Content-Type: application/json\n\n{\n   \"id\": \"58b2926f5e1def0123e97188\",\n   \"firstName\": \"John\",\n   \"lastName\": \"Doe\",\n   \"role\": \"citizen\",\n   \"--v\": 0,\n   \"createdAt\": \"2017-02-28T14:16:25.000Z\"\n }",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "201 Created",
          "content": "HTTP/1.1 201 Created\nContent-Type: application/json\nLocation: https://heigvd-webserv-2017-team-6.herokuapp.com/users/58b2926f5e1def0123e97188\n\n{\n  \"id\": \"58b2926f5e1def0123e97188\",\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"role\": \"citizen\",\n  \"--v\": 0,\n  \"createdAt\": \"2017-02-28T14:16:25.000Z\"\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "FirstName",
            "description": "<p>prénom de l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "LastName",
            "description": "<p>nom de l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "enum",
            "optional": false,
            "field": "role",
            "description": "<p>Role que rempli l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the person was registered</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "User",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "size": "2..20",
            "optional": false,
            "field": "FirstName",
            "description": "<p>prénom de l'utilisateur. Attention, la combinaise du prénom et du nom doit être unique</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "2..20",
            "optional": false,
            "field": "LastName",
            "description": "<p>nom de l'utilisateur. Attention, la combinaise du prénom et du nom doit être unique</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "allowedValues": [
              "\"citizen, manager\""
            ],
            "optional": false,
            "field": "role",
            "description": "<p>Role que rempli l'utilisateur</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/",
            "description": "<p><code>User already exists</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "422 Unprocessable Entity",
          "content": " HTTP/1.1 422 Unprocessable Entity\n Content-Type: text/plain\n\nUser already exists",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Retrieve a user",
    "name": "RetrieveUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>récuperer un utilisateur</p>",
    "examples": [
      {
        "title": "Example",
        "content": "GET /user/58b2926f5e1def0123e97188 HTTP/1.1",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"id\": \"58b2926f5e1def0123e97188\",\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"role\": \"citizen\",\n  \"--v\": 0,\n  \"createdAt\": \"2017-02-28T14:16:25.000Z\"\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "FirstName",
            "description": "<p>prénom de l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "LastName",
            "description": "<p>nom de l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "enum",
            "optional": false,
            "field": "role",
            "description": "<p>Role que rempli l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the person was registered</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "User",
    "parameter": {
      "fields": {
        "URL path parameters": [
          {
            "group": "URL path parameters",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The unique identifier of the person to retrieve</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "404/",
            "description": "<p><code>No user found with ID ${userId}</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "404 Not Found",
          "content": "HTTP/1.1 404 Not Found\nContent-Type: text/plain\n\nNo user found with ID 58b2926f5e1def0123e97bc0",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Retrieve all user",
    "name": "RetrieveUser",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>récuperer tout les utilisateurs</p>",
    "examples": [
      {
        "title": "Example",
        "content": "GET /users HTTP/1.1",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "200 OK",
          "content": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"id\": \"58b2926f5e1def0123e97188\",\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"role\": \"citizen\",\n  \"--v\": 0,\n  \"createdAt\": \"2017-02-28T14:16:25.000Z\"\n\n \"id\": \"58b2926f5e1def0123efef97188\",\n  \"firstName\": \"Simon  \",\n  \"lastName\": \"Loto\",\n  \"role\": \"citizen\",\n  \"--v\": 0,\n  \"createdAt\": \"2017-02-27T14:15:25.000Z\"\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "FirstName",
            "description": "<p>prénom de l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "LastName",
            "description": "<p>nom de l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "enum",
            "optional": false,
            "field": "role",
            "description": "<p>Role que rempli l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the person was registered</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "/users/:id",
    "title": "Update a user",
    "name": "Update_a_user",
    "group": "User",
    "version": "1.0.0",
    "description": "<p>mise à jour partielle (ou totale) des données utilisateur</p>",
    "examples": [
      {
        "title": "Example",
        "content": "PATCH /users/58b2926f5e1def0123e97281 HTTP/1.1\nContent-Type: application/json\n\n{\n  \"role\": \"citizen\"\n}",
        "type": "json"
      }
    ],
    "filename": "routes/users.js",
    "groupTitle": "User",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "size": "2..20",
            "optional": false,
            "field": "FirstName",
            "description": "<p>prénom de l'utilisateur. Attention, la combinaise du prénom et du nom doit être unique</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "2..20",
            "optional": false,
            "field": "LastName",
            "description": "<p>nom de l'utilisateur. Attention, la combinaise du prénom et du nom doit être unique</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "allowedValues": [
              "\"citizen, manager\""
            ],
            "optional": false,
            "field": "role",
            "description": "<p>Role que rempli l'utilisateur</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "FirstName",
            "description": "<p>prénom de l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "LastName",
            "description": "<p>nom de l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "enum",
            "optional": false,
            "field": "role",
            "description": "<p>Role que rempli l'utilisateur</p>"
          },
          {
            "group": "Response body",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>The date at which the person was registered</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "404/",
            "description": "<p><code>No user found with ID ${userId}</code></p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "422/",
            "description": "<p><code>User already exists</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "404 Not Found",
          "content": "HTTP/1.1 404 Not Found\nContent-Type: text/plain\n\nNo user found with ID 58b2926f5e1def0123e97bc0",
          "type": "json"
        },
        {
          "title": "422 Unprocessable Entity",
          "content": " HTTP/1.1 422 Unprocessable Entity\n Content-Type: text/plain\n\nUser already exists",
          "type": "json"
        }
      ]
    }
  }
] });
