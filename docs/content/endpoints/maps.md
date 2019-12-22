# /maps
The `maps` endpoint has 6 routes that allow you to retrieve Beatmap information in different ordering configurations.

## /maps/detail/:key
Given a Beatmap Key, this endpoint will return the Beatmap from the database.

## /maps/by-hash/:hash
Given a Beatmap Hash, this endpoint will return the Beatmap from the database.

## /maps/uploader/:id/:page?
Given a user's ID, this endpoint will return all Beatmaps which they've created.

## /maps/hot/:page?
Returns an array of Beatmaps from the database, sorted in descending order by the `heat` parameter of the `stats` field of the Beatmap. 

## /maps/rating/:page?
Returns an array of Beatmaps from the database, sorted in descending order by the `rating` parameter of the `stats` field of the Beatmap.

## /maps/latest/:page?
Returns an array of Beatmaps from the database, sorted in descending order by the `uploaded` parameter (most recent uploads come first) 

## /maps/downloads/:page?
Returns an array of Beatmaps from the database, sorted in descending order by the `downloads` parameter of the `stats` field of the Beatmap.

## /maps/plays/:page?
Returns an array of Beatmaps from the database, sorted in descending order by the `plays` parameter of the `stats` field of the Beatmap.
