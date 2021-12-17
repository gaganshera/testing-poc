import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_bought_equities' })
export class UserEquities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  equity_id: string;

  @Column()
  units_bought: number;

  @ManyToOne(() => User, (user) => user.userEquities)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Promise<User>;
}
