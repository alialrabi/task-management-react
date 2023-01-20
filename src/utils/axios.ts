import axios from 'axios';

const RESPONSESTATUS = 401

const axiosInt = axios.create({ 
  baseURL: 'http://localhost:8080/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInt.defaults.headers.common = {
  'Authorization': 'Bearer ' +  localStorage.getItem("accessToken")
};

axiosInt.interceptors.response.use(
  (res) => {    

    return Promise.resolve(res);
  },
  (err) => {
    console.log(err.response.status);
    if (err.response.status === RESPONSESTATUS) {
      console.log('not authorized');
    }
    return Promise.reject(err);
  }
);


export default axiosInt;
