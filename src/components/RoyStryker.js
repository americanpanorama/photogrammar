import { connect } from 'react-redux';
import Photographer from './Photographer.tsx';

const mapStateToProps = state =>  {
  return {
    selectedPhotographerData: {
      key: 'RoyStryker',
      img: 'RoyStryker.jpg',
      type: 'fsa',
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
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu risus sed lectus venenatis dignissim. Suspendisse in metus ut ex sollicitudin lobortis at a nisi. Nulla nec magna ligula. Mauris porttitor velit sed feugiat ornare. Nulla aliquet urna id tellus pulvinar, quis porta nisl tincidunt. Fusce ut magna ut odio venenatis tempus id sed nisi. Nunc pulvinar auctor erat eu dignissim. Vivamus aliquet pellentesque rhoncus. Praesent consectetur nisl sit amet risus bibendum, at luctus tellus efficitur. Fusce urna felis, interdum vel suscipit venenatis, interdum nec erat. Nulla id ipsum sodales, laoreet odio nec, varius massa. Donec sollicitudin dolor sapien, eu sodales diam tristique a. Nullam laoreet blandit gravida.',
        'Fusce non commodo arcu, quis iaculis velit. Sed mollis diam lorem, ut eleifend eros dignissim nec. Duis in lacus purus. Integer id aliquam metus, venenatis sollicitudin libero. Donec vel augue dolor. Etiam id maximus sem. Fusce lectus purus, gravida tempor viverra id, dictum ut ex. Praesent semper sit amet odio sit amet dignissim. Proin eu ultricies tellus, et tempor purus. Fusce id neque a dui lacinia interdum vitae porttitor dui. Curabitur nec quam placerat, sagittis magna nec, hendrerit velit. Donec id sapien at erat sodales dignissim. Nunc eu mi eget arcu sollicitudin iaculis ut luctus nulla. In a ultrices elit, vel varius libero.'
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
