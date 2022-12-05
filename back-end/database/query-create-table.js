export const TEXT_CREATE_QUESTION_TABLE = `
  CREATE TABLE IF NOT EXISTS "question" (
    "id" SERIAL,
    "description" VARCHAR(200) NOT NULL,
    "true_answer" VARCHAR(15) NOT NULL,
    "level" NUMERIC(1, 0),

    PRIMARY KEY ("id")
  );

  CREATE TABLE IF NOT EXISTS "answer" (
    "id" SERIAL,
    "description" VARCHAR(200) NOT NULL,

    PRIMARY KEY ("id")
  );

  CREATE TABLE IF NOT EXISTS "exam" (
    "id" SERIAL,
    "type" VARCHAR(100) NOT NULL,
    "time" INTEGER

    PRIMARY KEY ("id")
  )

  CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "role" NUMERIC(1, 0) NOT NULL,
    "level" FLOAT,
    "time_using" INTEGER,
    "phone_number" INTEGER,

    PRIMARY KEY ("id")
  )

  CREATE TABLE IF NOT EXISTS "tag" (
    "id" SERIAL,
    "name" VARCHAR(100),
    PRIMARY KEY ("id")

  )

  CREATE TABLE IF NOT EXISTS "question_tag" (
    "id" SERIAL,
    "id_question" INTEGER NOT NULL,
    "id_tag" INTEGER NOT NULL,

    PRIMARY KEY ("id"),
    FOREIGN KEY ("id_question) REFERENCES question("id"),
    FOREIGN KEY ("id_tag) REFERENCES tag("id")
  )

  CREATE TABLE IF NOT EXISTS "exam_question" (
    "id" SERIAL,
    "id_exam" INTEGER NOT NULL,
    "id_question" INTEGER NOT NULL,

    PRIMARY KEY ("id"),
    FOREIGN KEY ("id_question) REFERENCES question("id"),
    FOREIGN KEY ("id_exam) REFERENCES exam("id")
  )

  CREATE TABLE IF NOT EXISTS "question_answer" (
    "id" SERIAL,
    "id_question" INTEGER NOT NULL,
    "id_answer" INTEGER NOT NULL,

    PRIMARY KEY ("id"),
    FOREIGN KEY ("id_question) REFERENCES question("id")
    FOREIGN KEY ("id_answer) REFERENCES answer("id")

  )

  CREATE TABLE IF NOT EXITS "user_exam" {
    "id" SERIAL,
    "id_user" INTEGER NOT NULL,
    "id_exam" INTEGER NOT NULL,

    PRIMARY KEY ("id"),
    FOREIGN KEY ("id_exam) REFERENCES exam("id"),
    FOREIGN KEY ("id_user) REFERENCES user("id"),

  }
`;
