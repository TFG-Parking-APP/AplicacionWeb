
CREATE DATABASE IF NOT EXISTS `parkingdb`;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `parkingdb`
--

USE `parkingdb`;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `user`
--

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `password` varchar(20) NOT NULL,
  `image` longblob NOT NULL,
  `email` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;


--
-- Estructura de tabla para la tabla `car`
--


DROP TABLE IF EXISTS `car`;

CREATE TABLE `car` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(20) NOT NULL,
  `plate` varchar(20) NOT NULL,
  `image` longblob NOT NULL,
  `status` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `userIdFK` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `history`
--
DROP TABLE IF EXISTS `history`;

CREATE TABLE `history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carId` int NOT NULL,
  `entryTime` datetime NOT NULL,
  `exitTime` datetime DEFAULT NULL,
  `price` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carId` (`carId`),
  CONSTRAINT `carId` FOREIGN KEY (`carId`) REFERENCES `car` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

