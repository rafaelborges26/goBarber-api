import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export default class AlterProviderToProviderId1595824272985 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('appointments', 'provider')
        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'provider_id',
            type: 'uuid',
            isNullable: true
        })
        )

        await queryRunner.createForeignKey('appointments', new TableForeignKey({
            name: 'AppointmentProvider', //name da FK
            columnNames: ['provider_id'], //campo nessa tabela
            referencedColumnNames: ['id'], //campo da outra tabela
            referencedTableName: 'users', //nome da outra tabela
            onDelete: 'SET NULL',  //restricted, não deixa o user ser apagado. - set null, seta o campo como null - cascade: deletou o usuario deleta todos os agendamentos que ele ta associado
            onUpdate: 'CASCADE',
        }) )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider')

        await queryRunner.dropColumn('appointments', 'provider_id')

        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'provider',
            type: 'varchar'
        })
        )


    }

}
