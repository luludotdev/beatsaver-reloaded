import React, { FunctionComponent, lazy } from 'react'
import { Route, Switch } from 'react-router'

import { Beatmap } from './routes/Beatmap'
import { Downloads, Hot, Latest, Plays } from './routes/Browse'
import { Index } from './routes/Index'
import { NotFound } from './routes/NotFound'
import Search from './routes/Search'
import { Uploader } from './routes/Uploader'

const Login = lazy(() => import('./routes/Login'))
const Upload = lazy(() => import('./routes/Upload'))
const Legacy = lazy(() => import('./routes/Legacy'))

export const Routes: FunctionComponent = () => (
  <Switch>
    <Route path='/browse/latest' component={Latest} />
    <Route path='/browse/hot' component={Hot} />
    <Route path='/browse/downloads' component={Downloads} />
    <Route path='/browse/plays' component={Plays} />
    <Route path='/beatmap/:key' component={Beatmap} />
    <Route path='/uploader/:id' component={Uploader} />

    <Route path='/browse/detail/:key' component={Legacy} />

    <Route path='/search' component={Search} />

    <Route path='/auth/login' component={Login} />
    <Route path='/user/upload' component={Upload} />

    <Route exact path='/' component={Index} />
    <Route component={NotFound} />
  </Switch>
)
