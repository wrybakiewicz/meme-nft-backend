CREATE TABLE memes (
    id int,
    link text,
    vote_up_count int,
    vote_down_count int,
    vote_result int,
    is_blocked boolean,
    competition_id int,
    is_winner boolean,
    is_winner_minted boolean,
    owner_address text
);

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
INSERT INTO votes(address, meme_id, vote_up, vote_down) VALUES ('0x26ea8aaf2028ecb261e36b61e6a21b03bd229c77', 1, false, true);
INSERT INTO votes(address, meme_id, vote_up, vote_down) VALUES ('address1', 2, false, true);

CREATE TABLE competitions(
    id SERIAL PRIMARY KEY,
    name TEXT,
    startDate TIMESTAMP,
    endDate TIMESTAMP
);

INSERT INTO competitions(name, startDate, endDate) VALUES ('Competition 1', TO_TIMESTAMP('2022-05-23', 'YYYY-MM-DD'), TO_TIMESTAMP('2022-05-29', 'YYYY-MM-DD'));
INSERT INTO competitions(name, startDate, endDate) VALUES ('Competition 2', TO_TIMESTAMP('2022-05-16', 'YYYY-MM-DD'), TO_TIMESTAMP('2022-05-23', 'YYYY-MM-DD'));
