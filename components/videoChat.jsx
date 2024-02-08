'use client';
import React, { useEffect, useState } from 'react';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const VideoChat = () => {
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [audioEnabled, setaudioEnable] = useState(true);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(mediaStream => {
        setStream(mediaStream);

        const myPeer = new SimplePeer({ initiator: true, stream: mediaStream });

        myPeer.on('signal', (signal) => {
          socket.emit('offer', signal);
        });

        socket.on('offer', (signal) => {
          const peer = new SimplePeer({ initiator: false, stream: mediaStream });
          peer.signal(signal);

          peer.on('signal', (answerSignal) => {
            socket.emit('answer', answerSignal);
          });

          setPeers(prevPeers => [...prevPeers, peer]);
        });

        return () => {
          myPeer.destroy();
          peers.forEach((peer) => peer.destroy());
        };
      })
      .catch(error => console.error('Error accessing media devices:', error));
  }, []);

  return (
    <div>
      {stream && <video ref={(ref) => ref && (ref.srcObject = stream)} autoPlay muted />}
      {peers.map((peer, index) => (
        <video key={index} ref={(ref) => ref && (ref.srcObject = peer.stream)} autoPlay></video>
      ))}
    </div>
  );
};

export default VideoChat;
