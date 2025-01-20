-- Create and use the database
CREATE DATABASE IF NOT EXISTS `HAMS`;

USE `HAMS`;

-- --------------------------------------------------------
-- Table structure for table `doctor_specialties`
CREATE TABLE
  `doctor_specialties` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `specialty_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Insert data for doctor specialties
INSERT INTO
  `doctor_specialties` (`specialty_name`, `description`)
VALUES
  ('General Practitioner',),
  ('Family Medicine Physician',),
  ('Internist',),
  ('General Surgeon',),
  ('Neurosurgeon',),
  ('Orthopedic Surgeon',),
  ('Cardiothoracic Surgeon',),
  ('Plastic Surgeon',),
  ('Ophthalmic Surgeon',),
  ('Cardiologist',),
  -- --------------------------------------------------------
  -- Table structure for table `users`
CREATE TABLE
  `users` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(255) DEFAULT NULL,
    `birthdate` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `admins`
CREATE TABLE
  `admins` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(255) DEFAULT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `admins_email_unique` (`email`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  `announcements` (
    `id` BIGINT (20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `created_by` BIGINT (20) UNSIGNED NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins (id) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `doctors`
CREATE TABLE
  `doctors` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(255) DEFAULT NULL,
    `birthdate` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `specialization_id` BIGINT (20) UNSIGNED NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` ENUM ('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `doctors_email_unique` (`email`),
    FOREIGN KEY (`specialization_id`) REFERENCES `doctor_specialties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Create the `schedules` table with AM and PM slot functionality
CREATE TABLE
  `schedules` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `doctor_id` BIGINT (20) UNSIGNED NOT NULL,
    `schedule_date` DATE NOT NULL,
    `am_max_patients` INT (11) NOT NULL DEFAULT 0,
    `pm_max_patients` INT (11) NOT NULL DEFAULT 0,
    `deleted_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Table for storing child information
CREATE TABLE
  `immunization_info` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT (20) UNSIGNED NOT NULL, -- Reference to the parent user
    `child_name` VARCHAR(255) NOT NULL,
    `birthdate` DATE NOT NULL,
    `birthplace` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `mother_name` VARCHAR(255) NOT NULL,
    `father_name` VARCHAR(255) NOT NULL,
    `birth_height` FLOAT (5, 2) NOT NULL, -- in cm
    `birth_weight` FLOAT (5, 2) NOT NULL, -- in kg
    `sex` ENUM ('male', 'female') NOT NULL,
    `health_center` VARCHAR(255) NOT NULL,
    `barangay` VARCHAR(255) NOT NULL,
    `family_number` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Add `prenatal_info` table
CREATE TABLE
  `prenatal_info` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT (20) UNSIGNED NOT NULL, -- Reference to the parent user
    `name` VARCHAR(255) NOT NULL,
    `age` INT NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `occupation` VARCHAR(255) DEFAULT NULL,
    `husband_name` VARCHAR(255) NOT NULL,
    `husband_age` INT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Create `patients` table
CREATE TABLE
  `patients` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `immunization_id` BIGINT (20) UNSIGNED DEFAULT NULL,
    `prenatal_id` BIGINT (20) UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`immunization_id`) REFERENCES `immunization_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`prenatal_id`) REFERENCES `prenatal_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table Structure for `appointments`
CREATE TABLE
  `appointments` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT (20) UNSIGNED NOT NULL,
    `doctor_id` BIGINT (20) UNSIGNED NOT NULL,
    `schedule_id` BIGINT (20) UNSIGNED NOT NULL,
    `immunization_id` BIGINT (20) UNSIGNED DEFAULT NULL,
    `prenatal_id` BIGINT (20) UNSIGNED DEFAULT NULL,
    `patient_id` BIGINT (20) UNSIGNED DEFAULT NULL, -- New patient_id column
    `status` VARCHAR(255) DEFAULT 'Pending',
    `purpose_of_appointment` TEXT NOT NULL,
    `remarks` TEXT DEFAULT NULL, -- New remarks column
    `appointment_date` DATE NOT NULL, -- This will still store full date and time if needed
    `slot` ENUM ('AM', 'PM') NOT NULL, -- New column for AM/PM
    `deleted_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`immunization_id`) REFERENCES `immunization_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`prenatal_id`) REFERENCES `prenatal_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE -- New foreign key
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `queue`
CREATE TABLE
  `queue` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `appointment_id` BIGINT (20) UNSIGNED NOT NULL,
    `status` VARCHAR(255) NOT NULL DEFAULT 'Processing',
    `assigned_to` BIGINT (20) UNSIGNED DEFAULT NULL,
    `processed_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`assigned_to`) REFERENCES `doctors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Create `patient_diagnosed` table
CREATE TABLE
  `patient_diagnosed` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `patient_id` BIGINT (20) UNSIGNED NOT NULL,
    `diagnosis` TEXT DEFAULT NULL,
    `doctor_id` BIGINT (20) UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Create `patient_vital_signs` table
CREATE TABLE
  `patient_vital_signs` (
    `id` BIGINT (20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `patient_id` BIGINT (20) UNSIGNED NOT NULL,
    `height` FLOAT (5, 2) DEFAULT NULL, -- in cm
    `weight` FLOAT (5, 2) DEFAULT NULL, -- in kg
    `bp` VARCHAR(50) DEFAULT NULL, -- Blood Pressure
    `blood_type` ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') DEFAULT NULL,
    `prescription` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;