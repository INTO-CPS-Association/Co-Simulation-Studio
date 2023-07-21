import React, { useState } from 'react';
import { BlockProps } from '../Data/interface';


const AudioBlock: React.FC<BlockProps> = ({ data, onDataChange }) => {
    //state variables
    const [src, setSrc] = useState(data);

    //update the src when the data changes
    const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSrc = e.target.value;
        setSrc(newSrc);
        onDataChange(newSrc);
    };

    //------------------ RENDER ------------------//
    return (
        <div className="audio-block">
            <audio controls src={src}>
              Your browser does not support the audio element.
            </audio>
            <input type="text" placeholder="Enter audio URL..." value={src} onChange={handleSrcChange} />
        </div>
    );
};

export default AudioBlock;
