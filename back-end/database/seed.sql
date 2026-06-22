-- =============================================================================
-- study-physic-by-test — sample seed data
-- =============================================================================
-- Run AFTER schema.sql (or after `npm run db:migrate`).
-- All demo accounts use the password: 123456
-- (bcrypt hash below corresponds to "123456").
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Users  (password = "123456")
-- ---------------------------------------------------------------------------
INSERT INTO users (id, name, email, password, phone, address, role, level) VALUES
  (1, 'Admin',   'admin@test.com',   '$2b$10$a1pN/WMH5GS.Xc8P27n5XuMK1UMXx1FYbEZ62GVIL9arGMWr1tiE2', '0900000000', 'HQ',        'admin', 10),
  (2, 'Student', 'student@test.com', '$2b$10$a1pN/WMH5GS.Xc8P27n5XuMK1UMXx1FYbEZ62GVIL9arGMWr1tiE2', '0900000001', 'Ha Noi',    'user',  1),
  (3, 'Test 0',  'test0@test.com',   '$2b$10$a1pN/WMH5GS.Xc8P27n5XuMK1UMXx1FYbEZ62GVIL9arGMWr1tiE2', '0900000002', 'No where',  'user',  0)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Tags (physics topics)
-- ---------------------------------------------------------------------------
INSERT INTO tags (id, content) VALUES
  (1, 'Cơ học'),
  (2, 'Điện học'),
  (3, 'Quang học'),
  (4, 'Nhiệt học'),
  (5, 'Dao động và sóng')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Documents
-- ---------------------------------------------------------------------------
INSERT INTO documents (id, title, content) VALUES
  (1, 'Định luật Newton', 'Ba định luật Newton mô tả mối quan hệ giữa lực và chuyển động của vật.'),
  (2, 'Định luật Ohm',    'Cường độ dòng điện tỉ lệ thuận với hiệu điện thế và tỉ lệ nghịch với điện trở.')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Questions
-- ---------------------------------------------------------------------------
INSERT INTO questions (id, description, "trueAnswer", "mainTag", instruction, verify, level, answer, "averateTime", "totalUser") VALUES
  (1, 'Đơn vị đo lực trong hệ SI là gì?', 'Newton', 'Cơ học', 'Chọn đáp án đúng', true, 1,
     '[{"content":"Newton","isCorrect":true},{"content":"Joule"},{"content":"Watt"},{"content":"Pascal"}]'::jsonb, -1, 0),
  (2, 'Gia tốc trọng trường tiêu chuẩn xấp xỉ bằng?', '9.8 m/s^2', 'Cơ học', 'Chọn đáp án đúng', true, 2,
     '[{"content":"9.8 m/s^2","isCorrect":true},{"content":"10.8 m/s^2"},{"content":"8.9 m/s^2"},{"content":"1.0 m/s^2"}]'::jsonb, -1, 0),
  (3, 'Định luật Ohm được biểu diễn bằng công thức nào?', 'U = I * R', 'Điện học', 'Chọn đáp án đúng', true, 2,
     '[{"content":"U = I * R","isCorrect":true},{"content":"P = U * I"},{"content":"F = m * a"},{"content":"E = m * c^2"}]'::jsonb, -1, 0),
  (4, 'Tốc độ ánh sáng trong chân không xấp xỉ?', '3 * 10^8 m/s', 'Quang học', 'Chọn đáp án đúng', true, 3,
     '[{"content":"3 * 10^8 m/s","isCorrect":true},{"content":"3 * 10^6 m/s"},{"content":"3 * 10^5 m/s"},{"content":"3 * 10^10 m/s"}]'::jsonb, -1, 0),
  (5, 'Quá trình truyền nhiệt qua tiếp xúc trực tiếp gọi là?', 'Dẫn nhiệt', 'Nhiệt học', 'Chọn đáp án đúng', true, 2,
     '[{"content":"Dẫn nhiệt","isCorrect":true},{"content":"Đối lưu"},{"content":"Bức xạ"},{"content":"Bay hơi"}]'::jsonb, -1, 0),
  (6, 'Chu kỳ của con lắc đơn phụ thuộc vào đại lượng nào?', 'Chiều dài dây', 'Dao động và sóng', 'Chọn đáp án đúng', true, 3,
     '[{"content":"Chiều dài dây","isCorrect":true},{"content":"Khối lượng vật"},{"content":"Biên độ"},{"content":"Màu sắc vật"}]'::jsonb, -1, 0)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Question <-> Tag links
-- ---------------------------------------------------------------------------
INSERT INTO question_tag (id, "QuestionId", "TagId") VALUES
  (1, 1, 1),
  (2, 2, 1),
  (3, 3, 2),
  (4, 4, 3),
  (5, 5, 4),
  (6, 6, 5)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Document <-> Tag links
-- ---------------------------------------------------------------------------
INSERT INTO document_tag (id, "DocumentId", "TagId") VALUES
  (1, 1, 1),
  (2, 2, 2)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Keep SERIAL sequences in sync with the explicit ids above
-- ---------------------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('users', 'id'),        (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('tags', 'id'),         (SELECT MAX(id) FROM tags));
SELECT setval(pg_get_serial_sequence('documents', 'id'),    (SELECT MAX(id) FROM documents));
SELECT setval(pg_get_serial_sequence('questions', 'id'),    (SELECT MAX(id) FROM questions));
SELECT setval(pg_get_serial_sequence('question_tag', 'id'), (SELECT MAX(id) FROM question_tag));
SELECT setval(pg_get_serial_sequence('document_tag', 'id'), (SELECT MAX(id) FROM document_tag));

COMMIT;
