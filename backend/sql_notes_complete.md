# 📘 Complete SQL Masterclass — Basics to Advanced

> Your one-stop guide to mastering SQL. Every concept includes a clear explanation, the actual query, and **Input → Output tables** so you can visualize exactly what happens.

---

## 📗 Chapter 1: Foundations

### 1.1 What is SQL?

**SQL (Structured Query Language)** is the standard programming language used to communicate with relational databases. Think of a relational database as a collection of highly organized, linked spreadsheets (tables). SQL is the language you use to ask questions about that data or to reorganize it.

```sql
SELECT * FROM Employees;
```

> This retrieves **all rows and all columns** from the `Employees` table. The `*` is a wildcard meaning "everything."

---

### 1.2 What is a Database?

A database is an organized collection of data stored and managed electronically. In the context of SQL, it specifically refers to a **Relational Database Management System (RDBMS)**, where data is structured into **tables** (rows & columns), allowing you to establish logical relationships.

**Real-World Example:** An e-commerce database stores customer name, email, contact number, and purchase history.

---

### 1.3 Types of SQL Commands

SQL commands fall into **5 categories** based on what they do:

| Category | Full Name | Purpose | Key Commands |
| :--- | :--- | :--- | :--- |
| **DDL** | Data Definition Language | Defines the structure/blueprint | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| **DML** | Data Manipulation Language | Manages the actual data | `INSERT`, `UPDATE`, `DELETE` |
| **DQL** | Data Query Language | Retrieves/fetches data | `SELECT` |
| **DCL** | Data Control Language | Manages permissions & security | `GRANT`, `REVOKE` |
| **TCL** | Transaction Control Language | Manages transactions | `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

---

## 📗 Chapter 2: Keys & Constraints

### 2.1 Primary Key

A Primary Key is a column (or combination of columns) that **uniquely identifies** each row. It cannot be `NULL` and cannot have duplicates. Only **one** per table.

```sql
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    Name       VARCHAR(50),
    Age        INT
);

INSERT INTO Employees VALUES (1, 'Alice', 28);  -- ✅ Success
INSERT INTO Employees VALUES (2, 'Bob', 34);    -- ✅ Success
INSERT INTO Employees VALUES (1, 'Charlie', 25); -- ❌ FAILS! ID 1 already taken.
```

**Output Table:**

| EmployeeID | Name | Age |
| :--- | :--- | :--- |
| 1 | Alice | 28 |
| 2 | Bob | 34 |

> Charlie was rejected because `EmployeeID = 1` is already taken by Alice.

---

### 2.2 Foreign Key

A Foreign Key is a column that **references the Primary Key of another table**, linking them together and enforcing **referential integrity**.

```sql
CREATE TABLE Departments (
    DepartmentID   INT PRIMARY KEY,
    DepartmentName VARCHAR(50)
);

CREATE TABLE Employees (
    EmployeeID   INT PRIMARY KEY,
    Name         VARCHAR(50),
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);
```

**Departments Table (Parent):**

| DepartmentID | DepartmentName |
| :--- | :--- |
| 100 | Human Resources |
| 101 | Engineering |

**Employees Table (Child — After Inserts):**

| EmployeeID | Name | DepartmentID |
| :--- | :--- | :--- |
| 1 | Alice | 101 |
| 2 | Bob | 100 |
| 3 | Charlie | 101 |
| 4 | Diana | NULL |

> Inserting an employee with `DepartmentID = 999` would **FAIL** because 999 doesn't exist in the Departments table.

---

### 2.3 UNIQUE Key

Ensures all values in a column are **distinct**, but unlike a Primary Key, it **allows one NULL** value and you can have **multiple** UNIQUE keys per table.

```sql
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    Email      VARCHAR(100) UNIQUE,
    Name       VARCHAR(50)
);

