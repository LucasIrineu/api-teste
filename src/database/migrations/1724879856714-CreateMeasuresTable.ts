import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMeasuresTable1724879856714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'measures',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'uuid',
                        type: 'varchar',
                        length: '55',
                        isNullable: false,
                    },
                    {
                        name: 'measured_datetime',
                        type: 'datetime',
                        default: 'now()',
                    },
                    {
                        name: 'measure_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'has_confirmed',
                        type: 'boolean',
                        isNullable: false,
                        default: false,
                    },
                    {
                        name: 'image_url',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'customer_code',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('measures')
    }

}
