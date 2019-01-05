import React, { FunctionComponent } from 'react';

const Posts: FunctionComponent<{ posts: Array<{ title: string }> }> = ({
  posts,
}) => (
  <ul>
    {posts.map((post, i) => (
      <li key={i}>{post.title}</li>
    ))}
  </ul>
);

export default Posts;
