use CareerDwaar;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- Store hashed passwords
    role ENUM('employee', 'employer', 'admin') NOT NULL,
    profile_picture VARCHAR(255),  -- URL to profile image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,  -- Links to users table
    college_name VARCHAR(255) NOT NULL,
    branch VARCHAR(100),
    resume_link VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE employers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,  -- Links to users table
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    logo VARCHAR(255),  -- Company logo URL
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT,  -- Links to employers table
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),  -- e.g., Tech, Design, Marketing
    job_type ENUM('internship', 'full-time') NOT NULL,
    location VARCHAR(100),  -- Remote/Onsite/Hybrid
    salary VARCHAR(50),
    deadline DATE NOT NULL,
    google_form_link VARCHAR(255),  -- Link to apply
    status ENUM('active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES employers(user_id) ON DELETE CASCADE
);


CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    student_id INT,  -- Links to users table
    resume_link VARCHAR(255),
    status ENUM('pending', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,  -- Links to users table
    role ENUM('super_admin', 'moderator') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE applications
ADD CONSTRAINT fk_student
FOREIGN KEY (student_id)
REFERENCES students(user_id);


CREATE VIEW user_student_view AS
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    u.role,
    u.profile_picture,
    u.created_at,
    u.updated_at,
    s.id AS student_id,
    s.college_name,
    s.branch,
    s.resume_link,
    s.is_verified
FROM users u
LEFT JOIN students s ON u.id = s.user_id;

CREATE VIEW job_applications_view AS
SELECT 
    a.id AS application_id,
    a.job_id,
    j.title AS job_title,
    j.category AS job_category,
    j.job_type,
    j.location AS job_location,
    j.salary,
    j.deadline AS job_deadline,
    j.google_form_link,
    j.status AS job_status,
    j.created_at AS job_created_at,
    
    e.id AS employer_id,
    e.name AS employer_name,
    e.email AS employer_email,
    e.profile_picture AS employer_profile_picture,

    s.user_id AS student_id,
    u.name AS student_name,
    u.email AS student_email,
    u.profile_picture AS student_profile_picture,
    s.college_name,
    s.branch,

    a.resume_link,
    a.status AS application_status,
    a.applied_at
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN users e ON j.employer_id = e.id  -- Get employer details
JOIN students s ON a.student_id = s.user_id
JOIN users u ON s.user_id = u.id;  -- Get student details



SELECT * FROM job_applications_view WHERE job_id = '16';

select * from employers;

SELECT * FROM jobs WHERE employer_id = 8