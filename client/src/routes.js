import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import VideoStream from './containers/VideoStream'

export default () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={VideoStream}/>
        </Switch>
      </BrowserRouter>
    </div>
  )
}