import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router'

import { Downloads, Latest, Plays } from './routes/Browse'
import Search from './routes/Search'

export const Routes: FunctionComponent = () => (
  <Switch>
    <Route path='/browse/latest' component={Latest} />
    <Route path='/browse/downloads' component={Downloads} />
    <Route path='/browse/plays' component={Plays} />
    <Route path='/search' component={Search} />
  </Switch>
)
