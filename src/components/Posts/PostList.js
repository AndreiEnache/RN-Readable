import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PostListItem from './PostListItem';
import { loadPosts } from '../../actions';
import { getPosts } from '../../reducers/posts';

const PostList = ({ posts }) => (
  <Item.Group divided relaxed>
    {posts.map(post => <PostListItem key={post.id} post={post} />)}
  </Item.Group>
);

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired)
    .isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  posts: getPosts(state, ownProps.match.params.category),
});

export default connect(mapStateToProps, { loadPosts })(PostList);
