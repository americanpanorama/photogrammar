import React from 'react';
import { Link } from "react-router-dom";
import './Welcome.css';

const Welcome = ({isOpen, closeWelcome}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div id='welcome'>
      <h2>Welcome!</h2>
      <p>
        Photogrammar is a web-based platorm for organizing, searching and visualizing the 170,00 photographs from 1935 to 1945 created by the United States Farm Security Administration and Office of War Information (FSA-OWI).
      </p>

      <div className='readmore'>
        <Link to={`/`}>
          Read more in the About section
        </Link>
      </div>

      <div className='close'>
        <button
          onClick={closeWelcome}
        >
          ^
        </button>
      </div>
    </div>
  );
};

export default Welcome;

