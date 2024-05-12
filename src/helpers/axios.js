import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export default instance;


//library which is used to make requests to an API, 
//return data from the API