const path = require("path");
const fs = require("fs");
const ChannelData =require('../models/channelData');
const imghash = require("imghash");
const fsp = fs.promises;

console.log("Image Scanner Started");

//joining path of directory
const directoryPath = path.join(__dirname, "image3");
//passsing directoryPath and callback function
async function scanner() {
    // fs.readdir(directoryPath, async function (err, files) {

        console.log("Scanner Started");
        //handling error
        // if (err) {
        //     return console.log("Unable to scan directory: " + err);
        // }

        try {

            const files = await fsp.readdir(directoryPath);
            await Promise.all(files.filter((item, idx) => idx < 300).map(async (filename) => {
                    const hash1 = await imghash.hash(`./image3/${filename}`);
                    let extractedString = filename.split('_')[0].toLowerCase();
                    console.log(hash1,extractedString);
                    if(hash1){
                        const result=await postData(hash1,filename,extractedString);
                        console.log(result.hash_image+" : "+result.image);
                        const filePath= `./image3/${result.image}`;
                        if(result){
                            // Check if the file exists
                            if (fs.existsSync(filePath)) {
                                // Delete the file
                                fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error('Error deleting the file:', err);
                                } else {
                                    console.log('File deleted successfully');
                                }
                                });
                            } else {
                                console.log('File not found');
                            }
                            // fs.rename(
                            //     "./image3/" + filename,
                            //     "image3_old/" + filename,
                            //     function (err) {
                            //         if (err) throw err;
                            //         // console.log("Successfully renamed - AKA moved!");
                            //     }
                            // );
                        }
                        
                    }else{
                        console.log("NO HASH",filename);
                    }
                    
            }));     
            
        } catch (error) {
            console.log(error.message);
        }

}

async function postData(result,file,name)  {

    try {

      const channel= await ChannelData.create({
          "hash_image":String(result),
          "image": file,
          "channel_name":name
      });
      return channel;
    } catch (err) {
      console.log(err.message);
    }
}

setInterval(scanner, 10000);