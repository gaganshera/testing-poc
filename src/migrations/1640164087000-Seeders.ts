import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeders1640164087000 implements MigrationInterface {
  name = 'Seeders1640164087000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO `equity` (`id`, `name`, `cost`, `units`) VALUES ('eeef4fbe-d836-4336-98e7-be131c3455ee', 'Equity 1', 120, 110), ('65a16a9e-297a-4ac3-9fe5-551f098183d5', 'Equity 2', 8, 30), ('804cc263-c37c-4851-befc-c32da1bc30fe', 'Equity 3', 100, 97), ('fc4e62b6-db1d-4f8b-bdd6-6d4067b0f9b9', 'Equity 4', 10, 330), ('bdc9ce40-d2b4-4fbb-9f6b-2a66c89fc697', 'Equity 5', 13, 120), ('f5da735d-8c42-49a8-bb89-e61eac068bce', 'Equity 6', 16, 620);",
    );
    await queryRunner.query(
      "INSERT INTO `user` (`id`, `name`, `funds`) VALUES ('fdad5b6f-9890-49aa-aba7-a8228508f582', 'User 1', 19200), ('411f2bdd-b96a-4aee-81c5-cfe6e2cf4fd6', 'User 2', 340), ('54e237f4-7a0c-43fa-9158-d3bf6d6c224b', 'User 3', 220), ('204cb644-697a-4a2b-b907-8145ed3f01eb', 'User 4', 200), ('3f00b831-97e4-420e-b77b-8fa0ef96844b', 'User 4', 200), ('987e5cbe-6cef-45ae-adc3-fd97df3a94d5', 'User 5', 2020), ('71577d5d-9827-4c7b-b139-634ebc4b7a2a', 'User 6', 206);",
    );
    await queryRunner.query(
      "INSERT INTO `user_bought_equities` (`id`, `user_id`, `equity_id`, `units_bought`) VALUES ('1d61819e-7202-4cfa-ae34-5ea4cbc20c94', '987e5cbe-6cef-45ae-adc3-fd97df3a94d5', 'f5da735d-8c42-49a8-bb89-e61eac068bce', 0), ('3092a678-ba1e-4d4f-a229-9cfee8c5e83b', '204cb644-697a-4a2b-b907-8145ed3f01eb', 'fc4e62b6-db1d-4f8b-bdd6-6d4067b0f9b9', 0), ('88ac85b0-f2b6-40af-8bc7-90db1364af8a', '54e237f4-7a0c-43fa-9158-d3bf6d6c224b', '804cc263-c37c-4851-befc-c32da1bc30fe', 1), ('bd1370cb-0e66-4a59-b7c1-58cf0a717813', '411f2bdd-b96a-4aee-81c5-cfe6e2cf4fd6', 'eeef4fbe-d836-4336-98e7-be131c3455ee', 0), ('c080eda3-50a9-4284-965e-04e3d97094e0', 'fdad5b6f-9890-49aa-aba7-a8228508f582', 'eeef4fbe-d836-4336-98e7-be131c3455ee', 90), ('c8492ab5-dcc6-42bf-9afd-eb7b434a4da8', '411f2bdd-b96a-4aee-81c5-cfe6e2cf4fd6', '804cc263-c37c-4851-befc-c32da1bc30fe', 2);",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE `user`');
    await queryRunner.query('TRUNCATE TABLE `equity`');
    await queryRunner.query('TRUNCATE TABLE `user_bought_equities`');
  }
}
