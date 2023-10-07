CREATE TABLE IF NOT EXISTS "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"user_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
