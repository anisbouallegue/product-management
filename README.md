### Prerequisites
- Node.js v20.18.0 (or other dependencies)
- npm v10.9.0 (or other dependencies)
- Postgres v17.5 (or other dependencies)

### Backend Setup
- cd backend
- npm install
- npm start
  
### Frontend Setup
- cd frontend
- npm install
- npm start

### Database Schema (PostgreSQL)
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "name" varchar NOT NULL,
  "role" varchar NOT NULL DEFAULT 'seller',
  "refresh_token" varchar,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "businesses" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" text,
  "owner_id" integer NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "slug" varchar UNIQUE NOT NULL,
  "description" text,
  "category" varchar NOT NULL,
  "subcategory" varchar,
  "price" decimal NOT NULL,
  "discount" decimal DEFAULT 0,
  "stock" integer NOT NULL DEFAULT 0,
  "rating" decimal DEFAULT 0,
  "business_id" integer NOT NULL,
  "promoted" boolean DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "product_media" (
  "id" SERIAL PRIMARY KEY,
  "product_id" integer NOT NULL,
  "image_url" varchar NOT NULL,
  "is_3d_model" boolean DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "variants" (
  "id" SERIAL PRIMARY KEY,
  "product_id" integer NOT NULL,
  "name" varchar NOT NULL,
  "price" decimal,
  "stock" integer,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "reviews" (
  "id" SERIAL PRIMARY KEY,
  "product_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "rating" integer NOT NULL,
  "comment" text,
  "helpful_votes" integer DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "review_photos" (
  "id" SERIAL PRIMARY KEY,
  "review_id" integer NOT NULL,
  "photo_url" varchar NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "tags" (
  "id" SERIAL PRIMARY KEY,
  "product_id" integer NOT NULL,
  "name" varchar NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "stock_history" (
  "id" SERIAL PRIMARY KEY,
  "product_id" integer NOT NULL,
  "variant_id" integer,
  "old_stock" integer NOT NULL,
  "new_stock" integer NOT NULL,
  "changed_by" integer NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

ALTER TABLE "businesses" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id");
ALTER TABLE "products" ADD FOREIGN KEY ("business_id") REFERENCES "businesses" ("id");
ALTER TABLE "product_media" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE;
ALTER TABLE "variants" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE;
ALTER TABLE "reviews" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE;
ALTER TABLE "reviews" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "review_photos" ADD FOREIGN KEY ("review_id") REFERENCES "reviews" ("id") ON DELETE CASCADE;
ALTER TABLE "tags" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE;
ALTER TABLE "stock_history" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE;
ALTER TABLE "stock_history" ADD FOREIGN KEY ("variant_id") REFERENCES "variants" ("id") ON DELETE SET NULL;
ALTER TABLE "stock_history" ADD FOREIGN KEY ("changed_by") REFERENCES "users" ("id");

### API Documentation

The API is documented with Swagger. After starting the backend server:
- Access Swagger  at: `http://localhost:5000/api`

For quick testing import the provided `postman_collection.json` into Postman.
