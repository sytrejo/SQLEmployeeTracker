USE employee_db;

INSERT INTO departments(name)
VALUES 
        (001, HR),
        (002, IT),
        (003, MARKETING),
        (004, ENGINEERING),
        (005, ACCOUNTING);

INSERT INTO roles(id, title, salary, dept_id)
VALUES
        (05, "Chief Executive Officer", 200000, 008),
        (40, "Director of Sales & Marketing", 60000, 008),
        (41, "Sales Representative", 40000, 001),
        (42, "Sales Intern", 15000, 009),
        (43, "Sales Manager", 60000, 001),
        (51, "Creative Concept Specialist", 50000, 002),
        (52, "Digital Marketing Specialist", 45000, 002);

INSERT INTO employees(id, first_name, last_name, dept_id, role_id, mangr_id, is_mangr)
VALUES
        (1001, "Teddy", "Altman", 008, 05, NULL, TRUE),
        (4001, "Danielle", "Moro", 008, 40, NULL, FALSE),
        (6001, "Josephine", "Karev", 008, 60, NULL, FALSE),
        (7001, "Alexander", "Karev", 008, 70, NULL, FALSE),
        (8001, "Meredith", "Grey", 008, 80, NULL, TRUE),
        (9000, "Derek", "Shepard", 008, 90, NULL, FALSE),
        (4101, "Lynette", "Price", 001, 41, NULL, FALSE);

SELECT * FROM employees;