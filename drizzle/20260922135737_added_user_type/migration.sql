CREATE TYPE "accountType" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "account_type" "accountType" DEFAULT 'user'::"accountType" NOT NULL;