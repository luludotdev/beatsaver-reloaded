# /maps
The `maps` endpoint has 6 subendpoints which API users can interact with. 

## /maps/detail/{Beatmap Key}
_Example: https://beatsaver.com/api/maps/detail/2f3e_

Given a Beatmap Key, this endpoint will return the Beatmap from the database.

## /maps/uploader/{User ID}
_Example: https://beatsaver.com/api/maps/uploader/5cff0b7298cc5a672c84e8c4_

Given a user's ID, this endpoint will return all Beatmaps which they've created.

## /maps/by-hash/{Beatmap Hash}
_Example: https://beatsaver.com/api/maps/by-hash/ccf70e940a4ec45c70a8f3ae7be18a2ea771461d_

Given a Beatmap Hash, this endpoint will return the Beatmap from the database.

## /maps/hot/
_Endpoint: https://beatsaver.com/api/maps/hot_

Returns an array of Beatmaps from the database, sorted in descending order by the `heat` parameter of the `stats` field of the Beatmap. 

## /maps/rating/
_Endpoint: https://beatsaver.com/api/maps/rating

Returns an array of Beatmaps from the database, sorted in descending order by the `rating` parameter of the `stats` field of the Beatmap.

## /maps/latest/
_Endpoint: https://beatsaver.com/api/maps/latest_

Returns an array of Beatmaps from the database, sorted in descending order by the `uploaded` parameter (most recent uploads come first) 

## /maps/downloads/
_Endpoint: https://beatsaver.com/api/maps/downloads_

Returns an array of Beatmaps from the database, sorted in descending order by the `downloads` parameter of the `stats` field of the Beatmap.

## /maps/plays/
_Endpoint: https://beatsaver.com/api/maps/plays_

Returns an array of Beatmaps from the database, sorted in descending order by the `plays` parameter of the `stats` field of the Beatmap.
