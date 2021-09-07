const dialogflow=require('@google-cloud/dialogflow');
require('dotenv').config();
const express=require('express');
const fs=require('fs');
const bodyparser=require('body-parser');

const CREDENTIALS=JSON.parse(fs.readFileSync('./Projectdetails.json'));

const PROJECTID=CREDENTIALS.project_id;

const CONFIGURATION={
    credentials:{
        private_key:CREDENTIALS['private_key'],
        client_email:CREDENTIALS['client_email']
    }
}

const sessionclient=new dialogflow.SessionsClient(CONFIGURATION);

const detectIntent=async(languagecode,querytext,sessionId)=>{
    let sessionPath=sessionclient.projectAgentSessionPath(PROJECTID,sessionId);

    let request={

         session:sessionPath,
         queryInput:{
             text:{
                 text:querytext,
                 languageCode:languagecode,
             },
         },
    };
    const responses=await sessionclient.detectIntent(request);
    console.log(responses);
    const result=responses[0].queryResult;
    console.log(result);
    return {
        reponse:result.fulfillmentText
    };
}

const app=express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.post('/dialogflow',async(req,res)=>{
    let languagecode=req.body.languagecode;
    let querytext=req.body.querytext;
    let sessionid=req.body.sessionid;
    let responsedata=await detectIntent(languagecode,querytext,sessionid);
    res.json({text:responsedata.reponse});
})
app.listen(3000,()=>{
    console.log('server started');
})
