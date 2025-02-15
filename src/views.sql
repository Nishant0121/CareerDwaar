CREATE VIEW student_applied_jobs AS
SELECT 
    a.student_id,
    j.id AS job_id,
    j.title AS job_title,
    j.category AS job_category,
    j.job_type,
    j.location,
    j.salary,
    j.deadline,
    j.google_form_link,
    j.status AS job_status,
    
    emp.user_id AS employer_id,
    u.name AS employer_name,
    emp.company_name AS employer_company,
    emp.industry AS employer_industry,
    emp.website AS employer_website,
    emp.logo AS employer_logo,
    
    a.id AS application_id,
    a.resume_link,
    a.status AS application_status,
    a.applied_at
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN employers emp ON j.employer_id = emp.user_id
JOIN users u ON emp.user_id = u.id;

CREATE VIEW applications_view AS
SELECT 
    applications.id AS application_id,
    applications.job_id,
    applications.status,
    applications.resume_link,
    users.name AS student_name,
    users.email AS student_email,
    students.college_name,
    students.branch
FROM applications
JOIN students ON applications.student_id = students.user_id
JOIN users ON students.user_id = users.id;


SELECT * FROM applications_view WHERE job_id = 10
