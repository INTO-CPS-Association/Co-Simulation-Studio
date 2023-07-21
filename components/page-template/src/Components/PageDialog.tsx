import React from 'react';
import { Dialog, DialogFooter } from '@fluentui/react';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { PageDialogProps } from '../Data/types';


//--------------------PAGE DIALOG COMPONENT--------------------
const PageDialog: React.FC<PageDialogProps> = ({ selectedPage, onDismiss, onEdit, onDelete }) => {
    if (!selectedPage) return null;

    //render: two buttons for editing and deleting
    return (
        <Dialog
          hidden={selectedPage === null}

          onDismiss={onDismiss}
          dialogContentProps={{
            title: selectedPage.title,
            subText: 'Select an action',
          }}
        >
          <DialogFooter>
            <PrimaryButton onClick={() => onEdit(selectedPage)} text="Edit" />
            <DefaultButton onClick={() => onDelete(selectedPage)} text="Delete" />
          </DialogFooter>
        </Dialog>
      );
};

export default PageDialog;
