// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoContract {
    struct Task {
        uint256 id;
        string title;
        string description;
        string status;
        string priority;
        uint256 deadline;
        string createdBy;
    }

    Task[] private tasks; // Array to store tasks
    uint256 private taskCounter = 1; // Counter to generate unique IDs

    // Events
    event TaskAdded(
        uint256 id,
        string title,
        string description,
        string status,
        string priority,
        uint256 deadline,
        string createdBy
    );
    event TaskDeleted(uint256 id);
    event AllTasksCleared();

    // Function to add a new task
    function addTask(
        string memory _title,
        string memory _description,
        string memory _status,
        string memory _priority,
        uint256 _deadline,
        string memory _createdBy
    ) public {
        tasks.push(
            Task(
                taskCounter,
                _title,
                _description,
                _status,
                _priority,
                _deadline,
                _createdBy
            )
        );
        emit TaskAdded(taskCounter, _title, _description, _status, _priority, _deadline, _createdBy);
        taskCounter++;
    }

    // Function to get all tasks
    function getTasks() public view returns (Task[] memory) {
        return tasks;
    }

    // Function to get a task by ID
    function getTaskById(uint256 _id) public view returns (Task memory) {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                return tasks[i];
            }
        }
        revert("Task not found");
    }

    // Function to update the status of a task
    function updateTaskStatus(uint256 _id, string memory _newStatus) public {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i].status = _newStatus;
                return;
            }
        }
        revert("Task not found");
    }

    // Function to update a task's details
    function updateTask(
        uint256 _id,
        string memory _title,
        string memory _description,
        string memory _status,
        string memory _priority,
        uint256 _deadline
    ) public {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i].title = _title;
                tasks[i].description = _description;
                tasks[i].status = _status;
                tasks[i].priority = _priority;
                tasks[i].deadline = _deadline;
                return;
            }
        }
        revert("Task not found");
    }

    // Function to delete a task by ID
    function deleteTask(uint256 _id) public {
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].id == _id) {
                tasks[i] = tasks[tasks.length - 1]; // Replace with last task
                tasks.pop(); // Remove the last element
                emit TaskDeleted(_id);
                return;
            }
        }
        revert("Task not found");
    }

    // Function to clear all tasks
    function clearTasks() public {
        delete tasks; // Delete all elements in the array
        emit AllTasksCleared();
    }
}
