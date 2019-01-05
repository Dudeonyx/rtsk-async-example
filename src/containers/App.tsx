import React, { Component, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPostsIfNeeded } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';
import { Dispatch } from '@redux-ts-starter-kit/core';
import {
  selectSubreddit,
  invalidateSubreddit,
  postsSelectors,
  postsBySubredditSelectors,
  selectedSubredditSelectors,
} from '../reducers';
import { IStore } from '..';

interface IAppProps {
  selectedSubreddit: string;
  posts: any[];
  isFetching: boolean;
  lastUpdated: number | null;
  dispatch: Dispatch;
}

class App extends Component<IAppProps> {
  public componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props;
    dispatch(fetchPostsIfNeeded(selectedSubreddit) as any);
  }

  public componentDidUpdate(prevProps: IAppProps) {
    if (prevProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = this.props;
      dispatch(fetchPostsIfNeeded(selectedSubreddit) as any);
    }
  }

  public handleChange = (nextSubreddit: string) => {
    this.props.dispatch(selectSubreddit(nextSubreddit));
  };

  public handleRefreshClick = (e: MouseEvent) => {
    e.preventDefault();

    const { dispatch, selectedSubreddit } = this.props;
    dispatch(invalidateSubreddit(selectedSubreddit));
    dispatch(fetchPostsIfNeeded(selectedSubreddit) as any);
  };

  public render() {
    const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props;
    const isEmpty = posts.length === 0;
    return (
      <div>
        <Picker
          value={selectedSubreddit}
          onChange={this.handleChange}
          options={['reactjs', 'frontend',]}
        />
        <p>
          {lastUpdated && (
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
            </span>
          )}
          {!isFetching && (
            <button onClick={this.handleRefreshClick}>Refresh</button>
          )}
        </p>
        {isEmpty ? (
          isFetching ? (
            <h2>Loading...</h2>
          ) : (
            <h2>Empty.</h2>
          )
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: IStore) => {
  const selectedSubreddit = selectedSubredditSelectors.getSlice(state);
  const postsBySubreddit = postsBySubredditSelectors.getSlice(state);
  const posts = postsSelectors.items(postsBySubreddit[selectedSubreddit]) || [];
  const isFetching =
    postsSelectors.isFetching(postsBySubreddit[selectedSubreddit]) || true;
  const lastUpdated =
    postsSelectors.receivedAt(postsBySubreddit[selectedSubreddit]) || null;

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated,
  };
};

export default connect(mapStateToProps)(App);
