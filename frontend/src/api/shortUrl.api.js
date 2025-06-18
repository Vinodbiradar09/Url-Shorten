
import axiosInstance from "../utils/axiosinstance";


export const createShortUrl = async (url , slug)=>{
    const {data} = await axiosInstance.post("/api/v1/url/createShortUrl" , {url , slug})
    return data.data.shortUrl;
  }


// here we are using async await no need for promises 
// in axiosinstances we have used the interceptors no need of error handling here 
// export const createShortUrl = async (url, slug) => {
//     try {
//         const {data} = await axiosInstance.post("/api/v1/url", {url, slug});
//         return data.shortUrl;  // Return the actual short URL
//     } catch (err) {
//         console.log(err.message);
//         throw err;  // Re-throw so caller can handle
//     }
// }

// promises chain 
// const shortUrl = (url, slug) => {
//   return axiosInstance.post("/api/v1/url", {url, slug})
//     .then((res) => {
//       return res.data.shortUrl;
//     })
//     .catch((err) => {
//       console.log(err.message);
//       throw err;  // or return a default value
//     });
// }
  