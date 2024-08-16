CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "login" varchar,
  "email" varchar,
  "created_at" timestamp,
  "password" varchar,
  "isDeleted" bool
);

CREATE TABLE "columns" (
  "id" uuid PRIMARY KEY,
  "userId" uuid,
  "name" varchar,
  "description" varchar,
  "created_at" timestamp,
  "isDeleted" bool
);

CREATE TABLE "cards" (
  "id" uuid PRIMARY KEY,
  "columnId" uuid,
  "name" varchar,
  "userId" uuid,
  "description" varchar,
  "createdAt" varchar,
  "isDeleted" bool
);

CREATE TABLE "comments" (
  "id" uuid PRIMARY KEY,
  "cardId" uuid,
  "text" varchar,
  "userId" uuid,
  "createdAt" varchar,
  "isDeleted" bool
);

ALTER TABLE "columns" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "cards" ADD FOREIGN KEY ("columnId") REFERENCES "columns" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("cardId") REFERENCES "cards" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "cards" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");
