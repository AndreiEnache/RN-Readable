import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment, Button } from 'semantic-ui-react';

const NotFound = ({ history }) => (
  <React.Fragment>
    <Button onClick={() => history.push('')}>Back to home</Button>
    <Segment>
      <span>The post you were looking for was not found</span>
    </Segment>
  </React.Fragment>
);

NotFound.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NotFound;
