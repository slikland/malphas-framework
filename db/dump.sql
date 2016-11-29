-- MySQL dump 10.13  Distrib 5.7.16, for osx10.12 (x86_64)
--
-- Host: localhost    Database: slikland-cms
-- ------------------------------------------------------
-- Server version	5.6.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cms_interface`
--

DROP TABLE IF EXISTS `cms_interface`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cms_interface` (
  `pk_cms_interface` int(11) NOT NULL AUTO_INCREMENT,
  `fk_cms_interface` int(11) DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `order` int(11) DEFAULT '0',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `visible` tinyint(1) DEFAULT '1',
  `type` varchar(255) DEFAULT '',
  PRIMARY KEY (`pk_cms_interface`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_interface`
--

LOCK TABLES `cms_interface` WRITE;
/*!40000 ALTER TABLE `cms_interface` DISABLE KEYS */;
INSERT INTO `cms_interface` VALUES (22,0,'Interface','cms/interface',1,'2016-10-27 15:15:36',1,'config'),(23,0,'Usuários','cms/users',0,'2016-10-27 15:15:36',1,'config'),(24,0,'Index','index',2,'2016-10-27 15:15:36',1,'pages'),(25,0,'Edit','cms/user/edit',1,'2016-10-27 17:42:33',1,'pages'),(26,0,'add','cms/user/add',0,'2016-10-27 17:46:11',1,'pages'),(27,23,'Log de atividade','cms/user/log',0,'2016-10-31 13:49:32',1,'config');
/*!40000 ALTER TABLE `cms_interface` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_interface_role`
--

DROP TABLE IF EXISTS `cms_interface_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cms_interface_role` (
  `pk_cms_interface_role` int(11) NOT NULL AUTO_INCREMENT,
  `fk_cms_interface` int(11) DEFAULT NULL,
  `fk_cms_role` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`pk_cms_interface_role`),
  KEY `cms_interface_role_cms_interface_idx` (`fk_cms_interface`),
  KEY `cms_interface_role_cms_role_idx` (`fk_cms_role`),
  CONSTRAINT `cms_interface_role_cms_interface` FOREIGN KEY (`fk_cms_interface`) REFERENCES `cms_interface` (`pk_cms_interface`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `cms_interface_role_cms_role` FOREIGN KEY (`fk_cms_role`) REFERENCES `cms_role` (`pk_cms_role`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_interface_role`
--

LOCK TABLES `cms_interface_role` WRITE;
/*!40000 ALTER TABLE `cms_interface_role` DISABLE KEYS */;
INSERT INTO `cms_interface_role` VALUES (1,22,1,NULL),(3,27,2,NULL),(4,23,1,NULL),(6,26,2,NULL),(7,26,3,NULL),(8,25,1,NULL),(9,25,2,NULL),(10,25,3,NULL),(11,24,1,NULL),(12,24,2,NULL),(13,24,3,NULL),(14,23,2,NULL),(15,23,3,NULL),(16,27,1,NULL),(17,27,3,NULL),(18,26,1,NULL);
/*!40000 ALTER TABLE `cms_interface_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_log`
--

DROP TABLE IF EXISTS `cms_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cms_log` (
  `pk_cms_log` int(11) NOT NULL AUTO_INCREMENT,
  `fk_cms_session` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `description` text,
  `data` text,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pk_cms_log`),
  KEY `cms_log_cms_session_idx` (`fk_cms_session`),
  CONSTRAINT `cms_log_cms_session` FOREIGN KEY (`fk_cms_session`) REFERENCES `cms_session` (`pk_cms_session`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=359 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_log`
--

LOCK TABLES `cms_log` WRITE;
/*!40000 ALTER TABLE `cms_log` DISABLE KEYS */;
INSERT INTO `cms_log` VALUES (1,155,'a','','','2016-10-31 14:16:10'),(2,155,'cms/user/getLog','','[]','2016-10-31 14:24:39'),(3,155,'cms/user/getLog','','[]','2016-10-31 14:25:04'),(4,155,'cms/user/getLog','','bla','2016-10-31 14:25:50'),(5,155,'cms/user/getLog','','bla','2016-10-31 14:25:51'),(6,155,'cms/user/getLog','','[]','2016-10-31 14:26:38'),(7,155,'cms/user/getLog','','[]','2016-10-31 14:26:39'),(8,155,'cms/user/getLog','','bla','2016-10-31 14:26:57'),(9,155,'bla','','bla','2016-10-31 14:27:12'),(10,155,'bla','','[]','2016-10-31 14:27:30'),(11,155,'bla','','{\"pass\":\"\"}','2016-10-31 14:27:45'),(12,155,'bla','','{\"pass\":\"***\"}','2016-10-31 14:34:27'),(13,155,'bla','','{\"pass\":\"***\"}','2016-10-31 14:34:35'),(14,156,'cms/user/login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-10-31 14:34:46'),(15,156,'bla','','[]','2016-10-31 14:34:46'),(16,157,'\"login\"','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-10-31 14:35:10'),(17,157,'bla','','[]','2016-10-31 14:35:11'),(18,157,'bla','','[]','2016-10-31 14:35:21'),(19,157,'bla','','[]','2016-10-31 14:35:50'),(20,157,'bla','','[]','2016-10-31 14:36:00'),(21,157,'bla','','','2016-10-31 14:36:28'),(22,157,'bla','','','2016-10-31 14:36:58'),(23,NULL,'logout','','','2016-10-31 14:36:58'),(24,158,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-10-31 14:38:04'),(25,158,'bla','','','2016-10-31 14:38:04'),(26,158,'Edição de usuário','','{\"id\":\"2\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"test test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-10-31 14:38:09'),(27,159,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-10-31 16:09:14'),(28,160,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-10-31 17:44:56'),(29,161,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-01 13:28:00'),(30,162,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 12:10:28'),(31,162,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"\",\"name\":\"\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 12:36:40'),(32,162,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"asd@\",\"name\":\"\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 12:41:10'),(33,162,'Remoção de usuário','','[\"6\"]','2016-11-03 13:37:49'),(34,162,'Remoção de usuário','','[\"6\"]','2016-11-03 13:38:00'),(35,162,'Remoção de usuário','','[\"6\"]','2016-11-03 13:38:01'),(36,162,'Remoção de usuário','','{\"__debug__\":\"1\",\"0\":\"6\"}','2016-11-03 13:38:07'),(37,162,'Remoção de usuário','','{\"__debug__\":\"1\",\"0\":\"6\"}','2016-11-03 13:38:23'),(38,162,'Remoção de usuário','','{\"__debug__\":\"1\",\"0\":\"6\"}','2016-11-03 13:38:39'),(39,162,'Remoção de usuário','','{\"__debug__\":\"1\",\"0\":\"6\"}','2016-11-03 13:39:19'),(40,162,'Remoção de usuário','','[\"5\"]','2016-11-03 13:40:46'),(41,162,'Remoção de usuário','','[\"4\"]','2016-11-03 13:43:11'),(42,162,'Remoção de usuário','','[\"2\"]','2016-11-03 13:43:14'),(43,162,'Remoção de usuário','','[\"3\"]','2016-11-03 13:43:16'),(44,162,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 13:43:33'),(45,162,'Edição de usuário','','{\"id\":\"1\",\"role\":\"1\",\"email\":\"keita@slikland.com\",\"name\":\"Keita Kuroki\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 13:52:31'),(46,162,'Edição de usuário','','{\"id\":\"1\",\"role\":\"1\",\"email\":\"keita@slikland.com\",\"name\":\"Keita Kuroki\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 13:52:34'),(47,162,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"test@asdasd.asd\",\"name\":\"asd asd\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 13:52:49'),(48,163,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 15:45:19'),(49,164,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 16:46:16'),(50,164,'Edição de usuário','','{\"id\":\"1\",\"role\":\"1\",\"email\":\"keita@slikland.com\",\"name\":\"Keita Kuroki\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 16:46:25'),(51,164,'Edição de usuário','','{\"id\":\"8\",\"role\":\"1\",\"email\":\"test@asdasd.asd\",\"name\":\"asd asd\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 16:50:06'),(52,164,'Edição de usuário','','{\"id\":\"7\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 16:50:18'),(53,164,'Edição de usuário','','{\"id\":\"7\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 16:51:38'),(54,164,'Edição de usuário','','{\"id\":\"7\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 16:52:17'),(55,164,'Edição de usuário','','{\"id\":\"7\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 16:52:43'),(56,164,'Edição de usuário','','{\"id\":\"8\",\"role\":\"1\",\"email\":\"test@asdasd.asd\",\"name\":\"asd asd\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-03 16:53:05'),(57,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:47:08'),(58,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:48:25'),(59,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:48:49'),(60,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:49:01'),(61,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:49:25'),(62,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:49:46'),(63,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:50:19'),(64,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:51:06'),(65,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:51:40'),(66,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:52:38'),(67,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:53:06'),(68,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:53:40'),(69,NULL,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:54:00'),(70,178,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:54:55'),(71,179,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:55:14'),(72,180,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:55:28'),(73,181,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 19:55:43'),(74,182,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-03 20:00:10'),(75,183,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-04 14:39:39'),(76,184,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-04 14:39:54'),(77,184,'Edição de usuário','','{\"id\":\"8\",\"role\":\"1\",\"email\":\"test@asdasd.asd\",\"name\":\"asd asd\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-04 14:40:14'),(78,184,'Edição de usuário','','{\"id\":\"7\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-04 14:42:57'),(79,185,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-04 14:43:04'),(80,186,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-04 14:43:17'),(81,187,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-04 14:43:39'),(82,188,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-04 14:44:26'),(83,189,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-04 14:47:12'),(84,190,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-04 15:28:32'),(85,190,'Edição de usuário','','{\"id\":\"7\",\"role\":\"2\",\"email\":\"test@test.com\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-04 15:28:40'),(86,191,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-04 15:37:12'),(87,192,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-07 12:41:50'),(88,193,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-07 12:46:39'),(89,194,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-07 15:13:49'),(90,195,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-07 15:14:43'),(91,195,'Remoção de usuário','','[\"8\"]','2016-11-07 15:57:29'),(92,195,'Remoção de usuário','','[\"7\"]','2016-11-07 15:57:38'),(93,195,'Remoção de usuário','','[\"5\"]','2016-11-07 15:59:39'),(94,195,'Remoção de usuário','','[\"6\"]','2016-11-07 16:00:39'),(95,195,'Remoção de usuário','','[\"4\"]','2016-11-07 16:01:04'),(96,195,'Remoção de usuário','','[\"7\"]','2016-11-07 16:01:24'),(97,195,'Remoção de usuário','','[\"8\"]','2016-11-07 16:01:27'),(98,195,'Remoção de usuário','','[\"2\"]','2016-11-07 16:01:37'),(99,195,'Remoção de usuário','','[\"3\"]','2016-11-07 16:01:53'),(100,195,'Remoção de usuário','','[\"5\"]','2016-11-07 16:02:44'),(101,195,'Remoção de usuário','','[\"2\"]','2016-11-07 16:03:00'),(102,195,'Remoção de usuário','','[\"3\"]','2016-11-07 16:03:21'),(103,195,'Remoção de usuário','','[\"4\"]','2016-11-07 16:04:19'),(104,195,'Remoção de usuário','','[\"7\"]','2016-11-07 16:04:47'),(105,195,'Remoção de usuário','','[\"6\"]','2016-11-07 16:05:39'),(106,195,'Remoção de usuário','','[\"8\"]','2016-11-07 16:05:42'),(107,195,'Edição de usuário','','{\"id\":\"1\",\"role\":\"1\",\"email\":\"keita@slikland.com\",\"name\":\"Keita Kuroki\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-07 16:05:45'),(108,195,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"Tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-07 16:06:08'),(109,195,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"test asd\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-07 16:06:30'),(110,195,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"test asd\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-07 16:08:49'),(111,195,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"test asd\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-07 16:09:05'),(112,195,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"test@test.com\",\"name\":\"test asd\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-07 16:09:28'),(113,195,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"test@test.com2\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-07 16:09:47'),(114,196,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-07 17:27:28'),(115,197,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-07 17:31:55'),(116,198,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-07 17:58:11'),(117,199,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-08 03:16:57'),(118,199,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"info@slikland.com\",\"name\":\"Slikland Creative Development\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-08 11:52:41'),(119,200,'login','','{\"email\":\"info@slikland.com\",\"pass\":\"***\"}','2016-11-08 12:31:50'),(120,201,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-08 14:34:14'),(121,201,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"\",\"name\":\"\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-08 18:13:52'),(122,201,'Remoção de usuário','','[\"12\"]','2016-11-08 18:14:06'),(123,201,'Edição de usuário','','{\"id\":\"\",\"role\":\"1\",\"email\":\"\",\"name\":\"\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-08 18:14:15'),(124,201,'Remoção de usuário','','[\"13\"]','2016-11-08 18:14:50'),(125,202,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-09 19:05:34'),(126,203,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-09 19:12:17'),(127,204,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-09 19:38:07'),(128,205,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-09 19:38:18'),(129,206,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-09 19:38:28'),(130,206,'Edição de usuário','','{\"id\":\"9\",\"role\":\"2\",\"email\":\"test@test.com\",\"name\":\"test asd\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-09 19:38:39'),(131,207,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-09 19:38:53'),(132,208,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-09 20:15:44'),(133,208,'Edição de usuário','','{\"id\":\"10\",\"role\":\"1\",\"email\":\"test@test.com2\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-09 20:16:51'),(134,208,'Edição de usuário','','{\"id\":\"10\",\"role\":\"1\",\"email\":\"test@test.com2\",\"name\":\"tes test\",\"password\":\"***\",\"password_confirmation\":\"***\"}','2016-11-09 20:17:13'),(135,209,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-10 14:36:05'),(136,210,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-11 19:34:32'),(137,211,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-21 12:36:21'),(138,212,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-21 14:27:08'),(139,213,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-21 14:27:20'),(140,214,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-21 14:39:48'),(141,215,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-21 14:40:39'),(142,216,'login','','{\"email\":\"test@test.com\",\"pass\":\"***\"}','2016-11-21 14:42:59'),(143,217,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-21 14:43:13'),(144,217,'cms/dashboard/users','','','2016-11-21 14:51:53'),(145,217,'cms/dashboard/users','','','2016-11-21 15:05:13'),(146,217,'cms/dashboard/users','','','2016-11-21 17:18:53'),(147,217,'cms/dashboard/users','','','2016-11-21 17:19:05'),(148,217,'cms/dashboard/users','','','2016-11-21 17:19:21'),(149,217,'cms/dashboard/users','','','2016-11-21 17:20:14'),(150,217,'cms/dashboard/users','','','2016-11-21 17:20:14'),(151,217,'cms/dashboard/users','','','2016-11-21 17:20:15'),(152,217,'cms/dashboard/users','','','2016-11-21 17:20:15'),(153,217,'cms/dashboard/users','','','2016-11-21 17:20:15'),(154,217,'cms/dashboard/users','','','2016-11-21 17:20:16'),(155,217,'cms/dashboard/users','','','2016-11-21 17:20:16'),(156,217,'cms/dashboard/users','','','2016-11-21 17:20:16'),(157,217,'cms/dashboard/users','','','2016-11-21 17:20:17'),(158,217,'cms/dashboard/users','','','2016-11-21 17:20:17'),(159,217,'cms/dashboard/users','','','2016-11-21 17:20:17'),(160,217,'cms/dashboard/users','','','2016-11-21 17:20:18'),(161,217,'cms/dashboard/users','','','2016-11-21 17:20:18'),(162,217,'cms/dashboard/users','','','2016-11-21 17:20:19'),(163,217,'cms/dashboard/users','','','2016-11-21 17:20:19'),(164,217,'cms/dashboard/users','','','2016-11-21 17:20:19'),(165,217,'cms/dashboard/users','','','2016-11-21 17:20:20'),(166,217,'cms/dashboard/users','','','2016-11-21 17:20:20'),(167,217,'cms/dashboard/users','','','2016-11-21 17:20:20'),(168,217,'cms/dashboard/users','','','2016-11-21 17:20:21'),(169,217,'cms/dashboard/users','','','2016-11-21 17:20:21'),(170,217,'cms/dashboard/users','','','2016-11-21 17:20:22'),(171,217,'cms/dashboard/users','','','2016-11-21 17:20:22'),(172,217,'cms/dashboard/users','','','2016-11-21 17:20:23'),(173,218,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-22 12:08:28'),(174,218,'cms/dashboard/users','','','2016-11-22 12:08:28'),(175,218,'cms/dashboard/users','','','2016-11-22 12:09:50'),(176,218,'cms/dashboard/users','','','2016-11-22 12:14:41'),(177,218,'cms/dashboard/users','','','2016-11-22 12:25:36'),(178,218,'cms/dashboard/users','','','2016-11-22 12:25:45'),(179,218,'cms/dashboard/users','','','2016-11-22 12:25:49'),(180,218,'cms/dashboard/users','','','2016-11-22 12:26:07'),(181,218,'cms/dashboard/users','','','2016-11-22 12:26:48'),(182,218,'cms/dashboard/users','','','2016-11-22 12:26:57'),(183,218,'cms/dashboard/users','','','2016-11-22 12:26:59'),(184,218,'cms/dashboard/users','','','2016-11-22 12:29:30'),(185,218,'cms/dashboard/users','','','2016-11-22 12:29:59'),(186,218,'cms/dashboard/users','','','2016-11-22 12:30:07'),(187,218,'cms/dashboard/users','','','2016-11-22 12:30:33'),(188,218,'cms/dashboard/users','','','2016-11-22 12:30:50'),(189,218,'cms/dashboard/users','','','2016-11-22 12:30:58'),(190,218,'cms/dashboard/users','','','2016-11-22 12:31:17'),(191,218,'cms/dashboard/users','','','2016-11-22 12:31:18'),(192,218,'cms/dashboard/users','','','2016-11-22 12:31:23'),(193,218,'cms/dashboard/users','','','2016-11-22 12:32:07'),(194,218,'cms/dashboard/users','','','2016-11-22 12:32:09'),(195,218,'cms/dashboard/users','','','2016-11-22 12:32:10'),(196,218,'cms/dashboard/users','','','2016-11-22 12:32:12'),(197,218,'cms/dashboard/users','','','2016-11-22 12:32:39'),(198,218,'cms/dashboard/users','','','2016-11-22 12:33:01'),(199,218,'cms/dashboard/users','','','2016-11-22 12:33:02'),(200,218,'cms/dashboard/users','','','2016-11-22 12:33:21'),(201,218,'cms/dashboard/users','','','2016-11-22 12:33:24'),(202,218,'cms/dashboard/users','','','2016-11-22 12:33:38'),(203,218,'cms/dashboard/users','','','2016-11-22 12:34:29'),(204,218,'cms/dashboard/users','','','2016-11-22 12:34:59'),(205,218,'cms/dashboard/users','','','2016-11-22 12:35:02'),(206,218,'cms/dashboard/users','','','2016-11-22 12:35:19'),(207,218,'cms/dashboard/users','','','2016-11-22 12:35:25'),(208,218,'cms/dashboard/users','','','2016-11-22 12:36:01'),(209,218,'cms/dashboard/users','','','2016-11-22 12:36:11'),(210,218,'cms/dashboard/users','','','2016-11-22 12:36:14'),(211,218,'cms/dashboard/users','','','2016-11-22 12:36:25'),(212,218,'cms/dashboard/users','','','2016-11-22 12:36:41'),(213,218,'cms/dashboard/users','','','2016-11-22 12:36:46'),(214,218,'cms/dashboard/users','','','2016-11-22 12:37:02'),(215,218,'cms/dashboard/users','','','2016-11-22 12:37:22'),(216,218,'cms/dashboard/users','','','2016-11-22 12:39:27'),(217,218,'cms/dashboard/users','','','2016-11-22 12:40:15'),(218,218,'cms/dashboard/users','','','2016-11-22 12:40:26'),(219,218,'cms/dashboard/users','','','2016-11-22 12:40:36'),(220,218,'cms/dashboard/users','','','2016-11-22 12:41:04'),(221,218,'cms/dashboard/users','','','2016-11-22 12:41:44'),(222,218,'cms/dashboard/users','','','2016-11-22 12:42:04'),(223,218,'cms/dashboard/users','','','2016-11-22 12:42:13'),(224,218,'cms/dashboard/users','','','2016-11-22 12:42:16'),(225,218,'cms/dashboard/users','','','2016-11-22 12:42:46'),(226,218,'cms/dashboard/users','','','2016-11-22 12:43:02'),(227,218,'cms/dashboard/users','','','2016-11-22 12:43:27'),(228,218,'cms/dashboard/users','','','2016-11-22 12:44:03'),(229,218,'cms/dashboard/users','','','2016-11-22 12:44:30'),(230,218,'cms/dashboard/users','','','2016-11-22 12:44:44'),(231,218,'cms/dashboard/users','','','2016-11-22 12:45:03'),(232,218,'cms/dashboard/users','','','2016-11-22 12:45:39'),(233,218,'cms/dashboard/users','','','2016-11-22 12:46:05'),(234,218,'cms/dashboard/users','','','2016-11-22 12:46:11'),(235,218,'cms/dashboard/users','','','2016-11-22 12:46:21'),(236,218,'cms/dashboard/users','','','2016-11-22 12:46:31'),(237,218,'cms/dashboard/users','','','2016-11-22 12:46:45'),(238,218,'cms/dashboard/users','','','2016-11-22 12:47:12'),(239,218,'cms/dashboard/users','','','2016-11-22 12:47:25'),(240,218,'cms/dashboard/users','','','2016-11-22 12:47:46'),(241,218,'cms/dashboard/users','','','2016-11-22 12:47:55'),(242,218,'cms/dashboard/users','','','2016-11-22 12:48:53'),(243,218,'cms/dashboard/users','','','2016-11-22 12:48:59'),(244,218,'cms/dashboard/users','','','2016-11-22 12:49:10'),(245,218,'cms/dashboard/users','','','2016-11-22 12:49:17'),(246,218,'cms/dashboard/users','','','2016-11-22 12:49:55'),(247,218,'cms/dashboard/users','','','2016-11-22 12:50:09'),(248,218,'cms/dashboard/users','','','2016-11-22 12:50:59'),(249,218,'cms/dashboard/users','','','2016-11-22 12:52:41'),(250,218,'cms/dashboard/users','','','2016-11-22 12:53:25'),(251,218,'cms/dashboard/users','','','2016-11-22 12:53:33'),(252,218,'cms/dashboard/users','','','2016-11-22 12:53:40'),(253,218,'cms/dashboard/users','','','2016-11-22 12:53:48'),(254,218,'cms/dashboard/users','','','2016-11-22 12:53:53'),(255,218,'cms/dashboard/users','','','2016-11-22 12:53:55'),(256,218,'cms/dashboard/users','','','2016-11-22 12:55:10'),(257,218,'cms/dashboard/users','','','2016-11-22 12:57:39'),(258,218,'cms/dashboard/users','','','2016-11-22 13:12:52'),(259,218,'cms/dashboard/users','','','2016-11-22 13:13:15'),(260,218,'cms/dashboard/users','','','2016-11-22 13:13:41'),(261,218,'cms/dashboard/users','','','2016-11-22 13:13:43'),(262,218,'cms/dashboard/users','','','2016-11-22 13:13:45'),(263,218,'cms/dashboard/users','','','2016-11-22 13:14:05'),(264,218,'cms/dashboard/users','','','2016-11-22 13:14:07'),(265,218,'cms/dashboard/users','','','2016-11-22 13:14:52'),(266,218,'cms/dashboard/users','','','2016-11-22 13:14:53'),(267,218,'cms/dashboard/users','','','2016-11-22 13:15:06'),(268,218,'cms/dashboard/users','','','2016-11-22 13:15:14'),(269,218,'cms/dashboard/users','','','2016-11-22 13:15:29'),(270,218,'cms/dashboard/users','','','2016-11-22 13:15:34'),(271,218,'cms/dashboard/users','','','2016-11-22 13:15:50'),(272,218,'cms/dashboard/users','','','2016-11-22 13:16:09'),(273,218,'cms/dashboard/users','','','2016-11-22 13:16:15'),(274,218,'cms/dashboard/users','','','2016-11-22 13:16:26'),(275,218,'cms/dashboard/users','','','2016-11-22 13:16:59'),(276,218,'cms/dashboard/users','','','2016-11-22 13:17:23'),(277,218,'cms/dashboard/users','','','2016-11-22 13:17:31'),(278,218,'cms/dashboard/users','','','2016-11-22 13:17:40'),(279,218,'cms/dashboard/users','','','2016-11-22 13:17:47'),(280,218,'cms/dashboard/users','','','2016-11-22 13:18:15'),(281,218,'cms/dashboard/users','','','2016-11-22 13:18:26'),(282,218,'cms/dashboard/users','','','2016-11-22 13:18:33'),(283,218,'cms/dashboard/users','','','2016-11-22 13:18:39'),(284,218,'cms/dashboard/users','','','2016-11-22 13:18:49'),(285,218,'cms/dashboard/users','','','2016-11-22 13:20:00'),(286,218,'cms/dashboard/users','','','2016-11-22 13:20:07'),(287,218,'cms/dashboard/users','','','2016-11-22 13:20:26'),(288,218,'cms/dashboard/users','','','2016-11-22 13:20:34'),(289,218,'cms/dashboard/users','','','2016-11-22 13:20:37'),(290,218,'cms/dashboard/users','','','2016-11-22 13:20:45'),(291,218,'cms/dashboard/users','','','2016-11-22 13:20:53'),(292,218,'cms/dashboard/users','','','2016-11-22 13:21:14'),(293,218,'cms/dashboard/users','','','2016-11-22 13:21:25'),(294,218,'cms/dashboard/users','','','2016-11-22 13:22:01'),(295,218,'cms/dashboard/users','','','2016-11-22 13:22:12'),(296,218,'cms/dashboard/users','','','2016-11-22 13:22:19'),(297,218,'cms/dashboard/users','','','2016-11-22 13:22:26'),(298,218,'cms/dashboard/users','','','2016-11-22 13:22:38'),(299,218,'cms/dashboard/users','','','2016-11-22 13:22:45'),(300,218,'cms/dashboard/users','','','2016-11-22 13:23:19'),(301,218,'cms/dashboard/users','','','2016-11-22 13:23:42'),(302,218,'cms/dashboard/users','','','2016-11-22 13:23:55'),(303,218,'cms/dashboard/users','','','2016-11-22 13:24:46'),(304,218,'cms/dashboard/users','','','2016-11-22 13:25:03'),(305,218,'cms/dashboard/users','','','2016-11-22 13:25:05'),(306,218,'cms/dashboard/users','','','2016-11-22 13:25:34'),(307,218,'cms/dashboard/users','','','2016-11-22 13:25:59'),(308,218,'cms/dashboard/users','','','2016-11-22 13:26:08'),(309,218,'cms/dashboard/users','','','2016-11-22 13:28:48'),(310,218,'cms/dashboard/users','','','2016-11-22 13:28:56'),(311,218,'cms/dashboard/users','','','2016-11-22 13:29:17'),(312,218,'cms/dashboard/users','','','2016-11-22 13:29:27'),(313,218,'cms/dashboard/users','','','2016-11-22 13:29:29'),(314,218,'cms/dashboard/users','','','2016-11-22 13:29:42'),(315,218,'cms/dashboard/usersPie','','','2016-11-22 13:30:27'),(316,218,'cms/dashboard/usersPie','','','2016-11-22 13:36:03'),(317,218,'cms/dashboard/usersPie','','','2016-11-22 13:36:14'),(318,218,'cms/dashboard/usersPie','','','2016-11-22 13:36:35'),(319,218,'cms/dashboard/usersPie','','','2016-11-22 13:36:42'),(320,218,'cms/dashboard/usersPie','','','2016-11-22 13:37:40'),(321,218,'cms/dashboard/usersPie','','','2016-11-22 13:37:46'),(322,218,'cms/dashboard/usersPie','','','2016-11-22 13:38:07'),(323,218,'cms/dashboard/usersPie','','','2016-11-22 13:38:13'),(324,218,'cms/dashboard/usersPie','','','2016-11-22 13:38:22'),(325,218,'cms/dashboard/usersPie','','','2016-11-22 13:39:18'),(326,218,'cms/dashboard/usersPie','','','2016-11-22 13:39:21'),(327,218,'cms/dashboard/usersPie','','','2016-11-22 13:39:30'),(328,218,'cms/dashboard/usersPie','','','2016-11-22 13:39:40'),(329,218,'cms/dashboard/usersPie','','','2016-11-22 13:41:17'),(330,218,'cms/dashboard/usersPie','','','2016-11-22 13:42:10'),(331,218,'cms/dashboard/usersPie','','','2016-11-22 13:42:24'),(332,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:11'),(333,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:13'),(334,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:15'),(335,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:17'),(336,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:18'),(337,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:19'),(338,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:20'),(339,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:22'),(340,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:23'),(341,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:24'),(342,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:25'),(343,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:26'),(344,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:27'),(345,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:31'),(346,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:34'),(347,218,'cms/dashboard/usersPie','','','2016-11-22 13:43:43'),(348,218,'cms/dashboard/usersPie','','','2016-11-22 13:44:11'),(349,218,'cms/dashboard/usersPie','','','2016-11-22 14:40:16'),(350,219,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-23 19:12:02'),(351,219,'cms/dashboard/usersPie','','','2016-11-23 19:12:02'),(352,219,'cms/dashboard/usersPie','','','2016-11-23 19:13:14'),(353,219,'cms/dashboard/usersPie','','','2016-11-23 19:17:55'),(354,219,'cms/dashboard/usersPie','','','2016-11-23 19:18:08'),(355,219,'cms/dashboard/usersPie','','','2016-11-23 19:18:17'),(356,219,'cms/dashboard/usersPie','','','2016-11-23 19:34:45'),(357,220,'login','','{\"email\":\"keita@slikland.com\",\"pass\":\"***\"}','2016-11-29 12:31:11'),(358,220,'cms/dashboard/usersPie','','','2016-11-29 12:31:12');
/*!40000 ALTER TABLE `cms_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_login_attempt`
--

DROP TABLE IF EXISTS `cms_login_attempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cms_login_attempt` (
  `pk_cms_login_attempt` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(45) DEFAULT NULL,
  `attempt` int(11) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`pk_cms_login_attempt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_login_attempt`
--

LOCK TABLES `cms_login_attempt` WRITE;
/*!40000 ALTER TABLE `cms_login_attempt` DISABLE KEYS */;
/*!40000 ALTER TABLE `cms_login_attempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_role`
--

DROP TABLE IF EXISTS `cms_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cms_role` (
  `pk_cms_role` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pk_cms_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_role`
--

LOCK TABLES `cms_role` WRITE;
/*!40000 ALTER TABLE `cms_role` DISABLE KEYS */;
INSERT INTO `cms_role` VALUES (1,'superadmin','2016-10-20 19:49:19'),(2,'admin','2016-10-28 12:28:52'),(3,'editor','2016-10-28 12:28:52');
/*!40000 ALTER TABLE `cms_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_session`
--

DROP TABLE IF EXISTS `cms_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cms_session` (
  `pk_cms_session` int(11) NOT NULL AUTO_INCREMENT,
  `fk_cms_user` int(11) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`pk_cms_session`),
  KEY `cms_session_cms_user_idx` (`fk_cms_user`),
  CONSTRAINT `cms_session_cms_user` FOREIGN KEY (`fk_cms_user`) REFERENCES `cms_user` (`pk_cms_user`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=221 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_session`
--

LOCK TABLES `cms_session` WRITE;
/*!40000 ALTER TABLE `cms_session` DISABLE KEYS */;
INSERT INTO `cms_session` VALUES (1,1,'2016-10-20 19:49:57','2016-10-20 19:49:57','127.0.0.1',1),(2,1,'2016-10-20 19:50:33','2016-10-20 19:50:33','127.0.0.1',1),(3,1,'2016-10-20 19:50:34','2016-10-20 19:50:34','127.0.0.1',1),(4,1,'2016-10-20 19:50:34','2016-10-20 19:50:34','127.0.0.1',1),(5,1,'2016-10-20 19:50:34','2016-10-20 19:50:34','127.0.0.1',1),(6,1,'2016-10-20 19:50:42','2016-10-20 19:50:42','127.0.0.1',1),(7,1,'2016-10-20 19:51:02','2016-10-20 19:51:02','127.0.0.1',1),(8,1,'2016-10-20 19:51:31','2016-10-20 19:51:31','127.0.0.1',1),(9,1,'2016-10-20 19:51:40','2016-10-20 19:51:40','127.0.0.1',1),(10,1,'2016-10-20 19:51:40','2016-10-20 19:51:40','127.0.0.1',1),(11,1,'2016-10-20 19:51:50','2016-10-20 19:51:50','127.0.0.1',1),(12,1,'2016-10-20 19:51:51','2016-10-20 19:51:51','127.0.0.1',1),(13,1,'2016-10-20 19:52:07','2016-10-20 19:52:07','127.0.0.1',1),(14,1,'2016-10-20 19:52:37','2016-10-20 19:52:37','127.0.0.1',1),(15,1,'2016-10-20 19:52:38','2016-10-20 19:52:38','127.0.0.1',1),(16,1,'2016-10-20 19:52:58','2016-10-20 19:52:58','127.0.0.1',1),(17,1,'2016-10-20 19:52:59','2016-10-20 19:52:59','127.0.0.1',1),(18,1,'2016-10-20 19:52:59','2016-10-20 19:52:59','127.0.0.1',1),(19,1,'2016-10-20 19:52:59','2016-10-20 19:52:59','127.0.0.1',1),(20,1,'2016-10-20 19:53:09','2016-10-20 19:53:09','127.0.0.1',1),(21,1,'2016-10-20 19:53:11','2016-10-20 19:53:11','127.0.0.1',1),(22,1,'2016-10-20 19:53:11','2016-10-20 19:53:11','127.0.0.1',1),(23,1,'2016-10-20 19:53:24','2016-10-20 19:53:24','127.0.0.1',1),(24,1,'2016-10-20 19:53:24','2016-10-20 19:53:24','127.0.0.1',1),(25,1,'2016-10-20 19:53:24','2016-10-20 19:53:24','127.0.0.1',1),(26,1,'2016-10-20 19:53:25','2016-10-20 19:53:25','127.0.0.1',1),(27,1,'2016-10-20 19:53:25','2016-10-20 19:53:25','127.0.0.1',1),(28,1,'2016-10-20 19:53:25','2016-10-20 19:53:25','127.0.0.1',1),(29,1,'2016-10-20 19:54:40','2016-10-20 19:54:40','127.0.0.1',1),(30,1,'2016-10-20 19:55:02','2016-10-20 19:55:02','127.0.0.1',1),(31,1,'2016-10-20 19:56:00','2016-10-20 19:56:00','127.0.0.1',1),(32,1,'2016-10-20 19:56:23','2016-10-20 19:56:23','127.0.0.1',1),(33,1,'2016-10-20 19:56:24','2016-10-20 19:56:24','127.0.0.1',1),(34,1,'2016-10-20 19:56:31','2016-10-20 19:56:31','127.0.0.1',1),(35,1,'2016-10-20 19:56:32','2016-10-20 19:56:32','127.0.0.1',1),(36,1,'2016-10-20 19:56:35','2016-10-20 19:56:35','127.0.0.1',1),(37,1,'2016-10-20 19:57:03','2016-10-20 19:57:03','127.0.0.1',1),(38,1,'2016-10-20 19:57:04','2016-10-20 19:57:04','127.0.0.1',1),(39,1,'2016-10-20 19:57:15','2016-10-20 19:57:15','127.0.0.1',1),(40,1,'2016-10-20 19:57:18','2016-10-20 19:57:18','127.0.0.1',1),(41,1,'2016-10-20 19:57:19','2016-10-20 19:57:19','127.0.0.1',1),(42,1,'2016-10-20 19:57:22','2016-10-20 19:57:22','127.0.0.1',1),(43,1,'2016-10-20 19:57:23','2016-10-20 19:57:23','127.0.0.1',1),(44,1,'2016-10-20 19:57:23','2016-10-20 19:57:23','127.0.0.1',1),(45,1,'2016-10-20 19:57:26','2016-10-20 19:57:26','127.0.0.1',1),(46,1,'2016-10-20 19:57:27','2016-10-20 19:57:27','127.0.0.1',1),(47,1,'2016-10-20 19:57:35','2016-10-20 19:57:35','127.0.0.1',1),(48,1,'2016-10-20 19:57:42','2016-10-20 19:57:42','127.0.0.1',1),(49,1,'2016-10-20 19:57:42','2016-10-20 19:57:42','127.0.0.1',1),(50,1,'2016-10-20 19:57:42','2016-10-20 19:57:42','127.0.0.1',1),(51,1,'2016-10-20 19:57:52','2016-10-20 19:57:52','127.0.0.1',1),(52,1,'2016-10-20 19:57:53','2016-10-20 19:57:53','127.0.0.1',1),(53,1,'2016-10-20 19:57:54','2016-10-20 19:57:54','127.0.0.1',1),(54,1,'2016-10-20 19:57:54','2016-10-20 19:57:54','127.0.0.1',1),(55,1,'2016-10-20 19:58:09','2016-10-20 19:58:09','127.0.0.1',1),(56,1,'2016-10-20 19:58:09','2016-10-20 19:58:09','127.0.0.1',1),(57,1,'2016-10-20 20:00:22','2016-10-20 20:00:22','127.0.0.1',1),(58,1,'2016-10-20 20:00:39','2016-10-20 20:00:39','127.0.0.1',1),(59,1,'2016-10-20 20:01:03','2016-10-20 20:01:03','127.0.0.1',1),(60,1,'2016-10-20 20:01:03','2016-10-20 20:01:03','127.0.0.1',1),(61,1,'2016-10-20 20:01:05','2016-10-20 20:01:05','127.0.0.1',1),(62,1,'2016-10-20 20:01:13','2016-10-20 20:01:13','127.0.0.1',1),(63,1,'2016-10-20 20:01:40','2016-10-20 20:01:40','127.0.0.1',1),(64,1,'2016-10-20 20:01:49','2016-10-20 20:01:49','127.0.0.1',1),(65,1,'2016-10-20 20:01:55','2016-10-20 20:01:55','127.0.0.1',1),(66,1,'2016-10-20 20:02:12','2016-10-20 20:02:12','127.0.0.1',1),(67,1,'2016-10-20 20:02:13','2016-10-20 20:02:13','127.0.0.1',1),(68,1,'2016-10-20 20:02:13','2016-10-20 20:02:13','127.0.0.1',1),(69,1,'2016-10-20 20:02:25','2016-10-20 20:02:25','127.0.0.1',1),(70,1,'2016-10-20 20:02:25','2016-10-20 20:02:25','127.0.0.1',1),(71,1,'2016-10-20 20:02:26','2016-10-20 20:02:26','127.0.0.1',1),(72,1,'2016-10-20 20:02:29','2016-10-20 20:02:29','127.0.0.1',1),(73,1,'2016-10-20 20:02:45','2016-10-20 20:02:45','127.0.0.1',1),(74,1,'2016-10-20 20:03:39','2016-10-20 20:03:39','127.0.0.1',1),(75,1,'2016-10-20 20:04:06','2016-10-20 20:04:06','127.0.0.1',1),(76,1,'2016-10-20 20:05:01','2016-10-20 20:05:01','127.0.0.1',1),(77,1,'2016-10-20 20:05:02','2016-10-20 20:05:02','127.0.0.1',1),(78,1,'2016-10-20 20:05:27','2016-10-20 20:05:27','127.0.0.1',1),(79,1,'2016-10-20 20:05:28','2016-10-20 20:05:28','127.0.0.1',1),(80,1,'2016-10-20 20:05:33','2016-10-20 20:05:33','127.0.0.1',1),(81,1,'2016-10-20 20:06:07','2016-10-20 20:06:07','127.0.0.1',1),(82,1,'2016-10-20 20:06:08','2016-10-20 20:06:08','127.0.0.1',1),(83,1,'2016-10-20 20:06:08','2016-10-20 20:06:08','127.0.0.1',1),(84,1,'2016-10-20 20:06:16','2016-10-20 20:06:16','127.0.0.1',1),(85,1,'2016-10-20 20:06:17','2016-10-20 20:06:17','127.0.0.1',1),(86,1,'2016-10-20 20:06:17','2016-10-20 20:06:17','127.0.0.1',1),(87,1,'2016-10-20 20:06:19','2016-10-20 20:06:19','127.0.0.1',1),(88,1,'2016-10-20 20:07:00','2016-10-20 20:07:00','127.0.0.1',1),(89,1,'2016-10-20 20:07:03','2016-10-20 20:07:03','127.0.0.1',1),(90,1,'2016-10-20 20:07:04','2016-10-20 20:07:04','127.0.0.1',1),(91,1,'2016-10-20 20:07:05','2016-10-20 20:07:05','127.0.0.1',1),(92,1,'2016-10-20 20:07:05','2016-10-20 20:07:05','127.0.0.1',1),(93,1,'2016-10-20 20:07:11','2016-10-20 20:07:11','127.0.0.1',1),(94,1,'2016-10-20 20:07:12','2016-10-20 20:07:12','127.0.0.1',1),(95,1,'2016-10-20 20:08:11','2016-10-20 20:08:11','127.0.0.1',1),(96,1,'2016-10-20 20:08:38','2016-10-20 20:08:39','127.0.0.1',1),(97,1,'2016-10-20 20:08:47','2016-10-20 20:10:08','127.0.0.1',1),(98,1,'2016-10-20 20:10:08','2016-10-20 20:10:08','127.0.0.1',1),(99,1,'2016-10-20 20:10:09','2016-10-20 20:10:09','127.0.0.1',1),(100,1,'2016-10-20 20:10:15','2016-10-20 20:10:15','127.0.0.1',1),(101,1,'2016-10-20 20:10:24','2016-10-20 20:10:29','127.0.0.1',1),(102,1,'2016-10-21 15:53:28','2016-10-21 15:53:28','127.0.0.1',1),(103,1,'2016-10-21 15:55:06','2016-10-21 15:55:06','127.0.0.1',1),(104,1,'2016-10-21 15:59:38','2016-10-21 15:59:38','127.0.0.1',1),(105,1,'2016-10-21 16:42:44','2016-10-21 16:42:44','127.0.0.1',1),(106,1,'2016-10-21 16:43:19','2016-10-21 16:43:19','127.0.0.1',1),(107,1,'2016-10-21 16:44:00','2016-10-21 19:36:32','127.0.0.1',1),(108,1,'2016-10-24 11:40:17','2016-10-24 11:43:57','127.0.0.1',1),(109,1,'2016-10-24 11:44:06','2016-10-24 12:12:40','127.0.0.1',1),(110,1,'2016-10-24 12:12:50','2016-10-24 12:13:03','127.0.0.1',1),(111,1,'2016-10-24 12:13:20','2016-10-24 12:13:20','127.0.0.1',1),(112,1,'2016-10-24 12:13:26','2016-10-24 12:13:26','127.0.0.1',1),(113,1,'2016-10-24 12:13:32','2016-10-24 12:13:32','127.0.0.1',1),(114,1,'2016-10-24 12:13:40','2016-10-24 12:13:40','127.0.0.1',1),(115,1,'2016-10-24 12:13:45','2016-10-24 12:13:45','127.0.0.1',1),(116,1,'2016-10-24 12:13:56','2016-10-24 12:14:14','127.0.0.1',1),(117,1,'2016-10-24 12:14:24','2016-10-24 12:14:24','127.0.0.1',1),(118,1,'2016-10-24 12:14:34','2016-10-24 12:14:34','127.0.0.1',1),(119,1,'2016-10-24 12:14:39','2016-10-24 12:14:39','127.0.0.1',1),(120,1,'2016-10-24 12:15:44','2016-10-24 12:15:44','127.0.0.1',1),(121,1,'2016-10-24 12:15:51','2016-10-24 12:16:07','127.0.0.1',1),(122,1,'2016-10-24 12:16:13','2016-10-24 12:16:13','127.0.0.1',1),(123,1,'2016-10-24 12:16:19','2016-10-24 12:16:19','127.0.0.1',1),(124,1,'2016-10-24 12:16:24','2016-10-24 12:16:24','127.0.0.1',1),(125,1,'2016-10-24 12:16:28','2016-10-24 12:16:28','127.0.0.1',1),(126,1,'2016-10-24 12:16:33','2016-10-24 12:16:33','127.0.0.1',1),(127,1,'2016-10-24 12:16:45','2016-10-24 12:58:00','127.0.0.1',1),(128,1,'2016-10-24 12:58:14','2016-10-24 12:58:14','127.0.0.1',1),(129,1,'2016-10-24 12:58:19','2016-10-24 13:00:26','127.0.0.1',1),(130,1,'2016-10-24 13:00:31','2016-10-24 15:38:19','127.0.0.1',1),(131,1,'2016-10-24 15:38:27','2016-10-24 18:26:42','127.0.0.1',1),(132,1,'2016-10-24 18:26:58','2016-10-24 18:26:58','127.0.0.1',1),(133,1,'2016-10-24 18:27:25','2016-10-24 18:27:25','127.0.0.1',1),(134,1,'2016-10-24 18:27:29','2016-10-24 18:27:30','127.0.0.1',1),(135,1,'2016-10-24 18:27:36','2016-10-24 20:01:27','127.0.0.1',1),(136,1,'2016-10-24 20:03:55','2016-10-24 20:03:55','127.0.0.1',1),(137,1,'2016-10-24 20:04:01','2016-10-24 20:04:02','127.0.0.1',1),(138,1,'2016-10-24 20:04:16','2016-10-24 20:04:16','127.0.0.1',1),(139,1,'2016-10-24 20:04:22','2016-10-24 20:04:34','127.0.0.1',1),(140,1,'2016-10-25 12:05:56','2016-10-25 13:14:03','127.0.0.1',1),(141,1,'2016-10-25 16:58:20','2016-10-25 19:50:14','127.0.0.1',1),(142,1,'2016-10-26 12:49:17','2016-10-26 14:20:59','127.0.0.1',1),(143,1,'2016-10-26 14:23:29','2016-10-26 14:35:35','127.0.0.1',1),(144,1,'2016-10-26 15:05:53','2016-10-26 20:31:00','127.0.0.1',1),(145,1,'2016-10-27 12:28:48','2016-10-27 16:20:40','127.0.0.1',1),(146,1,'2016-10-27 17:23:06','2016-10-27 18:44:27','127.0.0.1',1),(147,1,'2016-10-27 18:45:00','2016-10-27 20:00:35','127.0.0.1',1),(148,1,'2016-10-27 20:02:01','2016-10-27 20:02:18','127.0.0.1',1),(149,1,'2016-10-27 20:09:57','2016-10-27 20:13:30','127.0.0.1',1),(150,1,'2016-10-28 02:08:56','2016-10-28 02:21:33','127.0.0.1',1),(151,1,'2016-10-28 12:22:03','2016-10-28 16:05:41','127.0.0.1',1),(152,2,'2016-10-28 16:06:07','2016-10-28 16:06:10','127.0.0.1',1),(153,1,'2016-10-28 16:06:31','2016-10-28 18:14:16','127.0.0.1',1),(154,1,'2016-10-28 18:46:35','2016-10-28 19:03:43','127.0.0.1',1),(155,1,'2016-10-31 10:56:42','2016-10-31 14:34:35','127.0.0.1',1),(156,1,'2016-10-31 14:34:46','2016-10-31 14:34:46','127.0.0.1',1),(157,1,'2016-10-31 14:35:10','2016-10-31 14:36:58','127.0.0.1',1),(158,1,'2016-10-31 14:38:04','2016-10-31 15:33:07','127.0.0.1',1),(159,1,'2016-10-31 16:09:14','2016-10-31 17:44:18','127.0.0.1',1),(160,1,'2016-10-31 17:44:56','2016-10-31 19:32:39','127.0.0.1',1),(161,1,'2016-11-01 13:28:00','2016-11-01 18:31:26','127.0.0.1',1),(162,1,'2016-11-03 12:10:27','2016-11-03 15:15:29','127.0.0.1',1),(163,1,'2016-11-03 15:45:19','2016-11-03 16:44:03','127.0.0.1',1),(164,1,'2016-11-03 16:46:16','2016-11-03 18:49:27','127.0.0.1',1),(165,1,'2016-11-03 19:47:08','2016-11-03 19:47:08','127.0.0.1',1),(166,1,'2016-11-03 19:48:25','2016-11-03 19:48:25','127.0.0.1',1),(167,1,'2016-11-03 19:48:49','2016-11-03 19:48:49','127.0.0.1',1),(168,1,'2016-11-03 19:49:01','2016-11-03 19:49:01','127.0.0.1',1),(169,1,'2016-11-03 19:49:25','2016-11-03 19:49:25','127.0.0.1',1),(170,1,'2016-11-03 19:49:46','2016-11-03 19:49:46','127.0.0.1',1),(171,1,'2016-11-03 19:50:19','2016-11-03 19:50:19','127.0.0.1',1),(172,1,'2016-11-03 19:51:06','2016-11-03 19:51:06','127.0.0.1',1),(173,1,'2016-11-03 19:51:40','2016-11-03 19:51:40','127.0.0.1',1),(174,1,'2016-11-03 19:52:38','2016-11-03 19:52:38','127.0.0.1',1),(175,1,'2016-11-03 19:53:06','2016-11-03 19:53:06','127.0.0.1',1),(176,1,'2016-11-03 19:53:40','2016-11-03 19:53:40','127.0.0.1',1),(177,1,'2016-11-03 19:54:00','2016-11-03 19:54:00','127.0.0.1',1),(178,1,'2016-11-03 19:54:55','2016-11-03 19:55:09','127.0.0.1',1),(179,1,'2016-11-03 19:55:14','2016-11-03 19:55:24','127.0.0.1',1),(180,1,'2016-11-03 19:55:28','2016-11-03 19:55:28','127.0.0.1',1),(181,1,'2016-11-03 19:55:43','2016-11-03 20:00:04','127.0.0.1',1),(182,1,'2016-11-03 20:00:10','2016-11-03 20:00:11','127.0.0.1',1),(183,1,'2016-11-04 14:39:39','2016-11-04 14:39:46','127.0.0.1',1),(184,1,'2016-11-04 14:39:54','2016-11-04 14:42:58','127.0.0.1',1),(185,7,'2016-11-04 14:43:04','2016-11-04 14:43:07','127.0.0.1',1),(186,7,'2016-11-04 14:43:17','2016-11-04 14:43:18','127.0.0.1',1),(187,7,'2016-11-04 14:43:39','2016-11-04 14:43:39','127.0.0.1',1),(188,7,'2016-11-04 14:44:26','2016-11-04 14:44:26','127.0.0.1',1),(189,1,'2016-11-04 14:47:12','2016-11-04 15:28:12','127.0.0.1',1),(190,7,'2016-11-04 15:28:32','2016-11-04 15:36:33','127.0.0.1',1),(191,1,'2016-11-04 15:37:12','2016-11-04 20:42:35','127.0.0.1',1),(192,1,'2016-11-07 12:41:49','2016-11-07 12:41:51','127.0.0.1',1),(193,1,'2016-11-07 12:46:39','2016-11-07 12:46:41','127.0.0.1',1),(194,1,'2016-11-07 15:13:49','2016-11-07 15:14:37','127.0.0.1',1),(195,1,'2016-11-07 15:14:43','2016-11-07 17:25:00','127.0.0.1',1),(196,1,'2016-11-07 17:27:27','2016-11-07 17:27:56','127.0.0.1',1),(197,1,'2016-11-07 17:31:55','2016-11-07 17:42:08','127.0.0.1',1),(198,1,'2016-11-07 17:58:11','2016-11-07 19:36:15','127.0.0.1',1),(199,1,'2016-11-08 03:16:57','2016-11-08 11:52:41','127.0.0.1',1),(200,11,'2016-11-08 12:31:50','2016-11-08 13:02:50','127.0.0.1',1),(201,1,'2016-11-08 14:34:14','2016-11-08 18:38:04','127.0.0.1',1),(202,1,'2016-11-09 19:05:34','2016-11-09 19:11:39','127.0.0.1',1),(203,1,'2016-11-09 19:12:17','2016-11-09 19:32:49','127.0.0.1',1),(204,1,'2016-11-09 19:38:07','2016-11-09 19:38:07','127.0.0.1',1),(205,9,'2016-11-09 19:38:18','2016-11-09 19:38:18','127.0.0.1',1),(206,1,'2016-11-09 19:38:28','2016-11-09 19:38:39','127.0.0.1',1),(207,9,'2016-11-09 19:38:53','2016-11-09 20:12:49','127.0.0.1',1),(208,1,'2016-11-09 20:15:44','2016-11-09 20:32:31','127.0.0.1',1),(209,1,'2016-11-10 14:36:05','2016-11-10 18:48:15','127.0.0.1',1),(210,1,'2016-11-11 19:34:32','2016-11-11 19:44:34','127.0.0.1',1),(211,1,'2016-11-21 12:36:21','2016-11-21 14:26:51','127.0.0.1',1),(212,9,'2016-11-21 14:27:08','2016-11-21 14:27:13','127.0.0.1',1),(213,1,'2016-11-21 14:27:20','2016-11-21 14:39:41','127.0.0.1',1),(214,9,'2016-11-21 14:39:48','2016-11-21 14:40:31','127.0.0.1',1),(215,1,'2016-11-21 14:40:39','2016-11-21 14:42:52','127.0.0.1',1),(216,9,'2016-11-21 14:42:59','2016-11-21 14:43:03','127.0.0.1',1),(217,1,'2016-11-21 14:43:13','2016-11-21 17:20:23','127.0.0.1',1),(218,1,'2016-11-22 12:08:28','2016-11-22 14:40:16','127.0.0.1',1),(219,1,'2016-11-23 19:12:02','2016-11-23 19:34:45','127.0.0.1',1),(220,1,'2016-11-29 12:31:11','2016-11-29 12:31:29','127.0.0.1',1);
/*!40000 ALTER TABLE `cms_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_setting`
--

DROP TABLE IF EXISTS `cms_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cms_setting` (
  `name` varchar(255) NOT NULL,
  `value` blob,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_setting`
--

LOCK TABLES `cms_setting` WRITE;
/*!40000 ALTER TABLE `cms_setting` DISABLE KEYS */;
/*!40000 ALTER TABLE `cms_setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_user`
--

DROP TABLE IF EXISTS `cms_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cms_user` (
  `pk_cms_user` int(11) NOT NULL AUTO_INCREMENT,
  `fk_cms_role` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) DEFAULT '1',
  `password_changed` datetime DEFAULT NULL,
  `checksum` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`pk_cms_user`),
  KEY `cms_user_cms_role_idx` (`fk_cms_role`),
  CONSTRAINT `cms_user_cms_role` FOREIGN KEY (`fk_cms_role`) REFERENCES `cms_role` (`pk_cms_role`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_user`
--

LOCK TABLES `cms_user` WRITE;
/*!40000 ALTER TABLE `cms_user` DISABLE KEYS */;
INSERT INTO `cms_user` VALUES (1,1,'keita@slikland.com','6C3WZFkfy4Vlsce98dc18078b5ec7938c9ee4731d8486','Keita Kuroki','2016-10-20 19:49:54',1,NULL,'UMwELuQjO9bls7eaff639b9ab471ac47d78a9ab73f061'),(2,1,'test@test.com','EfwIJIjsku1lsaa5ab5ec12f32522ae07858c1b89491f','test test','2016-10-28 16:05:54',2,NULL,NULL),(3,1,'test','EfwIJIjsku1lsaa5ab5ec12f32522ae07858c1b89491f','test test','2016-10-31 12:02:26',2,NULL,NULL),(4,2,'asdasd@asd.asd','EfwIJIjsku1lsaa5ab5ec12f32522ae07858c1b89491f','asdasd asd sa d asdasd','2016-10-31 12:03:12',2,NULL,NULL),(5,1,'','w1RjtIS7En0ls54a2bf8c09ace67d3513aaa1aa7aa0f3','','2016-11-03 12:36:40',2,NULL,NULL),(6,1,'asd@','w1RjtIS7En0ls54a2bf8c09ace67d3513aaa1aa7aa0f3','','2016-11-03 12:41:10',2,NULL,NULL),(7,2,'test@test.com','EfwIJIjsku1ls3335a184a21eb2d06693b3bde6cdbffa','tes test','2016-11-03 13:43:33',2,NULL,'IZqn..36E2ils84dbd056b4bb778df36a5d8c240ff5ba'),(8,1,'test@asdasd.asd','EfwIJIjsku1ls94748847776744f2e5888a08ecba41d8','asd asd','2016-11-03 13:52:49',2,NULL,'ULAIbrLBGZHlsc8402b1699a664aa62ce3fd38f571b8a'),(9,2,'test@test.com','EfwIJIjsku1lsc140a3296fa948ee3401f8eace37171d','test asd','2016-11-07 16:09:28',1,NULL,'sO5pS1KrmhZls9522a1cf7313bacc13d77d354a77b072'),(10,1,'test@test.com2','EfwIJIjsku1ls56d7e88b709c590434d95da6f46e08b9','tes test','2016-11-07 16:09:47',1,NULL,'YOOFHSrFtialsbc6249055336d0f252949701366e29a6'),(11,1,'info@slikland.com','2LeGTSnsYLfls712333807da412191357fd34e5749265','Slikland Creative Development','2016-11-08 11:52:41',1,NULL,'QKTRE9qnl.Blsab8693d976926dd92a2248d27002142d'),(12,1,'','w1RjtIS7En0ls0bfabd99dea10d7a6df6ee6fb4589b98','','2016-11-08 18:13:52',2,NULL,'s4tR9HeNnMCls66fa194fbe39fc5fde28c81442a05419'),(13,1,'','w1RjtIS7En0lsbb5f3e71dc0ac351b92f9d35f0b0e751','','2016-11-08 18:14:15',2,NULL,'kLIlz/4cpxwlsba7c40dd830f15f62df650963539c36b');
/*!40000 ALTER TABLE `cms_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media` (
  `pk_media` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `ext` varchar(10) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pk_media`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_meta`
--

DROP TABLE IF EXISTS `media_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_meta` (
  `pk_media_meta` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`pk_media_meta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_meta`
--

LOCK TABLES `media_meta` WRITE;
/*!40000 ALTER TABLE `media_meta` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_type`
--

DROP TABLE IF EXISTS `media_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_type` (
  `pk_media_type` int(11) NOT NULL AUTO_INCREMENT,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `ext` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pk_media_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_type`
--

LOCK TABLES `media_type` WRITE;
/*!40000 ALTER TABLE `media_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-29 12:32:08
