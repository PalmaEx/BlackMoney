const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { WebhookClient } = require('discord.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const ejs = require('ejs');
const ForumAnswer = require('../models/forumAnswer');

/*
 * 'Dashboard' Command for Discord Bot
 *
 * Description: No.
 * Author: Hubyp#2814 & 948916911293497344
 * Copyright © 2023 Palma Team
 *
 * For more information or to report issues, please refer to the README.md and LICENSE files.
 * You can also contact us at Hubyp#2814 & 948916911293497344.
 *
 */
const forumQuestionSchema = new mongoose.Schema({
        title: String,
        description: String,
        user: {
                username: String,
                avatarURL: String
        },
        createdAt: {
                type: Date,
                default: Date.now
        }
});
const ForumQuestion = mongoose.model('ForumQuestion', forumQuestionSchema);

mongoose.connect('mongodb+srv://neza4:uo-vs85e@cluster0.8i9vcnx.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
});
const secret = uuidv4();

const authenticatedUsers = {};

app.use(session({
        secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
        resave: false,
        saveUninitialized: false,
}));

app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: 'https://testwq.hubyp.repl.co/callback',
        scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
        authenticatedUsers[profile.id] = profile;

        const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });
        webhookClient.send(`User logged in: ${profile.username}`);

        if (profile.avatar) {
                profile.avatarURL = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
        } else {
                profile.avatarURL = 'https://www.svgrepo.com/show/340721/no-image.svg';
        }

        return done(null, profile);
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use('/images', express.static(__dirname + '/public/images'));
app.use('/videos', express.static(__dirname + '/public/videos'));

passport.serializeUser((user, done) => {
        done(null, user.id);
});

passport.deserializeUser((id, done) => {
        const user = authenticatedUsers[id];
        if (user) {
                done(null, user);
        } else {
                done(new Error('User not found'), null);
        }
});

app.get("/callback", passport.authenticate("discord", {
        failureRedirect: "/error?code=999&message=We encountered an error while connecting."
}), async (req, res) => {
        if (req.isAuthenticated()) {
                if (req.user.isAdmin) {
                        res.redirect('/admin');
                } else {
                        res.redirect('/');
                }
        } else {

                req.session.destroy(() => {
                        res.json({
                                login: false,
                                message: "You have been blocked from Topic.",
                                logout: true
                        });
                        req.logout();
                });
        }
});

app.get('/logout', (req, res) => {
        if (req.isAuthenticated()) {
                delete authenticatedUsers[req.user.id];

                req.logout(() => {
                        res.redirect('/');
                });
        } else {
                res.redirect('/');
        }
});

app.get('/', (req, res) => {
        res.render('home', { user: req.user });
});

app.get('/join', (req, res) => {
        res.redirect('https://discord.gg/BlackMoney');
});
app.get('/magazin/hubyp', (req, res) => {
        res.render('hubyp');
});
app.get('/magazin/miguel', (req, res) => {
        res.render('miguel');
});
// Updated code for a more functional forum system:

// Helper function to generate slug
function generateSlug(title) {
        return encodeURIComponent(title.trim().replace(/\s+/g, '-').toLowerCase());
}
app.get('/forum', async (req, res) => {
        try {
                const questions = await ForumQuestion.find({}).sort({ createdAt: -1 }).lean().exec();
                const topics = questions.map(question => {
                        if (question.title) {
                                question.slug = generateSlug(question.title);
                        }
                        return question;
                });

                res.render('forum', { user: req.user, topics: questions });

        } catch (err) {
                console.error(err);
                res.status(500).send('Error retrieving questions.');
        }
});


app.get('/forum/:slug', async (req, res) => {
        const slug = req.params.slug;
        try {
                const question = await ForumQuestion.findOne({ slug }).lean().exec();

                if (!question) {
                        return res.status(404).send('Forum question not found.');
                }

                // Încarcă și răspunsurile asociate întrebării
                const answers = await ForumAnswer.find({ questionId: question._id }).lean().exec();

                // Afișează întrebarea și răspunsurile folosind șablonul specific
                res.render('forum', { user: req.user, question, answers });

        } catch (err) {
                console.error(err);
                res.status(500).send('Error retrieving the question.');
        }
});

// Adaugă ruta pentru gestionarea răspunsurilor
app.post('/forum/post-answer/:questionId', async (req, res) => {
        if (req.isAuthenticated()) {
                const { content } = req.body;
                const questionId = req.params.questionId;

                // Creează un nou răspuns
                const newAnswer = new ForumAnswer({
                        content,
                        user: {
                                username: req.user.username,
                                avatarURL: req.user.avatarURL
                        },
                        questionId
                });

                try {
                        // Salvează noul răspuns în baza de date
                        const savedAnswer = await newAnswer.save();
                        res.redirect(`/forum/${savedAnswer.slug}`); // Poți redirecționa la întrebarea asociată răspunsului sau la altceva

                } catch (err) {
                        console.error(err);
                        res.status(500).send('Error saving the forum answer.');
                }
        } else {
                res.status(401).send('You need to be authenticated to post an answer.');
        }
});
app.delete('/forum/:id', async (req, res) => {
        if (req.isAuthenticated() && req.user.isAdmin) {
                const questionId = req.params.id;

                try {
                        await ForumQuestion.findByIdAndDelete(questionId).exec();
                        res.json({ success: true, message: 'Forum question deleted successfully.', deletedId: questionId });
                } catch (err) {
                        console.error(err);
                        res.status(500).send('Error deleting the forum question.');
                }
        } else {
                res.status(403).send('You are not authorized to delete forum questions.');
        }
});

app.get('/delete-all-forums', async (req, res) => {
        try {
                // Șterge toate forumurile
                await ForumQuestion.deleteMany({});
                res.send('Toate forumurile au fost șterse cu succes.');
        } catch (err) {
                console.error(err);
                res.status(500).send('Eroare la ștergerea forumurilor.');
        }
});
// Ruta POST pentru a crea un nou subiect
app.post('/forum/post-question', async (req, res) => {
        if (req.isAuthenticated()) {
                const { title, description } = req.body;
                const slug = generateSlug(title);
                const newForumQuestion = new ForumQuestion({
                        title,
                        description,
                        user: {
                                username: req.user.username,
                                avatarURL: req.user.avatarURL
                        },
                        slug
                });

                try {
                        const savedQuestion = await newForumQuestion.save();

                        // Crează un fișier de vizualizare pentru noul subiect
                        const forumViewPath = path.join(__dirname, 'views', 'forum', `${slug}.ejs`);
                        fs.writeFileSync(forumViewPath, '<!-- Aici poți adăuga structura HTML/EJS pentru subiect -->');

                        // Redirecționează către slug-ul noului subiect
                        res.redirect(`/forum/${slug}`);
                } catch (err) {
                        console.error(err);
                        res.status(500).send('Error saving the forum question.');
                }
        } else {
                res.status(401).send('You need to be authenticated to post a question.');
        }
});

/*
 * 'Dashboard' Command for Discord Bot
 *
 * Description: No.
 * Author: Hubyp#2814 & 948916911293497344
 * Copyright © 2023 Palma Team
 *
 * For more information or to report issues, please refer to the README.md and LICENSE files.
 * You can also contact us at Hubyp#2814 & 948916911293497344.
 *
 */
app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
});
