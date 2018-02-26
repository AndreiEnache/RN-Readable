import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Form } from 'semantic-ui-react';

class AddComment extends Component {
  state = { body: '', author: '' };
  componentDidMount() {
    // eslint-disable-next-line
    this.setState({ ...this.props.comment });
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    });
  };
  handleSubmit = () => {
    const comment = { ...this.state };
    /* eslint-disable */
    this.props.onAdd && this.props.onAdd(comment);
    this.props.onEdit && this.props.onEdit(comment);
    /* eslint-enable */
  };
  render() {
    const { body, author, id } = this.state;
    return (
      <Segment>
        <Form onSubmit={this.handleSubmit}>
          {id ? (
            ''
          ) : (
            <Form.Input
              placeholder="Author"
              label="Author"
              onChange={this.handleChange}
              name="author"
              value={author}
            />
          )}
          <Form.TextArea label="Body" onChange={this.handleChange} value={body} name="body" />
          <Form.Button primary>{id ? 'Save' : 'Add'}</Form.Button>
        </Form>
      </Segment>
    );
  }
}

AddComment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    author: PropTypes.string,
    body: PropTypes.string,
  }),
};

AddComment.defaultProps = {
  comment: {
    id: undefined,
    author: '',
    body: '',
  },
};

export default AddComment;
