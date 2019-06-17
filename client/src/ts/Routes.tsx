import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router'

import { Beatmap } from './routes/Beatmap'
import { Downloads, Hot, Latest, Plays } from './routes/Browse'
import { Index } from './routes/Index'
import Legacy from './routes/Legacy'
import Login from './routes/Login'
import { NotFound } from './routes/NotFound'
import Search from './routes/Search'
import Upload from './routes/Upload'
import { Uploader } from './routes/Uploader'

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
