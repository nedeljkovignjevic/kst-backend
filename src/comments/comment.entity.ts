import { Gallery } from "../galleries/gallery.entity";
import { User } from "../users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, length: 1000})
    text: string;
    
    @Column({ type: 'boolean', default: 1 })
    isActive: boolean;
  
    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @ManyToOne(() => Gallery, (gallery) => gallery.comments)
    gallery: Gallery

    @ManyToOne(() => User, (author) => author.comments)
    author: User
}