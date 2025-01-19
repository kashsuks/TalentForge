# TalentForge
A localhost app used to exchange skills with others
# Project: Talent Forge- A Community-Based Skill Web App  

## Inspiration  
The idea for **Talent Forge** was inspired by a common challenge faced by students and young professionals: building valuable experience without the financial resources to access services.  Building a standout resume or showcasing key work can be tough, so we’ve created a platform to simplify it. 


As high school students, we saw how many people possess skills that could benefit others, and we wanted to create a platform where users could exchange these skills directly, without relying on money. Talent Forge promotes a community-driven approach where members can:  

- **Request** skills they need  
- **Share** what they can offer through their resume

For us, imagine programmers able to share their web development skills for back-end programming lessons or offer tutoring services in return. This approach fosters a collaborative environment, enabling skill development in an accessible, inclusive, and sustainable way.  

---

## What We Learned  
Building Skillful taught us valuable lessons across multiple domains:  

### **User Experience (UX) Design**  
Designing a welcoming interface was essential for us to create a simple web app where users can make skill exchanges easy. We prioritized accessibility and a seamless flow to support first-time users unfamiliar with skill-sharing platforms.  

### **Privacy & Authentication/Auth0)**  
Implementing a system to match users based on complementary skills required thoughtful planning. We wanted to be quick and secure with Auth0. Each account is tied to one email and device to protect users and keep things safe. 


### **Database Management**  
Handling user profiles, skill sets, and trade history called for a database structure. This project developed our skills in MongoDB and managing user-generated data effectively through various databases.  


---

## How We Built It  

- **Backend Development**:  
  We used **Node.js** and **Express.js** to power the backend, setting up user profiles, managing sessions, and enabling skill exchange matches through API endpoints.  

- **Database with MongoDB**:  
 MongoDB was chosen for its flexibility, allowing us to store and organize data for user details, skills offered, and desired skills.  

- **Front-End Development**:  
 Built with **React**, our front end is responsive, with components for profile creation, skill browsing, and resume upload. Users can set up profiles, specify skills they’re looking to learn, and list skills they can offer.  

- **Groq Console API to Anaylse Resumes**:  
 After logging in, resumes are uploaded, and with the help of Groq’s AI, we summarize and highlight key details like education and experience. The result? A polished, private portfolio to help users shine.

- **Authentication and Security**:  
  Using **Auth0**, we ensured secure login and registration processes, safeguarding users’ data and providing a safe environment.  

---

## Challenges Faced  

### **Majority of teammates first time using MongoDB Atlas*  
Developing a matching algorithm that consistently produced relevant and mutually beneficial pairings took experimentation. We refined the algorithm to consider factors like skill compatibility and location to optimize results.  

### **Figure How to Implement Groq's API **  
Encouraging ongoing participation was a challenge, so we introduced features like badges, skill endorsements, and reviews to foster trust and incentivize engagement.  

---

## Future Improvements  

Looking ahead, we see exciting opportunities to enhance Talent Forge:  

- **Reputation System**:  
  Implementing a rating or reputation system would allow users to assess each other’s reliability quickly, fostering trust within the community.  

- **Skill Verification**:  
  Introducing skill verification features could add credibility to profiles, helping users feel more confident in their exchanges.  

