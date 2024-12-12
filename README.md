# Dynamic Event Calendar

A feature-rich event calendar application built with modern technologies to manage and organize events seamlessly. The app provides a clean user interface and robust functionality for event management, with advanced features such as drag-and-drop scheduling and data export.

## Features

### Core Features
- **Calendar View**:
  - Displays a grid for the current month with proper alignment of days.  
  - Navigation through months using "Previous" and "Next" buttons.  
  - Highlights the current day and visually distinguishes weekends.  
 
- **Event Management**:
  - Add events by clicking on a specific day.  
  - Edit or delete events directly from the selected day.  
  - Each event includes:  
    - Event name  
    - Start and end time  
    - Optional description  

- **Event List**:  
  - View all events for a selected day in a modal.  

- **Data Persistence**:  
  - Events persist between page refreshes using **localStorage**.  

### Advanced Logic  
- Automatic handling of month transitions.  
- Prevention of overlapping events.  
- Keyword-based filtering of events.  

### Bonus Features  
- **Drag-and-Drop**:  
  - Reschedule events between days by dragging and dropping.  
- **Color-Coded Events**:  
  - Assign categories such as work, personal, or others with distinct colors.  
- **Export Events**:  
  - Export event lists for a specific month in JSON format.  

## Technologies Used  
- **Frontend**: React, Shadcn (for UI components)  
- **State Management**: Context API  
- **Deployment**: Vercel  
- **Data Storage**: LocalStorage  

## Live Demo
Check out the deployed app here: [Dynamic Event Calendar](https://dzwimj3umskmcavv.vercel.app)  

## Getting Started

### Prerequisites
- Node.js (v16 or above)
- npm

### Installation
1. Clone the repository:  git clone https://github.com/CoderSoumya007/Dynamic-Event-Calendar-Application.git  

Navigate to the project directory:cd my-app  
Install dependencies:npm install  

Running the App Locally  
Start the development server: npm run dev  


Open your browser and navigate to:http://localhost:3000  
