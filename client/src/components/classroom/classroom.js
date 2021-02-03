import React from 'react';
import { Student } from '../student/student';
import { Teacher } from '../teacher/teacher';
import { io } from 'socket.io-client';

// const socket = io("http://localhost:3001", {
//     reconnectionDelayMax: 10000
// });


// socket.on('closeConnection', (data) => {
//     console.log("close connection");
//     socket.disconnect(true);
// });

export class Classroom extends React.Component {

    constructor(props) {
        super(props);
        this.student = this.student.bind(this);
        this.teacher = this.teacher.bind(this);

        this.socket = io("http://localhost:3001", {
            reconnectionDelayMax: 10000
        });

        this.state = {
            studentComponent: false,
            teacherComponent: false,
            classroomDetails: {}
        }

        this.socketListeners();

    }

    socketListeners() {
        this.socket.on('closeConnection', (data) => {
            console.log("close connection");
            this.setState({
                isClassEnded: true
            });
            console.log("updated isClassEnded ", this.state.isClassEnded);
            this.socket.disconnect(true);
        });

        this.socket.on('displayData', (data) => {

            this.setState({
                classroomDetails: data
            })
        });
    }
    render() {

        if (!this.state.studentComponent && !this.state.teacherComponent) {
            return (
                <div>
                    <center><h1>Classroom</h1></center>
                    <button className="button" onClick={this.student}> Student</button>
                    <button className="button" onClick={this.teacher}> Teacher</button>
                </div>
            )
        } else if (this.state.studentComponent) {
            return (
                <div>
                    <Student isClassStarted={this.state.isClassStarted} isClassEnded={this.state.isClassEnded} classroomDetails={this.state.classroomDetails} />
                </div>
            )
        } else if (this.state.teacherComponent) {
            return (
                <div>
                    <Teacher socket={this.socket} classroomDetails={this.state.classroomDetails} />
                </div>
            )
        }
    }

    student() {

        this.setState({
            studentComponent: true,
            teacherComponent: false
        });

        this.socket.emit('joinClassRoom',
            { id: this.socket.id, className: 'classA' }, (isAvailable) => {
                this.setState({
                    isClassStarted: isAvailable
                });
            });
    }

    teacher() {

        this.setState({
            studentComponent: false,
            teacherComponent: true
        });
    }
}
