const axios = require('axios');

const url = 'https://httpbin.io/anything';
const apikey = '9502f5f4ec36591dc0c2f1c525336421223f880c';
axios({
    url: 'https://api.zenrows.com/v1/',
    method: 'GET',
    params: {
        'url': url,
        'apikey': apikey,
    },
})
    .then(response => console.log(response.data))
    .catch(error => console.log(error)); 