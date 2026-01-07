PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`fromAccountId` text NOT NULL,
	`toAccountId` text,
	`categoryId` text,
	`necessity` text,
	`amount` integer NOT NULL,
	`type` text NOT NULL,
	`date` integer NOT NULL,
	`description` text,
	FOREIGN KEY (`fromAccountId`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`toAccountId`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "fromAccountId", "toAccountId", "categoryId", "necessity", "amount", "type", "date", "description") SELECT "id", "fromAccountId", "toAccountId", "categoryId", "necessity", "amount", "type", "date", "description" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;