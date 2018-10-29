import express from 'express'
import recordSchema from '../Model/Records'
import webHookSchema from "../Model/WebHook";

const bcrypt = require('bcryptjs')
const passport = require('passport')

const records = express.Router();

records.get('/:id', (req, res) => {
    recordSchema.find({url: req.params.id}, (err, records) => {
        if (err) res.send(err)

        res.send(records)
        //organize the data suitable to date and send a object keys be name, values be times

    })
})


records.post('/:id', (req, res) => {
    webHookSchema.findOne({url: req.params.id}, (err, webHook) => {
        req.body.contentType ? webHook.contentType = req.body.contentType : null
        req.body.redirectPath ? webHook.redirectPath = req.body.redirectPath : null
        req.body.httpMethod ? webHook.httpMethod = req.body.httpMethod : null
        webHook.save();
        res.send(webHook)
    })
})


export default records