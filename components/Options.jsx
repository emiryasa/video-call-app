'use client'
import React, { useState } from 'react';

const Options = ({ peer }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isRemoteMuted, setIsRemoteMuted] = useState(false);

  const toggleMute = () => {
    const audioTracks = peer.stream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleRemoteMute = () => {
    // Bu kısımda karşı kullanıcının sesini kapatıp açmak için gerekli kodları ekleyin
    // Bunun için kullanabileceğiniz bir API veya kütüphane kullanmanız gerekebilir.
    // Örneğin, SimplePeer'da bu özelliği doğrudan sağlamıyorsa, farklı bir kütüphane kullanmanız gerekebilir.
    // Bu kod SimplePeer ile çalışacak şekilde ayarlanmalıdır.
    setIsRemoteMuted(!isRemoteMuted);
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
          checked={isRemoteMuted}
          onChange={toggleRemoteMute}
          className="mr-2"
        />
        <label>Mute Remote User</label>
      </div>
    </div>
  );
};

export default Options;
