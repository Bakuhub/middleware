import express from 'express'
import crypto from 'crypto'
import webHookSchema from '../Model/WebHook'
import recordSchema from '../Model/Records'
import * as ApiUtil from '../ApiUtil/ApiUtil'
import * as ENV from '../Constants/ENV'
import {PASS_UPDATED_RECORDS_TO_CLIENT_SIDE,} from '../Constants/actionType'
import axios from 'axios'

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
        console.log(webHook)
        // if db err send back
        if (err) {
            res.json({err: err})
        }
        res.send({
            "redirectPath": webHook.redirectPath?webHook.redirectPath:'',
            "contentType": webHook.contentType?webHook.contentType:'',
            "httpMethod": webHook.httpMethod?webHook.httpMethod:'',


        })
        //check if find  the  url

    })
)
//listen for all url
webHookRouter.all('/:id', (req, res) => {
    //check if url exist
    webHookSchema.findOne({url: req.params.id}, (err, webHook) => {
        // if db err send back
        if (err) {
            res.json({err: err})
        }
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

                        axios.defaults.headers.common['Content-Type'] = ENV.redirectDefaultContentType
                        axios.defaults.baseURL = ENV.redirectDefaultBaseUrl
                        axios(
                            {
                                headers: {
                                    Authorization: ENV.redirectDefaultAuthorization,
                                },
                                method: webHook.httpMethod,
                                data: newRecord.body,
                                url: webHook.redirectPath,
                            }
                        ).then(response => {
                            res.send(JSON.parse(ApiUtil.cleanStringify(response)))
                        }).catch(error => {
                                res.send(JSON.parse(ApiUtil.cleanStringify(error)))
                            }
                        )

                    }
                    //todo('if the redirect is valid redirect it ')

                )
            })
        }
    })

})


export default webHookRouter







