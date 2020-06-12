const axios = require("axios");
const jsdom = require("jsdom");
const twilio = require("twilio");

const { JSDOM } = jsdom;
const accountSid = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;  
const client = twilio(accountSid, authToken);

module.exports = async (req, res) => {
  const url = process.env.HUBTEL_CAREER_URL

  try {
    const response = await axios.get(url);
    const data = response.data;
    const { window } = new JSDOM(data);
    const noPositionElement = window.document.querySelector(".BambooHR-ATS-board .blankState");

    if (noPositionElement === null) {
      
      const messageId = await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.DESTINATION_PHONE_NUMBER,
        body: process.env.OUTGOING_MESSAGE_BODY
      });
      res.json({
        status: "Position availability message sent",
      });
    } else {
      const noPositionAvailableContent = noPositionElement.textContent.replace(/[\n\t]/g, " ").replace(/\s{2,}/g, " ").trim();
      res.json({
        status: noPositionAvailableContent
      })
    }

    

  } catch (error) {
    console.log(error.message);
  }
  
  }