INSERT INTO Employees VALUES (1, 'alice@email.com', 'Alice');   -- ✅
INSERT INTO Employees VALUES (2, 'bob@email.com', 'Bob');       -- ✅
INSERT INTO Employees VALUES (3, 'alice@email.com', 'Charlie'); -- ❌ Duplicate email!
INSERT INTO Employees VALUES (4, NULL, 'Diana');                -- ✅ NULL is allowed.
```

**Output Table:**

| EmployeeID | Email | Name |
| :--- | :--- | :--- |
| 1 | alice@email.com | Alice |
| 2 | bob@email.com | Bob |
| 4 | NULL | Diana |

---

### 2.4 Primary Key vs UNIQUE Key

| Feature | Primary Key | UNIQUE Key |
| :--- | :--- | :--- |
| **Purpose** | Uniquely identifies each row | Ensures column values are unique |
| **NULL Values** | ❌ Not allowed | ✅ Allows one NULL |
| **Count per Table** | Only 1 | Multiple allowed |
| **Index Created** | Clustered Index | Non-Clustered Index |

---

### 2.5 NOT NULL Constraint

Forces a column to **always have a value**. You cannot insert `NULL` into that column.

```sql
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    Name       VARCHAR(50) NOT NULL,  -- Mandatory!
    Email      VARCHAR(100)           -- Optional.
);

INSERT INTO Employees VALUES (1, 'Alice', 'alice@email.com'); -- ✅
INSERT INTO Employees VALUES (2, 'Bob', NULL);                -- ✅ Email can be empty.
INSERT INTO Employees VALUES (3, NULL, 'charlie@email.com');  -- ❌ Name is NOT NULL!
```

**Output Table:**

| EmployeeID | Name | Email |
| :--- | :--- | :--- |
| 1 | Alice | alice@email.com |
| 2 | Bob | NULL |

---

### 2.6 DEFAULT Constraint

Provides a **pre-set value** for a column if no value is given during insert.

```sql
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    Name       VARCHAR(50),
    Salary     DECIMAL(10, 2) DEFAULT 5000
);

INSERT INTO Employees (EmployeeID, Name, Salary) VALUES (1, 'Alice', 8000);
INSERT INTO Employees (EmployeeID, Name) VALUES (2, 'Bob'); -- No salary specified!
```

**Output Table:**

| EmployeeID | Name | Salary |
| :--- | :--- | :--- |
| 1 | Alice | 8000.00 |
| 2 | Bob | 5000.00 ← Default! |

---

## 📗 Chapter 3: Modifying & Filtering Data

### 3.1 DELETE vs TRUNCATE vs DROP

| Command | What it Does | Can Rollback? | Affects Structure? | Speed |
| :--- | :--- | :--- | :--- | :--- |
| `DELETE` | Removes **specific rows** using `WHERE` | ✅ Yes | No | 🐢 Slow |
| `TRUNCATE` | Removes **all rows** (empties the table) | ❌ No | No (keeps shell) | 🐇 Fast |
| `DROP` | Deletes the **entire table** (data + structure) | ❌ No | ✅ Yes (gone forever) | ⚡ Fastest |

```sql
DELETE FROM Employees WHERE EmployeeID = 101; -- Deletes one specific row.
TRUNCATE TABLE Employees;                     -- Empties the entire table instantly.
DROP TABLE Employees;                         -- The table no longer exists.
```

---

### 3.2 WHERE vs HAVING

* **WHERE**: A **row-level** filter. Runs *before* grouping.
* **HAVING**: A **group-level** filter. Runs *after* `GROUP BY`.

**Input Table (Employees):**

| Name | Department | Salary |
| :--- | :--- | :--- |
| Alice | HR | 4000 |
| Bob | HR | 4500 |
| Charlie | IT | 6000 |
| Diana | IT | 7000 |

```sql
SELECT Department, AVG(Salary) AS AvgSalary
FROM Employees
GROUP BY Department
HAVING AVG(Salary) > 5000;
```

**Step-by-step:** `GROUP BY` creates: HR (Avg=4250), IT (Avg=6500). Then `HAVING` removes HR.

**Output Table:**

| Department | AvgSalary |
| :--- | :--- |
| IT | 6500 |

---

## 📗 Chapter 4: The Power of JOINs

Joins combine data from **two or more tables** based on a related column.

> For all Join examples below, we use these two tables as input:

**Employees Table (Left):**

| EmployeeID | Name | DepartmentID |
| :--- | :--- | :--- |
| 1 | Alice | 101 |
| 2 | Bob | 102 |
| 3 | Charlie | 999 *(No match)* |

**Departments Table (Right):**

| DepartmentID | DepartmentName |
| :--- | :--- |
| 101 | HR |
| 102 | IT |
| 103 | Marketing *(No match)* |

---

### 4.1 INNER JOIN — Only Matches

```sql
SELECT e.Name, d.DepartmentName
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

