import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSeatsTable1791499830507 implements MigrationInterface {
  name = 'CreateSeatsTable1791499830507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "seats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid NOT NULL, "section" character varying NOT NULL, "row_label" character varying NOT NULL, "number" integer NOT NULL, CONSTRAINT "UQ_seats_identity" UNIQUE ("event_id", "section", "row_label", "number"), CONSTRAINT "PK_3fbc74bb4638600c506dcb777a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "seats" ADD CONSTRAINT "FK_a71d9b311f8ba4a8f95ac6176e2" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seats" DROP CONSTRAINT "FK_a71d9b311f8ba4a8f95ac6176e2"`,
    );
    await queryRunner.query(`DROP TABLE "seats"`);
  }
}
