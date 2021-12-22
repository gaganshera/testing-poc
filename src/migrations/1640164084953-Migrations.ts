import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1640164084953 implements MigrationInterface {
  name = 'Migrations1640164084953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`equity\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`cost\` int NOT NULL DEFAULT '0', \`units\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_bought_equities\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`equity_id\` varchar(255) NOT NULL, \`units_bought\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`funds\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`user_bought_equities\``);
    await queryRunner.query(`DROP TABLE \`equity\``);
  }
}
