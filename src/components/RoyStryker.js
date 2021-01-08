import { connect } from 'react-redux';
import Photographer from './Photographer.tsx';

const mapStateToProps = state =>  {
  return {
    selectedPhotographerData: {
      key: 'RoyStryker',
      img: 'RoyStryker.jpg',
      type: 'fsa',
      locId: 'http://id.loc.gov/authorities/names/n50010526',
      interview: {
        name: 'Oral history interview with Roy Emerson Stryker, 1963-1965. Archives of American Art, Smithsonian Institution.',
        link: 'https://www.aaa.si.edu/collections/interviews/oral-history-interview-roy-emerson-stryker-12480',
        files: [
          {
            recording: 'stryker1/recording.mp3',
            transcript: 'stryker1/transcript.json'
          },
          {
            recording: 'stryker2/recording.mp3',
            transcript: 'stryker2/transcript.json'
          },
          {
            recording: 'stryker3/recording.mp3',
            transcript: 'stryker3/transcript.json'
          },
          {
            recording: 'stryker4/recording.mp3',
            transcript: 'stryker4/transcript.json'
          },
          {
            recording: 'stryker5/recording.mp3',
            transcript: 'stryker5/transcript.json'
          }
        ]
      },
      bio: [
        'Born in Great Bend, Kansas on November 5, 1893, Stryker grew up in Montrose, Colorado where his father was a farmer. World War I interrupted his education at the Colorado School of Mines. After serving in the infantry, he returned briefly to his studies in Colorado, but then married and moved to New York City to attend Columbia University, where he studied economics. He graduated in 1924 and remained at the university as an instructor. He collaborated closely with his mentor, the economist Professor Rexford G. Tugwell, and their colleague Thomas Munro, on an introductory economics textbook entitled *American Economic Life*. Working on the book furthered his already keen interest in the power of photography to illustrate and persuade. Stryker’s time at Columbia also firmly situated the young economist within the networks of the intellectual, progessive elite who would be fundamental to the New Deal. When Tugwell left to join the Roosevelt administration’s “Brain Trust and organize the Resettlement Administration in an effort to ameliorate the farm crisis, Stryker followed his mentor to D.C. in 1935.',
        'As head of the Resettlement Administration’s Historical Section, Stryker’s official goal was to document the work of rural resettlement. With the guidance of talented colleagues then in DC such as the brilliant researcher and journalist Ernestine Evans, Stryker quickly focused on photography, hiring adept photographers to whom he provided space to pursue their own interests and visions within their government brief. The Resettlement Administration was reorganized and renamed the Farm Security Administration in 1937. While the initial goal was to capture the success of government-funded projects such as farm resettlements and green belt towns, the agency rapidly expanded its aims to creating an entire archive of American life. It was this mission that Stryker would go to great lengths to protect and that would earn him the admiration of his colleagues. When the United States entered World War II, the Historical Section was transferred for a third time to the Office of War Information, where the comprehensive photographic record made by Stryker’s team provided an encompassing picture of the home front. In 1943, the Historical Section was dissolved, and after successfully seeing to the preservation of the photographic File, now containing over 176,000 photographs, Stryker left for the Standard Oil Company, where he launched a documentary project modeled on the Historic Section and hired former colleagues [Esther Bubley] (/photographers/EstherBubley), [John Collier] (/photographers/JohnCollier), [Russell Lee] (/photographers/RussellLee), [Gordon Parks] (/photographers/GordonParks), [Louise Rosskam] (/photographers/LouiseRosskam), [Edwin Rosskam] (/photographers/EdwinRosskam), and [John Vachon] (/photographers/JohnVachon). When the Standard Oil project ended in 1950, Stryker continued for the next two decades to engage in documentary projects including for the City of Pittsburg and the Johns & Laughlin Steel Company. Stryker died on September 27, 1975, in Grand Junction, Colorado.'
      ],
      firstname: 'Roy',
      lastname: 'Stryker'
    },
    expandedSidebar: state.expandedSidebar,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Photographer);
