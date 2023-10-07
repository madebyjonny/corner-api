CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"first_name" varchar(256),
	"last_name" varchar(256),
	"email" varchar(256),
	"hash" varchar(256),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
