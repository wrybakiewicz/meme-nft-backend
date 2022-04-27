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
