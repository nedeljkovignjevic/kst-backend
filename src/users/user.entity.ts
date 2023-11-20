import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../auth/roles/role.enum";
import { Gallery } from "src/galleries/gallery.entity";
import { Comment } from "src/comments/comment.entity";

import { IsEnum } from "class-validator";

@Entity({name: "users"})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    firstname: string;
    
    @Column({ nullable: false })
    lastname: string;
    
    @Column({ unique: true })
    email: string;
    
    @Column({ nullable: false })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    @IsEnum(Role, { each: true })     
    roles: Role[];

    @Column({ type: 'boolean', default: 1 })
    isActive: boolean;

    @OneToMany(type => Gallery, gallery => gallery.author)
    galleries: Gallery[];

    @OneToMany(type => Comment, comment => comment.author)
    comments: Comment[];

}

