const { google } = require("googleapis");
require("dotenv").config();

const youtube = google.youtube("v3");

async function getChannelId() {
  try {
    const response = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      q: "@matty_cycling",
      type: "channel",
      part: "snippet",
    });

    const channel = response.data.items[0];
    console.log("Channel ID:", channel.id.channelId);
    console.log("Channel Title:", channel.snippet.title);
  } catch (error) {
    console.error("Error fetching channel ID:", error);
  }
}

getChannelId();
