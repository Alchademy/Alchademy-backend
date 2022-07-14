DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS tickets;
-- DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS cohort_to_syllabus;
DROP TABLE IF EXISTS syllabus;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cohorts;
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
  FOREIGN KEY (status_id) REFERENCES status(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE cohort_to_syllabus (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cohort_id INT NOT NULL,
  syllabus_id INT NOT NULL,
  FOREIGN KEY (syllabus_id) REFERENCES syllabus(id),
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
);

CREATE TABLE assignments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT,
  description TEXT,
  syllabus_id INT NOT NULL,
  due_date TEXT,
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
  user_id INT NOT NULL,
  grade INT,
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

INSERT INTO status (name) VALUES ('pending'), ('active'), ('archived'), ('completed');

INSERT INTO cohorts (month, year) VALUES
('February', 2022),
('January', 2022);

INSERT INTO users (username, email, password_hash, avatar, cohort_id, role ) VALUES
('Marty', 'Marty@testAlchemy.com', '', '', null, 4), --1
('Dani', 'Dani@testAlchemy.com', '', '', null, 3), --2
('Juli', 'Juli@testAlchemy.com', '', '', null, 3), --3
('Madden', 'Madden@testAlchemy.com', '', '', 1, 2), --4
('Pete', 'Pete@testAlchemy.com', '', '', 1, 2), --5
('Tanner', 'Tanner@testAlchemy.com', '', '', 2, 2), --6
('Triana', 'Triana@testAlchemy.com', '', '', 2, 2), --7
('Delaney', 'Delaney@testAlchemy.com', '', '', 1, 1), --8
('Riley', 'Riley@testAlchemy.com', '', '', 1, 1), --9
('Beau', 'Beau@testAlchemy.com', '', '', 1, 1), --10
('Will', 'Will@testAlchemy.com', '', '', 1, 1), --11
('Denver', 'Denver@testAlchemy.com', '', '', 2, 1), --12
('Alex', 'Alex@testAlchemy.com', '', '', 2, 1); --13

INSERT INTO syllabus (title, thumbnail_photo, created_by, owner_id, description, status_id)
VALUES
('Module 1: Prework', 'url', 1, 1, '1st module of Alchemy', 1),
('Module 2: Web', 'url', 1, 1, '2nd module of Alchemy', 1),
('Module 3: React', 'url', 1, 1, '3rd module of Alchemy', 1),
('Module 4: Advanced React', 'url', 1, 1, '4th module of Alchemy', 1),
('Module 5: Backend', 'url', 1, 1, '5th module of Alchemy', 1);

INSERT INTO cohort_to_syllabus (cohort_id, syllabus_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 5),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5);

INSERT INTO assignments (title, description, syllabus_id, due_date, total_points, status_id) VALUES
('Half Baked: Soccer Score Keeper', '', 2, 'March 15th 2022', 10, 4),
('From Scratch: Poll Maker', '', 2, 'March 17th 2022', 20, 4),
('Half Baked: Mushroom Festival', '', 2, 'March 17th 2022', 10, 4),
('From Scratch: Goblin Fighter', '', 2, 'March 18th 2022', 20, 4),
('Half Baked: City Post Card Builder', '', 3, 'May 3rd 2022', 10, 4),
('From Scratch: Fast Food Order App', '', 3, 'May 4th 2022', 20, 4),
('Half Baked: Board Game Inventory', '', 3, 'May 12th 2022', 10, 4),
('From Scratch: Pokedex Proxy', '', 3, 'May 18th 2022', 20, 4),
('Half Baked: Lazy Bouncer Club', '', 5, 'June 22nd 2022', 10, 4),
('From Scratch: Gitty', '', 5, 'June 17th 2022', 20, 4),
('Half Baked: Cartoon Cats', '', 5, 'June 7th 2022', 10, 4),
('From Scratch: Zodiac API', '', 5, 'June 8th 2022', 20, 4),
('Half Baked: Dont Know Advanced React', '', 4, 'August 10th 2022', 10, 4),
('From Scratch: Dont Know Advanced React', '', 4, 'August 11th 2022', 20, 4);

INSERT INTO submissions (text, status_id, assignment_id, user_id, grade) VALUES 
('Beau Submission for Soccer Score Keeper', 4, 1, 10, 10),
('Beau Submission for Poll Maker', 4, 2, 10, 10),
('Beau Submission for Mushroom Festival', 4, 3, 10, 6),
('Beau Submission for Goblin Fighter', 1, 4, 10, null);





