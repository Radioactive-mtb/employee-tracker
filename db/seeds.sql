INSERT INTO departments (dept_name)
VALUES
('warehouse'),
('service'),
('management');

INSERT INTO roles (title, salary, dept_id)
VALUES
("WH associate", 40000.00, 1),
('service tech', 60000.00, 2),
('manager', 80000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Jay', 'Bird', 1, null),
('Haden', 'Smith', 1, null),
('Casey', 'Wood', 2, null),
('Roy', "Little", 3, 1);