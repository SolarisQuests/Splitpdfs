import dotenv from 'dotenv';
dotenv.config(); // Initialize dotenv configuration

import express from 'express';
import fs from 'fs';
import path from 'path';


import { MongoClient, ObjectId } from 'mongodb';


import cors from "cors"
import cron from 'node-cron';
import axios from 'axios';

const app = express();
const port = 3011;
app.use(express.json());
app.use(cors())
dotenv.config();
const mongoUrl = process.env.MONGO_URI;
const mongoUrl2 = process.env.MONGO_URI2;
const dbName = 'Documenttask';
const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });


async function connectToMongo() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      
      console.log("Storage connected with fetched credentials");
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
  
  connectToMongo();



  app.get('/get-outputs', async (req, res) => {
    try {
      const db = client.db(dbName);
      const collection = db.collection('testing_ida');
      const outputs = await collection.find({}).toArray();
      res.status(200).json(outputs);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('An error occurred');
    }
  });


  app.get('/get-outputs-by-id', async (req, res) => {
    try {
      const db = client.db(dbName);
      const collection = db.collection('testing_ida');
      
      // Get the ID and index1 from query parameters
      const id = req.query.id;
      const index1 = parseInt(req.query.index1); // Parse index1 as an integer
  
      // Convert id to ObjectId
      const ObjectId1 = new ObjectId(id);
  
      // Find the document with the given ID
      const output = await collection.findOne({ _id: ObjectId1 });
  
      if (!output) {
        return res.status(404).send('Document not found');
      }
  
      // Ensure that split_documents exists and is an array
      if (output.split_documents && Array.isArray(output.split_documents)) {
        // Check if index1 is a valid index
        if (index1 >= 0 && index1 < output.split_documents.length) {
          const selectedDocument = output.split_documents[index1];
          console.log(output.split_documents[index1].start_page,output.split_documents[index1].end_page)

          const selectedDocument_img = output.image;
          //return res.status(200).json(selectedDocument); // Send only the filtered object 

          return res.status(200).json({
              document: selectedDocument,
              image: selectedDocument_img 
          });
        } else {
          return res.status(400).send('Invalid index');
        }
      } else {
        return res.status(400).send('split_documents not found or is not an array');
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send('An error occurred');
    }
  });
  





  app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);

});