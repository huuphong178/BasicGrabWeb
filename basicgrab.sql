/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 80011
 Source Host           : localhost:3306
 Source Schema         : basicgrab

 Target Server Type    : MySQL
 Target Server Version : 80011
 File Encoding         : 65001

 Date: 17/11/2018 15:33:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` bigint(13) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for blacklist
-- ----------------------------
DROP TABLE IF EXISTS `blacklist`;
CREATE TABLE `blacklist`  (
  `id_driver` bigint(13) NOT NULL,
  `id_request` bigint(13) NOT NULL,
  PRIMARY KEY (`id_driver`, `id_request`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of blacklist
-- ----------------------------
INSERT INTO `blacklist` VALUES (123, 12);
INSERT INTO `blacklist` VALUES (1231231321, 12);
INSERT INTO `blacklist` VALUES (1540709441669, 12);

-- ----------------------------
-- Table structure for currentdriver
-- ----------------------------
DROP TABLE IF EXISTS `currentdriver`;
CREATE TABLE `currentdriver`  (
  `id_driver` bigint(13) NOT NULL,
  `status` int(10) NULL DEFAULT NULL COMMENT '1. Ready, 2.Standby, 3.driving',
  `location_X` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `location_Y` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_driver`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of currentdriver
-- ----------------------------
INSERT INTO `currentdriver` VALUES (123, 2, '10.7624176', '106.68119679999995');
INSERT INTO `currentdriver` VALUES (1231231321, 2, '10.7624176', '106.68119679999995');
INSERT INTO `currentdriver` VALUES (1540709441669, 2, '10.762217133274179', '106.67885671308363');

-- ----------------------------
-- Table structure for driver
-- ----------------------------
DROP TABLE IF EXISTS `driver`;
CREATE TABLE `driver`  (
  `id` bigint(13) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `bike_id` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `bike_type` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`, `username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1540709441667 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of driver
-- ----------------------------
INSERT INTO `driver` VALUES (2, 'Nam', NULL, NULL, NULL, NULL, '2', '555');
INSERT INTO `driver` VALUES (52424, 'a', NULL, NULL, NULL, NULL, '2222', '44');
INSERT INTO `driver` VALUES (1540699597522, 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined');
INSERT INTO `driver` VALUES (1540699643198, 'Phong', '123456789', 'Q.10', '77C1-12345', 'Suzuki', 'namlv1', '123456');
INSERT INTO `driver` VALUES (1540709316878, 'Phong', '123456789', 'Q.10', '77C1-12345', 'Suzuki', 'huuphong1', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `driver` VALUES (1540709441667, 'Phong', '123456789', 'Q.10', '77C1-12345', 'Suzuki', 'huuphong', 'e10adc3949ba59abbe56e057f20f883e');

-- ----------------------------
-- Table structure for request
-- ----------------------------
DROP TABLE IF EXISTS `request`;
CREATE TABLE `request`  (
  `id` bigint(13) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` int(10) NULL DEFAULT NULL,
  `location_x` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `location_y` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `driver_id` bigint(13) NULL DEFAULT NULL,
  `locator` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of request
-- ----------------------------
INSERT INTO `request` VALUES (1540697644706, 'huu phong', '0123456789', 'quan 11', 'abc', 2, '10.7624176', '106.68119679999995', NULL, 'namle');
INSERT INTO `request` VALUES (1541308203159, 'huu phong', '0123456789', 'quan 11', 'abc', 2, '10.7624176', '106.68119679999995', NULL, 'namle');
INSERT INTO `request` VALUES (1541308266561, 'huu phong', '0123456789', 'quan 11', 'abc', 2, '10.7624176', '106.68119679999995', NULL, 'namle');

-- ----------------------------
-- Table structure for user_refreshtoken
-- ----------------------------
DROP TABLE IF EXISTS `user_refreshtoken`;
CREATE TABLE `user_refreshtoken`  (
  `id` bigint(13) NOT NULL,
  `rfToken` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `rdt` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_refreshtoken
-- ----------------------------
INSERT INTO `user_refreshtoken` VALUES (1540709441667, 'JIKbznHcpUwMGon0ZgUjcHvSZ8TTAV7T5FmAKeD5Zip74Cs90lyqaeqg10IXQH9csdElZyOGPducNfIgvpowN6xz7zdjtrj3sz1g', '2018-10-29 19:33:30.000000');

SET FOREIGN_KEY_CHECKS = 1;
