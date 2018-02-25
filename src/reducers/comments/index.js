import * as TYPES from '../../types';

const removeCommentFromPost = (comments, commentId) =>
  comments.filter(comment => comment.id !== commentId);
const adjustCommentScore = (comments, commentId, option) =>
  comments.map(comment =>
    (comment.id === commentId
      ? {
        ...comment,
        voteScore: option === 'upVote' ? comment.voteScore + 1 : comment.voteScore - 1,
      }
      : comment));

const changeComment = (comments, comment) =>
  comments.map(c => (c.id === comment.id ? { ...c, ...comment } : c));

const comments = (state = {}, action) => {
  const {
    error, postId, commentsByPost, parentId, comment, id, option,
  } = action;
  switch (action.type) {
    case TYPES.COMMENTS_GET_REQUEST:
      return { ...state, [postId]: [] };
    case TYPES.COMMENT_ADD_REQUEST:
      return { ...state, [parentId]: [...state[parentId], { ...comment }] };
    case TYPES.COMMENT_DELETE_REQUEST:
    case TYPES.COMMENT_EDIT_REQUEST:
    case TYPES.COMMENT_ADD_SUCCESS:
    case TYPES.COMMENT_EDIT_FAILURE:
    case TYPES.COMMENT_DELETE_FAILURE:
      return { ...state, [parentId]: changeComment(state[parentId], comment) };
    case TYPES.COMMENT_VOTE_REQUEST:
      return { ...state, [parentId]: adjustCommentScore(state[parentId], id, option) };
    case TYPES.COMMENTS_GET_SUCCESS:
      return { ...state, [postId]: commentsByPost };
    case TYPES.COMMENT_VOTE_FAILURE:
      return { ...state, [parentId]: adjustCommentScore(state[parentId], id, option) };
    case TYPES.COMMENT_ADD_FAILURE:
      return { ...state, [parentId]: removeCommentFromPost(state[parentId], comment.id) };
    case TYPES.COMMENTS_GET_FAILURE:
      return { ...state, error };
    default:
      return state;
  }
};

export const getCommentsForPost = (state, postId) =>
  state.comments[postId] && state.comments[postId].filter(c => !c.deleted);
export const getComment = (state, postId, commentId) =>
  state.comments[postId].find(c => c.id === commentId);

export default comments;
