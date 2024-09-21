'use client'
import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import SimplePeer from 'simple-peer';
import CopyToClipboard from 'react-copy-to-clipboard';
import Options from './Options'; 

const VideoChat = ({  }) => {
  const [socket, setSocket] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [idToCall, setIdToCall] = useState('');

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    const newSocket = io('https://video-call-app-server-evtw.onrender.com/');
    setSocket(newSocket);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current && (myVideo.current.srcObject = currentStream);

      })
      .catch(error => {
        console.error('Media permission denied or error occurred: ', error);
      });

    return () => {
      newSocket.disconnect();
    };
  }, []);


  useEffect(() => {
    if (socket) {
      socket.on('me', (id) => setMe(id));

      socket.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    }
  }, [socket]);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new SimplePeer({ initiator: false, trickle: false, stream });
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });
    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new SimplePeer({ initiator: true, trickle: false, stream });
    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });
    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });
    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current && connectionRef.current.destroy();

    socket.emit('endCall');
  };

  useEffect(() => {
    if (socket) {
      socket.on('callEnded', () => {
        // Karşı tarafın video elementini kaldır
        window.location.reload();
      });
    }
  }, [socket]);

  return (
    <>
      <div className="flex justify-center items-center">
        {stream && (
          <div className="border-2 border-black rounded-lg p-4 m-4">
            <h5 >{name || 'Name'}</h5>
            <video playsInline muted ref={myVideo} autoPlay className="w-64 md:w-80" />
          </div>
        )}
        {call.isReceivingCall && !callAccepted && (
          <div className="flex justify-around items-center">
            <h1>{call.name} is calling:</h1>
            <button onClick={answerCall} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
              Answer
            </button>
          </div>
        )}
        {callAccepted && !callEnded && (
          <div className="border-2 border-black rounded-lg p-4 m-4" id="armut">
            <h5 >{call.name || 'Name'}</h5>
            <video playsInline ref={userVideo} autoPlay className="w-64 md:w-80" />
          </div>
        )}

        <Options stream={stream} /> {/*Options bileşenini çağırdık*/}

        <div className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto mt-8">
          <div className="p-8 border-2 border-black">
            <div className="flex flex-col" noValidate autoComplete="off">
              <div className="w-full">
                <div className="p-4">
                  <h6 className="text-lg mb-2">Account Info</h6>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-2 border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Name"
                  />
                  <CopyToClipboard text={me} className="mt-4 bg-blue-500 rounded-md outline-none">
                    <button className="text-white focus:outline-none">
                      Copy Your ID
                    </button>
                  </CopyToClipboard>
                </div>
                <div className="p-4">
                  <h6 className="text-lg mb-2">Make a call</h6>
                  <input
                    type="text"
                    value={idToCall}
                    onChange={(e) => setIdToCall(e.target.value)}
                    className="border-2 border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="ID to call"
                  />
                  {callAccepted && !callEnded ? (
                    <button onClick={leaveCall} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none mt-4">
                      Hang Up
                    </button>
                  ) : (
                    <button onClick={() => callUser(idToCall)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none mt-4">
                      Call
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoChat;
