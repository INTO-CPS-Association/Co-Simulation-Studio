import React, { useState, useEffect } from "react";
import { PageTemplatesProps, Page } from "../Data/types";
import { ChoiceGroup, DefaultButton, IChoiceGroupOption, PrimaryButton, Dropdown, IDropdownOption, Modal, IModalProps } from "@fluentui/react";

//--------------------PAGE TEMPLATES GALLERY COMPONENT--------------------
const PageTemplatesGallery: React.FC<PageTemplatesProps & { onEdit: (page: Page) => void }> = ({ pages, onEdit }) => {
    //state variables
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [options, setOptions] = useState<IChoiceGroupOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [categoryOptions, setCategoryOptions] = useState<IDropdownOption[]>([]);


    //setting the data for the choice group i.e. the list of pages
    useEffect(() => {
        
        // If a category is selected, filter the pages to include only those in the selected category
        const filteredPages = selectedCategory && selectedCategory !== 'None' 
        ? pages.filter(page => page.category === selectedCategory) 
        : pages;
    

        // Create the options for the choice group
        const newOptions: IChoiceGroupOption[] = filteredPages.map((page) => ({
            key: page.id.toString(),
            text: page.title,
            imageSrc: page.image,
            imageSize: { width: 128, height: 128},
        }));

        setOptions(newOptions);
        
        // Collect unique categories and set them to categoryOptions
        const categories = ['None', ...Array.from(new Set(pages.map(page => page.category)))];
        setCategoryOptions(categories.map(category => ({ key: category, text: category })));
      
    }, [pages, selectedCategory]);

    //--------------------FUNCTIONALITY--------------------    
    const onEditPage = (page: Page) => {
        if(selectedPage) {
            console.log("Editing template: ", selectedPage?.id);
            onEdit(page);
            setIsModalOpen(false); // close the modal after editing
        }
    };

    //modal functionality
    const modalProps: IModalProps = {
        isBlocking: true,
        styles: { main: { maxWidth: 600 } },
    };


    //--------------------RENDERING--------------------
    return (
        <div style={{ padding: '20px', textAlign: "left", display: 'flex', flexDirection: 'column' }}>
            {/* dropdown of categories */}
            <Dropdown
                label="Category:"
                options={categoryOptions}
                styles={{ dropdown: { width: 200 } }} // Adjust width here
                onChange={(event, option) => setSelectedCategory(option?.key.toString())}
                />
            
            {/* choice group of templates */}
            <ChoiceGroup
                options={options}
                required={true}
                onChange={(ev, option) => {
                const selectedPage = pages.find(page => page.id.toString() === option?.key);
                console.log("Selected page: ", selectedPage);
    
                if (selectedPage) {
                        setSelectedPage(selectedPage);       //ensures no null values
                        setIsModalOpen(true);                // show the modal when a template is selected

                    }
                }}
            />
            {/* modal when user clicks on template */}
            <Modal
                titleAriaId="edit-template-title"
                isOpen={isModalOpen}
                onDismiss={() => setIsModalOpen(false)}
                isModeless={false}
                {...modalProps}
            >
                <div style={{ padding: '20px' }}>
                    <h2 id="edit-template-title">Edit Template</h2>
                    <p>Are you sure you want to edit this template?</p>
                    <PrimaryButton onClick={() => onEditPage(selectedPage!)} style={{ marginRight: '8px' }}>Yes</PrimaryButton>
                    <DefaultButton onClick={() => setIsModalOpen(false)}>No</DefaultButton>
                </div>
            </Modal>
        </div>
    );
};

export default PageTemplatesGallery;