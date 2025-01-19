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

    // Function to get all tasks - by user id
    function getTasks(string memory _userId) public view returns (Task[] memory) {
        Task[] memory userTasks = new Task[](tasks.length); // Initialize with maximum possible size
        uint256 count = 0; 

        for(uint256 i = 0; i < tasks.length; i++) {
            if (keccak256(bytes(tasks[i].createdBy)) == keccak256(bytes(_userId))) { 
                userTasks[count] = tasks[i];
                count++;
            }
        }

        // Resize the array to the actual number of user tasks
        assembly {
            mstore(userTasks, count) 
        }

        return userTasks;
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

    // Function to get overdue tasks
    function getOverdueTasks() public view returns (Task[] memory) {

        Task[] memory overdueTasks = new Task[](tasks.length); // Initialize with maximum possible size
        uint256 count = 0; 

        for (uint256 i = 0; i < tasks.length; i++) {
            if (isOverdue(tasks[i].deadline)) {
                overdueTasks[count] = tasks[i];
                count++;
            }
        }

        // Resize the array to the actual number of user tasks
        assembly {
            mstore(overdueTasks, count) 
        }

        return overdueTasks;
    }

    // Function to check for an overdue task - return bool
    function isOverdue(uint256 deadline) internal view returns (bool) {
        uint256 currentDateMillis = getCurrentDateMillis(); // Get current date in milliseconds
        return deadline < currentDateMillis; // Check if the deadline has passed
    }

    // Helper function to get current date in milliseconds (without time)
    function getCurrentDateMillis() internal view returns (uint256) {
        // Get current timestamp in seconds
        uint256 timestamp = block.timestamp;

        // Calculate current date in seconds by removing time portion
        uint256 currentDayInSeconds = timestamp - (timestamp % 86400); // 86400 seconds in a day

        // Convert current date in seconds to milliseconds
        return currentDayInSeconds * 1000; 
    }
}
