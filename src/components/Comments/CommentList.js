import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Comment, Segment } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import CommentListItem from './CommentListItem';
import AddComment from './AddComment';
import { adjustCommentScore, loadCommentsForPost, editComment, deleteComment } from '../../actions';
import { getCommentsForPost } from '../../reducers/comments';

class CommentList extends Component {
  componentDidMount() {
    this.props.loadCommentsForPost(this.props.postId);
  }

  handleVote = (comment, option) => () => {
    switch (option) {
      case 'upVote':
        this.props.adjustCommentScore(comment, 'upVote');
        break;
      case 'downVote':
        this.props.adjustCommentScore(comment, 'downVote');
        break;
      default:
    }
  };
  handleSaveComment = (comment) => {
    const { categoryName, postId } = this.props;
    this.props.editComment(comment);
    this.props.history.push(`/${categoryName}/${postId}`);
  };
  handleRemoveClick = comment => () => {
    this.props.deleteComment(comment);
  };
  render() {
    const { commentId } = this.props.match.params;
    const { comments, postId, categoryName } = this.props;
    return (
      <React.Fragment>
        {comments[0] ? (
          <Segment>
            <Comment.Group>
              {comments.map(comment => (
                <React.Fragment key={comment.id}>
                  <CommentListItem
                    comment={comment}
                    postId={postId}
                    categoryName={categoryName}
                    isEditing={commentId === comment.id}
                    onVote={this.handleVote}
                    onRemoveClick={this.handleRemoveClick}
                  />
                  {commentId === comment.id ? (
                    <AddComment onEdit={this.handleSaveComment} comment={comment} />
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ))}
            </Comment.Group>
          </Segment>
        ) : (
          <Segment textAlign="center">It&apos;s quiet in here...</Segment>
        )}
      </React.Fragment>
    );
  }
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({})),
  match: PropTypes.shape({
    params: PropTypes.shape({
      commentId: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  editComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  adjustCommentScore: PropTypes.func.isRequired,
  loadCommentsForPost: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  categoryName: PropTypes.string,
};

CommentList.defaultProps = {
  comments: [],
  categoryName: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  comments: ownProps.postId ? getCommentsForPost(state, ownProps.postId) : [],
});

export default withRouter(connect(mapStateToProps, {
  loadCommentsForPost,
  adjustCommentScore,
  editComment,
  deleteComment,
})(CommentList));
