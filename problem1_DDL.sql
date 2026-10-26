DROP DATABASE IF EXISTS company;
CREATE DATABASE company;
USE company;

CREATE TABLE DEPARTMENT (
    Dnumber        INT         NOT NULL,
    Dname          VARCHAR(30) NOT NULL,
    mgr_ssn        CHAR(9)     NOT NULL,
    mgr_start_date DATE,
    PRIMARY KEY (Dnumber)
);

CREATE TABLE EMPLOYEE (
    ssn     CHAR(9)       NOT NULL,
    fname   VARCHAR(15)   NOT NULL,
    lname   VARCHAR(15)   NOT NULL,
    bdate   DATE,
    address VARCHAR(30),
    gender  CHAR(1),
    salary  DECIMAL(10,2),
    Dno     INT           NOT NULL,
    PRIMARY KEY (ssn),
    FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber)
);

ALTER TABLE DEPARTMENT
    ADD FOREIGN KEY (mgr_ssn) REFERENCES EMPLOYEE(ssn);

CREATE TABLE PROJECT (
    Pnumber   INT         NOT NULL,
    Pname     VARCHAR(30) NOT NULL,
    Plocation VARCHAR(30),
    Dno       INT         NOT NULL,
    PRIMARY KEY (Pnumber),
    FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber)
);