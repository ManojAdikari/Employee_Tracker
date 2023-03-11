DROP DATABASE IF EXISTS Employee_db;
CREATE DATABASE Employee_db;

USE Employee_db;

CREATE TABLE Department (
  dp_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dp_name VARCHAR(30) NOT NULL
);

CREATE TABLE Emp_role (
  ro_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ro_title VARCHAR(30) NOT NULL,
  ro_salary DECIMAL,
  ro_dp_id INT ,
  FOREIGN KEY (ro_dp_id)
  REFERENCES Department(dp_id)
  ON DELETE SET NULL
);

CREATE TABLE Employee (
  emp_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  emp_first_name VARCHAR(30) NOT NULL,
  emp_last_name VARCHAR(30),
  emp_role_id INT  ,
  emp_manager_id INT,
  FOREIGN KEY (emp_role_id)
  REFERENCES Emp_role(ro_id)
  ON DELETE SET NULL,
  FOREIGN KEY (emp_manager_id)
  REFERENCES Employee(emp_id)
  ON DELETE SET NULL
);