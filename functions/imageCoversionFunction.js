/**
 * @fileoverview This file includes functions to handle image
 * processing and conversion for a web service built with Express
 * and Firebase Functions. Applause image links are received and
 * downloaded. This Cloud Function is needed to operate the
 * Presenation Creator in order to generate Audit 3.0 reports.
 * @author Lucas Sadilek
 * @role Test Engineer III / Automation Lead
 */

const functions = require("firebase-functions");
// const {setGlobalOptions} = require("firebase-functions/v2");
// const {onRequest} = require("firebase-functions/v2/https");

const express = require("express");
const fetch = require("node-fetch");
const Jimp = require("jimp");
const cors = require("cors");
const app = express();

app.use(cors({origin: true}));
app.use(express.json());

// setGlobalOptions({memory: "512MB", timeoutSeconds: 540});

/*
    This function is called when the user visits the endpoint
    It does not rely on Puppeteer Cluster
*/

// helper function to fetch an image and convert it to base64
const fetchAndConvertImageToBase64 = async (url) => {
  const response = await fetch(url);
  const buffer = await response.buffer();
  return buffer;
};

app.get("/api/", (req, res) => {
  res.json({"message": "Image conversion cloud function for deckapp."});
});

// the function that will be called when the user visits the endpoint
app.post("/api/urlToBase64", async (req, res) => {
  const imageUrl = req.body.image_url;

  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).json({error: "image_url must be a string"});
  }

  try {
    const imageBuffer = await fetchAndConvertImageToBase64(imageUrl);
    const base64Image = imageBuffer.toString("base64");
    const image = await Jimp.read(imageBuffer);
    const mimeType = image.getMIME(); // Get the MIME type of the image

    res.json({
      base64_image: `data:${mimeType};base64,${base64Image}`,
      width: image.bitmap.width,
      height: image.bitmap.height,
    });
  } catch (error) {
    res.status(500)
        .json({error: `Error fetching or converting image: ${error.message}`});
  }
});

exports.api = functions.runWith({memory: "512MB", timeoutSeconds: 540})
    .https.onRequest(app);
