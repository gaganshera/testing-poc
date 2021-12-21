import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserEquities } from './user_equity.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  funds: number;
}
