# vote_db.php, results_db.sql, db_settings.php

A PHP-script to write the **results of the tool into a database**.

DB-credentials come from `db_settings.php` and have to be adjusted to your own MySQL / MariaDB-settings.

First you have to **create a table** within the database. The file `results_db.sql` can be imported into the database for that.

The example table is named `Results` but you can change it to your needs. If you change the name (lines 16, 27 and 33 in `results_db.sql`), you have to adjust the settings in `db_settings.php` as well.

To **activate statistics**, you have to set the parameter `statsRecord` in `/DATA/DEFINITION.JS` to `true`.
In addition the parameter `statsServer` has to link to `vote_db.php`.
