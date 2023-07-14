import React, { useState } from "react";
import { NewPageFormProps } from "../Data/types";
import { useNavigate } from "react-router-dom";


//--------------------NEW PAGE FORM COMPONENT--------------------
const NewPageForm: React.FC<NewPageFormProps> = ({ onCreate, onEdit, page }) => {
    //state variables for form inputs 
    const [title, setTitle] = useState(page ? page.title : '');
    const [description, setDescription] = useState(page ? page.description : '');
    const [image, setImage] = useState(page ? page.image : '');

    //navigation hook
    const navigate = useNavigate();


    //--------------------FUNCTIONALITY--------------------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPage = { id: page ? page.id : Date.now(), title, description, image };
        
        // if editing a current template -> call onEdit. Otherwise call onCreate
        if (page && onEdit) {
            onEdit(newPage);
        } else if (onCreate) {
            onCreate(newPage);
        }
    };
    

    //--------------------RENDERING--------------------
    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem", backgroundColor: "#f2f2f2", borderRadius: "8px" }}>
            <h1 style={{ textAlign: "center", color: "#333" }}>{page ? "Edit Page" : "Create New Page"}</h1>
                
            <label style={{ display: "block", marginBottom: "1rem" }}>
                <h2 style={{ marginBottom: "0.5rem" }}>Title:</h2>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}/>
            </label>
                
            <label style={{ display: "block", marginBottom: "1rem" }}>
                <h2 style={{ marginBottom: "0.5rem" }}>Description:</h2>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minHeight: "100px" }}/>
            </label>
                
            <label style={{ display: "block", marginBottom: "1rem" }}>
                <h2 style={{ marginBottom: "0.5rem" }}>Image URL:</h2>
                <input type="text" value={image} onChange={e => setImage(e.target.value)} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}/>
                {image && <img src={image} alt="Preview" style={{ display: "block", maxWidth: "100%", height: "auto", marginTop: "1rem" }} />}
            </label>
                
            <button type="submit" style={{ padding: "1rem", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
                {page ? "Update Page" : "Create Page"}
            </button>

            <button onClick={() => navigate('/')} style={{ padding: "1rem", borderRadius: "4px", border: "none", backgroundColor: "#6c757d", color: "white", cursor: "pointer", marginLeft: "1rem" }}>
                Cancel
            </button>
        </form>
    );
};


export default NewPageForm;
