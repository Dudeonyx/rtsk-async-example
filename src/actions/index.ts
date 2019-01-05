import { requestPosts, receivePosts } from '../reducers';
import { Dispatch } from 'redux';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT';
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';

const fetchPosts = (subreddit: string) => (dispatch: Dispatch) => {
  dispatch(requestPosts(subreddit));
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => dispatch(receivePosts([subreddit, json,])));
};

const shouldFetchPosts = (state: any, subreddit: string) => {
  const posts = state.postsBySubreddit[subreddit];
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return posts.didInvalidate;
};

export const fetchPostsIfNeeded = (subreddit: string) => (
  dispatch: Dispatch,
  getState: () => any,
) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchPosts(subreddit) as any);
  }
};
