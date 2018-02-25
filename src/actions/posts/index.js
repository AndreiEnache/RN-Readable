import * as api from '../../helpers';
import * as TYPES from '../../types';
import history from '../../history';
import { getPostById } from '../../reducers/posts';

const getCategoriesSuccess = (categories, categoryName) => ({
  type: TYPES.CATEGORIES_GET_SUCCESS,
  categories,
  categoryName,
});

const getCategoriesFailure = error => ({
  type: TYPES.CATEGORIES_GET_FAILURE,
  error,
});

const getCategoriesRequest = () => ({
  type: TYPES.CATEGORIES_GET_REQUEST,
});

const getPostsRequest = () => ({
  type: TYPES.POSTS_GET_REQUEST,
});

const getPostsSuccess = (postsInCategory, categoryName) => ({
  type: TYPES.POSTS_GET_SUCCESS,
  postsInCategory,
  categoryName,
});

const getPostsFailure = error => ({
  type: TYPES.POSTS_GET_FAILURE,
  error,
});

export const sortPostsBy = sortBy => ({
  type: TYPES.SORT_CHANGE_SUCCESS,
  sortBy,
});

const changeCategorySuccess = categoryName => ({
  type: TYPES.CATEGORY_CHANGE_SUCCESS,
  categoryName,
});

export const loadPosts = categoryName => async (dispatch, getState) => {
  const category = categoryName === 'all' ? undefined : categoryName;
  dispatch(getPostsRequest());
  try {
    const response = await api.getPostsByCategory(category);
    dispatch(getPostsSuccess(response, category));
  } catch (e) {
    dispatch(getPostsFailure(e));
  }
};

export const changeCategory = categoryName => (dispatch) => {
  dispatch(loadPosts(categoryName));
  if (categoryName === 'all') {
    history.push('');
  } else {
    history.push(categoryName);
  }
  dispatch(changeCategorySuccess(categoryName));
};

export const loadCategories = categoryName => async (dispatch) => {
  if (categoryName) dispatch(loadPosts(categoryName));
  dispatch(getCategoriesRequest());
  try {
    const response = await api.getCategories();
    dispatch(getCategoriesSuccess(response.categories, categoryName));
  } catch (e) {
    dispatch(getCategoriesFailure(e));
    dispatch(getPostsFailure(e));
  }
};

const loadPostByIdRequest = () => ({
  type: TYPES.POST_GET_REQUEST,
});

const loadPostByIdSuccess = post => ({
  type: TYPES.POST_GET_SUCCESS,
  post,
});
const loadPostByIdFailure = error => ({
  type: TYPES.POST_GET_FAILURE,
  error,
});

export const loadPostById = postId => async (dispatch) => {
  dispatch(loadPostByIdRequest());
  try {
    const response = await api.getPostById(postId);
    dispatch(loadPostByIdSuccess(response));
  } catch (e) {
    history.push('/404');
    dispatch(loadPostByIdFailure());
  }
};

const addPostRequest = () => ({
  type: TYPES.POST_ADD_REQUEST,
});
const addPostSuccess = post => ({
  type: TYPES.POST_ADD_SUCCESS,
  post,
});
const addPostFailure = () => ({
  type: TYPES.POST_ADD_FAILURE,
});

export const editPostRequest = post => ({
  type: TYPES.POST_EDIT_REQUEST,
  post,
});

export const editPostSuccess = post => ({
  type: TYPES.POST_EDIT_SUCCESS,
  post,
});

export const editPostFailure = (error, post) => ({
  type: TYPES.POST_EDIT_FAILURE,
  error,
  post,
});

export const addPost = (post, fromComments) => async (dispatch, getState) => {
  if (post.id) {
    const currentPost = getPostById(getState(), post.id);
    dispatch(editPostRequest(post));
    try {
      const response = await api.editPost(post);
      dispatch(editPostSuccess(response));
    } catch (e) {
      dispatch(editPostFailure(e, currentPost));
    }
  } else {
    dispatch(addPostRequest());
    try {
      const response = await api.addPost(post);
      dispatch(addPostSuccess(response));
    } catch (e) {
      dispatch(addPostFailure(e));
    }
  }
  if (fromComments) {
    history.push(`/${post.category}/${post.id}`);
  } else {
    history.push('');
  }
};

export const deletePostRequest = id => ({
  type: TYPES.POST_DELETE_REQUEST,
  id,
});

export const deletePostSuccess = id => ({
  type: TYPES.POST_DELETE_SUCCESS,
  id,
});

export const deletePostFailure = (id, error) => ({
  type: TYPES.POST_DELETE_FAILURE,
  id,
  error,
});

export const deletePost = id => async (dispatch) => {
  dispatch(deletePostRequest(id));
  try {
    await api.deletePost(id);
    dispatch(deletePostSuccess(id));
  } catch (e) {
    dispatch(deletePostFailure(id, e));
  }
};

export const votePostFailure = (id, option, e) => ({
  type: TYPES.POST_VOTE_FAILURE,
  id,
  option,
  e,
});

export const votePostSuccess = id => ({
  type: TYPES.POST_VOTE_SUCCESS,
  id,
});

export const votePostRequest = (id, option) => ({
  type: TYPES.POST_VOTE_REQUEST,
  id,
  option,
});

export const adjustPostScore = (id, option) => async (dispatch) => {
  if (option === 'upVote') {
    dispatch(votePostRequest(id, option));
    try {
      const response = await api.updatePostScore(id, option);
      dispatch(votePostSuccess(id, response));
    } catch (e) {
      dispatch(votePostFailure(id, 'downVote', e));
    }
  } else {
    dispatch(votePostRequest(id, option));
    try {
      const response = await api.updatePostScore(id, option);
      dispatch(votePostSuccess(id, response));
    } catch (e) {
      dispatch(votePostFailure(id, 'upVote', e));
    }
  }
};
