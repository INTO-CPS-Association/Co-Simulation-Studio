import React, { createContext, useState, useContext } from 'react';
import { BlockContextProps, BlockData} from '../Data/interface';

//create context
export const BlockContext = createContext<BlockContextProps>({} as BlockContextProps);


export const BlockContextProvider: React.FC = ({ children }) => {
	//state variables
	const [projectData, setProjectData] = useState<BlockData[]>([]);
  
	//------------------ FUNCTIONALITY ------------------//
	const handleBlockDelete = (id: string) => {
	  setProjectData(prevData => prevData.filter(block => block.id !== id));
	};
  
	return (
	  <BlockContext.Provider value={{ projectData, setProjectData, handleBlockDelete }}>
		{children}
	  </BlockContext.Provider>
	);
  };


  export const useBlockContext = () => {
	const context = useContext(BlockContext);
	if (!context) {
	  throw new Error("useBlockContext must be used within BlockContextProvider");
	}
	return context;
  };