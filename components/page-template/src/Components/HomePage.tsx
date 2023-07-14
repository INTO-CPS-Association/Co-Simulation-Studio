
import React from "react";
import { Page } from "../Data/types";
import PageTemplatesGallery from "./PageTemplatesGallery";
import { useNavigate } from 'react-router-dom';
import { usePages } from "./PageProvider";
import { Routes, Route } from 'react-router-dom';
import PageForm from "./PageForm";


//--------------------HOME COMPONENT--------------------
const HomePage: React.FC = () => {
    //state variables
    const { templates, addProject } = usePages();
    const navigate = useNavigate();

    //--------------------FUNCTIONALITY-------------------
    //create new page
    const handleCreate = (newPage: Page) => {
        addProject(newPage);
        navigate('/home');
    };

    // handle template selection
    const handleTemplateSelection = (template: Page) => {
        navigate(`/home/edit/${template.id}`, { state: { selectedPage: { ...template, id: null } } });
    };



    //--------------------RENDERING--------------------
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}> 
            <Routes>
                <Route path="/" element={
                    <>
                        <h1 style={{ color: '#2F4858', textAlign: 'center' }}>INTO-CPS Overview</h1>

                        <div style={{ display: 'flex', justifyContent: 'left', margin: '20px 0' }}>
                            <button style={{ cursor: 'pointer', padding: '10px 20px' }} onClick={() => navigate('/home/create')}>
                                Create New Page
                            </button>                       
                        </div>

                        <h2 style={{ color: '#33658A', textAlign: "left" }}>Templates</h2>
                        <PageTemplatesGallery pages={templates} onEdit={handleTemplateSelection} />
                    </>
                } />

                <Route path="/create" element={
                    <PageForm onCreate={handleCreate} />
                } />

                <Route path="/edit/:templateId" element={
                    <PageForm onCreate={handleCreate} />
                } />
            </Routes>
        </div>
    );
};

export default HomePage;