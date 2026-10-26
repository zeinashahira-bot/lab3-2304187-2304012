USE library;

INSERT INTO AUTHOR (author_id, name, country, photo) VALUES 
(1, 'J.K. Rowling', 'UK', '/uploads/jk-rowling.jpg'),
(2, 'Homer', 'Ancient Greece', '/uploads/homer.jpg'),
(3, 'Jane Austen', 'UK', '/uploads/jane-austen.jpg');

INSERT INTO BOOK (book_id, title, price, author_id, cover) VALUES 
(101, 'Harry Potter and the Order of the Phoenix', 24.50, 1, '/uploads/hp-order.jpg'),
(102, 'Harry Potter and the Deathly Hallows', 26.00, 1, '/uploads/hp-deathly.jpg'),
(103, 'The Odyssey', 15.00, 2, '/uploads/odyssey.jpg'),
(104, 'The Iliad', 16.50, 2, '/uploads/iliad.jpg'),
(105, 'Pride and Prejudice', 14.00, 3, '/uploads/pride-prejudice.jpg'),
(106, 'Sense and Sensibility', 13.50, 3, '/uploads/sense-sensibility.jpg');