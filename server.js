const express = require('express')
const bodyParser= require('body-parser')
const { MongoClient } = require('mongodb')
const app = express()

// DOT ENV Configuration
require('dotenv').config()

MongoClient.connect(process.env.DB_STRING, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
    
        app.set('view engine', 'ejs') // tells express we're using ejs as template engine
        app.use(express.static('public'))
        app.use(bodyParser.json())
    
        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))
        
        // Handlers
        // CRUD - READ 
        app.get('/', (req, res) => {
            quotesCollection.find({}).toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
        })

        // CRUD - CREATE 
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        // CRUD - UPDATE
        app.put('/quotes', (req, res) => {
                quotesCollection.findOneAndUpdate(
                    { name: 'Yoda' },
                    {
                        $set: {
                            name: req.body.name,
                            quote: req.body.quote
                        }
                    },
                    { upsert: true }
                )
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        // CRUD - DELETE 
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
                .then(result => {
                    if (result.deletedCount === 0){
                        console.log('No quote to delete')
                        return res.json('No quote to delete')
                    }
                    console.log('Deleted quote')
                    res.json("Deleted Darth Vadar's quote")
                })
                .catch(error => console.error(error))
        })
        
        app.listen(process.env.PORT || PORT, () => {
            console.log(`Listening on PORT ${process.env.PORT}`)
        })
    })
    .catch(error => console.error(error))
