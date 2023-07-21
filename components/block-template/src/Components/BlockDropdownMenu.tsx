import React, { useState } from 'react';
import { BlockData } from '../Data/interface';


//------------------ DROPDOWN COMPONENT ------------------//
const BlockDropdownMenu: React.FC<{ onBlockAdd: (block: Omit<BlockData, 'id'>) => void; // Change the type of block
blockTypes: string[];
}> = ({ onBlockAdd, blockTypes }) => {

  //state variables
  const [selectedBlockType, setSelectedBlockType] = useState<string>('');

  
	//------------------ FUNCTIONALITY ------------------//
	//add block
  const handleAddBlock = () => {
    if (selectedBlockType) {
      onBlockAdd({ type: selectedBlockType, data: 'Default Data' });  // remove id from here
    }
  };

	//------------------ RENDER ------------------//
  return (
    <>
      <select value={selectedBlockType} onChange={(e) => setSelectedBlockType(e.target.value)}>
        <option value="">--Select a block--</option>
        {blockTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <button onClick={handleAddBlock}>Add Block</button>
    </>
  );
};

export default BlockDropdownMenu;
