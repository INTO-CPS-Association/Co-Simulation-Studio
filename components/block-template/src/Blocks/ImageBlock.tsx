import React, {useState} from 'react';
import { BlockProps } from '../Data/interface';
import '../Styling/ImageBlock.css';

const ImageBlock: React.FC<BlockProps> = ({ id, data, onDataChange }) => {
    //state variables
	const [src, setSrc] = useState(data);

	//update the src when the data changes
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSrc = e.target.value;
        setSrc(newSrc);
        onDataChange(newSrc);  // notify the parent about the change
    };

	//------------------ RENDER ------------------//
    return (
        <div className="image-block">
            <input type="text" placeholder="Enter image URL..." value={src} onChange={handleImageChange} />
            <img src={src} onError={(e) => (e.target as HTMLImageElement).src = '/path-to-default-image.jpg'} alt="Block content" />
        </div>
    );
};

export default ImageBlock;