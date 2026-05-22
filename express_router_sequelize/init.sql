CREATE TABLE
    IF NOT EXISTS users (
        id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        age SMALLINT UNSIGNED NOT NULL,
        createdAt DATETIME,
        updatedAt DATETIME
    )
CREATE TABLE
    IF NOT EXISTS posts (
        id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        isActive BOOLEAN NOT NULL,
        content TEXT,
        userId BIGINT UNSIGNED NOT NULL,
        createdAt DATETIME,
        updatedAt DATETIME,
        CONSTRAINT fk_User FOREIGN KEY (userId) REFERENCES users (id)
    )