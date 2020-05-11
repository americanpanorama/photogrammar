const fs = require('fs');
const path = require('path');

// parse the command line arguments
const componentName = process.argv[2];
const props = process.argv.slice(3, 100);

// create the stump files
const jsx = `
import React from 'react';
import PropTypes from 'prop-types';
import './${componentName}.css';

const ${componentName} = ({ ${props.map(p => p.split('.')[0]).join(', ')} }) => {
  return (
  );
};

export default ${componentName};

${componentName}.propTypes = {
${props
  .map(p => `  ${p.split('.')[0]}: PropTypes.${p.split('.')[1]}${(!p.split('.')[2] || p.split('.')[1] === 'func') ? '.isRequired': ''},`)
  .join('\n')
}
};

${componentName}.defaultProps = {
${props
  .filter(p => p.split('.')[2])
  .map(p => `  ${p.split('.')[0]}: ${p.split('.')[2]},`)
  .join('\n')
}
};
`;

const js = `
import { connect } from 'react-redux';
import ${componentName} from './${componentName}.jsx';
import { ${props.filter(p => p.split('.')[1] === 'func').map(p => p.split('.')[0]).join(', ')} } from '../store/actions';

const mapStateToProps = state => ({
${props.filter(p => p.split('.')[1] !== 'func').map(p => `    ${p.split('.')[0]}: ,`).join('\n')}
});

const mapDispatchToProps = {
${props.filter(p => p.split('.')[1] === 'func').map(p => `    ${p.split('.')[0]},`).join('\n')}
};

export default connect(mapStateToProps, mapDispatchToProps)(${componentName});
`;

// write the stump files
const componentDir = '../src/components';
fs.writeFileSync(path.format({
  dir: componentDir,
  name: componentName,
  ext: '.jsx'
}), jsx);
fs.writeFileSync(path.format({
  dir: componentDir,
  name: componentName,
  ext: '.js'
}), js);
fs.writeFileSync(path.format({
  dir: componentDir,
  name: componentName,
  ext: '.css'
}), '');
