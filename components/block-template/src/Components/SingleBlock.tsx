import React, { useState } from 'react';
import blockService from './BlocksComponentsMap';
import { BlockData } from '../Data/interface';
import { useBlockContext } from './BlockContext';
import { Button, Modal, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

//------------------ BLOCK COMPONENT ------------------//
const Block: React.FC<BlockData> = ({ id, type, data }) => {
    const { projectData, setProjectData, handleBlockDelete } = useBlockContext();
    const [editableData, setEditableData] = useState(data);
    const [open, setOpen] = useState(false);
    const BlockComponent = blockService.getBlock(type);

    //------------------ FUNCTIONALITY ------------------//
    const handleEdit = (newData: any) => {
        setEditableData(newData);
        setProjectData(projectData.map(block => block.id === id ? { ...block, data: newData } : block));
    };

    const handleDelete = () => {
        handleBlockDelete(id);
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };




    // UI design for modal 
   const body = (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
            <h2>Delete this block?</h2>
            <Button onClick={handleDelete} color="secondary">Yes, delete</Button>
            <Button onClick={handleClose}>Cancel</Button>
        </div>
    );

    //------------------ RENDER ------------------//
    return (
        <div style={{position: 'relative'}}>
            <IconButton onClick={handleOpen} style={{position: 'absolute', right: '0', top: '0', margin: '10px', padding: '0'}}>
                <CloseIcon />
            </IconButton>
            <BlockComponent data={editableData} onDataChange={handleEdit} id={id} />
            <Modal
                open={open}
                onClose={handleClose}
            >
                {body}
            </Modal>
        </div>
    );
};

export default Block;
