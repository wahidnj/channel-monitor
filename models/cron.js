var cron = require('node-cron');
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzAxNzY2MDkwLCJleHAiOjE3MDQzNTgwOTB9.5MbPvbcjafGLLhmzgX4p5QfRRiiehYYXb6Q2IxHtT6Q";
const MatchData =require('../models/matchData');
const axios = require("axios");

cron.schedule('*/20 * * * * *', async () => {
  console.log('running a task every 20 second');

  try {

    const channel = await MatchData.findAll({limit: 20,
        where: {
          sync: 0
        },
        order: [['id', 'ASC']],
      });
    //   console.log(channel);
      if (channel === null) {
          console.log('Not found!');
      } else {
    
          console.log(channel.length);

          if(channel.length!=0){
            for (let index = 0; index < channel.length; index++) {

                const body = {data:{
                    image: channel[index].image,
                    box_id: channel[index].box_id ,
                    confidence: channel[index].distance ,
                    capture_time: channel[index].matched_time,
                    prediction: channel[index].prediction
                }};
        
                const response=await axios.post("http://128.199.176.47:1337/api/channels", body, {
                    headers: {
                    Authorization: "Bearer " + token,
                    },
                });
                if(response.status==200){
                    MatchData.update(
                        // Values to update
                        {
                            sync:  1
                        },
                        { // Clause
                            where: 
                            {
                                id: channel[index].id
                            }
                        }
                    ).then(count => {
                        console.log('Rows updated ' + count);
                    });
                }
            }
          }
          
      }
    
  } catch (error) {

    console.log(error.message);
    
  }

});
