-- MySQL Script generated by MySQL Workbench
-- Mon Nov 23 14:48:01 2015
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `cms_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_role` (
  `pk_cms_role` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pk_cms_role`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_user` (
  `pk_cms_user` INT NOT NULL AUTO_INCREMENT,
  `fk_cms_role` INT NULL,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `pass` VARCHAR(255) NULL,
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `change_password` TINYINT(1) NULL DEFAULT 0,
  `status` INT NULL DEFAULT 1,
  PRIMARY KEY (`pk_cms_user`),
  INDEX `cms_user_cms_role_idx` (`fk_cms_role` ASC),
  CONSTRAINT `cms_user_cms_role`
    FOREIGN KEY (`fk_cms_role`)
    REFERENCES `cms_role` (`pk_cms_role`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms_session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_session` (
  `pk_cms_session` INT NOT NULL AUTO_INCREMENT,
  `fk_cms_user` INT NULL,
  `uid` VARCHAR(255) NULL,
  `ip` VARCHAR(45) NULL,
  `active` TINYINT(1) NULL DEFAULT 1,
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP NULL,
  PRIMARY KEY (`pk_cms_session`),
  INDEX `cms_session_cms_user_idx` (`fk_cms_user` ASC),
  CONSTRAINT `cms_session_cms_user`
    FOREIGN KEY (`fk_cms_user`)
    REFERENCES `cms_user` (`pk_cms_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_log` (
  `pk_cms_log` INT NOT NULL AUTO_INCREMENT,
  `fk_cms_session` INT NULL,
  `action` VARCHAR(255) NULL,
  `description` VARCHAR(255) NULL,
  `data` TEXT NULL,
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pk_cms_log`),
  INDEX `cms_log_cms_session_idx` (`fk_cms_session` ASC),
  CONSTRAINT `cms_log_cms_session`
    FOREIGN KEY (`fk_cms_session`)
    REFERENCES `cms_session` (`pk_cms_session`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms_setting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_setting` (
  `name` VARCHAR(255) NOT NULL,
  `value` TEXT NULL,
  PRIMARY KEY (`name`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `cms_role`
-- -----------------------------------------------------
START TRANSACTION;
INSERT INTO `cms_role` (`pk_cms_role`, `name`, `created`) VALUES (1, 'superadmin', NULL);
INSERT INTO `cms_role` (`pk_cms_role`, `name`, `created`) VALUES (2, 'admin', NULL);
INSERT INTO `cms_role` (`pk_cms_role`, `name`, `created`) VALUES (3, 'moderator', NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `cms_user`
-- -----------------------------------------------------
START TRANSACTION;
INSERT INTO `cms_user` (`pk_cms_user`, `fk_cms_role`, `name`, `email`, `pass`, `created`, `change_password`, `status`) VALUES (1, 1, 'Slikland', 'info@slikland.com', 'PASSWORD(\'slikland\')', 'CURRENT_TIMESTAMP', 1, NULL);

COMMIT;

