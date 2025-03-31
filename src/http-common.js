import axios from "axios";

// baseURL: http://localhost:8080/api

export default axios.create({
    baseURL: "https://swat-soda.onrender.com/api/",
    headers: {
        "Content-type": "application/json"
    }
});