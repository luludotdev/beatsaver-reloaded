import React, { FunctionComponent, lazy } from 'react'
import { Route, Switch } from 'react-router'

import { Downloads, Latest, Plays } from './routes/Browse'
import { Index } from './routes/Index'
import { NotFound } from './routes/NotFound'
import Search from './routes/Search'

const Login = lazy(() => import('./routes/Login'))

export const Routes: FunctionComponent = () => (
  <Switch>
    <Route path='/browse/latest' component={Latest} />
    <Route path='/browse/downloads' component={Downloads} />
    <Route path='/browse/plays' component={Plays} />

    <Route path='/search' component={Search} />

    <Route path='/auth/login' component={Login} />

    <Route exact path='/' component={Index} />
    <Route component={NotFound} />
  </Switch>
)
