import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryCreate1732818746233 implements MigrationInterface {
    name = 'CategoryCreate1732818746233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "image_url" character varying NOT NULL DEFAULT '', "role" character varying NOT NULL DEFAULT 'user', "refreshToken" character varying DEFAULT '', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "category" character varying NOT NULL, "short_name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "image_url" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL, "slug" character varying NOT NULL, "sold_count" integer NOT NULL DEFAULT '0', "categoryId" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "basket" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_26dcb999420495bb5b14a4f8d1" UNIQUE ("userId"), CONSTRAINT "PK_895e6f44b73a72425e434a614cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "basket_products" ("id" SERIAL NOT NULL, "basketIdId" integer, "productIdId" integer, CONSTRAINT "PK_b6245f9f34546a14637d4deb7e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "basket" ADD CONSTRAINT "FK_26dcb999420495bb5b14a4f8d1c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "basket_products" ADD CONSTRAINT "FK_2bc7bf1cd6e02ee2db2be39de93" FOREIGN KEY ("basketIdId") REFERENCES "basket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "basket_products" ADD CONSTRAINT "FK_ed48e520f8a04c01ffc3e350fdd" FOREIGN KEY ("productIdId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "basket_products" DROP CONSTRAINT "FK_ed48e520f8a04c01ffc3e350fdd"`);
        await queryRunner.query(`ALTER TABLE "basket_products" DROP CONSTRAINT "FK_2bc7bf1cd6e02ee2db2be39de93"`);
        await queryRunner.query(`ALTER TABLE "basket" DROP CONSTRAINT "FK_26dcb999420495bb5b14a4f8d1c"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
        await queryRunner.query(`DROP TABLE "basket_products"`);
        await queryRunner.query(`DROP TABLE "basket"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
