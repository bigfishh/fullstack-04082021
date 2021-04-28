import Header from './Header'
import Content from './Content';

function Course({ courses }) {

    // const Total = (props) => {
    //     const totalExercises = props.parts.reduce((total, {exercises}) => total + exercises, 0)
      
    //     return (
    //       <p>Number of exercises: {totalExercises}</p>
    //     )
    //   }

    const renderCourse = () => {
        return courses.map((course) => {
            const total = course.parts.reduce((sum, { exercises }) => {
                return sum + exercises
            }, 0)
            return (
                <div>
                    <Header key={course.id} course={course} />
                    <Content parts={course.parts}/>
                    <strong>total of {total} exercises</strong>
                </div>
            )
        })
    }

    return (
        <div>
            {renderCourse()}
        </div>
    )
}

export default Course