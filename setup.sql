CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Products (
    ItemID INTEGER(11) AUTO_INCREMENT NOT NULL,
    ProductName VARCHAR(50) NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    Price FLOAT(7, 2) NOT NULL,
    StockQuantity INTEGER(7) NOT NULL,
    PRIMARY KEY (ItemID)
);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Oppo PM-3 Headphones', 'Electronics', 399.99, 50);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Amazon Fire TV', 'Electronics', 99.99, 200);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Wilson Traditional Soccer Ball', 'Sports', 14.99, 500);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Hot Wheels Rig', 'Toys and Games', 4.99, 1000);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Lego Star Wars Playset', 'Toys and Games', 49.99, 20);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Cards Against Humanity Game Set', 'Toys and Games', 29.99, 40);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Bic Pens (60 Count)', 'Office Supplies', 4.00, 400);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('Black and Decker 5 Cup Coffee Maker', 'Kitchen', 14.99, 10);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('SlumberFRESH Bed Pillow', 'Home', 12.99, 30);

INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity)
VALUES ('STIGA Table Tennis Paddle', 'Sports', 10.99, 75);

CREATE TABLE Departments (
    DepartmentID INTEGER(11) AUTO_INCREMENT NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    OverHeadCosts FLOAT(7, 2) NOT NULL,
    TotalSales FLOAT(7, 2) NOT NULL,
    PRIMARY KEY (DepartmentID)
);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Electronics', 2000, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Sports', 300, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Toys and Games', 400, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Office Supplies', 300, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Kitchen', 100, 0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales)
VALUES ('Home', 100, 0);
