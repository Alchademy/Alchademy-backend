DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS syllabus;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS user_assignment;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  username TEXT NOT NULL,
  email TEXT,
  password_hash TEXT,
  avatar TEXT
);


CREATE TABLE user_assignment (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  target_entity INT NOT NULL,
  target_entity_id INT NOT NULL,
  role INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE status (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  text TEXT,
  user_id BIGINT NOT NULL,
  target_entity INT NOT NULL,
  target_entity_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE syllabus (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  thumbnail_photo TEXT,
  created_by BIGINT NOT NULL,
  owner_id BIGINT NOT NULL,
  description TEXT,
  status_id INT NOT NULL,
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE assignments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT,
  description TEXT,
  syllabus_id INT NOT NULL,
  due_date TIMESTAMPTZ,
  grade INT,
  total_points INT,
  status_id INT NOT NULL,
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (syllabus_id) REFERENCES syllabus(id)
);

CREATE TABLE submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  text TEXT,
  status_id INT NOT NULL,
  assignment_id INT NOT NULL,
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);

CREATE TABLE tickets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  text TEXT,
  status_id INT NOT NULL,
  assignment_id INT NOT NULL,
  ta_id INT NOT NULL,
  created_by INT NOT NULL,
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  FOREIGN KEY (ta_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- write seed info for each table