| Name | DepartmentName |
| :--- | :--- |
| Alice | HR |
| Bob | IT |

> ❌ Charlie excluded (no Dept 999). ❌ Marketing excluded (no employee).

---

### 4.2 LEFT JOIN — All from Left

```sql
SELECT e.Name, d.DepartmentName FROM Employees e
LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

| Name | DepartmentName |
| :--- | :--- |
| Alice | HR |
| Bob | IT |
| Charlie | **NULL** |

> ✅ Charlie included (Left table). His dept is `NULL`.

---

### 4.3 RIGHT JOIN — All from Right

```sql
SELECT e.Name, d.DepartmentName FROM Employees e
RIGHT JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

| Name | DepartmentName |
| :--- | :--- |
| Alice | HR |
| Bob | IT |
| **NULL** | Marketing |

> ✅ Marketing included (Right table). Its employee is `NULL`.

---

### 4.4 FULL JOIN — Everything

```sql
SELECT e.Name, d.DepartmentName FROM Employees e
FULL JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

| Name | DepartmentName |
| :--- | :--- |
| Alice | HR |
| Bob | IT |
| Charlie | **NULL** |
| **NULL** | Marketing |

---

### 4.5 SELF JOIN — Table with Itself

Perfect for employee-manager hierarchies. Uses aliases (`E1`, `E2`).

**Input (Employees):**

| EmployeeID | EmployeeName | ManagerID |
| :--- | :--- | :--- |
| 1 | Alice (Boss) | NULL |
| 2 | Bob | 1 |
| 3 | Charlie | 1 |

```sql
SELECT E1.EmployeeName AS Employee, E2.EmployeeName AS Manager
FROM Employees E1
JOIN Employees E2 ON E1.ManagerID = E2.EmployeeID;
```

| Employee | Manager |
| :--- | :--- |
| Bob | Alice |
| Charlie | Alice |

---

### 4.6 CROSS JOIN — Cartesian Product

Every row from Table 1 × every row from Table 2. No `ON` clause.

**Input:** Employees (2 rows) × Departments (3 rows) = **6 rows**

```sql
SELECT e.Name, d.DepartmentName
FROM Employees e CROSS JOIN Departments d;
```

| Name | DepartmentName |
| :--- | :--- |
| Alice | HR |
| Alice | IT |
| Alice | Sales |
| Bob | HR |
| Bob | IT |
| Bob | Sales |

---

## 📗 Chapter 5: UNION, Normalization & Data Types

### 5.1 UNION vs UNION ALL

`UNION` stacks results **vertically** (rows on top of each other).

**Input:** Employees has Alice, Bob. Managers has Bob, Charlie.

```sql
SELECT Name FROM Employees UNION SELECT Name FROM Managers;
-- UNION ALL keeps duplicates
SELECT Name FROM Employees UNION ALL SELECT Name FROM Managers;
```

| UNION Output | UNION ALL Output |
| :--- | :--- |
| Alice | Alice |
| Bob | Bob |
| Charlie | Bob |
| | Charlie |

| Criteria | UNION | UNION ALL |
| :--- | :--- | :--- |
| **Duplicates** | ❌ Removes | ✅ Keeps |
| **Performance** | 🐢 Slower | 🐇 Faster |
| **Sorting** | Auto-sorts | No sorting |

---

### 5.2 Normalization

Split large, messy tables into smaller, related ones to **reduce redundancy**.

**Before (Unnormalized):**

| EmpID | Name | Dept | Location |
| :--- | :--- | :--- | :--- |
| 101 | Vinay | IT | Bangalore |
| 102 | Awadhesh | IT | Bangalore |

**After (Normalized into 2 tables):**

| EmpID | Name | DeptID |
| :--- | :--- | :--- |
| 101 | Vinay | 1 |
| 102 | Awadhesh | 1 |

| DeptID | DeptName | Location |
| :--- | :--- | :--- |
| 1 | IT | Bangalore |

> Now "IT" is stored **once**. Update it in one place.

**Normal Forms:** 1NF (atomic values) → 2NF (no partial deps) → 3NF (no transitive deps) → BCNF (strictest).

---

### 5.3 CHAR vs VARCHAR

| Feature | `CHAR(10)` | `VARCHAR(50)` |
| :--- | :--- | :--- |
| **Storage** | Fixed. Always 10 bytes. | Variable. Only what's needed. |
| **"Bob" stored as** | `"Bob       "` (padded) | `"Bob"` (~4 bytes) |
| **Best For** | Fixed codes (`'NY'`, PINs) | Names, emails, addresses |

---

### 5.4 SQL vs MySQL

| | SQL | MySQL |
| :--- | :--- | :--- |
| **What?** | A **language** (like English) | A **software** (like a person who speaks English) |
| **Type** | Standard syntax (by ANSI) | RDBMS software (by Oracle) |
| **Analogy** | The recipe | The chef who follows the recipe |

> Other "chefs": **PostgreSQL**, **SQL Server**, **Oracle DB**, **SQLite**.

---

### 5.5 AUTO_INCREMENT

Auto-generates a unique, sequential number for Primary Key columns.

```sql
CREATE TABLE Employees (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    Name       VARCHAR(50),
    Salary     DECIMAL(10, 2)
);

