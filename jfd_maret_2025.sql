/*
 Navicat Premium Data Transfer

 Source Server         : localhost_mysql
 Source Server Type    : MySQL
 Source Server Version : 100421
 Source Host           : localhost:3306
 Source Schema         : jfd_maret_2025

 Target Server Type    : MySQL
 Target Server Version : 100421
 File Encoding         : 65001

 Date: 16/06/2025 13:32:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for agama
-- ----------------------------
DROP TABLE IF EXISTS `agama`;
CREATE TABLE `agama`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of agama
-- ----------------------------
INSERT INTO `agama` VALUES (1, 'Islam');
INSERT INTO `agama` VALUES (2, 'Kristen');
INSERT INTO `agama` VALUES (3, 'Katolik');
INSERT INTO `agama` VALUES (4, 'Budha');
INSERT INTO `agama` VALUES (5, 'Hindu');
INSERT INTO `agama` VALUES (6, 'Konghucu');

-- ----------------------------
-- Table structure for departemen
-- ----------------------------
DROP TABLE IF EXISTS `departemen`;
CREATE TABLE `departemen`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `singkatan` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of departemen
-- ----------------------------
INSERT INTO `departemen` VALUES (1, 'Information Technology', 'IT');
INSERT INTO `departemen` VALUES (2, 'Human Resources', 'HR');
INSERT INTO `departemen` VALUES (3, 'Finance', 'FIN');
INSERT INTO `departemen` VALUES (4, 'Marketing', 'MKT');
INSERT INTO `departemen` VALUES (5, 'Logistik', 'LOG');

-- ----------------------------
-- Table structure for karyawan
-- ----------------------------
DROP TABLE IF EXISTS `karyawan`;
CREATE TABLE `karyawan`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gender` enum('L','P') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `foto` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `alamat` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `nip` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `tanggal_lahir` date NOT NULL,
  `nomor_telp` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `departemen_id` int NULL DEFAULT NULL,
  `agama_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of karyawan
-- ----------------------------
INSERT INTO `karyawan` VALUES (1, 'Aji Kowiyu Uzumaki', 'L', 'Aji Kowiyu Uzumaki-tb-129-250526_211318.png', 'Pluit Dalam, Penjaringan, Jakarta Utara, 14440', 'tb-129', '2024-12-31', '0891829182', 3, 1);
INSERT INTO `karyawan` VALUES (2, 'Sakura Haruno', 'P', NULL, 'Konoha Timur', '019283', '1899-11-30', '021989898', 4, 3);
INSERT INTO `karyawan` VALUES (3, 'Sasuke Uchiha Madara', 'L', 'Sasuke Uchiha Madara-874-250526_211740.jpg', 'Konoha', '874', '1899-11-30', '', 1, 5);
INSERT INTO `karyawan` VALUES (4, 'Naruto Uzumaki', 'L', 'Naruto Uzumaki-987-250526_211811.png', 'Konoha', '987', '0000-00-00', NULL, 1, NULL);
INSERT INTO `karyawan` VALUES (5, 'Kakashi Hatake', 'L', 'Kakashi Hatake-098-250526_211840.jpg', 'Konoha', '098', '1899-11-30', '', 2, 4);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `id_karyawan` int NULL DEFAULT NULL,
  `role` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  `created_by` int NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL,
  `updated_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'aji.kowiyu', '$2y$10$7reu0PDYmvYAj8Jot0SPyefOpBsNjmCXpmDPiFSCAD8x2YYF4Z.Xu', NULL, NULL, NULL, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
