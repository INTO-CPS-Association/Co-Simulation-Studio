import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { BlockProps } from '../Data/interface';
import 'react-quill/dist/quill.snow.css'; // import styles

// Quill modules to attach to editor
const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  ],
};

// Quill formats to allow in editor
const formats = [
  'bold', 'italic', 'underline', 'strike', 
  'font', 'size'
];


//------------------ TEXT BLOCK COMPONENT ------------------//
const TextBlock: React.FC<BlockProps> = ({ id, data, onDataChange }) => {
	//state variable
	const [text, setText] = useState(data);

	//------------------ FUNCTIONALITY ------------------//
  	const handleChange = (value: string) => {
    	setText(value);
    	onDataChange(value); // notify the parent about the change
  }

  //------------------ RENDER ------------------//
  return (
    <div className="text-block">
      <ReactQuill 
        value={text}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}

export default TextBlock;