INSERT INTO Employees (Name, Salary) VALUES ('Vinay', 50000);
INSERT INTO Employees (Name, Salary) VALUES ('Raj', 40000);
```

| EmployeeID | Name | Salary |
| :--- | :--- | :--- |
| 1 | Vinay | 50000.00 |
| 2 | Raj | 40000.00 |

> IDs `1` and `2` were assigned automatically.

---

## 📙 Chapter 6: Subqueries & Nesting

### 6.1 Subquery (Inner Query)

A query **nested inside another query**. The inner query runs first, then its result feeds the outer query.

```sql
SELECT name, salary FROM employees
WHERE salary = (SELECT MAX(salary) FROM employees);
```

**Input (Employees):**

| name | salary |
| :--- | :--- |
| Alice | 50000 |
| Bob | 80000 |
| Charlie | 60000 |
| Diana | 80000 |

**Step 1:** Inner query → `MAX(salary)` = 80000.
**Step 2:** Outer query → `WHERE salary = 80000`.

**Output:**

| name | salary |
| :--- | :--- |
| Bob | 80000 |
| Diana | 80000 |

---

### 6.2 Nested Query (Finding by Name)

Same concept — find employees in the 'Sales' department without knowing its ID.

```sql
SELECT name FROM employees
WHERE department_id = (
    SELECT department_id FROM departments WHERE department_name = 'Sales'
);
```

**Inner query** finds Sales → `department_id = 2`. Outer query fetches employees with `dept_id = 2`.

---

### 6.3 Correlated Subquery

Unlike regular subqueries, a correlated subquery **depends on the outer query** and runs **once per row**. Slower but powerful.

```sql
SELECT e.name, e.salary FROM employees e
WHERE e.salary > (
    SELECT AVG(salary) FROM employees WHERE department_id = e.department_id
);
```

**Input:**

| name | salary | department_id |
| :--- | :--- | :--- |
| Alice | 40000 | 1 (HR, Avg: 45k) |
| Bob | 50000 | 1 (HR, Avg: 45k) |
| Charlie | 60000 | 2 (IT, Avg: 70k) |
| Diana | 80000 | 2 (IT, Avg: 70k) |

**Output** (only those who earn > their dept average):

| name | salary |
| :--- | :--- |
| Bob | 50000 |
| Diana | 80000 |

> For each row, the inner query recalculates the average for *that employee's* department.

---

## 📙 Chapter 7: Grouping, Sorting & Limiting

### 7.1 GROUP BY

Groups rows with the **same values** into summary rows. Used with aggregate functions (`COUNT`, `SUM`, `AVG`, `MAX`, `MIN`).

```sql
SELECT category, SUM(sales_amount) AS Total_Sales
FROM sales GROUP BY category;
```

**Input (Sales):**

| category | sales_amount |
| :--- | :--- |
| Electronics | 100 |
| Clothing | 50 |
| Electronics | 200 |
| Clothing | 75 |

**Output:**

| category | Total_Sales |
| :--- | :--- |
| Electronics | 300 |
| Clothing | 125 |

---

### 7.2 GROUP BY vs ORDER BY

| Feature | GROUP BY | ORDER BY |
| :--- | :--- | :--- |
| **Purpose** | Squashes rows into summaries | Sorts display order |
| **Aggregates** | Required (`SUM`, `COUNT`, etc.) | Not required |
| **Row Count** | Reduces rows | Keeps all rows |
| **Position** | Before `ORDER BY` | After `GROUP BY` |

---

### 7.3 LIMIT — Fetch Top N Records

Restricts the number of rows returned. Essential for pagination & "Top N" queries.

```sql
SELECT name, salary FROM employees
ORDER BY salary DESC LIMIT 3;
```

**Input:**

| name | salary |
| :--- | :--- |
| Alice | 45000 |
| Bob | 80000 |
| Charlie | 60000 |
| Diana | 90000 |
| Evan | 50000 |

**Output (Top 3):**

| name | salary |
| :--- | :--- |
| Diana | 90000 |
| Bob | 80000 |
| Charlie | 60000 |

---

### 7.4 Finding the Second Highest Salary ⭐

Classic interview question! Use a subquery.

```sql
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

