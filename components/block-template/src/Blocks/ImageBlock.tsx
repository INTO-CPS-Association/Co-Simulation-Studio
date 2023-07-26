import React, {useState} from 'react';
import { BlockProps } from '../Data/interface';
import '../Styling/ImageBlock.css';



const ImageBlock: React.FC<BlockProps> = ({ id, data, onDataChange }) => {
    // state variables
    const [inputSrc, setInputSrc] = useState(data);
    const [isValidSrc, setIsValidSrc] = useState(true);

    // update the src when the data changes
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSrc(e.target.value);
        setIsValidSrc(true); // Reset the validation state
    };

    const handleBlur = () => {
        // Check if the input is a valid URL
        try {
            new URL(inputSrc);
        } catch (_) {
            setIsValidSrc(false); // If the input is not a valid URL, set the validation state to false
        }
        onDataChange(inputSrc);
    }

    const imageUrl = isValidSrc ? inputSrc : '/path-to-default-image.jpg';

    // RENDER
    return (
        <div>
            <input 
                type="text" 
                placeholder="Enter image URL..." 
                value={inputSrc} 
                onChange={handleImageChange} 
                onBlur={handleBlur} 
            />
            <div className="block-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}>
                <img src={imageUrl} alt="Block content" />
            </div>
        </div>
    );
};

export default ImageBlock;

/*
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

*/