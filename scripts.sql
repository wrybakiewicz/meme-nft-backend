CREATE TABLE memes (
    id int,
    link text,
    vote_up_count int,
    vote_down_count int,
    vote_result int,
    is_blocked boolean,
    competition_id int,
    is_winner boolean,
    winner_id int,
    owner_address text
);

CREATE TABLE vote_users(
    address TEXT PRIMARY KEY,
    email TEXT,
    activation_code TEXT,
    status TEXT
);

CREATE TABLE votes(
                           address TEXT,
                           meme_id int,
                           vote_up boolean,
                           vote_down boolean
);

CREATE TABLE competitions(
    id SERIAL PRIMARY KEY,
    name TEXT,
    startDate TIMESTAMP,
    endDate TIMESTAMP
);

INSERT INTO competitions(name, startDate, endDate) VALUES ('Competition 1', TO_TIMESTAMP('2022-07-04', 'YYYY-MM-DD'), TO_TIMESTAMP('2022-07-11', 'YYYY-MM-DD'));