**How it works:**
1. Inner query finds the absolute max salary → `90000`
2. Outer query finds the max salary that is **less than** 90000 → `80000`

| MAX(salary) |
| :--- |
| 80000 |

---

### 7.5 Finding Duplicate Records

Combine `GROUP BY` + `HAVING COUNT(*) > 1`.

```sql
SELECT name, COUNT(*) FROM employees
GROUP BY name HAVING COUNT(*) > 1;
```

**Input:**

| name | department |
| :--- | :--- |
| Alice | HR |
| Bob | IT |
| Charlie | IT |
| Alice | Sales |

**Output:**

| name | COUNT(*) |
| :--- | :--- |
| Alice | 2 |

---

## 📙 Chapter 8: CTEs, Temp Tables & Window Functions

### 8.1 CTE (Common Table Expression)

A temporary, named result set defined with `WITH`. It exists only for the duration of that single query — cleaner than subqueries.

```sql
WITH IT_Employees AS (
    SELECT name, department, salary
    FROM employees WHERE department = 'IT'
)
SELECT name, salary FROM IT_Employees WHERE salary > 50000;
```

---

### 8.2 Temporary Tables

An actual table that **persists for the session** (unlike CTEs which vanish after the query). You can run multiple queries against it.

```sql
CREATE TEMPORARY TABLE temp_emp AS
SELECT name, salary FROM employees WHERE salary > 50000;

SELECT * FROM temp_emp;  -- Can query it multiple times!
```

> When you log off or close the connection, `temp_emp` is **automatically deleted**.

| Feature | CTE | Temporary Table |
| :--- | :--- | :--- |
| **Lifespan** | Single query only | Entire session |
| **Reusable** | ❌ No | ✅ Yes |
| **Storage** | Logical (no disk) | Physical (in memory) |
| **Indexing** | ❌ Not supported | ✅ Supported |

---

### 8.3 Window Functions — `OVER()`

Perform calculations **without collapsing rows** (unlike `GROUP BY`). Adds a new computed column while keeping every original row intact.

```sql
SELECT name, department, salary,
       SUM(salary) OVER (PARTITION BY department ORDER BY salary) AS Running_Total
FROM employees;
```

**Input:**

