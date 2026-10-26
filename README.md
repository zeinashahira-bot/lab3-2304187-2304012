# Lab 3: Foreign Keys and Simple SQL

Introduction to Database Systems · Faculty of Engineering, Alexandria National University · Fall 2026

This repository has Problem 1 (the COMPANY database) and Problem 2 (the Library database and its website, continued from Lab 2).

## 1. Team

| Name | ID | Group |
|---|---|---|
| Zeina Amr | 2304187 | Gp 2 sec 4 |
| Youssef Refeat | 2304012 | Gp 2 sec 4 |

### Who did what

**Zeina Amr**
- Problem 1: `problem1_DDL.sql`, `problem1_DML.sql` and `problem1_Answers.txt` (Q1.1 to Q1.3).
- Website, authors: the author routes (add, edit, delete) in `website/app.js`, and the authors table and forms in `website/views/library.ejs`.
- Website, validation: the register checks in `website/app.js`, `website/views/register.ejs` and `website/public/validate.js`.
- Bonus: the author photos.

**Youssef Refeat**
- Problem 2: `problem2_DDL.sql` and `problem2_DML.sql`.
- Website, books: the book routes (add, edit, delete) in `website/app.js`, and the books table and forms in `website/views/library.ejs`.
- `website/db.js`: the two database connections, and `website/database/schema.sql`.
- Bonus: the book covers.

**Shared:** this README, the Lab 2 login pages, the design (`website/public/style.css`), and testing all scripts and pages.

## 2. What is in this repository

| File or folder | What it is |
|---|---|
| `problem1_DDL.sql` | Creates the `company` database and the tables EMPLOYEE, DEPARTMENT and PROJECT with their keys. |
| `problem1_DML.sql` | Inserts 3 rows in each table. |
| `problem1_Answers.txt` | The SQL and the output or error for Q1.1 to Q1.3. |
| `problem2_DDL.sql` | Creates the `library` database with the tables AUTHOR and BOOK. |
| `problem2_DML.sql` | Seed data: 3 authors and 6 books. |
| `website/` | The Lab 2 website with the new library pages. |
| `website/database/schema.sql` | Creates the `users_db` database used for login. |

## 3. Technology

| Part | What we used |
|---|---|
| Back end | Node.js, Express, express-session, bcryptjs, mysql2, dotenv |
| Front end | EJS templates, HTML, CSS, JavaScript |
| Database | MySQL, plain SQL with parameters (no ORM) |

## 4. How to run it

1. Install **Node.js** and **MySQL** (with the MySQL client).
2. Download the project and open a terminal in its main folder.
3. Build the databases and insert the data:
   ```
   mysql -u root -p < problem1_DDL.sql
   mysql -u root -p < problem1_DML.sql
   mysql -u root -p < problem2_DDL.sql
   mysql -u root -p < problem2_DML.sql
   mysql -u root -p < website/database/schema.sql
   ```
   On Windows, write the last path as `website\database\schema.sql`.
4. Go into the website folder and install the libraries:
   ```
   cd website
   npm install
   ```
5. Copy `.env.example` to a new file named `.env`, and write your own MySQL password after `DB_PASSWORD=`. Leave the other values as they are.
6. Start the server:
   ```
   node app.js
   ```
7. Open `http://localhost:3000`, click **Sign up here** to create an account, and log in to see the library page.

To type queries by hand for Problem 1, run `mysql -u root -p company`.

## 5. The website (Problem 2)

| Requirement | What the website does |
|---|---|
| Register and login | Register and log in, as in Lab 2. The library pages need a logged-in user. |
| Register checks | Name: required, at most 100 characters, letters only (spaces, apostrophes, dots and hyphens allowed). Email: required, at most 255 characters, valid format. Password: at least 8 characters and equal to the confirmation. The same rules run in the browser and on the server. |
| F2.1 Show | A table of the books (with each `author_id`) and a table of the authors. |
| F2.2 Add | Add a book and add an author. A duplicate ID shows `Author ID already exists` or `Book ID already exists`, and a book with an unknown author shows `Author ID does not exist`. |
| F2.3 Edit | Edit a book and edit an author directly in the table, then press Save. |
| F2.4 Remove a book | Delete a book, after an "are you sure?" question. |
| F2.5 Remove an author | Delete an author. The foreign key has `ON DELETE CASCADE`, so all the books of that author are deleted too. |
| Bonus | A cover image for each book and a photo for each author, uploaded in the add and edit forms and shown in the tables. |

## 6. Notes

- `BOOK.author_id` is a foreign key to `AUTHOR.author_id` with `ON DELETE CASCADE`. MySQL rejects a book whose author does not exist.
- The website uses two databases: `users_db` for the accounts and `library` for the books and authors.
- The scripts start with `DROP DATABASE IF EXISTS`, so they can be run again at any time.