import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'http://YOURURL'  // Replace this with your actual production URL
    : 'http://LOCALURL',  // Replace with your local network IP and backend port
});

export default instance;
