import { connect } from 'react-redux';
import Photographer from './Photographer.tsx';

const mapStateToProps = state =>  {
  return {
    selectedPhotographerData: {
      key: 'CBBaldwin',
      img: 'CBBaldwin.jpg',
      type: 'fsa',
      locId: "http://id.loc.gov/authorities/names/n91093629",
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
        'Born on August 19, 1902, Baldwin grew up in the town of Radford, Virginia. While he never finished his studies at Virginia Polytechnic Institute (known as Virginia Tech), his real education occurred outside the classroom. He became close friends with a journalist named Paul Appleby, who moved to Radford in 1928 to run the local newspaper.  The friendship solidified Baldwin’s embrace of progessive politics. Appleby left for D.C. to work with Secretary of Agriculture Henry A. Wallace around 1933, and soon called his friend with an offer to work in the Roosevelt Administration.',
        'Baldwin moved his family to D.C. and initially took a position working with Henry Wallace alongside Appleby. Soon after, he became an assistant to Rexford Tugwell in the Resettlement Administration and then an administrator in the FSA. Along with earning a reputation as a radical due to his dedication to alleviating poverty, Baldwin believed in and helped to guarantee the long term preservation of the photographic work of the Historical Section. When the FSA ended, he worked with Roy Stryker to transfer the unit to the OWI, and later, when his colleague Archibald MacLeish was named the Librarian of Congress, Baldwin helped facilitate the transfer of the File to the Library of Congress. Following the New Deal, Baldwin remained active in progressive politics, working with groups such as the Congress of Industrial Organizations (CIO), Progessive Citizens of America (PCA), and Progresive Party. Later in life, he settled in Connecticut, where he died on May 12, 1975.'
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
