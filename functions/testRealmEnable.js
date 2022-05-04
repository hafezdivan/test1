const ADMIN_API_BASE_URL = "https://realm.mongodb.com/api/admin/v3.0";

async function authenticate(publicApiKey, privateApiKey) {
  const result = await context.http.post({
    url: `${ADMIN_API_BASE_URL}/auth/providers/mongodb-cloud/login`,
    headers: {
      "Content-Type": ["application/json"],
      "Accept": ["application/json"],
    },
    body: {
      "username": publicApiKey,
      "apiKey": privateApiKey,
    },
    encodeBodyAsJSON: true
  });
  return EJSON.parse(result.body.text());
}

exports = async function enablesync() {
  // Get values that you need for requests
  const groupId = context.values.get("GroupID");
  const appId = context.values.get("ApplicationID");
  const publicApiKey = context.values.get("AdminAPIPublicKeyValue");
  const privateApiKey = context.values.get("AdminAPIPrivateKeyValue");
  // Authenticate with the Atlas API Key
  const { access_token } = await authenticate(publicApiKey, privateApiKey);
  // Get logs for your Realm App
  const servicesEndpoint = `${ADMIN_API_BASE_URL}/groups/${groupId}/apps/${appId}/services`;
  const  request = {
    "url": servicesEndpoint,
    "headers": {
      "Authorization": [`Bearer ${access_token}`]
    }
  };
  const result = await context.http.get(request);
  const services = EJSON.parse(result.body.text());
  return services;
}

