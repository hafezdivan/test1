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
  // Get services for your Realm App
  var Endpoint = `${ADMIN_API_BASE_URL}/groups/${groupId}/apps/${appId}/services`;
  var  request = {
    "url": Endpoint,
    "headers": {
      "Authorization": [`Bearer ${access_token}`]
    }
  };
  var result = await context.http.get(request);
  var services = EJSON.parse(result.body.text());
  var serviceID = services[0]._id;
  // return services;
  // return serviceID;
  
  Endpoint =  `${ADMIN_API_BASE_URL}/groups/${groupId}/apps/${appId}/services/${serviceID}/config`;
  request = {
    "url": Endpoint,
    "headers": {
      "Authorization": [`Bearer ${access_token}`]
    }
  };
  result = await context.http.patch(request);
  var config = EJSON.parse(result.body.text());
  // config.sync.state = "disabled";
  //return config;
  

  //if (config.sync.state == "disabled") {
 // config.sync.state = "disabled";
  //  return config;
  
  
  
  request = {
    "url": Endpoint,
    "headers": {
      "Authorization": [`Bearer ${access_token}`]
    },
    "body": config,
    encodeBodyAsJSON: true
  };
  result = await context.http.post(request);
  var status =  EJSON.parse(result.status);
  
  

  //return status;
  return result;
  // if (status == "200")
  //   return "Replication enabled.";
  // else
  //   return "An error ocurred."
//}
//   else
//     return "Nothing to do."
}


