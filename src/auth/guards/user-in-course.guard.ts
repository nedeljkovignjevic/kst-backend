import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/user.entity';
import { Role } from '../roles/role.enum';
import { CoursesService } from 'src/courses/courses.service';
import { ROLES_KEY } from '../roles/roles.decorator';
import { audit } from 'rxjs';


@Injectable()
export class UserInCourse implements CanActivate {

    constructor(
        private reflector: Reflector,
        private coursesService: CoursesService,
        ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user as User;
        const courseId = request.params.id;

        if (user.roles.includes(Role.Admin)) {
            return true;
        }

        if (user.roles.includes(Role.Student)) {
            const course = await this.coursesService.findCourseByIdWithStudents(courseId);
            const studentIds = course.students.map(s => s.id);
            return studentIds.includes(user.id);
        }

        if (user.roles.includes(Role.Student)) {
            const course = await this.coursesService.findCourseByIdWithProfessors(courseId);
            const professorIds = course.professors.map(p => p.id);
            return professorIds.includes(user.id);
        }

    }
}
