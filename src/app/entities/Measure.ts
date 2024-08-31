import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('measures')
class Measure {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('uuid')
    uuid: string

    @Column('datetime', { default:  () => "NOW()"})
    measured_datetime: Date

    @Column('varchar', { length: 50, nullable: false})
    measure_type: string

    @Column('boolean', { nullable: false, default: false})
    has_confirmed: boolean

    @Column('varchar', { length: 255, nullable: false})
    image_url: string

    @Column('varchar', { length: 50, nullable: false})
    customer_code: string
}

export default Measure