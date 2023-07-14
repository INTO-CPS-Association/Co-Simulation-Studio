
import React, { createContext, useState, useContext, /*useCallback*/ } from 'react';
import { PagesContextProps, PagesProviderProps, Page } from '../Data/types';

//define context to manage pages state
const PagesContext = createContext<PagesContextProps | undefined>(undefined);


export const PagesProvider: React.FC<PagesProviderProps> = ({ children, initialTemplates, initialProjects }) => {
    //state variables
    const [templates, setTemplates] = useState<Page[]>(initialTemplates);
    const [projects, setProjects] = useState<Page[]>(initialProjects);
    
    //receive last ID from templates and projects
    //const [lastId, setLastId] = useState(Math.max(...initialTemplates.map(t => t.id), ...initialProjects.map(p => p.id)));


    //--------------------FUNCTIONALITY--------------------
    const addTemplate = (template: Page) => {
        const lastId = Math.max(...templates.map(t => t.id), ...projects.map(p => p.id));         //get last ID from templates and projects
        setTemplates([...templates, {...template, id: lastId + 1}]);                              //add new template to templates with new ID
      };
    
    const addProject = (project: Page) => {
        const lastId = Math.max(...templates.map(t => t.id), ...projects.map(p => p.id));         //get last ID from templates and projects
        setProjects([...projects, {...project, id: lastId  + 1}]);                                //add new project to projects with new ID
      };
    
    const editTemplate = (updatedTemplate: Page) => {
        setTemplates(templates.map((template) => template.id === updatedTemplate.id ? updatedTemplate : template));
      };
    
    const editProject = (updatedProject: Page) => {
        setProjects(projects.map((project) => project.id === updatedProject.id ? updatedProject : project));
      };
    

    //useCallback???? 
    const deleteProject = (pageID: number) => {
        setProjects(projects.filter((project) => project.id !== pageID));
      };
      

  //--------------------RETURN--------------------
  return (
    <PagesContext.Provider
      value={{
        templates,
        projects,
        addTemplate,
        addProject,
        editTemplate,
        editProject,
        deleteProject,
      }}
    >
      {children}
    </PagesContext.Provider>
  );
};

//custom hook to use the PagesContext
export const usePages = () => {
    const context = useContext(PagesContext);
    if (context === undefined) {
      throw new Error("usePages must be used within a PagesProvider");
    }
    return context;
  };

