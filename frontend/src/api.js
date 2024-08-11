import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'http://5.161.233.167:5000'  // Replace this with your actual production URL
    : 'http://localhost:5000',  // Replace with your local network IP and backend port
});

export default instance;
