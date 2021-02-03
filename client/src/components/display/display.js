import React from 'react';

export class DisplayClassRoom extends React.Component {

    constructor(props) {
        super(props)
        this.teachers = [];
        this.students = [];
    }

    render() {
        this.teachers = [];
        this.students = [];
        if (this.props.classroom.teachers) {
            this.props.classroom.teachers.forEach(element => {
                this.teachers = [...this.teachers, <h6 key={element.name}> {element.name} </h6>]
            });
        }

        if (this.props.classroom.students) {
            this.props.classroom.students.forEach(element => {
                this.students = [
                    ...this.students, <h6 key={element.name}>{element.name}</h6>
                ]
            })
        }
        return (
            <div>
                <div className="split left">
                    <center><h2>Students</h2></center>
                    {this.students}
                </div>
                <div className="split right">
                    <center><h2>Teachers</h2></center>
                    {this.teachers}
                </div>
            </div >
        )
    }
}