import * as React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div id='about'>
      <h2>About</h2>

      <div className='credit'>
        <div className='label'>Contact</div>
        <div className='value'>Lauren Tilton (ltilton@richmond.edu)</div>
      </div>
      <div className='credit'>
        <div className='label'>Citation</div>
        <div className='value'>T. Arnold, N. Ayers, J. Madron, R. Nelson, L.Tilton, L. Wexler. <cite>Photogrammar</cite> (Version 3.0). 2021.</div>
      </div>
      {/* <div>Download: [metadata], [source code], [design documents], [publications (zip)]</div>  */}

      <p><cite>Photogrammar</cite> provides a web-based visualization platform for exploring the 170,000 photographs taken by the FSA and OWI agencies of the U.S. Federal Government between 1935 and 1943. The project is maintained by the Digital Scholarship Lab (DSL) and Distant Viewing Lab (DV Lab) at the University of Richmond. Lauren Tilton is the director of the project. Taylor Arnold leads the data curation and analysis. Rob Nelson develops and maintains the web-based application. Nathaniel Ayers designed the site and Justin Madron provided GIS support. Laura Wexler managed the grants. Publications, additional contributors, and major milestones of the project are described in the sections below. The project has been supported by grants from the National Endowment for the Humanities (NEH), American Council of Learned Societies (ACLS), and Yale University with ongoing support from the University of Richmond. The <a href='https://www.loc.gov/pictures/collection/fsa/' target='_blank'>FSA-OWI archive</a> is housed at the Library of Congress, which digitized and maintains the collection including details about copyright.</p>

      <h4>Version 3.0 (2021 - Present)</h4>

      <p>The latest version of <cite>Photogrammar</cite> is now housed at the University of Richmond. The version is created by an interdisciplinary team collaborating across three institutions. The new components include:</p>

      <ul>
      <li>The site now offers more historical context to support users interested in learning about the FSA-OWI as a government agency and the individual photographers through (1) an introductory essay, (2) <Link to='/photographers'>oral interviews with Historic Division staff and photographers</Link> conducted by the Smithsonian Archives of American Art (AAA) in the 1970s, and (3) biographies of staff and photographers. Previously, clips from the audio and PDFs were only available. Through a collaboration between the <cite>Photogrammar</cite> team and the Smithsonian Archives of American Art (AAA), the result is unprecedented access to the full audio and searchable text to interviews with Historic Division staff and photographers, offering a new lens into the division’s inner workings including from lesser heard voices. </li>
      <li>A completely redesigned generous interface that reveals the scale and complex scope of the collection. The new design (1) immediately provides multiple points of entry into the collection, (2) allows users to engage the actual photographs quicker, (3) increases access and discovery particularly of lesser known photos and photographers, and (4) adds distant viewing techniques through recommender systems. For more information, see Arnold et al. “Visualizing a Large Spatiotemporal Collection of Historic Photography with a Generous Interface,” IEEE Vis4DH (2020, arXiv:2009.02242).</li>
      <li>A new interactive interface for seeing the shooting order for approximately 40,000 images. The shooting order was maintained due to the preservation of the film strips (usually 3 to 5 images in a strip) by the Library of Congress. <cite>Photogrammar</cite> allows the user to see the photograph in shooting order by harnessing the metadata created by the LOC. The ability to explore the strips allows users to see photos that were once disconnected in relation to related images as well as to follow the line of sight and decision making of the photographer. For more about the process, see [this archived blog post]. </li>
      <li>A new application built using open access technologies include React.js. The code is available via a <a href='https://github.com/americanpanorama/photogrammar' target='_blank'>GitHub repository</a>.</li>
      </ul>

      <p>The version is made possible with generous funding from an American Council of Learned Societies (ACLS) Digital Extension Grant. As a part of the grant, another goal was to integrate the Federal Writers Project (FWP) Southern Life Histories Project. The team decided that the scale and scope of the materials was best shared as its own digital project, which will be released as Voice of a Nation (Stanford University Press, forthcoming) by Taylor Arnold, Courtney Rivard, and Lauren Tilton. The data is open access and available here (Zenodo link).</p>

      <div className='credit'>
        <div className='label'>Contributors</div>
        <div className='value'>Taylor Arnold, Nathaniel Ayers, Justin Madron, Rob Nelson, Courtney Rivard (University of North Carolina, Chapel Hill), Lauren Tilton, Laura Wexler (Yale University).</div>
      </div>

      <div className='credit'>
        <div className='label'>Grant</div>
        <div className='value'>ACLS Digital Extension Grant</div>
      </div>

      <h4>Version 2.0 (2014 - 2020)</h4>

      <p>The second version featured our explorations of emerging techniques from the digital humanities (DH) for possible extensions to the project. One feature became fully integrated into the project. A guiding philosophy of <cite>Photogrammar</cite> is exploration. The goal is for users to be able to keep moving through the archive in different ways in order to encounter lesser known photographs and photographers from the collection. One approach to this is recommender systems, an information filtering engine that offers suggestions for other content to explore. The team added a recommender system based on unique terms in the photograph captions, specifically an approach called Term Frequency-Inverse Document Frequency (TF-IDF). For more information, see Arnold, Leonard, & Tilton “Knowledge Creation Through Recommender Systems,” <cite>Digital Scholarship in the Humanities</cite> (2017, https://doi.org/10.1093/llc/fqx035).</p>
      <p>We also developed a Labs section to share our experiments and prototypes in the open. There were three components:</p>

      <ul>
      <li>Treemap: Visualization of the classification system designed by Paul Vanderbilt in 1942. It is a three-tier classification starting with 12 main subject headings (ex. THE LAND), then 1300 sub-headings (ex. Mountains, Deserts, Foothills, Plains) and then sub-sub headings. 88,000 photographs were assigned classifications. The treemap has been integrated into a full feature in <cite>Photogrammar</cite> 3.0.</li>
      <li>Metadata Dashboard: Interactive dashboard showing the relationship between date, county, photographer, and subject in photographs from individual states. The dashboard featured California.</li>
      <li>Colorspace: Using computer vision, the lab allowed users to explore the 1,700 color photographs based on hue, saturation and lightness. This lab was one of the team’s first forays into distant viewing using computer vision. </li>
      </ul>

      <p>A final lab that was not made public included the use of facial recognition. The photographs were plotted on a map. When a user selected a place, thumbnails of the people depicted in those places appeared. The lab was an early experiment with computer vision; however, the team’s discomfort with some of the algorithmic decision making resulted in the lab remaining private. For a video of the lab, visit here. </p>
      <p>For this version, Wexler served as PI. Arnold and Tilton were co-directors. Leonard led the lab experiments. Kirkpatrick was project manager. </p>

      <div className='credit'>
        <div className='label'>Contributors</div>
        <div className='value'>Taylor Arnold, Trip Kirpatrick, Peter Leonard, Lauren Tilton, Laura Wexler.</div>
      </div>

      <p>For a related article about how the digital public humanities offers new avenues for humanistic inquiry within the fields of Rhetoric and Communication, which uses <cite>Photogrammar</cite> as a case study, see Cox and Tilton, “The Digital Public Humanities: Giving New Arguments and New Ways to Argue,“ <cite>Review of Communication</cite> (2019, https://doi.org/10.1080/15358593.2019.1598569). 
      </p>

      <h4>Version 1.0 (2012 - 2014)</h4>

      <p>Over the course of two years, the team turned the prototype into an open access digital humanities project, which launched in 2015. The main component was an interactive map that allowed users to explore photographs by location, time, and photographer. The map also functioned as a visual argument: The Historic Division was a national project that took place during the Great Depression and War World War II populated with images from photographers who have enjoyed less recognition in popular culture. To further augment the map, the team scanned and georectified a transportation map (1937 Vico Motor Oil Map from the Yale University Library Map Collection) allowing users to follow the path of the photographers over time and space. </p>
      <p>While the map was the primary interface and a newer way to access and discover images in an archive, the team recognized the importance of search to users, who were accustomed to the feature as a mode for archival discovery. The Search page harnessed the detailed metadata developed by the Library of Congress to develop open text and predictive search. Additional features included search by Lot, usually a group of photographs in the same shooting assignment, and Classifications Tags, based on subjects; both systems for organizing the physical prints were developed by archivist Paul Vanderbilt in the early 1940s for the Library of Congress. </p>
      <p>The version was made possible with generous funding from a National Endowment for the Humanities Digital Humanities Start-Up Grant (#, link to grant). Wexler served as PI. Arnold and Tilton were co-directors. Maples was the GIS specialist. Panko was the project manager. Yale University housed the project. The team is also appreciative of the support and expertise of Beverly Brannan, Curator for 20th Century Documentary Photography in the Library of Congress, and expert on the FSA-OWI File.</p>

      <div className='credit'>
        <div className='label'>Contributors</div>
        <div className='value'>Taylor Arnold, Ken Panko, Stacey Maples, Lauren Tilton, Laura Wexler.</div>
      </div>
      <div className='credit'>
        <div className='label'>Grant</div>
        <div className='value'>National Endowment for the Humanities Digital Humanities Start-Up Grant </div>
      </div>
      <h4>Prototype (2010 - 2012)</h4>

      <p>The project began in Fall 2010 as a collaboration between Lauren Tilton, a graduate student in American Studies, and Taylor Arnold, a doctoral candidate in the Department of Statistics. The concept of <cite>Photogrammar</cite> was developed over conversations about how to use statistics and data science to increase access to large cultural data sets. The prototype — a digital, public humanities site for search and discovery of a photographic archive through a map and search — and NEH grant were a final project for Introduction to Public Humanities, a course taught by Dr. Laura Wexler as a part of the Public Humanities program that she helped found. </p>
      <p>Why “<cite>Photogrammar</cite>”? The name brings together two words — photography and grammar — to indicate how the project offers new ways to read, see, and view photography. The name was inspired by work such as Roland Barthes, known for semiotics and theorizing photography, alongside Jacque Bertrand and Leland Wilkinson, known for developing a language for how data visualizations make meaning that is often referred to as the grammar of graphics. The name signals the combination of photography theory and data visualization. Finally, the name is an homage to the work and mentorship of Laura Wexler, whose commitment to training the next generation of photography and public humanities scholars as well as openness to new ideas and interdisciplinary inquiry continue to guide this project. </p>

      
      <div className='credit'>
        <div className='label'>Contributors</div>
        <div className='value'>Taylor Arnold, Lauren Tilton.</div>
      </div>
    </div>
  );
};

export default About;
