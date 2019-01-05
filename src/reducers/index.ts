import { createSlice } from '@redux-ts-starter-kit/core';

export const {
  actions: { selectSubreddit },
  reducer: selectedSubreddit,
  selectors: selectedSubredditSelectors,
} = createSlice({
  slice: 'selectedSubreddit',
  initialState: 'reactjs',
  cases: {
    selectSubreddit: (state, payload: string) => payload,
  },
});
interface IJson {
  data: { children: { map: (arg0: (child: { data: any }) => any) => any[] } };
}
interface IPosts {
  isFetching: boolean;
  didInvalidate: boolean;
  items: any[];
  receivedAt: null | number;
}
const postInitialState: IPosts = {
  isFetching: false,
  didInvalidate: false,
  items: [],
  receivedAt: null,
};

export const {
  reducer: posts,
  actions: { invalidateSub, receiveSubPost, requestSubPost },
  selectors: postsSelectors,
} = createSlice({
  cases: {
    invalidateSub: (state, _: never) => {
      state.didInvalidate = true;
    },
    requestSubPost: (state, _: never) => {
      state.isFetching = true;
      state.didInvalidate = false;
    },
    receiveSubPost: (state, json: IJson) => {
      state.isFetching = false;
      state.didInvalidate = false;
      state.items = json.data.children.map(child => child.data);
      state.receivedAt = Date.now();
    },
  },
  initialState: postInitialState,
});

export const {
  reducer: postsBySubreddit,
  actions: { requestPosts, receivePosts, invalidateSubreddit },
  selectors: postsBySubredditSelectors,
} = createSlice({
  slice: 'postsBySubreddit',
  cases: {
    invalidateSubreddit: (state, subreddit: string) => {
      state[subreddit] = posts(state[subreddit], invalidateSub());
    },
    requestPosts: (state, subreddit: string) => {
      state[subreddit] = posts(state[subreddit], requestSubPost());
    },
    receivePosts: (state, [subreddit, json,]: [string, IJson]) => {
      state[subreddit] = posts(state[subreddit], receiveSubPost(json));
    },
  },
  initialState: {} as { [subreddit: string]: IPosts },
});
