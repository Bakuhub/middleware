import express from 'express'
import crypto from 'crypto'
import webHookSchema from '../Model/WebHook'
import recordSchema from '../Model/Records'
import {PASS_UPDATED_RECORDS_TO_CLIENT_SIDE,} from '../Constants/actionType'

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
//listen for all url
webHookRouter.all('/:id', (req, res) => {
    //check if url exist
    webHookSchema.findOne({url: req.params.id}, (err, webHook) => {
        // if db err send back
        if (err) {
            res.json({err:err})
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

                    res.json({err:err})
                } else {
                    //if no err send back updated collection by socket
                    recordSchema.find({url: req.params.id}).exec((err, records) => {
                            req.io.sockets.to(req.params.id).emit(PASS_UPDATED_RECORDS_TO_CLIENT_SIDE, records)
                        }
                        //todo('if the redirect is valid redirect it ')
                    )
                    res.send(newRecord)
                }
            })
        } else {
            res.send('dont have such records')
        }
    })

})


export default webHookRouter







