import React from 'react';
import { Container, Segment } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';
import PostFilter from './components/Posts/PostFilter';
import './App.css';
import PostList from './components/Posts/PostList';
import AddPost from './components/Posts/AddPost';
import Comments from './components/Comments/Comments';
import AddNewPostButton from './components/Posts/AddNewPostButton';
import NotFound from './components/NotFound';

const App = () => (
  <React.Fragment>
    <Container>
      <Switch>
        <Route path="/404" />
        <Route component={AddNewPostButton} path="/:category?" exact />
      </Switch>
      <Switch>
        <Route path="/404" />
        <Route component={PostFilter} path="/:category?" exact />
      </Switch>
      <Segment>
        <Switch>
          <Route component={AddPost} path="/posts/add" />
          <Route component={AddPost} path="/posts/:postId/edit" />
          <Route component={NotFound} path="/404" />
          <Route component={PostList} path="/:category?" exact />
          <Route component={Comments} path="/:category/:postId/:action?/:commentId?" />
        </Switch>
      </Segment>
    </Container>
  </React.Fragment>
);
export default App;
