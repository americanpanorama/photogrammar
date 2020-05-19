import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import MicrophoneButton from './buttons/Microphone.jsx';
import './Photographers.css';

const Photographers = ({ photographersStaff, photographersNonstaff }) => {
  return (
    <div
      className='photographers'
    >
      <div className='explanation'>
        <p>Over 40 photographers contributed to the FSA-OWI collection.  Yet, hiring and keeping photographers was a difficult task. The financial and political instability of the New Deal meant that funding could disappear as quickly as it appeared. Resourceful as well as protective of his colleagues, director of the FSA Historical Section Roy Stryker went to great lengths to keep the unit operating. While thirteen people were hired as staff photographers, and therefore on more stable and continuing employment, most photographers were hired on short term contracts that were often renewed or took photographs while holding another position within the federal government. Over half of the photographers worked for more than a year with a smaller set of photographers employed over several years, many of whom are among the best known such as Dorothea Lange and Arthur Rothstein.</p>
        <p>The number of photographers and amount of images resulted in a collection shaped by government mandates and expanded by individual photographers interests and political commitments. Photographers received instructions from Stryker discussing particular topics to cover such as farming, small towns, and war mobilization. Among the most prescriptive instructions were shooting scripts, which outlined in detail topics to capture such as tobacco along with lists of particular types of actions such as hauling tobacco to market. The topics reflected Stryker’s interests as well as demands from patrons including journalists, writers, and federal workers from other units. At the same time, Stryker recognized that letting the photographers pursue their own interests would lead to a more robust, representative, and influential archive of the era. Therefore, photographers snapped away following their own lines of sight as well as the needs of the federal government, a delicate balance that Stryker and many of the photographers expertly navigated.</p>
        <p>
          By selecting a photographer's name, you can explore the images that each photographer created. A short biography is provided for most photographers. As more information is available, the biography will be updated.  An oral interview with a transcript is also provided for several photographers as well as Roy Stryker, marked with a 
          <MicrophoneButton />.
          The interviews are a part of an initiative from the Smithsonian Archives of American Art's New Deal and the Arts project, which conducted oral histories with over 400 artist and art administors from 1963-1965.
        </p>
      </div>
      <div className='photographersGroups'>
        <div className='photographerCards'>
          <Link
            to='/photographers/RoyStryker'
          >
            <figure
              className='photographerCard'
            >
              <img
                src={`${process.env.PUBLIC_URL}/static/photographerPhotos/RoyStryker.jpg`}
              />
              <figcaption>
                <MicrophoneButton />
                Roy Stryker, Director of the FSA Photography Program
              </figcaption>
            </figure>
          </Link>

          <Link
            to='/photographers/AikenAndWool'
          >
            <figure
              className='photographerCard'
            >
              <img
                src={`${process.env.PUBLIC_URL}/static/photographerPhotos/HelenWool.jpg`}
              />
              <figcaption>
                <MicrophoneButton />
                Charlotte Aiken, Accountant, and Helen Wool (pictured), Secretary, FSA
              </figcaption>
            </figure>
          </Link>
        </div>
        <h3>Staff Photographers</h3>
        <div className='photographerCards'>
          {photographersStaff.map(photographer => (
            <Link
              to={`/photographers/${photographer.key}`}
              key={`${photographer.key}`}
            >
              <figure
                className='photographerCard'
              >
                <img
                  src={`${process.env.PUBLIC_URL}/static/photographerPhotos/${photographer.img}`}
                />
                <figcaption>
                  <span
                    className='count'
                  >
                    {`${photographer.count.toLocaleString()} photos`}
                  </span>
                  {(photographer.interview && photographer.interview.files && photographer.interview.files.length > 0) && (
                    <MicrophoneButton />

                  )}

                  {`${photographer.firstname} ${photographer.lastname}`}
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>

        <h3>Non-staff Photographers</h3>
        <div className='photographerCards'>
          {photographersNonstaff.map(photographer => (
            <Link
              to={`/photographers/${photographer.key}`}
              key={`${photographer.key}`}
            >
              <figure
                className='photographerCard'
              >
                <img
                  src={`${process.env.PUBLIC_URL}/static/photographerPhotos/${photographer.img}`}
                />
                <figcaption>
                  {(photographer.count) && (
                    <span
                      className='count'
                    >
                      {`${photographer.count.toLocaleString()} photos`}
                    </span>
                  )}
                  {(photographer.interview && photographer.interview.files && photographer.interview.files.length > 0) && (
                    <MicrophoneButton />
                  )}

                  {`${photographer.firstname} ${photographer.lastname}`}
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Photographers;

Photographers.propTypes = {
  photographersStaff: PropTypes.array.isRequired,
};

Photographers.defaultProps = {

};
