import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getAllTasks(): Task[] {
        return this.taskService.getAllTasks();
    }

    @Post()
    createTask(
        @Body() body, 
        @Body('title') title, 
        @Body('description') description): Task {
        console.log('body', body);
        console.log('title', title, 'description', description);
        return this.taskService.createTask(title, description);
    }
}
