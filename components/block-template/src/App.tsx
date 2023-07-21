import React from 'react';
import Block from './Components/SingleBlock';
import BlockDropdownMenu from './Components/BlockDropdownMenu';
import { useBlockContext } from './Components/BlockContext';
import { BlockData } from './Data/interface';
import './App.css';
import { nanoid } from 'nanoid'
import blockService from './Components/BlocksComponentsMap';


export const App: React.FC = () => {
  //state
  const { projectData, setProjectData } = useBlockContext();


  //------------------ FUNCTIONALITY ------------------//
  //add block
  const handleBlockAdd = (block: Omit<BlockData, "id">) => {
    setProjectData([...projectData, { ...block, id: nanoid() }]);
  };


  //------------------ RENDER ------------------//
  return (
    <div className="app-container">
      <h1 className="app-title">My Project</h1>
      <p className="app-description">A project description</p>

      <BlockDropdownMenu onBlockAdd={handleBlockAdd} blockTypes={blockService.getBlockTypes()} />

      <div className="blocks-container">
        {projectData.map((block, index) => (
          <Block key={index} {...block} />
        ))}
      </div>
    </div>
  );
};