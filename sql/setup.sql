DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS tickets;
-- DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS syllabus;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS cohort_to_syllabus;
DROP TABLE IF EXISTS cohorts;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles;


CREATE TABLE roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE cohorts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  month TEXT NOT NULL,
  year INT NOT NULL
);

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  username TEXT NOT NULL,
  email TEXT,
  password_hash TEXT,
  avatar TEXT,
  cohort_id INT,
  role INT,
  FOREIGN KEY (role) REFERENCES roles(id),
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
);

CREATE TABLE cohort_to_syllabus (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cohort_id INT NOT NULL,
  syllabus_id INT NOT NULL,
  FOREIGN KEY (syllabus_id) REFERENCES syllabus(id),
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
);

CREATE TABLE status (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

-- CREATE TABLE comments (
--   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   text TEXT,
--   user_id BIGINT NOT NULL,
--   target_entity INT NOT NULL,
--   target_entity_id INT NOT NULL,
--   FOREIGN KEY (user_id) REFERENCES users(id)
-- );

CREATE TABLE syllabus (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  thumbnail_photo TEXT,
  created_by BIGINT NOT NULL,
  owner_id BIGINT NOT NULL,
  description TEXT,
  status_id INT NOT NULL,
  cohort_id INT NOT NULL,
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
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
  user_id INT NOT NULL,
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (syllabus_id) REFERENCES syllabus(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  text TEXT,
  status_id INT NOT NULL,
  assignment_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tickets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  text TEXT,
  status_id INT NOT NULL,
  assignment_id INT NOT NULL,
  ta_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  FOREIGN KEY (ta_id) REFERENCES users(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- write seed info for each table



INSERT INTO roles (name, description) VALUES
('Student', 'just a student'),
('TA', 'Teachers assistant for each cohort'),
('Teacher', 'Leader of the cohort'),
('Admin', 'Full CRUD access across the application');

INSERT INTO status (name) VALUES ('pending');

INSERT INTO cohorts (month, year) VALUES 
('February', 2022);

INSERT INTO users (username, email, password_hash, avatar, cohort_id, role ) VALUES
('Will test', 'test@test.com', '', '', 1, 1);

INSERT INTO syllabus ( title, thumbnail_photo, created_by, owner_id, description, status_id, cohort_id)
VALUES 
('Module 1', 'url', 1, 1, '1st module of Alchemy', 1, 1);

