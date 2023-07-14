import React, { useState, useEffect } from "react";
import { PageTemplatesProps, Page } from "../Data/types";
import { Modal, IModalProps } from "@fluentui/react";
import { ChoiceGroup, DefaultButton, IChoiceGroupOption } from "@fluentui/react";
import { PrimaryButton } from "@fluentui/react";


//--------------------PAGE TEMPLATES GALLERY COMPONENT--------------------
const PageTemplatesGallery: React.FC<PageTemplatesProps & { onEdit: (page: Page) => void }> = ({ pages, onEdit }) => {
    //state variables
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [options, setOptions] = useState<IChoiceGroupOption[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


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
        <div style={{ padding: '20px' }}>
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