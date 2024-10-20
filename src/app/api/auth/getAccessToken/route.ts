var axios = require("axios").default;

var options = {
  method: 'POST',
  url: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  data: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: `${process.env.AUTH0_CLIENT_ID}`,
    client_secret: `${process.env.AUTH0_CLIENT_SECRET}`,
    audience: `${process.env.AUTH0_API_AUDIENCE}`
  })
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});