| name | department | salary |
| :--- | :--- | :--- |
| Alice | HR | 40000 |
| Bob | HR | 50000 |
| Charlie | IT | 60000 |
| Diana | IT | 80000 |

**Output** (Notice: Rows are NOT squashed!):

| name | department | salary | Running_Total |
| :--- | :--- | :--- | :--- |
| Alice | HR | 40000 | 40000 |
| Bob | HR | 50000 | 90000 (40k+50k) |
| Charlie | IT | 60000 | 60000 |
| Diana | IT | 80000 | 140000 (60k+80k) |

---

### 8.4 ROW_NUMBER() vs RANK() vs DENSE_RANK() ⭐

All assign numbers to rows, but handle **ties** differently.

```sql
SELECT name, score,
    ROW_NUMBER() OVER(ORDER BY score DESC) as row_num,
    RANK()       OVER(ORDER BY score DESC) as rank_val,
    DENSE_RANK() OVER(ORDER BY score DESC) as dense_rank_val
FROM students;
```

| name | score | row_num | rank_val | dense_rank_val |
| :--- | :--- | :--- | :--- | :--- |
| Alice | 95 | 1 | 1 | 1 |
| Bob | 85 | 2 | 2 | 2 |
| Charlie | 85 | 3 | **2** | **2** |
| Diana | 70 | 4 | **4** ← skipped 3! | **3** ← no skip! |

| Function | Handles Ties | Skips Numbers? | Example |
| :--- | :--- | :--- | :--- |
| `ROW_NUMBER()` | Ignores (arbitrary) | No | 1, 2, 3, 4 |
| `RANK()` | Same rank for ties | ✅ Yes | 1, 2, 2, **4** |
| `DENSE_RANK()` | Same rank for ties | ❌ No | 1, 2, 2, **3** |

---

## 📙 Chapter 9: Conditional Logic & NULL Handling

### 9.1 CASE Statement (SQL's IF-ELSE)

Evaluate conditions and return different values. Once a condition is `TRUE`, it stops and returns.

```sql
SELECT name, salary,
    CASE
        WHEN salary > 6000 THEN 'High Salary'
        WHEN salary BETWEEN 4000 AND 6000 THEN 'Medium Salary'
        ELSE 'Low Salary'
    END AS Salary_Category
FROM employees;
```

**Input → Output:**

| name | salary | Salary_Category |
| :--- | :--- | :--- |
| Alice | 7500 | High Salary |
| Bob | 5000 | Medium Salary |
| Charlie | 3000 | Low Salary |

---

### 9.2 COALESCE — First Non-NULL Value

Returns the **first non-null** value from a list of expressions. Perfect for fallback logic.

```sql
SELECT name,
    COALESCE(email, phone, 'No Contact') AS Contact_Info
FROM students;
```

**Input:**

| name | email | phone |
| :--- | :--- | :--- |
| Alice | alice@email.com | 555-1234 |
| Bob | NULL | 555-9876 |
| Charlie | NULL | NULL |

**Output:**

| name | Contact_Info |
| :--- | :--- |
| Alice | alice@email.com |
| Bob | 555-9876 |
| Charlie | No Contact |

---

### 9.3 NVL Function (Oracle-Specific)

Like `COALESCE` but only takes **exactly 2 arguments**. Oracle uses `NVL()`, MySQL uses `IFNULL()`, SQL Server uses `ISNULL()`.

```sql
SELECT name, NVL(email, 'No Email') AS Email FROM students;
```

---

## 📙 Chapter 10: Indexing & Views

### 10.1 What is Indexing?

A lookup structure that **dramatically speeds up** `SELECT` queries. Like a book index — instead of reading every page, the database jumps directly to the right row.

```sql
CREATE INDEX idx_name ON students (name);
```

> **The Catch:** Indexes speed up reads but slow down writes (`INSERT`/`UPDATE`/`DELETE`) because the index must also be updated.

---

### 10.2 Clustered Index

Determines the **physical sorting order** of data on disk. Only **one per table** (usually auto-created on the Primary Key).

**Before Clustered Index:**

