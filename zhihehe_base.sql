/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80026
 Source Host           : localhost:3306
 Source Schema         : zhi

 Target Server Type    : MySQL
 Target Server Version : 80026
 File Encoding         : 65001

 Date: 07/02/2022 14:40:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account_recharge
-- ----------------------------
DROP TABLE IF EXISTS `account_recharge`;
CREATE TABLE `account_recharge` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` decimal(10,2) DEFAULT NULL COMMENT '要充值的钱',
  `pay_price` decimal(10,2) DEFAULT NULL COMMENT '实际支付的金额',
  `status` tinyint DEFAULT NULL COMMENT '0为删除，1为禁用，2为上线',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of account_recharge
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `des` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `html` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `img_urls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `uid` int DEFAULT NULL COMMENT '发布用户',
  `status` int DEFAULT '10' COMMENT '0为删除，20为正常，10为审核中，5为审核未通过，6为下架',
  `product_id` int DEFAULT NULL COMMENT '产品id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of article
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for article_draft
-- ----------------------------
DROP TABLE IF EXISTS `article_draft`;
CREATE TABLE `article_draft` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `article_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `article_des` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `article_html` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `article_img_urls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` int DEFAULT '8' COMMENT '8草稿，10审核中，5审核未通过',
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '审核未通过原因',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `product_draft_id` int DEFAULT NULL,
  `online_article_id` int DEFAULT NULL COMMENT '线上的文章id，编辑用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of article_draft
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `img_urls` varchar(255) DEFAULT NULL COMMENT '图片评论的列表',
  `video_url` varchar(255) DEFAULT NULL COMMENT '视频评论地址',
  `content` varchar(255) DEFAULT NULL,
  `star` tinyint(1) DEFAULT '5' COMMENT '评论的星，1到5个',
  `status` tinyint(1) DEFAULT '1' COMMENT '0删除，1审核中，2通过',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid_pid` (`uid`,`product_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of comment
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for feedback
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `uid` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of feedback
-- ----------------------------
BEGIN;
INSERT INTO `feedback` VALUES (1, '545dfdfgrerdfg', '2021-09-10 11:59:31', '2021-09-10 11:59:31', NULL);
INSERT INTO `feedback` VALUES (2, 'sdfasdfa', '2021-09-10 11:59:46', '2021-09-10 11:59:46', NULL);
INSERT INTO `feedback` VALUES (3, '54sdf在基地asdf苛夺asdf ', '2022-02-06 17:14:23', '2022-02-06 17:14:23', NULL);
COMMIT;

-- ----------------------------
-- Table structure for gift_picked
-- ----------------------------
DROP TABLE IF EXISTS `gift_picked`;
CREATE TABLE `gift_picked` (
  `id` int NOT NULL AUTO_INCREMENT,
  `article_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT '商品名，',
  `des` varchar(255) DEFAULT NULL,
  `cover_url` varchar(255) DEFAULT NULL COMMENT '商品图片，一张',
  `uid` int DEFAULT NULL COMMENT '收礼人的uid',
  `phone` varchar(255) DEFAULT NULL COMMENT '收件人电话',
  `name` varchar(255) DEFAULT NULL COMMENT '收件人名',
  `address` varchar(255) DEFAULT NULL COMMENT '收件人地址',
  `gift_trade_status` tinyint DEFAULT NULL COMMENT '收礼状态，\n5：待付款\n8: 待确认发货\n10：待发货\n\n15：待收货\n20：已完成',
  `status` int DEFAULT '2' COMMENT '0为删除，2为正常',
  `quantity` int DEFAULT '1' COMMENT '收礼的数量，一般为1',
  `price` decimal(10,2) DEFAULT NULL COMMENT '下单时的单价',
  `total_price` decimal(10,2) DEFAULT NULL COMMENT '总价',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `business_uid` int DEFAULT NULL COMMENT '发货商家用户id',
  `express_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '快递号',
  `province` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `addr` varchar(255) DEFAULT NULL,
  `gift_trade_id` int DEFAULT NULL COMMENT '礼物的订单号，看是哪个礼物的单',
  `verify_phone` varchar(15) DEFAULT NULL COMMENT '收取礼物时，验证的手机号',
  `picked_no` varchar(32) DEFAULT NULL COMMENT '收取礼物的单号，唯一，目前用于收取快递',
  PRIMARY KEY (`id`),
  UNIQUE KEY `picked_no` (`picked_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of gift_picked
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for gift_theme
-- ----------------------------
DROP TABLE IF EXISTS `gift_theme`;
CREATE TABLE `gift_theme` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '主题名称',
  `bg_image` varchar(255) DEFAULT NULL COMMENT '背景图片',
  `share_image` varchar(255) DEFAULT NULL COMMENT '小程序转发图片',
  `message` varchar(255) DEFAULT NULL COMMENT '留言，贺词',
  `status` tinyint DEFAULT '2' COMMENT '0删除，2正常，1为下线',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of gift_theme
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for gift_trade
-- ----------------------------
DROP TABLE IF EXISTS `gift_trade`;
CREATE TABLE `gift_trade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `article_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT '商品名，',
  `des` varchar(255) DEFAULT NULL,
  `cover_url` varchar(255) DEFAULT NULL COMMENT '商品图片，一张',
  `uid` int DEFAULT NULL COMMENT '下单人的',
  `trade_status` int DEFAULT NULL COMMENT '订单状态，\n1：已退款\n3：已取消\n5：待付款\n10：待发货\n12：待揽收\n15：待收货\n20：已完成\n25: 待领取\n30: 已领完',
  `status` int DEFAULT '2' COMMENT '0为删除，2为正常',
  `quantity` int DEFAULT NULL COMMENT '购买的数量',
  `price` decimal(10,2) DEFAULT NULL COMMENT '下单时的单价',
  `total_price` decimal(10,2) DEFAULT NULL COMMENT '总价',
  `trade_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '订单号，对订单唯一',
  `transaction_id` varchar(255) DEFAULT NULL COMMENT '微信的订单号',
  `trade_type` varchar(255) DEFAULT NULL COMMENT '支付方式',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `business_uid` int DEFAULT NULL COMMENT '发货商家用户id',
  `sale_uid` int DEFAULT NULL COMMENT '销售uid',
  `f_sale_uid` int DEFAULT NULL COMMENT '父级销售uid',
  `cost` decimal(10,2) DEFAULT NULL,
  `sale_cost` decimal(10,2) DEFAULT NULL,
  `f_sale_cost` decimal(10,2) DEFAULT NULL,
  `picked_phone` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '收礼人的手机列表，没有，则表示不限制收礼人',
  `remain_quantity` int DEFAULT NULL COMMENT '剩余数量',
  `gift_theme_id` int DEFAULT NULL,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '祝福语',
  PRIMARY KEY (`id`),
  UNIQUE KEY `trade_no` (`trade_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of gift_trade
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `uid` int DEFAULT NULL,
  `img_urls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `des` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL COMMENT '售价',
  `quantity` int NOT NULL DEFAULT '100',
  `status` int DEFAULT '10' COMMENT '0删除，20正常，15下架，10审核中，5未通过，6为下架',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL COMMENT '成本价',
  `sale_cost` decimal(10,2) DEFAULT NULL COMMENT '销售分成',
  `f_sale_cost` decimal(10,2) DEFAULT NULL COMMENT '总销售分成',
  `name` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `addr` varchar(255) DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `space_x` int DEFAULT NULL,
  `space_y` int DEFAULT NULL,
  `space_z` int DEFAULT NULL,
  `cat_id` int DEFAULT NULL,
  `can_gift` tinyint(1) DEFAULT '0',
  `can_group` tinyint(1) DEFAULT '0',
  `group_end` datetime DEFAULT NULL COMMENT '团购截止时间',
  `group_price` decimal(10,2) DEFAULT NULL COMMENT '团购价格',
  `group_quantity` int DEFAULT NULL COMMENT '团购量',
  `group_cost` decimal(10,2) DEFAULT NULL COMMENT '团购成本',
  `group_sale_cost` decimal(10,2) DEFAULT NULL COMMENT '团购分成',
  `group_f_sale_cost` decimal(10,2) DEFAULT NULL COMMENT '团购总销售分成',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of product
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for product_draft
-- ----------------------------
DROP TABLE IF EXISTS `product_draft`;
CREATE TABLE `product_draft` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `product_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `product_img_urls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `product_des` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `product_price` decimal(10,2) DEFAULT NULL,
  `product_quantity` int DEFAULT '0',
  `status` int DEFAULT '8' COMMENT '8为草稿，10审核中，5审核未通过\r\n目前默认为8，',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `product_cost` decimal(10,2) DEFAULT NULL,
  `product_sale_cost` decimal(10,2) DEFAULT NULL,
  `product_f_sale_cost` decimal(10,2) DEFAULT NULL,
  `online_product_id` int DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL COMMENT '寄件人',
  `product_mobile` varchar(255) DEFAULT NULL,
  `product_company` varchar(255) DEFAULT NULL,
  `product_province` varchar(255) DEFAULT NULL,
  `product_city` varchar(255) DEFAULT NULL,
  `product_area` varchar(255) DEFAULT NULL,
  `product_addr` varchar(255) DEFAULT NULL,
  `product_weight` double DEFAULT NULL,
  `product_space_x` int DEFAULT NULL,
  `product_space_y` int DEFAULT NULL,
  `product_space_z` int DEFAULT NULL,
  `product_cat_id` int DEFAULT NULL,
  `product_can_gift` tinyint(1) DEFAULT '0',
  `product_can_group` tinyint(1) DEFAULT '0',
  `product_group_end` datetime DEFAULT NULL,
  `product_group_price` decimal(10,2) DEFAULT NULL,
  `product_group_quantity` int DEFAULT NULL,
  `product_group_cost` decimal(10,2) DEFAULT NULL,
  `product_group_sale_cost` decimal(10,2) DEFAULT NULL,
  `product_group_f_sale_cost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of product_draft
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sale_rela
-- ----------------------------
DROP TABLE IF EXISTS `sale_rela`;
CREATE TABLE `sale_rela` (
  `id` int NOT NULL AUTO_INCREMENT,
  `f_sale_uid` int DEFAULT NULL,
  `sale_uid` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `status` tinyint DEFAULT '1' COMMENT '1为审核中，2为正常',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sale_uid` (`sale_uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sale_rela
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sale_user_rela
-- ----------------------------
DROP TABLE IF EXISTS `sale_user_rela`;
CREATE TABLE `sale_user_rela` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sale_uid` int DEFAULT NULL,
  `uid` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sale_user_rela
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for share_money
-- ----------------------------
DROP TABLE IF EXISTS `share_money`;
CREATE TABLE `share_money` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` varchar(255) DEFAULT NULL,
  `out_order_no` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `account` varchar(255) DEFAULT NULL,
  `amount` decimal(12,0) DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `detail_id` varchar(255) DEFAULT NULL,
  `finish_at` datetime DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `share_status` int DEFAULT '1' COMMENT '分成状态，0为失败，1为分成中，2为成功',
  `status` int DEFAULT '2' COMMENT '0删除，2正常',
  `is_group` tinyint(1) DEFAULT '0' COMMENT '是否是团购',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of share_money
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for shop_cart
-- ----------------------------
DROP TABLE IF EXISTS `shop_cart`;
CREATE TABLE `shop_cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `pid` int DEFAULT NULL,
  `count` int DEFAULT '1' COMMENT '购买的数量',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_select` tinyint(1) DEFAULT '1',
  `fuid` int DEFAULT NULL COMMENT '哪个用户转发的，可能是销售，可能没转发',
  `aid` int DEFAULT NULL COMMENT '文章的id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of shop_cart
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_banner
-- ----------------------------
DROP TABLE IF EXISTS `sys_banner`;
CREATE TABLE `sys_banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img_urls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT 'banner图片链接',
  `path_urls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT 'banner跳转地址',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '名称',
  `page` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '对应的页面url',
  `color` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'banner主色',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_banner
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_constants
-- ----------------------------
DROP TABLE IF EXISTS `sys_constants`;
CREATE TABLE `sys_constants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT '2' COMMENT '0, 2',
  `description` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_constants
-- ----------------------------
BEGIN;
INSERT INTO `sys_constants` VALUES (1, 'PRICE_PERCENT', '1.00', 2, '发布/更新商品时的定价百分比，超出1.00的部分为平台所得。', '定价百分比');
COMMIT;

-- ----------------------------
-- Table structure for sys_paths
-- ----------------------------
DROP TABLE IF EXISTS `sys_paths`;
CREATE TABLE `sys_paths` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sub_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sub_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `icon_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '父模块的图标',
  `type` int DEFAULT '1' COMMENT '1为父模块，2为子模块',
  `uni_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用来保证唯一性，type和name或sub_name的组合',
  `sort_num` int DEFAULT '10' COMMENT '排序，越大显示在越后面。',
  PRIMARY KEY (`id`,`uni_key`) USING BTREE,
  UNIQUE KEY `uni_key` (`uni_key`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_paths
-- ----------------------------
BEGIN;
INSERT INTO `sys_paths` VALUES (1, '系统管理', NULL, 'system', NULL, 'BulbOutlined', 1, 'system_1', 90);
INSERT INTO `sys_paths` VALUES (2, NULL, '页面管理', 'system', 'system/paths', NULL, 2, 'system/paths_2', 98);
INSERT INTO `sys_paths` VALUES (11, NULL, '用户授权', 'system', 'system/authority', NULL, 2, 'system/authority_2', 97);
INSERT INTO `sys_paths` VALUES (22, '常用配置', NULL, 'commonConfig', NULL, 'AppstoreOutlined', 1, 'commonConfig_1', 80);
INSERT INTO `sys_paths` VALUES (23, NULL, 'Banner管理', 'commonConfig', 'commonConfig/banner', NULL, 2, 'commonConfig/banner_2', 81);
INSERT INTO `sys_paths` VALUES (24, NULL, '角色管理', 'system', 'system/role', NULL, 2, 'system/role_2', 94);
INSERT INTO `sys_paths` VALUES (25, '商品管理', NULL, 'articleInfo', NULL, 'FileSyncOutlined', 1, 'articleInfo_1', 50);
INSERT INTO `sys_paths` VALUES (26, NULL, '商品审核', 'articleInfo', 'articleInfo/ArticleList', NULL, 2, 'articleInfo/ArticleList_2', 51);
INSERT INTO `sys_paths` VALUES (27, '订单管理', NULL, 'trade', NULL, 'PayCircleOutlined', 1, 'trade_1', 50);
INSERT INTO `sys_paths` VALUES (28, NULL, '订单列表', 'trade', 'trade/TradeList', NULL, 2, 'trade/TradeList_2', 51);
INSERT INTO `sys_paths` VALUES (29, NULL, '分成列表', 'trade', 'trade/ShareList', NULL, 2, 'trade/ShareList_2', 1);
INSERT INTO `sys_paths` VALUES (30, '用户管理', NULL, 'users', NULL, 'TeamOutlined', 1, 'users_1', 70);
INSERT INTO `sys_paths` VALUES (31, NULL, '普通用户', 'users', 'users/UsersList', NULL, 2, 'users/UsersList_2', 71);
INSERT INTO `sys_paths` VALUES (32, NULL, '报价员', 'users', 'users/Quoter', NULL, 2, 'users/Quoter_2', 73);
INSERT INTO `sys_paths` VALUES (33, NULL, '总销售员', 'users', 'users/FSaleList', NULL, 2, 'users/FSaleList_2', 74);
INSERT INTO `sys_paths` VALUES (34, NULL, '销售员', 'users', 'users/SaleList', NULL, 2, 'users/SaleList_2', 76);
INSERT INTO `sys_paths` VALUES (35, NULL, '商品分类', 'commonConfig', 'commonConfig/ProductCat', NULL, 2, 'commonConfig/ProductCat_2', 86);
INSERT INTO `sys_paths` VALUES (36, NULL, '礼物列表', 'trade', 'trade/GiftList', NULL, 2, 'trade/GiftList_2', 46);
INSERT INTO `sys_paths` VALUES (37, NULL, '领取列表', 'trade', 'trade/PickedList', NULL, 2, 'trade/PickedList_2', 44);
INSERT INTO `sys_paths` VALUES (38, NULL, '贺卡配置', 'commonConfig', 'commonConfig/GiftTheme', NULL, 2, 'commonConfig/GiftTheme_2', 11);
INSERT INTO `sys_paths` VALUES (39, NULL, '参数设置', 'system', 'system/Constants', NULL, 2, 'system/Constants_2', 89);
INSERT INTO `sys_paths` VALUES (40, NULL, '我的商品', 'articleInfo', 'articleInfo/MyArticles', NULL, 2, 'articleInfo/MyArticles_2', 35);
INSERT INTO `sys_paths` VALUES (41, NULL, '充值价格', 'commonConfig', 'commonConfig/RechargeList', NULL, 2, 'commonConfig/RechargeList_2', 51);
INSERT INTO `sys_paths` VALUES (42, NULL, '商品评价', 'articleInfo', 'articleInfo/Comment', NULL, 2, 'articleInfo/Comment_2', 51);
INSERT INTO `sys_paths` VALUES (43, NULL, '意见反馈', 'users', 'users/FeedBack', NULL, 2, 'users/FeedBack_2', 51);
COMMIT;

-- ----------------------------
-- Table structure for sys_product_cat
-- ----------------------------
DROP TABLE IF EXISTS `sys_product_cat`;
CREATE TABLE `sys_product_cat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rank_num` int DEFAULT '50',
  `status` tinyint DEFAULT '2',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_product_cat
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '角色名',
  `identifier` int NOT NULL COMMENT '角色唯一代号',
  `status` int DEFAULT '2' COMMENT '0为删除，2为正常',
  `api_paths` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '角色可以调用的接口',
  PRIMARY KEY (`id`,`identifier`,`name`) USING BTREE,
  UNIQUE KEY `identifier` (`identifier`) USING BTREE,
  UNIQUE KEY `name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` VALUES (5, '报价员', 1200, 2, '/zhihehe/product/price/percent,/zhihehe/product/add,/zhihehe/product,/zhihehe/article/add,/zhihehe/article/change/sale,/zhihehe/article/edit_init,/zhihehe/article,/zhihehe/article/busi_list');
INSERT INTO `sys_role` VALUES (6, '销售', 1000, 2, '/zhihehe/sale/saler/user_list,/zhihehe/sale/sale_money,/common/sale_wxcode,/common/sale/product_wxcode');
INSERT INTO `sys_role` VALUES (12, '总销售', 1006, 2, '/zhihehe/sale/leader/saler_list,/zhihehe/sale/sale_money,/zhihehe/sale/join/check,/common/fsale_wxcode,/common/sale/product_wxcode');
COMMIT;

-- ----------------------------
-- Table structure for trade
-- ----------------------------
DROP TABLE IF EXISTS `trade`;
CREATE TABLE `trade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `article_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT '商品名，',
  `des` varchar(255) DEFAULT NULL,
  `cover_url` varchar(255) DEFAULT NULL COMMENT '商品图片，一张',
  `uid` int DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL COMMENT '收件人电话',
  `name` varchar(255) DEFAULT NULL COMMENT '收件人名',
  `address` varchar(255) DEFAULT NULL COMMENT '收件人地址',
  `trade_status` int DEFAULT NULL COMMENT '订单状态，\n1：已退款\n3：已取消\n5：待付款\n10：待发货\n12：待揽收\n15：待收货\n20：已完成',
  `status` int DEFAULT '2' COMMENT '0为删除，2为正常',
  `quantity` int DEFAULT NULL COMMENT '购买的数量',
  `price` decimal(10,2) DEFAULT NULL COMMENT '下单时的单价',
  `total_price` decimal(10,2) DEFAULT NULL COMMENT '总价',
  `trade_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '订单号，对订单唯一',
  `transaction_id` varchar(255) DEFAULT NULL COMMENT '微信的订单号',
  `trade_type` varchar(255) DEFAULT NULL COMMENT '支付方式',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `business_uid` int DEFAULT NULL COMMENT '发货商家用户id',
  `express_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '快递号',
  `sale_uid` int DEFAULT NULL COMMENT '销售uid',
  `f_sale_uid` int DEFAULT NULL COMMENT '父级销售uid',
  `cost` decimal(10,2) DEFAULT NULL,
  `sale_cost` decimal(10,2) DEFAULT NULL,
  `f_sale_cost` decimal(10,2) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `addr` varchar(255) DEFAULT NULL,
  `is_group` tinyint(1) DEFAULT '0' COMMENT '是否为团购订单',
  PRIMARY KEY (`id`),
  UNIQUE KEY `trade_no` (`trade_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of trade
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` int DEFAULT '0',
  `language` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `openid` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `unionid` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `phone` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `authority` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '用户权限，对应paths表的id',
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '用户角色编号，以都好分开',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `phone` (`phone`) USING BTREE,
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1, 'admin', 0, NULL, NULL, NULL, NULL, NULL, 'FUMFBavsauwWaFa79a2ejXsET-email', NULL, '2021-08-17 14:20:38', '2021-08-17 14:20:41', NULL, 'admin@admin', '$2a$10$D.xuqjr3hkc6Fe75KNC2/.ZzVn4y8fyGiAlaKfdGgtJrlpgpxxhPm', 'system/authority,system/paths,system/role,articleInfo/ArticleList,trade/TradeList,trade/ShareList,users/UsersList,users/Quoter,users/FSaleList,users/SaleList,trade/GiftList,trade/PickedList,commonConfig/GiftTheme,commonConfig/banner,commonConfig/ProductCat,system/Constants,articleInfo/MyArticles,commonConfig/RechargeList,articleInfo/Comment,users/FeedBack', '');
COMMIT;

-- ----------------------------
-- Table structure for users_account
-- ----------------------------
DROP TABLE IF EXISTS `users_account`;
CREATE TABLE `users_account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of users_account
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for users_account_record
-- ----------------------------
DROP TABLE IF EXISTS `users_account_record`;
CREATE TABLE `users_account_record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_account_id` int DEFAULT NULL,
  `uid` int DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL COMMENT '内容描述',
  `change_balance` decimal(10,2) NOT NULL COMMENT '变化的金额',
  `obj` varchar(255) DEFAULT NULL COMMENT '其他补充信息',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `type` tinyint DEFAULT NULL COMMENT '类型\n1：购买商品消费\n2：购买礼物消费\n\n11：用户充值\n12：未领取的礼物的自动退款',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of users_account_record
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for users_history_avatar
-- ----------------------------
DROP TABLE IF EXISTS `users_history_avatar`;
CREATE TABLE `users_history_avatar` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uid` bigint DEFAULT NULL,
  `img_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `用户id` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of users_history_avatar
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for wait_paid
-- ----------------------------
DROP TABLE IF EXISTS `wait_paid`;
CREATE TABLE `wait_paid` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sign_type` varchar(255) DEFAULT NULL,
  `pay_sign` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `package` varchar(255) DEFAULT NULL,
  `nonce_str` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `time_stamp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `uid` int DEFAULT NULL,
  `trade_id` int NOT NULL,
  `status` tinyint DEFAULT '2',
  PRIMARY KEY (`id`,`trade_id`) USING BTREE,
  UNIQUE KEY `trade_id` (`trade_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of wait_paid
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
