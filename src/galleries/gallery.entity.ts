import { User } from "src/users/user.entity";
import { Comment } from "src/comments/comment.entity";

import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gallery {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;
    
    @Column({ length: 1000 })
    description: string;
    
    @Column({ type: 'boolean', default: 1 })
    isActive: boolean;

    @Column()
    createdById: number;
  
    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.galleries)
    author: User

    @OneToMany(type => Comment, comment => comment.gallery)
    comments: Comment[];
}