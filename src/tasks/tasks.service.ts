import { Injectable, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {

	constructor(
		@InjectRepository(TaskRepository)
		private taskRepository: TaskRepository
	) {}

	getTasks (filterDto: GetTasksFilterDto): Promise<Task[]> {
		return this.taskRepository.getTasks(filterDto);
	}

    // private tasks: Task[] = [];

    // getAllTasks(): Task[] {
    //     return this.tasks;
	// }

	// getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
	// 	const { status, search } = filterDto;
	// 	let tasks = this.getAllTasks();
	
	// 	if (status) {
	// 	  tasks = tasks.filter(task => task.status === status);
	// 	}
	
	// 	if (search) {
	// 	  tasks = tasks.filter(task =>
	// 		task.title.includes(search) ||
	// 		task.description.includes(search),
	// 	  );
	// 	}
	
	// 	return tasks;
	//   }
	
	async getTaskById(id: number): Promise<Task> {
		const found = await this.taskRepository.findOne(id);
		if(!found) {
			throw new NotFoundException(`Task not found with id ${id}`);
		}
		return found;
	}
	// getTaskById(id: string): Task {
	// 	const found = this.tasks.find(task => task.id === id);
	// 	if(!found) {
	// 		throw new NotFoundException(`Task not found with id ${id}`);
	// 	}
	// 	return found;
	// }

	createTask(createTaskDto: CreateTaskDto): Promise<Task> {
		return this.taskRepository.createTask(createTaskDto);
	}

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     }
    //     this.tasks.push(task);
    //     return task;
	// }


	async deleteTask(id: string): Promise<void> {
		const result = await this.taskRepository.delete(id);
		console.log(result);
		if (result.affected === 0) {
			throw new NotFoundException(`Task not found with id ${id}`);
		}
	}
	// deleteTask(id: string): void {
	// 	const found = this.getTaskById(id);
	// 	this.tasks = this.tasks.filter(task => task.id !== found.id);
	// }

	async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
		const task = await this.getTaskById(id);
		console.log(task);
		task.status = status;
		await task.save();
		return task;
	}
	// updateTaskStatus(id: string, status: TaskStatus): Task {
	// 	const task = this.getTaskById(id);
	// 	console.log(task);
	// 	task.status = status;
	// 	return task;
	// }
}
