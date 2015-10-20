-- MySQL Script generated by MySQL Workbench
-- Mon Oct 19 21:04:32 2015
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
  `pk_cms_role` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `name` VARCHAR(255) NULL COMMENT '',
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  PRIMARY KEY (`pk_cms_role`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_user` (
  `pk_cms_user` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `fk_cms_role` INT NULL COMMENT '',
  `name` VARCHAR(255) NULL COMMENT '',
  `email` VARCHAR(255) NULL COMMENT '',
  `pass` VARCHAR(255) NULL COMMENT '',
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  `change_password` TINYINT(1) NULL DEFAULT 0 COMMENT '',
  PRIMARY KEY (`pk_cms_user`)  COMMENT '',
  INDEX `cms_user_cms_role_idx` (`fk_cms_role` ASC)  COMMENT '',
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
  `pk_cms_session` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `fk_cms_user` INT NULL COMMENT '',
  `uid` VARCHAR(255) NULL COMMENT '',
  `ip` VARCHAR(45) NULL COMMENT '',
  `active` TINYINT(1) NULL DEFAULT 1 COMMENT '',
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  `updated` TIMESTAMP NULL COMMENT '',
  PRIMARY KEY (`pk_cms_session`)  COMMENT '',
  INDEX `cms_session_cms_user_idx` (`fk_cms_user` ASC)  COMMENT '',
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
  `pk_cms_log` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `fk_cms_session` INT NULL COMMENT '',
  `action` VARCHAR(255) NULL COMMENT '',
  `description` VARCHAR(255) NULL COMMENT '',
  `data` TEXT NULL COMMENT '',
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  PRIMARY KEY (`pk_cms_log`)  COMMENT '',
  INDEX `cms_log_cms_session_idx` (`fk_cms_session` ASC)  COMMENT '',
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
  `name` VARCHAR(255) NOT NULL COMMENT '',
  `value` TEXT NULL COMMENT '',
  PRIMARY KEY (`name`)  COMMENT '')
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
INSERT INTO `cms_user` (`pk_cms_user`, `fk_cms_role`, `name`, `email`, `pass`, `created`, `change_password`) VALUES (1, 1, 'Slikland', 'info@slikland.com', PASSWORD('slikland'), CURRENT_TIMESTAMP, 1);

COMMIT;
