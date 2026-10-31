import swaggerJsdoc from "swagger-jsdoc"

const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title: "Novaxcape",
            version: "1.0.0",
            description: "swagger documentation"
        },
        servers:[
        {

                url:"http://localhost:6565",
                description: 'hosted URL'
        }
        ],
        components:{
        securitySchemes:{
            bearerAuth:{
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    }
    },
    apis: [
      "./docs/user.yaml"
    ]
}

const swagger = swaggerJsdoc(options)

export default swagger
