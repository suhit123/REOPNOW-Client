import "./styles/call.css";
import image2 from "./resources/img2.png";
import img3 from "./resources/img3.png";
import { useEffect, useState } from "react";
import io from "socket.io-client";
const Call = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [img, setImg] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const socket = io("http://localhost:5000");
    const room = "test";
    console.log(socket);
    socket.emit("join-message", room);
    socket.on("screen-data", function (message) {
      setImg("data:image/png;base64," + message);
    });
    return () => {
      socket.disconnect(); // Disconnect when component unmounts
    };
  }, []);
  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setMousePosition({ x: offsetX, y: offsetY });
    const socket = io("http://localhost:5000");
    socket.emit("mouse-move", JSON.stringify({ "x": offsetX, "y": offsetY,"room":"test" }));
    console.log({ "x": offsetX, "y": offsetY,"room":"test" });
  };
  const handleMouseClick = () => {
    const socket = io("http://localhost:5000");
    socket.emit("mouse-click",JSON.stringify({"room":"test"}));
  };
  return (
    <div className="callContainer">
      <div className="leftcallContainer">
        <div className="leftcallContainerTop">
          <div className={fullScreen ? "fullImageDiv" : "imageDiv"}>
            <img src={img} onMouseMove={handleMouseMove} onClick={handleMouseClick} alt="img" />
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
              <button className="meetingControl2">End Session</button>
            </div>
          </div>
        </div>
        <div className="leftcallContainerBottom">
          <img src={image2} alt="image" />
          <div className="title">
            <h1>REOPNOW</h1>
            <p>REMOTE OPERATE NOW</p>
          </div>
        </div>
      </div>
      <div className="rightcallContainer">chat</div>
    </div>
  );
};
export default Call;
