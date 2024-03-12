import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from 'class-validator';


export class StudentTest {
    
    // @IsNumber()
    // id: number;


    // @ManyToOne(() => User, (user) => user.tests)
    // student: User

    // @ManyToOne(() => Test, (test) => test.studentTests)
    // test: Test

    // @OneToMany(type => StudentAnswer, studentAnswer => studentAnswer.studentTest, { cascade: true })
    // studentAnswers: StudentAnswer[];

    // @CreateDateColumn({
    //     type: 'timestamp',
    //     default: () => 'CURRENT_TIMESTAMP(6)',
    // })
    // startTime: Date;

    // @CreateDateColumn({
    //     type: 'timestamp',
    //     default: () => 'CURRENT_TIMESTAMP(6)',
    // })
    // endTime: Date;



    // @IsString()
    // @IsNotEmpty()
    // title: string;

    // @IsNotEmpty()
    // studentAnswers: CreateStudentAnswerRequest[];

    // @IsNumber()
    // @IsNotEmpty()
    // test_id: number;
}
