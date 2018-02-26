import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Segment, Item } from 'semantic-ui-react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PostListItem from '../Posts/PostListItem';
import CommentList from './CommentList';
import { loadPostById, loadCommentsForPost, addComment } from '../../actions';
import { getPostById, getCategory } from '../../reducers/posts';
import AddComment from './AddComment';

class Comments extends Component {
  componentDidMount() {
    const { postId } = this.props.match.params;
    this.props.loadPostById(postId);
  }
  handleBack = () => {
    this.props.history.push(`/${this.props.category === 'all' ? '' : this.props.category}`);
  };
  handleAdd = (comment) => {
    const { post } = this.props;
    this.props.addComment({ ...comment, parentId: post.id });
    this.props.history.push(`/${post.category}/${post.id}`);
  };
  handleEdit = () => {};
  render() {
    const { post } = this.props;
    const { postId, action } = this.props.match.params;
    const replyOpened = action === 'add';
    return (
      <React.Fragment>
        <Button onClick={this.handleBack}>Back</Button>
        <Segment>
          <Item.Group>
            <PostListItem post={post} from="comments" />
          </Item.Group>
          <Link
            href={replyOpened ? `/${post.category}/${post.id}` : `/${post.category}/${post.id}/add`}
            to={replyOpened ? `/${post.category}/${post.id}` : `/${post.category}/${post.id}/add`}
          >
            Reply
          </Link>
        </Segment>
        <Route
          component={() => <AddComment onAdd={this.handleAdd} />}
          path="/:category/:postId/add"
        />
        {postId ? <CommentList postId={postId} categoryName={post.category} /> : ''}
      </React.Fragment>
    );
  }
}

Comments.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    category: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      action: PropTypes.string,
      postId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  addComment: PropTypes.func.isRequired,
  loadPostById: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
};

Comments.defaultProps = {
  post: {},
};

const mapStateToProps = (state, ownProps) => ({
  post: getPostById(state, ownProps.match.params.postId),
  category: getCategory(state),
});

export default connect(mapStateToProps, {
  loadPostById,
  loadCommentsForPost,
  addComment,
})(Comments);
