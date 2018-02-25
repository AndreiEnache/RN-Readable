import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Form, Header, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getCategoriesForPost, getPostById } from '../../reducers/posts';
import { loadCategories, addPost, loadPostById } from '../../actions';

class AddPost extends Component {
  state = {
    id: '',
    title: '',
    author: '',
    category: '',
    body: '',
  };

  componentDidMount() {
    this.props.loadCategories();
    const { postId } = this.props.match.params;
    if (postId) {
      this.props.loadPostById(postId);
      // eslint-disable-next-line
      this.setState({ ...this.props.post });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.id !== nextProps.post.id) {
      this.setState({
        ...nextProps.post,
      });
    }
  }
  handleSubmit = () => {
    const post = {
      ...this.state,
    };
    this.props.addPost(post, this.props.location.search.includes('comments'));
  };
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };
  handleBack = () => {
    const { id } = this.state;
    const { search } = this.props.location;
    if (id && search.includes('comments')) {
      this.props.history.push(`/post/${id}`);
    } else {
      this.props.history.push('');
    }
  };
  render() {
    const {
      title, category, body, author, id,
    } = this.state;
    const { categories } = this.props;
    return (
      <React.Fragment>
        <Button onClick={this.handleBack}>Back</Button>
        <Segment>
          <Header dividing>{id ? 'Edit post' : 'Add a new post'}</Header>
          <Form onSubmit={this.handleSubmit}>
            <Form.Input
              placeholder="Title"
              name="title"
              value={title}
              label="Title"
              onChange={this.handleChange}
            />
            {!id && (
              <Form.Input
                placeholder="Author"
                name="author"
                value={author}
                label="Author"
                onChange={this.handleChange}
              />
            )}
            {!id && (
              <Form.Dropdown
                selection
                options={categories}
                placeholder="Category"
                name="category"
                value={category}
                label="Category"
                onChange={this.handleChange}
              />
            )}
            <Form.TextArea label="Body" name="body" value={body} onChange={this.handleChange} />
            <Form.Button primary type="submit">
              {id ? 'Save' : 'Submit'}
            </Form.Button>
          </Form>
        </Segment>
      </React.Fragment>
    );
  }
}

AddPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  loadCategories: PropTypes.func.isRequired,
  loadPostById: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  addPost: PropTypes.func.isRequired,
};

AddPost.defaultProps = {
  post: {},
};

const mapStateToProps = (state, ownProps) => ({
  categories: getCategoriesForPost(state),
  post: getPostById(state, ownProps.match.params.postId),
});

export default connect(mapStateToProps, { loadCategories, addPost, loadPostById })(AddPost);
