var cron = require('node-cron');
const ChannelData =require('../models/channelData');
const MatchData =require('../models/matchData');
const TRP =require('../models/trp');
const leven = require("leven");
const Sequelize = require('sequelize');
const Op = Sequelize.Op; // Import Sequelize's operators

// Function to fetch data from the first table
const fetchDataFromFirstTable = async () => {
    try {
      const twentyMinutesAgo = new Date(new Date() - 20 * 60 * 1000); // Calculate the timestamp for 20 minutes ago

      const data = await ChannelData.findAll({
        attributes: ['id','hash_image','channel_name','created_at','image'],
        where: {
          created_at: {
            [Op.gte]: twentyMinutesAgo // Using Sequelize's greater than or equal (>=) operator
          }
        },
        order: [['id', 'DESC']],
        // limit: 5,
        raw:true
      });
      //   return data.map((row) => row.hash_image);
      return data;
    } catch (error) {
      throw new Error('Error fetching data from first table:', error);
    }
};
  
// Function to fetch data from the second table and compare hashes
const compareHashes = async () => {
    try {
        const firstTableHashes = await fetchDataFromFirstTable();

        // Calculate the time 5 minutes ago from the current time
        const fiveMinutesAgo = new Date(new Date() - 5 * 60 * 1000);
        const secondTableData = await TRP.findAll({
            attributes: ['id','hash','created_at','created_time'],
            where: {
                sync: 0,
                created_time: {
                  [Op.lte]: fiveMinutesAgo
                }
            },
            order: [['id', 'ASC']],
            limit: 100, // Set the limit to 100
            raw: true
        });

        // console.log(secondTableData);

        for (const row of secondTableData) {
            const closestMatches = firstTableHashes.filter(firstTableRow => leven(firstTableRow.hash_image, row.hash) < 5);
            
            if (closestMatches.length > 0) {
                const minDistance = Math.min(...closestMatches.map(item => leven(item.hash_image, row.hash)));
                const closestMatch = closestMatches.find(item => leven(item.hash_image, row.hash) === minDistance);

                console.log(`Matching hash for ${row.hash}:`, closestMatch, `image name:`, row.created_at);
                console.log(`Levenshtein distance: ${minDistance}`);

                const insertData= await MatchData.create({
                  "image": closestMatch.image,
                  "box_id": "108",
                  "distance": minDistance,
                  "matched_time": row.created_at,
                  "prediction": closestMatch.channel_name
                });
                // Perform actions with the closest matching hash
            } else {
                console.log(`Match not found for ${row.hash}`, `image name:`, row.created_at);
            }
            await TRP.update({ sync: 1 }, { where: { id: row.id } });
        }

    } catch (error) {
      throw new Error('Error comparing hashes:', error.message);
    }
};

cron.schedule('*/20 * * * * *', async () => {
  console.log('running a task every 5 second');

  try {
    await compareHashes();
    // Perform other operations if needed
  } catch (error) {
    console.error(error);
  }

});