| id | name |
| :--- | :--- |
| 3 | Charlie |
| 1 | Alice |
| 2 | Bob |

**After Clustered Index on `id`:**

| id | name |
| :--- | :--- |
| 1 | Alice |
| 2 | Bob |
| 3 | Charlie |

> Data was physically rearranged on disk.

---

### 10.3 Non-Clustered Index

Creates a **separate lookup structure** (like a book index) that points to the actual rows. Does NOT change physical order. You can have **multiple** per table.

```sql
CREATE INDEX idx_name ON students (name);
```

> The database builds a hidden sorted reference: Alice → Row 2, Bob → Row 3, Charlie → Row 1.

---

### 10.4 Clustered vs Non-Clustered Index

| Feature | Clustered Index | Non-Clustered Index |
| :--- | :--- | :--- |
| **Physical Storage** | Sorts data on disk | Stores pointers to data |
| **Quantity** | Only ONE per table | Multiple allowed |
| **Speed** | ⚡ Faster | Slightly slower (pointer lookup) |
| **Created** | Auto on Primary Key | Must be created manually |

---

### 10.5 Views — Virtual Tables

A View is a **virtual table** based on a SQL query. It stores the query, not the data. Every time you query it, it re-runs the underlying query against real tables.

```sql
CREATE VIEW HighEarners AS
SELECT name, salary FROM employees WHERE salary > 50000;

-- Use it like a table!
SELECT * FROM HighEarners;
```

| Feature | View | Table |
| :--- | :--- | :--- |
| **Storage** | No physical data | Stores data on disk |
| **Updates** | Auto-updates when base table changes | Needs manual updates |
| **Use Case** | Security & simplifying complex queries | Storing raw data |

---

## ✅ Quick Revision Cheat Sheet

| # | Concept | One-Line Summary |
| :--- | :--- | :--- |
| 1 | `PRIMARY KEY` | Unique ID. No NULLs. One per table. |
| 2 | `FOREIGN KEY` | Links to another table's Primary Key. |
| 3 | `UNIQUE` | No duplicates, but one NULL is OK. |
| 4 | `NOT NULL` | Column can never be empty. |
| 5 | `DEFAULT` | Auto-fills a value if skipped. |
| 6 | `DELETE` | Remove specific rows (can undo). |
| 7 | `TRUNCATE` | Wipe all rows instantly (can't undo). |
| 8 | `DROP` | Delete entire table forever. |
| 9 | `WHERE` | Filter rows *before* grouping. |
| 10 | `HAVING` | Filter groups *after* aggregation. |
| 11 | `INNER JOIN` | Only matching rows from both tables. |
| 12 | `LEFT JOIN` | All Left + matching Right. |
| 13 | `RIGHT JOIN` | All Right + matching Left. |
| 14 | `FULL JOIN` | Everything from both sides. |
| 15 | `SELF JOIN` | Table joined with itself. |
| 16 | `CROSS JOIN` | Every row × every row. |
| 17 | `UNION` | Stack rows, remove duplicates. |
| 18 | `UNION ALL` | Stack rows, keep duplicates. |
| 19 | `Subquery` | Query inside a query. |
| 20 | `Correlated Subquery` | Subquery that depends on outer query (runs per row). |
| 21 | `GROUP BY` | Squash rows into summaries. |
| 22 | `ORDER BY` | Sort results (ASC/DESC). |
| 23 | `LIMIT` | Restrict number of rows returned. |
| 24 | `CTE` | Temporary named result set (`WITH`). |
| 25 | `Window Functions` | Calculations across rows without collapsing. |
| 26 | `ROW_NUMBER` | Unique numbers, ignores ties. |
| 27 | `RANK` | Same rank for ties, skips next. |
| 28 | `DENSE_RANK` | Same rank for ties, no skip. |
| 29 | `CASE` | SQL's IF-ELSE logic. |
| 30 | `COALESCE` | First non-NULL value from a list. |
| 31 | `Index` | Speeds up SELECT, slows down writes. |
| 32 | `View` | Virtual table from a saved query. |

---

*You've got this! 💪 — Every expert was once a beginner.*
