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

//

exports = async function enablesync() {
  // Get values that you need for requests
  const groupId = context.values.get("GroupID");
  const appId = context.values.get("ApplicationID");
  const publicApiKey = context.values.get("AdminAPIPublicKeyValue");
  const privateApiKey = context.values.get("AdminAPIPrivateKeyValue");
  const serviceID = context.values.get("serviceID");
  
  // Authenticate with the Atlas API Key
  const { access_token } = await authenticate(publicApiKey, privateApiKey);
  
  // Get logs for your Realm App
  const servicesEndpoint = ADMIN_API_BASE_URL + "/groups/" + groupId + "/apps/" + appId + "/services/" + serviceID + "/config";
  
  // Get Service Config
  // const  request = {
  //   "url": servicesEndpoint,
  //   "headers": {
  //     "Authorization": [`Bearer ${access_token}`]
  //   }
  // }

  // const result = await context.http.get( request );
  // const services = EJSON.parse(result.body.text());  
  // console.log(JSON.stringify(services));
  // return 0;

  // PATCH Service Config
  const patchBody =  {
      "clusterName":"Cluster0",
      "wireProtocolEnabled":false,
      "sync": {
        "state": "enabled",
        "partition" : {
          "type":"string",
          "key":"CatalogItem",
          "permissions": {
            "read":true,
            "write":false
          }
        }
      }
  }
  
  const  request = {
    "url": servicesEndpoint,
    "headers": {
      "Authorization": [`Bearer ${access_token}`]
    },
    "encodeBodyAsJSON":true,
    "body": patchBody
    
  };
  const result = await context.http.patch( request );

  console.log(JSON.stringify(result));
  return 0;

}