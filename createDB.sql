-- Page to install postgres.
http://www.postgresqltutorial.com/install-postgresql/

-- Script to create the rol to use in Postgres.
CREATE ROLE fiftysevenblocks LOGIN PASSWORD 'fiftysevenblocks';

-- Script to update the rol password.
ALTER ROLE fiftysevenblocks WITH PASSWORD 'fiftysevenblocks';

-- Script to see the created roles.
SELECT rolname FROM pg_roles;

-- Script to create the DB.
CREATE DATABASE fiftysevenblocksdb OWNER fiftysevenblocks;