import { connect } from 'react-redux';
import Photographer from './Photographer.tsx';

const mapStateToProps = state =>  {
  return {
    selectedPhotographerData: {
      key: 'AikenAndWool',
      img: 'HelenWool.jpg',
      locId: "http://id.loc.gov/authorities/names/nr2004032735",
      type: 'fsa',
      interview: {
        name: 'Oral history interview with Charlotte Aiken and Helen Wool, 1964 April 17. Archives of American Art, Smithsonian Institution.',
        link: 'https://www.aaa.si.edu/collections/interviews/oral-history-interview-charlotte-aiken-and-helen-wool-11653',
        files: [
          {
            recording: 'aiken1/recording.mp3',
            transcript: 'aiken1/transcript.json'
          },
          {
            recording: 'aiken2/recording.mp3',
            transcript: 'aiken2/transcript.json'
          }
        ]
      },
      bio: [
        'Helen D. Shapiro Wool was born on July 22, 1910 in Russia, she moved to the United States.  At age 19, she was living in Washington D.C. with her uncle’s family and working as a stenographer.  A year later, she married Frank Wool in March 1931.  When her husband planned to sell their grocery store business upon being drafted into World War II, Wool sought employment to support her two young daughters.  A political appointee to the Historic Section in 1940, she worked as a secretary for Roy Stryker.  Her roles included typing and revising letters, printing and pasting photo captions, and coordinating traveling exhibitions.  Among her many contributions was her important role in crafting the letter to President Roosevelt that successfully resulted in transferring and preserving the File. While Stryker tried to convince her to move to New York with him in 1943, she stayed in the D.C. working in similar roles within and outside of government including the Treasury Department and Curtis Circulation Company.  She passed away on December 20, 1998.',
        'Charlotte Singleton Coker Aiken was born on August 18, 1911 in Hartsville, South Carolina, Coker attended college and graduated as the Great Depression raged. Following a job as a foreman at a nursery school in her home state, she transitioned to office work upon moving to Washington D.C. with her husband. Having taken her husband’s last name of Aiken, she began working in the Payroll Section of the Resettlement Administration. Seeking a more engaging job, she harnessed her network.  Roy Stryker hired her in 1936. While he would lay her off due to financial constraints in 1937, he quickly rehired her in 1938.  Her work keeping the financial books meant Aiken knew the inner workings of the unit, including closely following the travels of the photographers. Like most of the staff, her job was not strictly defined so tasks also included ensuring the negatives were in cold storage, which helped preserve the photographs, as well as creating materials, such as the leaflets dropped in advance of D-Day in France. Following her time at the Historic Division, she worked in the government budget office for several years and would end her career as Executive Librarian for USIA. She passed away on September 28, 1967.'
      ],
      firstname: 'Charlotte Aiken, Accountant, and',
      lastname: 'Helen Wool (pictured), Secretary, FSA'
    },
    expandedSidebar: state.expandedSidebar,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Photographer);
