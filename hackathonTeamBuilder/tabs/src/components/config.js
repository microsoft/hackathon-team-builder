const prod = {
    GRAPHQL_ENDPOINT: 'https://teambuilderapi20220111132301.azurewebsites.net/graphql',
    HACKAPI_ENDPOINT: 'https://hackapi-tax6y5voqibmw.azurewebsites.net/api',
    HACKAPI_SCOPE: 'api://05acec15-d6fb-4dae-a9b3-5886a7709df9/user_impersonation'    
    };

const dev = {
    GRAPHQL_ENDPOINT: 'https://localhost:5501/graphql'
    };

export const config = process.env.NODE_ENV === 'development' ? dev: prod;