export default{
  firstName: 'James',
  lastName: 'Carter',
  jobTitle: 'full stack developer',
  address: '525 N Tryon Street, NC 28117',
  phone: '1234567890',
  email: 'example@gmail.com',
  themeColor: '#ff6666',
  summery: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',

  experience: [
    {
      id: 1,
      title: 'Full Stack Developer',
      companyName: 'Amazon',
      city: 'New York',
      state: 'NY',
      startDate: 'Jan 2021',
      endDate: '',
      currentlyWorking: true,
      workSummery: 'Designed, developed, and maintained full-stack applications.\n• Implemented responsive user interfaces with React for various devices and browsers.\n• Maintaining the React Native in-house organization app.\n• Created RESTful APIs with Node.js and Express, facilitating seamless communication between front-end and back-end systems.' 
    }
  ],

  education: [
    {
      id: 1,
      universityName: 'Western Illinois University',
      startDate: 'Aug 2018',
      endDate: 'Dec 2019',
      degree: 'Master',
      major: 'Computer Science',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      id: 2,
      universityName: 'Western University',
      startDate: 'Aug 2010',
      endDate: 'Dec 2011',
      degree: 'diploma',
      major: 'Computer Science',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
  ],

  skills: [
    {
      id: 1,
      name: 'Angular',
      rating: 80
    },
    {
      id: 2,
      name: 'React',
      rating: 100
    }
  ]
}