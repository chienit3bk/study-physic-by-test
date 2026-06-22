-- =============================================================================
-- study-physic-by-test — PostgreSQL schema
-- =============================================================================
-- This DDL recreates the schema produced by the Sequelize migrations in
-- back-end/migrations, with the foreign keys, unique constraints and indexes
-- that the application's model associations rely on (the migrations create the
-- columns but not the DB-level FKs).
--
-- Runtime source of truth: `npm run db:migrate`. This file is provided for
-- documentation, manual bootstrapping, and review.
--
-- Identifiers that Sequelize creates in camelCase ("createdAt", "UserId", ...)
-- are double-quoted so they match the running database exactly.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(255),
    address     VARCHAR(255),
    role        VARCHAR(255) NOT NULL DEFAULT 'user',
    level       DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT users_email_unique UNIQUE (email)
);

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
    id          SERIAL PRIMARY KEY,
    content     VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    content     VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- questions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    id            SERIAL PRIMARY KEY,
    description   VARCHAR(255) NOT NULL,
    "trueAnswer"  VARCHAR(255) NOT NULL,
    "averateTime" INTEGER NOT NULL DEFAULT -1,   -- average answer time (seconds); -1 = not yet measured
    "mainTag"     VARCHAR(255),
    instruction   VARCHAR(255),
    image         VARCHAR(255),
    verify        BOOLEAN NOT NULL DEFAULT false,
    level         INTEGER NOT NULL DEFAULT 1,     -- 1 (easy) .. 10 (hard)
    answer        JSONB,                          -- array of answer options
    "totalUser"   INTEGER NOT NULL DEFAULT 0,     -- how many users have answered (for the running average)
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- exams
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exams (
    id              SERIAL PRIMARY KEY,
    "UserId"        INTEGER NOT NULL,
    level           INTEGER NOT NULL DEFAULT 1,
    "totalQuestion" INTEGER NOT NULL,
    time            INTEGER NOT NULL,              -- exam duration (seconds)
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT exams_user_fk FOREIGN KEY ("UserId") REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- results
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS results (
    id                  SERIAL PRIMARY KEY,
    "UserId"            INTEGER NOT NULL,
    "ExamId"            INTEGER NOT NULL,
    "totalTime"         INTEGER NOT NULL,
    "totalQuestion"     INTEGER NOT NULL,
    "totalTrueQuestion" INTEGER NOT NULL,
    score               DOUBLE PRECISION NOT NULL,
    "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT results_user_fk FOREIGN KEY ("UserId") REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT results_exam_fk FOREIGN KEY ("ExamId") REFERENCES exams (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- exam_question (M:N exams <-> questions)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_question (
    id            SERIAL PRIMARY KEY,
    "QuestionId"  INTEGER NOT NULL,
    "ExamId"      INTEGER NOT NULL,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT exam_question_question_fk FOREIGN KEY ("QuestionId") REFERENCES questions (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT exam_question_exam_fk FOREIGN KEY ("ExamId") REFERENCES exams (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT exam_question_unique UNIQUE ("QuestionId", "ExamId")
);

-- ---------------------------------------------------------------------------
-- question_tag (M:N questions <-> tags)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_tag (
    id            SERIAL PRIMARY KEY,
    "QuestionId"  INTEGER NOT NULL,
    "TagId"       INTEGER NOT NULL,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT question_tag_question_fk FOREIGN KEY ("QuestionId") REFERENCES questions (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT question_tag_tag_fk FOREIGN KEY ("TagId") REFERENCES tags (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT question_tag_unique UNIQUE ("QuestionId", "TagId")
);

-- ---------------------------------------------------------------------------
-- document_tag (M:N documents <-> tags)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_tag (
    id            SERIAL PRIMARY KEY,
    "DocumentId"  INTEGER NOT NULL,
    "TagId"       INTEGER NOT NULL,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT document_tag_document_fk FOREIGN KEY ("DocumentId") REFERENCES documents (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT document_tag_tag_fk FOREIGN KEY ("TagId") REFERENCES tags (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT document_tag_unique UNIQUE ("DocumentId", "TagId")
);

-- ---------------------------------------------------------------------------
-- Indexes for common lookups
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS questions_main_tag_idx ON questions ("mainTag");
CREATE INDEX IF NOT EXISTS exams_user_idx ON exams ("UserId");
CREATE INDEX IF NOT EXISTS results_user_idx ON results ("UserId");
CREATE INDEX IF NOT EXISTS results_exam_idx ON results ("ExamId");
CREATE INDEX IF NOT EXISTS exam_question_exam_idx ON exam_question ("ExamId");
CREATE INDEX IF NOT EXISTS exam_question_question_idx ON exam_question ("QuestionId");
CREATE INDEX IF NOT EXISTS question_tag_question_idx ON question_tag ("QuestionId");
CREATE INDEX IF NOT EXISTS question_tag_tag_idx ON question_tag ("TagId");
CREATE INDEX IF NOT EXISTS document_tag_document_idx ON document_tag ("DocumentId");
CREATE INDEX IF NOT EXISTS document_tag_tag_idx ON document_tag ("TagId");

COMMIT;
