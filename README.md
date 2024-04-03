# musker

![musker](public/og/musker.png?raw=true "Musker")

```sh
#mysql --host=127.0.0.1 --port=3306 --user=anders --password=somesecret musker < script.sql > output.tab

#migrating off planetscale...

#grab data
pscale database dump musker main

#combine those files
cat *-schema.sql > all_schema.sql
cat *.00001.sql > > all_data.sql

#apply schema
mysql --host=127.0.0.1 --port=3306 --user=anders --password=somesecret musker < all_schema.sql

#apply data
mysql --host=127.0.0.1 --port=3306 --user=anders --password=somesecret musker < all_data.sql
```
