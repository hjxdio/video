import axios from "axios"
import querystring from "querystring"

const errorHandler=(status,info)=>{
switch(status){
    case 400:
        console.log("error");
        break;
    case 404:
        console.log("error");
        break;
}
}

const instance = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    //baseURL:'/api',
    timeout: 15000,
})
//instance.defaults.withCredentials = true;
instance.interceptors.request.use(
    config => {
        if(config.methods==="post"){
            config.data=querystring.stringify(config.data)
        }
        return config;
    },
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response=>{
        return response.data
    },
    error=>{
        const { response }=error;
        errorHandler(response.status,response.info)
    }
)
export default instance;
