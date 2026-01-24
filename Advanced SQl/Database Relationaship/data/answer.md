# Database Relationships in E-Commerce Applications

## Definition of Database Relationship

A database relationship defines how two or more database tables are connected to each other through related data. These relationships establish logical connections between tables based on common fields (typically primary and foreign keys), enabling efficient data retrieval, maintaining data integrity, and reducing data redundancy. Relationships are fundamental to relational database design and ensure that data remains consistent and organized across multiple tables.

## Types of Database Relationships

There are three main types of database relationships:

1. **One-to-One (1:1) Relationship**
2. **One-to-Many (1:N) Relationship** 
3. **Many-to-Many (M:N) Relationship**

Let's explore each type with detailed e-commerce examples.

---

## 1. One-to-One (1:1) Relationship

### Definition
In a one-to-one relationship, each record in Table A is associated with exactly one record in Table B, and vice versa. This relationship is less common but useful when you want to split a large table into smaller, more manageable pieces or when certain data should be stored separately for security or performance reasons.

### E-Commerce Example: User and User Profile

In an e-commerce application, each user account typically has exactly one detailed profile containing additional information like address, phone number, and preferences.

**Tables Structure:**
- **users** table: Contains basic authentication information
- **user_profiles** table: Contains detailed personal information

```sql
-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles table
CREATE-table user_profiles (
    profile_id INT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(15),
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Diagram
```
users (1) ─────────────── (1) user_profiles
+---------+               +------------------+
| user_id |◄─────────────►| user_id          |
| email   |               | first_name       |
| password|               | last_name        |
+---------+               | phone            |
                          +------------------+
```

**Application Usage:**
- When a customer registers, a record is created in the `users` table
- Their personal details are stored separately in the `user_profiles` table
- This separation allows for better security (sensitive auth data vs. personal data) and performance optimization

---

## 2. One-to-Many (1:N) Relationship

### Definition
In a one-to-many relationship, a single record in Table A can be associated with multiple records in Table B, but each record in Table B is associated with only one record in Table A. This is the most common type of database relationship.

### E-Commerce Example: Category and Products

Each product category can contain multiple products, but each product belongs to exactly one category.

**Tables Structure:**
- **categories** table: Contains product categories
- **products** table: Contains individual products

```sql
-- Categories table
CREATE TABLE categories (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id)
);

-- Products table
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT NOT NULL,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
```

### Diagram
```
categories (1) ─────────────── (N) products
+--------------+              +------------------+
| category_id  |◄────────────►| category_id      |
| category_name|              | product_id       |
| description  |              | product_name     |
+--------------+              | price            |
                              | stock_quantity   |
                              +------------------+
```

**Application Usage:**
- Electronics category contains multiple products like laptops, smartphones, headphones
- When browsing the "Electronics" category, the application queries all products where `category_id = [electronics_id]`
- Each product appears in only one primary category (though advanced systems might support multiple categories using many-to-many relationships)

### Another E-Commerce Example: Customer and Orders

Each customer can place multiple orders, but each order belongs to exactly one customer.

```sql
-- Orders table
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    shipping_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

---

## 3. Many-to-Many (M:N) Relationship

### Definition
In a many-to-many relationship, multiple records in Table A can be associated with multiple records in Table B, and vice versa. This relationship requires a junction table (also called an associative or bridge table) to link the two tables together.

### E-Commerce Example: Products and Tags

Products can have multiple tags (like "on-sale", "featured", "new-arrival"), and each tag can be applied to multiple products.

**Tables Structure:**
- **products** table: Contains product information
- **tags** table: Contains available tags
- **product_tags** table: Junction table linking products and tags

```sql
-- Tags table
CREATE TABLE tags (
    tag_id INT PRIMARY KEY,
    tag_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(200)
);

-- Product Tags junction table
CREATE TABLE product_tags (
    product_id INT,
    tag_id INT,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);
```

### Diagram
```
products (M) ─────── product_tags ─────── (M) tags
+------------+      +----------------+     +-----------+
| product_id |◄────►| product_id     |     | tag_id    |
| product_...|      | tag_id         |◄───►| tag_name  |
+------------+      +----------------+     +-----------+
```

**Application Usage:**
- A smartphone product might have tags: "5G", "flagship", "on-sale"
- The "on-sale" tag applies to multiple products across different categories
- To find all products with a specific tag, query the junction table: `SELECT p.* FROM products p JOIN product_tags pt ON p.product_id = pt.product_id WHERE pt.tag_id = [sale_tag_id]`

### Another E-Commerce Example: Customers and Wishlists

Customers can have multiple wishlists, and products can be added to multiple wishlists (different customers' wishlists).

```sql
-- Wishlists table
CREATE TABLE wishlists (
    wishlist_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    wishlist_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Wishlist Items table
CREATE TABLE wishlist_items (
    wishlist_id INT,
    product_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (wishlist_id, product_id),
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(wishlist_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);
```

---

## Summary Table

| Relationship Type | Description | E-Commerce Examples |
|------------------|-------------|-------------------|
| **One-to-One (1:1)** | Each record in Table A relates to exactly one record in Table B | User ↔ User Profile, Order ↔ Payment Details |
| **One-to-Many (1:N)** | One record in Table A relates to many records in Table B | Category ↔ Products, Customer ↔ Orders, Order ↔ Order Items |
| **Many-to-Many (M:N)** | Many records in Table A relate to many records in Table B (requires junction table) | Products ↔ Tags, Customers ↔ Wishlists, Products ↔ Related Products |

## Benefits of Proper Database Relationships in E-Commerce

1. **Data Integrity**: Ensures consistent and accurate data through foreign key constraints
2. **Reduced Redundancy**: Eliminates duplicate data storage
3. **Scalability**: Allows the database to grow efficiently as the business expands
4. **Query Performance**: Enables optimized queries through proper indexing and relationship design
5. **Flexibility**: Supports complex business requirements like product variants, customer segmentation, and personalized recommendations

Understanding and implementing these relationships correctly is crucial for building robust, scalable, and maintainable e-commerce applications that can handle thousands of products, customers, and transactions efficiently.

