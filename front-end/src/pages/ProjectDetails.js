import React from 'react';
import ProjectInfo from '../components/ProjectInfo';
import CompanyLogos from '../components/CompanyLogos';
import JoinUsSection from '../components/JoinUsSection';
import './ProjectDetails.css';

const ProjectDetails = () => {
  return (
    <div className="project-details">
      <ProjectInfo />
      <CompanyLogos />
      <JoinUsSection />
    </div>
  );
};

export default ProjectDetails;
