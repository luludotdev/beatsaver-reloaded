# /search
Allows you to query the database in different ways.

## /search/text/:page?
Runs an automatically weighted search based on name, description, beatmap metadata, and uploader username.  
Queries are passed using the HTTP query string parameter `q`

## /search/advanced/:page?
Runs a search against the Elasticsearch instance using [Lucene syntax](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html).  
Queries are passed using the HTTP query string parameter `q`
