const Message = require("../models/message");
const axios = require("axios");
const User = require("../models/user");
const Asterisk = require("../models/asterisk_codes");
const nodemailer = require("nodemailer");
const GoodKnights = require("../models/goodKnight");
const GoodKnightLogs = require("../models/goodknightLogs");
const TRP = require("../models/trp");
const redis = require("redis");
const client = redis.createClient();

const ioredis = require("ioredis");
const redisio = new ioredis();

const encryptionMap = {
  '0': 'WXYZ',
  '1': 'UVWX',
  '2': 'PQRS',
  '3': 'JKLM',
  '4': 'DEFG',
  '5': 'HIJK',
  '6': 'LMNO',
  '7': 'ABCD',
  '8': 'QRST',
  '9': 'EFGH'
};

module.exports = {

  info: async (req, res, next) => {
    try {
      res.send("hello");
    } catch (err) {
      console.log(err.message);
    }
  },

  trpData: async (req, res, next) => {
    try {
      console.log(req.body);
      res.status(200).json({ message: "Successfully executed the command" });
    } catch (error) {
      res.status(400).json({ message: "Error in switching device" });
    }
  },

  message_postInfo: async (req, res, next) => {
    console.log(req.body.message);
    res.json({ message_id: "897456123" });
  },

  message_getInfo: async (req, res, next) => {
    console.log(req.query);
    res.json({ message_id: "12345678" });
  },

  vendorSms: async (req, res, next) => {
    try {
      console.log(req.query);
      res.status(200).json({ status: true });
    } catch (error) {
      res.status(500).json({ status: false });
    }
  },

  gkCheck: async (req, res, next) => {
    try {
      console.log(req.query);
      const check = await GoodKnights.findOne({
        where: {
          id: 1,
        },
        raw: true,
      });
      res.status(200).json({ status: check.status });
    } catch (error) {
      res.status(500).json({ status: false });
    }
  },

  gkData: async (req, res, next) => {
    try {
      console.log(req.body);
      const insert = await GoodKnightLogs.create({
        user: "CCL",
        uptime: req.body.HeartBeat,
      });

      GoodKnights.update({ uptime: req.body.GoodKnight }, { where: { id: 1 } })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
      // console.log(insert);
      res.status(200).json({ status: true });
    } catch (error) {
      res.status(500).json({ status: false });
    }
  },
  gkTotal: async (req, res, next) => {
    try {
      const count = await GoodKnightLogs.count({
        where: { uptime: 1 },
      });
      res.status(200).json({ count: count });
    } catch (error) {
      res.status(500).json({ status: false });
    }
  },

  gkStatus: async (req, res, next) => {
    try {
      console.log(req.body);
      GoodKnights.update({ status: req.body.command }, { where: { id: 1 } })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
      res.status(200).json({ message: "Successfully executed the command" });
    } catch (error) {
      res.status(500).json({ message: "Error in switching device" });
    }
  },

  channelData: async (req, res, next) => {
    try {
      const { hash, created_at } = req.body;

      if (!hash || !Array.isArray(hash) || !created_at || !Array.isArray(created_at)) {
        return res.status(400).json({ error: 'Both "hash" and "created_at" should be arrays.' });
      }
    
      // Process the data as needed
      // For example, you can log the received arrays
      console.log(new Date());
      console.log('Received "hash" array:', hash);
      console.log('Received "created_at" array:', created_at);

        // Assuming YourModel is your Sequelize model
      for (let i = 0; i < hash.length; i++) {
        const singleHash = hash[i];
        const singleCreatedAt = created_at[i];

        // Create individual records for each element pair
        await TRP.create({
          hash: singleHash,
          created_at: singleCreatedAt,
        });
      }
    
      // Respond with a success message
      res.json({ message: 'Data received successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  mail: async (req, res, next) => {
    console.log(req.params.email);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wahid@cloud-coder.com",
        pass: "wahid@#@#@#3839306",
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    var message = {
      from: "wahid@cloud-coder.com",
      to: req.params.email,
      subject: "Termporary Password",
      text: `Your temporary password is ${req.params.password}`,
    };
    transporter.sendMail(message, function (err, info) {
      if (err) {
        console.log(err.message);
        res.status(401).json({ message_id: "error" });
      } else {
        console.log("success");
        res.status(200).json({ message_id: "12345678" });
      }
    });
  },

  voice: async (req, res, next) => {
    try {
      var parts = req.body.msg_id.split("__", 2);
      var msg_id = parts[0];
      var customer_id = parts[1];
      // console.log(req.body.msg_id.split(/__(.*)/)[0]);
      var code_casue = req.body.hangup_cause;
      var phone = req.body.destination;
      const dial_status = req.body.dial_status;
      const ip_address = req.body.retry_ip;

      console.log(
        "HAngupcause: " + code_casue + " result: " + dial_status,
        msg_id,
        new Date(),
        "user",
        customer_id
      );

      var delivery_outbox_message = await getRedisOutboxMessage(
        msg_id,
        customer_id
      );

      console.log(delivery_outbox_message);

      async function getRedisOutboxMessage(message_id, customer_id) {
        return new Promise((resolve, reject) => {
          return client.exists(
            "deliveryOutbox_" + customer_id + "_" + message_id,
            function (err, reply) {
              if (reply === 1) {
                client.hgetall(
                  "deliveryOutbox_" + customer_id + "_" + message_id,
                  function (err, object) {
                    resolve(object);
                  }
                );
              } else {
                resolve(null);
              }
            }
          );
        });
      }

      async function getWebAPIKey() {
        return new Promise((resolve, reject) => {
          return client.exists('apiKeyIndex',
            function (err, reply) {
              if (reply === 1) {
                client.get('apiKeyIndex',
                  function (err, object) {
                    resolve(object);
                  }
                );
              } else {
                resolve(null);
              }
            }
          );
        });
      }

      async function getAsteriskCode(code_casue) {
        return new Promise((resolve, reject) => {
          return client.smembers("asterisk", (err, members) => {
            if (err) {
              console.error(err);
            } else {
              members.forEach((member) => {
                const arr = JSON.parse(member);
                // search for the value 'b' in the array
                if (arr && arr.asterisk_value === code_casue) {
                  resolve(arr);
                }
              });
              resolve(null);
            }
          });
        });
      }

      async function encryptNumber(number) {
        const digits = number.toString().split('');
        let encrypted = '';
      
        for (const digit of digits) {
          if (encryptionMap[digit]) {
            encrypted += encryptionMap[digit];
          } else {
            encrypted += digit; // If digit not found in map, keep it as is
          }
        }
      
        return encrypted;
      }

      async function webLinkAPI(message, destination, retryCall, messageId, customerId) {
          try {
            var error_codes = "";
            var state = 3;
            let encryptedNumber = await encryptNumber(message);
            const randomURL = await getRandomURL();
            // const encryptedUrl = randomURL + '?message=' + encryptedNumber;
            var encryptedUrl = `আপনার জন্য লিংক হলো ${randomURL}?message=${encryptedNumber}`;
            // console.log(encryptedUrl);
            const apiData = [
              {
                apiKey: "0dc125109baba207361080bf88133468693ed974",
                sender_id: "8809601010507",
              },
              {
                apiKey: "b85d271b9e98ff41e93ef013bafdb4e7373f0359",
                sender_id: "8809601002710",
              },
            ];
            const apiIndex = await getWebAPIKey();
            
            const currentIndex = apiIndex ? parseInt(apiIndex) : 0;
            const currentApiData = apiData[currentIndex];
            const apiKey = currentApiData.apiKey;
            const weblinkBody = {
              sender_id: currentApiData.sender_id,
              receiver: destination,
              message: encryptedUrl,
              remove_duplicate: true
            };
            // Add the authorization header with your API key here
            // const apiKey = "0dc125109baba207361080bf88133468693ed974"; // Replace with your actual API key
            const axiosConfig = {
              method: 'post',
              url: "https://sysadmin.muthobarta.com/api/v1/send-sms",
              data: weblinkBody,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${apiKey}`,
              },
            };
            const webResponse = await axios(axiosConfig);

            console.log(currentIndex, "WEBLINK", currentApiData);
            const nextIndex = (currentIndex + 1) % apiData.length;
            await client.set('apiKeyIndex', nextIndex.toString())
            
            if(webResponse.data.code === 200){
              console.log("WEBLINK success", webResponse.data.code);
              await messageInfo(retryCall, messageId, error_codes, state, 1, customerId, 1);
              res.json({ message: "Voice SMS Hangup is Success" });
            }else{
              console.log('WEBLINK FAILED ERROR',webResponse.data.code);
              await messageInfo(retryCall, messageId, `WEBLINK FAILED ERROR ${webResponse.data.code}`, 2, 1, customerId, 1);
              res.json({ message: "Voice SMS Hangup is Failed" });
            }
          } catch (webError) {
            console.log("WEBLINK ERROR", webError.message);
            var error_codes = webError.message;
            var state = 2;
            // Handle the error from the HTTP POST request here
            // You can log the error message or take other actions
            await messageInfo(retryCall, messageId, error_codes, state, 1, customerId, 1);
            res.json({ message: webError.message });
          }
      }

      // Function to select a random URL from the array
      async function getRandomURL() {
        // An array of URLs
        
        var urlArray = [
          "https://sms-view.socketi.workers.dev/",
          // Add more URLs as needed
        ];
        // urlArray = urlArray.split(',');
        var randomIndex = Math.floor(Math.random() * urlArray.length);
        return urlArray[randomIndex];
      }

      if (delivery_outbox_message) {
        const code_reason = await getAsteriskCode(code_casue);
        var retry = parseInt(delivery_outbox_message.retry_call);
        if (code_reason) {
          if (dial_status == "ANSWER" && code_casue == 16) {
            var error_codes = "";
            var state = 3;

            await messageInfo(
              retry,
              msg_id,
              error_codes,
              state,
              1,
              customer_id,
              0
            );
            res.json({ message: "Voice SMS Hangup is Success" });
          } else {
            if (delivery_outbox_message.retry_call <= 4) {
              if(delivery_outbox_message.retry_call == 1){
                await webLinkAPI(delivery_outbox_message.message, phone, retry, msg_id, customer_id);
              }else{
                const retry_call = parseInt(retry) + 1;
                try {
                  if (retry_call === 5) {
                    phone = "11" + phone;
                  }
                  var get_repsonse = await axios.get(
                    `http://${ip_address}/voiceSms/api/voice.php?phone=${phone}&code=${delivery_outbox_message.message}&from=cloudsms&msg_id=${req.body.msg_id}&ip=128.199.176.47`
                  );

                  if (get_repsonse.status == 200) {
                    var error_codes =
                      "Error:" + code_casue + " " + code_reason.defination;
                    var state = 2;
                    await messageInfo(
                      retry_call,
                      msg_id,
                      error_codes,
                      state,
                      0,
                      customer_id,
                      0
                    );
                    res.json({ message: "Voice SMS Hangup is Failed" });
                  }
                } catch (error) {
                  console.log(error.message);
                  await messageInfo(
                    retry_call,
                    msg_id,
                    error.message,
                    state,
                    1,
                    customer_id,
                    0
                  );
                  res.json({ message: "Voice SMS Hangup is Failed" });
                }
              }
              
            } else if (dial_status == "BUSY" && code_casue == 21) {
              var error_codes =
                "Error:" + code_casue + " " + code_reason.defination;
              var state = 3;
              await messageInfo(
                retry,
                msg_id,
                error_codes,
                state,
                1,
                customer_id,
                0
              );
              res.json({ message: "Voice SMS Hangup is Success" });
            } else {
              var error_codes =
                "Error:" + code_casue + " " + code_reason.defination;
              var state = 2;
              await messageInfo(
                retry,
                msg_id,
                error_codes,
                state,
                1,
                customer_id,
                0
              );
              res.json({ message: "Voice SMS Hangup is Failed" });
            }
          }
        } else {
          await webLinkAPI(delivery_outbox_message.message, phone, retry, msg_id, customer_id);
        }
      } else {
        console.log("Message Id is Incorrect");
        res.json({ message: "Message Id is Incorrect" });
      }
    } catch (error) {
      console.log(error.message);
      res.json({ message: error.message });
    }

    async function messageInfo(
      retry_call,
      message_id,
      error_codes,
      state,
      deliv,
      customer_id,
      weblink
    ) {
      try {
        if (deliv == 1) {
          await client.hmset(
            "deliveredMessage_" + customer_id + "_" + message_id,
            {
              retry_call: retry_call,
              error_codes: error_codes,
              status: state,
              updated_at: new Date(),
              user_id: customer_id,
              msg_id: message_id,
              delivery_confirmation: 1,
              customer_confirmation: 0,
              weblink : (weblink == 1) ? weblink : 0 
            }
          );
          var data = {
            id: "deliveredMessage_" + customer_id + "_" + message_id,
          }
          
          const event = "deliver_sm";

          redisio.publish(`Customer-${customer_id}`, JSON.stringify({ event, data }), async (err, result) => {
            if (err) {
              console.error('Error publishing message:', err.message);
          
            } else {
              console.log(result);
              if (result > 1) {
                console.error(`Send For Delivering SM to Customer-${customer_id}`);
              } else {
                console.log('Message was published, but there were no subscribers.');
               
              }
            }
          });
          await client.del(
            "deliveryOutbox_" + customer_id + "_" + message_id,
            function (err, response) {
              if (err) {
                console.error(err.message);
              }
            }
          );
        } else {
          await client.hmset(
            "deliveryOutbox_" + customer_id + "_" + message_id,
            {
              retry_call: retry_call,
              error_codes: error_codes,
              delivery_confirmation: deliv,
              status: state,
              updated_at: new Date(),
            }
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  },

  custom: async (req, res, next) => {
    // console.log(req.body);

    try {
      const resp = await axios(
        `http://178.128.111.191/voiceSms/api/voice.php?phone=8801701083759&code=123456&from=01701083759&msg_id=8ebda974-e6ba-431b-a765-2cf07fefe3c2&ip=128.199.176.47`
      );

      if (resp.status === 200) {
        console.log("success");
        res.status(200).json({ message_id: "12345678" });
      } else {
        console.log("failed response");
        res.status(500).json({ message_id: "12345678" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message_id: "12345678" });
    }
  },

  smppBulk: async (req, res, next) => {
    const port = req.params.port;
    const system_id = req.params.system_id;
    const password = req.params.password;
    const destination_addr = req.params.destination_addr;
    const source_addr = req.params.source_addr + "++";
    const short_message = req.params.message;

    const destination_addr_arr = destination_addr.split(",");
    console.log(destination_addr_arr.length);

    // smpp client start
    var smpp = require("smpp");
    var session = smpp.connect({
      url: `smpp://206.189.42.38:${port}`,
      auto_enquire_link_period: 10000,
    });
    session.bind_transceiver(
      {
        system_id: system_id,
        password: password,
      },
      function (pdu) {
        if (pdu.command_status == 0) {
          // Successfully bound
          console.log("bound successfully.....");
          res.json({ message: "Message Sending in Progress" });

          destination_addr_arr.map((element, i) => {
            if (destination_addr_arr.length === i + 1) {
              // last one
              session.submit_sm(
                {
                  destination_addr: element,
                  source_addr: source_addr,
                  message_payload: short_message,
                  source_addr_npi: 1,
                  source_addr_ton: 0,
                },
                function (pdu) {
                  if (pdu.command_status == 0) {
                    // Message successfully sent
                    console.log(pdu.message_id);
                    session.close();
                  }
                }
              );
            } else {
              // not last one
              session.submit_sm(
                {
                  destination_addr: element,
                  source_addr: source_addr,
                  message_payload: short_message,
                  source_addr_npi: 1,
                  source_addr_ton: 0,
                },
                function (pdu) {
                  if (pdu.command_status == 0) {
                    // Message successfully sent
                    console.log(pdu.message_id);
                  }
                }
              );
            }
          });

          // for (let index = 0; index < destination_addr_arr.length; index++) {
          //   const element = destination_addr_arr[index];
          // }
        }
      }
    );
    // smpp client end
  },

  smppConnect: async (req, res, next) => {
    const port = req.params.port;
    const system_id = req.params.system_id;
    const password = req.params.password;
    const destination_addr = req.params.destination_addr;
    const source_addr = req.params.source_addr + "++";
    const short_message = decodeURIComponent(
      req.params.message.replace(/\+/g, " ")
    );
    const source_npi = req.params.source_npi;
    const source_ton = req.params.source_ton;

    console.log(short_message);

    // if(port=="" || system_id=="" || password=="" || destination_addr =="" || short_message==""){
    //   res.send("require parameters are not fupllpilled.....");
    // }
    console.log(req.params);

    // smpp client start
    var smpp = require("smpp");
    var session = smpp.connect({
      // url: 'smpp://127.0.0.1:2775',
      url: `smpp://128.199.176.47:${port}`,
      auto_enquire_link_period: 10000,
    });
    session.bind_transceiver(
      {
        system_id: system_id,
        password: password,
      },
      function (pdu) {
        if (pdu.command_status == 0) {
          // Successfully bound
          console.log("bound successfully.....");
          session.submit_sm(
            {
              destination_addr: destination_addr,
              source_addr: source_addr,
              message_payload: short_message,
              source_addr_npi: source_npi,
              source_addr_ton: source_ton,
            },
            function (pdu) {
              if (pdu.command_status == 0) {
                // Message successfully sent
                console.log(pdu.message_id);
                res.send(pdu.message_id);

                session.close();
              }
            }
          );
        }
      }
    );
    // smpp client end
  },

  httpQuery: async (req, res, next) => {
    console.log(req.query.api_key);

    const users = await User.findOne({
      where: {
        api_key: req.query.api_key,
      },
    });

    if (users) {
      const message = await Message.findOne({
        where: {
          msg_id: req.query.msg_id,
        },
      });
      if (message.status == 3) {
        res.json({
          statusCode: message.status,
          status: "Delivered",
          msg_id: req.query.msg_id,
          rate: message.c_rate,
          source_addr: message.source_phone,
          destination_addr: message.phone_number,
          method: message.method,
        });
      } else if (message.status == 2) {
        res.json({
          statusCode: message.status,
          status: message.error_codes,
          msg_id: req.query.msg_id,
          source_addr: message.source_phone,
          destination_addr: message.phone_number,
          method: message.method,
        });
      }
    } else {
      res.json({ error: "Api key is Invalid" });
    }
  },

  firewall: async (req, res, next) => {
    try {
      console.log(req.query);
      res.send("RECEIVED");
    } catch (err) {
      console.log(err.message);
      res.send("ERROR");
    }
  },
  
};
