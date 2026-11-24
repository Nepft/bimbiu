CREATE TABLE `users` (
	`id` char(36) NOT NULL,
	`google_sub` varchar(120) NOT NULL,
	`display_name` varchar(60) NOT NULL,
	`avatar_key` varchar(80) NOT NULL DEFAULT 'R1',
	`onboarding_completed` boolean NOT NULL DEFAULT false,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`created_at` datetime(3) NOT NULL,
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_users_google_sub` UNIQUE(`google_sub`)
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`token_hash` char(64) NOT NULL,
	`expires_at` datetime(3) NOT NULL,
	`last_seen_at` datetime(3),
	`created_at` datetime(3) NOT NULL,
	CONSTRAINT `user_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_user_sessions_token_hash` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`lesson_id` varchar(100) NOT NULL,
	`content_version` varchar(30) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'in_progress',
	`total_questions` int NOT NULL,
	`correct_answers` int NOT NULL DEFAULT 0,
	`score` int,
	`xp_awarded` int NOT NULL DEFAULT 0,
	`idempotency_key` char(36) NOT NULL,
	`started_at` datetime(3) NOT NULL,
	`completed_at` datetime(3),
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_quiz_attempts_idempotency` UNIQUE(`idempotency_key`)
);
--> statement-breakpoint
CREATE TABLE `attempt_answers` (
	`id` char(36) NOT NULL,
	`attempt_id` char(36) NOT NULL,
	`question_id` varchar(100) NOT NULL,
	`submitted_answer` json NOT NULL,
	`question_snapshot` json NOT NULL,
	`is_correct` boolean NOT NULL,
	`answered_at` datetime(3) NOT NULL,
	CONSTRAINT `attempt_answers_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_attempt_answers_attempt_question` UNIQUE(`attempt_id`,`question_id`)
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`lesson_id` varchar(100) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'not_started',
	`best_score` int NOT NULL DEFAULT 0,
	`attempts_count` int NOT NULL DEFAULT 0,
	`first_completed_at` datetime(3),
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `lesson_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_lesson_progress_user_lesson` UNIQUE(`user_id`,`lesson_id`)
);
--> statement-breakpoint
CREATE TABLE `xp_transactions` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`source_type` varchar(30) NOT NULL,
	`source_id` varchar(120) NOT NULL,
	`transaction_type` varchar(30) NOT NULL DEFAULT 'earn',
	`amount` int NOT NULL,
	`created_at` datetime(3) NOT NULL,
	CONSTRAINT `xp_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_xp_reward_idempotency` UNIQUE(`user_id`,`source_type`,`source_id`,`transaction_type`)
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`badge_id` varchar(100) NOT NULL,
	`awarded_at` datetime(3) NOT NULL,
	CONSTRAINT `user_badges_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_user_badges_user_badge` UNIQUE(`user_id`,`badge_id`)
);
--> statement-breakpoint
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attempt_answers` ADD CONSTRAINT `attempt_answers_attempt_id_quiz_attempts_id_fk` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lesson_progress` ADD CONSTRAINT `lesson_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `xp_transactions` ADD CONSTRAINT `xp_transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_badges` ADD CONSTRAINT `user_badges_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_user_sessions_user_expires` ON `user_sessions` (`user_id`,`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_quiz_attempts_user_started` ON `quiz_attempts` (`user_id`,`started_at`);--> statement-breakpoint
CREATE INDEX `idx_quiz_attempts_user_lesson_status` ON `quiz_attempts` (`user_id`,`lesson_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_xp_transactions_user_created` ON `xp_transactions` (`user_id`,`created_at`);