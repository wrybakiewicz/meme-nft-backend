CREATE TABLE memes (
    id int,
    title text,
    link text,
    vote_up_count int,
    vote_down_count int,
    vote_result int,
    is_blocked boolean
);

INSERT INTO memes VALUES (1, 'test title', 'aBU62R_ZJ5NCNx4QppDcfg87G85WS-IrdBFS2ki2S88', 10, 1, 9, false);
INSERT INTO memes VALUES (2, 'test title 2', 'pBlRaQbUB0zLyLzuigps_kC0EjojH_0ATBQqLI3-QEs', 5, 7, -2, false);


CREATE TABLE vote_users(
    address TEXT PRIMARY KEY,
    email TEXT,
    activation_code TEXT,
    status TEXT
);

INSERT INTO vote_users(address, email, activation_code, status) VALUES ('address1', 'adam@wp.pl', '1234', 'activated');
INSERT INTO vote_users(address, email, activation_code, status) VALUES ('0x9b424f755831575446313cde6a97ea5bc69b30a6', 'marek@wp.pl', '5678', 'activated');


CREATE TABLE votes(
                           address TEXT,
                           meme_id int,
                           vote_up boolean,
                           vote_down boolean
);

INSERT INTO votes(address, meme_id, vote_up, vote_down) VALUES ('address1', 1, true, false);
INSERT INTO votes(address, meme_id, vote_up, vote_down) VALUES ('0x9b424f755831575446313cde6a97ea5bc69b30a6', 1, true, false);
INSERT INTO votes(address, meme_id, vote_up, vote_down) VALUES ('address1', 2, false, true);