const path = require("path");
const fs = require("fs");
const ChannelData =require('./models/channelData');
const imghash = require("imghash");
const fsp = fs.promises;
const leven = require("leven");

console.log("Image Scanner Started");

//passsing directoryPath and callback function
async function scanner() {
    // fs.readdir(directoryPath, async function (err, files) {

        console.log("Scanner Started");
        //handling error
        // if (err) {
        //     return console.log("Unable to scan directory: " + err);
        // }

        try {
                    const filename = 'ESPN_0073.jpg'

                    const hash1 = await imghash.hash(`./${filename}`, 12);
                    // leven(firstTableRow.hash_image, row.hash)
                    console.log(hash1, leven(hash1, '797000ff0cbd7e06'));

                    
     
            
        } catch (error) {
            console.log(error.message);
        }

}



scanner();