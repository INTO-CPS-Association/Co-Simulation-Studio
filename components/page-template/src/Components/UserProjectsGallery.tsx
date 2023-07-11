import React, { useState, useEffect } from "react";
import { PageProjectsProps, Page } from "../Data/types";
import PageDialog from "./PageDialog";

import { ChoiceGroup, IChoiceGroupOption } from "@fluentui/react";


//--------------------PageTemplateGallery Component--------------------
const UserProjectsGallery: React.FC<PageProjectsProps & { onEdit: (page: Page) => void; onDelete: (page: Page) => void; }> = ({ pages, onEdit, onDelete }) => {
    //state variables
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [options, setOptions] = useState<IChoiceGroupOption[]>([]);
    
    //setting the data for the choice group i.e. the list of pages
    useEffect(() => {
        const newOptions: IChoiceGroupOption[] = pages.map((page) => ({
            key: page.id.toString(),
            text: page.title,
            imageSrc: page.image,
            imageSize: { width: 128, height: 128},
        }));

        setOptions(newOptions);
    }, [pages]);

    //--------------------FUNCTIONS--------------------
    const onDismiss = () => {
        setSelectedPage(null);
    };

    const onEditPage = (page: Page) => {
        console.log("Editing page: ", selectedPage?.id);
        onEdit(page);
      };
    
    const onDeletePage = (page: Page) => {
        console.log("Deleting page: ", selectedPage?.id);
        onDelete(page);
        setSelectedPage(null);
      };


    //--------------------RENDERING--------------------
    return (
        <div>
            {/* Insert Choice group component */}
            <ChoiceGroup
                options={options}
                required={true}
                onChange={(ev, option) => {
                const selectedPage = pages.find(page => page.id.toString() === option?.key);
                console.log("Selected page: ", selectedPage);
    
                if (selectedPage) {
                        setSelectedPage(selectedPage);       //ensures no null values
                    }
                }}
            />

            {/* Insert PageDialog component and send functions as probs */}
            <PageDialog
                selectedPage={selectedPage}
                onDismiss={onDismiss}
                onEdit={onEditPage}
                onDelete={onDeletePage} 
            />
        </div>
    );
};

export default UserProjectsGallery;