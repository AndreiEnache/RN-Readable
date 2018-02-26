import v4 from 'uuid';

const api = process.env.REACT_APP_BACKEND;

export const getCategories = async () => {
  try {
    const response = await fetch(`${api}/categories`, {
      headers: { Authorization: 'whatever-you-want' },
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};

export const getPostsByCategory = async (category) => {
  const url = category ? `${api}/${category}/posts` : `${api}/posts`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: 'whatever-you-want' },
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};

export const getCommentsByPost = async (postId) => {
  const url = `${api}/posts/${postId}/comments`;
  const response = await fetch(url, {
    headers: { Authorization: 'whatever-you-want' },
  }).then(res => res.json());
  return response;
};

export const getPostById = async (postId) => {
  const url = `${api}/posts/${postId}`;
  const response = await fetch(url, { headers: { Authorization: 'whatever-you-want' } }).then(res =>
    res.json());
  if (!response.id) {
    throw new Error('Post does not exist');
  }
  return response;
};

export const addPost = async (postToAdd) => {
  const post = { ...postToAdd, timestamp: Date.now(), id: v4() };
  try {
    const response = await fetch(`${api}/posts`, {
      headers: { Authorization: 'whatever-you-want', 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(post),
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};

export const editPost = async (post) => {
  try {
    const response = await fetch(`${api}/posts/${post.id}`, {
      headers: { Authorization: 'whatever-you-want', 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify(post),
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await fetch(`${api}/posts/${id}`, {
      headers: { Authorization: 'whatever-you-want', 'Content-Type': 'application/json' },
      method: 'DELETE',
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};

export const updatePostScore = async (id, option) => {
  try {
    const response = await fetch(`${api}/posts/${id}`, {
      headers: { Authorization: 'whatever-you-want', 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ option }),
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};

export const postComment = async (comment) => {
  try {
    const response = await fetch(`${api}/comments`, {
      headers: { Authorization: 'whatever-you-want', 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(comment),
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};

export const updateCommentScore = async (id, option) => {
  try {
    const response = await fetch(`${api}/comments/${id}`, {
      headers: { Authorization: 'whatever-you-want', 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ option }),
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};

export const updateComment = async (comment) => {
  try {
    const response = await fetch(`${api}/comments/${comment.id}`, {
      headers: { Authorization: 'whatever-you-want', 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify(comment),
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};

export const removeComment = async (comment) => {
  try {
    const response = await fetch(`${api}/comments/${comment.id}`, {
      headers: { Authorization: 'whatever-you-want', 'Content-Type': 'application/json' },
      method: 'DELETE',
    }).then(res => res.json());
    return response;
  } catch (e) {
    throw e;
  }
};
