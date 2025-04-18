require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const youtube = google.youtube("v3");

// Get channel ID from username
async function getChannelId(username) {
  try {
    const response = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      q: username,
      type: "channel",
      part: "snippet",
    });

    if (response.data.items.length > 0) {
      return response.data.items[0].id.channelId;
    }
    return null;
  } catch (error) {
    console.error("Error getting channel ID:", error);
    return null;
  }
}

// Get recent uploads from channel
async function getRecentUploads(channelId) {
  try {
    // First, get the uploads playlist ID
    const channelResponse = await youtube.channels.list({
      key: process.env.YOUTUBE_API_KEY,
      id: channelId,
      part: "contentDetails",
    });

    const uploadsPlaylistId =
      channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // Then get the videos from the uploads playlist
    const playlistResponse = await youtube.playlistItems.list({
      key: process.env.YOUTUBE_API_KEY,
      playlistId: uploadsPlaylistId,
      part: "snippet",
      maxResults: 10,
    });

    return playlistResponse.data.items.map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.high?.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error("Error getting recent uploads:", error);
    return [];
  }
}

// Endpoint to get recent uploads
app.get("/api/videos", async (req, res) => {
  try {
    const channelId = await getChannelId("@matty_cycling");
    if (!channelId) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const videos = await getRecentUploads(channelId);
    res.json(videos);
  } catch (error) {
    console.error("Error in /api/videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Endpoint to get video details
app.get("/api/videos/:videoId", async (req, res) => {
  try {
    const response = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      id: req.params.videoId,
      part: "contentDetails,statistics",
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: "Video not found" });
    }

    const video = response.data.items[0];
    res.json({
      duration: video.contentDetails.duration,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
    });
  } catch (error) {
    console.error("Error in /api/videos/:videoId:", error);
    res.status(500).json({ error: "Failed to fetch video details" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
