const axios = require("axios");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const { MONGODB_URI } = require("./DB/Mongodb.json");

// Catbox
const CATBOX_HASH = "9f09cd44af9d1d8b2197adf9f";
const CATBOX_UPLOAD_URL = "https://catbox.moe/user/api.php";


const separateMongoose = require('mongoose');

let voiceConnection;
let voiceSchema;
let settingsSchema;
let Voice;
let VoiceSettings;

const connectToDatabase = async () => {
  try {
    if (!voiceConnection || voiceConnection.readyState !== 1) {
      voiceConnection = separateMongoose.createConnection(MONGODB_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
      });
      
      // Wait for connection to be established
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Database connection timeout'));
        }, 10000);
        
        voiceConnection.once('open', () => {
          clearTimeout(timeout);
          console.log('Voice database connected successfully to:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
          resolve();
        });
        
        voiceConnection.once('error', (error) => {
          clearTimeout(timeout);
          console.error('Voice database connection failed:', error);
          reject(error);
        });
      });
    }
    
    // Define schemas if not already defined
    if (!voiceSchema) {
      voiceSchema = new separateMongoose.Schema({
        name: { type: String, required: true, unique: true },
        url: { type: String, required: true },
        uploadedBy: { type: String, required: true },
        fileSize: { type: Number, default: 0 },
        keywords: [{ type: String }],
        createdAt: { type: Date, default: Date.now }
      });
      
      settingsSchema = new separateMongoose.Schema({
        threadID: { type: String, required: true, unique: true },
        voiceMode: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      });
      
      Voice = voiceConnection.model("VoiceClips", voiceSchema);
      VoiceSettings = voiceConnection.model("VoiceClipSettings", settingsSchema);
    }
    
    return true;
  } catch (error) {
    console.error('Voice database connection error:', error);
    throw error;
  }
};

const downloadFile = async (url, filepath) => {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
    timeout: 30000
  });
  
  const writer = fs.createWriteStream(filepath);
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// Upload file to Catbox
const uploadToCatbox = async (filepath) => {
  try {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('userhash', CATBOX_HASH);
    form.append('fileToUpload', fs.createReadStream(filepath));
    
    const response = await axios.post(CATBOX_UPLOAD_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 60000
    });
    
    return response.data.trim();
  } catch (error) {
    console.error('Catbox upload error:', error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Send voice clip as attachment
const sendVoiceClip = async (api, threadID, voiceUrl, voiceName = "") => {
  try {
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const filename = `temp_voice_${Date.now()}.mp3`;
    const filepath = path.join(tempDir, filename);
    
    await downloadFile(voiceUrl, filepath);
    
    const attachment = fs.createReadStream(filepath);
    await api.sendMessage({
      body: voiceName ? `🎵 ${voiceName}` : "",
      attachment: attachment
    }, threadID);
    
    setTimeout(() => {
      try {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    }, 1000);
    
  } catch (error) {
    console.error('Voice send error:', error);
    throw error;
  }
};

const getFileInfo = (filepath) => {
  try {
    const stats = fs.statSync(filepath);
    return {
      size: stats.size,
      sizeFormatted: formatFileSize(stats.size)
    };
  } catch {
    return { size: 0, sizeFormatted: '0 B' };
  }
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const cleanupFile = (filepath) => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (error) {
    console.error('Cleanup error:', 
