import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

class AddNewPostButton extends Component {
  handleNewPostClick = () => {
    this.props.history.push('/posts/add');
  };
  render() {
    return (
      <div className="new-post">
        <Button circular color="blue" icon="add" size="huge" onClick={this.handleNewPostClick} />
      </div>
    );
  }
}

AddNewPostButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default AddNewPostButton;
