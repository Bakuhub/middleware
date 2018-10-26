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
                    res.send(id);
                }
            });

        })
    }
    generatedUrl()

})
webHook.all('/:id', (req, res) => {
    webHookSchema.findOne({url: req.params.id}, (err, record) => {
        if (err) {
            console.log(err)
        }
        if (record) {
            recordSchema.create({
                url: req.params.id,
                body: req.body,
                type: req.method,
                header: req.headers,
            }, (err, newRecord) => {
                if (err) {
                    res.send('db err' + err);
                } else {
                    recordSchema.find({url: req.params.id}).exec((err, records) =>
                        req.io.sockets.to(req.params.id).emit('sending_feed_to_another_site', records
                        )
                    )
                    res.send(newRecord)

                }
            })
        } else {
            res.send(record)
        }
    })

})


export default webHook







