import React from 'react';
import './App.css';
import Search from './Search';


const data = [
  {
    id: 1,
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
    author: "Maximilian Schwarzmülller",
    hours_video: 40.5,
    number_of_lectures: 490,
    rating: 4.6,
    url: "https://codingthesmartway.com/courses/react-complete-guide/"
  },
  {
    id: 2,
    title: "Modern React with Redux",
    author: "Stephen Grider",
    hours_video: 47.5,
    number_of_lectures: 488,
    rating: 4.6,
    url: "https://codingthesmartway.com/courses/modern-react-with-redux/"
  },
  {
    id: 3,
    title: "The Complete React Developer Course (w/ Hooks and Redux)",
    author: "Andrew Mead",
    hours_video: 39,
    number_of_lectures: 200,
    rating: 4.7,
    url: "http://codingthesmartway.net/courses/complete-react-web-app-developer/"
  }
];

const coursesReducer = (state, action) => {
  switch(action.type) {
    case 'SET_COURSES':
      return action.payload;
    case 'REMOVE_COURSE':
      return state.filter(
        course => action.payload.id !== course.id
      );
    default:
      throw new Error();
  }
};

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [courses_list, dispatchCourses] = React.useReducer(coursesReducer, []);

  const getCoursesAsync = () => 
    new Promise(resolve =>
      setTimeout(
        () => resolve({courses: data}),2000
      )
    );

  const [searchText, setSearchText] = React.useState(
    localStorage.getItem('searchText') || ''
  );

  const handleSearch = event => {
    setSearchText(event.target.value);
  }

  const handleRemoveCourse = course => {
    dispatchCourses({
      type: 'REMOVE_COURSE',
      payload: course
    });
  }

  React.useEffect( () => {
    localStorage.setItem('searchText', searchText);
  }, [searchText]);

  React.useEffect(() => {
    setIsLoading(true);
    getCoursesAsync().then(result => {
      dispatchCourses({
        type: 'SET_COURSES', 
        payload: result.courses
      });
      setIsLoading(false);
    });
  }, []);

  const filteredCourses = courses_list.filter(course => {
    return course.title.toLowerCase().includes(searchText.toLowerCase()) || course.author.toLowerCase().includes(searchText.toLowerCase());
  });

  const CoursesList = ({courses}) => {
    return (
      courses.map(course => {
        return (
        <div key={course.id}>
          <span>
            <a href={course.url}><h4>{course.title}</h4></a>
          </span>
          <span>by <strong>{course.author}</strong></span>
          <span> | Video Hours: {course.hours_video}</span>
          <span> | Number of Lectures: {course.number_of_lectures}</span>
          <span> | Rating: {course.rating}</span>
          &nbsp;
          <span>
              <button type="button" onClick={() => handleRemoveCourse(course)}>
                Remove
              </button>
            </span>
          <br/><br/>
        </div>);
      })
    )
  }
  
  return (
    <div>
      <h1>List of Courses</h1>
      <hr/>

      <Search value={searchText} onSearch={handleSearch} />

      {isLoading ? (
        <p>Loading Courses ...</p>
      ) : (
        <CoursesList courses={filteredCourses} handleRemoveCourse={handleRemoveCourse}/>
      )}

    </div>
  );
}



export default App;
