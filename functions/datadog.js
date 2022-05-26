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
  // `logs` is an array of 1-100 log objects
  // Use an API or library to send the logs to another service.
  await context.http.post({
    url: "https://http-intake.logs.datadoghq.com/api/v2/logs",
    // body: logs,
    headers: {
     "Content-Type": ["application/json"],
     "DD-API-KEY": ["8667200b4f38f9743602bf5fcb1dd4f9"],
     "DD_SITE": ["datadoghq.com"],
     "DD-APPLICATION-KEY": ["02851e3272241ec73669de957974d2f8fc9f6d8d"],
    },
    body : [{  
      "ddsource": "agent",  
      "ddtags": "env:prod,user:joe.doe",  
      "hostname": "fa1e1e739d95", 
      "service": "payment",
      "logs": logs,
    }],
    encodeBodyAsJSON: true
  });
}