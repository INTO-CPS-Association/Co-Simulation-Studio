import React from "react";
import { CreatePageButtonProps } from '../Data/types';
import { PrimaryButton } from "@fluentui/react";


//--------------------CREATE PAGE BUTTON COMPONENT--------------------
const CreatePageButton: React.FC<CreatePageButtonProps> = ({ onClick }) => {
    return (
        <div>
            <PrimaryButton onClick={onClick}>Create New Page</PrimaryButton>
        </div>
    );
};

export default CreatePageButton;
