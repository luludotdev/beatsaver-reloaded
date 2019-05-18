import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router'

import Search from './routes/Search'

export const Routes: FunctionComponent = () => (
  <Switch>
    <Route path='/search' component={Search} />
  </Switch>
)
