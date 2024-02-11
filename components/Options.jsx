'use client'
import React, { useState, useRef, useEffect } from 'react';
const Options = ({ stream }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsCameraOff(!isCameraOff);
  };

  return (
    <div className="p-4">
      <h6 className="text-lg mb-2">Options</h6>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isMuted}
          onChange={toggleMute}
          className="mr-2"
        />
        <label>Mute Yourself</label>
      </div>
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          checked={isCameraOff}
          onChange={toggleCamera}
          className="mr-2"
        />
        <label>Turn Off Camera</label>
      </div>
    </div>
  );
};

export default Options;
