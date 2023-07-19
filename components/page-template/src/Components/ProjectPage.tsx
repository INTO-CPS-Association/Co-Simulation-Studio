
import React from "react";
import { Page } from "../Data/types";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { usePages } from "./PageProvider";
import UserProjectsGallery from "./UserProjectsGallery";
import PageForm from "./PageForm";

//--------------------PROJECT COMPONENT--------------------
const ProjectPage: React.FC = () => {
    //state variables
    const { projects, editProject, deleteProject } = usePages();
    const navigate = useNavigate();

    //--------------------FUNCTIONALITY-------------------    
    //edit existing page or template 
    const handleEdit = (updatedProject: Page) => {
        editProject(updatedProject);
        navigate('/projects');
    };

    //delete project
    const handleDelete = (project: Page) => {
        deleteProject(project.id);
    };

    // handle project selection
    const handleProjectSelection = (project: Page) => {
        navigate(`/projects/edit/${project.id}`, { state: { selectedPage: project } });
    };

    //--------------------RENDERING--------------------
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}> 
            <Routes>
                <Route path="/*" element={
                    <div>
                        <h1 style={{ color: '#2F4858', textAlign: 'center' }}>My Projects</h1>
                        <UserProjectsGallery pages={projects} onEdit={handleProjectSelection} onDelete={handleDelete} />
                    </div>
                } />

                <Route path="/edit/:projectID" element={
                    <PageForm onEdit={handleEdit} />
                } />
            </Routes>
        </div>
    );
};

export default ProjectPage;



