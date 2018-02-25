import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import VoteScore from '../VoteScore/VoteScore';

const CommentListItem = ({
  comment, postId, categoryName, onVote, isEditing, onRemoveClick,
}) => (
  <Comment key={comment.id}>
    <Comment.Content>
      <Comment.Author>{comment.author}</Comment.Author>
      <Comment.Metadata>
        <div>Posted {moment(comment.timestamp).fromNow()}</div>
      </Comment.Metadata>
      <Comment.Text>{comment.body}</Comment.Text>
      <Comment.Actions>
        <div className="no-selection">
          <VoteScore
            voteScore={comment.voteScore}
            onUpVote={onVote(comment, 'upVote')}
            onDownVote={onVote(comment, 'downVote')}
          />
          <Link
            href={
              isEditing
                ? `/${categoryName}/${postId}`
                : `/${categoryName}/${postId}/edit/${comment.id}`
            }
            to={
              isEditing
                ? `/${categoryName}/${postId}`
                : `/${categoryName}/${postId}/edit/${comment.id}`
            }
            style={{ color: '#4183c4', fontSize: '1rem' }}
            className="button-as-link"
          >
            Edit
          </Link>
          <Button className="button-as-link-red" role="button" onClick={onRemoveClick(comment)}>
            Delete
          </Button>
        </div>
      </Comment.Actions>
    </Comment.Content>
  </Comment>
);

CommentListItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    body: PropTypes.string.isRequired,
    voteScore: PropTypes.number,
  }).isRequired,
  categoryName: PropTypes.string,
  postId: PropTypes.string,
  onRemoveClick: PropTypes.func.isRequired,
  onVote: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

CommentListItem.defaultProps = {
  categoryName: undefined,
  postId: undefined,
};

export default CommentListItem;
