const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/', (req, res) => {
	res.json({
		msg: 'Welcome to the homepage'
	})
});

app.post('/posts', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			res.json({
				msg: 'Post created....',
				authData
			})
		}
	});
});

app.post('/login', (req, res) => {
	const user = {
		id: 1,
		username: 'john',
		email: 'john@gmail.com'
	}
	jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
		res.json({
			token
		});
	});
});

//verify token
function verifyToken(req, res, next) {
	//get auth token
	const bearer = req.headers['authorization'];

	if (typeof bearer !== 'undefined') {
		req.token = bearer.split(' ')[1];
		next();
	} else {
		res.json({
			msg: 'Your bearer token is empty please check....'
		})
	}
}

const PORT = process.env.PORT || 5000;

app.listen(5000, () => console.log(`Listening on port ${PORT}`))