// exports = function(arg){
//   /*
//     Accessing application's values:
//     var x = context.values.get("value_name");

//     Accessing a mongodb service:
//     var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
//     collection.findOne({ owner_id: context.user.id }).then((doc) => {
//       // do something with doc
//     });

//     To call other named functions:
//     var result = context.functions.execute("function_name", arg1, arg2);

//     Try running in the console below.
//   */
//   return {arg: arg};
// };



exports = async function(logs) {
  await context.http.post({
    url: "https://http-intake.logs.datadoghq.com/api/v2/logs",
    headers: {
     "Content-Type": ["application/json"],
     "DD-API-KEY": ["8667200b4f38f9743602bf5fcb1dd4f9"],
    },
    body : [{  
      "ddsource": "Mongodb",  
      "ddtags": "sxo_realm_log_forwarder",  
      "hostname": "SXO-PROD-NA", 
      "service": "Realm",
      "logs": logs,
    }],
    encodeBodyAsJSON: true
  });
}