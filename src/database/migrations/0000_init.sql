CREATE TABLE `launchbox_game_alternate_names` (
	`alternate_name` text,
	`compact_name` text,
	`database_id` integer,
	`id` text PRIMARY KEY NOT NULL,
	`region` text
);
--> statement-breakpoint
CREATE INDEX `idx_launchbox_game_alternate_names` ON `launchbox_game_alternate_names` (`alternate_name`,`compact_name`,`database_id`);--> statement-breakpoint
CREATE TABLE `launchbox_games` (
	`community_rating` real,
	`community_rating_count` integer,
	`compact_name` text NOT NULL,
	`cooperative` integer,
	`database_id` integer PRIMARY KEY NOT NULL,
	`developer` text,
	`dos` text,
	`esrb` text,
	`genres` text,
	`goodcodes_base_compact_name` text NOT NULL,
	`max_players` integer,
	`name` text NOT NULL,
	`overview` text,
	`platform` text,
	`publisher` text,
	`release_date` integer,
	`release_type` text,
	`release_year` text,
	`setup_file` text,
	`setup_md5` text,
	`startup_file` text,
	`startup_md5` text,
	`startup_parameters` text,
	`steam_app_id` text,
	`video_url` text,
	`wikipedia_url` text
);
--> statement-breakpoint
CREATE INDEX `idx_launchbox_games_compact_name_platform` ON `launchbox_games` (`compact_name`,`platform`);--> statement-breakpoint
CREATE INDEX `idx_launchbox_games_goodcodes_base_compact_name_platform` ON `launchbox_games` (`goodcodes_base_compact_name`,`platform`);--> statement-breakpoint
CREATE INDEX `idx_launchbox_games_platform` ON `launchbox_games` (`platform`);--> statement-breakpoint
CREATE TABLE `launchbox_platform_alternate_names` (
	`alternate` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE INDEX `idx_launchbox_platform_alternate_names` ON `launchbox_platform_alternate_names` (`alternate`,`name`);--> statement-breakpoint
CREATE TABLE `launchbox_platforms` (
	`category` text,
	`cpu` text,
	`developer` text,
	`display` text,
	`emulated` integer,
	`graphics` text,
	`manufacturer` text,
	`max_controllers` text,
	`media` text,
	`memory` text,
	`name` text PRIMARY KEY NOT NULL,
	`notes` text,
	`release_date` integer,
	`sound` text,
	`use_mame_files` integer
);
--> statement-breakpoint
CREATE INDEX `idx_launchbox_platforms` ON `launchbox_platforms` (`name`);--> statement-breakpoint
CREATE TABLE `libretro_games` (
	`compact_name` text NOT NULL,
	`crc` text,
	`description` text,
	`developer` text,
	`esrb_rating` text,
	`franchise` text,
	`genre` text,
	`goodcodes_base_compact_name` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`md5` text,
	`name` text,
	`origin` text,
	`platform` text,
	`publisher` text,
	`releasemonth` integer,
	`releaseyear` integer,
	`rom_name` text,
	`sha1` text,
	`size` integer,
	`users` integer
);
--> statement-breakpoint
CREATE INDEX `idx_libretro_game` ON `libretro_games` (`name`,`goodcodes_base_compact_name`,`md5`,`compact_name`,`platform`,`rom_name`);