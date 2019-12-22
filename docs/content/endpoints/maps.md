# /maps
The `maps` endpoint has 6 routes that allow you to retrieve Beatmap information in different ordering configurations.

## /maps/detail/:key

Given a Beatmap Key, this endpoint will return the Beatmap from the database.

## /maps/uploader/:id

Given a user's ID, this endpoint will return all Beatmaps which they've created.

## /maps/by-hash/:hash

Given a Beatmap Hash, this endpoint will return the Beatmap from the database.

## /maps/hot/

Returns an array of Beatmaps from the database, sorted in descending order by the `heat` parameter of the `stats` field of the Beatmap. 

## /maps/rating/

Returns an array of Beatmaps from the database, sorted in descending order by the `rating` parameter of the `stats` field of the Beatmap.

## /maps/latest/

Returns an array of Beatmaps from the database, sorted in descending order by the `uploaded` parameter (most recent uploads come first) 

## /maps/downloads/

Returns an array of Beatmaps from the database, sorted in descending order by the `downloads` parameter of the `stats` field of the Beatmap.

## /maps/plays/

Returns an array of Beatmaps from the database, sorted in descending order by the `plays` parameter of the `stats` field of the Beatmap.
