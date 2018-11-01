import express from 'express'
import recordSchema from '../Model/Records'
import webHookSchema from "../Model/WebHook";
import {redirectRecordToWebsite} from "../Controller/Redirect";

const bcrypt = require('bcryptjs')
const passport = require('passport')

const recordsRouter = express.Router();

recordsRouter.get('/:id', (req, res) => {
    recordSchema.find({url: req.params.id}, (err, records) => {
        if (err) res.send(err)

        res.send(records)
        //organize the data suitable to date and send a object keys be name, values be times

    })
})


recordsRouter.get('/manuallyRedirect/:requestId', (req, res) =>
    recordSchema.findOne({_id: req.params.requestId}).exec().then((record) => {
        // if db err send back
        webHookSchema.findOne({url: record.url}).exec().then((webHook) => {
            console.log(redirectRecordToWebsite(webHook, record))
            res.send(redirectRecordToWebsite(webHook, record))
        }).catch(err => res.send({err: err}))
        //check if find  the  url
    }).catch(err => res.send({err: err})))

recordsRouter.post('/:id', (req, res) => {
    webHookSchema.findOne({url: req.params.id}, (err, webHook) => {
        req.body.contentType ? webHook.contentType = req.body.contentType : null
        req.body.redirectPath ? webHook.redirectPath = req.body.redirectPath : null
        req.body.httpMethod ? webHook.httpMethod = req.body.httpMethod : null
        webHook.autoRedirect = req.body.autoRedirect

        webHook.save();
        res.send(webHook)
    })
})


export default recordsRouter