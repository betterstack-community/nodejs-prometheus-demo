import Fastify from "fastify";
import db from "./database.js";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import formbody from "@fastify/formbody";

const fastify = Fastify({ logger: true });

fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: "a_very_secret_key_that_should_be_changed",
  cookie: { secure: false },
  saveUninitialized: false,
  resave: false,
});

// Register formbody plugin to parse application/x-www-form-urlencoded
fastify.register(formbody);

// In-memory user store for demo purposes
const users = {
  user1: { username: "user1", password: "password1" },
  user2: { username: "user2", password: "password2" },
};

// Handle login form submissions
fastify.post("/login", async (request, reply) => {
  const { username, password } = request.body;
  const user = users[username];

  if (user && user.password === password) {
    request.session.user = { username: user.username };
    return reply.send({ message: "Login successful", username: user.username });
  } else {
    return reply.status(401).send({ error: "Invalid username or password" });
  }
});

// Handle logout
fastify.post("/logout", async (request, reply) => {
  if (request.session.user) {
    delete request.session.user;
    return reply.send({ message: "Logout successful" });
  } else {
    return reply.status(401).send({ error: "Not logged in" });
  }
});

// Define a route for '/'
fastify.get("/", async (request, reply) => {
  const rows = await new Promise((resolve, reject) => {
    db.all("SELECT title, release_date, tagline FROM movies", (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve(rows);
    });
  });

  return rows.splice(0, 8);
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
