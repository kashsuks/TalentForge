import React, { useState } from 'react';
import "./SkillRequestForm.css";

function SkillRequestForm() {
    // Updated skill categories
    const skillCategories = [
        'Technology', 'Business', 'Legal', 'Health & Wellness', 'Creative', 'Education'
    ];

    const locations = ['Online', 'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Quebec City'];

    const [formData, setFormData] = useState({
        skillToRequest: '',
        skillToOffer: '',
        description: '',
        dueDate: '',
        location: '',
        comments: ''
    });
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3100/jobs/post-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: formData.description,
                    requestedSkill: formData.skillToRequest,
                    mySkill: formData.skillToOffer,
                    location: formData.location,
                    dueDate: formData.dueDate,
                    comments: formData.comments
                })
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

        // Hide the notification after 3 seconds
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
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
                </div>

                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
}

export default SkillRequestForm;
