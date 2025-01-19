import React, { useState } from 'react';
import './AddResume.css';

function AddResume() {
    const [file, setFile] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '', show: false });

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log('Selected file:', selectedFile);
        setFile(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('File being uploaded:', file);
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await fetch('http://localhost:3100/users/upload', {
                method: 'POST',
                body: formData,
            });
            console.log('Upload response:', response);
    
            if (response.ok) {
                const responseData = await response.json();
                console.log('Server response data:', responseData);
                setNotification({ message: "Resume uploaded successfully!", type: 'success', show: true });
            } else {
                console.error('Upload failed with status:', response.status);
                setNotification({ message: "Failed to upload resume.", type: 'error', show: true });
            }
        } catch (error) {
            console.error('Error during resume upload:', error);
            setNotification({ message: "There was an error uploading the resume.", type: 'error', show: true });
        }
    };

    const closeNotification = () => {
        setNotification({ ...notification, show: false });
    };

    return (
        <div className="add-resume">
            <h1>Upload Your Resume<span className="dot">.</span></h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                <button type="submit">Upload Resume</button>
            </form>

            {/* Inline notification */}
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    <span>{notification.message}</span>
                    <button onClick={closeNotification}>&times;</button>
                </div>
            )}
        </div>
    );
}

export default AddResume;
