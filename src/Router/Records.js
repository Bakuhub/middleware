import express from 'express'
import recordSchema from '../Model/Records'
import webHookSchema from "../Model/WebHook";
import * as ApiUtil from "../ApiUtil/ApiUtil";
import axios from "axios/index";
import * as ENV from "../Constants/ENV";

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


recordsRouter.get('/manuallyRedirect/:requestId', (req, res) => {
    //check if url exist
    recordSchema.findById(req.params.requestId, (err, record) => {
            if (err) res.send(err)
            webHookSchema.findOne({url: record.url}).exec((err, webHook) => {
                axios.defaults.headers.common['Content-Type'] = webHook.contentType

                axios(
                    {
                        headers: {
                            Authorization: ENV.redirectDefaultAuthorization,
                        },
                        method: webHook.httpMethod === 'default' ? record.type : webHook.httpMethod,
                        data: record.body,
                        url: webHook.redirectPath,
                    })
                    .then(response => res.send(JSON.parse(ApiUtil.cleanStringify(response))))
                    .catch(err => res.send(JSON.parse(ApiUtil.cleanStringify(err))))


            })
        }
    )
})
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