import React, { useState, useRef } from 'react';
import "./SkillRequestForm.css";

function SkillRequestForm() {
    const skillCategories = ['Technology', 'Business', 'Legal', 'Health & Wellness', 'Creative', 'Education'];
    const locations = ['Online', 'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Quebec City'];

    const [formData, setFormData] = useState({
        skillToRequest: '',
        skillToOffer: '',
        description: '',
        dueDate: '',
        location: '',
        comments: '',
    });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formDataToSend = {
            description: formData.description,
            requestedSkill: formData.skillToRequest,
            mySkill: formData.skillToOffer,
            location: formData.location,
            dueDate: formData.dueDate,
            comments: formData.comments,
        };

        const formDataToUpload = new FormData();
        Object.keys(formDataToSend).forEach((key) => {
            formDataToUpload.append(key, formDataToSend[key]);
        });

        // Attach audio file if it exists
        if (audioBlob) {
            formDataToUpload.append('recording', audioBlob, 'recording.webm'); // Ensure 'recording' matches the backend field name
            // To acces the record just do http://localhost:3100/{filename upto local}
        }

        try {
            const response = await fetch('http://localhost:3100/jobs/post-job', {
                method: 'POST',
                body: formDataToUpload,
            });

            const result = await response.json();

            if (result.status) {
                setNotification({ message: "Request submitted successfully!", type: "success" });
            } else {
                setNotification({ message: "Failed to submit request.", type: "error" });
            }
        } catch (error) {
            console.error("Error posting job:", error);
            setNotification({ message: "There was an error submitting the request.", type: "error" });
        }

        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                audioChunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting recording:", err);
            setNotification({ message: "Failed to access microphone.", type: "error" });
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    return (
        <div className="form-page">
            <h1 className="page-title">Request a Skill</h1>

            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    <span>{notification.message}</span>
                    <button onClick={() => setNotification({ message: '', type: '' })}>×</button>
                </div>
            )}

            <form className="skill-request-form" onSubmit={handleSubmit}>
                <div className="form-container">
                    {/* Skill to Request */}
                    <label>
                        Skill to Request
                        <select name="skillToRequest" value={formData.skillToRequest} onChange={handleChange} required>
                            <option value="">Select a skill category</option>
                            {skillCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Skill to Offer */}
                    <label>
                        Skill to Offer
                        <select name="skillToOffer" value={formData.skillToOffer} onChange={handleChange} required>
                            <option value="">Select a skill category</option>
                            {skillCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Description */}
                    <label>
                        Description of Project
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Describe the task requirements"
                        />
                    </label>

                    {/* Due Date */}
                    <label>
                        Due Date of Project
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    {/* Location */}
                    <label>
                        Location
                        <select name="location" value={formData.location} onChange={handleChange} required>
                            <option value="">Select a location</option>
                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Additional Comments */}
                    <label>
                        Additional Comments (Optional)
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            placeholder="Additional Information..."
                        />
                    </label>

                    {/* Record Audio Section */}
                    <div>
                        <label>Record Audio (Optional)</label>
                        <button
                            type="button"
                            onClick={isRecording ? stopRecording : startRecording}
                            style={{
                                backgroundColor: isRecording ? '#dc3545' : '#007bff',
                                color: '#fff',
                                marginTop: '10px',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            {isRecording ? 'Stop Recording' : 'Record'}
                        </button>
                        {audioBlob && <p>Audio recording ready for upload.</p>}
                    </div>
                </div>

                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
}

export default SkillRequestForm;
