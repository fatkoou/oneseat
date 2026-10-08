import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seat } from '../seats/seat.entity';
import { User } from '../users/user.entity';

export type ReservationStatus = 'confirmed' | 'cancelled';

@Entity('reservations')
@Index('UQ_reservations_active_seat', ['seatId'], {
  unique: true,
  where: "status = 'confirmed'",
})
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'seat_id', type: 'uuid' })
  seatId!: string;

  @ManyToOne(() => Seat, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'seat_id' })
  seat!: Seat;

  @Column({ type: 'varchar', default: 'confirmed' })
  status!: ReservationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
