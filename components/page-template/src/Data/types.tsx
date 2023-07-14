import { ReactNode } from "react";

//-----------SINGLE PAGE COMPONENT--------------------
export interface Page {
    id: number;
    title: string;
    description: string;
    image: string;
  }

//-----------------LISTS OF PAGES/PROJECTS--------------------
//list of templates
export interface PageTemplatesProps {
    pages: Page[];
    onEdit: (page: Page) => void;
  };

//list of projects
export interface PageProjectsProps {
    pages: Page[];
    onDelete: (page: Page) => void;
    onEdit: (page: Page) => void;
  };


//--------------------FUNCTIONALITY COMPONENTS--------------------
export interface PageDialogProps {
  selectedPage: Page | null;
  onDismiss: () => void;
  onEdit: (page: Page) => void;
  onDelete: (page: Page) => void;
}


//--------------------PAGE FORM COMPONENTS--------------------
//defining functionallity of page creator
export interface NewPageFormProps {
  onCreate: (page: Page) => void;
}

//defining functionallity of page editor
export interface EditPageFormProps {
  onEdit: (page: Page) => void;
}

//defining functionallity of page editor
export interface PageFormProbs {
  onEdit?: (page: Page) => void;
  onCreate?: (page: Page) => void;
}


//--------------------REACT CONTEXT--------------------
export interface PagesContextProps {
  templates: Page[];
  projects: Page[];
  addTemplate: (template: Page) => void;
  addProject: (project: Page) => void;
  editTemplate: (updatedTemplate: Page) => void;
  editProject: (updatedProject: Page) => void;
  deleteProject: (id: number) => void;
  
}

export interface PagesProviderProps {
  children: ReactNode;
  initialTemplates: Page[];
  initialProjects: Page[];
}



