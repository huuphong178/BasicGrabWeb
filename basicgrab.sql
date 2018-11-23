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

 Date: 23/11/2018 23:57:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
-- Table structure for driver
-- ----------------------------
DROP TABLE IF EXISTS `driver`;
CREATE TABLE `driver`  (
  `id` bigint(13) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `bike_id` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `bike_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1542892714539 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for manager
-- ----------------------------
DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager`  (
  `id` bigint(13) NOT NULL,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` int(10) NOT NULL DEFAULT 0 COMMENT '0: ranh\n1: ban',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username_UNIQUE`(`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'Bảng định vị' ROW_FORMAT = Dynamic;

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
-- Table structure for requestqueue
-- ----------------------------
DROP TABLE IF EXISTS `requestqueue`;
CREATE TABLE `requestqueue`  (
  `id` bigint(13) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0: chưa được gửi\\n1: Đã gửi',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_refreshtoken
-- ----------------------------
DROP TABLE IF EXISTS `user_refreshtoken`;
CREATE TABLE `user_refreshtoken`  (
  `id` bigint(13) NOT NULL,
  `rfToken` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `rdt` datetime(6) NULL DEFAULT NULL,
  `roleid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
