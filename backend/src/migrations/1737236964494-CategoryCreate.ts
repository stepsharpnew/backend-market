import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryCreate1737236964494 implements MigrationInterface {
    name = 'CategoryCreate1737236964494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "basket_products" ("id" SERIAL NOT NULL, "count" integer DEFAULT '1', "userId" integer, "productsId" integer, CONSTRAINT "PK_b6245f9f34546a14637d4deb7e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "category" character varying NOT NULL, "image_url" character varying NOT NULL, "short_name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "image_url" character varying NOT NULL DEFAULT 'https://storage.yandexcloud.net/step2002sharp/nofoto2.jpg', "description" character varying NOT NULL, "slug" character varying NOT NULL, "saleBool" boolean NOT NULL DEFAULT false, "sale" integer DEFAULT '0', "sold_count" integer NOT NULL DEFAULT '0', "categoryId" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorites" ("id" SERIAL NOT NULL, "productList" text DEFAULT '[]', "userId" integer, CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "image_url" character varying NOT NULL DEFAULT 'https://storage.yandexcloud.net/step2002sharp/none-profile.png', "role" character varying NOT NULL DEFAULT 'user', "single_password" character varying DEFAULT 'user', "telegram" character varying, "refreshToken" character varying DEFAULT '', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "zakaz_entity" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "productList" text NOT NULL, "userId" integer, CONSTRAINT "PK_7d35433d68b7a559064a8a6ecb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "basket_products" ADD CONSTRAINT "FK_e6c1959104a7d0a1afdb1e7cb7d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "basket_products" ADD CONSTRAINT "FK_f754c1d54d4f3e33c245752326b" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_e747534006c6e3c2f09939da60f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "zakaz_entity" ADD CONSTRAINT "FK_fdb5498c09671241dfd7cba9820" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "zakaz_entity" DROP CONSTRAINT "FK_fdb5498c09671241dfd7cba9820"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_e747534006c6e3c2f09939da60f"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`ALTER TABLE "basket_products" DROP CONSTRAINT "FK_f754c1d54d4f3e33c245752326b"`);
        await queryRunner.query(`ALTER TABLE "basket_products" DROP CONSTRAINT "FK_e6c1959104a7d0a1afdb1e7cb7d"`);
        await queryRunner.query(`DROP TABLE "zakaz_entity"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "basket_products"`);
    }

}
