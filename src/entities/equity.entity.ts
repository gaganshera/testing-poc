import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Equity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  cost: number;

  @Column({ default: 0 })
  units: number;
}
