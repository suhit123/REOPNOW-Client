import { useEffect, useState } from 'react';
import img1 from './resources/img1.jpg'
const Starter=()=>{
    const [room,setRoom]=useState('');
    const handleChange=(e)=>{
        setRoom(e.target.value);
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(room);
        window.location.href=`/call?roomId=${room}`;
    }
    return(
    <div className='starterContainer'>
        <div><img className='img1' src={img1} alt="image"/></div>
        <div className='rightContainer'>
            <h3>Enter REOPNOW-ID here:</h3>
            <p>Provide the ID that you can obtain from the remote application.</p>
            <form>
                <input type='text' onChange={handleChange} placeholder='xxxx-xxxx-xxxx-xxxx'/>
                <button onClick={handleSubmit}>SUBMIT</button>
            </form>
            <button className='downloadNow'>DOWNLOAD NOW</button>
        </div>
    </div>);
};
export default Starter;