CREATE TYPE "public"."userRole" AS ENUM('ADMIN', 'BASIC');--> statement-breakpoint
CREATE TABLE "categoryTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "categoryTable_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "postCategoryTable" (
	"postId" uuid NOT NULL,
	"categoryId" uuid NOT NULL,
	CONSTRAINT "postCategoryTable_postId_categoryId_pk" PRIMARY KEY("postId","categoryId")
);
--> statement-breakpoint
CREATE TABLE "postTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"averageRating" real DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp DEFAULT now() NOT NULL,
	"authorId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userPreferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"emailUpdates" boolean DEFAULT false NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "userRole" DEFAULT 'BASIC' NOT NULL;--> statement-breakpoint
ALTER TABLE "postCategoryTable" ADD CONSTRAINT "postCategoryTable_postId_postTable_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."postTable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "postCategoryTable" ADD CONSTRAINT "postCategoryTable_categoryId_categoryTable_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categoryTable"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "postTable" ADD CONSTRAINT "postTable_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "emailIndex" ON "users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "uniqueNameAndAge" UNIQUE("name","age");