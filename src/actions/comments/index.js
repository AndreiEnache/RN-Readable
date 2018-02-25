import v4 from 'uuid';
import * as api from '../../helpers';
import * as TYPES from '../../types';
import { getComment } from '../../reducers/comments';

const getCommentsForPostRequest = postId => ({
  type: TYPES.COMMENTS_GET_REQUEST,
  postId,
});

const getCommentsForPostSuccess = (commentsByPost, postId) => ({
  type: TYPES.COMMENTS_GET_SUCCESS,
  commentsByPost,
  postId,
});

const getCommentsForPostFailure = () => ({
  type: TYPES.COMMENTS_GET_FAILURE,
});

export const loadCommentsForPost = postId => async (dispatch) => {
  dispatch(getCommentsForPostRequest(postId));
  try {
    const response = await api.getCommentsByPost(postId);
    dispatch(getCommentsForPostSuccess(response, postId));
  } catch (e) {
    dispatch(getCommentsForPostFailure(e));
  }
};

const addCommentRequest = comment => ({
  type: TYPES.COMMENT_ADD_REQUEST,
  comment,
  parentId: comment.parentId,
});

const addCommentSuccess = comment => ({
  type: TYPES.COMMENT_ADD_SUCCESS,
  comment,
  parentId: comment.parentId,
});
const addCommentFailure = (error, comment) => ({
  type: TYPES.COMMENT_ADD_FAILURE,
  error,
  comment,
  parentId: comment.parentId,
});

export const addComment = commentToAdd => async (dispatch) => {
  const comment = { ...commentToAdd, timestamp: Date.now(), id: v4() };
  dispatch(addCommentRequest(comment));
  try {
    const response = await api.postComment(comment);
    dispatch(addCommentSuccess({ ...comment, ...response }));
  } catch (e) {
    dispatch(addCommentFailure(e, comment));
  }
};

const adjustCommentScoreRequest = (comment, option) => ({
  type: TYPES.COMMENT_VOTE_REQUEST,
  parentId: comment.parentId,
  id: comment.id,
  option,
});

const adjustCommentScoreSuccess = (comment, option) => ({
  type: TYPES.COMMENT_VOTE_SUCCESS,
  parentId: comment.parentId,
  id: comment.id,
  option,
});

const adjustCommentScoreFailure = (error, comment, option) => ({
  type: TYPES.COMMENT_VOTE_FAILURE,
  error,
  parentId: comment.parentId,
  id: comment.id,
  option,
});

export const adjustCommentScore = (comment, option) => async (dispatch) => {
  dispatch(adjustCommentScoreRequest(comment, option));
  if (option === 'upVote') {
    try {
      const response = await api.updateCommentScore(comment.id, option);
      dispatch(adjustCommentScoreSuccess(response));
    } catch (e) {
      dispatch(adjustCommentScoreFailure(e, comment, 'downVote'));
    }
  } else {
    try {
      const response = await api.updateCommentScore(comment.id, option);
      dispatch(adjustCommentScoreSuccess(response));
    } catch (e) {
      dispatch(adjustCommentScoreFailure(e, comment, 'upVote'));
    }
  }
};

const editCommentRequest = comment => ({
  type: TYPES.COMMENT_EDIT_REQUEST,
  parentId: comment.parentId,
  comment,
});

const editCommentSuccess = comment => ({
  type: TYPES.COMMENT_EDIT_SUCCESS,
  parentId: comment.parentId,
  comment,
});

const editCommentFailure = (error, comment) => ({
  type: TYPES.COMMENT_EDIT_FAILURE,
  error,
  comment,
  parentId: comment.parentId,
});

export const editComment = comment => async (dispatch, getState) => {
  const currentComment = getComment(getState(), comment.parentId, comment.id);
  dispatch(editCommentRequest(comment));
  try {
    const response = await api.updateComment({ ...comment, timestamp: Date.now() });
    dispatch(editCommentSuccess(response));
  } catch (e) {
    dispatch(editCommentFailure(e, currentComment));
  }
};

const deleteCommentRequest = comment => ({
  type: TYPES.COMMENT_DELETE_REQUEST,
  parentId: comment.parentId,
  comment,
});

const deleteCommentSuccess = comment => ({
  type: TYPES.COMMENT_DELETE_SUCCESS,
  comment,
});
const deleteCommentFailure = (error, comment) => ({
  type: TYPES.COMMENT_DELETE_FAILURE,
  error,
  parentId: comment.parentId,
  comment,
});

export const deleteComment = comment => async (dispatch) => {
  dispatch(deleteCommentRequest({ ...comment, deleted: true }));
  try {
    const response = await api.removeComment(comment);
    dispatch(deleteCommentSuccess(response));
  } catch (e) {
    dispatch(deleteCommentFailure(e, comment));
  }
};
