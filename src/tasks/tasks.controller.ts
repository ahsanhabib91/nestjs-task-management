import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { GetUser } from '../auth/get-user.decorator';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
		this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
		return this.tasksService.getTasks(filterDto, user);
	}
	
	@Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id:number, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

	@Post()
	@UsePipes(ValidationPipe) // ValidationPipe will validate DTO against the rules defined in DTO
    createTask(@Body() createTaskDto:CreateTaskDto, @GetUser() user: User): Promise<Task> {
		this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
	}
	
	@Delete('/:id')
    deleteTask(@Param('id') id: number, @GetUser() user: User):Promise<void> {
        return this.tasksService.deleteTask(id, user);
	}
	
	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id', ParseIntPipe) id: number, 
		@Body('status', TaskStatusValidationPipe) status: TaskStatus,
		@GetUser() user: User
	): Promise<Task> {
		return this.tasksService.updateTaskStatus(id, status, user);
	}

    // @Post()
    // createTask(
    //     @Body() body, 
    //     @Body('title') title, 
    //     @Body('description') description): Task {
    //     console.log('body', body);
    //     console.log('title', title, 'description', description);
    //     return this.taskService.createTask(title, description);
    // }
}
