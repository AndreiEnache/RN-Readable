import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Item, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import VoteScore from '../VoteScore/VoteScore';
import { deletePost, adjustPostScore } from '../../actions';

const PostListItem = ({
  post, history, deletePost, adjustPostScore, from, match,
}) => {
  const handleEditClick = () => {
    const { id } = post;
    if (from) {
      history.push(`/posts/${id}/edit?from=${from}`);
    } else {
      history.push(`/posts/${id}/edit`);
    }
  };
  const handleRemoveClick = () => {
    const { id } = post;
    deletePost(id);
    history.push(`/${post.category}`);
  };
  const handleUpVote = () => {
    const { id } = post;
    adjustPostScore(id, 'upVote');
  };
  const handleDownVote = () => {
    const { id } = post;
    adjustPostScore(id, 'downVote');
  };
  return (
    <Item key={post.id}>
      <Item.Content>
        <Item.Header as={Link} to={`/${post.category}/${post.id}`}>
          {post.title}
        </Item.Header>
        <Item.Meta>
          Submitted by {post.author} to {post.category} {moment(post.timestamp).fromNow()}
        </Item.Meta>
        <Item.Description>{post.body}</Item.Description>
        <Item.Extra>
          <Button.Group floated="right">
            <Button primary onClick={handleEditClick}>
              <Icon name="edit" />Edit
            </Button>
            <Button.Or />
            <Button color="red" onClick={handleRemoveClick}>
              <Icon name="trash" />Delete
            </Button>
          </Button.Group>
          <div style={{ position: 'absolute', bottom: '0px' }} className="no-selection">
            <VoteScore
              voteScore={post.voteScore}
              commentCount={post.commentCount}
              onUpVote={handleUpVote}
              onDownVote={handleDownVote}
              postCategory={post.category}
              postId={post.id}
              isInComments={!!match.params.postId}
            />
          </div>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

PostListItem.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
    body: PropTypes.string,
    voteScore: PropTypes.number,
    commentCount: PropTypes.number,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  deletePost: PropTypes.func.isRequired,
  adjustPostScore: PropTypes.func.isRequired,
  from: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

PostListItem.defaultProps = {
  from: '',
};

export default withRouter(connect(null, { deletePost, adjustPostScore })(PostListItem));
