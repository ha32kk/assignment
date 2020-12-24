## Junior dev assignment

[A running demo](http://assignment.vatsul.com:10101/)

Replies from backend are fast, but rendering the large table takes some time in the browser, as not much effort was put into the front (pagination, lazily rendering tables etc.), as instructed in the assignment.

Database is not used in backend, because it is not needed for merely combining and caching the results from the legacy API. All the data in the database would have to be completely replaced 5 minutes after each fetching anyway. 

To run the application `docker-compose.yml` on the top level of the repo can be used.