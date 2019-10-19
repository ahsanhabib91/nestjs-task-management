import { Injectable, NotFoundException } from '@nestjs/common';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {

	constructor(
		@InjectRepository(TaskRepository)
		private taskRepository: TaskRepository
	) {}

	getTasks (filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
		return this.taskRepository.getTasks(filterDto, user);
	}
	
	async getTaskById(id: number, user: User): Promise<Task> {
		const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
		if(!found) {
			throw new NotFoundException(`Task not found with id ${id}`);
		}
		return found;
	}

	createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
		return this.taskRepository.createTask(createTaskDto, user);
	}


	async deleteTask(id: number, user: User): Promise<void> {
		const result = await this.taskRepository.delete({ id, userId: user.id });

		if (result.affected === 0) {
			throw new NotFoundException(`Task not found with id ${id}`);
		}
	}

	async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
		const task = await this.getTaskById(id, user);
		console.log(task);
		task.status = status;
		await task.save();
		return task;
	}
}
