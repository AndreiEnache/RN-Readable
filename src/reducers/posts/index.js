import _ from 'lodash';
import * as TYPES from '../../types';

const setDeleteState = (posts, postId, postState) =>
  posts.map(post => (post.id === postId ? { ...post, isDeleting: postState } : post));
const setPostScore = (posts, sortBy, postId, option) => {
  const postsToReturn = posts.map(post =>
    (post.id === postId
      ? { ...post, voteScore: option === 'upVote' ? post.voteScore + 1 : post.voteScore - 1 }
      : post));
  if (sortBy === 'voteScore') {
    return _.orderBy(postsToReturn, ['voteScore'], ['desc']);
  }
  return postsToReturn;
};

const setIndividualPostScore = (post, postId, option) =>
  (post.id === postId
    ? { ...post, voteScore: option === 'upVote' ? post.voteScore + 1 : post.voteScore - 1 }
    : post);
const updatePost = (posts, post) => posts.map(p => (p.id === post.id ? { ...post } : p));
const posts = (
  state = {
    categories: [],
    categoryName: '',
    postsInCategory: [],
    sortBy: 'date',
    byId: {},
  },
  action,
) => {
  const {
    categories, error, postsInCategory, categoryName, sortBy, post, id, option,
  } = action;
  switch (action.type) {
    case TYPES.CATEGORIES_GET_REQUEST:
    case TYPES.POSTS_GET_REQUEST:
      return { ...state, isLoading: true };
    case TYPES.POST_DELETE_REQUEST:
      return {
        ...state,
        postsInCategory: setDeleteState(state.postsInCategory, id, true),
      };
    case TYPES.POST_VOTE_REQUEST:
      return {
        ...state,
        postsInCategory: setPostScore(state.postsInCategory, state.sortBy, id, option),
        byId: setIndividualPostScore(state.byId, id, option),
      };
    case TYPES.COMMENT_ADD_REQUEST:
      return {
        ...state,
        byId: { ...state.byId, commentCount: state.byId.commentCount + 1 },
      };
    case TYPES.POST_EDIT_REQUEST:
      return { ...state, postsInCategory: updatePost(state.postsInCategory, post) };
    case TYPES.COMMENT_DELETE_REQUEST:
      return { ...state, byId: { ...state.byId, commentCount: state.byId.commentCount - 1 } };
    case TYPES.POST_VOTE_SUCCESS:
      return { ...state };
    case TYPES.POST_DELETE_SUCCESS:
      return { ...state, postsInCategory: state.postsInCategory.filter(p => p.id !== id) };
    case TYPES.POST_GET_SUCCESS:
      return { ...state, byId: post };
    case TYPES.CATEGORIES_GET_SUCCESS:
      return {
        ...state,
        isLoading: false,
        categories: [{ key: 'all', value: 'all', text: 'All' }].concat(categories.map(category => ({
          key: category.name,
          value: category.name,
          text: category.name.charAt(0).toUpperCase() + category.name.slice(1),
        }))),
        categoryName: categoryName || state.categoryName || 'all',
        sortBy: 'timestamp',
        error: '',
      };
    case TYPES.POSTS_GET_SUCCESS:
      return {
        ...state,
        isLoading: false,
        postsInCategory: _.orderBy(postsInCategory, ['timestamp'], ['desc']),
        error: '',
      };
    case TYPES.SORT_CHANGE_SUCCESS:
      return {
        ...state,
        postsInCategory: _.orderBy(state.postsInCategory, [sortBy], ['desc']),
        sortBy,
      };
    case TYPES.POST_ADD_SUCCESS:
      return { ...state, postsInCategory: [...state.postsInCategory, post] };
    case TYPES.CATEGORY_CHANGE_SUCCESS:
      return { ...state, categoryName: categoryName || state.categoryName };
    case TYPES.COMMENT_DELETE_FAILURE:
      return { ...state, byId: { ...state.byId, commentCount: state.byId.commentCount + 1 } };
    case TYPES.POST_EDIT_FAILURE:
      return { ...state, postsInCategory: updatePost(state.postsInCategory, post) };
    case TYPES.COMMENT_ADD_FAILURE:
      return {
        ...state,
        byId: { ...state.byId, commentCount: state.byId.commentCount - 1 },
      };
    case TYPES.POST_VOTE_FAILURE:
      return {
        ...state,
        postsInCategory: setPostScore(state.postsInCategory, state.sortBy, id, option),
        byId: setIndividualPostScore(state.byId, id, option),
      };
    case TYPES.POST_DELETE_FAILURE:
      return { ...state, postsInCategory: setDeleteState(state.postsInCategory, id, false) };
    case TYPES.POSTS_GET_FAILURE:
    case TYPES.CATEGORIES_GET_FAILURE:
      return {
        ...state,
        isLoading: false,
        categories: [],
        error,
      };
    default:
      return state;
  }
};

const returnPostsInCategory = (state, category) =>
  (category
    ? state.posts.postsInCategory.filter(post => !post.isDeleting && post.category === category)
    : state.posts.postsInCategory.filter(post => !post.isDeleting));

const getPost = (state, postId) => {
  if (!postId) {
    return undefined;
  }
  let post = state.posts.postsInCategory.find(p => p.id === postId);
  if (!post) {
    post = postId === state.posts.byId.id ? state.posts.byId : undefined;
  }
  return post;
};

export const getCategories = state => state.posts.categories;
export const getCategoriesForPost = state =>
  state.posts.categories.filter(category => category.key !== 'all');
export const getCategory = state => state.posts.categoryName;
export const getPosts = (state, category) => returnPostsInCategory(state, category);
export const getSortBy = state => state.posts.sortBy;
export const getPostById = (state, postId) => getPost(state, postId);

export default posts;
