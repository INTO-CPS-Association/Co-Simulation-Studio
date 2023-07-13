
import React, { useState } from "react";
import { HomePageProps, Page } from "../Data/types";
import PageTemplatesGallery from "./PageTemplatesGallery";
import UserProjectsGallery from "./UserProjectsGallery";
import CreatePageButton from "./CreatePage";
import NewPageForm from "./NewPageForm";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


//--------------------HOME COMPONENT--------------------
const HomePage: React.FC<HomePageProps> = ({ pages: startPages, projects: startProjects }) => {
    //state variables
    const [pages, setPages] = useState<Page[]>(startProjects);              
    const [templates, setTemplates] = useState<Page[]>(startPages);         
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditingTemplate, setIsEditingTemplate] = useState(false);
    
    const navigate = useNavigate();

    //--------------------FUNCTIONALITY-------------------
    //create new page
    const handleCreate = (newPage: Page) => {
        setPages(prevPages => [...prevPages, newPage]);
        setIsCreating(false);
        navigate('/');
    };
    
    //edit existing page or template 
    const handleEdit = (updatedPage: Page) => {
        if(isEditingTemplate) {
            const newPage = { ...updatedPage, id: generateNewId() };
            setPages(prevPages => [...prevPages, newPage]);
        } else {
            setPages(prevPages => prevPages.map(page => page.id === updatedPage.id ? updatedPage : page));
        };
        //reset state variables
        setSelectedPage(null);
        setIsEditing(false);
        navigate('/');
    };

    //delete page
    const handleDelete = (page: Page) => {
        setPages(pages.filter(p => p.id !== page.id));
    };

    //generate new id for new page
    const generateNewId = () => {
        const highestId = Math.max(...pages.map(page => page.id));
        return highestId + 1;
    };


    //--------------------RENDERING--------------------
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}> 
            <Routes>
                {/*Home page view */}
                <Route path="/" element={
                    <div>
                        <h1 style={{ color: '#2F4858', textAlign: 'center' }}>My Dashboard</h1>
                        <div style={{ display: 'flex', justifyContent: 'left', margin: '20px 0' }}>
                            <CreatePageButton onClick={() => navigate('/new')} />
                        </div>
                        <h2 style={{ color: '#33658A' }}>Templates</h2>
                        <PageTemplatesGallery pages={startPages} onEdit={page => { setSelectedPage(page); navigate('/edit'); setIsEditingTemplate(true); }} />
                        
                        <h2 style={{ color: '#33658A' }}>My Projects</h2>
                        <UserProjectsGallery pages={pages} onEdit={page => { setSelectedPage(page); navigate('/edit'); setIsEditingTemplate(false); }} onDelete={handleDelete} />
                    </div>
                } />
                {/*Create new page view */}
                <Route path="/new" element={
                    <NewPageForm onCreate={handleCreate}/>
                } />
                {/*Edit page view */}
                <Route path="/edit" element={
                    selectedPage && <NewPageForm onCreate={handleCreate} onEdit={handleEdit} page={selectedPage} />
                } />
            </Routes>
        </div>
    );
};

export default HomePage;