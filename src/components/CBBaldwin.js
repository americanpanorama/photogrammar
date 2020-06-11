import { connect } from 'react-redux';
import Photographer from './Photographer.jsx';

const mapStateToProps = state =>  {
  return {
    selectedPhotographerData: {
      key: 'CBBaldwin',
      img: 'CBBaldwin.jpg',
      type: 'fsa',
      interview: {
        name: 'Oral history interview with C. B. (Calvin Benhan) Baldwin, 1965 February 25. Archives of American Art, Smithsonian Institution.',
        link: 'https://www.aaa.si.edu/collections/interviews/oral-history-interview-c-b-calvin-benhan-baldwin-12303',
        files: [
          {
            recording: 'baldwinA/recording.mp3',
            transcript: 'baldwinA/transcript.json'
          },
          {
            recording: 'baldwinB/recording.mp3',
            transcript: 'baldwinB/transcript.json'
          },
        ]
      },
      bio: [
        'Born on August 19, 1902,  he grew up in Radford, Virginia among a family that embraced more progressive politics.  While he never finished his studies at  Virginia Polytechnic Institute (known as Virginia Tech), his education occurred outside the classroom.  He became close friends with Paul Appleby, who moved to town in 1928 to run the local newspapers and solidified Baldwin’s embrace of progessive politics.  When Appleby left for D.C. to work with Secretary of Agriculture Henry A. Wallace, he soon called his friend with an offer to work in the Roosevelt Administration.',
        'With his family, Baldwin moved to D.C. and took a position working with Wallace. He soon became an assistant to Rexford Tugwell in the Resettlement Administration and then an administrator in the FSA. Along with earning a reputation as a radical due to his work to alleviate poverty, he helped guarantee the long term preservation of the Historic Division. He worked with Roy Stryker to transfer the unit to the OWI and Archibald MacLeish, upon being named the Librarian of Congress, to transfer the File to the Library of Congress. Following the New Deal, Baldwin stayed active in progressive politics working with groups such as the Congress of Industrial Organizations (CIO), Progessive Citizens of America (PCA), and Progresive Party. He settled in Connecticut later in life, where he passed away on May 12, 1975.'
      ],
      firstname: 'C. B.',
      lastname: 'Baldwin'
    },
    expandedSidebar: state.expandedSidebar,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Photographer);
