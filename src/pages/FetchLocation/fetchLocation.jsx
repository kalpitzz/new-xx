import React from "react";

const FetchLocation = ()=>{
    function handleLocation(){
        navigator.geolocation.getCurrentPosition(showPosition)
    }

    function showPosition(position){
        alert(`Lat: ${position.coords.latitude},Long: ${position.coords.longitude}`)
    }
    return (<main>
        <div style={{display:'flex',justifyContent:'center',marginTop:'10rem'}}>
        <button style={{backgroundColor:"blueviolet", padding:'3.5rem 3rem',color:'white',borderRadius:'50%',fontSize:'1.5rem'}} onClick={handleLocation}>
            Click
        </button>
        </div>
      
    </main>);
}
 
export default FetchLocation;

