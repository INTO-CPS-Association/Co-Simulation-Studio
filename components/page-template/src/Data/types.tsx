
//defining page template - add more elements
export interface Page {
    id: number;
    title: string;
    description: string;
    image: string;
  }


//defining list of pages templates
export interface PageTemplatesProps {
    pages: Page[];
    onEdit: (page: Page) => void;
  };

//definint list of user projects
export interface PageProjectsProps {
    pages: Page[];
    onDelete: (page: Page) => void;
    onEdit: (page: Page) => void;
  };


//defining home page
export interface HomePageProps {
    pages: Page[];
    projects: Page[];
};


//defining functionallity of page template
export interface PageDialogProps {
  selectedPage: Page | null;
  onDismiss: () => void;
  onEdit: (page: Page) => void;
  onDelete: (page: Page) => void;
}


//defining functionallity of create page button
export interface CreatePageButtonProps {
  onClick: () => void;
}


export interface NewPageFormProps {
  onCreate: (page: Page) => void;
  onEdit?: (page: Page) => void;
  page?: Page;                    //The page to edit. If undefined, we are creating a new page
}



