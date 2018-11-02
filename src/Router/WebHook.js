import express from 'express'
import crypto from 'crypto'
import webHookSchema from '../Model/WebHook'
import recordSchema from '../Model/Records'
import * as ApiUtil from '../ApiUtil/ApiUtil'
import * as ENV from '../Constants/ENV'
import {PASS_UPDATED_RECORDS_TO_CLIENT_SIDE,} from '../Constants/actionType'
import axios from 'axios'
import {redirectRecordToWebsite} from "../Controller/Redirect";

const bcrypt = require('bcryptjs')
const passport = require('passport')

const webHookRouter = express.Router();

// create personal url
webHookRouter.get('/', function (req, res) {
    const generatedUrl = () => {
        const id = crypto.randomBytes(20).toString('hex');
        webHookSchema.findOne({url: id}, (err, records) => {
            (records) ? generatedUrl() : webHookSchema.create({url: id}, function (err, records) {
                if (err) {
                    res.send('db err' + err);
                } else {
                    res.send(id);
                }
            });

        })
    }
    generatedUrl()

})
webHookRouter.get('/redirectSetting/:id', (req, res) =>
    webHookSchema.findOne({url: req.params.id}, (err, webHook) => {
        // if db err send back
        if (err) {
            res.json({err: err})
        }
        res.send({
            redirectPath: webHook.redirectPath,
            contentType: webHook.contentType,
            httpMethod: webHook.httpMethod,
            autoRedirect: webHook.autoRedirect,


        })
        //check if find  the  url

    })
)
//listen for all url
webHookRouter.all('/:id', (req, res) => {
    //check if url exist
    webHookSchema.findOne({url: req.params.id}, (err, webHook) => {
        // if db err send back
        if (err) {res.json({err: err})}
        //check if find  the  url
        if (webHook) {
            //if find the url store the request to record collection
            recordSchema.create({
                url: req.params.id,
                body: req.body,
                type: req.method,
                header: req.headers,
            }, (err, newRecord) => {
                //if db err send back
                if (err) {
                    res.json({err: err})
                }

                //if no err send back updated collection by socket
                recordSchema.find({url: req.params.id}).exec((err, records) => {
                        req.io.sockets.to(req.params.id).emit(PASS_UPDATED_RECORDS_TO_CLIENT_SIDE, records)
                        if (webHook.autoRedirect === true) {
                            axios.defaults.headers.common['Content-Type'] = webHook.contentType
                            axios(
                                {
                                    headers: {
                                        Authorization: ENV.redirectDefaultAuthorization,
                                    },
                                    method: webHook.httpMethod === 'default' ? newRecord.type : webHook.httpMethod,
                                    data: newRecord.body,
                                    url: webHook.redirectPath,
                                }
                            ).then(response =>{

                                    console.log(response)
                                    res.send(JSON.parse(ApiUtil.cleanStringify(response)))

                                }
                            ).catch(error => res.send(JSON.parse(ApiUtil.cleanStringify(error))))


                        }else{
                            res.send('request recorded but didnt redirect ude to auto redirect is false')

                        }
                    }
                )
            })
        }else{

        }
    })

})
webHookRouter.all('/:id', (req, res) => {
    //check if url exist
    webHookSchema.findOne({url: req.params.id}, (err, webHook) => {
        // if db err send back
        if (err) {res.json({err: err})}
        //check if find  the  url
        if (webHook) {
            //if find the url store the request to record collection
            recordSchema.create({
                url: req.params.id,
                body: req.body,
                type: req.method,
                header: req.headers,
            }, (err, newRecord) => {
                //if db err send back
                if (err) {
                    res.json({err: err})
                }

                //if no err send back updated collection by socket
                recordSchema.find({url: req.params.id}).exec((err, records) => {
                        req.io.sockets.to(req.params.id).emit(PASS_UPDATED_RECORDS_TO_CLIENT_SIDE, records)
                        if (webHook.autoRedirect === true) {
                            axios.defaults.headers.common['Content-Type'] = webHook.contentType
                            axios(
                                {
                                    headers: {
                                        Authorization: ENV.redirectDefaultAuthorization,
                                    },
                                    method: webHook.httpMethod === 'default' ? newRecord.type : webHook.httpMethod,
                                    data: newRecord.body,
                                    url: webHook.redirectPath,
                                }
                            ).then(response =>{
                                    res.send(JSON.parse(ApiUtil.cleanStringify(response)))

                                }
                            ).catch(error => res.send(JSON.parse(ApiUtil.cleanStringify(error))))


                        }else{
                            res.send('request recorded but didnt redirect ude to auto redirect is false')

                        }
                    }
                )
            })
        }else{

        }
    })

})


export default webHookRouter







