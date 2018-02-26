import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const showCommentCount = (commentCount, isInComments, postCategory, postId) => {
  if (commentCount !== undefined) {
    if (isInComments) {
      return `${commentCount} ${commentCount !== 1 ? 'comments' : 'comment'}`;
    }
    return (
      <Link href={`/${postCategory}/${postId}`} to={`/${postCategory}/${postId}`}>
        {`${commentCount} ${commentCount !== 1 ? 'comments' : 'comment'}`}
      </Link>
    );
  }
  return '';
};

const VoteScore = ({
  voteScore,
  commentCount,
  onUpVote,
  onDownVote,
  postCategory,
  postId,
  isInComments,
}) => (
  <React.Fragment>
    <Icon name="arrow up" className="trigger" style={{ marginRight: '0.5em' }} onClick={onUpVote} />
    {voteScore}
    <Icon
      name="arrow down"
      className="trigger"
      style={{ marginLeft: '0.5em', marginRight: '1em' }}
      onClick={onDownVote}
    />
    {showCommentCount(commentCount, isInComments, postCategory, postId)}
  </React.Fragment>
);

VoteScore.propTypes = {
  voteScore: PropTypes.number,
  commentCount: PropTypes.number,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
  postCategory: PropTypes.string,
  postId: PropTypes.string,
  isInComments: PropTypes.bool,
};

VoteScore.defaultProps = {
  voteScore: 0,
  commentCount: undefined,
  postCategory: undefined,
  postId: undefined,
  isInComments: false,
};

export default VoteScore;
