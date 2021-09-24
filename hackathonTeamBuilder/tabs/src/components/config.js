const prod = {
    GRAPHQL_ENDPOINT: 'https://nh4h-graphql-fjjjjjwgkmniu.azurewebsites.net/api/hack',
    HACKAPI_ENDPOINT: 'https://hackapi-tax6y5voqibmw.azurewebsites.net/api',
    HACKAPI_SCOPE: 'api://05acec15-d6fb-4dae-a9b3-5886a7709df9/user_impersonation'    
    };

const dev = {
    GRAPHQL_ENDPOINT: 'http://localhost:3030/api/hack',
    HACKAPI_ENDPOINT: 'https://localhost:44300/api',
    HACKAPI_SCOPE: 'api://scope/user_impersonation'    
    };

export const config = process.env.NODE_ENV === 'development' ? dev: prod;