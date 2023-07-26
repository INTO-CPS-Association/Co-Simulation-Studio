import React, { useState } from 'react';
import { BlockProps } from '../Data/interface';
import AceEditor from 'react-ace';
import "../Styling/CodeSnippetBlock.css"
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/worker-javascript'; // this line is important


//------------------ CODE SNIPPET BLOCK COMPONENT ------------------//
const CodeSnippetBlock: React.FC<BlockProps> = ({ data, onDataChange }) => {
    //state variables
	const [code, setCode] = useState(data);

	//update the code when the data changes
	const handleCodeChange = (newValue: string) => {
        setCode(newValue);
        onDataChange(newValue);
    };

	//------------------ RENDER ------------------//
    return (
        <AceEditor
            mode="javascript"
            theme="monokai"
            value={code}
            onChange={handleCodeChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
			setOptions={{ useWorker: false }}
        />
    );
};


export default CodeSnippetBlock;