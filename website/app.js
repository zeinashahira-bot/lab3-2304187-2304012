require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const { usersDb, libraryDb } = require('./db');

const nameRule = /^[\p{L}][\p{L} '.-]*$/u;
const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Configure multer storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

function checkLogin(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

function showError(res, err) {
    console.error(err);
    res.status(500).render('error');
}

async function showLibrary(req, res, errors) {
    try {
        const [authors] = await libraryDb.execute(
            'SELECT author_id, name, country, photo FROM AUTHOR ORDER BY author_id'
        );
        const [books] = await libraryDb.execute(
            'SELECT book_id, title, price, author_id, cover FROM BOOK ORDER BY book_id'
        );

        res.render('library', {
            userName: req.session.userName,
            authors: authors,
            books: books,
            errors: errors
        });
    } catch (err) {
        showError(res, err);
    }
}

app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/library');
    } else {
        res.redirect('/login');
    }
});

app.get('/register', (req, res) => {
    if (req.session.userId) {
        res.redirect('/library');
    } else {
        res.render('register', { errors: [], values: {} });
    }
});

app.post('/register', async (req, res) => {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim();
    const password = req.body.password || '';
    const confirmPassword = req.body.confirm_password || '';

    const errors = [];

    if (!name) {
        errors.push('Name is required');
    } else if (name.length > 100) {
        errors.push('Name is too long (100 characters at most)');
    } else if (!nameRule.test(name)) {
        errors.push('Name contains invalid characters');
    }

    if (!email) {
        errors.push('Email is required');
    } else if (email.length > 255) {
        errors.push('Email is too long (255 characters at most)');
    } else if (!emailRule.test(email)) {
        errors.push('Email is not valid');
    }

    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    if (!confirmPassword) {
        errors.push('Confirm password is required');
    }

    if (password && confirmPassword && password !== confirmPassword) {
        errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
        return res.render('register', { errors: errors, values: { name, email } });
    }

    try {
        const hash = await bcrypt.hash(password, 12);
        const [result] = await usersDb.execute(
            'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
            [email, name, hash]
        );
        req.session.userId = result.insertId;
        req.session.userName = name;
        res.redirect('/library');
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.render('register', {
                errors: ['Email Already Exists'],
                values: { name, email }
            });
        } else {
            showError(res, err);
        }
    }
});

app.get('/login', (req, res) => {
    if (req.session.userId) {
        res.redirect('/library');
    } else {
        res.render('login', { errors: [], values: {} });
    }
});

app.post('/login', async (req, res) => {
    const email = (req.body.email || '').trim();
    const password = req.body.password || '';

    const errors = [];
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');

    if (errors.length > 0) {
        return res.render('login', { errors: errors, values: { email } });
    }

    try {
        const [rows] = await usersDb.execute(
            'SELECT user_id, name, password_hash FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            res.render('login', {
                errors: ['Invalid email or password'],
                values: { email }
            });
        } else {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password_hash);

            if (match) {
                req.session.userId = user.user_id;
                req.session.userName = user.name;
                res.redirect('/library');
            } else {
                res.render('login', {
                    errors: ['Invalid email or password'],
                    values: { email }
                });
            }
        }
    } catch (err) {
        showError(res, err);
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.get('/library', checkLogin, (req, res) => {
    showLibrary(req, res, []);
});

app.post('/authors/add', checkLogin, upload.single('photo'), async (req, res) => {
    const authorId = (req.body.author_id || '').trim();
    const name = (req.body.name || '').trim();
    const country = (req.body.country || '').trim();
    const photo = req.file ? '/uploads/' + req.file.filename : null;

    if (!authorId || !name || !country) {
        return showLibrary(req, res, ['Author ID, name and country are required']);
    }

    try {
        await libraryDb.execute(
            'INSERT INTO AUTHOR (author_id, name, country, photo) VALUES (?, ?, ?, ?)',
            [authorId, name, country, photo]
        );
        res.redirect('/library');
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            showLibrary(req, res, ['Author ID already exists']);
        } else {
            showError(res, err);
        }
    }
});

app.post('/books/add', checkLogin, upload.single('cover'), async (req, res) => {
    const bookId = (req.body.book_id || '').trim();
    const title = (req.body.title || '').trim();
    const price = (req.body.price || '').trim();
    const authorId = (req.body.author_id || '').trim();
    const cover = req.file ? '/uploads/' + req.file.filename : null;

    if (!bookId || !title || !price || !authorId) {
        return showLibrary(req, res, ['Book ID, title, price and author ID are required']);
    }

    try {
        await libraryDb.execute(
            'INSERT INTO BOOK (book_id, title, price, author_id, cover) VALUES (?, ?, ?, ?, ?)',
            [bookId, title, price, authorId, cover]
        );
        res.redirect('/library');
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            showLibrary(req, res, ['Book ID already exists']);
        } else if (err.errno === 1452) {
            showLibrary(req, res, ['Author ID does not exist']);
        } else {
            showError(res, err);
        }
    }
});

app.post('/authors/:id/edit', checkLogin, async (req, res) => {
    const name = (req.body.name || '').trim();
    const country = (req.body.country || '').trim();

    if (!name || !country) {
        return showLibrary(req, res, ['Name and country are required']);
    }

    try {
        await libraryDb.execute(
            'UPDATE AUTHOR SET name = ?, country = ? WHERE author_id = ?',
            [name, country, req.params.id]
        );
        res.redirect('/library');
    } catch (err) {
        showError(res, err);
    }
});

app.post('/books/:id/edit', checkLogin, async (req, res) => {
    const title = (req.body.title || '').trim();
    const price = (req.body.price || '').trim();
    const authorId = (req.body.author_id || '').trim();

    if (!title || !price || !authorId) {
        return showLibrary(req, res, ['Title, price and author ID are required']);
    }

    try {
        await libraryDb.execute(
            'UPDATE BOOK SET title = ?, price = ?, author_id = ? WHERE book_id = ?',
            [title, price, authorId, req.params.id]
        );
        res.redirect('/library');
    } catch (err) {
        if (err.errno === 1452) {
            showLibrary(req, res, ['Author ID does not exist']);
        } else {
            showError(res, err);
        }
    }
});

app.post('/books/:id/delete', checkLogin, async (req, res) => {
    try {
        await libraryDb.execute(
            'DELETE FROM BOOK WHERE book_id = ?',
            [req.params.id]
        );
        res.redirect('/library');
    } catch (err) {
        showError(res, err);
    }
});

app.post('/authors/:id/delete', checkLogin, async (req, res) => {
    try {
        await libraryDb.execute(
            'DELETE FROM AUTHOR WHERE author_id = ?',
            [req.params.id]
        );
        res.redirect('/library');
    } catch (err) {
        showError(res, err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});