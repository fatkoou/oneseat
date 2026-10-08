import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReservationsTable1791501314627 implements MigrationInterface {
  name = 'CreateReservationsTable1791501314627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reservations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "seat_id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'confirmed', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_reservations_active_seat" ON "reservations"  ("seat_id") WHERE status = 'confirmed'`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_4af5055a871c46d011345a255a6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_9de00b2fb6ea7532d17367d0810" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_9de00b2fb6ea7532d17367d0810"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_4af5055a871c46d011345a255a6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."UQ_reservations_active_seat"`,
    );
    await queryRunner.query(`DROP TABLE "reservations"`);
  }
}
