import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Event } from '../events/event.entity';

@Entity('seats')
@Unique('UQ_seats_identity', ['eventId', 'section', 'rowLabel', 'number'])
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId!: string;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Column()
  section!: string;

  @Column({ name: 'row_label' })
  rowLabel!: string;

  @Column({ type: 'int' })
  number!: number;
}
