import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764350041950 implements MigrationInterface {
  name = 'Migration1764350041950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "author_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")); COMMENT ON COLUMN "post"."id" IS 'Идентификатор статьи'; COMMENT ON COLUMN "post"."title" IS 'Название статьи'; COMMENT ON COLUMN "post"."description" IS 'Описание статьи'; COMMENT ON COLUMN "post"."author_id" IS 'Идентификатор автора статьи'; COMMENT ON COLUMN "post"."created_at" IS 'Дата создания записи / Дата публикации статьи'; COMMENT ON COLUMN "post"."updated_at" IS 'Дата последнего обновления записи'`,
    );
    await queryRunner.query(`COMMENT ON TABLE "post" IS 'Статья'`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "middle_name" character varying, "hashed_password" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")); COMMENT ON COLUMN "user"."id" IS 'Идентификатор записи пользователя'; COMMENT ON COLUMN "user"."first_name" IS 'Имя пользователя'; COMMENT ON COLUMN "user"."last_name" IS 'Фамилия пользователя'; COMMENT ON COLUMN "user"."middle_name" IS 'Отчество пользователя'; COMMENT ON COLUMN "user"."hashed_password" IS 'Хэшированный пароль пользователя'; COMMENT ON COLUMN "user"."email" IS 'E-mail пользователя'; COMMENT ON COLUMN "user"."created_at" IS 'Дата создания записи'; COMMENT ON COLUMN "user"."updated_at" IS 'Дата последнего обновления записи'`,
    );
    await queryRunner.query(`COMMENT ON TABLE "user" IS 'Пользователь'`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62"`,
    );
    await queryRunner.query(`COMMENT ON TABLE "user" IS NULL`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`COMMENT ON TABLE "post" IS NULL`);
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
