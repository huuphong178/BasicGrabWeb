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

 Date: 28/10/2018 13:33:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
INSERT INTO `currentdriver` VALUES (2, 2, '10', '450');
INSERT INTO `currentdriver` VALUES (1540699597522, 2, NULL, NULL);
INSERT INTO `currentdriver` VALUES (1540699643198, 2, NULL, NULL);
INSERT INTO `currentdriver` VALUES (1540707041764, 2, NULL, NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 1540699597523 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of driver
-- ----------------------------
INSERT INTO `driver` VALUES (2, 'Nam', NULL, NULL, NULL, NULL, '2', '555');
INSERT INTO `driver` VALUES (52424, 'a', NULL, NULL, NULL, NULL, '2222', '44');
INSERT INTO `driver` VALUES (1540699597522, 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined');
INSERT INTO `driver` VALUES (1540699643198, 'Phong', '123456789', 'Q.10', '77C1-12345', 'Suzuki', 'namlv1', '123456');
INSERT INTO `driver` VALUES (1540707041764, 'Phong', '123456789', 'Q.10', '77C1-12345', 'Suzuki', 'huuphong', 'd41d8cd98f00b204e9800998ecf8427e');

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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of request
-- ----------------------------
INSERT INTO `request` VALUES (1540697644706, 'phong', '0123456789', 'quan 15', 'abc', 2, '12', '12', 2);
INSERT INTO `request` VALUES (1540697645101, 'phong', '0123456789', 'quan 15', 'abc', NULL, NULL, NULL, NULL);
INSERT INTO `request` VALUES (1540697645395, 'phong', '0123456789', 'quan 15', 'abc', NULL, NULL, NULL, NULL);
INSERT INTO `request` VALUES (1540697645708, 'phong', '0123456789', 'quan 15', 'abc', NULL, NULL, NULL, NULL);
INSERT INTO `request` VALUES (1540697646040, 'phong', '0123456789', 'quan 15', 'abc', NULL, NULL, NULL, NULL);
INSERT INTO `request` VALUES (1540697646324, 'phong', '0123456789', 'quan 15', 'abc', NULL, NULL, NULL, NULL);
INSERT INTO `request` VALUES (1540697646637, 'phong', '0123456789', 'quan 15', 'abc', NULL, NULL, NULL, NULL);
INSERT INTO `request` VALUES (1540697646937, 'phong', '0123456789', 'quan 15', 'abc', NULL, NULL, NULL, NULL);
INSERT INTO `request` VALUES (1540697647227, 'phong', '0123456789', 'quan 15', 'abc', NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for user-refreshtoken
-- ----------------------------
DROP TABLE IF EXISTS `user-refreshtoken`;
CREATE TABLE `user-refreshtoken`  (
  `id` bigint(13) NOT NULL,
  `frToken` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `rdt` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
