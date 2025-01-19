import React, { useEffect, useState } from 'react';
import './Profile.css';
import profilePhoto from '../assets/profile-picture.png';

function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [userJobs, setUserJobs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await fetch('http://localhost:3100/users/user-info');
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                } else if (response.status === 404) {
                    setError("User not found");
                } else {
                    setError("An error occurred while fetching the user info");
                }
            } catch (err) {
                console.error("Error fetching user info:", err);
                setError("An error occurred while fetching the user info");
            } finally {
                setLoading(false);
            }
        }

        async function fetchUserJobs() {
            try {
                const response = await fetch('http://localhost:3100/users/get-my-jobs');
                if (response.ok) {
                    const data = await response.json();
                    setUserJobs(data);
                } else {
                    setError("An error occurred while fetching your job requests");
                }
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("An error occurred while fetching your job requests");
            }
        }

        fetchUserInfo();
        fetchUserJobs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="profile-page">
            <h1 className="profile-title">Personal Info<span className="dot">.</span></h1>
            <div className="profile-card">
                <img src={profilePhoto} alt="Profile" className="profile-photo" />
                <div className="profile-info">
                    <p><strong>Name:</strong> {userInfo.name}</p>
                    <p><strong>Location:</strong> {userInfo.location}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Category:</strong> {userInfo.category.join(", ")}</p>
                </div>
            </div>

            <h2 className="jobs-title">My Job Requests<span className="dot">.</span></h2>
            <div className="jobs-list">
                {userJobs.length > 0 ? (
                    userJobs.map((job, index) => (
                        <div key={index} className="job-summary">
                            <p><strong>Requested Skill:</strong> {job.requestedSkill}</p>
                            <p><strong>My Skill:</strong> {job.mySkill}</p>
                            <p><strong>Description:</strong> {job.description}</p>
                            <p><strong>Due Date:</strong> {job.dueDate}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            {job.comments && <p><strong>Comments:</strong> {job.comments}</p>}
                        </div>
                    ))
                ) : (
                    <p>No job requests found.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;
