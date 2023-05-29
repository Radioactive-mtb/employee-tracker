DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
    id INT NOT NULL 
    AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT PRIMARY KEY 
    AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    dept_id INT NOT NULL,
    FOREIGN KEY (dept_id)
    REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT PRIMARY KEY
    AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
);