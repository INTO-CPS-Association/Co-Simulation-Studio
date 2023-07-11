import React, { useState, useEffect } from "react";
import { PageTemplatesProps, Page } from "../Data/types";
//import PageDialog from "./PageDialog";

import { ChoiceGroup, DefaultButton, IChoiceGroupOption } from "@fluentui/react";


//--------------------PAGE TEMPLATES GALLERY COMPONENT--------------------
const PageTemplatesGallery: React.FC<PageTemplatesProps & { onEdit: (page: Page) => void }> = ({ pages, onEdit }) => {
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

    //--------------------FUNCTIONALITY--------------------    
    const onEditPage = (page: Page) => {
        if(selectedPage) {
            console.log("Editing template: ", selectedPage?.id);
            onEdit(page);
        }
    };


    //--------------------RENDERING--------------------
    return (
        <div>
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

            {/* Creates a edit button, when a user clicks on template (probably change later to more user-friendly component) */}
            {selectedPage && <DefaultButton onClick={() => onEditPage(selectedPage)}>Edit Template</DefaultButton>}
        </div>
    );
};

export default PageTemplatesGallery;