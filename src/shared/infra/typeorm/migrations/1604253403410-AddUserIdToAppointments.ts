import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AddUserIdToAppointments1604253403410 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'user_id',
            type: 'uuid',
            isNullable: true
        })
        )

        await queryRunner.createForeignKey('appointments', new TableForeignKey({
            name: 'AppointmentUser', //name da FK
            columnNames: ['user_id'], //campo nessa tabela
            referencedColumnNames: ['id'], //campo da outra tabela
            referencedTableName: 'users', //nome da outra tabela
            onDelete: 'SET NULL',  //restricted, não deixa o user ser apagado. - set null, seta o campo como null - cascade: deletou o usuario deleta todos os agendamentos que ele ta associado
            onUpdate: 'CASCADE',
        }) )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider')

        await queryRunner.dropColumn('appointments', 'user_id')



    }

}
