import axiosInstance from "../utils/axiosinstance";

export const loginUser = async (email , password)=>{
 const {data} = await axiosInstance.post("/api/v1/auth/login", {email , password})

 return data.data.user;
}

export const registerUser = async(name , email , password , avatarFile) =>{
  const fromData =  new FormData();

  fromData.append("name" , name);
  fromData.append("email" , email);
  fromData.append("password" , password);
  fromData.append("avatar" , avatarFile);

  const {data} = await axiosInstance.post("/api/v1/auth/registerUser" , fromData ,{
    headers :{
         'Content-Type': 'multipart/form-data'
    }
   });

   return data.data.createdUser;
}

export const logoutUser = async() =>{
    const {data} = await axiosInstance.post("/api/v1/auth/logout")
    return data;
}

export const updatePassword = async (oldPassword , newPassword) =>{
    const {data} = await axiosInstance.post("/api/v1/auth/updatePassword" , {oldPassword , newPassword})
    return data;
}

export const updateAccountDetails = async (name , email) =>{
    const {data} = await axiosInstance.patch("/api/v1/auth/updateAccountDetails" , {name , email})
    return data;
}

export const updateUserAvatar = async (avatarFile) =>{
    const fromData = new FormData();

    fromData.append("avatar" , avatarFile);
    const {data} = await axiosInstance.patch("/api/v1/auth/updateuserAvatar" , fromData , {
        headers : {
             'Content-Type': 'multipart/form-data'
        }
    });
    return data;
}

export const getCurrentUser = async () =>{
    const {data} = await axiosInstance.get("/api/v1/auth/getcurrentUser");

    return data;
}

export const getAllUserUrls = async () =>{
    const {data} = await axiosInstance.post("/api/v1/user/urls");
    return data;
}


// without destructing 
// export const loginUser = async (password, email) => {
//     const response = await axiosInstance.post("/api/auth/login", {email, password})
//     // response = {
//     //   data: {user: loggedInUser},  ← Your backend response is here
//     //   status: 200,
//     //   statusText: 'OK',
//     //   ...
//     // }
    
//     return response.data  // Returns {user: loggedInUser}
// }

// // Usage:
// const result = await loginUser(password, email)
// // result = {user: loggedInUser}
// // To get user: result.user


//with destructing 
// export const loginUser = async (password, email) => {
//     const {data} = await axiosInstance.post("/api/auth/login", {email, password})
//     // data = {user: loggedInUser}  ← Directly extracted from axios response
    
//     return data  // Returns {user: loggedInUser}
// }

// // Usage:
// const result = await loginUser(password, email)
// // result = {user: loggedInUser}
// // To get user: result.user