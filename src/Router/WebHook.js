import express from 'express'
import crypto from 'crypto'
import webHookSchema from '../Model/WebHook'
import recordSchema from '../Model/Records'

const bcrypt = require('bcryptjs')
const passport = require('passport')

const webHook = express.Router();

// Login Form
webHook.get('/', function (req, res) {
    const generatedUrl = () => {
        const id = crypto.randomBytes(20).toString('hex');
        webHookSchema.findOne({url: id}, (err, records) => {
            (records) ? generatedUrl() : webHookSchema.create({url: id}, function (err, records) {
                if (err) {
                    res.send('db err' + err);
                } else {
                    res.send('your webhook is http://localhost:4000/test/' + id);
                }
            });

        })
    }
    generatedUrl()

})
webHook.all('/:id', (req, res) => {
    console.log(req.body)
    webHookSchema.findOne({url: req.params.id}, (err, records) => {
        if (err) {
            console.log(err)
            res.send(err.toString())
        }
        if (records) {
            recordSchema.create({
                url: req.params.id,
                body: req.body,
                type: req.method,
                header: req.headers,
            }, (err, records) => {
                if (err) {
                    res.send('db err' + err);
                } else {
                    res.send(records)

                }
            })
        } else {
            res.send(records)
        }
    })

})


export default webHook







