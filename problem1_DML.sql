USE company;

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO EMPLOYEE (ssn, fname, lname, bdate, address, gender, salary, Dno) VALUES
('111223333', 'Zeina', 'Amr', '2005-09-27', 'Cairo, Egypt', 'F', 30000.00, 1),
('333445555', 'Youssef', 'Refaat', '2004-11-28', 'Cairo, Egypt', 'M', 40000.00, 1),
('999887777', 'Ahmed', 'Ali', '2003-05-15', 'Giza, Egypt', 'M', 25000.00, 4);

INSERT INTO DEPARTMENT (Dnumber, Dname, mgr_ssn, mgr_start_date) VALUES
(1, 'Headquarters', '333445555', '2025-01-01'),
(4, 'Administration', '999887777', '2025-01-01'),
(5, 'Research', '333445555', '2025-01-01');

INSERT INTO PROJECT (Pnumber, Pname, Plocation, Dno) VALUES
(1, 'ProductX', 'Cairo', 5),
(2, 'ProductY', 'Giza', 5),
(3, 'ProductZ', 'Alexandria', 4);

SET FOREIGN_KEY_CHECKS = 1;