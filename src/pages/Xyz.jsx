// import React from 'react'
// import { useEffect, useState } from 'react'
// import useAxios from "../hooks/useAxios"

// function Xyz() {
//     const axiosapi = useAxios()
//     let [data, setData] = useState({owner:[]});
    
//     useEffect(async()=>{
//         await axiosapi.get("/company/alladdress/").then((res)=>{console.log("resp : ",res); setData({owner:res.brokers})})    
//     },[])


//     return (
//         <div>
//            {data.owner.map((ele,key)=>ele.name)+"  "}
//             hello new page

//         </div>
//     )
// }

// export default Xyz