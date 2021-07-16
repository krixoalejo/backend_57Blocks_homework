-- Script to create the rol to use in Postgres.
CREATE ROLE fiftysevenblocks LOGIN PASSWORD 'fiftysevenblocks';

-- Script to update the rol password.
ALTER ROLE fiftysevenblocks WITH PASSWORD 'fiftysevenblocks';

-- Script to see the created roles.
SELECT rolname FROM pg_roles;

-- Script to create the DB.
CREATE DATABASE fiftysevenblocksdb OWNER fiftysevenblocks;

-- Scripts to create the pokemons on DB.
INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Pikachu', 'Thunder', 'Pressure', 'Yellow', false, 1);

INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Chikorita', 'Leaf', 'Overgrow', 'Green', false, 1);

INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Cyndaquil', 'Fire Mouse', 'Blaze', 'Yellow', false, 1);

INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Totodile', 'Big Jaw', 'Torrent', 'Blue', false, 1);

INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Sentret', 'Scout', 'Run Away', 'Brown', false, 1);

INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Noctowl', 'Owl', 'Insomnia', 'Brown', false, 1);

INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Spinarak', 'String Spit', 'Swarm', 'Green', false, 1);

INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Chinchou', 'Angler', 'Volt Absorb', 'Blue', false, 1);

INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Cleffa', 'Star Shape', 'Cute Charm', 'Pink', false, 1);

INSERT INTO public.pokemons("createdAt", "updatedAt", id, name, species, ability, color, "isPrivate", state)
	VALUES ('1626328702', '1626328702', default, 'Togetic', 'Happiness', 'Hustle', 'White', false, 1);
