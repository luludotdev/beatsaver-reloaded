import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router'

import { Beatmap } from './routes/Beatmap'
import { Downloads, Hot, Latest, Plays, Rating } from './routes/Browse'
import { Index } from './routes/Index'
import { Legacy } from './routes/Legacy'
import { Login } from './routes/Login'
import { NotFound } from './routes/NotFound'
import { Register } from './routes/Register'
import { Search } from './routes/Search'
import { Upload } from './routes/Upload'
import { Uploader } from './routes/Uploader'

export const Routes: FunctionComponent = () => (
  <Switch>
    <Route path='/browse/latest' component={Latest} />
    <Route path='/browse/hot' component={Hot} />
    <Route path='/browse/rating' component={Rating} />
    <Route path='/browse/downloads' component={Downloads} />
    <Route path='/browse/plays' component={Plays} />
    <Route path='/uploader/:id' component={Uploader} />

    <Route path='/search' component={Search} />
    <Route path='/beatmap/:key' component={Beatmap} />
    <Route path='/browse/detail/:key' component={Legacy} />

    <Route path='/auth/login' component={Login} />
    <Route path='/auth/register' component={Register} />
    <Route path='/user/upload' component={Upload} />

    <Route exact path='/' component={Index} />
    <Route component={NotFound} />
  </Switch>
)
