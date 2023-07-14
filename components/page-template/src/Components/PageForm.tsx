
import React, { useState } from 'react';
import { PageFormProbs, Page } from '../Data/types'; // Replace with the path to your actual types file
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, PrimaryButton, DefaultButton, Stack, Image, Text} from '@fluentui/react';
import { nanoid } from 'nanoid';

//-------------------- PAGE FORM COMPONENT--------------------
const PageForm: React.FC<PageFormProbs> = ({ onEdit, onCreate }) => {
    //get state 
    const location = useLocation();
    const navigate = useNavigate();

    //get page data
    const selectedPage: Page = location.state?.selectedPage;

    //set state variables
    const [title, setTitle] = useState(selectedPage?.title || '');
    const [description, setDescription] = useState(selectedPage?.description || '');
    const [image, setImage] = useState(selectedPage?.image || '');


    //--------------------FUNCTIONALITY--------------------
    //edit existing page or template
    const handleSave = (event: React.FormEvent) => {
        event.preventDefault();

        if(selectedPage && onEdit) {
            // If a selectedPage exists, we're editing
            onEdit({ ...selectedPage, title, description, image });
        } else if (onCreate) {
            // Otherwise, we're creating a new page
            onCreate({ id: Number(nanoid), title, description, image }); // assuming nanoid is your ID generator function
        }
    }; 

    //cancel page editing 
    const handleCancel = () => {
        navigate(-1);
    };
    

    //--------------------RENDER--------------------
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', textAlign: 'left'}}>
            <h1 style={{ color: '#2F4858', textAlign: 'center' }}>Edit Page</h1>

            {/*Saving page*/}
            <form onSubmit={handleSave}>
                <Stack tokens={{ childrenGap: 15 }}>
                    <TextField label="Title" value={title} onChange={(_, newTitle) => setTitle(newTitle || '')} />
                    <TextField label="Description" value={description} onChange={(_, newDescription) => setDescription(newDescription || '')} />
                    <TextField label="Image URL" value={image} onChange={(_, newImage) => setImage(newImage || '')} />
                    {image ? <Image src={image} alt="Current image" width={200} /> : <Text>No image provided</Text>}


                {/*Cancel and save buttons*/}
                <Stack horizontal tokens={{ childrenGap: 10 }}>
                        <PrimaryButton type="submit">Save</PrimaryButton>
                        <DefaultButton onClick={handleCancel}>Cancel</DefaultButton>
                    </Stack>
                </Stack>
            </form>
        </div>
    );
    };


  export default PageForm;
