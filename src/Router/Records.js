import express from 'express'
import crypto from 'crypto'
import webHookSchema from '../Model/WebHook'
import recordSchema from '../Model/Records'

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




export default records