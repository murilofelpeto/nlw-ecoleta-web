import axios from 'axios';

//We use axios because it facilitate the access to an external service
const api = axios.create({
    baseURL: 'https://nlw-ecoleta-api.herokuapp.com/'
});

const ibge = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades'
})

export {api,ibge}