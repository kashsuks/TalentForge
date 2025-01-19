import React, { useEffect, useState } from 'react';
import './MyDashboard.css';

function MyDashboard() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch('http://localhost:3100/jobs/get-all-jobs');
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                } else {
                    setError("An error occurred while fetching job requests");
                }
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("An error occurred while fetching job requests");
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="dashboard-page">
            <h1 className="dashboard-title">Opportunities<span className="dot"></span></h1>
            <div className="dashboard-jobs-list">
                {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                        <div key={index} className="dashboard-job-summary">
                            <p><strong>Requested Skill:</strong> {job.requestedSkill}</p>
                            <p><strong>My Skill:</strong> {job.mySkill}</p>
                            <p><strong>Description:</strong> {job.description}</p>
                            <p><strong>Due Date:</strong> {job.dueDate}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            {job.comments && <p><strong>Comments:</strong> {job.comments}</p>}
                        </div>
                    ))
                ) : (
                    <p>No active job requests found.</p>
                )}
            </div>
        </div>
    );
}

export default MyDashboard;
