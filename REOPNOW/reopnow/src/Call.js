import "./styles/call.css";
import image2 from "./resources/img2.png";
import img3 from "./resources/img3.png";
import { useEffect, useState } from "react";
import io from "socket.io-client";
const Call = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [img, setImg] = useState("");
  const [message,setMessage]=useState('');
  const [messages,SetMessages]=useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [socket,setSocket]=useState(null);
  const [stream,setStream]=useState(false);
  const [opponentName,setOpponentName]=useState('');
  const [myName,setMyName]=useState('Eswar');
  const [endSession,setEndSession]=useState(false);
  const [roomId,setRoomId]=useState('');
  useEffect(() => {
    const url = new URL(window.location.href);
    const roomId = url.searchParams.get('roomId');
    setRoomId(roomId);
  }, []);
  useEffect(() => {
    const socket = io("http://172.22.192.134:5000");
    setSocket(socket);
    if(socket===null){
      setEndSession(true);
      return;
    }
    const room = roomId;
    socket.emit("join-message", room);
    socket.emit("send-name", JSON.stringify({ "name": myName, "room": roomId }));
    return () => {
      socket.disconnect(); // Disconnect when component unmounts
    };
  }, [roomId]);
  useEffect(() => {
    if(socket==null)return;
    socket.on("send-name", function (message) {
      setOpponentName(JSON.parse(message).name);
    });
    return () => {
      socket.off("send-name"); // Disconnect when component unmounts
    };
  }, [socket]);
  useEffect(() => {
    if(socket==null)return;
    socket.on("screen-data", function (message) {
      setStream(true);
      setImg("data:image/png;base64," + message);
    });
    return () => {
      socket.off("screen-data"); // Disconnect when component unmounts
    };
  }, [socket]);
  useEffect(() => {
    if(socket==null)return;
    socket.on("send-message", function (message) {
    SetMessages(prevMessages => [...prevMessages, { id: '1', name: JSON.parse(message).name, message: JSON.parse(message).message }]);
    });
    return () => {
      socket.off("send-message"); // Disconnect when component unmounts
    };
  },[socket]);
  useEffect(() => {
    if(socket==null)return;
    socket.on("end-session", function (message) {
      setEndSession(true);
    });
    return () => {
      socket.off("end-session"); // Disconnect when component unmounts
    };
  }, [socket]);
  useEffect(() => {
    if (endSession===true) {
      window.location.href='/';
    }
  }, [endSession]);
  const handleMouseMove = (event) => {
    if(socket==null ||fullScreen===false)return;
    const { offsetX, offsetY,currentTarget } = event.nativeEvent;
    const {width,height}=currentTarget.getBoundingClientRect();
    setMousePosition({ x: offsetX, y: offsetY });
    socket.emit("mouse-move", JSON.stringify({ room:roomId,"x": offsetX, "y": offsetY,"room":roomId,screenWidth:event.target.width,screenHeight:event.target.height }));
    console.log({ x: offsetX, y: offsetY ,screenWidth:event.target.width,screenHeight:event.target.height})
  };
  const handleMouseClick = () => {
    socket.emit("mouse-click",JSON.stringify({"room":roomId}));
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      socket.emit("key-click", JSON.stringify({ key: event.key, room: roomId }));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [socket, roomId]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      socket.emit("scroll-event", JSON.stringify({ scrollX, scrollY, room: roomId }));
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [socket, roomId]);
  const handleSendMessage=()=>{
    if(socket==null)return;
    const obj = {};
    obj.room = roomId;
    obj.message = message;
    obj.name=myName;
    socket.emit("send-message", JSON.stringify(obj));
    SetMessages([...messages,{id:'1',name:'Me',message:message}]);
    setMessage('');
  }
  const handleEndSession=()=>{
    if(socket==null)return;
    socket.emit("end-session", JSON.stringify({room:roomId}));
    setEndSession(true);
  }
  useEffect(() => {
    const beforeUnloadHandler = (event) => {
      // // Cancel the event (to prompt the user)
      // event.preventDefault();
      // // Chrome requires the event.returnValue to be set

      // // Display a custom modal for confirmation
      // const confirmationMessage = 'Are you sure you want to leave this page? You will be logged out.';
      // event.returnValue = confirmationMessage;
      // if (window.confirm(confirmationMessage)) {
      //   handleEndSession();
      //   window.location.href='/';
      // }
      return event.returnValue = 'Are you sure you want to leave this page? You will be logged out.';
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
  return (
    <div className="container">
    <div className="leftcallContainerBottom">
          <img src={image2} alt="image" />
          <div className="title">
            <h1>REOPNOW</h1>
            <p>REMOTE OPERATE NOW</p>
          </div>
          <div className="doggyDiv">
            <img className="img2" src={require('./resources/doggy.gif')} alt="image" />
            <img className="img1" src={require('./resources/doggy.gif')} alt="image" />
          </div>
        </div>
    <div className="callContainer">
      <div className="leftcallContainer">
        <div className="leftcallContainerTop">
          <div className={fullScreen ? "fullImageDiv" : "imageDiv"}>
            {stream?<img
              src={img}
              onMouseMove={handleMouseMove}
              onClick={handleMouseClick}
              alt="image"
            />:
            <img
            style={{width:'500px',height:'auto'}}
              src={require('../src/resources/buffering.webp')}
              alt="image"/>}
            <div className="controls">
              {fullScreen ? (
                <button
                  className="meetingControl1"
                  onClick={() => setFullScreen(!fullScreen)}
                >
                  Minimize
                </button>
              ) : (
                <button
                  className="meetingControl1"
                  onClick={() => setFullScreen(!fullScreen)}
                >
                  Maximize
                </button>
              )}
              <button className="meetingControl2" onClick={handleEndSession}>End Session</button>
            </div>
          </div>
        </div>
      </div>
      <div className="rightcallContainer">
        <div className="topDiv">
                <div className="profilePng">
                  <img src={require('./resources/profile.jpg')} alt="image" />
                </div>
                <h3>{opponentName}</h3>
        </div>
        <div className="messages">
          {messages.map((item)=>{
            return(
              <div className={`message`}>
                <p className="messageName">{item.name}</p>
                <p className="messageText">{item.message}</p>
              </div>
            ); 
          })}
        </div>
        <div className="sendMessage">
          <input className="enterText" value={message} type="text" placeholder="Type something" onChange={(e)=>{
            setMessage(e.target.value)}}/>
          <button onClick={handleSendMessage}>SEND</button>
        </div>
      </div>
    </div>
    </div>
  );
};
export default Call;
