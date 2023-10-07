ALTER TABLE "refresh_tokens" ADD COLUMN "token" varchar(256);--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP COLUMN IF EXISTS "created_at";